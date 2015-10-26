package org.vibioh.ioc.impl;

import org.vibioh.ioc.Reader;

import java.util.Scanner;

public class KeyboardReader implements Reader<Integer> {
  private Scanner in;

  public KeyboardReader() {
    this.in = new Scanner(System.in);
  }

  @Override
  public Integer read() {
    return in.nextInt();
  }
}
