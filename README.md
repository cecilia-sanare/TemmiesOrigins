## Temmie's Origins

### Setting up a Server

#### Docker Compose

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
      - "25565:25565/udp" # Required for Voice Chat
    expose:
        - "25565"
    environment:
      GH_TOKEN: "<GITHUB_TOKEN>" # Prevents rate-limiting~ (https://github.com/settings/tokens)
      EULA: "TRUE"
      MEMORY: 8G
      TYPE: FABRIC
      VERSION: 1.19.2
      PACKWIZ_URL: https://raw.githubusercontent.com/cecilia-sanare/TemmiesOrigins/<version>/pack.toml
    volumes:
      - /etc/minecraft/origins:/data
```

#### Docker

```sh
$ docker run -dt --name minecraft-origins \
  -p 25565:25565/tcp -p 25565:25565/udp --expose 25565 \
  -e GH_TOKEN="<GITHUB_TOKEN>" \
  -e EULA="TRUE" -e MEMORY="8G" -e TYPE="FABRIC" -e VERSION="1.19.2" \
  -e PACKWIZ_URL="https://raw.githubusercontent.com/cecilia-sanare/TemmiesOrigins/<version>/pack.toml" \
  -v "/etc/minecraft/origins:/data" \
  --restart="unless-stopped" \
  itzg/minecraft-server:java17-alpine
```