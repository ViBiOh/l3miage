package org.vibioh.ioc.impl;

import org.vibioh.ioc.Writer;

import java.util.Optional;

public class ScreenWriter implements Writer<Object> {
  @Override
  public void write(final Optional<Object> value) {
    System.out.println(value.get());
  }
}
