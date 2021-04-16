package com.k4ktyc.bustickets.controller;

import com.k4ktyc.bustickets.model.RouteDto;
import com.k4ktyc.bustickets.service.RouteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/routes")
public class RouteController {

    private final RouteService routeService;

    @Autowired
    public RouteController(RouteService routeService) {
        this.routeService = routeService;
    }

    @GetMapping
    public Page<RouteDto> getAllRoutes(@RequestParam(defaultValue = "0") int page) {
        return routeService.getAllRoutes(page);
    }
}
