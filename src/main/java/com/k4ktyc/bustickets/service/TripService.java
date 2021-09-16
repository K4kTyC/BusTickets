package com.k4ktyc.bustickets.service;

import com.k4ktyc.bustickets.domain.Bus;
import com.k4ktyc.bustickets.domain.Route;
import com.k4ktyc.bustickets.domain.RouteStation;
import com.k4ktyc.bustickets.domain.Trip;
import com.k4ktyc.bustickets.domain.dto.BusDto;
import com.k4ktyc.bustickets.domain.dto.RouteDto;
import com.k4ktyc.bustickets.domain.dto.TripDto;
import com.k4ktyc.bustickets.domain.dto.TripSearchData;
import com.k4ktyc.bustickets.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
public class TripService {

    private final RouteService routeService;
    private final BusService busService;

    private final TripRepository tripRepository;
    private final RouteRepository routeRepository;
    private final RouteStationRepository rsRepository;
    private final BusRepository busRepository;
    private final OrderRepository orderRepository;

    @Autowired
    public TripService(RouteService routeService,
                       BusService busService,
                       TripRepository tripRepository,
                       RouteRepository routeRepository,
                       RouteStationRepository rsRepository,
                       BusRepository busRepository,
                       OrderRepository orderRepository) {
        this.routeService = routeService;
        this.busService = busService;
        this.tripRepository = tripRepository;
        this.routeRepository = routeRepository;
        this.rsRepository = rsRepository;
        this.busRepository = busRepository;
        this.orderRepository = orderRepository;
    }


    public boolean isTripExists(long id) {
        Optional<Trip> trip = tripRepository.findById(id);
        return trip.isPresent();
    }

    public Page<TripDto> getAllTrips(int pageNumber) {
        LocalDateTime today = LocalDateTime.of(LocalDate.now(), LocalTime.MIN);
        PageRequest paging = PageRequest.of(pageNumber, 5, Sort.by("datetime"));
        Page<Trip> pagedTrips = tripRepository.findByDatetimeAfter(today, paging);

        return pagedTrips.map(this::createDtoFromTrip);
    }

    public TripDto getTripById(long id) {
        Trip trip = tripRepository
                .findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Wrong trip id"));

        return createDtoFromTrip(trip);
    }

    public List<Integer> getNotFreeSeats(long tripId, String sStart, String sFinish) {
        Trip trip = tripRepository
                .findById(tripId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Wrong trip id"));

        RouteStation rsStart, rsFinish;
        if (sStart.isBlank() || sFinish.isBlank()) {
            List<RouteStation> stations = trip.getRoute().getStations();
            rsStart = stations.get(0);
            rsFinish = stations.get(stations.size() - 1);
        } else {
            rsStart = rsRepository.findByStationNameAndRouteId(sStart, trip.getRoute().getId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Wrong start station"));
            rsFinish = rsRepository.findByStationNameAndRouteId(sFinish, trip.getRoute().getId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Wrong finish station"));
        }

        return orderRepository.findNotFreeSeats(trip.getId(), rsStart.getId(), rsFinish.getId());
    }

    public Page<TripDto> searchTrips(TripSearchData searchData, int pageNumber) {
        LocalDateTime dateTimeStart = searchData.getTripDate();
        LocalDateTime dateTimeFinish = dateTimeStart.plusDays(1);

        PageRequest paging = PageRequest.of(pageNumber, 20);
        Page<Trip> pagedTrips = tripRepository.searchTrips(
                dateTimeStart,
                dateTimeFinish,
                searchData.getStationStart(),
                searchData.getStationFinish(),
                paging);

        return pagedTrips.map(this::createDtoFromTrip);
    }

    public Optional<Trip> findById(long id) {
        return tripRepository.findById(id);
    }

    public Trip save(TripDto dto) {
        Trip trip = createTripFromDto(dto);

        return tripRepository.save(trip);
    }

    public Page<TripDto> getTripsByRouteId(long routeId, int pageNumber) {
        PageRequest paging = PageRequest.of(pageNumber, 20, Sort.by("datetime"));
        Page<Trip> pagedTrips = tripRepository.findByRouteId(routeId, paging);

        return pagedTrips.map(this::createDtoFromTrip);
    }

    public Page<TripDto> getTripsByRouteId(long routeId, boolean isUnpaged) {
        Page<Trip> unpagedTrips = tripRepository.findByRouteId(routeId, Pageable.unpaged());

        return unpagedTrips.map(this::createDtoFromTrip);
    }

    public Page<TripDto> getTrips(int pageNumber) {
        PageRequest paging = PageRequest.of(pageNumber, 20);
        Page<Trip> pagedTrips = tripRepository.findAll(paging);

        return pagedTrips.map(this::createDtoFromTrip);
    }

    public Page<TripDto> getTrips(boolean isUnpaged) {
        Page<Trip> unpagedTrips = tripRepository.findAll(Pageable.unpaged());

        return unpagedTrips.map(this::createDtoFromTrip);
    }

    public Trip update(Trip trip) {
        return tripRepository.save(trip);
    }

    public void delete(long id) {
        tripRepository.deleteById(id);
    }


    private Trip createTripFromDto(TripDto dto) {
        Trip trip = new Trip();
        Route route = routeRepository.findById(dto.getRouteId()).get();
        Bus bus = busRepository.findById(dto.getBusId()).get();

        trip.setRoute(route);
        trip.setBus(bus);
        trip.setDatetime(dto.getDatetime());

        return trip;
    }

    TripDto createDtoFromTrip(Trip trip) {
        TripDto tripDto = new TripDto();
        RouteDto routeDto = routeService.createDtoFromRoute(trip.getRoute());
        BusDto busDto = busService.createDtoFromBus(trip.getBus());

        tripDto.setId(trip.getId());
        tripDto.setRouteDto(routeDto);
        tripDto.setBusDto(busDto);
        tripDto.setDatetime(trip.getDatetime());

        return tripDto;
    }
}
