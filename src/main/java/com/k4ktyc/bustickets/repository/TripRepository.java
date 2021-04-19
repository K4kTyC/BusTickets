package com.k4ktyc.bustickets.repository;

import com.k4ktyc.bustickets.model.Trip;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.time.LocalDateTime;

public interface TripRepository extends PagingAndSortingRepository<Trip, Long> {
    Page<Trip> findTripsByStationStartEqualsAndStationFinishEqualsAndDatetimeStartBetween(
            Pageable pageable, String sStart, String sFinish, LocalDateTime datetimeStart, LocalDateTime datetimeFinish);
}
