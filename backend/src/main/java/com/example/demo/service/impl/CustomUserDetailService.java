package com.example.demo.service.impl;

import com.example.demo.model.dto.auth.CustomUserDetails;
import com.example.demo.model.entity.impl.User;
import com.example.demo.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@AllArgsConstructor
public class CustomUserDetailService implements UserDetailsService {
    private final UserRepository userRepository;

    public Optional<User> getCurrentUser() {
        CustomUserDetails customUserDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findById(customUserDetails.getId());

    }

    public CustomUserDetails loadUserById(UUID id) throws UsernameNotFoundException {
        Optional<User> user = userRepository.findById(id);

        if (user.isEmpty()) {
            throw new EntityNotFoundException("User Not Found with id: " + id);
        }
        return CustomUserDetails.build(user.get());
    }

    public CustomUserDetails loadUserByEmail(String email) throws UsernameNotFoundException {
        Optional<User> user = userRepository.findByEmail(email);

        if (user.isEmpty()) {
            throw new UsernameNotFoundException("User Not Found with email: " + email);
        }
        return CustomUserDetails.build(user.get());
    }

    @Override
    public CustomUserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        List<User> users = userRepository.findByUsername(username);

        if (users.isEmpty()) {
            throw new UsernameNotFoundException("User Not Found with username: " + username);
        }
        return CustomUserDetails.build(users.getFirst());
    }
}
