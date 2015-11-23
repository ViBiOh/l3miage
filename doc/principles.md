# Principes & méthodes pratiques


> Nine women can't make a baby in one month.

> Frederic Brooks


## Cycle V


## Agile - Scrum

La qualité vous fait peur ?

Tant mieux : on ne négocie pas avec ~~les terroristes~~ la qualité.


[Devenir agile en 15 min](https://www.youtube.com/watch?v=3qMpB-UH9kA)


## Intégration continue

L'objectif de l'entreprise est de réduire le *Time To Market* (T.T.M.) et donc pour la R&D le *Time To Ship*.


On livre toujours du code qu'on assume : exempt de bugs, performant...

De qualité !


Le workflow automatique et idéal est le suivant :

1. une *pull-request* est créée sur une branche
1. l'intégration continue exécute les tests unitaires et d'intégrations sur la branche ainsi que l'outil de qualimétrie et fourni un vote **technique** sur la modification
1. la *pull-request* est acceptée (facteur **humain**)
1. le code est fusionné avec le *master*
1. l'intégration continue exécute les tests unitaires, les tests d'intégrations et l'outil de qualimétrie
1. l'application est packagée puis déployée sur un environnement de qualification
1. l'intégration continue exécute les tests fonctionnels, de performance et de sécurité
1. l'application est déployée en production.


A chaque erreur détectée lors de la compilation, du *packaging*, de la qualimétrie ou des tests, l'intégration continue doit être en mesure d'identifier les nouveaux *commits* depuis le dernier succès et d'en avertir les parties prenantes.


## Communication

> Seul on va plus vite, ensemble on va plus loin.


* Partager votre vision
    - du projet
    - du produit
    - de l'équipe
    - de l'écosystème dans lequel vous êtes
* Faire de la veille, des conférences, assister à des *meetups*
* Discuter des implémentations, technologies, actualités
    - méso-économie : personne n'a que faire d'un évènement.


* [Slack](http://www.slack.com)
* RocketChat, HipChat
* Animer l'équipe et acquérir le *team-spirit*


## Dette technique

* A chaque nouvelle fonctionnalité, on rend le code

* définitionTemps accumulé et ajouté à chaque nouvelle feature
* Viser à la réduire ou à la contenir


## Ne pas réinventer la roue

* Utiliser ce qui existe


## Principe du *boy-scout*

> *Leave the campground cleaner that you found it.*

* Amélioration continue du logiciel
* Pas de coupable, pensez en équipe et pas en individuel


## *Keep It Simple, Stupid* - KISS

> Pourquoi faire compliqué quand on peut faire simple ?

* Il est parfois compliqué de faire simple en appliquant les *patterns* de programmation


## *Read The Fucking Manual* - RTFM

* La réponse est bien souvent dans la documentation
* La réponse est sur [Google](http://lmgtfy.com/?q=google.fr&l=1) / [StackOverflow](http://lmgtfy.com/?q=stacksverflow.com&l=1)
* La réponse est dans les *issues* GitHub
* La réponse est [42](https://en.wikipedia.org/wiki/42_(number)#The_Hitchhiker.27s_Guide_to_the_Galaxy)


* S'il y a vraiment un bug (i.e. après avoir lu la documentation), ouvrez un ticket !
* Contribuez, corrigez, ameliorez : appropriez-vous vos outils