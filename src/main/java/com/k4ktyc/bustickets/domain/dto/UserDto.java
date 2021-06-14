package com.k4ktyc.bustickets.domain.dto;

import lombok.Getter;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

@Getter
public class UserDto {

    @NotNull
    private String username;

    @NotNull
    //@Pattern(regexp = "^(?=\\S+$).{5,20}$")
    private String password;
}
