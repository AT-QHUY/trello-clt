package com.example.demo.mapper;

import com.example.demo.model.dto.user.GetUserDto;
import com.example.demo.model.entity.impl.User;

import java.util.List;

public class UserMapper {

    public static GetUserDto toDto(User user) {
        if (user == null) {
            return null;
        }
        return GetUserDto
                .builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }

    public static List<GetUserDto> toDto(List<User> users) {
        if (users == null) return null;
        return users.stream().map(UserMapper::toDto).toList();
    }
}
