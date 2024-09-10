package com.example.demo.config;

import com.example.demo.model.dto.auth.CustomUserDetails;
import com.example.demo.model.entity.impl.User;
import com.example.demo.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

@Configuration
@EnableJpaAuditing()
public class AuditorAwareConfig implements AuditorAware<User> {

    @Autowired
    private IUserService userService;

    @Override
    public Optional<User> getCurrentAuditor() {
        if (SecurityContextHolder.getContext().getAuthentication().getPrincipal().equals("anonymousUser")) {
            return Optional.empty();
        }

        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userService.getDefaultUserById(userDetails.getId());
    }
}
