package com.gestion.invoice.service.impl;

public class bouillons {
}
/*@Override
public DetailsVentes addDetailsTicket(DetailsVentes detailsVentes) {
    String codeTicket = detailsVentes.getVente().getCodeTicket();

    // 🔐 Vérifier si la vente existe déjà
    Vente vente = venteRepository.findByCodeTicket(codeTicket);
    if (vente == null) {
        System.out.println("Vente inexistante, création d’une nouvelle vente.");

        Vente nouvelleVente = new Vente();
        nouvelleVente.setCodeTicket(codeTicket);
        nouvelleVente.setEtat(false); // vente en cours
        nouvelleVente.setDateVente(LocalDateTime.now());

        // Si tu veux associer un utilisateur ou autre, tu peux le faire ici
        // nouvelleVente.setUtilisateur(utilisateurConnecte);

        vente = venteRepository.save(nouvelleVente);
    }

    // Associer la vente au détail
    detailsVentes.setVente(vente);

    // Calcul du montant si les valeurs sont renseignées
    if (detailsVentes.getQuantite() != null && detailsVentes.getPrixUnitaire() != null) {
        detailsVentes.setMontant(detailsVentes.getQuantite() * detailsVentes.getPrixUnitaire());
    } else {
        detailsVentes.setMontant(0.0);
    }

    return detailsVenteRepository.save(detailsVentes);
}
*/