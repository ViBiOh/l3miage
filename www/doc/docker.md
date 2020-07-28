# Docker

## Définition

> Quest-ce que Docker ?

Docker est une plateforme _open-source_ utilisant la technologie des _conteneurs_ Unix.

> Qu'est-ce qu'un conteneur ?

Un système donnant accès aux resources (i.e. _CPU / RAM / Network / File System_) mais pas aux composants (i.e. _hardware_)

Portable

Taille d'image réduite

Consommation plus légère des ressources

La technologie des conteneurs est analogue à celle définie en logistique.

Un format standard pour un transport multi-modal

- camion
- train
- bateau
- avion

> Qui va s'en servir ?

Un peu tout le monde

**dev** > Plus besoin d'installer **maven** en local

`` alias mvn='docker run --rm -v `pwd`:/usr/src -w /usr/src maven:latest mvn' ``

**qa** > Plus besoin d'installer les dépendances localement

`docker-compose up -d`

**it** > Plus besoin de configurer l'application

`docker run -d -p 80:3000 awesome_app`

Certains s'en servent pour lancer des applications avec une UI (Spotify, Chrome, etc...) en utilisant un serveur X11.

> Si plus personne ne fait plus rien, qui le fait ?

`Dockerfile` et donc les devs / dev-ops.

L'automatisation de la construction du livrable existe déjà mais...

...on peut déployer plus facilement à chaud avec _docker_ car conteneur plus léger

> Comment s'en servir ?

un processus = un _docker_.

> _Cattle vs Kittens_

_Cattle_ : Un _docker_ « malade », on le tue et on le relance.

_Kitten_ : Une _Virtual Machine_ « malade », on essaie de la soigner.

> L'avenir et/ou la mode du moment dans le monde de l'IT

Orienté micro-services et composition plutôt que monolithe

Terminologie :

- une image : une _« photographie »_ du système avant son exécution
- un _container_ : un système dont l'exécution a débuté
- un _docker_ : une image ou un _container_, invariablement
- _Docker Hub_ : référentiel sur lequel sont construites et/ou déposées les images

## Utilisation

L'application a des dépendances (Serveur HTTP, FileSystem, Database, NoSQL, SMTP, Messaging, Cache, etc...).

La virtualisation des resources permet de venir _brancher_ celles que l'on souhaite. On fait donc un conteneur pour chaque dépendance.

> Comment orchestrer la communication ?

Docker permet de lier les conteneurs entre eux sans exposer les ports publiquement.

`docker run --name mysql mysql`

`docker run --link mysql:db awesome_app`

> **`awesome_app`** parlera à **`mysql`** via le port **3306** sur le nom **db** sans que celui-ci ne soit disponible à l'extérieur de Docker

> Comment accèder à l'application ?

Un conteneur n'est accessible que sur les ports que l'on définit.

`docker run -d -p 80:3000 awesome_app`

> **`awesome_app`** sera accessible depuis l'extérieur sur le port **3000**, qui est _mappé_ sur le port 80 de l'hôte.

On peut donc lancer plusieurs fois la même application sur des ports différents sans configuration particulière.

> Quid des données ?

L'image du _cattle_ nous fait dire qu'on ne se soucie pas vraiment du _contenu_ du _conteneur_.

La bonne pratique est d'exécuter les _docker_ avec un _filesystem_ en _read-only_ : assurance d'externaliser toutes les données, mêmes les logs, surtout les logs !

L'externalisation des données passe par le montage de volumes. On _mappe_ un répertoire du _host_ sur un répertoire du _docker_.

`docker run -v /var/awesome_app/filesystem:/var/usr awesome_app`

> Le contenu du dossier **`/var/awesome_app/filesystem`** sera accessible depuis le _docker_ sous le chemin **`/var/usr`**

> Et si j'ai beaucoup de dépendances ?

[Docker Compose](https://docs.docker.com/compose/) permet de gérer le cycle de vie de toutes les dépendances d'une application à partir d'un fichier de configuration.

`docker-compose up -d`

`docker-compose stop -d`

**_Récapitulons_**

On peut lancer plusieurs fois la même application, avec toutes ses dépendances, sur des ports et des volumes (i.e. jeu de données) différents. Ce déploiement se fait très facilement via un fichier de configuration.
