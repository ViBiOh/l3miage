package org.vibioh.srp;

import java.io.IOException;
import java.io.InputStream;

public class InputStreamStub extends InputStream {
    private String[] VALUES = {"0", "123", "-123"};
    private int index;
    private int seq;

    public InputStreamStub(final int index) {
        super():

        this.index = index;
    }

    @Override
    public int read() throws IOException {
        if (seq < VALUES[index].length()) {
            return VALUES[index].charAt(seq++);
        }
        return -1;
    }
}
