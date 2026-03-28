package com.gestion.invoice.controller;

import com.gestion.invoice.models.NomProduit;
import com.gestion.invoice.service.NomProduitService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/nomproduit")

public class NomProduitController {

    private final NomProduitService nomProduitService;

    public NomProduitController(NomProduitService nomProduitService) {
        this.nomProduitService = nomProduitService;
    }

    // Récupérer tous les noms de produit
    @GetMapping("/all")
    public ResponseEntity<List<NomProduit>> allNomProduits() {
        return ResponseEntity.ok(nomProduitService.allNomProduits());
    }

    // Récupérer un nom de produit par ID
    @GetMapping("/{id}")
    public ResponseEntity<NomProduit> getNomProduit(@PathVariable Long id) {
        NomProduit np = nomProduitService.getNomProduitById(id);
        if (np != null) return ResponseEntity.ok(np);
        return ResponseEntity.notFound().build();
    }

    // Ajouter un nom de produit
    @PostMapping("/add")
    public ResponseEntity<NomProduit> addNomProduit(@RequestBody NomProduit nomProduit) {
        NomProduit saved = nomProduitService.addNomProduit(nomProduit);
        return ResponseEntity.status(201).body(saved);
    }

    // Modifier un nom de produit
    @PutMapping("/{id}")
    public ResponseEntity<NomProduit> updateNomProduit(@PathVariable Long id, @RequestBody NomProduit nomProduit) {
        try {
            NomProduit updated = nomProduitService.updateNomProduit(id, nomProduit);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Supprimer un nom de produit (suppression logique)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNomProduit(@PathVariable Long id) {
        try {
            nomProduitService.deleteNomProduit(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Rechercher par mot-clé
    @GetMapping("/search")
    public ResponseEntity<List<NomProduit>> searchNomProduit(@RequestParam String keyword) {
        List<NomProduit> result = nomProduitService.searchNomProduit(keyword);
        return ResponseEntity.ok(result);
    }
}
