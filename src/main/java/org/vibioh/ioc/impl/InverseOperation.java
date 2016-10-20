package org.vibioh.ioc.impl;

import org.vibioh.ioc.Operation;

import java.util.Optional;

public class InverseOperation implements Operation<Integer, Double> {
    @Override
    public Optional<Double> compute(final Integer intValue) {
        return Optional.ofNullable(intValue).map(value -> 1D / value);
    }
}
