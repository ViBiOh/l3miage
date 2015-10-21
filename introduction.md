# Génie logiciel

Vincent Boutour
Consultant formateur chez [Zenika](http://www.zenika.com)

[@ViBiOh](https://twitter.com/ViBiOh)

## Sommaire

[TOC]

## Principe de programmation

### Programme simple

Lire un entier et en donner son inverse

```java
public class Inverse {
    public static void main(final String[] args) {
        final Scanner scanner = new Scanner(System.in);
        System.out.println(1 / scanner.nextInt());
    }
}
```

### *Single Responsibility Principle*

* Trois concepts identifiés
    - Lecture
    - Process
    - Ecriture

```java
public class KeyboardReader {
  private final Scanner scanner = new Scanner(System.in);

  public int read() {
    return this.scanner.nextInt();
  }
}

public class InverseProcess {
  public int do(final int value) {
    return 1 / value;
  }
}

public class ScreenWriter {
  public int write(final int value) {
    System.out.println(value);
  }
}

public class Inverse {
  public static void main(final String[] args) {
    final KeyboardReader keyboard = new KeyboardReader();
    final InverseProcess inverse = new InverseProcess();
    final ScreenWriter screen = new ScreenWriter();

    screen.display(inverse.do(keyboard.read()));
  }
}
```

### *Inversion of Control*

* On fait plein de `new`
* Aucune mutualisation

#### Séparation des concepts

Lire un entier et en donner son inverse

```java
public class Inverse {
    public static void main(final String[] args) {
        final Scanner scanner = new Scanner(System.in);
        System.out.println(1 / scanner.nextInt());
    }
}
```

[Inversion de contrôle](https://blog.imirhil.fr/linversion-de-controle-cest-bon-mangez-en.html)

### i18n

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

### IDE

* vi / emacs
* Notepad++ / Atom / SublimeText
* Eclipse / IntelliJ / VisualStudio

### Déploiement
