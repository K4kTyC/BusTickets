package com.k4ktyc.bustickets.repository;

import com.k4ktyc.bustickets.domain.BusModel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface BusModelRepository extends PagingAndSortingRepository<BusModel, Long> {
    Page<BusModel> findByNameContaining(String filter, Pageable pageable);
}
