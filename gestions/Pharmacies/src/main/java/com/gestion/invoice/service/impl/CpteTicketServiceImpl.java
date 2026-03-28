package com.gestion.invoice.service.impl;

import com.gestion.invoice.models.Vente;
import com.gestion.invoice.repository.VenteRepository;
import com.gestion.invoice.service.CompteurticketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CpteTicketServiceImpl implements CompteurticketService {

    @Autowired
    private VenteRepository venteRepository;

    @Override
    public String genererTk() {
        // 🔹 Récupère la dernière vente (la plus récente)
        Vente derniereVente = venteRepository.findTopByOrderByIdDesc();

        int prochainNumero = 1; // valeur par défaut si aucun ticket encore créé

        if (derniereVente != null && derniereVente.getCodeTicket() != null) {
            try {
                // Extrait la partie numérique du code VT000123 → 123
                String lastNumberStr = derniereVente.getCodeTicket().substring(2);
                int lastNumber = Integer.parseInt(lastNumberStr);
                prochainNumero = lastNumber + 1;
            } catch (Exception e) {
                System.err.println("Erreur parsing codeTicket : " + e.getMessage());
            }
        }

        // Format VT000001
        return String.format("VT%06d", prochainNumero);
    }
}
