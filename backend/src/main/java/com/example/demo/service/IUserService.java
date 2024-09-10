package com.example.demo.service;

import com.example.demo.model.dto.auth.TokenDto;
import com.example.demo.model.dto.user.CreateUserDto;
import com.example.demo.model.dto.user.GetUserDto;
import com.example.demo.model.dto.user.UpdateUserDto;
import com.example.demo.model.entity.impl.User;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface IUserService {
    public List<GetUserDto> getAllUsers();
    public TokenDto createNewUser(CreateUserDto createUserDto);
    public GetUserDto getUserById(UUID id);
    public Optional<User> getDefaultUserById(UUID id);
    public boolean deleteUserById(UUID id);
    public GetUserDto updateUser(UpdateUserDto updateUserDto);
    public TokenDto getTokensByEmailAndPassword(String email, String password);
    public TokenDto refreshToken(TokenDto tokenDto);
}
