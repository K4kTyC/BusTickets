package com.k4ktyc.bustickets.repository;

import com.k4ktyc.bustickets.model.Order;
import com.k4ktyc.bustickets.model.Passenger;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface OrderRepository extends PagingAndSortingRepository<Order, Long> {
    Page<Order> findOrdersByPassengersContains(Pageable pageable, Passenger passenger);
    long countByPassengersContains(Passenger passenger);
}
