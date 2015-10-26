package org.vibioh.ioc;

public interface Operation<I, O> {
  O compute(I value);
  String computeVerbose(I value);
}
