package com.k4ktyc.bustickets.controller;

import com.k4ktyc.bustickets.domain.Route;
import com.k4ktyc.bustickets.domain.Station;
import com.k4ktyc.bustickets.domain.Trip;
import com.k4ktyc.bustickets.domain.dto.*;
import com.k4ktyc.bustickets.service.BusService;
import com.k4ktyc.bustickets.service.RouteService;
import com.k4ktyc.bustickets.service.StationService;
import com.k4ktyc.bustickets.service.TripService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityExistsException;
import javax.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final StationService stationService;
    private final RouteService routeService;
    private final TripService tripService;
    private final BusService busService;

    @Autowired
    public AdminController(StationService stationService,
                           RouteService routeService,
                           TripService tripService,
                           BusService busService) {
        this.stationService = stationService;
        this.routeService = routeService;
        this.tripService = tripService;
        this.busService = busService;
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


    @GetMapping("/routes")
    public Page<RouteDto> getRoutes(@RequestParam(defaultValue = "0") int page) {
        return routeService.getAllRoutes(page);
    }

    @GetMapping("/routes/{id}")
    public RouteDto getRoute(@PathVariable long id) {
        return routeService.getRouteById(id);
    }

    @GetMapping("/routes/{id}/trips")
    public Page<TripDto> getTripsByRouteId(@PathVariable long id,
                                           @RequestParam(defaultValue = "0") int page,
                                           @RequestParam(defaultValue = "false") boolean unpaged) {
        if (unpaged) {
            return tripService.getTripsByRouteId(id, unpaged);
        }

        return tripService.getTripsByRouteId(id, page);
    }

    @PostMapping(path = "/routes", consumes = "application/json")
    public CreateEntityResponse addNewRoute(@RequestBody @Valid RouteDto routeDto) {
        Route route = routeService.save(routeDto);

        return new CreateEntityResponse("Маршрут был успешно создан.", route.getId());
    }


    @GetMapping("/trips")
    public Page<TripDto> getTrips(@RequestParam(defaultValue = "0") int page,
                                  @RequestParam(defaultValue = "false") boolean unpaged) {
        if (unpaged) {
            return tripService.getTrips(unpaged);
        }

        return tripService.getTrips(page);
    }

    @PostMapping(path = "/trips", consumes = "application/json")
    public CreateEntityResponse addNewTrip(@RequestBody @Valid TripDto tripDto) {
        Trip trip = tripService.save(tripDto);

        return new CreateEntityResponse("Рейс был успешно создан.", trip.getId());
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
        busService.deleteModelById(id);
    }


    @GetMapping("/buses")
    public Page<BusDto> getBuses(@RequestParam(defaultValue = "0") int page,
                                 @RequestParam(defaultValue = "false") boolean unpaged) {
        if (unpaged) {
            return busService.getBuses(unpaged);
        }

        return busService.getBuses(page);
    }

    @PostMapping(path = "/buses", consumes = "application/json")
    public ResponseEntity<String> addNewBus(@RequestBody @Valid BusDto busDto) {
        BusDto newBus;

        try {
            newBus = busService.save(busDto);
        } catch (EntityExistsException e) {
            return new ResponseEntity<>("Автобус с таким номером уже существует", HttpStatus.CONFLICT);
        }

        return new ResponseEntity<>(String.valueOf(newBus.getId()), HttpStatus.OK);
    }

    @DeleteMapping(path = "/buses", consumes = "application/json")
    public void deleteBus(@RequestBody long id) {
        busService.deleteBusById(id);
    }
}
