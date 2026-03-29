package com.gestion.invoice.controller;

import com.gestion.invoice.models.CategorieProduit;
import com.gestion.invoice.service.CategorieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/categorie")

public class CategorieController {

    @Autowired
    private CategorieService categorieService;

    @PostMapping("/add")
    public ResponseEntity<CategorieProduit> addCategorie(@RequestBody CategorieProduit categorie) {
        CategorieProduit newCategorie = categorieService.addCategorieProduit(categorie);
        return ResponseEntity.ok(newCategorie);
    }

    @GetMapping("/all")
    public ResponseEntity<List<CategorieProduit>> allCategories() {
        return ResponseEntity.ok(categorieService.allCategorieProduit());
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<CategorieProduit> updateCategorie(@PathVariable Long id, @RequestBody CategorieProduit categorie) {
        CategorieProduit updated = categorieService.updateCategorieProduit(id, categorie);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Map<String, String>> deleteCategorie(@PathVariable("id") Long id) {
        categorieService.deleteCategorieProduit(id);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Catégorie supprimée avec succès !");
        return ResponseEntity.ok().body(response);

    }

}
