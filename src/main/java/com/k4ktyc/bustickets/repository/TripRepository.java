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

    @Query(nativeQuery = true,
           value = "SELECT trips.* FROM trips" +
                   "    INNER JOIN routes r ON trips.route_id = r.id" +
                   "    INNER JOIN route_station s1 ON r.id = s1.route_id" +
                   "    INNER JOIN route_station s2 ON r.id = s2.route_id" +
                   "    WHERE datetime > ?1 AND datetime < ?2" +
                   "      AND s1.station_id = ?3 AND s2.station_id = ?4" +
                   "      AND s1.id < s2.id" +
                   "    ORDER BY datetime",
           countQuery = "SELECT COUNT(*) FROM trips" +
                        "    INNER JOIN routes r ON trips.route_id = r.id" +
                        "    INNER JOIN route_station s1 ON r.id = s1.route_id" +
                        "    INNER JOIN route_station s2 ON r.id = s2.route_id" +
                        "    WHERE datetime > ?1 AND datetime < ?2" +
                        "      AND s1.station_id = ?3 AND s2.station_id = ?4" +
                        "      AND s1.id < s2.id" +
                        "    ORDER BY datetime"
    )
    Page<Trip> searchTrips(LocalDateTime dateStart,
                           LocalDateTime dateFinish,
                           long stationStartId,
                           long stationFinishId,
                           Pageable pageable);
}
