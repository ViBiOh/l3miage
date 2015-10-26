# Génie logiciel

Vincent Boutour
Consultant formateur chez [Zenika](http://www.zenika.com)

[@ViBiOh](https://twitter.com/ViBiOh)

## Sommaire

[TOC]

## Principe de programmation

### Programme

Afficher l'inverse de l'entier fourni par l'utilisateur

```java
public class Program {
  public static void main(final String[] args) {
    System.out.println("Inverse: " + (1D / new Scanner(System.in).readInt()));
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
* Comment afficher le carré en plus de l'inverse ?

```java
public class KeyboardReader {
  private Scanner in;

  public KeyboardReader() {
    this.in = new Scanner(System.in);
  }

  public int readInt() {
    return in.readInt();
  }
}

public class InverseProcess {
  public double do(final int intValue) {
    return 1D / intValue;
  }
}

public class ScreenWriter {
  public void write(final String value) {
    System.out.println(value);
  }
}

public class Program {
  public static void main(final String[] args) {
    final KeyboardReader keyboard = new KeyboardReader();
    final InverseProcess process = new InverseProcess();
    final ScreenWriter display = new ScreenWriter();

    display.write("Inverse: " + process.do(keyboard.readInt()));
  }
}
```

### *[Inversion of Control](https://blog.imirhil.fr/linversion-de-controle-cest-bon-mangez-en.html)* - IoC

* Beaucoup d'instanciations via `new` sans mutualisation
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

public class KeyboardReader extends Reader {
  private Scanner in;

  public KeyboardReader() {
    this.in = new Scanner(System.in);
  }

  public int readInt() {
    return in.readInt();
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

### *Keep It Simple Stupid* - KISS

### *Don't Repeat Yourself* - DRY

### *Law of Demeter* - LoD

### i18n

* Ne pas se rendre dépendant d'une coutume
* l10n - Localization - Traduction des libellés
* Affichage des devises, des dates

### Dette technique

* Temps accumulé et ajouté à chaque nouvelle feature
* Viser à la réduire ou à la contenir

## Tests

### Unitaire

* Stub
* Mock

### Intégration

```java
public class DateHelper {
  public static String now() {
    return new SimpleDateFormat("dd/MM/yyyy").format(new Date());
  }
}

public class MonService {
    public boolean isBefore(final Date value) throws ParseException {
        return new SimpleDateFormat("yyyy/MM/dd").parse(DateHelper.now()).before(value); // Mostly true
    }
}
```

### Fonctionnel

### Charge

### Autres

* de sécurité *pen-testing*
* humains (*Quality Assurance*, *User eXperience*)

## Outils

### Git

### Markdown

### Revue de code

* méthode du canard en plastique
* *pull-request*

### IDE

* vi / emacs
* Notepad++ / Atom / SublimeText
* Eclipse / IntelliJ / VisualStudio

### Déploiement
