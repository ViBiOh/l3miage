package org.vibioh.ioc.impl;

import org.vibioh.ioc.Writer;

public class ScreenWriter implements Writer<String> {
  @Override
  public void write(final String value) {
    System.out.println(value);
  }
}
