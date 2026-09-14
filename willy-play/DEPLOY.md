# Willy Play — Guía de Despliegue en Hostinger

## Prerrequisitos

El servidor debe tener instalado:

- [Docker](https://docs.docker.com/engine/install/) (v20.10+)
- [Docker Compose](https://docs.docker.com/compose/install/) (v2.0+)
- [Git](https://git-scm.com/downloads)

### Instalar en Ubuntu/Debian

```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER

# Instalar Docker Compose
sudo apt install docker-compose-plugin -y

# Verificar instalación
docker --version
docker compose version
```

> **Nota:** Después de agregar al grupo `docker`, cierra sesión y vuelve a entrar para que el cambio surta efecto.

---

## 1. Clonar el repositorio

```bash
git clone https://git.conectamosdt.com/daniel.lorenzo/cardiokids.git
cd cardiokids
```

---

## 2. Construir y levantar

```bash
docker compose up -d --build
```

Este comando:

1. Descarga la imagen base `node:22-alpine`
2. Instala las dependencias (`npm ci`)
3. Compila la app Next.js en modo standalone
4. Crea la imagen de producción optimizada (~150MB)
5. Levanta el contenedor en el puerto **3000**

---

## 3. Verificar

```bash
# Ver logs
docker logs willy-play

# Verificar que el contenedor está corriendo
docker ps

# Test rápido
curl -s -o /dev/null -w "HTTP %{http_code}" http://localhost:3000
# Debe responder: HTTP 200
```

---

## 4. Acceder

Abrir en el navegador:

```
http://IP-DEL-SERVIDOR:3000
```

---

## Comandos útiles

| Acción | Comando |
|---|---|
| Ver logs en tiempo real | `docker logs -f willy-play` |
| Reiniciar | `docker compose restart` |
| Detener | `docker compose down` |
| Reconstruir después de cambios | `docker compose up -d --build` |
| Eliminar imagen y reconstruir | `docker compose down --rmi all && docker compose up -d --build` |
| Entrar al contenedor | `docker exec -it willy-play sh` |

---

## 5. (Opcional) Configurar Nginx Reverse Proxy

Para acceder sin el puerto `:3000` y con HTTPS:

```bash
# Instalar Nginx
sudo apt install nginx -y

# Crear configuración
sudo nano /etc/nginx/sites-available/willy-play
```

Pegar:

```nginx
server {
    listen 80;
    server_name tudominio.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Activar sitio
sudo ln -s /etc/nginx/sites-available/willy-play /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

### (Opcional) HTTPS con Certbot

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d tudominio.com
```

---

## 6. (Opcional) Docker Compose con Nginx

Si prefieres levantar todo con Docker Compose, crear `docker-compose.prod.yml`:

```yaml
services:
  app:
    build: .
    restart: unless-stopped
    expose:
      - "3000"
    environment:
      - NODE_ENV=production

  nginx:
    image: nginx:alpine
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
    depends_on:
      - app
```

Y ejecutar:

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

---

## Variables de entorno

| Variable | Valor | Descripción |
|---|---|---|
| `NODE_ENV` | `production` | Modo producción (activado por defecto) |
| `PORT` | `3000` | Puerto interno del contenedor |
| `HOSTNAME` | `0.0.0.0` | Escuchar en todas las interfaces |

---

## Solución de problemas

### El contenedor no arranca

```bash
docker logs willy-play
```

Comúnmente es puerto ocupado:

```bash
# Matar proceso en puerto 3000
sudo lsof -ti:3000 | xargs kill -9
docker compose up -d
```

### Build falla por memoria

Si el servidor tiene menos de 1GB RAM, agregar swap:

```bash
sudo fallocate -l 1G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### No puedo acceder desde fuera

Verificar que el puerto está abierto en el firewall:

```bash
# UFW
sudo ufw allow 3000/tcp
sudo ufw reload

# O iptables
sudo iptables -A INPUT -p tcp --dport 3000 -j ACCEPT
```

En Hostinger, también verificar los **firewall rules** en el panel de administración.
