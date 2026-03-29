package com.gestion.invoice.security;

import com.gestion.invoice.filter.JwtAuthenticationFilter;
import com.gestion.invoice.filter.JwtAuthorizationFilter;
import com.gestion.invoice.models.AppUser;
import com.gestion.invoice.repository.UserRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.ArrayList;
import java.util.List;

@Configuration
@EnableMethodSecurity
public class SecurityConf {

    private final UserRepository userRepository;


    public SecurityConf(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return telephone -> {
            AppUser user = userRepository.findByTelephone(telephone);
            if (user == null) throw new UsernameNotFoundException("Utilisateur non trouvé : " + telephone);

            var authorities = new ArrayList<>(user.getApproles().stream()
                    .map(role -> new org.springframework.security.core.authority.SimpleGrantedAuthority(role.getRoleName()))
                    .toList());

            return new org.springframework.security.core.userdetails.User(
                    user.getTelephone(),
                    user.getPassword(),
                    authorities
            );
        };
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

   /* @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http,
                                                   AuthenticationManager authManager) throws Exception {

        JwtAuthenticationFilter jwtAuthFilter = new JwtAuthenticationFilter(authManager);
        jwtAuthFilter.setFilterProcessesUrl("/api/v1/users/auth/login"); // correspond à ton endpoint login

        JwtAuthorizationFilter jwtAuthorizationFilter = new JwtAuthorizationFilter();

        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/v1/users/auth/login", "/api/v1/users/auth/register").permitAll()
                        .anyRequest().authenticated())
                .addFilter(jwtAuthFilter)
                .addFilterBefore(jwtAuthorizationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
*/@Bean
   public SecurityFilterChain securityFilterChain(HttpSecurity http,
                                                  AuthenticationManager authManager) throws Exception {


       JwtAuthenticationFilter jwtAuthFilter = new JwtAuthenticationFilter(authManager);
       jwtAuthFilter.setFilterProcessesUrl("/api/v1/users/auth/login"); // endpoint login

       JwtAuthorizationFilter jwtAuthorizationFilter = new JwtAuthorizationFilter();

       http
               .cors(cors -> cors.configurationSource(corsConfigurationSource()))
               .csrf(csrf -> csrf.disable())
               .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
               .authorizeHttpRequests(auth -> auth
                       // Autoriser l’accès aux fichiers statiques et à la racine
                       .requestMatchers(
                               "/",
                               "/**",
                               "/index.html",
                               "/assets/**",
                               "/favicon.ico",
                               "/images/**",
                               "/css/**",
                               "/js/**",
                               "/vite.svg"
                       ).permitAll()
                       // Autoriser certains endpoints publics de l’API
                       .requestMatchers(
                               "/api/v1/login",
                               "/api/v1/tiket/**",
                               "/api/v1/tikets/**",
                               "/api/v1/pdf/**",
                               "/api/v1/users/auth/login",
                               "/api/v1/users/auth/register"
                       ).permitAll()
                       // Tout le reste nécessite authentification
                       .anyRequest().authenticated()
               )
               .addFilter(jwtAuthFilter)
               .addFilterBefore(jwtAuthorizationFilter, UsernamePasswordAuthenticationFilter.class);

       return http.build();


   }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173")); // front React
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*")); // Autorise tous les headers, dont Authorization
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

}
