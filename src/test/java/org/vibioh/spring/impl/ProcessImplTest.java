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

import static org.mockito.Matchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
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
  public void nextInt_zero() throws IOException {
    when(reader.read()).thenReturn(Optional.of(0));
    when(operation.compute(any(Optional.class))).thenReturn(null);
    doThrow(new IOException()).when(writer).write(any(Optional.class));

    process.execute();

    verify(process, times(1)).getLogger();
  }
}