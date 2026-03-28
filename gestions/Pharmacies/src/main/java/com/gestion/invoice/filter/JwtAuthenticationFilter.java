package com.gestion.invoice.filter;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.io.IOException;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

public class JwtAuthenticationFilter extends UsernamePasswordAuthenticationFilter {

    private final AuthenticationManager authenticationManager;
    private final String secret = "MACLESECRETDE32caractereaumoinsjecrois!";

    public JwtAuthenticationFilter(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
        setFilterProcessesUrl("/api/login"); // endpoint login
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request,
                                                HttpServletResponse response) throws AuthenticationException {

        try {
            // Lire le JSON { "telephone": "...", "password": "..." }
            Map<String, String> creds = new ObjectMapper()
                    .readValue(request.getInputStream(), Map.class);

            String telephone = creds.get("telephone");
            String password = creds.get("password");

            UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(telephone, password);

            return authenticationManager.authenticate(authToken);

        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request,
                                            HttpServletResponse response,
                                            FilterChain chain,
                                            Authentication authResult) throws IOException, ServletException {

        org.springframework.security.core.userdetails.User user =
                (org.springframework.security.core.userdetails.User) authResult.getPrincipal();

        Algorithm algorithm = Algorithm.HMAC256(secret.getBytes());

        String accessToken = JWT.create()
                .withSubject(user.getUsername())
                .withExpiresAt(new Date(System.currentTimeMillis() + 40 * 60 * 60 * 1000)) // 10 min
                .withIssuer(request.getRequestURL().toString())
                .withClaim("roles", user.getAuthorities()
                        .stream()
                        .map(GrantedAuthority::getAuthority)
                        .collect(Collectors.toList()))
                .sign(algorithm);

        String refreshToken = JWT.create()
                .withSubject(user.getUsername())
                .withExpiresAt(new Date(System.currentTimeMillis() + 50 * 60* 60 * 1000)) // 20 min
                .withIssuer(request.getRequestURL().toString())
                .sign(algorithm);

        Map<String, Object> tokens = new HashMap<>();
        tokens.put("access_token", accessToken);
        tokens.put("refresh_token", refreshToken);
        tokens.put("username", user.getUsername());
        tokens.put("roles", user.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList()));

        response.setContentType("application/json");
        new ObjectMapper().writeValue(response.getOutputStream(), tokens);
    }

}
