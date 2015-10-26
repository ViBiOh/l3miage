package org.vibioh.srp;

import java.util.Scanner;

public class KeyboardReader {
  private Scanner in;

  public KeyboardReader() {
    this.in = new Scanner(System.in);
  }

  public int readInt() {
    return in.nextInt();
  }
}
