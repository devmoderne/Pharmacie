package com.gestion.invoice.filter;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

public class JwtAuthorizationFilter extends OncePerRequestFilter {

    private final String secret = "MACLESECRETDE32caractereaumoinsjecrois!";

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {
            try {
                String token = header.substring(7);
                Algorithm algorithm = Algorithm.HMAC256(secret.getBytes());
                JWTVerifier verifier = JWT.require(algorithm).build();
                DecodedJWT decodedJWT = verifier.verify(token);

                String telephone = decodedJWT.getSubject();
                List<String> roles = decodedJWT.getClaim("roles").asList(String.class);

                Collection<SimpleGrantedAuthority> authorities = new ArrayList<>();
                if (roles != null) {
                    for (String role : roles) {
                        authorities.add(new SimpleGrantedAuthority(role));
                    }
                }

                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(telephone, null, authorities);

                SecurityContextHolder.getContext().setAuthentication(authToken);

            } catch (Exception e) {
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                response.getWriter().write("Erreur JWT : " + e.getMessage());
                return;
            }
        }

        filterChain.doFilter(request, response);
    }
}
