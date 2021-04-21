package com.k4ktyc.bustickets.repository;

import com.k4ktyc.bustickets.model.Passenger;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface PassengerRepository extends CrudRepository<Passenger, Long> {
    Optional<Passenger> findByNameAndLastname(String name, String lastname);
}
