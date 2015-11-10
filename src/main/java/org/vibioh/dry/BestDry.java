package org.vibioh.dry;

import java.util.Arrays;
import java.util.logging.Logger;

public class BestDry {
  private static String[] EXPECTED_VALUES = { "8000", "Emile" };

  public static void main(final String[] args) {
    forceArgValues(args);
    Logger.getAnonymousLogger().info(Arrays.toString(args));
  }

  private static void forceArgValues(final String[] array) {
    for (int i = 0, size = array.length; i < size; ++i) {
      if (!EXPECTED_VALUES[i].equals(array[i])) {
        array[i] = EXPECTED_VALUES[i];
      }
    }
  }
}
