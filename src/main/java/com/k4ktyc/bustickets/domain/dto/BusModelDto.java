package com.k4ktyc.bustickets.domain.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Getter @Setter
public class BusModelDto {

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private long id;

    @NotBlank
    private String name;

    @NotNull
    private int numberOfSeats;

    @NotNull
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private long busClassId;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private String busClassName;
}
