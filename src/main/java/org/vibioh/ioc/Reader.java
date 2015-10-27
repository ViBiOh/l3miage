package org.vibioh.ioc;

import java.util.Optional;

public interface Reader<T> {
  Optional<T> read();
}
