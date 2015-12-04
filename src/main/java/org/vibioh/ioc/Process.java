package org.vibioh.ioc;

import java.util.logging.Logger;

public interface Process<I> {
  Logger logger = Logger.getLogger(Process.class.getSimpleName());

  Process execute();

  Process setReader(final Reader<I> reader);
  Process setOperation(final Operation<I, Object> operation);
  Process setWriter(final Writer<Object> writer);
}
