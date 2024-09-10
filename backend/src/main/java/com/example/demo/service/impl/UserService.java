package com.example.demo.service.impl;

import com.example.demo.mapper.UserMapper;
import com.example.demo.model.dto.auth.CustomUserDetails;
import com.example.demo.model.dto.auth.TokenDto;
import com.example.demo.model.dto.user.CreateUserDto;
import com.example.demo.model.dto.user.GetUserDto;
import com.example.demo.model.dto.user.UpdateUserDto;
import com.example.demo.model.entity.impl.User;
import com.example.demo.model.enums.JWT;
import com.example.demo.model.enums.UserRole;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.IUserService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService implements IUserService {
    @Autowired
    private final JWTService jwtService;
    @Autowired
    private UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final CustomUserDetailService customUserDetailService;

    @Override
    public TokenDto getTokensByEmailAndPassword(String email, String password) {
        CustomUserDetails userDetails = customUserDetailService.loadUserByEmail(email);

        if(!passwordEncoder.matches(password, userDetails.getPassword())){
            throw new BadCredentialsException("Bad credentials");
        }

        return jwtService.generateTokens(userDetails);

    }

    @Override
    public TokenDto refreshToken(TokenDto tokenDto) {
        UUID accessTokenId = jwtService.extractId(tokenDto.getAccessToken(), JWT.ACCESS_TOKEN);
        if(accessTokenId == null){
            throw new BadCredentialsException("Access token not valid");
        }

        CustomUserDetails customUserDetails = customUserDetailService.loadUserById(accessTokenId);

        if(!jwtService.isTokenValid(tokenDto.getRefreshToken(), customUserDetails,JWT.REFRESH_TOKEN)){
            throw new BadCredentialsException("Refresh token not valid");
        }

        return jwtService.generateTokens(customUserDetails);

    }

    @Override
    public List<GetUserDto> getAllUsers() {
        throw new EntityNotFoundException();
    }

    @Override
    public TokenDto createNewUser(CreateUserDto createUserDto) {
        String encodedPassword = passwordEncoder.encode(createUserDto.getPassword());
        User user =  User
                .builder()
                .username(createUserDto.getUsername())
                .email(createUserDto.getEmail())
                .password(encodedPassword)
                .role(UserRole.USER)
                .build();

        userRepository.save(user);
        CustomUserDetails userDetails = customUserDetailService.loadUserByEmail(createUserDto.getEmail());
        return jwtService.generateTokens(userDetails);


    }

    @Override
    public GetUserDto getUserById(UUID id) {
       Optional<User> user = userRepository.findById(id);
       if(user.isEmpty()){
           throw new EntityNotFoundException("User not found id: " + id);
       }
        return UserMapper.toDto(user.get());
    }

    @Override
    public Optional<User> getDefaultUserById(UUID id) {
        return userRepository.findById(id);
    }

    @Override
    public boolean deleteUserById(UUID id) {
        return false;
    }

    @Override
    public GetUserDto updateUser(UpdateUserDto updateUserDto) {
        return null;
    }
}
