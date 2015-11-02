package org.vibioh.spring.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.vibioh.ioc.Writer;

import java.io.IOException;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.util.Optional;

@Service
public class InverseWriter implements Writer<Object> {
  @Autowired
  private OutputStream out;

  public void write(final Optional<Object> inverseValue) throws IOException {
    if (inverseValue.isPresent()) {
      out.write(("Inverse: " + inverseValue.get()).getBytes(StandardCharsets.UTF_8));
    }
  }
}
