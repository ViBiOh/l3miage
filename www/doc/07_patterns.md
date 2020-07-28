# _Patterns_ de programmation

> « There are only two hard things in Computer Science: cache invalidation and naming things »

> Phil Karlton

Objectif : faire du code **`SOLID`**

- **`S`** ingle Responsibility Principle
- **`O`** pen / Close
- **`L`** iskov Substitution Principle
- **`I`** nterface segregation
- **`D`** ependency Injection

> « Design depends largely on constraints. »

> Charles Eames

## Un cas simple

> « Toujours prendre un exemple stupide pour que tout le monde comprenne. »

> Daniel Guillaume

Afficher l'inverse de l'entier saisi par l'utilisateur

```java
class Program {
  public static void main(String[] args) {
    System.out.println("Inverse: " +
      (1D / new Scanner(System.in).nextInt()));
  }
}
```

Quels sont les problèmes ?

Combien d'actions sont réalisées ?

La classe fait ~~trois ?~~ ~~cinq ?~~ trop de choses :

1. Lecture
   1. au clavier
   1. d'un entier
1. Calcul de l'inverse de l'entier
1. Affichage
   1. à l'écran
   1. du résultat

Aucune réutilisabilité

Multiples raisons d'évolution

## _Single Responsibility Principle_ - SRP

Eviter les [_god objects_](https://en.wikipedia.org/wiki/God_object)

Principe de « diviser pour mieux régner »

Lecture d'un entier

```java
class IntegerReader {
  private Scanner in;

  public IntegerReader(InputStream input) {
    this.in = new Scanner(input);
  }

  public int readInt() {
    return in.nextInt();
  }
}
```

Juste un proxy ? Justement, ajoutons une validation par _regex_

`class IntegerReader`

```java
private static Pattern INT = Pattern.compile("^[+-]?[0-9]+$");

public Integer read(String raw) {
  if (INT.matcher(raw).matches()) {
    return Integer.parseInt(raw, 10);
  }
  return null;
}
```

Calcul de l'inverse

```java
class InverseOperation {
  public double compute(int value) {
    return 1D / value;
  }
}
```

Affichage du résultat

```java
class InverseWriter {
  private OutputStream out;

  public InverseWriter(OutputStream out) {
    this.out = out;
  }

  public void write(double value) throws IOException {
    out.write(
      ("Inverse: " + value).getBytes(StandardCharsets.UTF_8)
    );
  }
}
```

Orchestration

```java
class Program {
  public static void main(String[] args) throws IOException {
    IntegerReader integerReader = new IntegerReader(System.in);
    InverseOperation inverse = new InverseOperation();
    InverseWriter display = new InverseWriter(System.out);

    display.write(inverse.compute(integerReader.readInt()));
  }
}
```

Quels sont les problèmes ?

Nombreuses instanciations, avec des arguments

Composants intimement liés

Testabilité complexe voire impossible

## [Inversion of Control](https://blog.imirhil.fr/2013/05/19/inversion-de-controle-cest-bon-mangez-en.html) - IoC

L'application a besoin de comportements, pas d'implémentations

Les comportements existent :

- sous la forme de _singletons_
- n'ont pas à être instanciés

### Définition des comportements

```java
public interface Reader<T> {
  Optional<T> read();
}

public interface Operation<I, O> {
  Optional<O> compute(I value);
}

public interface Writer<T> {
  void write(T value) throws IOException;
}
```

### Orchestration

```java
public interface Process<I> {
  Logger logger = Logger.getLogger(
    Process.class.getSimpleName()
  );

  Process execute();
  Process setReader(Reader<I> reader);
  Process setOperation(Operation<I, Object> operation);
  Process setWriter(Writer<Object> writer);
}
```

### Implémentation des comportements

Lecture d'un entier

```java
class IntegerReader implements Reader<Integer> {
  private Scanner in;

  public IntegerReader(InputStream input) {
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
class InverseOperation implements Operation<Integer, Double> {
  @Override
  public Optional<Double> compute(Integer value) {
    return Optional.ofNullable(value).map(e -> 1D / e);
  }
}
```

Calcul du carré

```java
class SquareOperation implements Operation<Integer, Integer> {
  @Override
  public Optional<Integer> compute(Integer value) {
    return Optional.ofNullable(value).map(e -> e * e);
  }
}
```

Ecriture du résultat

```java
class InverseWriter implements Writer<Object> {
  private OutputStream out;

  public InverseWriter(OutputStream out) {
      this.out = out;
  }

  public void write(Object value) throws IOException {
    out.write(("Inverse: " + String.valueOf(value))
      .getBytes(StandardCharsets.UTF_8));
  }
}
```

Processus de traitement : lire - traiter - écrire

```java
class ProcessImpl<I> implements Process<I> {
  private Reader<I> reader;
  private Operation<I, Object> operation;
  private Writer<Object> writer;

  @Override
  public Process execute() {
    try {
      Integer input = reader.read().orElse(null);
      writer.write(operation.compute(input).orElse(null));
    } catch (IOException e) {
      logger.log(Level.SEVERE, "Something went wrong", e);
    }
    return this;
  }
}
```

Processus de traitement : des méthodes à générer

```java
  @Override
  public Process setReader(Reader<I> reader) {
    this.reader = reader;
    return this;
  }
  @Override
  public Process setOperation(Operation<I, Object> operation) {
    this.operation = operation;
    return this;
  }
  @Override
  public Process setWriter(Writer<Object> writer) {
    this.writer = writer;
    return this;
  }
```

### Exécution

Orchestration

```java
class Program {
  public static void main(String[] args) {
    Reader<Integer> reader = new IntegerReader(System.in);
    Operation<Integer, Double> inverse = new InverseOperation();
    Writer<Object> inverseWriter = new InverseWriter(System.out);
    Operation<Integer, Integer> square = new SquareOperation();
    Writer<Object> squareWriter = new SquareWriter(System.out);

    new ProcessImpl<Integer>().setReader(reader)
          .setOperation(inverse).setWriter(inverseWriter)
          .execute()
          .setOperation(square).setWriter(squareWriter)
          .execute();
  }
}
```

Quels sont les problèmes ?

Déclaration des _getters/setters_ fastidieuse

Toujours des instanciations avec arguments, mais externalisées

Connaissance des dépendances entre classes

- l'ordre est important
- l'arbre également

### Injection de dépendances

**Service** de calcul d'une inverse

```java
@Service
class InverseOperation implements Operation<Integer, Object> {
  @Override
  public Optional<Object> compute(Integer value) {
    return Optional.ofNullable(value).map(e -> 1D / e);
  }
}
```

Injection de dépendances dans le constructeur

```java
@Service
class IntegerReader implements Reader<Integer> {
  private Scanner in;

  @Autowired
  public IntegerReader(InputStream input) {
    this.in = new Scanner(input);
  }

  @Override
  public Optional<Integer> read() {
    return Optional.ofNullable(in.nextInt());
  }
}
```

Injection de dépendances automatique

```java
@Service
class InverseWriter implements Writer<Object> {
  @Autowired
  private OutputStream out;

  public void write(Object value) throws IOException {
    out.write(
      ("Inverse: " + Optional.ofNullable(value).orElse(""))
        .getBytes(StandardCharsets.UTF_8)
    );
  }
}
```

Déclaration des comportements attendus

```java
@Component
class ProcessImpl<I> implements Process {
  @Autowired
  private Reader<I> reader;
  @Autowired
  private Operation<I, Object> operation;
  @Autowired
  private Writer<Object> writer;
}
```

Utilisation des comportements

```java
  @Override
  public int execute() {
    try {
      Integer input = reader.read().orElse(null);
      writer.write(operation.compute(input).orElse(null));
      return 0;
    } catch (IOException e) {
      getLogger().log(Level.SEVERE, "Something went wrong", e);
      return 1;
    }
  }
```

Configuration de l'application

```java
@Configuration
@EnableAutoConfiguration
@ComponentScan("org.vibioh.spring")
class Program implements CommandLineRunner {
  @Autowired
  private Process inverse;
  @Bean
  public InputStream getInput() { return System.in; }
  @Bean
  public OutputStream getOuput() { return System.out; }

  @Override
  public void run(String... strings) throws Exception {
    inverse.execute();
  }
}
```

Démarrage par auto-configuration

```
  public static void main(String[] args) {
    SpringApplication.run(Program.class, args);
  }
```

## _Liskov Substitution Principle_ - LSP

> Chaque sous-classe doit avoir le même comportement que la classe mère

## _Don't Repeat Yourself_ - DRY

En dehors de vos GIF & _feu Vines_, personne n'aime se répéter

Extraire toutes les constantes du code, aussi appelés _magic number_

Implémentation ne respectant pas le DRY

```java
class BadDry {
  public static void main(String[] args) {
    if (args.length > 0 && !"8000".equals(args[0])) {
      args[0] = "8000";
    }
    if (args.length > 1 && !"Emile".equals(args[1])) {
      args[1] = "Emile";
    }
    Logger.getAnonymousLogger().info(Arrays.toString(args));
  }
}
```

Extraction des constantes et mutualisation du code

```java
class GoodDry {
  private static String FIRST_VALUE = "8000";
  private static String SECOND_VALUE = "Emile";
  public static void main(String[] args) {
    forceArgValue(FIRST_VALUE, args, 0);
    forceArgValue(SECOND_VALUE, args, 1);
    Logger.getAnonymousLogger().info(Arrays.toString(args));
  }
  private static void forceArgValue(String expectedValue,
                                    String[] array, int i) {
    if (array.length > i && !expectedValue.equals(array[i])) {
      array[i] = expectedValue;
    }
  }
}
```

Transformation de l'appel répété par une boucle

```java
class BestDry {
  private static String[] EXPECTED_VALUES = {"8000", "Emile"};
  public static void main(String[] args) {
    forceArgValues(args);
    Logger.getAnonymousLogger().info(Arrays.toString(args));
  }
  private static void forceArgValues(String[] array) {
    for (int i = 0, size = array.length; i < size; ++i) {
      if (!EXPECTED_VALUES[i].equals(array[i])) {
        array[i] = EXPECTED_VALUES[i];
      }
    }
  }
}
```

## _Internationalization_ - i18n

> Ne pas se rendre dépendant d'une coutume

Affichage particuliers

- des libellés (l10n - _Localization_)
- des nombres (e.g. 1,000 ~= 1 000)
- des dates (e.g. 1/5/2015 ~= 5/1/15 )
- des devises (e.g. \$ 9.99 ~= 9,99 €)
- des couleurs (e.g. daltoniens)

Pas que de l'affichage :

- quid des fuseaux horaires ?
- lois spécifiques d'un pays ?

Ne pas le prévoir, c'est s'attendre à beaucoup de _refactoring_

L'ajout d'une _Locale_ doit rester simple

Mettre toutes les règles dans un fichier

## _Law of Demeter_ - LoD

> Ne parlez qu'aux gens que vous connaissez

Eviter l'effet tunnel de l'appel de composants

```java
promotion
  .getStudents().get(0) // Récupération d'un étudiant
  .getAddress().getCountry() // Récupération de son pays
  .getLocale(); // Récupération des informations de i18n
```

Que faire en cas d'évolutions de la classe `Etudiant` ?

e.g. Ce n'est plus une liste mais une _map_ clé/valeur

Comment gérer les `null-check` ? Les exceptions ?

Fournir des méthodes qui vont, de proche en proche, récupérer l'information souhaitée
