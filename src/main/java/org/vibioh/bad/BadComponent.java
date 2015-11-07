package org.vibioh.bad;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class BadComponent {
  public class DateHelper {
    public String now() {
      return new SimpleDateFormat("dd/MM/yyyy").format(new Date());
    }
  }

  public boolean isBefore(final Date value) throws ParseException {
    return new SimpleDateFormat("yyyy/MM/dd")
        .parse(new DateHelper().now()).before(value); // Mostly true
  }

  public static void main(final String[] args) throws ParseException {
    final Date now = new Date();
    System.out.println(now + " is before now? " + new BadComponent().isBefore(now));

    final Date past = new Date(System.currentTimeMillis() * 2);
    System.out.println(past + " is before now? " + new BadComponent().isBefore(past));
  }
}
