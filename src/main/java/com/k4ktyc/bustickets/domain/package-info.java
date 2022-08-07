@GenericGenerator(
        name = "optimized-sequence",
        strategy = "enhanced-sequence",
        parameters = {
                @Parameter(name="prefer_sequence_per_entity", value="true"),
                @Parameter(name="optimizer", value="hilo"),
                @Parameter(name="initial_value", value = "500"),
                @Parameter(name="increment_size",/*TODO change to 50*/ value="1")})

package com.k4ktyc.bustickets.domain;

import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;
