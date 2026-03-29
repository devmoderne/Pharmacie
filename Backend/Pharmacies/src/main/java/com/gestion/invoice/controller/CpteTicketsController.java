package com.gestion.invoice.controller;

import com.gestion.invoice.service.CompteurticketService;
import com.gestion.invoice.service.impl.CategorieServiceImpl;
import com.gestion.invoice.service.impl.CpteTicketServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/compteurticket")
@PreAuthorize("hasAnyAuthority('ADMIN','USER')")
public class CpteTicketsController {

    @Autowired
   private final CompteurticketService cpteTicketService;

    public CpteTicketsController(CompteurticketService cpteTicketService) {
        this.cpteTicketService = cpteTicketService;
    }


    // Endpoint pour récupérer le prochain numéro 'nbr'

    // API pour générer un nouveau Tk
    @GetMapping
    public ResponseEntity<Map<String, String>> generateTk() {
        String codeTicket = cpteTicketService.genererTk();
        Map<String, String> response = new HashMap<>();
        response.put("codeTicket",codeTicket);  // Retourner le numéro Tk généré
        return ResponseEntity.ok(response);
    }
}