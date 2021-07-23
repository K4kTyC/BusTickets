package com.k4ktyc.bustickets.service;

import com.k4ktyc.bustickets.domain.Passenger;
import com.k4ktyc.bustickets.domain.dto.PassengerDto;
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

    public Optional<Passenger> findByNameAndLastname(String name, String lastname) {
        return passengerRepository.findByNameAndLastname(name, lastname);
    }

    public Passenger save(Passenger passenger) {
        return passengerRepository.save(passenger);
    }


    PassengerDto createDtoFromPassenger(Passenger passenger) {
        PassengerDto dto = new PassengerDto();
        dto.setId(passenger.getId());
        dto.setName(passenger.getName());
        dto.setLastname(passenger.getLastname());

        return dto;
    }
}
