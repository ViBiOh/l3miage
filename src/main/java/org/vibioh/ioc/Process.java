package org.vibioh.ioc;

public interface Process<I> {
  Process execute();

  Process setReader(final Reader<I> reader);
  Process setOperation(final Operation<I, ?> operation);
  Process setWriter(final Writer<String> writer);
}
