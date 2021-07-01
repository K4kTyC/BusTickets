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
    value = "SELECT seat FROM orders" +
            "   WHERE trip_id = ?1 AND" +
            "       ((station_start_id < ?2 AND station_finish_id > ?2) OR" +
            "        (station_start_id > ?2 AND station_start_id < ?3) OR" +
            "        (station_start_id = ?2))" +
            "   ORDER BY seat")
    List<Integer> findNotFreeSeats(long tripId, long startId, long finishId);
}
