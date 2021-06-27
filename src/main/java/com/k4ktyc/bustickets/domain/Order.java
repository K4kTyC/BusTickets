package com.k4ktyc.bustickets.domain;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
@Getter @Setter
public class Order {

    @Id @GeneratedValue(generator = "optimized-sequence")
    private long id;

    @ManyToOne
    @JoinColumn(name = "trip_id", nullable = false, updatable = false)
    private Trip trip;

    @ManyToOne
    @JoinColumn(name = "station_start_id", nullable = false, updatable = false)
    private Station stationStart;

    @ManyToOne
    @JoinColumn(name = "station_finish_id", nullable = false, updatable = false)
    private Station stationFinish;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false, updatable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "passenger_id", nullable = false, updatable = false)
    private Passenger passenger;

    @ManyToOne
    @JoinColumn(name = "seat_id", nullable = false, updatable = false)
    private Seat seat;

    @ManyToOne
    @JoinColumn(name = "status_id", nullable = false)
    private OrderStatus status;

    private LocalDateTime dateTimeOrderCreated;

    private long price;

}
