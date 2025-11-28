package com.servicios.server.dashboard.controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.servicios.server.dashboard.entity.dto.DashboardResponse;
import com.servicios.server.dashboard.service.DashboardService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashboardController {
    
    private final DashboardService dashboardService;

    @GetMapping
    public DashboardResponse getStats(@RequestHeader("Authorization") String token) {
        return dashboardService.getDashboardStats(token);
    }
}
