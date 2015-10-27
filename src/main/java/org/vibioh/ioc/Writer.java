package org.vibioh.ioc;

import java.util.Optional;

public interface Writer<T> {
  void write(Optional<T> value);
}
