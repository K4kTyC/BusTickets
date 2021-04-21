package com.k4ktyc.bustickets.repository;

import com.k4ktyc.bustickets.model.Order;
import com.k4ktyc.bustickets.model.Passenger;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.List;

public interface OrderRepository extends PagingAndSortingRepository<Order, Long> {
    List<Order> findOrdersByPassengersContains(Passenger passenger);
    long countByPassengersContains(Passenger passenger);
}
