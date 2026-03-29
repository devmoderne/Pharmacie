package com.gestion.invoice.controller;

import com.gestion.invoice.models.RecuPdf;
import com.gestion.invoice.repository.RecuPdfRepository;
import com.gestion.invoice.service.RecuPdfService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/tickets")

public class RecuPdfController {

    @Autowired
    private RecuPdfService recuPdfService;

    @Autowired
    private RecuPdfRepository recuPdfRepository;

    // ✅ Génère ou récupère le PDF automatiquement
    @GetMapping("/{codeTicket}/pdf")
    public ResponseEntity<byte[]> getOrCreatePdf(@PathVariable String codeTicket) {
        byte[] pdfBytes = recuPdfService.genererEtSauvegarder(codeTicket);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        // ✅ inline = visualisation directe dans le navigateur (pas de téléchargement)
        headers.setContentDisposition(ContentDisposition.inline().filename(codeTicket + ".pdf").build());

        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }

    // 🔹 Récupérer tous les reçus actifs
    @GetMapping("/recu/all")
    public Page<RecuPdf> getAllRecus(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return recuPdfService.getAllRecusActifs(page, size);
    }

    // 🔹 Suppression logique (désactivation du reçu PDF)
    @DeleteMapping("/recu/{codeTicket}")
    public ResponseEntity<Void> deleteRecu(@PathVariable String codeTicket) {
        recuPdfService.supprimerLogiquement(codeTicket);
        return ResponseEntity.ok().build();
    }
}
