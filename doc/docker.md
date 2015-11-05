# ![](/img/docker_logo.png)


## Définition


> Quest-ce que Docker ?

Docker est une plateforme *open-source* utilisant la technologie des *conteneurs* Unix.


> Qu'est-ce qu'un conteneur ?

Un système virtualisant les resources (i.e. *CPU / RAM / Network / File System*) mais pas les composants (i.e. *hardware*)


Portable

Beaucoup plus léger
* taille d'images
* consommation ressources


La technologie des conteneurs est analogue à celle en logistique.


Un format standard pour un transport multi-modal
* camion
* train
* bateau
* avion


> Qui va s'en servir ?

Un peu tout le monde


**dev** > Plus besoin d'installer **node** en local

```alias npm='docker run --rm -v $(pwd):/usr/src -w /usr/src vibioh/node:dev npm'```


**qa** > Plus besoin d'installer les dépendances localement

```docker-compose up -d```


**it** > Plus besoin de configurer l'application

```docker run -d -p 80:3000 awesome_app:latest```


Certains s'en servent pour lancer des applications avec une UI (Spotify, Chrome, etc...) en utilisant un serveur X11.


> Si plus personne ne fait plus rien, qui le fait ?

`Dockerfile` et donc les devs / dev-ops.


L'automatisation de la construction du livrable existe déjà mais...

...maintenant on peut le déployer facilement en lançant le *docker*


Besoin d'une nouvelle instance sur le cluster ? Lançons un *docker*


> Comment s'en servir ?

un processus = un *docker*

Point.


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


Docker utilise des API bien particulières du noyau Unix, non présentes sous  et forcément absente de Windows.


On utilise donc une VM Linux afin d'avoir accès à ces API : [Docker Toolbox](https://www.docker.com/docker-toolbox) (anciennement Boot2Docker).


L'application a des dépendances (FileSystem, Database, NoSQL, SMTP, RabbitMQ, etc...).