package com.k4ktyc.bustickets.model;

import lombok.Getter;

@Getter
public class UserOrdersDto {

    private final long passengerId;
    private final String name;
    private final String lastname;
    private final long amount;

    public UserOrdersDto(long passengerId, String name, String lastname, long amount) {
        this.passengerId = passengerId;
        this.name = name;
        this.lastname = lastname;
        this.amount = amount;
    }
}
