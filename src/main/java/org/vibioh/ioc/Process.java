package org.vibioh.ioc;

public interface Process<I> {
  Process execute();

  Process setReader(final Reader<I> reader);
  Process setOperation(final Operation<I, Object> operation);
  Process setWriter(final Writer<Object> writer);
}
