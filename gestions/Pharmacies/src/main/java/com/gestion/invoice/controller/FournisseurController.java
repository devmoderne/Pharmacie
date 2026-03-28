package com.gestion.invoice.controller;

import com.gestion.invoice.models.Fournisseur;
import com.gestion.invoice.service.FournisseurService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController

@RequestMapping("/api/v1/fournisseur")

public class FournisseurController {
    @Autowired
    private FournisseurService fournisseurService;

    @PostMapping("/add")


    public ResponseEntity<Fournisseur> addFournisseur(@RequestBody Fournisseur fournisseur) {
        Fournisseur newFournisseur = fournisseurService.addFournisseur(fournisseur);
        return ResponseEntity.ok(newFournisseur);
    }

    @GetMapping("/all")


    public ResponseEntity<List<Fournisseur>> allFournisseurs() {
        return ResponseEntity.ok(fournisseurService.allFournisseur());
    }

    @PutMapping("/update/{id}")


    public ResponseEntity<Fournisseur> updateFournisseur(@PathVariable Long id, @RequestBody Fournisseur fournisseur) {
        Fournisseur updated = fournisseurService.updateFournisseur(id, fournisseur);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/delete/{id}")


    public ResponseEntity<String> deleteFournisseur(@PathVariable Long id) {
        fournisseurService.deleteFournisseur(id);
        return ResponseEntity.ok("Fournisseur supprimé avec succès !");
    }
}
