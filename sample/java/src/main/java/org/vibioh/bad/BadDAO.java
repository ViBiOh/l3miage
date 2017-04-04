package org.vibioh.bad;

import org.springframework.stereotype.Repository;

@Repository
public class BadDAO {
    public String list() {
        return "SELECT age FROM Person WHERE name = birthDate";
    }
}
