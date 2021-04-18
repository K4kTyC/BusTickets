package com.k4ktyc.bustickets.service;

import com.k4ktyc.bustickets.model.Trip;
import com.k4ktyc.bustickets.model.TripDto;
import com.k4ktyc.bustickets.repository.TripRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

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

    public Trip save(Trip newTrip) {
        return tripRepository.save(newTrip);
    }
}
