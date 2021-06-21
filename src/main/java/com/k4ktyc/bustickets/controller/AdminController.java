package com.k4ktyc.bustickets.controller;

import com.k4ktyc.bustickets.domain.*;
import com.k4ktyc.bustickets.domain.dto.*;
import com.k4ktyc.bustickets.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final TripService tripService;
    private final StationService stationService;
    private final RouteService routeService;
    private final RouteStationService routeStationService;
    private final BusService busService;

    @Autowired
    public AdminController(TripService tripService,
                           StationService stationService,
                           RouteService routeService,
                           RouteStationService routeStationService,
                           BusService busService) {
        this.tripService = tripService;
        this.stationService = stationService;
        this.routeService = routeService;
        this.routeStationService = routeStationService;
        this.busService = busService;
    }


    @PostMapping(path = "/create-trip", consumes = "application/json")
    public CreateEntityResponse addNewTrip(@RequestBody @Valid TripDto tripDto) {
        Trip newTrip = new Trip(tripDto);
        return new CreateEntityResponse("Рейс был успешно добавлен.", tripService.save(newTrip).getId());
    }

    @GetMapping("/stations")
    public Page<StationDto> getAllStations(@RequestParam(defaultValue = "0") int page,
                                           @RequestParam(defaultValue = "") String filter,
                                           @RequestParam(defaultValue = "false") boolean unpaged) {
        if (unpaged) {
            return stationService.getAllStations(unpaged);
        }

        if (filter.isBlank())
            return stationService.getAllStations(page);
        else
            return stationService.getAllStations(page, filter);
    }

    @PostMapping(path = "/stations", consumes = "application/json")
    public CreateEntityResponse addNewStation(@RequestBody @Valid StationDto stationDto) {
        Station newStation = new Station(stationDto);
        newStation = stationService.save(newStation);

        return new CreateEntityResponse("Станция была успешно создана.", newStation.getId());
    }

    @DeleteMapping(path = "/stations", consumes = "application/json")
    public void deleteStation(@RequestBody long id) {
        stationService.deleteById(id);
    }

    @PostMapping(path = "/routes", consumes = "application/json")
    public CreateEntityResponse addNewRoute(@RequestBody @Valid RouteDto routeDto) {
        Route route = createRouteFromDto(routeDto);
        route = routeService.save(route);

        for (RouteStation rs : route.getStations()) {
            routeStationService.save(rs);
        }

        return new CreateEntityResponse("Маршрут был успешно создан.", route.getId());
    }

    @GetMapping("/buses/classes")
    public List<BusClassDto> getBusClasses() {
        return StreamSupport.stream(busService.getBusClasses().spliterator(), false)
                .map(BusClassDto::new).collect(Collectors.toList());
    }

    @GetMapping("/buses/models")
    public Page<BusModelDto> getBusModels(@RequestParam(defaultValue = "0") int page,
                                          @RequestParam(defaultValue = "") String filter,
                                          @RequestParam(defaultValue = "false") boolean unpaged) {
        if (unpaged) {
            return busService.getBusModels(unpaged);
        }
        
        if (filter.isBlank())
            return busService.getBusModels(page);
        else
            return busService.getBusModels(page, filter);
    }

    @PostMapping(path = "/buses/models", consumes = "application/json")
    public CreateEntityResponse addNewBusModel(@RequestBody @Valid BusModelDto busModelDto) {
        BusModelDto newBusModel = busService.save(busModelDto);

        return new CreateEntityResponse("Модель была успешно создана.", newBusModel.getId());
    }

    @DeleteMapping(path = "/buses/models", consumes = "application/json")
    public void deleteBusModel(@RequestBody long id) {
        busService.deleteById(id);
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
