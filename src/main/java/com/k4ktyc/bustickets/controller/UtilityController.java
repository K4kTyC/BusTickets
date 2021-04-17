package com.k4ktyc.bustickets.controller;

import com.k4ktyc.bustickets.model.AuthUserInfo;
import com.k4ktyc.bustickets.model.User;
import com.k4ktyc.bustickets.service.UserService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequestMapping("/api")
public class UtilityController {

    private final UserService userService;

    public UtilityController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/checkAuth")
    public AuthUserInfo checkAuth(Principal principal) {
        if (principal != null) {
            User user = userService.findByUsername(principal.getName()).get();
            return new AuthUserInfo(user.getUsername(), user.getRole().getValue());
        }
        return new AuthUserInfo();
    }
}
