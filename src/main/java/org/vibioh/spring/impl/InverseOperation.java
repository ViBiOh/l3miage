package org.vibioh.spring.impl;

import org.springframework.stereotype.Service;
import org.vibioh.ioc.Operation;

import java.util.Optional;

@Service
public class InverseOperation implements Operation<Integer, Object> {
  @Override
  public Optional<Object> compute(final Optional<Integer> intValue) {
    return intValue.map(value -> 1D / value);
  }
}
