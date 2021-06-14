package com.k4ktyc.bustickets.repository;

import com.k4ktyc.bustickets.domain.Order;
import com.k4ktyc.bustickets.domain.Passenger;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface OrderRepository extends PagingAndSortingRepository<Order, Long> {
    Page<Order> findOrdersByPassengersContains(Pageable pageable, Passenger passenger);
    long countByPassengersContains(Passenger passenger);
}
