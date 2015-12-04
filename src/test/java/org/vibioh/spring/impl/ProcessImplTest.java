package org.vibioh.spring.impl;

import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.vibioh.ioc.Operation;
import org.vibioh.ioc.Reader;
import org.vibioh.ioc.Writer;

import java.io.IOException;
import java.util.Optional;

import static junit.framework.TestCase.assertEquals;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;

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

  @Test
  public void nextInt_empty() throws IOException {
    when(reader.read()).thenReturn(Optional.empty());
    when(operation.compute(eq(Optional.empty()))).thenReturn(Optional.empty());
    doThrow(new IOException()).when(writer).write(eq(Optional.empty()));

    final int result = process.execute();

    assertEquals(1, result);
  }

  @Test
  public void nextInt_zero() throws IOException {
    when(reader.read()).thenReturn(Optional.of(0));
    when(operation.compute(eq(Optional.of(0)))).thenReturn(Optional.empty());
    doThrow(new IOException()).when(writer).write(eq(Optional.empty()));

    final int result = process.execute();

    assertEquals(1, result);
  }

  @Test
  public void nextInt_value() throws IOException {
    when(reader.read()).thenReturn(Optional.of(10));
    when(operation.compute(eq(Optional.of(10)))).thenReturn(Optional.empty());
    doNothing().when(writer).write(eq(Optional.empty()));

    final int result = process.execute();

    assertEquals(0, result);
  }
}