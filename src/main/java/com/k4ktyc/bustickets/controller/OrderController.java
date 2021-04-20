package com.k4ktyc.bustickets.controller;

import com.k4ktyc.bustickets.model.*;
import com.k4ktyc.bustickets.service.OrderService;
import com.k4ktyc.bustickets.service.TripService;
import com.k4ktyc.bustickets.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.security.Principal;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final TripService tripService;
    private final OrderService orderService;
    private final UserService userService;

    @Autowired
    public OrderController(TripService tripService, OrderService orderService, UserService userService) {
        this.tripService = tripService;
        this.orderService = orderService;
        this.userService = userService;
    }


    @PostMapping(consumes = "application/json")
    public CreateOrderResponse createOrder(@RequestBody @Valid NewOrderDto newOrderDto, Principal principal) {
        Trip trip = tripService.findById(newOrderDto.getTripId()).get();
        trip.getBus().getSeats().get(newOrderDto.getSeatNumber()).setFree(false);
        tripService.save(trip);

        User user = userService.findByUsername(principal.getName()).get();

        Order newOrder = new Order(newOrderDto, trip, user);
        Order savedOrder = orderService.save(newOrder);

        return new CreateOrderResponse("Заказ обработан, спасибо за покупку!", savedOrder.getId());
    }
}
