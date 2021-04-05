package com.k4ktyc.bustickets.model;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "roles")
@Getter @Setter
public class Role {

    @Id @GeneratedValue
    private long id;

    private String value;

    @OneToMany(mappedBy = "role")
    private List<User> users;
}
