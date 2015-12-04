package org.vibioh.ioc;

import java.io.IOException;
import java.util.Optional;

public interface Writer<T> {
  void write(Optional<T> value) throws IOException;
}
