package com.k4ktyc.bustickets.service;

import com.k4ktyc.bustickets.model.Order;
import com.k4ktyc.bustickets.repository.OrderRepository;
import com.k4ktyc.bustickets.repository.PassengerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final PassengerRepository passengerRepository;

    @Autowired
    public OrderService(OrderRepository orderRepository, PassengerRepository passengerRepository) {
        this.orderRepository = orderRepository;
        this.passengerRepository = passengerRepository;
    }


    public Order save(Order order) {
        passengerRepository.save(order.getPassengers().get(0));
        return orderRepository.save(order);
    }
}
