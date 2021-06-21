package com.k4ktyc.bustickets.domain.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.k4ktyc.bustickets.domain.BusClass;
import lombok.Getter;

import javax.validation.constraints.NotNull;

@Getter
public class BusClassDto {

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private long id;

    @NotNull
    private String name;


    public BusClassDto() {}

    public BusClassDto(BusClass busClass) {
        this.id = busClass.getId();
        this.name = busClass.getName();
    }
}
