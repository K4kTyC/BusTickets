package com.k4ktyc.bustickets.service;

import com.k4ktyc.bustickets.model.Order;
import com.k4ktyc.bustickets.model.Passenger;
import com.k4ktyc.bustickets.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
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

    public List<Order> findOrdersByPassenger(Passenger passenger) {
        return orderRepository.findOrdersByPassengersContains(passenger);
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
