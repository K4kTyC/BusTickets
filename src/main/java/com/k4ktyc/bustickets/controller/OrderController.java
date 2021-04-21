package com.k4ktyc.bustickets.controller;

import com.k4ktyc.bustickets.model.*;
import com.k4ktyc.bustickets.service.OrderService;
import com.k4ktyc.bustickets.service.PassengerService;
import com.k4ktyc.bustickets.service.TripService;
import com.k4ktyc.bustickets.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

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
    public List<UserOrdersDto> getAllUserOrders() {
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
