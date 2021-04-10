package com.k4ktyc.bustickets.model;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "stations")
@Getter @Setter
public class Station {

    @Id @GeneratedValue
    private long id;

    private String name;

    private LocalDateTime datetimeFrom;

    private LocalDateTime datetimeTo;

    @ManyToOne
    @JoinColumn(name = "track_id", nullable = false, updatable = false)
    private Track track;
}
