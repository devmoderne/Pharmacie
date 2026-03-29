package com.gestion.invoice.controller;

import com.gestion.invoice.dto.VenteCreateDTO;
import com.gestion.invoice.models.Vente;
import com.gestion.invoice.service.VenteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/ticket")

public class VenteController {

    @Autowired
    private VenteService venteService;

    @GetMapping("/all")
    public ResponseEntity<List<Vente>> allTickets() {
        return ResponseEntity.ok(venteService.allTicket());
    }
    @GetMapping("/find/{code}")
    public ResponseEntity<Vente> findByCode(@PathVariable String code) {
        Vente vente = venteService.findByCodeTicket(code);
        return ResponseEntity.ok(vente);
    }

    @GetMapping
    public ResponseEntity<Page<Vente>> allTickets(Pageable pageable) {
        return ResponseEntity.ok(venteService.allTicket(pageable));
    }
<<<<<<< HEAD
    /*@GetMapping("/all")
    public ResponseEntity<List<Vente>> allTickets(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {

        List<Vente> ventes = venteService.allTicket(startDate, endDate);
        return ResponseEntity.ok(ventes);
    }*/
=======
>>>>>>> a45223998defebbae8d29fde1e3be01e5f3c73f8


    @PutMapping("/update/{id}")
    public ResponseEntity<Vente> updateTicket(@PathVariable Long id, @RequestBody Vente vente) {
        Vente updated = venteService.updateTicket(id, vente);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteTicket(@PathVariable Long id) {
        venteService.deleteTicket(id);
        return ResponseEntity.ok("Ticket supprimé avec succès !");
    }

    /*@PostMapping("/create")
    public ResponseEntity<Vente> createTicket(@RequestBody Vente vente) {
        // Ici on ne s'attend qu'à codeTicket et éventuellement client
        Vente created = venteService.addTicket(vente);
        return ResponseEntity.ok(created);
    }*/
    @PostMapping("/create")
    public ResponseEntity<Vente> createTicket(@RequestBody VenteCreateDTO dto) {
        Vente vente = venteService.createTicket(dto);
        return ResponseEntity.status(201).body(vente);
    }

}
