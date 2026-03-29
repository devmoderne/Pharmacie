package com.gestion.invoice.models;




import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "nom_produits")
public class NomProduit extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true, nullable = false)
    private String nom;
    private String description;
    // Relation vers tous les produits de ce nom
    @OneToMany(mappedBy = "nomProduit", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Produit> produits;

}
