```markdown
# Pixelit

The very first Blooket private server with pixels. Programmed primarily in JavaScript. Created by IzumiiHD and Iamgamedude!

<img src="https://izumiihd.github.io/pixelitcdn/assets/img/other/pixelitDiscordBanner.png">

<p>Pixelit is not affiliated with Blooket in any sort of way.</p>

# Self-hosting (Quick Start)

This project runs on Node.js and uses MongoDB for persistence. The steps below show how to run Pixelit on your own server or VPS.

> Note: this guide gives example environment variable names and typical setup steps. Confirm exact env variable names and any additional configuration by inspecting server.js and other config files in the repo before deploying.

## Prerequisites

- Node.js (v16+ recommended)
- npm (comes with Node.js)
- MongoDB (local or managed, e.g. MongoDB Atlas)
- A domain name (recommended) and optional reverse proxy (nginx) + TLS (Let's Encrypt)
- Optional: pm2 or systemd to manage the process in production

## Clone & install

```bash
git clone https://github.com/IzumiiHD/Pixelit-BPS.git
cd Pixelit-BPS
npm install
```

The repository's main entry is server.js (see package.json "main": "server.js").

## Environment

Create a .env file in the repository root. Example variables (replace values with your own):

```env
# Basic
PORT=3000
NODE_ENV=production
BASE_URL=http://yourdomain.com          # or https://yourdomain.com if using TLS
SESSION_SECRET=change_this_to_a_secret

# Database
MONGO_URI=mongodb://localhost:27017/pixelit

# Stripe (if used by the server)
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxx
```

Important:
- Use a strong SESSION_SECRET and keep .env out of version control.
- If the project expects other env variables, check server.js and other config files and add them here.

## Run

Start the server directly:

```bash
node server.js
```

If you want a managed process, use pm2:

```bash
npm install -g pm2
pm2 start server.js --name pixelit
pm2 save
pm2 startup
```

Or create a systemd service to auto-start on boot (example):

/etc/systemd/system/pixelit.service
```ini
[Unit]
Description=Pixelit server
After=network.target

[Service]
Type=simple
User=youruser
WorkingDirectory=/path/to/Pixelit-BPS
ExecStart=/usr/bin/node /path/to/Pixelit-BPS/server.js
Restart=on-failure
Environment=NODE_ENV=production
# Optionally load environment variables from file:
# EnvironmentFile=/path/to/Pixelit-BPS/.env

[Install]
WantedBy=multi-user.target
```

Then:
```bash
sudo systemctl daemon-reload
sudo systemctl enable --now pixelit
```

## Reverse proxy + TLS (nginx example)

Using a reverse proxy is recommended for TLS termination and better process management.

Example nginx server block:

```nginx
server {
    listen 80;
    server_name example.com www.example.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}
```

- Obtain TLS certs with Certbot (Let's Encrypt) and enable HTTPS:
  sudo certbot --nginx -d example.com -d www.example.com

## Database

- For simple setups, run MongoDB locally.
- For production, consider a managed MongoDB Atlas cluster or a properly secured remote MongoDB instance.
- Do not expose MongoDB to the public internet without strong authentication and IP whitelisting.

## Security & Maintenance

- Keep secrets out of source control. Use a .env file or secret manager.
- Set NODE_ENV=production for production performance.
- Keep dependencies up to date and monitor for security advisories (the project depends on express, mongoose, socket.io, stripe, etc.).
- Limit access to your server (firewall, SSH keys).
- Backup your MongoDB data regularly.

## Troubleshooting

- Server won't start / crashes:
  - Check that required environment variables are set.
  - Inspect logs (stdout or pm2 logs / journalctl -u pixelit).
  - Ensure MongoDB is reachable and the MONGO_URI is correct.

- Port in use:
  - Either change PORT in .env or stop the conflicting service.

- Websocket / socket.io issues behind nginx:
  - Ensure proxy supports websockets (proxy_set_header Upgrade/Connection lines above).
  - Confirm nginx proxies to the correct internal port.

## Example .env.template (copy to .env and fill in)
```env
PORT=3000
NODE_ENV=production
BASE_URL=http://localhost:3000
SESSION_SECRET=replace_with_a_random_string
MONGO_URI=mongodb://localhost:27017/pixelit
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
```

# Contributors

- Packman28
- SOUNDGOD
- Buenar
- Dylan
- Lemon
- Prq
- Hjr
- FastyJay
- FrostyIce109

```
