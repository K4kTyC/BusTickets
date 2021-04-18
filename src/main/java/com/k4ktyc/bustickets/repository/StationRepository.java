package com.k4ktyc.bustickets.repository;

import com.k4ktyc.bustickets.model.Station;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface StationRepository extends CrudRepository<Station, Long> {
    Optional<Station> findByName(String name);
}
