package com.example.demo.controller;


import com.example.demo.model.dto.user.GetUserDto;
import com.example.demo.model.dto.user.UpdateUserDto;
import com.example.demo.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private IUserService userService;


    @GetMapping
    public List<GetUserDto> findAll() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public GetUserDto findById(@PathVariable UUID id) {
        return userService.getUserById(id);
    }

    @PutMapping
    public GetUserDto update(@RequestBody UpdateUserDto userDto) {
        return userService.updateUser(userDto);
    }

    @ResponseStatus(HttpStatus.NO_CONTENT) // 204
    @DeleteMapping("/{id}")
    public boolean deleteById(@PathVariable UUID id) {
       return userService.deleteUserById(id);
    }
}
