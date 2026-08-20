package com.stamptour.backend.controller;

import com.stamptour.backend.entity.User;
import com.stamptour.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public User getUser(@AuthenticationPrincipal String userId) {
        return userService.getUserById(userId);
    }
}