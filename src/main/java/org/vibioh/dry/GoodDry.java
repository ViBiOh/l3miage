package org.vibioh.dry;

import java.util.Arrays;
import java.util.logging.Logger;

public class GoodDry {
  private static String FIRST_VALUE = "8000";
  private static String SECOND_VALUE = "Emile";

  public static void main(final String[] args) {
    forceArgValue(FIRST_VALUE, args, 0);
    forceArgValue(SECOND_VALUE, args, 1);
    Logger.getAnonymousLogger().info(Arrays.toString(args));
  }

  private static void forceArgValue(final String expectedValue,
                                    final String[] array,
                                    final int i) {
    if (array.length > i && !expectedValue.equals(array[i])) {
      array[i] = expectedValue;
    }
  }
}
