# Deploy en AWS

## Lo que ya está creado

| Recurso | Valor |
| --- | --- |
| Región | `us-east-2` (Ohio) |
| Instancia | `i-04f4e1ad00c4462bb` — nombre `guia-jc`, t3.micro, Ubuntu 24.04, 16 GiB gp3 |
| IP elástica | `3.141.72.146` — `eipalloc-094b2797d3ae7f6c2`, fija aunque se reinicie la instancia |
| Key pair | `guia-jc` (ed25519) · llave privada en `~/.ssh/guia-jc.pem` |
| Security group | `sg-093413b385dcebc1a` — 22 solo desde la IP del equipo de Santiago, 80 y 443 públicos |
| Sitio | http://3.141.72.146/ |

En la máquina: nginx (estático + proxy de `/api`), Node.js 22, MongoDB 8 escuchando
solo en `127.0.0.1`, y 2 GB de swap porque la t3.micro tiene 1 GB de RAM.

| Ruta en el servidor | Qué es |
| --- | --- |
| `/var/www/guia-jc` | build del frontend |
| `/srv/guia-jc-api` | backend Node (servicio systemd `guia-jc-api`) |
| `/srv/guia-jc-api/.env` | secreto JWT y configuración — **solo vive en el servidor** |

## Desplegar cambios

```powershell
.\deploy\deploy.ps1
```

`-Solo front` o `-Solo api` para subir una sola parte. Usa el `ssh` de Windows:
el de Git Bash no lee la llave `.pem` del CLI de AWS.

## Conectarse

```powershell
ssh -i $env:USERPROFILE\.ssh\guia-jc.pem ubuntu@3.141.72.146
```

Comandos útiles dentro de la máquina:

```bash
systemctl status guia-jc-api
journalctl -u guia-jc-api -n 50 --no-pager
mongosh guia_jc --eval "db.users.find({}, {username:1, role:1})"
```

## La primera cuenta

**La primera cuenta que se registre queda como `admin`.** Créala tú antes de
compartir el enlace con los estudiantes, en http://3.141.72.146/entrar.

Para cerrar el registro después (que solo el profe cree cuentas), en el servidor:

```bash
sudo sed -i 's/^ALLOW_REGISTRATION=.*/ALLOW_REGISTRATION=false/' /srv/guia-jc-api/.env
sudo systemctl restart guia-jc-api
```

## El otro proyecto

`centros de acopio` (`i-09ef5799efa12aed0`) quedó **detenida** el 2026-08-19 y se
liberó su IP elástica (era `18.216.6.154`). La instancia y su disco siguen intactos:
al prenderla de nuevo funciona igual, pero **con otra IP pública**, así que toca
actualizar el DNS o el enlace que se haya compartido:

```bash
aws ec2 start-instances --instance-ids i-09ef5799efa12aed0 --region us-east-2
```

## Pendientes

- **Dominio + HTTPS**: con un dominio apuntando a la IP,
  `sudo apt-get install -y certbot python3-certbot-nginx && sudo certbot --nginx -d <dominio>`.
  Después poner `COOKIE_SECURE=true` en `.env` y reiniciar el servicio: la cookie
  de sesión solo debería viajar por HTTPS.
- **Backups de Mongo**: `mongodump` periódico a S3 si el progreso importa.

## Costos

t3.micro + 16 GiB gp3 en us-east-2 ronda los 9–10 USD al mes si corre 24/7
(menos si aplica capa gratuita). Detener la instancia frena el cobro de cómputo;
el disco se sigue cobrando (~1,3 USD/mes).

Cada IPv4 pública se cobra aparte (~3,6 USD/mes). La de centros de acopio ya se
liberó; queda solo la de `guia-jc`, que no se cobra mientras la instancia esté
encendida. De centros de acopio sigue corriendo el disco EBS (~1,3 USD/mes): eso
solo se quita terminando la instancia, lo que borra el disco y no tiene vuelta atrás.
