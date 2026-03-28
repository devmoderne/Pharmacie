package com.gestion.invoice.models;

import com.gestion.invoice.repository.UserRepository;
import com.gestion.invoice.util.BeanUtil;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDateTime;

@MappedSuperclass
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public abstract class BaseEntity {

    @Column(nullable = false)
    private boolean etat = true;

    @Column(name = "create_at", updatable = false)
    private LocalDateTime createAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_id", updatable = false)
    private AppUser createdBy;

    @PrePersist
    protected void onCreate() {
        this.createAt = LocalDateTime.now();
        AppUser currentUser = getCurrentUser();
        if (currentUser != null) {
            this.createdBy = currentUser;
        }
    }

    /**
     * 🔹 Récupère l'utilisateur courant à partir de Spring Security
     */
    protected AppUser getCurrentUser() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
                String telephone = auth.getName(); // finbytelephone
                UserRepository userRepository = BeanUtil.getBean(UserRepository.class);
                return userRepository.findByTelephone(telephone);
            }
        } catch (Exception e) {
            System.err.println("⚠️ Impossible de récupérer l'utilisateur courant : " + e.getMessage());
        }
        return null;
    }
}

