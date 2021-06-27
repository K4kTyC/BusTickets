package com.k4ktyc.bustickets.service;

import com.k4ktyc.bustickets.domain.*;
import com.k4ktyc.bustickets.domain.dto.NewOrderDto;
import com.k4ktyc.bustickets.repository.OrderRepository;
import com.k4ktyc.bustickets.repository.OrderStatusRepository;
import com.k4ktyc.bustickets.repository.StationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;

@Service
public class OrderService {

    private final TripService tripService;
    private final UserService userService;
    private final PassengerService passengerService;

    private final OrderRepository orderRepository;
    private final OrderStatusRepository orderStatusRepository;
    private final StationRepository stationRepository;

    @Autowired
    public OrderService(TripService tripService,
                        UserService userService,
                        OrderRepository orderRepository,
                        PassengerService passengerService,
                        OrderStatusRepository orderStatusRepository,
                        StationRepository stationRepository) {
        this.tripService = tripService;
        this.userService = userService;
        this.orderRepository = orderRepository;
        this.passengerService = passengerService;
        this.orderStatusRepository = orderStatusRepository;
        this.stationRepository = stationRepository;
    }

//    public Page<OrderDto> findOrdersByPassenger(int pageNumber, Passenger passenger) {
//        PageRequest paging = PageRequest.of(pageNumber, 10);
//        Page<Order> pagedOrders = orderRepository.findOrdersByPassengersContains(paging, passenger);
//        return pagedOrders.map(OrderDto::new);
//    }

//    public long countByPassenger(Passenger passenger) {
//        return orderRepository.countByPassengersContains(passenger);
//    }

    public Order save(Order order) {
        return orderRepository.save(order);
    }

    public Order createNewOrder(NewOrderDto dto, Principal principal) {
        Trip trip = tripService
                .findById(dto.getTripId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Wrong trip id"));

        Station sStart, sFinish;
        sStart = stationRepository
                .findByName(dto.getStationStart())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Wrong start station"));
        sFinish = stationRepository
                .findByName(dto.getStationFinish())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Wrong finish station"));

        User user = userService
                .findByUsername(principal.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
        List<Passenger> userPassengers = userService.getUserPassengers(user.getId());

        Passenger passenger = null;
        Passenger p = new Passenger(dto.getPassenger().getName(), dto.getPassenger().getLastname(), user);
        for (Passenger uP : userPassengers) {
            if (uP.getName().equals(p.getName()) && uP.getLastname().equals(p.getLastname())) {
                passenger = uP;
                break;
            }
        }
        if (passenger == null) {
            passenger = passengerService.save(p);
        }

        Seat chosenSeat = null;
        for (Seat s : trip.getSeats()) {
            if (s.getNumber() == dto.getSeatNumber()) {
                chosenSeat = s;
                break;
            }
        }
        if (chosenSeat == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Wrong seat number");
        }
        if (!chosenSeat.isFree()) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Chosen seat is already taken");
        }
        chosenSeat.setFree(false);

        LocalDateTime datetime = LocalDateTime.now(ZoneId.of("Europe/Minsk"));

        OrderStatus status = orderStatusRepository
                .findByValue("created")
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR));

        trip = tripService.update(trip);   // To set chosen seat to not free

        long price = 0;
        boolean isCounter = false;
        for (RouteStation rs : trip.getRoute().getStations()) {
            if (isCounter) {
                price += rs.getPrice();
            }
            if (rs.getStation() == sStart) {
                isCounter = true;
            }
            if (rs.getStation() == sFinish) {
                isCounter = false;
            }
        }

        Order order = new Order();
        order.setTrip(trip);
        order.setStationStart(sStart);
        order.setStationFinish(sFinish);
        order.setUser(user);
        order.setPassenger(passenger);
        order.setSeat(chosenSeat);
        order.setDateTimeOrderCreated(datetime);
        order.setStatus(status);
        order.setPrice(price);

        return orderRepository.save(order);
    }
}
