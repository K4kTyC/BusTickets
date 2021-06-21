package com.k4ktyc.bustickets.controller;

import com.k4ktyc.bustickets.domain.dto.TripDto;
import com.k4ktyc.bustickets.service.TripService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/trips")
public class TripController {

    private final TripService tripService;

    @Autowired
    public TripController(TripService tripService) {
        this.tripService = tripService;
    }


    @GetMapping
    public Page<TripDto> getAllTrips(@RequestParam(defaultValue = "0") int page) {
        return tripService.getAllTrips(page);
    }
}
