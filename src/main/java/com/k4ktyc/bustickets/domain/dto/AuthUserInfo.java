package com.k4ktyc.bustickets.domain.dto;

import lombok.Getter;

@Getter
public class AuthUserInfo {

    private boolean authorised = false;
    private String username = null;
    private String role = null;

    public AuthUserInfo() {}

    public AuthUserInfo(String username, String role) {
        this.authorised = true;
        this.username = username;
        this.role = role;
    }
}
