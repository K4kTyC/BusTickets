package com.k4ktyc.bustickets.service;

import com.k4ktyc.bustickets.model.Role;
import com.k4ktyc.bustickets.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class RoleService {

    private final RoleRepository roleRepository;

    @Autowired
    public RoleService(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    public Optional<Role> findByValue(String value) {
        return roleRepository.findByValue(value);
    }

    public void save(Role role) {
        roleRepository.save(role);
    }
}
