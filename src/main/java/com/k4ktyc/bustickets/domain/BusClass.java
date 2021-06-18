package com.k4ktyc.bustickets.domain;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "bus_class")
@Getter @Setter
public class BusClass {

    @Id @GeneratedValue
    private long id;

    private String name;
}
