package com.k4ktyc.bustickets.service;

import com.k4ktyc.bustickets.model.Passenger;
import com.k4ktyc.bustickets.repository.PassengerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class PassengerService {

    private final PassengerRepository passengerRepository;

    @Autowired
    public PassengerService(PassengerRepository passengerRepository) {
        this.passengerRepository = passengerRepository;
    }

    public Iterable<Passenger> getAllPassengers() {
        return passengerRepository.findAll();
    }

    public Passenger save(Passenger passenger) {
        Optional<Passenger> foundPassenger = passengerRepository.findByNameAndLastname(passenger.getName(), passenger.getLastname());
        if (foundPassenger.isEmpty()) {
            return passengerRepository.save(passenger);
        }
        return foundPassenger.get();
    }
}
