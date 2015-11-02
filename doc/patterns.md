# *Patterns* de programmation


## Un cas simple

> Toujours prendre un exemple stupide pour que tout le monde comprenne.

> Daniel Guillaume


Afficher l'inverse de l'entier fourni par l'utilisateur


```java
import java.util.Scanner;

public class Program {
  public static void main(final String[] args) {
    System.out.println("Inverse: " + (1D / new Scanner(System.in).nextInt()));
  }
}
```


Quels sont les problèmes ?


Combien d'actions sont réalisées ?


La classe fait ~~trois~~ ~~cinq~~ trop de choses :

1. Lecture
    1. au clavier
    1. d'un entier
1. Calcul de l'inverse de l'entier
1. Affichage
    1. à l'écran
    1. du résultat


N'est pas réutilisable


Peut évoluer pour diverses raisons


## *Single Responsibility Principle* - SRP


* Eviter les [*god objects*](https://en.wikipedia.org/wiki/God_object)
* Principe de diviser pour mieux régner


Lecture d'un entier

```java
import java.io.InputStream;
import java.util.Scanner;

public class IntegerReader {
  private Scanner in;

  public IntegerReader(final InputStream input) {
    this.in = new Scanner(input);
  }

  public int readInt() {
    return in.nextInt();
  }
}
```


Juste un proxy ? Justement, ajoutons une validation par *regex*


```class IntegerReader```
```java
import java.util.regex.Pattern;

[...]

public static Integer read(final String raw) {
  if (Pattern.compile("^[+-]?[0-9]+$").matcher(raw).matches()) {
    return Integer.parseInt(raw);
  }
  return null;
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
import java.io.IOException;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;

public class InverseWriter {
  private OutputStream out;

  public InverseWriter(final OutputStream out) {
    this.out = out;
  }

  public void write(final double inverseValue) throws IOException {
    out.write(("Inverse: " + inverseValue).getBytes(StandardCharsets.UTF_8));
  }
}
```


Quels sont les problèmes ?


Orchestration

```java
import java.io.IOException;

public class Program {
  public static void main(final String[] args) throws IOException {
    final IntegerReader integerReader = new IntegerReader(System.in);
    final InverseOperation inverse = new InverseOperation();
    final InverseWriter display = new InverseWriter(System.out);

    display.write(inverse.compute(integerReader.readInt()));
  }
}
```


## *[Inversion of Control](https://blog.imirhil.fr/linversion-de-controle-cest-bon-mangez-en.html)* - IoC

* Forte adhérence des composants :
    - Lire depuis un fichier et écrire dans une base de données ?
    - Calculer la racine carrée ?


### Définition des comportements

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


### Implémentation des comportements

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


### Exécution

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


### Injection des dépendances

* Beaucoup d'instanciations via `new` encore


```java
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


## *Liskov Substitution Principle* - LSP


## *Don't Repeat Yourself* - DRY


## *Law of Demeter* - LoD


> Ne parlez qu'aux gens que vous connaissez


## i18n

* Ne pas se rendre dépendant d'une coutume
* `l10n` *Localization* Traduction des libellés
* Affichage des devises, des dates, des couleurs
* Ne pas le prévoir, c'est s'attendre à beaucoup de *refactoring*