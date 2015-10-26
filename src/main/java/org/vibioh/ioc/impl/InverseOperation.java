package org.vibioh.ioc.impl;

import org.vibioh.ioc.Operation;

public class InverseOperation implements Operation<Integer, Double> {
  @Override
  public Double compute(final Integer intValue) {
    return 1D / intValue;
  }

  @Override
  public String computeVerbose(Integer value) {
    return "Inverse:" + this.compute(value);
  }
}
