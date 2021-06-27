package com.k4ktyc.bustickets.repository;

import com.k4ktyc.bustickets.domain.OrderStatus;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface OrderStatusRepository extends CrudRepository<OrderStatus, Long> {
    Optional<OrderStatus> findByValue(String value);
}
