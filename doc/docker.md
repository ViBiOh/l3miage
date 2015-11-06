# ![](/img/docker_logo.png)


## Définition


> Quest-ce que Docker ?

Docker est une plateforme *open-source* utilisant la technologie des *conteneurs* Unix.


> Qu'est-ce qu'un conteneur ?

Un système virtualisant les resources (i.e. *CPU / RAM / Network / File System*) mais pas les composants (i.e. *hardware*)


Portable

Taille d'image réduite

Consommation plus légères des ressources


La technologie des conteneurs est analogue à celle définie en logistique.


Un format standard pour un transport multi-modal
* camion
* train
* bateau
* avion


> Qui va s'en servir ?

Un peu tout le monde


**dev** > Plus besoin d'installer **maven** en local

```alias mvn='docker run --rm -v $(pwd):/usr/src -w /usr/src maven:latest mvn'```


**qa** > Plus besoin d'installer les dépendances localement

```docker-compose up -d```


**it** > Plus besoin de configurer l'application

```docker run -d -p 80:3000 awesome_app:latest```


Certains s'en servent pour lancer des applications avec une UI (Spotify, Chrome, etc...) en utilisant un serveur X11.


> Si plus personne ne fait plus rien, qui le fait ?

`Dockerfile` et donc les devs / dev-ops.


L'automatisation de la construction du livrable existe déjà mais...

...on peut déployer plus facilement à chaud avec *docker*


Besoin d'une nouvelle instance sur le cluster ?

Lançons un *docker*


> Comment s'en servir ?

un processus = un *docker*.


> *Cattle vs Kittens*

*Cattle* : Un *docker* « malade », on le tue et on le relance.

*Kitten* : Une *Virtual Machine* « malade », on essaie de la soigner.


> L'avenir et/ou la mode du moment dans le monde de l'IT

Orienté micro-services et composition plutôt que monolithe


Terminologie :
* une image : une *« photographie »* du système avant son exécution
* un *container* : un système dont l'exécution a débuté
* un *docker* : une image ou un *container*, invariablement
* *Docker Hub* : référentiel sur lequel sont construites et/ou déposées les images


## Utilisation sous Windows / Mac


Docker utilise des API bien particulières du noyau Unix, non présentes sous Mac et forcément absente de Windows.


On utilise donc une VM Linux afin d'avoir accès à ces API : [Docker Toolbox](https://www.docker.com/docker-toolbox) (anciennement Boot2Docker).


Cela est facilité par [Docker Machine](https://docs.docker.com/machine/) qui permet de gérer plusieurs *hosts* Docker

Docker permet une administration à distance grace à une API : il faut seulement le client.


## Utilisation


L'application a des dépendances (Serveur HTTP, FileSystem, Database, NoSQL, SMTP, RabbitMQ, etc...).

La virtualisation des resources permet de venir *brancher* celles que l'on souhaite. On fait donc un conteneur pour chaque dépendance.


> Comment orchestrer la communication ?

Docker permet de lier les conteneurs entre eux sans exposer les ports publiquement.

`docker run --name mysql mysql:latest`

`docker run --link mysql:db awesome_app:latest`

> **`awesome_app`** parlera à **`mysql`** via le port **3306** sans que celui-ci ne soit disponible à l'extérieur de Docker


> Comment accèder à l'application ?

Un conteneur n'est accessible que sur les ports que l'on définit.

`docker run -d -p 80:3000 awesome_app:latest`

> **`awesome_app`** sera accessible depuis l'extérieur sur le port **3000**, qui est *mappé* sur le port 80 de l'hôte.


On peut donc lancer plusieurs fois la même application sur des ports différents sans configuration particulière côté serveur


> Quid des données ?


L'image du *cattle* nous fait dire qu'on ne se soucie pas vraiment du *contenu* du *conteneur*.

La bonne pratique est d'exécuter les *docker* avec un *filesystem* en *read-only* : assurance d'externaliser toutes les données.


L'externalisation des données passe par le montage de volumes. On *mappe* un répertoire du *host* sur un répertoire du *docker*.

`docker run -v /var/awesome_app/filesystem:/var/usr awesome_app:latest`

> Le contenu du dossier **`/var/awesome_app/filesystem`** sera accessible depuis le *docker* sous le chemin **`/var/usr`**


> Et si j'ai beaucoup de dépendances ?

[Docker Compose](https://docs.docker.com/compose/) permet de gérer le cycle de vie de toutes les dépendances d'une application à partir d'un fichier de configuration.

`docker-compose up -d`

`docker-compose stop -d`


***Récapitulons***

On peut lancer plusieurs fois la même application, avec toutes ses dépendances, sur des ports et des volumes (i.e. jeu de données) différents. Ce déploiement se fait très facilement via un fichier de configuration.


> Et si je n'aime pas la ligne de commande ?

[Rancher](http://rancher.com/rancher/) est un outil Web permettant de contrôler un ou plusieurs hôtes Docker. Il permet d'importer son *compose* et de le déployer dans une *stack*.

La configuration est éditable et le monitoring des *hosts* voire des *dockers* est possible.


> Utilisation sur le projet Chassagne

Création de plusieurs environnements pour la QA, des portails clients et pour la démonstration.

