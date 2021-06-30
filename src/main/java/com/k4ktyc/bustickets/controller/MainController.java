package com.k4ktyc.bustickets.controller;

import com.k4ktyc.bustickets.service.RouteService;
import com.k4ktyc.bustickets.service.TripService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.server.ResponseStatusException;

@Controller
public class MainController {

    private final TripService tripService;
    private final RouteService routeService;

    @Autowired
    public MainController(TripService tripService, RouteService routeService) {
        this.tripService = tripService;
        this.routeService = routeService;
    }


    @GetMapping("/")
    public String home() {
        return "home";
    }

    @GetMapping("/trips")
    public String trips() {
        return "trips";
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
    public String busModels() {
        return "admin-bus-models";
    }

    @GetMapping("/admin/buses")
    public String buses() {
        return "admin-buses";
    }

    @GetMapping("/orders")
    public String orders() {
        return "orders";
    }

    @GetMapping("/admin/routes/{id}")
    public String routeDetails(@PathVariable(value = "id") long id) {
        if (!routeService.isRouteExist(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Wrong route id");
        }

        return "admin-route-details";
    }

    @GetMapping("/trips/{id}")
    public String tripInfo(@PathVariable long id) {
        if (!tripService.isTripExists(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Wrong trip id");
        }

        return "trip-details";
    }
}
