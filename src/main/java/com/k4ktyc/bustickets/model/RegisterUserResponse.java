package com.k4ktyc.bustickets.model;

import lombok.Getter;

@Getter
public class RegisterUserResponse {

    private final String text;

    public RegisterUserResponse(String text) {
        this.text = text;
    }
}
