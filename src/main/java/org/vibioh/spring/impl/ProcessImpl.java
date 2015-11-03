package org.vibioh.spring.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.vibioh.ioc.Operation;
import org.vibioh.ioc.Reader;
import org.vibioh.ioc.Writer;
import org.vibioh.spring.Process;

import java.io.IOException;
import java.util.logging.Level;

@Component
public class ProcessImpl<I> implements Process {

  @Autowired
  private Reader<I> reader;
  @Autowired
  private Operation<I, Object> operation;
  @Autowired
  private Writer<Object> writer;

  @Override
  public void execute() {
    try {
      writer.write(operation.compute(reader.read()));
    } catch (final IOException e) {
      logger.log(Level.SEVERE, "Something went wrong", e);
    }
  }
}
