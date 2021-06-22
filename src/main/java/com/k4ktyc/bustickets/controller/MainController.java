package com.k4ktyc.bustickets.controller;

import com.k4ktyc.bustickets.domain.Trip;
import com.k4ktyc.bustickets.service.TripService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.server.ResponseStatusException;

import java.time.format.DateTimeFormatter;
import java.util.Optional;

@Controller
public class MainController {

    private final TripService tripService;

    @Autowired
    public MainController(TripService tripService) {
        this.tripService = tripService;
    }


    @GetMapping("/")
    public String home() {
        return "home";
    }

    @GetMapping("/trips")
    public String trips() {
        return "trips";
    }

    @GetMapping("/admin")
    public String admin() {
        return "admin";
    }

    @GetMapping("/admin/stations")
    public String stations() {
        return "admin-stations";
    }

    @GetMapping("/admin/routes")
    public String routes() {
        return "admin-routes";
    }

    @GetMapping("/admin/buses/models")
    public String buses() {
        return "admin-bus-models";
    }

    @GetMapping("/orders")
    public String orders() {
        return "orders";
    }

    @GetMapping("/trips/{id}")
    public String tripInfo(@PathVariable(value = "id") long id, Model model) {
        Optional<Trip> trip = tripService.findById(id);
        if (trip.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No trip with id: " + id);
        }

        DateTimeFormatter timeFormat = DateTimeFormatter.ofPattern("HH:mm");
        DateTimeFormatter dateFormat = DateTimeFormatter.ofPattern("dd.MM.yyyy");

        return "trip-info";
    }
}
