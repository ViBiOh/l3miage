# Git

![](img/git_logo.png)


* Gestion de configuration
* Fonctionnement *à la ligne*
* Décentralisé, pas *forcément* besoin d'un serveur
* Branches, *cherry-pick*, tag, fusion


## Création d'un *repository* en local

`git init`


## Cloner un repository existant

`git clone url-de-votre-repo`


via HTTP, pour du public mais pas idéal pour travailler.

> git clone https://github.com/ViBiOh/l3miage.git


via SSH, pour du public et privé, plus sécure.

> git clone git@github.com:ViBiOh/l3miage.git


## Connaître l'état de la copie locale

`git status`


![](img/git_lifecycle.png)


## Ajouter un fichier au système de version

`git add nom_de_votre_fichier`


### En mode interactif pour ajouter seulement ceux souhaités

`git add -i`


### En mode interactif pour ajouter seulement les sous-parties

`git add -p`


### Annuler les modifications locales

`git checkout -- [nom_de_votre_fichier]`

ou la nouvelle version

`git restore [nom_de_votre_fichier]`


### Annuler les modifications déjà ajoutées

`git reset HEAD -- [nom_de_votre_fichier]`

ou la nouvelle version

`git restore --staged [nom_de_votre_fichier]`


### Créer une branche à partir de la branche courante

`git checkout -b features/awesome`

ou la nouvelle version

`git switch --create features/awesome`


### Changer de branche

`git checkout master`

ou la nouvelle version

`git switch features/awesome`


### Mettre de côté ses modifications

`git stash`


### Réappliquer les modifications mises de côté

`git stash pop`


## Valider localement ses modifications

`git commit -m "commentaire de votre commit"`


## Voir l'historique des commits

`git log`


## Voir le détail d'un commit

`git show commit-sha1`


## Pousser ses modifications sur le serveur

`git push`


![](img/git_remote.png)


### En précisant la destination, la branche

`git push nom-du-serveur-distant nom-de-la-branche`

> git push origin master


### En précisant la destination, la branche, la référence locale

`git push nom-du-serveur-distant référence-du-commit:nom-de-la-branche`

> git push origin HEAD:master

Ne pas oublier le **HEAD** car `git push origin :master` supprime la branche


## Récupérer les modifications du serveur

`git pull`


### En précisant la source, la branche

`git pull nom-du-serveur-distant nom-de-la-branche`

> git pull origin master


### Récupérer les modifications d'une autre branche sur la sienne

Par "en dessous"

`git pull --rebase nom-de-la-branche-dont-on-veut-les-modifications`

Par "au dessus"

`git pull --rebase=false nom-de-la-branche-dont-on-veut-les-modifications`


# Références

* [Un guide interactif et visuel](http://git-school.github.io/visualizing-git/#free)
* [La documentation officielle](http://git-scm.com/book/fr/v1)
* [GitFlow](http://nvie.com/posts/a-successful-git-branching-model/)
* [Configuration](https://delicious-insights.com/fr/articles/configuration-git/)
* [Merge vs Rebase](https://medium.com/@porteneuve/getting-solid-at-git-rebase-vs-merge-4fa1a48c53aa)
