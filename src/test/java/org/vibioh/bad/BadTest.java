package org.vibioh.bad;

import org.junit.BeforeClass;
import org.junit.Test;

import static junit.framework.TestCase.assertEquals;

public class BadTest {
  private static int i;

  @BeforeClass
  public static void setUp() {
    i = 0;
  }

  @Test
  public void increment() {
    assertEquals(1, ++i);
  }

  @Test
  public void decrement() {
    assertEquals(0, --i); // Result depends on test suite
  }
}
