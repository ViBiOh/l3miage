package org.vibioh.spring;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

import java.io.InputStream;
import java.io.OutputStream;

@Configuration
@ComponentScan(value = "org.vibioh.spring")
public class SpringConfiguration {
  @Bean
  public InputStream getInput() {
    return System.in;
  }

  @Bean
  public OutputStream getOuput() {
    return System.out;
  }
}
