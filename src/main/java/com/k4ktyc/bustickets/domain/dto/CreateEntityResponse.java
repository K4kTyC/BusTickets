package com.k4ktyc.bustickets.domain.dto;

import com.k4ktyc.bustickets.domain.Trip;
import lombok.Getter;

@Getter
public class CreateEntityResponse {

    private final String text;
    private final long id;

    public CreateEntityResponse(String text, long id) {
        this.text = text;
        this.id = id;
    }
}
