# Tests des API Rest

[TOC]

## Postman

Postman est une application packagée de Chrome permettant la définition et l'envoi de requêtes à un serveur. Plutôt complète et intuitive, elle présente un ensemble de fonctionnalités permettant d'enchaîner plusieurs requêtes HTTP en fournissant l'intégralité des paramètres, contenus et headers requis pour l'exécution des tests.

### Utilisation

Sans décrire l'utilisation standard de Postman, qui est au demeurant assez simple, la principale fonctionnalité qui nous intéresse ici est l'utilisation des variables d'environnement. Postman permet la création d'un environnement dans lequel on vient renseigner des variables au format texte sur le modèle clé/valeur.

La déclaration des variables n'est pas chose difficile en soi mais c'est dans leur utilisation qu'elles prennent alors tout leur intérêt. Il est possible d'utiliser ces variables n'importe où dans la définition d'une requête : URL, headers, paramètres, corps de la requête, authentification, etc. La définition des requêtes est alors beaucoup plus évolutive en cas de changement de serveur cible ou d'utilisateur par exemple. Une variable se présente sous la forme d'une "double moustache" :

```
{{maVariable}}
```

Vous remarquerez dans l'exemple ci-dessous que la variable "rootFolderId" présente dans l'URL n'est pas décrite dans l'environnement de base, cette dernière est extraite de la précédente requête grâce à Jetpacks.

## Jetpacks

Jetpacks est une extension de Postman qui offre la possibilité de réaliser des tests et/ou d'extraire des données suites aux requêtes envoyées par Postman. Cette extension est payante (~9€) mais mérite largement son prix et est parfaitement intégrée à Postman. Une période d'essai de 14 jours est par ailleurs disponible pour s'en convaincre.

Les tests se présentent sous la forme de code Javascript et quelques bibliothèques sont fournies de base afin de réaliser les opérations qu'ils souhaitent :

* jQuery
* backbone
* lodash
* Sugar
* X2JS
* Tiny Validator for JSON Schema v4

### Utilisation

L'activation de l'onglet "Tests" dans Postman affiche un espace de saisie de texte. Bien que le langage utilisé pour effectuer des tests soit le Javascript, peu ou pas de compétences en programmation sont requises pour parvenir à ses fins. L'interface fournit de nombreux snippets de code réalisant la majorité des opérations courantes.

Ci-dessous un exemple de tests et son explication.

ligne 1 : on récupère le corps de la réponse HTTP (responseBody) que l'on convertit en JSON (JSON.parse) et on stocke le résultat dans une variable (data). Notre variable (data) contient alors le contenu de la réponse au format JSON, format très facilement exploitable en Javascript

ligne 3 à 5 : on teste la présence de l'élément "$rootItems" dans notre JSON. "data" est le préfixe de l'objet, on s'attend donc ici à ce que "$rootItems" soit à la racine de la réponse. Si l'élément est présent, alors on définit une variable d'environnement nommée "rootFolderId" que l'on valorise à partir de l'identifiant (id) de la première occurrence ([0]) de l'élément "$rootItems". Le commentaire résultant en fin de ligne est présent pour l'outil Postman2Gatling présenté plus tard.

ligne 7 : on définit un test ainsi qu'un nom pour celui-ci (firstname is correct). Ce test consiste à vérifier que l'attribut "firstName" de l'objet "$person" présent à la racine est égal à "Vincent".

ligne 8 : le test consiste ici à vérifier que l'email de la personne (data.$person.email) répond à l'expression régulière (match) fournie en paramètre (/[a-zA-Z0-9_]+@[a-zA-Z0-9_]+\.[a-zA-Z]{2,3}/g). En substance, l'expression décrite vérifie que l'email est de la forme : au_moins_un_caractère_alphanumérique suivi d'un arobase suivi d'au_moins_un_caractère_alphanumérique suivi d'un point suivi d'entre_deux_et_trois_caractères_alphabétiques.

ligne 9 : le test ici consiste à vérifier la présence de l'élément "$rootItems". Le test définit ici est un test unitaire, i.e. qui va être vérifié lors du déroulement des tests, à la différence du test réalisé à la ligne 3 qui est un test logique qui va aussi être exécuté mais n'est pas vérifié.

ligne 10 : le dernier test vérifie la présence de l'élément "@person". L'arobase étant un caractère spécifique du langage Javascript, c'est ici une autre façon de parcourir l'objet JSON. C'est l'équivalent de la syntaxe "data.@person", sauf que cette syntaxe est interdite.

# Intérêt

Cette extension présente des avantages indéniables :

* effectuer des tests sur la réponse obtenue, à la fois dans les headers, sur le corps de la requête ou sur son enveloppe (i.e. statut)
* vérifier la structure du corps de réponse par rapport à un schéma XML ou JSON
* extraire des informations afin de les exploiter dans les prochaines requêtes

L'un des problèmes que l'on rencontre lorsque l'on fait des tests est le cycle de vie du test, et a fortiori quand il est automatisé. Le cas de test doit pouvoir suivre les évolutions de l'application sans être à réécrire à chaque nouvelle version. La possibilité d'extraire tout ou partie de la réponse obtenue pour en faire une variable est une fonctionnalité qui permet de rendre les scénarios vivants. Dans notre exemple, nous effectuons une
première connexion afin de récupérer l'identifiant "root" du dossier utilisateur et effectuons ensuite les requêtes à partir de cet identifiant.

Ainsi, en changeant uniquement l'utilisateur de connexion dans les variables, le scénario continue de fonctionner sans autre modification. Cette fonctionnalité se révélera d'autant plus intéressante par la suite lors des tests des charges avec Gatling : on pourra alors connecter plusieurs utilisateurs simultanés afin de dérouler le même scénario de requêtes.

Enfin, la sauvegarde des requêtes permet de rejouer les tests à l'envi en les exécutant les unes après les autres en observant le résultat obtenu. En mode "pas-à-pas", cette tâche peut vite devenir pénible à mesure que le nombre de requêtes ou de tests augmentent. On pourra alors utiliser le CollectionRunner fournit dans Postman qui permet de dérouler l'ensemble des requêtes d'une collection. Si l'on désire ou que l'on doit se passer d'une interface, la solution la plus évidente pour automatiser cette tâche est un outil comme Newman.

## Newman

Newman est une application permettant d'exécuter en ligne de commandes les collections Postman (exportées au format JSON) avec prise en charge des tests décrits via Jetpacks.