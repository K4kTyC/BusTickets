package com.k4ktyc.bustickets.domain.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Getter @Setter
public class RouteStationDto {

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private long id;

    @NotNull
    private long stationId;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private String stationName;

    @NotNull
    private int timeGap;

    @NotNull
    private long price;
}
