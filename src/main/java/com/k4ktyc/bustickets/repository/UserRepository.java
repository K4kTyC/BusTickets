package com.k4ktyc.bustickets.repository;

import com.k4ktyc.bustickets.model.User;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface UserRepository extends CrudRepository<User, Long> {
    Optional<User> findByUsername(String username);
}