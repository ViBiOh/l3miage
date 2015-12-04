# Docker for everyone

Docker here, Docker there, Docker everywhere. The Docker promise is interesting, but you have to be familiar with command-line. And what if not ? The sales, quality assurance or marketing are departments which sometimes, if not often, need a running version of the product for demos, tests or illustrations. The use of production environment isn't a good answer, integration environment can be random: it's a *test* environment so it can break and features may differ with production environment. So, there's no already available environment for them.

Most of the time, these entities require at IT to meet their needs. These are specific, timely and change frequently. Repetitive tasks should never be conducted by human, but by machines. At the time of Docker, why non-DevOps might not be to able to deploy a standalone instance of the application? Locally or remotely, it's not the point: just having a thing that just work and accessible.

At the latest DockerCon, Docker announces [Universal Control Plane](https://www.docker.com/universal-control-plane): an on-premise graphical tool to manage containers accross private and cloud infrastructures. Very interesting but still an announce with no demo or tech previews available. But there is an already available alternative called [Rancher](http://rancher.com/rancher/).

## Rancher

First of all, Rancher is still in beta. But it's like a Google beta: don't use it on production but everywhere else it's fine.

### Catalog

Modern applications require multiples services (database, filesystem, nosql, application serveur, etc.). With Docker, you put all of this config in a `docker-compose.yml` and your app just work outside of the box.

But, what if you want to run multiple instance of the same "stack" of services in the same host? Docker-compose doestn't support variable and you'll have to find/replace your configuration file each time, and copy/paste the the result...

Again, what if you application evolves and now required a new service (e.g. Broker, Auth server, etc.)? You need to edit each running stack to add a new service with no errors... Not very handy.

### Stack

## Traefik

Traefik is a reverse-proxy written in go (same langage as Docker engine), shipped with Docker, compatible with Docker as a backend provider. It can listen Docker's daemon to handle every events (start, restart, stop), and read metadata of running containers (the equivalent of `docker inspect` CLI).

Reading of metadata allows us to define labels on containers in order to configure how the reverse-proxy should handle it. To ignore (e.g. MongoDB doesn't need a reverse proxy), simply add `traefik.enable=false`.

Traefik's subdomain is based on container's name but Rancher puts UUID name on containers, not user-friendly. So we have to configure the whole thing:

```yml
maildev:
  labels:
    traefik.frontend.passHostHeader: 'true'
    traefik.frontend.rule: 'Host'
    traefik.frontend.value: 'maildev.docker.zenika.com'
    traefik.port: '1080'
  image: vibioh/maildev:latest
```

This will result that every request on `maildev.docker.zenika.com` will be routed to the containers on port `1080`. As you have probably seen it, we don't map 1080 port. So how can it works ?! It works like a charm because we are running Traefik in a container and all containers are in the same *Docker network*. While you have not enabled `icc=false` options on Docker's daemon, each container can call another, on desired port, without linking : perfect use-case for us.

It remains to update your DNS to map `*.docker.zenika.com` to the Traefik host and you're done.

# Finally

Each user that have access to Rancher, can browse Catalog to configure and deploy a stack, which is automagically avaible with a domain name, and start using it without opening any ticket to IT. Pretty cool no ?