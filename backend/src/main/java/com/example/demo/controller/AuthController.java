package com.example.demo.controller;

import com.example.demo.model.dto.auth.LoginDto;
import com.example.demo.model.dto.auth.TokenDto;
import com.example.demo.model.dto.user.CreateUserDto;
import com.example.demo.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auths")
public class AuthController {
    @Autowired
    private IUserService userService;

    @PostMapping("/login")
    public TokenDto generateToken(@RequestBody LoginDto loginDto) {
        return userService.getTokensByEmailAndPassword(loginDto.getEmail(), loginDto.getPassword());
    }

    @PostMapping("/refresh")
    public TokenDto refreshToken(@RequestBody TokenDto tokenDto) {
        return userService.refreshToken(tokenDto);
    }

    @PostMapping("/register")
    public TokenDto register(@RequestBody CreateUserDto createUserDto) {
        return userService.createNewUser(createUserDto);
    }
}
