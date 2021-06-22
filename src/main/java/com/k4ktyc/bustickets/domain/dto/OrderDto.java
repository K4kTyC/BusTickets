package com.k4ktyc.bustickets.domain.dto;

import com.k4ktyc.bustickets.domain.Order;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class OrderDto {

    private long id;
    private TripDto trip;

    private String username;
    private String userRole;

    private String passengerName;
    private String passengerLastname;

    private int seatNumber;
    private LocalDateTime dateTimeOrderCreated;
    private String status;


//    public OrderDto(Order order) {
//        this.id = order.getId();
//        this.trip = new TripDto(order.getTrip());
//
//        this.username = order.getUser().getUsername();
//        this.userRole = order.getUser().getRole().getValue()
//                .split("_")[1].toLowerCase();
//
//        this.passengerName = order.getPassengers().get(0).getName();
//        this.passengerLastname = order.getPassengers().get(0).getLastname();
//
//        this.seatNumber = order.getSeatNumber();
//        this.dateTimeOrderCreated = order.getDateTimeOrderCreated();
//        this.status = order.getStatus();
//    }
}
