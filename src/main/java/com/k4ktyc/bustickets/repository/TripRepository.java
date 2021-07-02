package com.k4ktyc.bustickets.repository;

import com.k4ktyc.bustickets.domain.Trip;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.time.LocalDateTime;

public interface TripRepository extends PagingAndSortingRepository<Trip, Long> {
    void deleteById(long id);
    Page<Trip> findByRouteId(long id, Pageable pageable);
    Page<Trip> findByDatetimeAfter(LocalDateTime now, Pageable pageable);

    @Query(value = "SELECT trip FROM Trip trip" +
                   "    JOIN trip.route.stations rs1" +
                   "    JOIN trip.route.stations rs2" +
                   "    WHERE trip.datetime > ?1 AND trip.datetime < ?2" +
                   "      AND rs1.station.name = ?3 AND rs2.station.name = ?4" +
                   "      AND rs1.id < rs2.id" +
                   "    ORDER BY trip.datetime"
    )
    Page<Trip> searchTrips(LocalDateTime dateStart,
                           LocalDateTime dateFinish,
                           String stationStart,
                           String stationFinish,
                           Pageable pageable);
}
