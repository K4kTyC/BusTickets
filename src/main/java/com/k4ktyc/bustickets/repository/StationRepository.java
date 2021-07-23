package com.k4ktyc.bustickets.repository;

import com.k4ktyc.bustickets.domain.Station;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.Optional;

public interface StationRepository extends PagingAndSortingRepository<Station, Long> {
    Page<Station> findByNameContaining(String filter, Pageable pageable);
    Optional<Station> findByName(String name);
}
