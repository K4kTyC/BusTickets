package com.k4ktyc.bustickets.domain.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.List;

@Getter
public class RouteDto {

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private long id;

    @NotBlank
    private String name;

    @NotEmpty
    @Size(min = 2)
    private List<RouteStationDto> routeStations;

    @NotNull
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private long price;
}
