package com.example.demo.model.dto.user;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class UpdateUserDto {
    private Long id;
    private String username;
}
