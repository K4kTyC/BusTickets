package com.k4ktyc.bustickets.repository;

import com.k4ktyc.bustickets.domain.Trip;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface TripRepository extends PagingAndSortingRepository<Trip, Long> {
    void deleteById(long id);
    Page<Trip> findByRouteId(long id, Pageable pageable);
}
