package com.k4ktyc.bustickets.service;

import com.k4ktyc.bustickets.domain.Station;
import com.k4ktyc.bustickets.repository.StationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StationService {

    private final StationRepository stationRepository;

    @Autowired
    public StationService(StationRepository stationRepository) {
        this.stationRepository = stationRepository;
    }


    public Station save(Station station) {
        return stationRepository.save(station);
    }

    public Iterable<Station> getAllStations() {
        return stationRepository.findAll();
    }
}
