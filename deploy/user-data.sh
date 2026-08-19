#!/bin/bash
# User data para la instancia EC2 (Ubuntu 24.04 LTS).
# Deja lista la máquina para servir la guía completa:
#   - nginx sirviendo el build estático en /var/www/guia-jc
#   - proxy de /api hacia el backend Node en 127.0.0.1:3000
#   - Node.js 22 y MongoDB 8 (escuchando solo en localhost)
#   - 2 GB de swap: en una t3.micro (1 GB de RAM) Mongo + Node no caben sin ella
set -euxo pipefail

export DEBIAN_FRONTEND=noninteractive

# ── swap ──────────────────────────────────────────────────────────────────
if [ ! -f /swapfile ]; then
  fallocate -l 2G /swapfile
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  echo '/swapfile none swap sw 0 0' >> /etc/fstab
fi

apt-get update -y
apt-get install -y nginx rsync curl gnupg ca-certificates ufw

# ── Node.js 22 ────────────────────────────────────────────────────────────
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt-get install -y nodejs

# ── MongoDB 8 ─────────────────────────────────────────────────────────────
curl -fsSL https://www.mongodb.org/static/pgp/server-8.0.asc \
  | gpg --dearmor -o /usr/share/keyrings/mongodb-server-8.0.gpg
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-8.0.gpg ] https://repo.mongodb.org/apt/ubuntu noble/mongodb-org/8.0 multiverse" \
  > /etc/apt/sources.list.d/mongodb-org-8.0.list
apt-get update -y
apt-get install -y mongodb-org

# Mongo solo acepta conexiones locales: el backend vive en la misma máquina.
sed -i 's/^  bindIp:.*/  bindIp: 127.0.0.1/' /etc/mongod.conf
systemctl enable mongod
systemctl restart mongod

# ── carpetas de la app ────────────────────────────────────────────────────
install -d -o ubuntu -g ubuntu /var/www/guia-jc        # build del frontend
install -d -o ubuntu -g ubuntu /srv/guia-jc-api        # backend Node

# ── nginx ─────────────────────────────────────────────────────────────────
cat > /etc/nginx/sites-available/guia-jc <<'NGINX'
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    server_name _;

    root /var/www/guia-jc;
    index index.html;

    # El backend de autenticación y progreso.
    location /api/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # React Router: cualquier ruta desconocida la resuelve el index.
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Los assets llevan hash en el nombre: se pueden cachear para siempre.
    location /assets/ {
        access_log off;
        add_header Cache-Control "public, max-age=31536000, immutable";
        try_files $uri =404;
    }

    location = /index.html {
        add_header Cache-Control "no-cache";
    }

    gzip on;
    gzip_types text/css application/javascript image/svg+xml application/json;
    gzip_min_length 1024;

    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
}
NGINX

rm -f /etc/nginx/sites-enabled/default
ln -sf /etc/nginx/sites-available/guia-jc /etc/nginx/sites-enabled/guia-jc

cat > /var/www/guia-jc/index.html <<'HTML'
<!doctype html>
<html lang="es"><head><meta charset="utf-8"><title>Jóvenes creaTIvos</title></head>
<body style="background:#161826;color:#e9e9ed;font-family:system-ui;padding:3rem">
<h1>Servidor listo</h1><p>Falta subir el build de la guía.</p>
</body></html>
HTML
chown -R ubuntu:ubuntu /var/www/guia-jc

# ── servicio del backend (el código se sube después) ──────────────────────
cat > /etc/systemd/system/guia-jc-api.service <<'UNIT'
[Unit]
Description=API de la guía Jóvenes creaTIvos
After=network.target mongod.service
Wants=mongod.service

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/srv/guia-jc-api
EnvironmentFile=/srv/guia-jc-api/.env
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=3
NoNewPrivileges=true
PrivateTmp=true
# /run/guia-jc, del usuario del servicio: ahí deja la señal de autodeploy.
RuntimeDirectory=guia-jc
RuntimeDirectoryPreserve=yes

[Install]
WantedBy=multi-user.target
UNIT

# ── autodeploy: la señal del webhook dispara el redespliegue como root ────
# El API corre con NoNewPrivileges=true (no puede usar sudo), así que en vez de
# escalar privilegios solo crea /run/guia-jc/deploy.request. Esta path unit lo
# ve y arranca el servicio de despliegue en su propio cgroup, que es lo que
# permite que el script reinicie el API sin matarse a sí mismo.
cat > /etc/systemd/system/guia-jc-deploy.service <<'UNIT'
[Unit]
Description=Redespliegue de la guía desde GitHub

[Service]
Type=oneshot
ExecStart=/usr/local/bin/guia-jc-redeploy
UNIT

cat > /etc/systemd/system/guia-jc-deploy.path <<'UNIT'
[Unit]
Description=Señal de redespliegue de la guía

[Path]
PathExists=/run/guia-jc/deploy.request
Unit=guia-jc-deploy.service

[Install]
WantedBy=multi-user.target
UNIT

systemctl daemon-reload
systemctl enable --now guia-jc-deploy.path
# guia-jc-api se habilita cuando el código exista; arrancarlo vacío solo genera ruido.

nginx -t
systemctl enable nginx
systemctl restart nginx

touch /var/log/guia-jc-userdata-ok
