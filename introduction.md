# Génie logiciel

Vincent Boutour
Consultant formateur chez [Zenika](http://www.zenika.com)

[@ViBiOh](https://twitter.com/ViBiOh)

## Sommaire

[TOC]

## Objectifs

* Faire du **bon** code
    - Maintenable
    - Compréhensible
    - Sûr
    - Réutilisable
    - Documenté
    - Performant

* Maitriser l'environnement de réalisation
* Connaitre le processus de *delivery*

## Principe de programmation

### Un cas simple

Afficher l'inverse de l'entier fourni par l'utilisateur en Java

```java
import java.util.Scanner;

public class Program {
  public static void main(final String[] args) {
    System.out.println("Inverse: " + (1D / new Scanner(System.in).nextInt()));
  }
}
```

### *Single Responsibility Principle* - SRP

* Eviter les [*god objects*](https://en.wikipedia.org/wiki/God_object)
* Principe de diviser pour mieux régner
* e.g. trois concepts identifiés
    - Lire un entier au clavier
    - Calculer l'inverse d'un entier
    - Afficher le résultat à l'écran
* ***how-to*** : Afficher le carré en plus de l'inverse ?

Lecture d'un entier

```java
import java.util.Scanner;

public class KeyboardReader {
  private Scanner in;

  public KeyboardReader() {
    this.in = new Scanner(System.in);
  }

  public int readInt() {
    return in.nextInt();
  }
}
```

Calcul de l'inverse

```java
public class InverseProcess {
  public double do(final int intValue) {
    return 1D / intValue;
  }
}
```

Affichage du résultat

```java
public class ScreenWriter {
  public void write(final String value) {
    System.out.println(value);
  }
}
```

Orchestration

```java
public class Program {
  public static void main(final String[] args) {
    final KeyboardReader keyboard = new KeyboardReader();
    final InverseProcess inverse = new InverseProcess();
    final ScreenWriter display = new ScreenWriter();

    display.write("Inverse: " + inverse.do(keyboard.readInt()));
  }
}
```

### *[Inversion of Control](https://blog.imirhil.fr/linversion-de-controle-cest-bon-mangez-en.html)* - IoC

* Forte adhérence des composants :
    - Lire depuis un fichier et écrire dans une base de données ?
    - Calculer la racine carrée ?

#### Séparation des concepts

```java
public interface Reader {
  int readInt();
}

public interface Process {
  String do(int value);
}

public interface Writer {
  void write(String value);
}

public interface Operation<T> {
  void compute();
}

import java.util.Scanner;

public class KeyboardReader extends Reader {
  private Scanner in;

  public KeyboardReader() {
    this.in = new Scanner(System.in);
  }

  public int readInt() {
    return in.nextInt();
  }
}

public class InverseProcess extends Process {
  public String do(final int intValue) {
    return "Inverse: " + 1D / intValue;
  }
}

public class SquareProcess extends Process {
  public String do(final int intValue) {
    return "Square: " + intValue * intValue;
  }
}

public class ScreenWriter extends Writer {
  public void write(final String value) {
    System.out.println(value);
  }
}

public class IntegerOperation extends Operation<Integer> {
  private Reader reader;
  private Process process;
  private Writer writer;

  public void compute() {
    writer.write(process.do(reader.readInt()));
  }

  public void setReader(final Reader reader) {
    this.reader = reader;
  }

  public void setProcess(final Process process) {
    this.process = process;
  }

  public void setWriter(final Writer writer) {
    this.writer = writer;
  }
}

public class Program {
  public static void main(final String[] args) {
    final Reader reader = new KeyboardReader();
    final Writer writer = new ScreenWriter();

    final Process inverseProcess = new InverseProcess();
    final Process squareProcess = new SquareProcess();

    final Operation<Integer> inverse = new IntegerOperation();
    inverse.setReader(reader);
    inverse.setProcess(process);
    inverse.setWriter(writer);
    operation.compute();

    final Operation<Integer> square = new IntegerOperation();
    square.setReader(reader);
    square.setProcess(squareProcess);
    square.setWriter(writer);
    operation.compute();
  }
}
```

#### Injection des dépendances

* Beaucoup d'instanciations via `new`

```
import org.springframework.beans.factory.annotation.Autowired;

public class IntegerOperation extends Operation {
  @Autowired
  private Reader reader;
  @Autowired
  private Process process;
  @Autowired
  private Writer writer;

  public void compute() {
    writer.write(process.do(reader.readInt()));
  }
}
```

### *Liskov Substitution Principle* - LSP

### *Keep It Simple, Stupid* - KISS

### *Don't Repeat Yourself* - DRY

### *Law of Demeter* - LoD

> Ne parlez qu'aux gens que vous connaissez

### *Read The Fucking Manual* - RTFM

### i18n

* Ne pas se rendre dépendant d'une coutume
* `l10n` *Localization* Traduction des libellés
* Affichage des devises, des dates, des couleurs
* Ne pas le prévoir, c'est s'attendre à beaucoup de *refactoring*

### Dette technique

* Temps accumulé et ajouté à chaque nouvelle feature
* Viser à la réduire ou à la contenir

### Ne pas réinventer la roue

* Utiliser ce qui existe

## Tests

### Unitaire

* Tester **un** composant et pas ses dépendances
* Couvrir les lignes de code

#### Stub

* Créer des classes ayant le même comportement que les dépendances
* Avantage majeur : envisager tous les comportements possibles sans les provoquer
    - Fichier inexistant
    - Base de données en timeout
    - Coupure réseau
* Inconvénient majeur : il faut les créer des classes

#### Mock

* Simuler le comportement d'une dépendance sans l'appeler
* Préciser l'entrée à laquelle on réagit et la sortie que l'on produit

### Intégration

* S'assurer de la bonne intégration des composants entre eux.

```java
public class DateHelper {
  public static String now() {
    return new SimpleDateFormat("dd/MM/yyyy").format(new Date());
  }
}

public class MyService {
    public boolean isBefore(final Date value) throws ParseException {
        return new SimpleDateFormat("yyyy/MM/dd").parse(DateHelper.now()).before(value); // Mostly true
    }
}
```

### Fonctionnel

* Outils : [Cucumber](https://cucumber.io), [Fitnese](http://www.fitnesse.org), Robot Framework

### Charge

* Apache JMeter, Gatling

### Autres

* de sécurité *pen-testing*
* humains (*Quality Assurance*, *User eXperience*)

## Outils

### Git

* Gestion de la configuration
* Fonctionnement *à la ligne*
* Décentralisé, pas forcément besoin d'un serveur
* Branches, *cherry-pick*, tag

### Markdown

* Rédaction de documentation *content-centric*
* Aussi lisible brut que transformé (en HTML principalement)
* Intégré dans de nombreux outils : e.g. GitHub, JIRA, Blog

### Revue de code

* méthode du canard en plastique
* *pull-request*

### Qualimétrie

* [SonarQube](http://www.sonarqube.org), CodeSmell, Linter

### Organisation

* [JIRA](https://www.atlassian.com/software/jira/)
* [Trello](https://trello.com)

### IDE

* [vi/vim](http://www.vim.org) / [emacs](https://www.gnu.org/software/emacs/)
* [SublimeText](http://www.sublimetext.com) / [Atom](https://atom.io) / [Notepad++](https://notepad-plus-plus.org/fr/)
* [IntelliJ](https://www.jetbrains.com/idea/) / [Eclipse](https://eclipse.org/) / [NetBeans](https://netbeans.org) / [VisualStudio](https://www.visualstudio.com)
* Peu importe votre religion, il faut l'assumer et la maîtriser

### Déploiement

* [Jenkins](https://jenkins-ci.org), [Bamboo](https://www.atlassian.com/software/bamboo/)
* [Docker](https://www.docker.com), [Puppet](https://puppetlabs.com)

## Littérature

* [The Pragmatic Programmer](http://www.amazon.fr/dp/B003GCTQAE), *Andrew Hunt & David Thomas*
* [Clean Code](http://www.amazon.fr/dp/B001GSTOAM), *Robert C. Martin*
* [Effective Java](http://www.amazon.fr/dp/B00B8V09HY), *Joshua Bloch*
* [Reword](http://www.amazon.fr/dp/B003ELY7PG), *Jason Fried & David Heinemeier Hansson*