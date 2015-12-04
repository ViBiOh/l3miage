package org.vibioh.ioc.impl;

import org.vibioh.ioc.Writer;

import java.io.IOException;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.util.Optional;

public class InverseWriter implements Writer<Object> {
  private OutputStream out;

  public InverseWriter(final OutputStream out) {
    this.out = out;
  }

  public void write(final Optional<Object> inverseValue) throws IOException {
    if (inverseValue.isPresent()) {
      out.write(("Inverse: " + inverseValue.get()).getBytes(StandardCharsets.UTF_8));
    }
  }
}
