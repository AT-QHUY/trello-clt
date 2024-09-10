package com.example.demo.filter;

import com.example.demo.model.dto.auth.CustomUserDetails;
import com.example.demo.model.entity.impl.User;
import com.example.demo.model.enums.JWT;
import com.example.demo.service.impl.CustomUserDetailService;
import com.example.demo.service.impl.JWTService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

import java.io.IOException;
import java.util.UUID;

@Component
public class JwtApplicationFilter extends OncePerRequestFilter {

    @Autowired
    private JWTService jwtService;


    @Autowired
    private CustomUserDetailService userDetailsService;

    @Autowired
    @Qualifier("handlerExceptionResolver")
    private  HandlerExceptionResolver exceptionResolver;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        response.addHeader("Access-Control-Allow-Origin", "*");
        response.addHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT, PATCH, HEAD, OPTIONS");
        response.addHeader("Access-Control-Allow-Headers",
                "Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization");
        response.addHeader("Access-Control-Expose-Headers", "Access-Control-Allow-Origin, Access-Control-Allow-Credentials");
        response.addHeader("Access-Control-Allow-Credentials", "true");
        response.addIntHeader("Access-Control-Max-Age", 10);

        try {

            if (request.getServletPath().contains("/api/auths")) {
                filterChain.doFilter(request, response);
                return;
            }
            final String authHeader = request.getHeader("Authorization");
            final String jwt;
            final UUID id;
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                filterChain.doFilter(request, response);
                return;
            }
            jwt = authHeader.substring(7);
            id = jwtService.extractId(jwt, JWT.ACCESS_TOKEN);
            if (id != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                CustomUserDetails userDetails = this.userDetailsService.loadUserById(id);

                if (jwtService.isTokenValid(jwt, userDetails, JWT.ACCESS_TOKEN)) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );
                    authToken.setDetails(
                            new WebAuthenticationDetailsSource().buildDetails(request)
                    );
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
            filterChain.doFilter(request, response);
        }
       catch (Exception e) {
            exceptionResolver.resolveException(request, response, null, e);
        }

    }
}
