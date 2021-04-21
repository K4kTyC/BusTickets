package com.k4ktyc.bustickets.model;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "passengers")
@Getter @Setter
public class Passenger {

    @Id @GeneratedValue
    private long id;

    private String name;

    private String lastname;


    public Passenger() {}

    public Passenger(String name, String lastname) {
        this.name = name;
        this.lastname = lastname;
    }
}
