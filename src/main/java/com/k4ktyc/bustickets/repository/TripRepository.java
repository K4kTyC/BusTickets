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

    @Query(nativeQuery = true,
           value = "SELECT trips.* FROM trips" +
                   "    INNER JOIN routes r ON trips.route_id = r.id" +
                   "    INNER JOIN route_station rs1 ON r.id = rs1.route_id" +
                   "    INNER JOIN route_station rs2 ON r.id = rs2.route_id" +
                   "    INNER JOIN stations s1 ON rs1.station_id = s1.id" +
                   "    INNER JOIN stations s2 ON rs2.station_id = s2.id" +
                   "    WHERE datetime > ?1 AND datetime < ?2" +
                   "      AND s1.name = ?3 AND s2.name = ?4" +
                   "      AND rs1.id < rs2.id" +
                   "    ORDER BY datetime",
           countQuery = "SELECT COUNT(*) FROM trips" +
                        "    INNER JOIN routes r ON trips.route_id = r.id" +
                        "    INNER JOIN route_station rs1 ON r.id = rs1.route_id" +
                        "    INNER JOIN route_station rs2 ON r.id = rs2.route_id" +
                        "    INNER JOIN stations s1 ON rs1.station_id = s1.id" +
                        "    INNER JOIN stations s2 ON rs2.station_id = s2.id" +
                        "    WHERE datetime > ?1 AND datetime < ?2" +
                        "      AND s1.name = ?3 AND s2.name = ?4" +
                        "      AND rs1.id < rs2.id" +
                        "    ORDER BY datetime"
    )
    Page<Trip> searchTrips(LocalDateTime dateStart,
                           LocalDateTime dateFinish,
                           String stationStart,
                           String stationFinish,
                           Pageable pageable);
}
