package com.k4ktyc.bustickets.controller;

import com.k4ktyc.bustickets.domain.Route;
import com.k4ktyc.bustickets.domain.RouteStation;
import com.k4ktyc.bustickets.domain.Station;
import com.k4ktyc.bustickets.domain.dto.*;
import com.k4ktyc.bustickets.domain.Trip;
import com.k4ktyc.bustickets.service.RouteService;
import com.k4ktyc.bustickets.service.RouteStationService;
import com.k4ktyc.bustickets.service.StationService;
import com.k4ktyc.bustickets.service.TripService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final TripService tripService;
    private final StationService stationService;
    private final RouteService routeService;
    private final RouteStationService routeStationService;

    @Autowired
    public AdminController(TripService tripService,
                           StationService stationService,
                           RouteService routeService,
                           RouteStationService routeStationService) {
        this.tripService = tripService;
        this.stationService = stationService;
        this.routeService = routeService;
        this.routeStationService = routeStationService;
    }


    @PostMapping(path = "/create-trip", consumes = "application/json")
    public CreateTripResponse addNewRoute(@RequestBody @Valid TripDto tripDto) {
        Trip newTrip = new Trip(tripDto);
        return new CreateTripResponse("Рейс был успешно добавлен.", tripService.save(newTrip));
    }

    @PostMapping(path = "/create-station", consumes = "application/json")
    public String addNewStation(@RequestBody @Valid StationDto stationDto) {
        Station newStation = new Station(stationDto);
        stationService.save(newStation);

        return "Остановка была успешно создана.";
    }

    @PostMapping(path = "/create-route", consumes = "application/json")
    public String addNewRoute(@RequestBody @Valid RouteDto routeDto) {
        Route route = createRouteFromDto(routeDto);
        routeService.save(route);

        for (RouteStation rs : route.getStations()) {
            routeStationService.save(rs);
        }

        return "Маршрут был успешно создан.";
    }

    

    private Route createRouteFromDto(RouteDto routeDto) {
        Route route = new Route();
        
        List<RouteStation> routeStations = new ArrayList<>();
        long price = 0;
        for (RouteStationDto rsDto : routeDto.getRouteStations()) {
            RouteStation rs = createRouteStationFromDto(rsDto, route);
            routeStations.add(rs);
            price += rs.getPrice();
        }
        
        route.setName(routeDto.getName());
        route.setPrice(price);
        route.setStations(routeStations);
        
        return route;
    }

    private RouteStation createRouteStationFromDto(RouteStationDto rsDto, Route route) {
        RouteStation routeStation = new RouteStation();
        
        Station station = stationService.findById(rsDto.getStationId()).get();
        
        routeStation.setArrivalTime(rsDto.getArrivalTime());
        routeStation.setPrice(rsDto.getPrice());
        routeStation.setRoute(route);
        routeStation.setStation(station);

        return routeStation;
    }
}
