![](/img/docker_logo.png)


## Définition


> Quest-ce que Docker ?

Docker est une plateforme ouverte utilisant la technologie des *conteneurs* Linux.


> Qu'est-ce qu'un conteneur ?

Un système virtualisant les resources (i.e. *CPU / RAM / Network / File System*) mais pas les composants (i.e. *hardware*)


La technologie des conteneurs se réfèrent au principe utilisé en logistique.


Un format standard pour un transport multi-modal
* bateau
* camion
* train


> Comment s'en servir ?

La règle d'or dans Docker : un processus = un docker


### Conséquences


Beaucoup plus léger
* taille d'images
* consommation ressources


Orienté micro-services et composition plutôt que monolithe

> L'avenir et/ou la mode du moment dans le monde de l'IT


Terminologie :
* une image : une *« photographie »* du système avant son exécution
* un *container* : un système dont l'exécution a débuté
* un *docker* : une image ou un *container*, invariablement
* *Docker Hub* : référentiel sur lequel sont construites et/ou déposées les images


# Utilisation


# Utilisation sur Chassagne


L'application a des dépendances (FileSystem, Database, NoSQL, SMTP, RabbitMQ, etc...).