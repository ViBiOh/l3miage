package org.vibioh.srp;

public class Program {
  public static void main(final String[] args) {
    final KeyboardReader keyboard = new KeyboardReader();
    final InverseOperation inverse = new InverseOperation();
    final ScreenWriter display = new ScreenWriter();

    display.write("Inverse: " + inverse.compute(keyboard.readInt()));
  }
}
