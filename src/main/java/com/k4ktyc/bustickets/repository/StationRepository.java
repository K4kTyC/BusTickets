package com.k4ktyc.bustickets.repository;

import com.k4ktyc.bustickets.domain.Station;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface StationRepository extends PagingAndSortingRepository<Station, Long> {
}
