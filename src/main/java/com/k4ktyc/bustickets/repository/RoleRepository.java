package com.k4ktyc.bustickets.repository;

import com.k4ktyc.bustickets.domain.Role;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface RoleRepository extends CrudRepository<Role, Long> {
    Optional<Role> findByValue(String value);
}
