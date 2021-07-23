package com.k4ktyc.bustickets.repository;

import com.k4ktyc.bustickets.domain.Trip;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;

public interface TripRepository extends PagingAndSortingRepository<Trip, Long> {
    void deleteById(long id);
    Page<Trip> findByRouteId(long id, Pageable pageable);
    Page<Trip> findByDatetimeAfter(LocalDateTime now, Pageable pageable);

    @Query(value = "SELECT trip FROM Trip trip" +
                   "    JOIN trip.route.stations rs1" +
                   "    JOIN trip.route.stations rs2" +
                   "    WHERE trip.datetime > :dateStart AND trip.datetime < :dateFinish" +
                   "      AND rs1.station.name = :sStart AND rs2.station.name = :sFinish" +
                   "      AND rs1.id < rs2.id" +
                   "    ORDER BY trip.datetime"
    )
    Page<Trip> searchTrips(@Param("dateStart") LocalDateTime dateStart,
                           @Param("dateFinish") LocalDateTime dateFinish,
                           @Param("sStart") String stationStart,
                           @Param("sFinish") String stationFinish,
                           Pageable pageable);
}
