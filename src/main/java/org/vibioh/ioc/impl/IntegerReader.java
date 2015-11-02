package org.vibioh.ioc.impl;

import org.vibioh.ioc.Reader;

import java.io.InputStream;
import java.util.Optional;
import java.util.Scanner;

public class IntegerReader implements Reader<Integer> {
  private Scanner in;

  public IntegerReader(final InputStream input) {
    this.in = new Scanner(input);
  }

  @Override
  public Optional<Integer> read() {
    return Optional.ofNullable(in.nextInt());
  }
}
