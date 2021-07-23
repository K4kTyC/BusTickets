package com.k4ktyc.bustickets.domain.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter @Setter
public class OrderDto {

    private long id;

    private TripDto trip;

    private RouteStationDto sStart;

    private RouteStationDto sFinish;

    private UserDto user;

    private PassengerDto passenger;

    private int seat;

    private String status;

    private LocalDateTime dateTimeOrderCreated;

    private long price;

}
