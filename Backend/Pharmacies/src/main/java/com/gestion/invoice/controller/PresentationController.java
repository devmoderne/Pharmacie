package com.gestion.invoice.controller;

import com.gestion.invoice.models.Presentation;
import com.gestion.invoice.service.PresentationService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/v1/presentation")

public class PresentationController {

    private final PresentationService presentationService;

    public PresentationController(PresentationService presentationService) {
        this.presentationService = presentationService;
    }

    // Récupérer toutes les présentations actives
    @GetMapping("/all")
    public List<Presentation> getAll() {
        return presentationService.allPresentation();
    }

    // Créer une présentation
    @PostMapping("/add")
    public ResponseEntity<Presentation> create(@RequestBody Presentation presentation) {
        Presentation created = presentationService.addPresentation(presentation);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // Mettre à jour une présentation
    @PutMapping("/{id}")
    public ResponseEntity<Presentation> updatePresentation(
            @PathVariable("id") Long id,
            @RequestBody Presentation presentation)  {

        Presentation updated = presentationService.updatePresentation(id, presentation);
        return ResponseEntity.ok(updated);
    }

    // Supprimer une présentation (soft delete)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePresentation(@PathVariable Long id) {
        presentationService.deletePresentation(id);
        return ResponseEntity.ok().build();
    }

   /* // Recherche si nécessaire
    @GetMapping("/search")
    public List<Presentation> search(@RequestParam String keyword) {
        // Implémente la recherche dans ton service si besoin
        return List.of(); // placeholder
    }

    @GetMapping("/searchmedic")
    public List<Presentation> searchMedic(@RequestParam String keyword) {
        return List.of(); // placeholder
    }*/
}
