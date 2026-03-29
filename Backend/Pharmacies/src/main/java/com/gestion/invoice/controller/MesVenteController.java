package com.gestion.invoice.controller;

import com.gestion.invoice.models.Vente;
import com.gestion.invoice.repository.VenteRepository;
import com.gestion.invoice.service.VenteService;
<<<<<<< HEAD
=======
import org.springframework.beans.factory.annotation.Autowired;
>>>>>>> a45223998defebbae8d29fde1e3be01e5f3c73f8
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
<<<<<<< HEAD
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
=======
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

>>>>>>> a45223998defebbae8d29fde1e3be01e5f3c73f8
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/mesventes")
<<<<<<< HEAD
public class MesVenteController {

    private final VenteService venteService;
    private final VenteRepository venteRepository;
=======

public class MesVenteController {
    private final VenteService venteService;

    private  final VenteRepository venteRepository;


>>>>>>> a45223998defebbae8d29fde1e3be01e5f3c73f8

    public MesVenteController(VenteService venteService, VenteRepository venteRepository) {
        this.venteService = venteService;
        this.venteRepository = venteRepository;
    }

<<<<<<< HEAD
=======

>>>>>>> a45223998defebbae8d29fde1e3be01e5f3c73f8
    @GetMapping("/actives")
    public ResponseEntity<Page<Vente>> getVentesActives(
            @RequestParam(required = false) String client,
            @RequestParam(required = false) Long userId,
<<<<<<< HEAD
            @RequestParam(required = false) String startDate, // "YYYY-MM-DD"
            @RequestParam(required = false) String endDate,   // "YYYY-MM-DD"
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "1000") int size
    ) {
        LocalDateTime startDateTime = null;
        LocalDateTime endDateTime = null;

        try {
            if (startDate != null && !startDate.isEmpty()) {
                LocalDate start = LocalDate.parse(startDate);
                startDateTime = start.atStartOfDay(); // 00:00:00
            }
            if (endDate != null && !endDate.isEmpty()) {
                LocalDate end = LocalDate.parse(endDate);
                // Inclure toute la journée, jusqu'à la dernière nanoseconde
                endDateTime = end.atTime(23, 59, 59, 999_999_999);
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().build(); // format de date invalide
        }

        Pageable pageable = PageRequest.of(page, size);
        Page<Vente> ventes = venteRepository.findVentesActives(client, userId, startDateTime, endDateTime, pageable);

        return ResponseEntity.ok(ventes);
    }

=======
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
>>>>>>> a45223998defebbae8d29fde1e3be01e5f3c73f8
    @GetMapping("/jour/by-phone/{phone}")
    public List<Vente> getVentesDuJourByPhone(@PathVariable String phone) {
        return venteService.getVentesDuJourByUser(phone);
    }

<<<<<<< HEAD
=======




   /*
    @GetMapping("/jour/telephone/{phone}")
    public List<Vente> getVentesDuJourByPhone(@PathVariable String phone) {
        return venteService.getVentesDuJourByPhone(phone);
    }*/

>>>>>>> a45223998defebbae8d29fde1e3be01e5f3c73f8
    @PostMapping("/annuler/{id}")
    public ResponseEntity<String> annulerVente(@PathVariable Long id) {
        Vente v = venteRepository.findById(id).orElseThrow();
        v.setEtat(false);
        venteRepository.save(v);
        return ResponseEntity.ok("Vente annulée");
    }
<<<<<<< HEAD
}
=======
}
>>>>>>> a45223998defebbae8d29fde1e3be01e5f3c73f8
