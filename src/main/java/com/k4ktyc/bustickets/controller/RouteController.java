package com.k4ktyc.bustickets.controller;

import com.k4ktyc.bustickets.model.RouteDto;
import com.k4ktyc.bustickets.model.SearchData;
import com.k4ktyc.bustickets.service.RouteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

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

    @PostMapping(path = "/find", consumes = "application/json")
    public Page<RouteDto> findRoutes(@RequestParam(defaultValue = "0") int page, @RequestBody @Valid SearchData searchData) {
        return routeService.getRoute(page, searchData);
    }
}
