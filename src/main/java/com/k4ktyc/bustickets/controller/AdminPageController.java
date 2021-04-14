package com.k4ktyc.bustickets.controller;

import com.k4ktyc.bustickets.model.AddNewRouteResponse;
import com.k4ktyc.bustickets.model.NewRouteDto;
import com.k4ktyc.bustickets.model.Route;
import com.k4ktyc.bustickets.service.RouteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/admin")
public class AdminPageController {

    private final RouteService routeService;

    @Autowired
    public AdminPageController(RouteService routeService) {
        this.routeService = routeService;
    }


    @PostMapping(path = "/add_route", consumes = "application/json")
    public AddNewRouteResponse addNewRoute(@RequestBody @Valid NewRouteDto newRouteDto) {
        Route newRoute = new Route(newRouteDto);
        return new AddNewRouteResponse("Маршрут был успешно добавлен.", routeService.save(newRoute));
    }
}
