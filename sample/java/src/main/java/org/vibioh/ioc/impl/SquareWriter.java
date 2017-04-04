package org.vibioh.ioc.impl;

import org.vibioh.ioc.Writer;

import java.io.IOException;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;

public class SquareWriter implements Writer<Object> {
    private OutputStream out;

    public SquareWriter(final OutputStream out) {
        this.out = out;
    }

    public void write(final Object inverseValue) throws IOException {
        out.write(("Square: " + String.valueOf(inverseValue)).getBytes(StandardCharsets.UTF_8));
    }
}
