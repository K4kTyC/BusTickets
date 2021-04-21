package com.k4ktyc.bustickets.model;

import lombok.Getter;

import javax.validation.constraints.NotBlank;

@Getter
public class OrderSearchData {

    @NotBlank
    private String name;

    @NotBlank
    private String lastname;
}
