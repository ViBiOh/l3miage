package org.vibioh.bad;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.util.Collection;

@Repository
public class BadDAO {
  private JdbcTemplate jdbcTemplate;

  @Autowired
  public void init(final DataSource dataSource) {
    this.jdbcTemplate = new JdbcTemplate(dataSource);
  }

  public Collection<String> list() {
    return jdbcTemplate.queryForList("SELECT age FROM Person WHERE name = birthDate", String.class);
  }
}
