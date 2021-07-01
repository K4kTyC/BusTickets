package com.k4ktyc.bustickets.service;

import com.k4ktyc.bustickets.domain.Route;
import com.k4ktyc.bustickets.domain.RouteStation;
import com.k4ktyc.bustickets.domain.Station;
import com.k4ktyc.bustickets.domain.dto.RouteDto;
import com.k4ktyc.bustickets.domain.dto.RouteStationDto;
import com.k4ktyc.bustickets.repository.RouteRepository;
import com.k4ktyc.bustickets.repository.RouteStationRepository;
import com.k4ktyc.bustickets.repository.StationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RouteService {

    private final RouteRepository routeRepository;
    private final StationRepository stationRepository;
    private final RouteStationRepository routeStationRepository;

    @Autowired
    public RouteService(RouteRepository routeRepository,
                        StationRepository stationRepository,
                        RouteStationRepository routeStationRepository) {
        this.routeRepository = routeRepository;
        this.stationRepository = stationRepository;
        this.routeStationRepository = routeStationRepository;
    }


    public boolean isRouteExist(long id) {
        Optional<Route> route = routeRepository.findById(id);
        return route.isPresent();
    }

    public RouteDto getRouteById(long id) {
        Optional<Route> route = routeRepository.findById(id);
        if (route.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No route with id: " + id);
        }

        return createDtoFromRoute(route.get());
    }

    public Route save(RouteDto dto) {
        Route route = createRouteFromDto(dto);
        Route savedRoute = routeRepository.save(route);

        for (RouteStation rs : route.getStations()) {
            routeStationRepository.save(rs);
        }

        return savedRoute;
    }
    
    public Page<RouteDto> getAllRoutes(int pageNumber) {
        PageRequest paging = PageRequest.of(pageNumber, 20);
        Page<Route> routes = routeRepository.findAll(paging);

        return routes.map(this::createDtoFromRoute);
    }


    RouteDto createDtoFromRoute(Route route) {
        RouteDto dto = new RouteDto();

        dto.setId(route.getId());
        dto.setName(route.getName());
        dto.setRouteStations(route.getStations()
                .stream().map(this::createDtoFromRouteStation)
                .collect(Collectors.toList()));
        dto.setPrice(route.getPrice());

        return dto;
    }

    RouteStationDto createDtoFromRouteStation(RouteStation rs) {
        RouteStationDto dto = new RouteStationDto();
        dto.setId(rs.getId());
        dto.setStationId(rs.getStation().getId());
        dto.setStationName(rs.getStation().getName());
        dto.setTimeGap(rs.getTimeGap());
        dto.setPrice(rs.getPrice());

        return dto;
    }

    Route createRouteFromDto(RouteDto dto) {
        Route route = new Route();

        route.setName(dto.getName());
        route.setStations(dto.getRouteStations()
                .stream().map(rsDto -> createRouteStationFromDto(rsDto, route))
                .collect(Collectors.toList()));

        long price = 0;
        for (RouteStationDto rsDto : dto.getRouteStations()) {
            price += rsDto.getPrice();
        }
        route.setPrice(price);

        return route;
    }

    RouteStation createRouteStationFromDto(RouteStationDto dto, Route route) {
        RouteStation rs = new RouteStation();
        Station station = stationRepository.findById(dto.getStationId()).get();

        rs.setRoute(route);
        rs.setStation(station);
        rs.setTimeGap(dto.getTimeGap());
        rs.setPrice(dto.getPrice());

        return rs;
    }
}
