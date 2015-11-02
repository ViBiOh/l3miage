package org.vibioh.ioc.impl;

import org.vibioh.ioc.Operation;

import java.util.Optional;

public class InverseOperation implements Operation<Integer, Double> {
  @Override
  public Optional<Double> compute(final Optional<Integer> intValue) {
    return intValue.map(value -> 1D / value);
  }
}
