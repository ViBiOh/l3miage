package org.vibioh.srp;

import java.io.InputStream;
import java.util.Scanner;
import java.util.regex.Pattern;

public class IntegerReader {
    private static final Pattern INTEGER = Pattern.compile("^[+-]?[0-9]+$");
    private Scanner in;

    public IntegerReader(final InputStream input) {
        this.in = new Scanner(input);
    }

    public int readInt() {
        return in.nextInt();
    }

    public static Integer read(final String raw) {
        if (INTEGER.matcher(raw).matches()) {
            return Integer.parseInt(raw);
        }
        return null;
    }
}
