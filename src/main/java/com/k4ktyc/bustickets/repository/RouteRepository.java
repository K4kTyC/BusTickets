package com.k4ktyc.bustickets.repository;

import com.k4ktyc.bustickets.model.Route;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface RouteRepository extends PagingAndSortingRepository<Route, Long> {
}
