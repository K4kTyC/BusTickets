package com.k4ktyc.bustickets.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class StaticPagesController {

    @GetMapping("/")
    public String home() {
        return "home.html";
    }

    @GetMapping("/routes")
    public String routes() {
        return "routes.html";
    }

    @GetMapping("/admin")
    public String admin() {
        return "admin.html";
    }
}
