package com.k4ktyc.bustickets.service;

import com.k4ktyc.bustickets.model.User;
import com.k4ktyc.bustickets.model.UserDto;
import com.k4ktyc.bustickets.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Optional;

@Service
public class UserService implements UserDetailsService {

    private RoleService roleService;
    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;

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
}
