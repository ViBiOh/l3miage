package org.vibioh.tdd;

import org.junit.Test;

import static junit.framework.TestCase.assertEquals;

public class TDDTest {
  @Test(expected = IllegalArgumentException.class)
  public void null_exception() {
    TDD.execute(null);
  }

  @Test
  public void empty_return() {
    assertEquals("", TDD.execute(""));
  }

  @Test
  public void spaces_return() {
    assertEquals("  ", TDD.execute("  "));
  }

  @Test
  public void smallCase_return() {
    assertEquals("A ce bon eleve a la maitrise inouie",
                TDD.execute("À ce bon élève à la maîtrise inouïe"));
  }
}
