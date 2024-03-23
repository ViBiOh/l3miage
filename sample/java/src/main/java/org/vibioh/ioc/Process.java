package org.vibioh.ioc;

import java.util.logging.Logger;

public interface Process<I> {
    Process execute();

    Process setReader(Reader<I> reader);

    Process setOperation(Operation<I, Object> operation);

    Process setWriter(Writer<Object> writer);
}
