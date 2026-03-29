package com.gestion.invoice.controller;

import com.gestion.invoice.dto.FinaliserTicketDTO;
import com.gestion.invoice.models.DetailsVentes;
import com.gestion.invoice.models.Vente;
import com.gestion.invoice.service.DetailsVenteService;
import com.gestion.invoice.service.VenteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/detailsticket")

public class DetailsVenteController {

    @Autowired
    private DetailsVenteService detailsVenteService;

    @Autowired
    private VenteService venteService; // 🔥 ajouté pour accéder à la méthode finaliserTicket

    @PostMapping("/add")
    public ResponseEntity<DetailsVentes> addDetailsTicket(@RequestBody DetailsVentes detailsVentes) {
        DetailsVentes newDetailsVentes = detailsVenteService.addDetailsTicket(detailsVentes);
        return ResponseEntity.ok(newDetailsVentes);
    }

    @GetMapping("/all")
    public ResponseEntity<List<DetailsVentes>> allDetailsTickets() {
        return ResponseEntity.ok(detailsVenteService.allDetailsTicket());
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<DetailsVentes> updateDetailsTicket(@PathVariable Long id, @RequestBody DetailsVentes detailsVentes) {
        DetailsVentes updated = detailsVenteService.updateDetailsTicket(id, detailsVentes);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteDetailsTicket(@PathVariable Long id) {
        detailsVenteService.deleteDetailsTicket(id);
        return ResponseEntity.ok("Détails de ticket supprimé avec succès !");
    }

    @PutMapping("/disable/{produitId}/{ticketCode}")
    public ResponseEntity<String> deleteDetailsTicketByProduit(
            @PathVariable Long produitId,
            @PathVariable String ticketCode) {

        System.out.println("🔥 BACKEND → Requête reçue : disable produitId=" + produitId + ", ticketCode=" + ticketCode);

        detailsVenteService.deleteDetailsTicketByProduit(produitId, ticketCode);

        System.out.println("✅ BACKEND → Méthode exécutée avec succès !");
        return ResponseEntity.ok("Détails de ticket supprimé avec succès !");
    }

    // ✅ Nouvelle méthode : Finaliser un ticket
  /*  @PutMapping("/finaliser/{codeTicket}")
    public ResponseEntity<Vente> finaliserTicket(
            @PathVariable String codeTicket,
            @RequestParam(required = false, defaultValue = "0") double tva,
            @RequestParam(required = false, defaultValue = "0") double remise) {

        Vente venteFinalisee = detailsVenteService.finaliserTicket(codeTicket, tva, remise);

        return ResponseEntity.ok(venteFinalisee);
    }*/



   /* @PutMapping("/finaliser/{codeTicket}")
    public ResponseEntity<Vente> finaliserTicket(
            @PathVariable String codeTicket,
            @RequestParam(required = false, defaultValue = "0") double tva,
            @RequestParam(required = false, defaultValue = "0") double remise,
            @RequestParam(required = false, defaultValue = "0") double remis,
            @RequestParam(required = false, defaultValue = "0") double payer
    ) {
        Vente venteFinalisee = detailsVenteService.finaliserTicket(codeTicket, tva, remise, remis, payer);
        return ResponseEntity.ok(venteFinalisee);
    }*/
   @PutMapping("/finaliser/{codeTicket}")
   public ResponseEntity<Vente> finaliserTicket(
           @PathVariable String codeTicket,
           @RequestBody FinaliserTicketDTO dto) {

       Vente venteFinalisee = detailsVenteService.finaliserTicket(
               codeTicket,
               dto.getTva(),
               dto.getRemise(),
               dto.getRemis(),
               dto.getPayer()
       );

       return ResponseEntity.ok(venteFinalisee);
   }



}
