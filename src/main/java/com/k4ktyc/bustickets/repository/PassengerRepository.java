package com.k4ktyc.bustickets.repository;

import com.k4ktyc.bustickets.model.Passenger;
import org.springframework.data.repository.CrudRepository;

public interface PassengerRepository extends CrudRepository<Passenger, Long> {
}
