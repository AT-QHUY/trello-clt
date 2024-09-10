package com.example.demo.service.impl;


import com.example.demo.model.dto.auth.CustomUserDetails;
import com.example.demo.model.dto.auth.TokenDto;
import com.example.demo.model.entity.impl.User;
import com.example.demo.model.enums.JWT;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;

@Service
public class JWTService {

    @Value("${security.jwt.access-token.secret-key}")
    private String atSecretKey;

    @Value("${security.jwt.refresh-token.secret-key}")
    private String rtSecretKey;

    @Value("${security.jwt.access-token.expiration}")
    private long atExpiration;

    @Value("${security.jwt.refresh-token.expiration}")
    private long rtExpiration;


    public String extractUsername(String token, JWT jwtType) {
        return extractClaim(token, Claims::getSubject, jwtType);
    }

    public UUID extractId(String token, JWT jwtType) {
        return UUID.fromString(extractClaim(token, Claims::getId, jwtType));
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver, JWT jwtType) {
        final Claims claims = extractAllClaims(token, jwtType);
        return claimsResolver.apply(claims);
    }

    public TokenDto generateTokens(CustomUserDetails userDetails) {
        return new TokenDto(generateAccessToken(userDetails), generateRefreshToken(userDetails));
    }

    public String generateAccessToken(CustomUserDetails customUserDetails) {
        return generateToken(customUserDetails, JWT.ACCESS_TOKEN);
    }

    public String generateRefreshToken(CustomUserDetails customUserDetails) {
        return generateToken(customUserDetails, JWT.REFRESH_TOKEN);
    }

    public String generateToken(CustomUserDetails userDetails, JWT jwtType) {
        return generateToken(new HashMap<>(), userDetails, jwtType);
    }

    public String generateToken(
            Map<String, Object> extraClaims,
            CustomUserDetails userDetails,
            JWT jwtType
    ) {
        long expiration = jwtType.equals(JWT.ACCESS_TOKEN) ? atExpiration : rtExpiration;
        return buildToken(extraClaims, userDetails, expiration,jwtType);
    }

    private String buildToken(
            Map<String, Object> extraClaims,
            CustomUserDetails userDetails,
            long expiration,
            JWT jwtType
    ) {
        return Jwts
                .builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername())
                .setId(userDetails.getId().toString())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSignInKey(jwtType), SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean isTokenValid(String token, CustomUserDetails userDetails, JWT jwtType) {
        final UUID id = extractId(token, jwtType);
        final String email = extractUsername(token, jwtType);
        return (id.equals(userDetails.getId())) && (email.equals(userDetails.getEmail())) && isTokenExpired(token, jwtType);
    }

    public boolean isTokenValid(String token, User user, JWT jwtType) {
        final UUID id = extractId(token, jwtType);
        final String email = extractUsername(token, jwtType);
        return (id.equals(user.getId())) && (email.equals(user.getEmail())) && isTokenExpired(token, jwtType);
    }

    private boolean isTokenExpired(String token, JWT jwtType) {
        return !extractExpiration(token, jwtType).before(new Date());
    }

    private Date extractExpiration(String token, JWT jwtType) {
        return extractClaim(token, Claims::getExpiration, jwtType);
    }

    private Claims extractAllClaims(String token, JWT jwtType) {
        try{
             return Jwts
                    .parserBuilder()
                    .setSigningKey(getSignInKey(jwtType))
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        }catch (ExpiredJwtException expiredJwtException){
            return expiredJwtException.getClaims();
        }catch (SignatureException signatureException){
            throw new BadCredentialsException("Invalid JWT signature");
        }
    }

    private Key getSignInKey(JWT jwtType) {
        String secretKey = jwtType.equals(JWT.ACCESS_TOKEN) ? atSecretKey : rtSecretKey;
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

}
