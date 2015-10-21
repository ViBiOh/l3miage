# Génie logiciel

Vincent Boutour
Consultant formateur chez [Zenika](www.zenika.com)

@ViBiOh

## Sommaire

[TOC]

## Principe de programmation

### *Inversion of Control*

### *Single Responsibility Principle*

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