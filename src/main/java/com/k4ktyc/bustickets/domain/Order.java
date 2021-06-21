package com.k4ktyc.bustickets.domain;

import com.k4ktyc.bustickets.domain.dto.NewOrderDto;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;

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
    @JoinColumn(name = "user_id", nullable = false, updatable = false)
    private User user;

    @ManyToMany
    @JoinTable(name = "order_passenger",
            joinColumns = @JoinColumn(name = "order_id"),
            inverseJoinColumns = @JoinColumn(name = "passenger_id"))
    private List<Passenger> passengers;

    private int seatNumber;

    private LocalDateTime dateTimeOrderCreated;

    private String status;


    public Order() {}

    public Order(NewOrderDto newOrderDto, Trip trip, User user) {
        this.trip = trip;
        this.user = user;
        this.passengers = new ArrayList<>();
        this.passengers.add(new Passenger(newOrderDto.getPassengerName(), newOrderDto.getPassengerLastname(), user));
        this.seatNumber = newOrderDto.getSeatNumber();
        this.dateTimeOrderCreated = LocalDateTime.now(ZoneId.of("Europe/Minsk"));
        this.status = "payed";
    }
}
