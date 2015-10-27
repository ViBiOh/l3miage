package org.vibioh.ioc.impl;

import org.vibioh.ioc.Reader;

import java.util.Optional;
import java.util.Scanner;

public class KeyboardReader implements Reader<Integer> {
  private Scanner in;

  public KeyboardReader() {
    this.in = new Scanner(System.in);
  }

  @Override
  public Optional<Integer> read() {
    return Optional.of(in.nextInt());
  }
}
