package com.k4ktyc.bustickets.domain.dto;

import lombok.Getter;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Collection;

@Getter
public class UserInfo {

    private final String username;
    private final String role;

    public UserInfo () {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        username = auth.getName();
        role = auth.getAuthorities()
                .iterator().next()
                .toString().substring(5);
    }
}
