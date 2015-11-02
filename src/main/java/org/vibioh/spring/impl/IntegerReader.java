package org.vibioh.spring.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.vibioh.ioc.Reader;

import java.io.InputStream;
import java.util.Optional;
import java.util.Scanner;

@Service
public class IntegerReader implements Reader<Integer> {
  private Scanner in;

  @Autowired
  public IntegerReader(final InputStream input) {
    this.in = new Scanner(System.in);
  }

  @Override
  public Optional<Integer> read() {
    return Optional.ofNullable(in.nextInt());
  }
}
