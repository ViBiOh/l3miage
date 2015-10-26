package org.vibioh.ioc.impl;

import org.vibioh.ioc.Operation;

public class SquareOperation implements Operation<Integer, Integer> {
  @Override
  public Integer compute(final Integer value) {
    return value * value;
  }

  @Override
  public String computeVerbose(Integer value) {
    return "Square: " + this.compute(value);
  }
}
