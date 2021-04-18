package com.k4ktyc.bustickets.controller;

import com.k4ktyc.bustickets.model.CreateTripResponse;
import com.k4ktyc.bustickets.model.NewTripDto;
import com.k4ktyc.bustickets.model.Trip;
import com.k4ktyc.bustickets.service.TripService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final TripService tripService;

    @Autowired
    public AdminController(TripService tripService) {
        this.tripService = tripService;
    }


    @PostMapping(path = "/create-trip", consumes = "application/json")
    public CreateTripResponse addNewRoute(@RequestBody @Valid NewTripDto newTripDto) {
        Trip newTrip = new Trip(newTripDto);
        return new CreateTripResponse("Рейс был успешно добавлен.", tripService.save(newTrip));
    }
}
