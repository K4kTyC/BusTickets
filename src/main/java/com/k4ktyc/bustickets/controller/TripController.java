package com.k4ktyc.bustickets.controller;

import com.k4ktyc.bustickets.domain.dto.TripDto;
import com.k4ktyc.bustickets.domain.dto.TripSearchData;
import com.k4ktyc.bustickets.service.TripService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("api/trips")
public class TripController {

    private final TripService tripService;

    @Autowired
    public TripController(TripService tripService) {
        this.tripService = tripService;
    }

    @GetMapping
    public Page<TripDto> getAllTrips(@RequestParam(defaultValue = "0") int page) {
        return tripService.getAllTrips(page);
    }

    @GetMapping("/{id}")
    public TripDto getTrip(@PathVariable long id) {
        return tripService.getTripById(id);
    }

    @GetMapping("/{id}/seats")
    public List<Integer> getNotFreeSeats(@PathVariable long id,
                                         @RequestParam(defaultValue = "") String stationStart,
                                         @RequestParam(defaultValue = "") String stationFinish) {

        return tripService.getNotFreeSeats(id, stationStart, stationFinish);
    }

    @GetMapping("/search")
    public Page<TripDto> search(@RequestParam(defaultValue = "0") int page,
                                @RequestParam String datetime,
                                @RequestParam String start,
                                @RequestParam String finish) {
        TripSearchData searchData = new TripSearchData(LocalDate.parse(datetime), start, finish);

        return tripService.searchTrips(searchData, page);
    }
}
