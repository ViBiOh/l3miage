package org.vibioh.ioc;

import java.util.Optional;

public interface Operation<I, O> {
    Optional<O> compute(Optional<I> value);
}
