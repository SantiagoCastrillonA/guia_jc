# Despliegue de la guía a la instancia EC2 (Windows / PowerShell).
#
#   .\deploy\deploy.ps1              # sube frontend y backend
#   .\deploy\deploy.ps1 -Solo front  # solo el build del frontend
#   .\deploy\deploy.ps1 -Solo api    # solo el backend
#
# Nota: usar el ssh de Windows (C:\Windows\System32\OpenSSH). El ssh de Git Bash
# no lee la llave .pem generada por el CLI de AWS ("error in libcrypto").

param(
  [string]$InstanceHost = "3.141.72.146",
  [string]$KeyPath = "$env:USERPROFILE\.ssh\guia-jc.pem",
  [ValidateSet("todo", "front", "api")]
  [string]$Solo = "todo"
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$h = "ubuntu@$InstanceHost"

if ($Solo -in @("todo", "front")) {
  Write-Host "==> Build del frontend" -ForegroundColor Cyan
  Push-Location $root
  npm run build
  Pop-Location

  Write-Host "==> Subiendo dist/" -ForegroundColor Cyan
  ssh -i $KeyPath $h "rm -rf /tmp/dist-new"
  scp -i $KeyPath -q -r "$root\dist" "${h}:/tmp/dist-new"
  ssh -i $KeyPath $h "rm -rf /var/www/guia-jc/* && cp -r /tmp/dist-new/* /var/www/guia-jc/ && rm -rf /tmp/dist-new && sudo systemctl reload nginx"
}

if ($Solo -in @("todo", "api")) {
  Write-Host "==> Subiendo el backend" -ForegroundColor Cyan
  ssh -i $KeyPath $h "mkdir -p /srv/guia-jc-api/src"
  scp -i $KeyPath -q "$root\server\package.json" "$root\server\server.js" "${h}:/srv/guia-jc-api/"
  scp -i $KeyPath -q "$root\server\src\*.js" "${h}:/srv/guia-jc-api/src/"
  # .env no se sube nunca: vive solo en el servidor.
  ssh -i $KeyPath $h "cd /srv/guia-jc-api && npm install --omit=dev --no-audit --no-fund >/dev/null && sudo systemctl restart guia-jc-api && sleep 2 && systemctl is-active guia-jc-api"
}

Write-Host "==> Verificando" -ForegroundColor Cyan
$ProgressPreference = "SilentlyContinue"
"HTTP  $((Invoke-WebRequest -Uri "http://$InstanceHost/" -UseBasicParsing).StatusCode)"
"API   $((Invoke-WebRequest -Uri "http://$InstanceHost/api/health" -UseBasicParsing).Content)"
Write-Host "==> Listo: http://$InstanceHost/" -ForegroundColor Green
