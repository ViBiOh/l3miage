package org.vibioh.ioc;

import org.vibioh.ioc.impl.*;

public class Program {
  public static void main(final String[] args) {
    final Reader<Integer> reader = new IntegerReader(System.in);
    final Writer<Object> writer = new InverseWriter(System.out);
    final Operation<Integer, Double> inverse = new InverseOperation();
    final Operation<Integer, Integer> square = new SquareOperation();

    new ProcessImpl<Integer>()
        .setReader(reader)
        .setOperation(inverse)
        .setWriter(writer)
        .execute()
        .setOperation(square)
        .execute();
  }
}
