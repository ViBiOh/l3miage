package org.vibioh.tdd;

import org.springframework.util.Assert;

import java.text.Normalizer;

public class TDD {
  public static String execute(final String input) {
    Assert.notNull(input);

    return Normalizer.normalize(input, Normalizer.Form.NFD).replaceAll("[̀́̂̈]+", "");
  }
}
