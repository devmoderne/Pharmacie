package com.gestion.invoice.controller;

import com.gestion.invoice.models.Vente;
import com.gestion.invoice.repository.VenteRepository;
import com.gestion.invoice.service.VenteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/mesventes")

public class MesVenteController {
    private final VenteService venteService;

    private  final VenteRepository venteRepository;



    public MesVenteController(VenteService venteService, VenteRepository venteRepository) {
        this.venteService = venteService;
        this.venteRepository = venteRepository;
    }


    @GetMapping("/actives")
    public ResponseEntity<Page<Vente>> getVentesActives(
            @RequestParam(required = false) String client,
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(defaultValue = "0") int page,  // page actuelle
            @RequestParam(defaultValue = "10") int size  // nombre d’éléments par page
    ) {
        LocalDateTime start = (startDate != null && !startDate.isEmpty()) ? LocalDateTime.parse(startDate) : null;
        LocalDateTime end = (endDate != null && !endDate.isEmpty()) ? LocalDateTime.parse(endDate) : null;

        Pageable pageable = PageRequest.of(page, size);
        Page<Vente> ventes = venteRepository.findVentesActives(client, userId, start, end, pageable);

        return ResponseEntity.ok(ventes);
    }
    @GetMapping("/jour/by-phone/{phone}")
    public List<Vente> getVentesDuJourByPhone(@PathVariable String phone) {
        return venteService.getVentesDuJourByUser(phone);
    }





   /*
    @GetMapping("/jour/telephone/{phone}")
    public List<Vente> getVentesDuJourByPhone(@PathVariable String phone) {
        return venteService.getVentesDuJourByPhone(phone);
    }*/

    @PostMapping("/annuler/{id}")
    public ResponseEntity<String> annulerVente(@PathVariable Long id) {
        Vente v = venteRepository.findById(id).orElseThrow();
        v.setEtat(false);
        venteRepository.save(v);
        return ResponseEntity.ok("Vente annulée");
    }
}
