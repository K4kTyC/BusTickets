package com.k4ktyc.bustickets.controller;

import com.k4ktyc.bustickets.domain.dto.StationDto;
import com.k4ktyc.bustickets.domain.dto.TripDto;
import com.k4ktyc.bustickets.domain.dto.TripSearchData;
import com.k4ktyc.bustickets.service.TripService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

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

    @GetMapping("/search")
    public Page<TripDto> search(@RequestParam(defaultValue = "0") int page,
                                @RequestParam String datetime,
                                @RequestParam String start,
                                @RequestParam String finish) {
        TripSearchData searchData = new TripSearchData(LocalDateTime.parse(datetime, DateTimeFormatter.ISO_ZONED_DATE_TIME), start, finish);

        return tripService.searchTrips(searchData, page);
    }
}
