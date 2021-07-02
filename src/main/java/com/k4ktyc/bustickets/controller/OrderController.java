package com.k4ktyc.bustickets.controller;

import com.k4ktyc.bustickets.domain.Order;
import com.k4ktyc.bustickets.domain.dto.NewOrderDto;
import com.k4ktyc.bustickets.domain.dto.OrderDto;
import com.k4ktyc.bustickets.domain.dto.UserOrdersDto;
import com.k4ktyc.bustickets.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    @Autowired
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }


    @GetMapping
    public List<UserOrdersDto> getAllUserOrders() {
        return orderService.countOrdersByPassengers();
    }

    @GetMapping("/search")
    public Page<OrderDto> findOrders(@RequestParam int page,
                                     @RequestParam String name,
                                     @RequestParam String lastname) {
        return orderService.findOrdersByPassenger(page, name, lastname);
    }

    @PostMapping(consumes = "application/json")
    public ResponseEntity<String> createOrder(@RequestBody @Valid NewOrderDto newOrderDto, Principal principal) {
        Order newOrder = orderService.createNewOrder(newOrderDto, principal);

        return new ResponseEntity<>(String.valueOf(newOrder.getId()), HttpStatus.OK);
    }
}
