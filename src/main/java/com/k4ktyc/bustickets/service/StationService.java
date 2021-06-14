package com.k4ktyc.bustickets.service;

import com.k4ktyc.bustickets.domain.Station;
import com.k4ktyc.bustickets.domain.dto.StationDto;
import com.k4ktyc.bustickets.repository.StationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

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

    public Page<StationDto> getAllStations(int pageNumber) {
        PageRequest paging = PageRequest.of(pageNumber, 5);
        Page<Station> pagedStations = stationRepository.findAll(paging);

        return pagedStations.map(StationDto::new);
    }

    public Optional<Station> findById(long id) {
        return stationRepository.findById(id);
    }
}
