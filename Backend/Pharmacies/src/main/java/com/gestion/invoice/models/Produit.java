package com.gestion.invoice.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "produits")
public class Produit extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String nomProduit;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "categorie_id")
    private CategorieProduit categorie;

    private double prixVente;
    private int alerte = 2;
    private LocalDate dateSaisie;
    //private double prixAchat;
    @Column(columnDefinition = "LONGTEXT")
    private String imageProduit;

    // Le stock réel sera calculé depuis les entrées
   // @Transient
    private Integer stockReel=0;

}
