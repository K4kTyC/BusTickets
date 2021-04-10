package com.k4ktyc.bustickets.model;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders")
@Getter @Setter
public class Order {

    @Id @GeneratedValue
    private long id;

    @ManyToOne
    @JoinColumn(name = "trip_id", nullable = false, updatable = false)
    private Trip trips;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false, updatable = false)
    private User user;

    private List<Passenger> passengers;

    private LocalDateTime dateTimeOrderCreated;

    private String status;
}
