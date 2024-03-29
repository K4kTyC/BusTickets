package com.k4ktyc.bustickets.service;

import com.k4ktyc.bustickets.domain.Passenger;
import com.k4ktyc.bustickets.domain.User;
import com.k4ktyc.bustickets.domain.dto.UserDto;
import com.k4ktyc.bustickets.repository.PassengerRepository;
import com.k4ktyc.bustickets.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class UserService implements UserDetailsService {

    private RoleService roleService;
    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;

    private PassengerRepository passengerRepository;


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Not found a user with username: " + username));

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(), user.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority(user.getRole().getValue())));
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public List<Passenger> getUserPassengers(long userId) {
        return passengerRepository.findByUserId(userId);
    }

    public boolean registerUser(UserDto userDto) {
        User user = new User(userDto);
        user.setRole(roleService.findByValue("ROLE_USER").get());
        if (isUserExists(user)) {
            return false;
        }
        String encodedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);

        userRepository.save(user);

        return true;
    }

    public boolean isUserExists(User user) {
        return userRepository.findByUsername(user.getUsername()).isPresent();
    }


    UserDto createDtoFromUser(User user) {
        UserDto dto = new UserDto();
        dto.setUsername(user.getUsername());
        dto.setRole(user.getRole().getValue());

        return dto;
    }


    @Autowired
    public void setUserRepository(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Autowired
    public void setPasswordEncoder(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    @Autowired
    public void setRoleService(RoleService roleService) {
        this.roleService = roleService;
    }

    @Autowired
    public void setPassengerRepository(PassengerRepository passengerRepository) {
        this.passengerRepository = passengerRepository;
    }
}
