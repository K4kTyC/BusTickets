package com.k4ktyc.bustickets.service;

import com.k4ktyc.bustickets.domain.dto.TripDto;
import com.k4ktyc.bustickets.domain.dto.TripSearchData;
import com.k4ktyc.bustickets.domain.Trip;
import com.k4ktyc.bustickets.repository.TripRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Optional;

@Service
public class TripService {

    private final TripRepository tripRepository;

    @Autowired
    public TripService(TripRepository tripRepository) {
        this.tripRepository = tripRepository;
    }


    public Page<TripDto> getAllTrips(int pageNumber) {
        PageRequest paging = PageRequest.of(pageNumber, 10);
        Page<Trip> pagedTrips = tripRepository.findAll(paging);

        return pagedTrips.map(TripDto::new);
    }

    public Optional<Trip> findById(long id) {
        return tripRepository.findById(id);
    }

    public Trip save(Trip newTrip) {
        return tripRepository.save(newTrip);
    }

    public void delete(long id) {
        tripRepository.deleteById(id);
    }
}
