package com.k4ktyc.bustickets.domain;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "order_status")
@Getter @Setter
public class OrderStatus {

    @Id @GeneratedValue(generator = "optimized-sequence")
    private long id;

    private String value;

}
