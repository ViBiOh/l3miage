# Principes & méthodes pratiques


> Nine women can't make a baby in one month.

> Frederic Brooks


L'informatique, et le développement de logiciels en particulier, sont bien souvent un laboratoire d'essais pour les méthodes de management et/ou de gestion de projet.


## Cycle V


Très contractuel et procédurier : un cahier des charges initial, un cahier de recette final.


Souvent utilisé dans le cadre de "forfait" en SSII.


![](/doc/img/cycle_en_v.svg)


Crée un effet « tunnel » car chaque tâche dépend de la précédente, sans validation de l'utilisateur.


## Agile - Scrum


Processus itératif où l'on présente fréquemment l'avancée du produit à l'utilisateur.


Risque bien moins grand de dévier du besoin réel, possibilité de le réajuster en cours de développement.


Tout est *timeboxé*. Chaque cérémonie de la méthode Scrum a une durée qu'il faut respecter. On va à l'essentiel.


Si vous entendez parlez de **Sprint**, de **burn-down chart**, de **daily standup**, vous êtes dans une équipe agile.


... ou alors si vous voyez des montagnes de Post-it ® sur un des bureaux !


La qualité vous fait peur ?

Tant mieux : on ne négocie pas avec ~~les terroristes~~ la qualité.


[Devenir agile en 15 min](https://www.youtube.com/watch?v=3qMpB-UH9kA)


## Intégration continue


L'objectif de l'entreprise est de réduire le *Time To Market* (T.T.M.) et donc pour la R&D le *Time To Ship*.


On livre toujours du code qu'on assume : exempt de bugs, performant...

De qualité !


Un *bon* *workflow* d'intégration continue (Continuous Integration) pourrait être...


Le développeur crée une *pull-request* sur le projet.


La CI effectue la compilation, les tests unitaires et d'intégrations sur la branche ainsi que l'analyse via l'outil de qualimétrie.


L'équipe effectue la revue de code de la pull-request par au moins deux pairs : une revue technique et une revue fonctionnelle.


Le développeur fusionne la branche sur le *master* après approbation de ses pairs et de la CI.


La CI effectue la compilation, l'ensemble des tests statiques et l'analyse qualimétrique.


Si aucun indicateur ne passe au rouge via la CI, l'application est packagée et déployée sur un environnement de qualification.


La CI reprend alors en exécutant les tests fonctionnels et de performances.


Le déploiment continu (Continuous Delivery) peut entrer en action ensuite afin de déployer l'application en production si tous les indicateurs précédents sont au vert.


A chaque erreur détectée lors du processus, l'intégration continue doit être en mesure d'identifier les nouveaux *commits* depuis le dernier succès et d'en avertir les parties prenantes.


## Communication

> Seul on va plus vite, ensemble on va plus loin.


Partager votre vision
* projet
* produit
* équipe
* environnement


Faire de la veille, assister à des conférences, des *meetups*, des salons, ...


> « Stay hungry, stay foolish. » - Steve Jobs


Discuter des implémentations, technologies, actualités.


En méso-économie, personne n'a que faire d'un évènement. Même si un domaine ne vous intéresse pas, il vous impacte directement ou indirectement.


Être bon communicant passe par de bons outils


* [Slack](http://www.slack.com), [Rocket.chat](https://rocket.chat), [appear.in](https://appear.in), IRC
* Réseaux sociaux
* Animer l'équipe et acquérir le *team-spirit*


## Sociologie


Travailler en équipe implique de connaître quelques lois sociologiques ou psychologiques.


## Principe de Peter

> Tout employé tend à s'élever à son niveau d'incompétence.


## Loi de Dilbert

> Avec le temps, tous les postes d'une entreprise sont occupés par des incompétents.


## Loi de Murphy

> Si quelque chose doit arriver, alors ça arrivera.


## Les cinq « pourquoi »

> Pourquoi ? Pourquoi ? Pourquoi ? Pourquoi ? Pourquoi ?


## CQQCOQP

> Combien ? Qui ? Quand ? Comment ? Où ? Quoi ? Pourquoi ?


## Loi de Pareto

> Règle des 80 - 20


## Principe du *boy-scout*

> *Leave the campground cleaner that you found it.*


* Amélioration continue du logiciel
* Pas de coupable, pensez en équipe et pas en individuel


## Dette technique


Pour chaque fonctionnalité, il faut assurer une cohérence entre les spécifications (la conception) et le code (l'implémentation) sous peine de créer un écart.


Cet écart représente une dette que l'on supporte ensuite tout au long de la vie du logiciel.


De plus, chaque ajout de fonctionnalité vient alourdir l'application, il faut donc veiller à refactorer au fil de l'eau pour ne pas accumuler de surcharge de travail.


## Ne pas réinventer la roue


Utiliser ce qui existe quand cela répond à votre besoin


En combinant des outils, on peut en créer d'autres.

e.g. la stack ELK pour analyser vos logs : ElasticSearch Logstash Kibana


![](/doc/img/too_busy_to_improve.jpg)


## *Keep It Simple, Stupid* - KISS

> Pourquoi faire compliqué quand on peut faire simple ?


Il est parfois compliqué de faire simple en appliquant les *patterns* de programmation


![](/doc/img/simplicity.jpeg)


## *Problem Exists Between Chair And Keyboard* - PEBKAC

> Le plus grand virus informatique est l'interface clavier-chaise.


## *Read The Fucking Manual* - RTFM


* La réponse est bien souvent dans la documentation
* La réponse est sur [Google](http://lmgtfy.com/?q=google.fr&l=1) / [StackOverflow](http://lmgtfy.com/?q=stacksverflow.com&l=1)
* La réponse est dans les *issues* GitHub
* La réponse est 42


S'il y a vraiment un bug (i.e. après avoir lu la documentation), ouvrez un ticket !


Contribuez, corrigez, ameliorez : appropriez-vous vos outils
