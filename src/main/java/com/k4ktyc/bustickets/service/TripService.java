package com.k4ktyc.bustickets.service;

import com.k4ktyc.bustickets.model.Trip;
import com.k4ktyc.bustickets.repository.TripRepository;
import org.springframework.stereotype.Service;

@Service
public class TripService {

    private final TripRepository tripRepository;

    public TripService(TripRepository tripRepository) {
        this.tripRepository = tripRepository;
    }

    public Trip save(Trip newTrip) {
        return tripRepository.save(newTrip);
    }
}
