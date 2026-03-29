package com.gestion.invoice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @NoArgsConstructor @AllArgsConstructor
public class ProduitStatsDTO {
    private Long produitId;
    private String nomProduit;
    private int stockVendu;
    private double totalVente;
}