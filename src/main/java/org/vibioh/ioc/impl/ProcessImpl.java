package org.vibioh.ioc.impl;

import org.vibioh.ioc.Operation;
import org.vibioh.ioc.Process;
import org.vibioh.ioc.Reader;
import org.vibioh.ioc.Writer;

public class ProcessImpl<I> implements Process<I> {
  private Reader<I> reader;
  private Operation<I, Object> operation;
  private Writer<Object> writer;

  @Override
  public Process execute() {
      writer.write(operation.compute(reader.read()));
    return this;
  }

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
}
