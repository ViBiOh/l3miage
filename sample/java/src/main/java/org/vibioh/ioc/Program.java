package org.vibioh.ioc;

import org.vibioh.ioc.impl.IntegerReader;
import org.vibioh.ioc.impl.InverseOperation;
import org.vibioh.ioc.impl.InverseWriter;
import org.vibioh.ioc.impl.ProcessImpl;
import org.vibioh.ioc.impl.SquareOperation;
import org.vibioh.ioc.impl.SquareWriter;

public class Program {
    public static void main(final String[] args) {
        final Reader<Integer> reader = new IntegerReader(System.in);

        final Operation<Integer, Double> inverse = new InverseOperation();
        final Writer<Object> inverseWriter = new InverseWriter(System.out);

        final Operation<Integer, Integer> square = new SquareOperation();
        final Writer<Object> squareWriter = new SquareWriter(System.out);

        new ProcessImpl<Integer>()
                .setReader(reader)
                .setOperation(inverse)
                .setWriter(inverseWriter)
                .execute()
                .setOperation(square)
                .setWriter(squareWriter)
                .execute();
    }
}
