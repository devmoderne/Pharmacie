package com.gestion.invoice.service;

import com.gestion.invoice.models.CompteurTicket;
import com.gestion.invoice.models.DetailsVentes;
import com.gestion.invoice.models.Vente;
import com.gestion.invoice.models.Produit;
import java.util.List;



import com.gestion.invoice.models.DetailsVentes;
import com.gestion.invoice.models.Vente;

import java.util.List;

public interface DetailsVenteService {
    DetailsVentes addDetailsTicket(DetailsVentes detailsVentes);
    List<DetailsVentes> allDetailsTicket();
    DetailsVentes updateDetailsTicket(Long id, DetailsVentes detailsVentes);
    void deleteDetailsTicket(Long id);
    Vente finaliserTicket(String codeTicket, double tva, double remise, double remis, double payer);
    void deleteDetailsTicketByProduit(Long produitId, String codeTicket);

    // 🔹 Nouvelles méthodes pour analytics
    int getStockVenduParProduit(Long produitId);
    double getTotalVenteParProduit(Long produitId);
    double getBeneficeSurAchatParProduit(Long produitId);
}
