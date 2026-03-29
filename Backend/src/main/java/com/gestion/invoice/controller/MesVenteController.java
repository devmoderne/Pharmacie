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

<<<<<<<< HEAD:Backend/src/main/java/MesVenteController.java
========
    // Récupère les ventes actives avec filtres optionnels
>>>>>>>> cb5b798 (correction du backend):Backend/src/main/java/com/gestion/invoice/controller/MesVenteController.java
    @GetMapping("/actives")
    public ResponseEntity<Page<Vente>> getVentesActives(
            @RequestParam(required = false) String client,
            @RequestParam(required = false) Long userId,
<<<<<<<< HEAD:Backend/src/main/java/MesVenteController.java
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
========
            @RequestParam(required = false) String startDate, // format "YYYY-MM-DD"
            @RequestParam(required = false) String endDate,   // format "YYYY-MM-DD"
>>>>>>>> cb5b798 (correction du backend):Backend/src/main/java/com/gestion/invoice/controller/MesVenteController.java
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
<<<<<<<< HEAD:Backend/src/main/java/MesVenteController.java
                endDateTime = end.atTime(23, 59, 59, 999_999_999);
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
========
                endDateTime = end.atTime(23, 59, 59, 999_999_999); // fin de journée
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().build(); // format date invalide
>>>>>>>> cb5b798 (correction du backend):Backend/src/main/java/com/gestion/invoice/controller/MesVenteController.java
        }

        Pageable pageable = PageRequest.of(page, size);
        Page<Vente> ventes = venteRepository.findVentesActives(client, userId, startDateTime, endDateTime, pageable);
        return ResponseEntity.ok(ventes);
    }

<<<<<<<< HEAD:Backend/src/main/java/MesVenteController.java
========
    // Récupère les ventes du jour par téléphone
>>>>>>>> cb5b798 (correction du backend):Backend/src/main/java/com/gestion/invoice/controller/MesVenteController.java
    @GetMapping("/jour/by-phone/{phone}")
    public List<Vente> getVentesDuJourByPhone(@PathVariable String phone) {
        return venteService.getVentesDuJourByUser(phone);
    }

<<<<<<<< HEAD:Backend/src/main/java/MesVenteController.java
========
    // Annuler une vente
>>>>>>>> cb5b798 (correction du backend):Backend/src/main/java/com/gestion/invoice/controller/MesVenteController.java
    @PostMapping("/annuler/{id}")
    public ResponseEntity<String> annulerVente(@PathVariable Long id) {
        Vente v = venteRepository.findById(id).orElseThrow();
        v.setEtat(false);
        venteRepository.save(v);
        return ResponseEntity.ok("Vente annulée");
    }
}