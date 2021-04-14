package com.k4ktyc.bustickets.service;

import com.k4ktyc.bustickets.model.Route;
import com.k4ktyc.bustickets.repository.RouteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RouteService {

    private final RouteRepository routeRepository;

    @Autowired
    public RouteService(RouteRepository routeRepository) {
        this.routeRepository = routeRepository;
    }

    public Route save(Route route) {
        return routeRepository.save(route);
    }
}
