package org.vibioh.ioc.impl;

import org.vibioh.ioc.Operation;

import java.util.Optional;

public class InverseOperation implements Operation<Integer, Double> {
  @Override
  public Optional<Double> compute(final Optional<Integer> intValue) {
      if (intValue.isPresent()) {
          return Optional.of(1D / intValue.get());
      }
      return Optional.empty();
  }
}
