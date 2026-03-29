package com.gestion.invoice.controller;

import com.gestion.invoice.models.Vente;
import com.gestion.invoice.repository.VenteRepository;
import com.gestion.invoice.service.VenteService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/mesventes")
public class MesVenteController {

    private final VenteService venteService;
    private final VenteRepository venteRepository;

    public MesVenteController(VenteService venteService, VenteRepository venteRepository) {
        this.venteService = venteService;
        this.venteRepository = venteRepository;
    }

    // Récupère les ventes actives avec filtres optionnels
    @GetMapping("/actives")
    public ResponseEntity<Page<Vente>> getVentesActives(
            @RequestParam(required = false) String client,
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "1000") int size
    ) {
        LocalDateTime startDateTime = null;
        LocalDateTime endDateTime = null;

        try {
            if (startDate != null && !startDate.isEmpty()) {
                LocalDate start = LocalDate.parse(startDate);
                startDateTime = start.atStartOfDay();
            }
            if (endDate != null && !endDate.isEmpty()) {
                LocalDate end = LocalDate.parse(endDate);
                endDateTime = end.atTime(23, 59, 59, 999_999_999);
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }

        Pageable pageable = PageRequest.of(page, size);
        Page<Vente> ventes = venteRepository.findVentesActives(client, userId, startDateTime, endDateTime, pageable);
        return ResponseEntity.ok(ventes);
    }

    // Récupère les ventes du jour par téléphone
    @GetMapping("/jour/by-phone/{phone}")
    public List<Vente> getVentesDuJourByPhone(@PathVariable String phone) {
        return venteService.getVentesDuJourByUser(phone);
    }

    // Annuler une vente
    @PostMapping("/annuler/{id}")
    public ResponseEntity<String> annulerVente(@PathVariable Long id) {
        Vente v = venteRepository.findById(id).orElseThrow();
        v.setEtat(false);
        venteRepository.save(v);
        return ResponseEntity.ok("Vente annulée");
    }
}