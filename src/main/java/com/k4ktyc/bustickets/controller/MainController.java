package com.k4ktyc.bustickets.controller;

import com.k4ktyc.bustickets.model.Order;
import com.k4ktyc.bustickets.model.Passenger;
import com.k4ktyc.bustickets.model.Trip;
import com.k4ktyc.bustickets.model.UserOrdersDto;
import com.k4ktyc.bustickets.service.OrderService;
import com.k4ktyc.bustickets.service.PassengerService;
import com.k4ktyc.bustickets.service.TripService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.server.ResponseStatusException;

import java.time.Duration;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Controller
public class MainController {

    private final TripService tripService;
    private final OrderService orderService;
    private final PassengerService passengerService;

    @Autowired
    public MainController(TripService tripService, OrderService orderService, PassengerService passengerService) {
        this.tripService = tripService;
        this.orderService = orderService;
        this.passengerService = passengerService;
    }


    @GetMapping("/")
    public String home() {
        return "home";
    }

    @GetMapping("/trips")
    public String trips() {
        return "trips";
    }

    @GetMapping("/admin")
    public String admin() {
        return "admin";
    }

    @GetMapping("/orders")
    public String orders() {
        return "orders";
    }

    @GetMapping("/trips/{id}")
    public String tripInfo(@PathVariable(value = "id") long id, Model model) {
        Optional<Trip> trip = tripService.findById(id);
        if (trip.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No trip with id: " + id);
        }

        DateTimeFormatter timeFormat = DateTimeFormatter.ofPattern("HH:mm");
        DateTimeFormatter dateFormat = DateTimeFormatter.ofPattern("dd.MM.yyyy");

        String timeStart = trip.get().getDatetimeStart().format(timeFormat);
        String dateStart = trip.get().getDatetimeStart().format(dateFormat);
        String timeFinish = trip.get().getDatetimeFinish().format(timeFormat);
        String dateFinish = trip.get().getDatetimeFinish().format(dateFormat);
        String busClass = trip.get().getBus()
                .getBusClass().equals("Econom") ? "Автобус эконом-класса" : "Автобус бизнес-класса";

        long millis = Duration.between(trip.get().getDatetimeStart(), trip.get().getDatetimeFinish()).toMillis();
        long hours = TimeUnit.MILLISECONDS.toHours(millis);
        long minutes = TimeUnit.MILLISECONDS.toMinutes(millis) - TimeUnit.HOURS.toMinutes(hours);

        if (hours == 0) {
            model.addAttribute("tripTotalTime", String.format("%d мин", minutes));
        } else if (minutes == 0) {
            model.addAttribute("tripTotalTime", String.format("%d ч", hours));
        } else {
            model.addAttribute("tripTotalTime", String.format("%d ч, %d мин", hours, minutes));
        }

        model.addAttribute("trip", trip.get());
        model.addAttribute("tripTimeStart", timeStart);
        model.addAttribute("tripDateStart", dateStart);
        model.addAttribute("tripTimeFinish", timeFinish);
        model.addAttribute("tripDateFinish", dateFinish);
        model.addAttribute("tripBusClass", busClass);
        return "trip-info";
    }
}
