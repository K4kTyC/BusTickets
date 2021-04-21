package com.k4ktyc.bustickets.service;

import com.k4ktyc.bustickets.model.Order;
import com.k4ktyc.bustickets.model.OrderDto;
import com.k4ktyc.bustickets.model.Passenger;
import com.k4ktyc.bustickets.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final PassengerService passengerService;

    @Autowired
    public OrderService(OrderRepository orderRepository, PassengerService passengerService) {
        this.orderRepository = orderRepository;
        this.passengerService = passengerService;
    }

    public Page<OrderDto> findOrdersByPassenger(int pageNumber, Passenger passenger) {
        PageRequest paging = PageRequest.of(pageNumber, 10);
        Page<Order> pagedOrders = orderRepository.findOrdersByPassengersContains(paging, passenger);
        return pagedOrders.map(OrderDto::new);
    }

    public long countByPassenger(Passenger passenger) {
        return orderRepository.countByPassengersContains(passenger);
    }

    public Order save(Order order) {
        Passenger passenger = passengerService.save(order.getPassengers().get(0));
        order.getPassengers().set(0, passenger);
        return orderRepository.save(order);
    }
}
