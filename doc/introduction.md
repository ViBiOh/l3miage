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
public class InverseOperation {
  public double compute(final int intValue) {
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
    final InverseOperation inverse = new InverseOperation();
    final ScreenWriter display = new ScreenWriter();

    display.write("Inverse: " + inverse.compute(keyboard.readInt()));
  }
}
```

### *[Inversion of Control](https://blog.imirhil.fr/linversion-de-controle-cest-bon-mangez-en.html)* - IoC

* Forte adhérence des composants :
    - Lire depuis un fichier et écrire dans une base de données ?
    - Calculer la racine carrée ?

#### Définition des comportements

```java
public interface Reader<T> {
  T read();
}

public interface Operation<I, O> {
  O compute(I value);
  String computeVerbose(I value);
}

public interface Writer<T> {
  void write(T value);
}

public interface Process<I> {
  Process execute();

  Process setReader(final Reader<I> reader);
  Process setOperation(final Operation<I, ?> operation);
  Process setWriter(final Writer<String> writer);
}
```

#### Implémentation des comportements

```java
import java.util.Scanner;

public class KeyboardReader implements Reader<Integer> {
  private Scanner in;

  public KeyboardReader() {
    this.in = new Scanner(System.in);
  }

  @Override
  public Integer read() {
    return in.nextInt();
  }
}
```

```java
public class InverseOperation implements Operation<Integer, Double> {
  @Override
  public Double compute(final Integer intValue) {
    return 1D / intValue;
  }

  @Override
  public String computeVerbose(Integer value) {
    return "Inverse:" + this.compute(value);
  }
}
```

```java
public class SquareOperation implements Operation<Integer, Integer> {
  @Override
  public Integer compute(final Integer value) {
    return value * value;
  }

  @Override
  public String computeVerbose(Integer value) {
    return "Square: " + this.compute(value);
  }
}
```

```java
public class ScreenWriter implements Writer<String> {
  @Override
  public void write(final String value) {
    System.out.println(value);
  }
}
```

```java
public class ProcessImpl<I> implements Process<I> {
  private Reader<I> reader;
  private Operation<I, ?> operation;
  private Writer<String> writer;

  @Override
  public Process execute() {
    writer.write(operation.computeVerbose(reader.read()));
    return this;
  }

  @Override
  public Process setReader(final Reader<I> reader) {
    this.reader = reader;
    return this;
  }

  @Override
  public Process setOperation(final Operation<I, ?> operation) {
    this.operation = operation;
    return this;
  }

  @Override
  public Process setWriter(final Writer<String> writer) {
    this.writer = writer;
    return this;
  }
}
```

#### Exécution

```java
public class Program {
  public static void main(final String[] args) {
    final Reader<Integer> reader = new KeyboardReader();
    final Writer<String> writer = new ScreenWriter();
    final Operation<Integer, Double> inverse = new InverseOperation();
    final Operation<Integer, Integer> square = new SquareOperation();

    new ProcessImpl<Integer>()
        .setReader(reader)
        .setOperation(inverse)
        .setWriter(writer)
        .execute()
        .setOperation(square)
        .execute();
  }
}
```

#### Injection des dépendances

* Beaucoup d'instanciations via `new` encore

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
* [Mockito](http://mockito.org) voire [PowerMock](https://github.com/jayway/powermock) (pour *mocker* les classes statiques)

```java
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

public class IntegerOperationTest {
  @InjectMocks
  private IntegerOperation operation;
  @Mock
  private Reader reader;
  @Mock
  private Process process;
  @Mock
  private Writer writer;

  @Before
  private void setUp() {
    MockitoAnnotations.initMocks(this);
  }

  @Test(expected = IllegalArgumentException.class)
  public void compute_null() {
    when(reader.readInt()).thenReturn(null);
    operation.compute();
  }
}
```

### Intégration

* S'assurer de la bonne intégration :
    - des composants entre eux
    - des versions entre elles (e.g. Mockito *2.0* et PowerMock *1.6.2* ne sont pas compatibles)

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

## Méthodes pratiques

### Cycle V

### Agile - Scrum

### Communication

> Seul on va plus vite, ensemble on va plus loin.

* Slack, RocketChat, HipChat
* Acquérir le *team-spirit*

### Principe du *boy-scout*

> *Leave the campground cleaner that you found it.*

* Amélioration continue du logiciel
* Pas de coupable, pensez en équipe et pas en individuel

### *Read The Fucking Manual* - RTFM

* La réponse est bien souvent dans la documentation
* La réponse est sur [Google](http://lmgtfy.com/?q=google.fr&l=1) / [StackOverflow](http://lmgtfy.com/?q=stacksverflow.com&l=1)
* La réponse est dans les *issues* GitHub
* La réponse est [42](https://en.wikipedia.org/wiki/42_(number)#The_Hitchhiker.27s_Guide_to_the_Galaxy)

## Littérature

* [The Pragmatic Programmer](http://www.amazon.fr/dp/B003GCTQAE), *Andrew Hunt & David Thomas*
* [Clean Code](http://www.amazon.fr/dp/B001GSTOAM), *Robert C. Martin*
* [Effective Java](http://www.amazon.fr/dp/B00B8V09HY), *Joshua Bloch*
* [Reword](http://www.amazon.fr/dp/B003ELY7PG), *Jason Fried & David Heinemeier Hansson*