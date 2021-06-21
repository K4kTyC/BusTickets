package com.k4ktyc.bustickets.domain.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.k4ktyc.bustickets.domain.Bus;
import lombok.Getter;

import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Getter
public class BusDto {

    @NotNull
    private int number;

    @NotNull
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private int numberOfSeats;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private List<SeatDto> seats;


    public BusDto() {}

    public BusDto(Bus bus) {
        this.number = bus.getNumber();
        this.seats = bus.getSeats()
                .stream().map(SeatDto::new)
                .collect(Collectors.toCollection(ArrayList::new));
    }
}
