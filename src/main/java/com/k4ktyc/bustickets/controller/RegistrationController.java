package com.k4ktyc.bustickets.controller;

import com.k4ktyc.bustickets.domain.dto.RegisterUserResponse;
import com.k4ktyc.bustickets.domain.dto.UserDto;
import com.k4ktyc.bustickets.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

@RestController
@RequestMapping("/api/register")
public class RegistrationController {

    private final UserService userService;

    @Autowired
    public RegistrationController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping(consumes = "application/json")
    public RegisterUserResponse register(@RequestBody @Valid UserDto userDto, HttpServletRequest request) {
        if (!userService.registerUser(userDto)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User with such username is already registered");
        }

        authWithHttpServletRequest(request, userDto.getUsername(), userDto.getPassword());
        return new RegisterUserResponse("You successfully registered");
    }

    public void authWithHttpServletRequest(HttpServletRequest request, String username, String password) {
        try {
            request.login(username, password);
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }
}
