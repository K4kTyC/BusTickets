package com.k4ktyc.bustickets.controller;

import com.k4ktyc.bustickets.domain.*;
import com.k4ktyc.bustickets.domain.dto.*;
import com.k4ktyc.bustickets.service.OrderService;
import com.k4ktyc.bustickets.service.PassengerService;
import com.k4ktyc.bustickets.service.TripService;
import com.k4ktyc.bustickets.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.validation.Valid;
import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final TripService tripService;
    private final OrderService orderService;
    private final UserService userService;
    private final PassengerService passengerService;

    @Autowired
    public OrderController(TripService tripService, OrderService orderService, UserService userService, PassengerService passengerService) {
        this.tripService = tripService;
        this.orderService = orderService;
        this.userService = userService;
        this.passengerService = passengerService;
    }


    @GetMapping
    public List<UserOrdersDto> getAllUserOrders(Principal principal) {
//        Optional<User> user = userService.findByUsername(principal.getName());
//        if (user.isEmpty()) {
//            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Эта функция доступна только авторизованным пользователям.");
//        }
//
//        if ("ROLE_ADMIN".equals(user.get().getRole().getValue())) {
//
//        }


        Iterable<Passenger> passengers = passengerService.getAllPassengers();
        List<UserOrdersDto> userOrdersDtoList = new ArrayList<>();

        for (var passenger : passengers) {
            long ordersAmount = orderService.countByPassenger(passenger);
            userOrdersDtoList.add(new UserOrdersDto(passenger.getId(),
                                                    passenger.getName(),
                                                    passenger.getLastname(),
                                                    ordersAmount));
        }
        return userOrdersDtoList;
    }

    @PostMapping(path = "/search", consumes = "application/json")
    public Page<OrderDto> findOrders(@RequestParam(defaultValue = "0") int page, @RequestBody @Valid OrderSearchData orderSearchData) {
        Passenger passenger = passengerService.findByNameAndLastname(orderSearchData.getName(), orderSearchData.getLastname()).get();
        return orderService.findOrdersByPassenger(page, passenger);
    }

    @PostMapping(consumes = "application/json")
    public ResponseEntity<String> createOrder(@RequestBody @Valid NewOrderDto newOrderDto, Principal principal) {
        Order newOrder = orderService.createNewOrder(newOrderDto, principal);

        return new ResponseEntity<>(String.valueOf(newOrder.getId()), HttpStatus.OK);
    }
}
