package com.k4ktyc.bustickets.service;

import com.k4ktyc.bustickets.model.Route;
import com.k4ktyc.bustickets.model.RouteDto;
import com.k4ktyc.bustickets.repository.RouteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
public class RouteService {

    private final RouteRepository routeRepository;

    @Autowired
    public RouteService(RouteRepository routeRepository) {
        this.routeRepository = routeRepository;
    }

    public Page<RouteDto> getAllRoutes(int pageNumber) {
        PageRequest paging = PageRequest.of(pageNumber, 10);
        Page<Route> pagedRoutes = routeRepository.findAll(paging);

        return pagedRoutes.map(RouteDto::new);
    }

    public Route save(Route route) {
        return routeRepository.save(route);
    }
}
