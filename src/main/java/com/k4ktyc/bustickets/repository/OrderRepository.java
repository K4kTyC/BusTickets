package com.k4ktyc.bustickets.repository;

import com.k4ktyc.bustickets.model.Order;
import org.springframework.data.repository.CrudRepository;

public interface OrderRepository extends CrudRepository<Order, Long> {
}
