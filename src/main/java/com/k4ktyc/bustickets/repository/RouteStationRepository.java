package com.k4ktyc.bustickets.repository;

import com.k4ktyc.bustickets.domain.RouteStation;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.transaction.annotation.Transactional;

public interface RouteStationRepository extends CrudRepository<RouteStation, Long> {
    @Modifying
    @Transactional
    @Query("DELETE FROM RouteStation rs WHERE rs.station IS NULL")
    public void deleteWhereStationIsNull();
}
