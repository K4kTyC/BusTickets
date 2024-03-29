package com.k4ktyc.bustickets.domain;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "roles")
@Getter @Setter
public class Role {

    @Id @GeneratedValue(generator = "optimized-sequence")
    private long id;

    private String value;

    @OneToMany(mappedBy = "role")
    private List<User> users;

    public Role() {}

    public Role(String value) {
        this.value = value;
    }
}
