# Génie logiciel

Vincent Boutour
Consultant formateur chez [Zenika](http://www.zenika.com)

[@ViBiOh](https://twitter.com/ViBiOh)

## Sommaire

[TOC]

## Principe de programmation

### Programme simple

Lire un entier et en donner son inverse

```javascript
'use strict';

let value = process.argv[2];
value.replace(/^([\+\-]?[0-9]+).*/gmi, (global, number) => {
  console.info('Inverse: ' + 1 / parseInt(number, 10));
  process.exit(0);
});
console.error('<' + process.argv[2] + '> is not a valid integer');
```

### *Single Responsibility Principle*

* Trois concepts identifiés
    - Lecture
    - Process
    - Ecriture

```javascript
'use strict';

class IntegerConverter {
  fromString(str) {
    if (str.search(/^[\+\-]?[0-9]+$/) !== -1) {
      return parseInt(str, 10);
    }
    throw new Error('<' + str + '> is not a valid integer');
  }
}

class InverseProcess {
  do(intValue) {
    return 1 / intValue;
  }
}

class ScreenWriter {
  info(value) {
    console.info(value);
  }

  error(value) {
    console.error(value);
  }
}

let converter = new IntegerConverter();
let inverse = new InverseProcess();
let display = new ScreenWriter();

try {
  display.info('Inverse: ' + inverse.do(converter.fromString(process.argv[2])));
} catch (err) {
  display.error(err.message);
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

### *Keep It Simple Stupid*

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
