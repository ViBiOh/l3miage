package org.vibioh.srp;

import java.io.IOException;

public class Program {
  public static void main(final String[] args) throws IOException {
    final IntegerReader integerReader = new IntegerReader(System.in);
    final InverseOperation inverse = new InverseOperation();
    final InverseWriter display = new InverseWriter(System.out);

    display.write(inverse.compute(integerReader.readInt()));
  }
}
