# Génie logiciel

Vincent Boutour
Consultant formateur chez [Zenika](http://www.zenika.com)

[@ViBiOh](https://twitter.com/ViBiOh)

## Sommaire

[TOC]

## Principe de programmation

### *Inversion of Control*

### *Single Responsibility Principle*

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
