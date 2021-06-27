package com.k4ktyc.bustickets.domain.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter @Setter
public class OrderDto {

    private long id;

    private TripDto trip;

    private StationDto sStart;

    private StationDto sFinish;

    private UserDto user;

    private PassengerDto passenger;

    private int seatNumber;

    private String status;

    private LocalDateTime dateTimeOrderCreated;

}
