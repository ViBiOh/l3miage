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


Exemple d'un mauvais test

```java
public class BadTest {
  private static int i;

  @BeforeClass
  public static void setUp() {
    i = 0;
  }

  @Test
  public void test1() { // Que teste-on ici ?
    assertEquals(1, ++i);
  }

  @Test
  public void test2() {
    assertEquals(0, --i); // Result depends on test suite
  }
}
```


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


Objectif : faire des tests **`FIRST`**

* **`F`** ast
* **`I`** solate
* **`R`** epeatable
* **`S`** elf-validating
* **`T`** imely


Tester **un** seul composant et pas ses dépendances
* maîtriser le contexte d'exécution
* pas de dépendance au système / réseau / moment


Pouvoir rejouer chaque test unitairement et à tout moment

Aucune dépendance entre les tests :
* d'une même classe
* de classes différentes


Pouvoir se dire « ce composant (ou cette fonction) est stable et répond à notre besoin, le problème n'est pas là »


* Tester ce qui a du sens fonctionnel ou technique
* Un cas = un test
    - pas de vérifications multiples
    - pas de "scénarios" alambiqués


Test du lecteur d'entiers

```java
public class IntegerReaderTest {
  @Test(expected = NullPointerException.class)
  public void read_null_exception() throws Exception {
    IntegerReader.read(null);
  }

  @Test
  public void read_match_positive() throws Exception {
    assertEquals(Integer.valueOf(123), IntegerReader.read("123"));
  }

  @Test
  public void read_matchNegative_negative() throws Exception {
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


[Par l'exemple](https://twitter.com/thepracticaldev/status/687672086152753152)


e.g. Tester la bonne intégration des composants


Intégration problématique entre composants

```java
public class DateHelper {
  public String now() {
    return new SimpleDateFormat("dd/MM/yyyy").format(new Date());
  }
}

public class MyService {
  @Autowired
  private DateHelper dateHelper;

  public boolean isBefore(final Date value) throws ParseException {
    return new SimpleDateFormat("yyyy/MM/dd")
      .parse(dateHelper.now()).before(value); // Mostly true
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


Dans quel ordre tester les composants ?

Du plus bas niveau vers le haut ?

Du plus haut niveau vers le bas ?

Aucune solution n'est satisfaisante.


Cela requiert un ou plusieurs environnements d'intégration.


Plus lent à s'exécuter car nécessite de préparer l'environnement à chaque exécution de test.

e.g. chargement de base de données, copie de fichiers, etc.


On ne vérifie pas le fonctionnel de l'application mais seulement que les composants se comprennent


## Tests fonctionnels


Simuler l'utilisation du logiciel par un utilisateur final


Vérifier que les règles de gestion de l'application sont respectées


Vérifier que le rendu final est conforme aux attentes


[Cucumber](https://cucumber.io), [Fitnesse](http://www.fitnesse.org), [Robot Framework](http://robotframework.org), etc.


## Conclusion


Dans un monde idéal, on réalise les trois types de tests précédents. Dans un registre plus pragmatique, on réalise les tests unitaires et fonctionnels.


Les tests d'intégration sont complexes et nécessitent une stratégie afin d'être mis en place. Mise en place qui peut se révéler (trop) coûteuse pour le projet.


## Charge / Performance


Votre application doit être conforme aux règles métiers de l'utilisateur mais elle doit le faire dans un temps acceptable.


Effectuer des tests fonctionnels "unitaires" ne permet pas d'apprécier le temps de réponse sur une volumétrie réelle.


e.g. Générer la fiche de paye PDF d'un salarié prend 1 seconde. Si vous l'implantez chez *Wal Mart* (~2 M d'employés), il vous faudra plus de 23 jours **complets** pour tout générer.


e.g. Effectuer une recherche dans le référentiel "Produit" prend une demi-seconde. Ce temps est-il constant si vous importez le catalogue d'Amazon ?


Il existe des outils pour simuler la connexion simultanée de plusieurs utilisateurs : [Gatling](http://gatling.io), [Apache JMeter](https://jmeter.apache.org/)


Il ne faut pas chercher à bâtir une architecture qui réponde quoiqu'il advienne (c'est un problème de *scalabilité*) mais connaître les limites et analyser la courbe de réponse avec des outils de *profiling*


Cela requiert, comme pour les tests d'intégration, des environnements capables de supporter la volumétrie et la charge.


## Autres


Il existe d'autres tests à réaliser sur une application, plus marginaux, mais néanmoins possibles.


Les tests ou audit de sécurité pratiquent notamment du *pen-testing* ou s'assurent que les normes de sécurité sont respectés


La sécurité est un processus, c'est aussi bien :
* physique (i.e. accès au datacenter)
* logique (i.e. processus applicatif)
* technique (i.e. utilisation des outils en dernière version)
* informatique (i.e. chiffrement des données sensibles)
* humain (i.e. verrouillage des postes de travail)


L'erreur est toujours humaine.


Les tests d'assurance qualité (*Quality Assurance - QA*) sont aussi essentiels. On ne peut pas tout tester automatiquement, à un moment, il faut qu'un humain utilise vraiment l'application.


e.g. Vérifier que des éléments sont bien alignés à l'écran. Vérifier la présence judicieuse des *scroll-bar*


Cela conduit bien souvent à vérifier que la *User eXpérience* est satisfaisante au niveau de l'application.


Attention, l'UX n'est pas synonyme d'UI ni d'ergonomie. C'est bien de l'« expérience utilisateur » que l'on parle.

e.g. Uber ou BlaBlaCar vous proposent une application sobre, mais la majeure partie de l'UX s'effectue dans la voiture.


# *Test Driven Development* - TDD


Lorsqu'on écrit du code, on cherche à répondre à un besoin

Ce besoin peut se formuler sous la forme d'un test


On écrit d'abord le test qui vérifie notre besoin, et ensuite on écrit le code qui répond à ce test


Tout ceci s'inclut dans un processus itératif afin d'éviter d'écrire trop de choses non testées. On répond au test, puis on refactore.


e.g. FizzBuzz

Si le nombre est multiple de 3, afficher "fizz".

Si le nombre est multiple de 5, afficher "buzz".

Sinon aficher le nombre.


> Si je donne le chiffre 1, renvoyer 1

```javascript
it('should return the same value', () => {
  expect(fizzBuzz(1)).to.be.equal(1);
});
```


Le code correspondant est donc le suivant

```javascript
() => 1
```


> Si je donne le chiffre 2, renvoyer 2

```javascript
it('should return the second value', () => {
  expect(fizzBuzz(2)).to.be.equal(2);
});
```


Modification du code pour renvoyer 2

```javascript
(number) => {
  if (number === 2) {
    return 2;
  }
  return 1;
}
```


Refactoring possible ?


```javascript
number => number
```


> Si je donne le chiffre 3, renvoyer 'fizz'

```javascript
it('should return fizz for 3', () => {
  expect(fizzBuzz(3)).to.be.equal('fizz');
});
```


Adapatation du code pour tester 3

```javascript
(number) => {
  if (number === 3) {
    return 'fizz';
  }
  return number;
};
```


> Si je donne le chiffre 6, renvoyer 'fizz'

```javascript
it('should return fizz for 6', () => {
  expect(fizzBuzz(6)).to.be.equal('fizz');
});
```


Adapatation du code pour 6

```javascript
(number) => {
  if (number === 3 || number === 6) {
    return 'fizz';
  }
  return number;
};
```


Refactoring possible ?


```javascript
(number) => {
  if (number % 3 === 0) {
    return 'fizz';
  }
  return number;
};
```


Et ainsi de suite.


Ecrire un test **rouge**.

Corriger pour passer au **vert**.

Refactorer en gardant le **vert**.


```javascript
number => {
  if (number % 15 === 0) {
    return 'fizzbuzz';
  } else if (number % 3 === 0) {
    return 'fizz';
  } else if (number % 5 === 0) {
    return 'buzz';
  }

  return number;
}
```


> « La théorie, c'est quand on sait tout et que rien ne fonctionne.

> La pratique, c'est quand tout fonctionne et que personne ne sait pourquoi.

> Ici, nous avons réuni théorie et pratique : rien ne fonctionne... et personne ne sait pourquoi ! »

> Albert Einstein
