# *Patterns* de programmation


Objectif : faire du code **`SOLID`**

* **`S`** ingle Responsibility Principle
* **`O`** pen / Close
* **`L`** iskov Substitution Principle
* **`I`** nterface segregation
* **`D`** ependency Injection


## Un cas simple

> Toujours prendre un exemple stupide pour que tout le monde comprenne.

> Daniel Guillaume



Afficher l'inverse de l'entier saisi par l'utilisateur


```java
public class Program {
    public static void main(final String[] args) {
        System.out.println("Inverse: " + (1D / new Scanner(System.in).nextInt()));
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


## *Single Responsibility Principle* - SRP


Eviter les [*god objects*](https://en.wikipedia.org/wiki/God_object)

Principe de « diviser pour mieux régner »


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
private static final Pattern INTEGER = Pattern.compile("^[+-]?[0-9]+$");

public static Integer read(final String raw) {
    if (INTEGER.matcher(raw).matches()) {
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
    Optional<T> read();
}

public interface Operation<I, O> {
    Optional<O> compute(I value);
}

public interface Writer<T> {
    void write(T value) throws IOException;
}

public interface Process<I> {
    Logger logger = Logger.getLogger(Process.class.getSimpleName());

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
    public Optional<Double> compute(final Integer intValue) {
        return Optional.ofNullable(intValue).map(value -> 1D / value);
    }
}
```


Calcul du carré

```java
public class SquareOperation implements Operation<Integer, Integer> {
    @Override
    public Optional<Integer> compute(final Integer intValue) {
        return Optional.ofNullable(intValue).map(value -> value * value);
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

    public void write(final Object inverseValue) throws IOException {
        out.write(("Inverse: " + String.valueOf(inverseValue))
            .getBytes(StandardCharsets.UTF_8));
    }
}
```


Processus de traitement : lire - traiter - écrire

```java
public class ProcessImpl<I> implements Process<I> {
    private Reader<I> reader;
    private Operation<I, Object> operation;
    private Writer<Object> writer;

    @Override
    public Process execute() {
        try {
            writer.write(operation.compute(reader.read().orElse(null)).orElse(null));
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
        final Operation<Integer, Double> inverse = new InverseOperation();
        final Writer<Object> inverseWriter = new InverseWriter(System.out);
        final Operation<Integer, Integer> square = new SquareOperation();
        final Writer<Object> squareWriter = new SquareWriter(System.out);

        new ProcessImpl<Integer>()
                .setReader(reader)
                .setOperation(inverse)
                .setWriter(inverseWriter)
                .execute()
                .setOperation(square)
                .setWriter(squareWriter)
                .execute();
    }
}
```



Quels sont les problèmes ?


Déclaration des *getters/setters* fastidieuse


Toujours des instanciations avec arguments, mais externalisées


Connaissance des dépendances entre classes
* l'ordre est important
* l'arbre également


### Injection de dépendances


**Service** de calcul d'une inverse

```java
@Service
public class InverseOperation implements Operation<Integer, Object> {
    @Override
    public Optional<Object> compute(final Integer intValue) {
        return Optional.ofNullable(intValue).map(value -> 1D / value);
    }
}
```


Injection de dépendances dans le constructeur

```java
@Service
public class IntegerReader implements Reader<Integer> {
    private Scanner in;

    @Autowired
    public IntegerReader(final InputStream input) {
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
public class InverseWriter implements Writer<Object> {
    @Autowired
    private OutputStream out;

    public void write(final Object inverseValue) throws IOException {
        out.write(("Inverse: " + Optional.ofNullable(inverseValue).orElse(""))
            .getBytes(StandardCharsets.UTF_8));
    }
}
```


Déclaration des comportements attendus

```java
@Component
public class ProcessImpl<I> implements Process {
    @Autowired
    private Reader<I> reader;
    @Autowired
    private Operation<I, Object> operation;
    @Autowired
    private Writer<Object> writer;

    @Override
    public int execute() {
        try {
            writer.write(operation.compute(reader.read().orElse(null)).orElse(null));
            return 0;
        } catch (final IOException e) {
            getLogger().log(Level.SEVERE, "Something went wrong", e);
            return 1;
        }
    }
}
```


Configuration de l'application et démarrage par auto-configuration

```java
@Configuration
@EnableAutoConfiguration
@ComponentScan("org.vibioh.spring")
public class Program implements CommandLineRunner {
    @Autowired
    private Process inverse;
    @Bean
    public InputStream getInput() { return System.in; }
    @Bean
    public OutputStream getOuput() { return System.out; }

    @Override
    public void run(final String... strings) throws Exception {
        inverse.execute();
    }

    public static void main(final String[] args) {
        SpringApplication.run(Program.class, args);
    }
}
```


## *Liskov Substitution Principle* - LSP


> Chaque sous-classe doit avoir le même comportement que la classe mère


## *Don't Repeat Yourself* - DRY


En dehors de vos GIF & Vines, personne n'aime se répéter


Extraire toutes les constantes du code, aussi appelés *magic number*



Implémentation ne respectant pas le DRY

```java
public class BadDry {
    public static void main(final String[] args) {
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
public class GoodDry {
    private static String FIRST_VALUE = "8000";
    private static String SECOND_VALUE = "Emile";

    public static void main(final String[] args) {
        forceArgValue(FIRST_VALUE, args, 0);
        forceArgValue(SECOND_VALUE, args, 1);
        Logger.getAnonymousLogger().info(Arrays.toString(args));
    }

    private static void forceArgValue(final String expectedValue,
                                      final String[] array,
                                      final int i) {
        if (array.length > i && !expectedValue.equals(array[i])) {
            array[i] = expectedValue;
        }
    }
}
```


Transformation de l'appel répété par une boucle

```java
public class BestDry {
    private static String[] EXPECTED_VALUES = {"8000", "Emile"};

    public static void main(final String[] args) {
        forceArgValues(args);
        Logger.getAnonymousLogger().info(Arrays.toString(args));
    }

    private static void forceArgValues(final String[] array) {
        for (int i = 0, size = array.length; i < size; ++i) {
            if (!EXPECTED_VALUES[i].equals(array[i])) {
                array[i] = EXPECTED_VALUES[i];
            }
        }
    }
}
```


## *Internationalization* - i18n


> Ne pas se rendre dépendant d'une coutume


Affichage particuliers
* des libellés (l10n - *Localization*)
* des nombres (e.g. 1,000 ~= 1 000)
* des dates (e.g. 1/5/2015 ~= 5/1/15 )
* des devises (e.g. $ 9.99 ~= 9,99 €)
* des couleurs (e.g. daltoniens)


Pas que de l'affichage :
* quid des fuseaux horaires ?
* lois spécifiques d'un pays ?


Ne pas le prévoir, c'est s'attendre à beaucoup de *refactoring*


L'ajout d'une *Locale* doit rester simple

Mettre toutes les règles dans un fichier


## *Law of Demeter* - LoD


> Ne parlez qu'aux gens que vous connaissez


Eviter l'effet tunnel de l'appel de composants

```java
promotion
  .getStudents().get(0) // Récupération d'un étudiant
  .getAddress().getCountry() // Récupération de son pays
  .getLocale(); // Récupération des informations de i18n
```


Que faire en cas d'évolutions de la classe `Etudiant` ?

e.g. Ce n'est plus une liste mais une *map* clé/valeur


Comment gérer les `null-check` ? Les exceptions ?


Fournir des méthodes qui vont, de proche en proche, récupérer l'information souhaitée
