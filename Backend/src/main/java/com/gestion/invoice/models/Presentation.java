package com.gestion.invoice.models;

import com.gestion.invoice.repository.UserRepository;
import com.gestion.invoice.util.BeanUtil;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Presentation extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idPresentation;
    private String nom;
    private int nombreParUnite;
}


