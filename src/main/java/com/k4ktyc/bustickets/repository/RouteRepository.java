package com.k4ktyc.bustickets.repository;

import com.k4ktyc.bustickets.model.Route;
import com.k4ktyc.bustickets.model.Station;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface RouteRepository extends PagingAndSortingRepository<Route, Long> {
    Page<Route> findRouteByStationsIsStartingWithAndStationsIsEndingWith(Station stationFrom, Station stationTo, Pageable pageable);
}
