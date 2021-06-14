package com.k4ktyc.bustickets.domain.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.k4ktyc.bustickets.domain.Station;
import lombok.Getter;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Getter
public class StationDto {

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private long id;

    @NotBlank
    private String name;


    public StationDto() {}

    public StationDto(Station station) {
        this.id = station.getId();
        this.name = station.getName();
    }
}
