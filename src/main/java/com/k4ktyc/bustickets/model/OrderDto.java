package com.k4ktyc.bustickets.model;

import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class OrderDto {

    private final long id;
    private final TripDto trip;

    private final String username;
    private final String userRole;

    private final String passengerName;
    private final String passengerLastname;

    private final int seatNumber;
    private final LocalDateTime dateTimeOrderCreated;
    private final String status;


    public OrderDto(Order order) {
        this.id = order.getId();
        this.trip = new TripDto(order.getTrip());

        this.username = order.getUser().getUsername();
        this.userRole = order.getUser().getRole().getValue()
                .split("_")[1].toLowerCase();

        this.passengerName = order.getPassengers().get(0).getName();
        this.passengerLastname = order.getPassengers().get(0).getLastname();

        this.seatNumber = order.getSeatNumber();
        this.dateTimeOrderCreated = order.getDateTimeOrderCreated();
        this.status = order.getStatus();
    }
}
