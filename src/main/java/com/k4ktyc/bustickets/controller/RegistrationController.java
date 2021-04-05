package com.k4ktyc.bustickets.controller;

import com.k4ktyc.bustickets.model.UserDto;
import com.k4ktyc.bustickets.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import javax.validation.Valid;

@RestController
@RequestMapping("/register")
public class RegistrationController {

    private final UserService userService;

    public RegistrationController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping(consumes = "application/json")
    public String register(@RequestBody @Valid UserDto userDto) {
        if (!userService.registerUser(userDto)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User with such username is already registered");
        }
        return "You successfully registered";
    }
}
