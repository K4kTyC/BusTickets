package com.k4ktyc.bustickets.service;

import com.k4ktyc.bustickets.domain.RouteStation;
import com.k4ktyc.bustickets.repository.RouteStationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RouteStationService {

    private final RouteStationRepository routeStationRepository;

    @Autowired
    public RouteStationService(RouteStationRepository routeStationRepository) {
        this.routeStationRepository = routeStationRepository;
    }


    public RouteStation save(RouteStation routeStation) {
        return routeStationRepository.save(routeStation);
    }
}
