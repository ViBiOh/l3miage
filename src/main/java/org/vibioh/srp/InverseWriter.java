package org.vibioh.srp;

import java.io.IOException;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;

public class InverseWriter {
    private OutputStream out;

    public InverseWriter(final OutputStream out) {
        this.out = out;
    }

    public void write(final double inverseValue) throws IOException {
        out.write(("Inverse: " + inverseValue).getBytes(StandardCharsets.UTF_8));
    }
}
