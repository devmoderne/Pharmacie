package com.gestion.invoice.service;



import com.gestion.invoice.models.Produit;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


import java.util.List;

public interface ProduitService {

    Produit findByNom(String nom);

    Produit addProduit(Produit produit);

    List<Produit> allProduit();

    Page<Produit> getAllproduit(Pageable pageable);

    Produit updateProduit(Long id, Produit produit);

    void deleteProduit(Long id);

    Produit findById(Long id);

    // ✅ Vérifie si le stock est suffisant pour une quantité donnée
    boolean verifierStockDisponible(Produit produit, double quantiteDemandee);

    // ✅ Recalcule le stock réel (par exemple après une vente ou une entrée)
    void calculerStockReel(Produit produit);
    Page<Produit> searchProduits(String keyword, Pageable pageable);
}
