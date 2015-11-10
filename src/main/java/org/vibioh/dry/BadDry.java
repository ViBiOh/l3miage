package org.vibioh.dry;

import java.util.Arrays;
import java.util.logging.Logger;

public class BadDry {
  public static void main(final String[] args) {
    if (args.length > 0 && !"8000".equals(args[0])) {
      args[0] = "8000";
    }
    if (args.length > 1 && !"Emile".equals(args[1])) {
      args[1] = "Emile";
    }
    Logger.getAnonymousLogger().info(Arrays.toString(args));
  }
}
