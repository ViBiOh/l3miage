# *Patterns* de programmation

---

## Un cas simple

Afficher l'inverse de l'entier fourni par l'utilisateur en Java

---

```java
import java.util.Scanner;

public class Program {
  public static void main(final String[] args) {
    System.out.println("Inverse: " + 
        (1D / new Scanner(System.in).nextInt()));
  }
}
```

---

## *Single Responsibility Principle* - SRP

* Eviter les [*god objects*](https://en.wikipedia.org/wiki/God_object)
* Principe de diviser pour mieux régner
* e.g. trois concepts identifiés
    - Lire un entier au clavier
    - Calculer l'inverse d'un entier
    - Afficher le résultat à l'écran
* ***how-to*** : Afficher le carré en plus de l'inverse ?

---

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

---

Calcul de l'inverse

```java
public class InverseOperation {
  public double compute(final int intValue) {
    return 1D / intValue;
  }
}
```

---

Affichage du résultat

```java
public class ScreenWriter {
  public void write(final String value) {
    System.out.println(value);
  }
}
```

---

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

---

## *[Inversion of Control](https://blog.imirhil.fr/linversion-de-controle-cest-bon-mangez-en.html)* - IoC

* Forte adhérence des composants :
    - Lire depuis un fichier et écrire dans une base de données ?
    - Calculer la racine carrée ?

---

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

---

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

---

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

---

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

---

```java
public class ScreenWriter implements Writer<String> {
  @Override
  public void write(final String value) {
    System.out.println(value);
  }
}
```

---

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

---

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

---

### Injection des dépendances

* Beaucoup d'instanciations via `new` encore

---

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

---

## *Liskov Substitution Principle* - LSP

---

## *Don't Repeat Yourself* - DRY

---

## *Law of Demeter* - LoD

---

> Ne parlez qu'aux gens que vous connaissez

---

## i18n

* Ne pas se rendre dépendant d'une coutume
* `l10n` *Localization* Traduction des libellés
* Affichage des devises, des dates, des couleurs
* Ne pas le prévoir, c'est s'attendre à beaucoup de *refactoring*