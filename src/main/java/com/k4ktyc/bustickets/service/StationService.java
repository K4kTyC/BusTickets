package com.k4ktyc.bustickets.service;

import com.k4ktyc.bustickets.domain.Station;
import com.k4ktyc.bustickets.domain.dto.StationDto;
import com.k4ktyc.bustickets.repository.RouteStationRepository;
import com.k4ktyc.bustickets.repository.StationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class StationService {

    private final StationRepository stationRepository;
    private final RouteStationRepository routeStationRepository;

    @Autowired
    public StationService(StationRepository stationRepository, RouteStationRepository routeStationRepository) {
        this.stationRepository = stationRepository;
        this.routeStationRepository = routeStationRepository;
    }


    public Station save(Station station) {
        return stationRepository.save(station);
    }

    public Page<StationDto> getAllStations(int pageNumber) {
        PageRequest paging = PageRequest.of(pageNumber, 20, Sort.by("name"));
        Page<Station> pagedStations = stationRepository.findAll(paging);

        return pagedStations.map(StationDto::new);
    }

    public Page<StationDto> getAllStations(int pageNumber, String filter) {
        PageRequest paging = PageRequest.of(pageNumber, 20, Sort.by("name"));
        Page<Station> pagedStations = stationRepository.findByNameContaining(filter, paging);

        return pagedStations.map(StationDto::new);
    }

    public void deleteById(long id) {
        stationRepository.deleteById(id);
        //routeStationRepository.deleteWhereStationIsNull();
    }

    public Optional<Station> findById(long id) {
        return stationRepository.findById(id);
    }
}
