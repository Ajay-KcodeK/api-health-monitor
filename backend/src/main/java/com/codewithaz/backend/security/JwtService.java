package com.codewithaz.backend.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import jakarta.persistence.Id;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private long jwtExpirationInMs;


    public String extractEmail(String authToken) {
        // Logic to extract email from the JWT token using the secret key\
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(authToken)
                .getBody()
                .getSubject();
    }

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    public boolean isTokenValid(String token) {
        try{
            Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            // Log the exception or handle it as needed
            return false;
        }
    }

    // GENERATE TOKEN — called after successful login
    public String generateToken(String email) {
        return Jwts.builder()
                .setSubject(email)           // WHO this token belongs to
                .setIssuedAt(new Date())      // WHEN it was created
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationInMs)) // WHEN it expires
                .signWith(getSigningKey(), SignatureAlgorithm.HS256) // SIGN with your secret
                .compact();
    }
}
