# Méthodes


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