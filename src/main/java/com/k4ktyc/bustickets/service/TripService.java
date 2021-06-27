package com.k4ktyc.bustickets.service;

import com.k4ktyc.bustickets.domain.Bus;
import com.k4ktyc.bustickets.domain.Route;
import com.k4ktyc.bustickets.domain.Seat;
import com.k4ktyc.bustickets.domain.dto.*;
import com.k4ktyc.bustickets.domain.Trip;
import com.k4ktyc.bustickets.repository.BusRepository;
import com.k4ktyc.bustickets.repository.RouteRepository;
import com.k4ktyc.bustickets.repository.StationRepository;
import com.k4ktyc.bustickets.repository.TripRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
public class TripService {

    private final RouteService routeService;
    private final BusService busService;

    private final TripRepository tripRepository;
    private final RouteRepository routeRepository;
    private final BusRepository busRepository;

    @Autowired
    public TripService(RouteService routeService,
                       BusService busService,
                       TripRepository tripRepository,
                       RouteRepository routeRepository,
                       BusRepository busRepository) {
        this.routeService = routeService;
        this.busService = busService;
        this.tripRepository = tripRepository;
        this.routeRepository = routeRepository;
        this.busRepository = busRepository;
    }


    public boolean isTripExists(long id) {
        Optional<Trip> trip = tripRepository.findById(id);
        return trip.isPresent();
    }

    public Page<TripDto> getAllTrips(int pageNumber) {
        PageRequest paging = PageRequest.of(pageNumber, 10, Sort.by("datetime"));
        Page<Trip> pagedTrips = tripRepository.findAll(paging);

        return pagedTrips.map(this::createDtoFromTrip);
    }

    public TripDto getTripById(long id) {
        Trip trip = tripRepository
                .findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Wrong trip id"));

        return createDtoFromTrip(trip);
    }

    public List<SeatDto> getSeatsByTripId(long id) {
        Trip trip = tripRepository
                .findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Wrong trip id"));

        return trip.getSeats()
                .stream().map(SeatDto::new)
                .collect(Collectors.toList());
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

        List<Seat> seats = new ArrayList<>();
        for (int i = 0; i < bus.getModel().getNumberOfSeats(); i++) {
            Seat seat = new Seat(i + 1, trip);
            seats.add(seat);
        }
        trip.setSeats(seats);

        return trip;
    }

    private TripDto createDtoFromTrip(Trip trip) {
        TripDto tripDto = new TripDto();
        RouteDto routeDto = routeService.createDtoFromRoute(trip.getRoute());
        BusDto busDto = busService.createDtoFromBus(trip.getBus());

        tripDto.setId(trip.getId());
        tripDto.setRouteDto(routeDto);
        tripDto.setBusDto(busDto);
        tripDto.setDatetime(trip.getDatetime());
        tripDto.setSeats(trip.getSeats()
                .stream().map(SeatDto::new)
                .collect(Collectors.toList()));

        return tripDto;
    }
}
