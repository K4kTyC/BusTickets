package com.k4ktyc.bustickets.domain;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table(name = "passengers")
@Getter @Setter
public class Passenger {

    @Id @GeneratedValue(generator = "optimized-sequence")
    private long id;

    private String name;

    private String lastname;

    @ManyToOne
    @JoinColumn(name = "user_id", updatable = false)
    private User user;


    public Passenger() {}

    public Passenger(String name, String lastname, User user) {
        this.name = name;
        this.lastname = lastname;

        if ("ROLE_USER".equals(user.getRole().getValue())) {
            this.user = user;
        } else {
            this.user = null;
        }
    }
}
