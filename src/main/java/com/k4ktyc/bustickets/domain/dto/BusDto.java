package com.k4ktyc.bustickets.domain.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;

@Getter @Setter
public class BusDto {

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private long id;

    @NotNull
    private int number;

    @NotNull
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private long modelId;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private BusModelDto model;

}
