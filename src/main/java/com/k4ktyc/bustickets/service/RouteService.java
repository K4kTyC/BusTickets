package com.k4ktyc.bustickets.service;

import com.k4ktyc.bustickets.model.*;
import com.k4ktyc.bustickets.repository.RouteRepository;
import com.k4ktyc.bustickets.repository.StationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class RouteService {

    private final RouteRepository routeRepository;
    private final StationRepository stationRepository;

    @Autowired
    public RouteService(RouteRepository routeRepository, StationRepository stationRepository) {
        this.routeRepository = routeRepository;
        this.stationRepository = stationRepository;
    }

    public Page<RouteDto> getAllRoutes(int pageNumber) {
        PageRequest paging = PageRequest.of(pageNumber, 10);
        Page<Route> pagedRoutes = routeRepository.findAll(paging);

        return pagedRoutes.map(RouteDto::new);
    }

    public Page<RouteDto> getRoute(int pageNumber, SearchData searchData) {
        Optional<Station> stationFrom = stationRepository.findByName(searchData.getStationFrom());
        Optional<Station> stationTo = stationRepository.findByName(searchData.getStationTo());

        // TODO: переделать отношения классов; при создании маршрута, ссылаться на существующую остановку, если есть

        if (stationFrom.isEmpty() || stationTo.isEmpty()) {
            return null;    // TODO: throw exception
        }

        PageRequest paging = PageRequest.of(pageNumber, 10);
        Page<Route> pagedRoutes = routeRepository
                .findRouteByStationsIsStartingWithAndStationsIsEndingWith(stationFrom.get(), stationTo.get(), paging);



        return pagedRoutes.map(route -> {
            for (Trip trip : route.getTrips()) {

            }
        });
    }

    public Route save(Route route) {
        return routeRepository.save(route);
    }
}
