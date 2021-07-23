package com.k4ktyc.bustickets.domain.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

@Getter @Setter
public class UserDto {

    @NotNull
    private String username;

    @NotNull
    @Pattern(regexp = "^(?=\\S+$).{5,20}$")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private String role;

}
