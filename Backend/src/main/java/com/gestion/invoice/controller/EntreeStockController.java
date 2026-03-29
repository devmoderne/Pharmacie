package com.gestion.invoice.controller;

import com.gestion.invoice.models.EntreeStock;
import com.gestion.invoice.service.EntreeStockService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/entree-stock") // ✅ Correction ici

public class EntreeStockController {

    private final EntreeStockService entreeStockService;

    public EntreeStockController(EntreeStockService entreeStockService) {
        this.entreeStockService = entreeStockService;
    }
    @GetMapping("/search")
    public ResponseEntity<Page<EntreeStock>> searchEntrees(
            @RequestParam String search,
            @PageableDefault(page = 0, size = 10) Pageable pageable) {

        return ResponseEntity.ok(entreeStockService.searchEntrees(search, pageable));
    }

    @PostMapping("/add")
    public ResponseEntity<EntreeStock> addEntreeStock(@RequestBody EntreeStock entreeStock) {
        return ResponseEntity.status(201).body(entreeStockService.addEntreeStock(entreeStock)); // ✅ 201 Created
    }
    @GetMapping
    public ResponseEntity<Page<EntreeStock>> allEntrees(
            @PageableDefault(page = 0, size = 10) Pageable pageable) {

        return ResponseEntity.ok(entreeStockService.allEntrees(pageable));
    }
    @GetMapping("/all")
    public ResponseEntity<List<EntreeStock>> allEntrees() {
        return ResponseEntity.ok(entreeStockService.allEntrees());
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<EntreeStock> updateEntreeStock(@PathVariable Long id, @RequestBody EntreeStock entreeStock) {
        return ResponseEntity.ok(entreeStockService.updateEntreeStock(id, entreeStock));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteEntreeStock(@PathVariable Long id) {
        entreeStockService.deleteEntreeStock(id);
        return ResponseEntity.noContent().build();
    }
}
