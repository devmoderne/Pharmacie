package com.gestion.invoice.models;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Vente extends BaseEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    //private String numero;
    private LocalDateTime dateVente = LocalDateTime.now();

    @Column(unique = true)
    private String codeTicket;
    private boolean  statut = false;
    @ManyToOne
    @JoinColumn(name = "client_id")
    private Client client;
    private double total;
    private double remise;
    private double remis;
    private double rendue;
    private double tva;
   // private double qtes;
    private double payer;
    private LocalDateTime updatedAt = LocalDateTime.now();
    @Column(nullable = true)
    private Double benefice;

}
