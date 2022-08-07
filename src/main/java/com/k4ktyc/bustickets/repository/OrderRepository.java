package com.k4ktyc.bustickets.repository;

import com.k4ktyc.bustickets.domain.Order;
import com.k4ktyc.bustickets.domain.Passenger;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.List;

public interface OrderRepository extends PagingAndSortingRepository<Order, Long> {
    Page<Order> findOrdersByPassenger(Pageable pageable, Passenger passenger);
    long countByPassenger(Passenger passenger);

    @Query(nativeQuery = true,
    value = "SELECT DISTINCT seat FROM orders" +
            "   WHERE trip_id = ?1 AND" +
            "       ((route_station_start_id < ?2 AND route_station_finish_id > ?2) OR" +
            "        (route_station_start_id > ?2 AND route_station_start_id < ?3) OR" +
            "        (route_station_start_id = ?2))" +
            "   ORDER BY seat")
    List<Integer> findNotFreeSeats(long tripId, long startId, long finishId);
}
