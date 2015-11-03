package org.vibioh.spring;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Program implements CommandLineRunner {
  @Autowired
  private Process inverse;

  @Override
  public void run(final String... strings) throws Exception {
    inverse.execute();
  }

  public static void main(final String[] args) {
    SpringApplication.run(SpringConfiguration.class, args);
  }
}
