package org.vibioh.srp;

import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;

public class IntegerReaderTest {
  private IntegerReader integerReader;

  @Test
  public void nextInt_zero() {
    integerReader = new IntegerReader(new InputStreamStub(0));
    assertEquals(0, integerReader.readInt());
  }

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

  @Test(expected = NullPointerException.class)
  public void read_null_exception() throws Exception {
    IntegerReader.read(null);
  }

  @Test
  public void read_empty_null() throws Exception {
    assertNull(IntegerReader.read(""));
  }

  @Test
  public void read_nonString_null() throws Exception {
    assertNull(IntegerReader.read("abc"));
  }

  @Test
  public void read_noMatch_null() throws Exception {
    assertNull(IntegerReader.read("abc123"));
  }

  @Test
  public void read_match_null() throws Exception {
    assertEquals(Integer.valueOf(123), IntegerReader.read("123"));
  }

  @Test
  public void read_matchPositive_null() throws Exception {
    assertEquals(Integer.valueOf(123), IntegerReader.read("+123"));
  }

  @Test
  public void read_matchNegative_null() throws Exception {
    assertEquals(Integer.valueOf(-123), IntegerReader.read("-123"));
  }
}