package com.gestion.invoice.controller;

import com.gestion.invoice.models.Produit;
import com.gestion.invoice.service.DetailsVenteService;
import com.gestion.invoice.service.ProduitService;
import com.gestion.invoice.service.impl.DetailsVenteImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/produit")
public class ProduitController {

    @Autowired
    private ProduitService produitService;

    @Autowired
    private DetailsVenteService detailsVenteService; // Injection du service DetailsVente

    @PostMapping("/add")
    public ResponseEntity<Produit> addProduit(@RequestBody Produit produit) {
        Produit newProduit = produitService.addProduit(produit);
        return ResponseEntity.ok(newProduit);
    }
    @GetMapping
    public ResponseEntity<Page<Produit>> allProduits(
            @PageableDefault(page = 0, size = 10) Pageable pageable) {
        return ResponseEntity.ok(produitService.getAllproduit(pageable));
    }
    @GetMapping("/all")
    public ResponseEntity<List<Produit>> allProduits() {
        return ResponseEntity.ok(produitService.allProduit());
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Produit> updateProduit(@PathVariable Long id, @RequestBody Produit produit) {
        Produit updated = produitService.updateProduit(id, produit);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteProduit(@PathVariable Long id) {
        produitService.deleteProduit(id);
        return ResponseEntity.ok("Produit supprimé avec succès !");
    }
    // Recherche paginée par mot-clé
    @GetMapping("/search")
    public ResponseEntity<Page<Produit>> searchProduits(
            @RequestParam String keyword,
            @PageableDefault(page = 0, size = 10) Pageable pageable) {
        Page<Produit> result = produitService.searchProduits(keyword, pageable);
        return ResponseEntity.ok(result);
    }


    // 🔹 Nouveau endpoint pour stats par produit
    @GetMapping("/stats/{produitId}")
    public ResponseEntity<Map<String, Object>> getProduitStats(@PathVariable Long produitId) {
        Map<String, Object> stats = new HashMap<>();
        stats.put("stockVendu", detailsVenteService.getStockVenduParProduit(produitId));
        stats.put("totalVente", detailsVenteService.getTotalVenteParProduit(produitId));
        stats.put("benefice", detailsVenteService.getBeneficeSurAchatParProduit(produitId));
        return ResponseEntity.ok(stats);
    }
}
