package com.k4ktyc.bustickets.model;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "tracks")
@Getter @Setter
public class Track {

    @Id @GeneratedValue
    private long id;

    private Integer number;

    private String trackClass;

    @OneToMany(mappedBy = "track")
    private List<Station> stations;
}
