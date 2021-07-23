package com.k4ktyc.bustickets.domain.dto;

import lombok.Getter;

@Getter
public class RegisterUserResponse {

    private final String text;

    public RegisterUserResponse(String text) {
        this.text = text;
    }
}
