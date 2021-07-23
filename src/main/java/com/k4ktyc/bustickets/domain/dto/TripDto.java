package com.k4ktyc.bustickets.domain.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Getter @Setter
public class TripDto {

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private long id;

    @NotNull
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private long routeId;

    @NotNull
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private long busId;

    @NotNull
    private LocalDateTime datetime;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private RouteDto routeDto;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private BusDto busDto;

}
