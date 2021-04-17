package com.k4ktyc.bustickets.repository;

import com.k4ktyc.bustickets.model.Trip;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface TripRepository extends PagingAndSortingRepository<Trip, Long> {
}
