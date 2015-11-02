# *Patterns* de programmation


## Un cas simple

> Toujours prendre un exemple stupide pour que tout le monde comprenne.

> Daniel Guillaume


Afficher l'inverse de l'entier fourni par l'utilisateur


```java
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


Aucune réutilisabilité


Multiples raisons d'évolution


## *Single Responsibility Principle* - SRP


* Eviter les [*god objects*](https://en.wikipedia.org/wiki/God_object)
* Principe de diviser pour mieux régner


Lecture d'un entier

```java
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


Orchestration

```java
public class Program {
  public static void main(final String[] args) throws IOException {
    final IntegerReader integerReader = new IntegerReader(System.in);
    final InverseOperation inverse = new InverseOperation();
    final InverseWriter display = new InverseWriter(System.out);

    display.write(inverse.compute(integerReader.readInt()));
  }
}
```


Quels sont les problèmes ?


Nombreuses instanciations, avec des arguments


Composants intimement liés


Testabilité complexe voire impossible


## *[Inversion of Control](https://blog.imirhil.fr/linversion-de-controle-cest-bon-mangez-en.html)* - IoC


L'application a besoin de comportements, pas d'implémentations


Les comportements existent :
* sous la forme de *singletons*
* n'ont pas à être instanciés


### Définition des comportements

```java
public interface Reader<T> {
  T read();
}

public interface Operation<I, O> {
    Optional<O> compute(Optional<I> value);
}

public interface Writer<T> {
  void write(Optional<T> value) throws IOException;
}

public interface Process<I> {
  Process execute();

  Process setReader(final Reader<I> reader);
  Process setOperation(final Operation<I, Object> operation);
  Process setWriter(final Writer<Object> writer);
}
```


### Implémentation des comportements


Lecture d'un entier
```java
public class IntegerReader implements Reader<Integer> {
  private Scanner in;

  public IntegerReader(final InputStream input) {
    this.in = new Scanner(input);
  }

  @Override
  public Optional<Integer> read() {
    return Optional.ofNullable(in.nextInt());
  }
}
```


Calcul de l'inverse
```java
public class InverseOperation implements Operation<Integer, Double> {
  @Override
  public Optional<Double> compute(final Optional<Integer> intValue) {
    return intValue.map(value -> 1D / value);
  }
}
```


Calcul du carré
```java
public class SquareOperation implements Operation<Integer, Integer> {
  @Override
  public Optional<Integer> compute(final Optional<Integer> intValue) {
    return intValue.map(value -> value * value);
  }
}
```


Ecriture du résultat
```java
public class InverseWriter implements Writer<Object> {
  private OutputStream out;

  public InverseWriter(final OutputStream out) {
    this.out = out;
  }

  public void write(final Optional<Object> inverseValue) throws IOException {
    if (inverseValue.isPresent()) {
      out.write(("Inverse: " + inverseValue.get()).getBytes(StandardCharsets.UTF_8));
    }
  }
}
```


Processus de traitement : lire - traiter - écrire
```java
public class ProcessImpl<I> implements Process<I> {
  private static final Logger logger = Logger.getLogger(Process.class.getSimpleName());

  private Reader<I> reader;
  private Operation<I, Object> operation;
  private Writer<Object> writer;

  @Override
  public Process execute() {
    try {
      writer.write(operation.compute(reader.read()));
    } catch (final IOException e) {
      logger.log(Level.SEVERE, "Something went wrong", e);
    }
    return this;
  }

  [...]
}
```


Processus de traitement : des méthodes à générer
```java
[...]

@Override
public Process setReader(final Reader<I> reader) {
  this.reader = reader;
  return this;
}

@Override
public Process setOperation(final Operation<I, Object> operation) {
  this.operation = operation;
  return this;
}

@Override
public Process setWriter(final Writer<Object> writer) {
  this.writer = writer;
  return this;
}
```


### Exécution


Orchestration

```java
public class Program {
  public static void main(final String[] args) {
    final Reader<Integer> reader = new IntegerReader(System.in);
    final Writer<Object> writer = new InverseWriter(System.out);
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



Quels sont les problèmes ?


### Injection des dépendances


```java
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