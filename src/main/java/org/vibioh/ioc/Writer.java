package org.vibioh.ioc;

import java.io.IOException;

public interface Writer<T> {
    void write(T value) throws IOException;
}
