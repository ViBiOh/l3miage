# Tests

## Intérêts : Pourquoi tester ?

### Phrases trop souvent entendues

> Tester c'est douter.

Oui c'est vrai. Mais l'avenir est incertain.

> Les tests c'est pour ceux qui ne savent pas coder.

Bien au contraire, écrire un test est un gage de qualité.

> Ça prend du temps, ça ne sert à rien, il faut les maintenir.

Oui c'est vrai, mais c'est de la [capitalisation](TODO test du Marshmallow).

### Le réel intérêt des tests

* Connaître le comportement attendu de l'application :
    - s'en assurer
    - en disposer pour *refactorer*
* Vérifier qu'il n'y a pas de code inutile
* Identifier les anomalies au plus tôt et ainsi, économiser !
* Etre exécuter fréquemment : on ne négocie pas avec la qualité
* Faire partie du code de l'application
    - doit être aussi plaisant à maintenir
    - doit être relu
    - ne doit pas en être séparé

## Unitaire

* Tester **un** composant et pas ses dépendances
* Couvrir les lignes de code (< 75% vous êtes mauvais)
* Tester ce qui a du sens fonctionnel ou technique
* Un cas possible = un test
    - pas de vérifications multiples
    - pas de "scénario" alambiqués
* Maitriser le context d'exécution
* Pouvoir rejouer chaque test unitairement à tout moment
* Aucune dépendance entre les tests :
    - d'une même classe
    - de classes différentes

### Stub

* Créer des classes ayant le même comportement que les dépendances
* Avantage majeur : envisager tous les comportements possibles sans les provoquer
    - Fichier inexistant
    - Base de données en timeout
    - Coupure réseau
* Inconvénient majeur : il faut les créer des classes

### Mock

* Simuler le comportement d'une dépendance sans l'appeler
* Préciser l'entrée à laquelle on réagit et la sortie que l'on produit
* [Mockito](http://mockito.org) voire [PowerMock](https://github.com/jayway/powermock) (pour *mocker* les classes statiques)

```java
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

public class IntegerOperationTest {
  @InjectMocks
  private IntegerOperation operation;
  @Mock
  private Reader reader;
  @Mock
  private Process process;
  @Mock
  private Writer writer;

  @Before
  private void setUp() {
    MockitoAnnotations.initMocks(this);
  }

  @Test(expected = IllegalArgumentException.class)
  public void compute_null() {
    when(reader.readInt()).thenReturn(null);
    operation.compute();
  }
}
```

## Intégration

* S'assurer de la bonne intégration :
    - des composants entre eux
    - des versions entre elles (e.g. Mockito *2.0* et PowerMock *1.6.2* ne sont pas compatibles)

```java
public class DateHelper {
  public static String now() {
    return new SimpleDateFormat("dd/MM/yyyy").format(new Date());
  }
}

public class MyService {
    public boolean isBefore(final Date value) throws ParseException {
        return new SimpleDateFormat("yyyy/MM/dd").parse(DateHelper.now()).before(value); // Mostly true
    }
}
```

## Fonctionnel

* Outils : [Cucumber](https://cucumber.io), [Fitnese](http://www.fitnesse.org), Robot Framework

## Charge

* Apache JMeter, Gatling

## Autres

* de sécurité *pen-testing*
* humains (*Quality Assurance*, *User eXperience*)
* *Test Driven Development* - TDD