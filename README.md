### Temmie's Origins

#### Setting up a Server (Docker Compose)

This is an _extremely_ simple example, for a more complex example feel free to check out my [SelfHosted](https://github.com/cecilia-sanare/SelfHosted) repo.

```yml
version: "3"

services:
  minecraft-origins:
    image: itzg/minecraft-server:java17-alpine
    container_name: minecraft-origins
    tty: true
    stdin_open: true
    restart: unless-stopped
    ports:
      - "25565:25565/tcp"
      - "25565:25565/udp"
    expose:
        - "25565"
    environment:
      MEMORY: 8G
      TYPE: FABRIC
      VERSION: 1.19.2
      PACKWIZ_URL: https://raw.githubusercontent.com/cecilia-sanare/TemmiesOrigins/<version>/pack.toml
    volumes:
      - /etc/minecraft/origins:/data
```

#### Setting up a Server (Bare Metal)

_WIP_