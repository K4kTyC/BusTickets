package com.k4ktyc.bustickets.repository;

import com.k4ktyc.bustickets.domain.Bus;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface BusRepository extends PagingAndSortingRepository<Bus, Long> {
    boolean existsByNumber(int number);
}
