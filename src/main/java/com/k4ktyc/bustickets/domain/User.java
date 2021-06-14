package com.k4ktyc.bustickets.domain;

import com.k4ktyc.bustickets.domain.dto.UserDto;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "users")
@Getter @Setter
public class User {

    @Id @GeneratedValue
    private long id;

    private String username;

    private String password;

    @ManyToOne
    @JoinColumn(name = "role_id", nullable = false, updatable = false)
    private Role role;

    @OneToMany(mappedBy = "user")
    private List<Order> orders;

    @OneToMany(mappedBy = "user")
    private List<Passenger> passengers;


    public User() {}

    public User(UserDto userDto) {
        this.username = userDto.getUsername();
        this.password = userDto.getPassword();
    }
}
