package org.vibioh.ioc.impl;

import org.vibioh.ioc.Operation;

import java.util.Optional;

public class SquareOperation implements Operation<Integer, Integer> {
  @Override
  public Optional<Integer> compute(final Optional<Integer> intValue) {
    return intValue.map(value -> value * value);
  }
}
