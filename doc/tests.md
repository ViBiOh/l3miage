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


Il fait partie du code de l'application :
* ne doit pas en être séparé
* est maintenu en même temps que le code testé
* doit être aussi plaisant à maintenir
* doit être relu


Il couvre un besoin ou un cas technique ou fonctionnel
* ne pas tester tous les scénarios possibles et imaginables
* se concentrer sur le *use-case*, la *user-story* ou les « cas probables »


Il est créé dès qu'un bug a été détecté afin d'éviter qu'il ne revienne


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