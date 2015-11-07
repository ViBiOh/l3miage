# Tests


## Intérêts : Pourquoi tester ?

### Phrases trop souvent entendues


> Tester c'est douter.

Oui c'est vrai. Mais l'avenir est incertain.


> Ça prend du temps, ça ne sert à rien, il faut les maintenir.

Oui ça prend du temps, mais c'est de la [capitalisation](https://en.wikipedia.org/wiki/Stanford_marshmallow_experiment).

Ça sert énormément en cas de *refactoring*.


> Les tests c'est pour ceux qui ne savent pas coder.

Bien au contraire, écrire un test est un gage de qualité.


### Le réel intérêt des tests

Connaître le comportement attendu de l'application :
* s'en assurer
* en disposer pour *refactorer*


Vérifier qu'il n'y a pas de code inutile


Identifier les anomalies au plus tôt et ainsi, économiser !


#### Le bon test et le mauvais test


##### Le mauvais test

* est exécuté au moment de sa création, puis dès qu'il échoue, est désactivé *« parce qu'on a pas le temps »*
* est dans un projet séparé du code de l'application
* cherche à couvrir des lignes de codes et pas un besoin
* teste seulement les cas nominaux
* est long à s'exécuter


##### Le bon test


Il est exécuté fréquemment, à chaque modification du code de l'application
* doit donc être performant et rapide
* doit donc être maintenu
* à l'optimum, il est écrit avant le code de l'application


Il fait partie du code de l'application :
* ne doit pas en être séparé
* est maintenu en même temps que le code testé
* doit être aussi plaisant à maintenir
* doit être relu


Il couvre un besoin ou un cas technique ou fonctionnel
* ne pas tester tous les scénarios possibles et imaginables
* se concentrer sur le *use-case*, la *user-story* ou les « cas probables »


Il est créé dès qu'un bug a été détecté afin d'éviter qu'il ne revienne


## Test unitaire


Tester **un** seul composant et pas ses dépendances
* maîtriser le contexte d'exécution
* pas de dépendance au réseau / moment


Pouvoir rejouer chaque test unitairement et à tout moment

Aucune dépendance entre les tests :
* d'une même classe
* de classes différentes


Pouvoir se dire « ce composant est stable »


* Tester ce qui a du sens fonctionnel ou technique
* Un cas possible = un test
    - pas de vérifications multiples
    - pas de "scénario" alambiqués


Test du lecteur d'entiers

```java
public class IntegerReaderTest {
  @Test(expected = NullPointerException.class)
  public void read_null_exception() throws Exception {
    IntegerReader.read(null);
  }

  @Test
  public void read_match_null() throws Exception {
    assertEquals(Integer.valueOf(123), IntegerReader.read("123"));
  }

  @Test
  public void read_matchNegative_null() throws Exception {
    assertEquals(Integer.valueOf(-123), IntegerReader.read("-123"));
  }
}
```


Quels sont les problèmes ?


Comment tester le déroulement d'un algorithme ayant des dépendances mais sans en être dépendant ?

> e.g. sauvegarde dans une base de données, lecture d'un fichier, service qui calcule une information complexe


### Les Stub


Créer des classes ayant le même comportement que les dépendances


Fournir un jeu de données fixe pour les tests


Envisager les comportements probables sans les provoquer
* Fichier inexistant : oui
* Erreur de connexion : oui
* Base de données en timeout : non !
* Coupure réseau : non !


Stub `InputStream` pour `IntegerReader`

```java
public class InputStreamStub extends InputStream {
  private String[] VALUES = { "0", "123", "-123" };
  private int index;
  private int seq;

  public InputStreamStub(final int index) {
    this.index = index;
  }

  @Override
  public int read() throws IOException {
    if (seq < VALUES[index].length()) {
      return VALUES[index].charAt(seq++);
    }
    return -1;
  }
}
```


`IntegerReaderTest`

```java
public class IntegerReaderTest {
  private IntegerReader integerReader;

  @Test
  public void nextInt_123() {
    integerReader = new IntegerReader(new InputStreamStub(1));
    assertEquals(123, integerReader.readInt());
  }

  @Test
  public void nextInt_negative_123() {
    integerReader = new IntegerReader(new InputStreamStub(2));
    assertEquals(-123, integerReader.readInt());
  }
}
```


Quels sont les problèmes ?


Fastidieux à écrire et cela requiert un effort de maintenance considérable


Fort couplage entre le jeu de données décrit dans le Stub et le cas de test


### Les Mock


Simuler le comportement d'une dépendance sans l'appeler et sans l'écrire


Préciser l'entrée à laquelle on réagit et la sortie que l'on produit en conséquence


[Mockito](http://mockito.org) voire [PowerMock](https://github.com/jayway/powermock) (pour *mocker* les classes statiques)


Préparation du contexte d'exécution

```java
public class ProcessImplTest {
  @InjectMocks
  private ProcessImpl<Integer> process;

  @Mock
  private Reader<Integer> reader;
  @Mock
  private Operation<Integer, Object> operation;
  @Mock
  private Writer<Object> writer;

  @Before
  public void setUp() throws Exception {
    MockitoAnnotations.initMocks(this);
  }

  [...]

}
```


Test à proprement parler

```java
public class ProcessImplTest {

  [...]

  @Test
  public void nextInt_empty() throws IOException {
    when(reader.read()).thenReturn(Optional.empty());
    when(operation.compute(eq(Optional.empty()))).thenReturn(Optional.empty());
    doThrow(new IOException()).when(writer).write(eq(Optional.empty()));

    final int result = process.execute();

    assertEquals(1, result);
  }
}
```


Quels sont les problèmes ?


Chaque composant peut fonctionner parfaitement individuellement...


...mais ne pas fonctionner en équipe !


## Test d'intégrations


S'assurer de la bonne intégration :
* des composants entre eux
* des versions entre elles (e.g. Mockito 2.*n* et PowerMock 1.6.*n* ne sont pas compatibles)
* des composants avec leur dépendances


e.g. Tester la bonne intégration des composants


Intégration problématique entre composants

```java
public class DateHelper {
  public static String now() {
    return new SimpleDateFormat("dd/MM/yyyy").format(new Date());
  }
}

public class MyService {
    public boolean isBefore(final Date value) throws ParseException {
        return new SimpleDateFormat("yyyy/MM/dd")
            .parse(DateHelper.now()).before(value); // Mostly true
    }
}
```


e.g. Tester la validité des requêtes SQL


Intégration problématique avec une dépendance

```java
@Repository
public class BadDAO {
  private JdbcTemplate jdbcTemplate;

  @Autowired
  public void init(final DataSource dataSource) {
    this.jdbcTemplate = new JdbcTemplate(dataSource);
  }

  public Collection<String> list() {
    return jdbcTemplate
      .queryForList("SELECT age FROM Person WHERE name = birthDate", String.class);
      // Seems annoying
  }
}
```


Quels sont les problèmes ?


On ne vérifie pas le fonctionnel de l'application mais seulement que les composants se comprennent


## Tests fonctionnels


Simuler l'utilisation du logiciel par un utilisateur final


Vérifier que les règles de gestion de l'application sont respectées


Vérifier que le rendu final est conforme aux attentes


[Cucumber](https://cucumber.io), [Fitnese](http://www.fitnesse.org), [Robot Framework](http://robotframework.org), etc.


## Charge / Performance

* Apache JMeter, Gatling


## Autres

* de sécurité *pen-testing*
* humains (*Quality Assurance*, *User eXperience*)
* *Test Driven Development* - TDD


## Conclusion

L'objectif est de faire du **bon** code : 
    - Maintenable ()
    - Compréhensible
    - Sûr (*pen-testing*)
    - Réutilisable (*)
    - Documenté
    - Performant (*tests de performance*)