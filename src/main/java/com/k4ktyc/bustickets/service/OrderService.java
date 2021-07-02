package com.k4ktyc.bustickets.service;

import com.k4ktyc.bustickets.domain.*;
import com.k4ktyc.bustickets.domain.dto.NewOrderDto;
import com.k4ktyc.bustickets.domain.dto.OrderDto;
import com.k4ktyc.bustickets.domain.dto.UserOrdersDto;
import com.k4ktyc.bustickets.repository.OrderRepository;
import com.k4ktyc.bustickets.repository.OrderStatusRepository;
import com.k4ktyc.bustickets.repository.RouteStationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    private final RouteService routeService;
    private final TripService tripService;
    private final UserService userService;
    private final PassengerService passengerService;

    private final OrderRepository orderRepository;
    private final OrderStatusRepository orderStatusRepository;
    private final RouteStationRepository rsRepository;

    @Autowired
    public OrderService(RouteService routeService,
                        TripService tripService,
                        UserService userService,
                        OrderRepository orderRepository,
                        PassengerService passengerService,
                        OrderStatusRepository orderStatusRepository,
                        RouteStationRepository rsRepository) {
        this.routeService = routeService;
        this.tripService = tripService;
        this.userService = userService;
        this.orderRepository = orderRepository;
        this.passengerService = passengerService;
        this.orderStatusRepository = orderStatusRepository;
        this.rsRepository = rsRepository;
    }


    public List<UserOrdersDto> countOrdersByPassengers() {
        Iterable<Passenger> passengers = passengerService.getAllPassengers();
        List<UserOrdersDto> userOrdersDtoList = new ArrayList<>();

        for (var passenger : passengers) {
            long ordersAmount = orderRepository.countByPassenger(passenger);
            userOrdersDtoList.add(new UserOrdersDto(
                    passenger.getId(),
                    passenger.getName(),
                    passenger.getLastname(),
                    ordersAmount));
        }
        return userOrdersDtoList;
    }

    public Page<OrderDto> findOrdersByPassenger(int pageNumber, String name, String lastname) {
        Passenger passenger = passengerService
                .findByNameAndLastname(name, lastname)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Wrong passenger data"));
        PageRequest paging = PageRequest.of(pageNumber, 10);
        Page<Order> pagedOrders = orderRepository.findOrdersByPassenger(paging, passenger);
        return pagedOrders.map(this::createDtoFromOrder);
    }

    public Order save(Order order) {
        return orderRepository.save(order);
    }

    public Order createNewOrder(NewOrderDto dto, Principal principal) {
        Trip trip = tripService
                .findById(dto.getTripId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Wrong trip id"));

        RouteStation rsStart, rsFinish;
        rsStart = rsRepository.findByStationNameAndRouteId(dto.getStationStart(), trip.getRoute().getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Wrong start station"));
        rsFinish = rsRepository.findByStationNameAndRouteId(dto.getStationFinish(), trip.getRoute().getId())
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

        LocalDateTime datetime = LocalDateTime.now(ZoneId.of("Europe/Minsk"));

        OrderStatus status = orderStatusRepository
                .findByValue("created")
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "order_status error"));

        List<Integer> notFreeSeats = orderRepository.findNotFreeSeats(trip.getId(), rsStart.getId(), rsFinish.getId());
        if (notFreeSeats.contains(dto.getSeat())) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Chosen seat is already taken");
        }

        long price = 0;
        boolean isCounter = false;
        for (RouteStation rs : trip.getRoute().getStations()) {
            if (isCounter) {
                price += rs.getPrice();
            }
            if (rs == rsStart) {
                isCounter = true;
            }
            if (rs == rsFinish) {
                isCounter = false;
            }
        }

        Order order = new Order();
        order.setTrip(trip);
        order.setStationStart(rsStart);
        order.setStationFinish(rsFinish);
        order.setUser(user);
        order.setPassenger(passenger);
        order.setStatus(status);
        order.setDateTimeOrderCreated(datetime);
        order.setSeat(dto.getSeat());
        order.setPrice(price);

        return orderRepository.save(order);
    }


    private OrderDto createDtoFromOrder(Order order) {
        OrderDto dto = new OrderDto();
        dto.setId(order.getId());
        dto.setTrip(tripService.createDtoFromTrip(order.getTrip()));
        dto.setSStart(routeService.createDtoFromRouteStation(order.getStationStart()));
        dto.setSFinish(routeService.createDtoFromRouteStation(order.getStationFinish()));
        dto.setUser(userService.createDtoFromUser(order.getUser()));
        dto.setPassenger(passengerService.createDtoFromPassenger(order.getPassenger()));
        dto.setStatus(order.getStatus().getValue());
        dto.setDateTimeOrderCreated(order.getDateTimeOrderCreated());
        dto.setSeat(order.getSeat());
        dto.setPrice(order.getPrice());

        return dto;
    }
}
