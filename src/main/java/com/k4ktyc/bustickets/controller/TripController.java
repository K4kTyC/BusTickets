package com.k4ktyc.bustickets.controller;

import com.k4ktyc.bustickets.domain.dto.TripSearchData;
import com.k4ktyc.bustickets.domain.dto.TripDto;
import com.k4ktyc.bustickets.service.TripService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

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

    @PostMapping(path = "/search", consumes = "application/json")
    public Page<TripDto> findTrip(@RequestParam(defaultValue = "0") int page, @RequestBody @Valid TripSearchData tripSearchData) {
        return tripService.findTrip(page, tripSearchData);
    }
}
