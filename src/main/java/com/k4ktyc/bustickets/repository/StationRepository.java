package com.k4ktyc.bustickets.repository;

import com.k4ktyc.bustickets.domain.Station;
import org.springframework.data.repository.CrudRepository;

public interface StationRepository extends CrudRepository<Station, Long> {
}
