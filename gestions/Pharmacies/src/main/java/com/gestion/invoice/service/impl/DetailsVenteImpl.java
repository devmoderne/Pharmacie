package com.gestion.invoice.service.impl;

import com.gestion.invoice.exception.ResourceNotFoundException;
import com.gestion.invoice.models.*;
import com.gestion.invoice.repository.*;
import com.gestion.invoice.service.DetailsVenteService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class DetailsVenteImpl implements DetailsVenteService {
    private static final Logger log = LoggerFactory.getLogger(DetailsVenteImpl.class);
    private final DetailsVenteRepository detailsVenteRepository;
    private final VenteRepository venteRepository;
    private final ProduitRepository produitRepository;
    private final ClientRepository clientRepository;
    private final EntreeStockRepository entreeStockRepository;
    public DetailsVenteImpl(DetailsVenteRepository detailsVenteRepository,
                            VenteRepository venteRepository,
                            ProduitRepository produitRepository,
                            ClientRepository clientRepository, EntreeStockRepository entreeStockRepository) {
        this.detailsVenteRepository = detailsVenteRepository;
        this.venteRepository = venteRepository;
        this.produitRepository = produitRepository;
        this.clientRepository = clientRepository;
        this.entreeStockRepository = entreeStockRepository;
    }

    @Override
    @Transactional
    public DetailsVentes addDetailsTicket(DetailsVentes detailsVente) {

        // 🔸 Vérifie que le produit existe
        Produit produit = produitRepository.findById(detailsVente.getProduit().getId())
                .orElseThrow(() -> new RuntimeException("Produit introuvable !"));

        if (!detailsVente.isEtat()) {
            throw new RuntimeException("Impossible d’ajouter un produit désactivé (état = false)");
        }

        // 🔸 Vérifie la disponibilité du stock
        if (produit.getStockReel()==null || produit.getStockReel() <= 0) {
            throw new RuntimeException("Stock épuisé pour le produit : " + produit.getNomProduit());
        }

        if (detailsVente.getQuantite() > produit.getStockReel()) {
            throw new RuntimeException("Quantité demandée (" + detailsVente.getQuantite() +
                    ") supérieure au stock disponible (" + produit.getStockReel() + ")");
        }

        // 🔸 Vérifie si le codeTicket existe dans la table Vente
        Vente vente = venteRepository.findByCodeTicket(detailsVente.getCodeTicket()); // retourne null si pas trouvé
        if (vente == null) {
            // Supprime les lignes orphelines si existantes
            List<DetailsVentes> lignesOrphelines = detailsVenteRepository.findByCodeTicket(detailsVente.getCodeTicket());
            if (lignesOrphelines != null && !lignesOrphelines.isEmpty()) {
                detailsVenteRepository.deleteAll(lignesOrphelines);
            }
            throw new RuntimeException("Vente introuvable pour le ticket " + detailsVente.getCodeTicket() +
                    " — l'opération est annulée !");
        }

        // 🔹 Recherche de l'entrée de stock en cours (la plus récente)
        EntreeStock entree = entreeStockRepository
                .findTopByProduitOrderByDateEntreeDesc(produit)
                .orElseThrow(() -> new RuntimeException("Aucune entrée trouvée pour ce produit"));

        if (entree == null) {
            throw new RuntimeException("Aucune entrée de stock trouvée pour le produit : "
                    + detailsVente.getProduit().getNomProduit());
        }

// 🔹 Calcul des montants
        double quantite = detailsVente.getQuantite();
        double prixVente = detailsVente.getPrixUnitaire();
        double prixAchat = entree.getPrixAchat();

        double montantVente = quantite * prixVente;
        double montantAchat = quantite * prixAchat;

// 🔹 Affectation des valeurs
        detailsVente.setMontant(montantVente);
        detailsVente.setMontantachat(montantAchat);

        log.info("🔹 Nom du produit : {}", detailsVente.getProduit().getNomProduit());
        log.info("🔹 Prix unitaire : {}", detailsVente.getPrixUnitaire());
        log.info("🔹 Quantité : {}", detailsVente.getQuantite());
        log.info("🔹 Montant achat : {}", detailsVente.getMontantachat());
        log.info("🔹 Montant vente : {}", detailsVente.getMontant());

        // 🔹 Mise à jour du stock
        produit.setStockReel(produit.getStockReel() - detailsVente.getQuantite());
        produitRepository.save(produit);

        // 🔹 Enregistre le détail
        DetailsVentes saved = detailsVenteRepository.save(detailsVente);

        return saved;
    }


   /* @Override
    public List<DetailsVentes> allDetailsTicket() {
        return detailsVenteRepository.findAll();
    }*/
   @Override
   public List<DetailsVentes> allDetailsTicket() {
       return detailsVenteRepository.findAll()
               .stream()
               .filter(DetailsVentes::isEtat)
               .toList();
   }


    @Override
    public DetailsVentes updateDetailsTicket(Long id, DetailsVentes detailsVentes) {
        DetailsVentes exist = detailsVenteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Détail non trouvé"));
        exist.setQuantite(detailsVentes.getQuantite());
        exist.setPrixUnitaire(detailsVentes.getPrixUnitaire());
        exist.setMontant(detailsVentes.getQuantite() * detailsVentes.getPrixUnitaire());
        double prixAchatUnitaire = exist.getMontantachat() / exist.getQuantite();
        exist.setMontantachat(detailsVentes.getQuantite() * prixAchatUnitaire);
        return detailsVenteRepository.save(exist);
    }

    @Override
    public void deleteDetailsTicket(Long id) {
        DetailsVentes exist = detailsVenteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Détail non trouvé"));


// 🔹 Récupérer le produit existant lié à la vente
        Produit produit = produitRepository.findById(exist.getProduit().getId())
                .orElseThrow(() -> new RuntimeException("Produit introuvable pour ce détail"));

// 🔹 Rétablir le stock du produit
        int stockActuel = (produit.getStockReel() != null) ? produit.getStockReel() : 0;
        int quantiteRestituer = exist.getQuantite();
        produit.setStockReel(stockActuel + quantiteRestituer);
        produitRepository.save(produit);

// 🔹 Désactiver le détail de vente (suppression logique)
        exist.setQuantite(0);
        exist.setEtat(false);
        //exist.setUpdatedAt(LocalDateTime.now());
        detailsVenteRepository.save(exist);


    }

/*
    @Transactional
   public Vente finaliserTicket(String codeTicket, double tva, double remise) {
       Vente vente = venteRepository.findByCodeTicket(codeTicket);
       if (vente == null) {
           throw new RuntimeException("Vente introuvable pour le ticket : " + codeTicket);
       }

       List<DetailsVentes> details = detailsVenteRepository.findByCodeTicket(codeTicket);
       if (details.isEmpty()) {
           throw new RuntimeException("Aucun détail trouvé pour le ticket " + codeTicket);
       }

       double total = details.stream().mapToDouble(DetailsVentes::getMontant).sum();
       double totalFinal = total + tva - remise;

       // On récupère l'ID du client depuis le premier détail
       Long clientId = details.get(0).getClientId(); // méthode getClientId() qui renvoie l'ID
       Client client = new Client();
       client.setId(clientId); // on ne remplit que l'ID

       // On affecte le client à la vente
       vente.setClient(client);
       vente.setTotal(totalFinal);
       vente.setTva(tva);
       vente.setRemise(remise);
       vente.setUpdatedAt(LocalDateTime.now());

       return venteRepository.save(vente);
   }
*/
/*@Transactional
public Vente finaliserTicket(String codeTicket, double tva, double remise, double remis, double payer) {
    System.out.println("🔹 Début finalisation du ticket : " + codeTicket);
    System.out.println("🔹 TVA reçue : " + tva + " | Remise reçue : " + remise + " | Remis : " + remis + " | Payer : " + payer);

    Vente vente = venteRepository.findByCodeTicket(codeTicket);
    if (vente == null) {
        throw new RuntimeException("⚠️ Vente introuvable pour le ticket : " + codeTicket);
    }

    List<DetailsVentes> details = detailsVenteRepository.findByCodeTicket(codeTicket);
    if (details.isEmpty()) {
        throw new RuntimeException("⚠️ Aucun détail trouvé pour le ticket " + codeTicket);
    }

    // ✅ Calcul du total
    double total = details.stream().mapToDouble(DetailsVentes::getMontant).sum();

    // ✅ Calcul des montants dérivés
    double montantRemise = total * (remise / 100);
    double montantTVA = total * (tva / 100);
    double totalFinal = total + montantTVA - montantRemise;

    // ✅ Si payer est 0, on prend totalFinal comme net à payer
    double netAPayer = (payer > 0) ? payer : totalFinal;

    // ✅ Calcul du rendu
    double rendu = remis - netAPayer;

    // ✅ Récupérer le client depuis le premier détail
    Long clientId = details.get(0).getClientId();
    Client client = new Client();
    client.setId(clientId);

    // ✅ Affectation des valeurs
    vente.setClient(client);
    vente.setTotal(total);
    vente.setTva(tva);
    vente.setRemise(remise);
    vente.setRemis(remis);
    vente.setPayer(netAPayer);
    vente.setRendue(rendu > 0 ? rendu : 0);
    vente.setUpdatedAt(LocalDateTime.now());

    System.out.println("✅ Calculs : Total=" + total + " | Remise=" + montantRemise + " | TVA=" + montantTVA
            + " | Net à payer=" + netAPayer + " | Remis=" + remis + " | Rendu=" + (rendu > 0 ? rendu : 0));

    Vente saved = venteRepository.save(vente);
    System.out.println("💾 Vente mise à jour avec succès : " + saved);

    return saved;
}
*/

@Transactional
public Vente finaliserTicket(String codeTicket, double tva, double remise, double remis, double payer) {
    // 🔹 Récupération de la vente
    Vente vente = venteRepository.findByCodeTicket(codeTicket);
    if (vente == null) {
        throw new RuntimeException("Vente introuvable pour le ticket : " + codeTicket);
    }

    // 🔹 Récupération des lignes du ticket
    List<DetailsVentes> details = detailsVenteRepository.findByCodeTicket(codeTicket);
    if (details.isEmpty()) {
        throw new RuntimeException("Aucun détail trouvé pour le ticket " + codeTicket);
    }

    // 🔹 Calcul du total, remise, TVA, net et rendu
    double total = 0;
    double totalachat = 0;
    double benefices = 0;

    System.out.println("🔹 Détails du ticket " + codeTicket + " :");
    for (DetailsVentes d : details) {
        double ligneMontant = d.getMontant();
        double ligneAchat = d.getMontantachat();
        double prixAchatUnitaire = ligneAchat / d.getQuantite();
        double ligneBenefice = (d.getPrixUnitaire() - prixAchatUnitaire) * d.getQuantite();

        total += ligneMontant;
        totalachat += ligneAchat;
        benefices += ligneBenefice;

        // 🔹 Affichage par ligne
        System.out.println("Produit: " + d.getProduit().getNomProduit()
                + " | Qté: " + d.getQuantite()
                + " | Prix vente: " + d.getPrixUnitaire()
                + " | Prix achat unitaire: " + prixAchatUnitaire
                + " | Montant: " + ligneMontant
                + " | Bénéfice: " + ligneBenefice);
    }

    double montantRemise = total * (remise / 100);
    double montantTVA = total * (tva / 100);
    double totalFinal = total + montantTVA - montantRemise;

    double renduCalc = remis - totalFinal;

    // 🔹 Récupération du client complet
    Long clientId = details.get(0).getClientId();
    Client client = clientRepository.findById(clientId)
            .orElseThrow(() -> new RuntimeException("Client introuvable pour id : " + clientId));

    // 🔹 Mise à jour de la vente
    vente.setClient(client);
    vente.setTotal(total);
    vente.setTva(tva);
    vente.setRemise(remise);
    vente.setRemis(remis);
    vente.setRendue(renduCalc > 0 ? renduCalc : 0);
    vente.setPayer(payer);
    vente.setUpdatedAt(LocalDateTime.now());
    vente.setBenefice(benefices);
    vente.setStatut(true);

    System.out.println("🔥 Total: " + total
            + " | Total achat: " + totalachat
            + " | Remise: " + montantRemise
            + " | TVA: " + montantTVA
            + " | Total final: " + totalFinal
            + " | Rendu: " + (renduCalc > 0 ? renduCalc : 0)
            + " | Bénéfice total: " + benefices);

    return venteRepository.save(vente);
}
/*public Vente finaliserTicket(String codeTicket, double tva, double remise, double remis, double payer) {
// 🔹 Récupération de la vente
    Vente vente = venteRepository.findByCodeTicket(codeTicket);
    if (vente == null) {
        throw new RuntimeException("Vente introuvable pour le ticket : " + codeTicket);
    }


// 🔹 Récupération des lignes du ticket
    List<DetailsVentes> details = detailsVenteRepository.findByCodeTicket(codeTicket);
    if (details.isEmpty()) {
        throw new RuntimeException("Aucun détail trouvé pour le ticket " + codeTicket);
    }

// 🔹 Calcul du total, remise, TVA, net et rendu
    double total = details.stream().mapToDouble(DetailsVentes::getMontant).sum();
    double totalachat = details.stream().mapToDouble(DetailsVentes::getMontantachat).sum();
    double montantRemise = total * (remise / 100);
    double montantTVA = total * (tva / 100);
    double totalFinal = total + montantTVA - montantRemise;


   // double benefices=totalachat-totalFinal;
    double benefices = details.stream()
            .mapToDouble(d -> {
                double prixAchatUnitaire = d.getMontantachat() / d.getQuantite(); // prix d'achat par unité
                return (d.getPrixUnitaire() - prixAchatUnitaire) * d.getQuantite(); // bénéfice par ligne
            })
            .sum();

    double renduCalc = remis - totalFinal;

// 🔹 Récupération du client complet
    Long clientId = details.get(0).getClientId();
    Client client = clientRepository.findById(clientId)
            .orElseThrow(() -> new RuntimeException("Client introuvable pour id : " + clientId));

// 🔹 Mise à jour de la vente
    vente.setClient(client);
    vente.setTotal(total);
    vente.setTva(tva);
    vente.setRemise(remise);
    vente.setRemis(remis);
    vente.setRendue(renduCalc > 0 ? renduCalc : 0);
    vente.setPayer(payer);
    vente.setUpdatedAt(LocalDateTime.now());
    vente.setBenefice(benefices);
    vente.setStatut(true);
// 🔹 Log pour debug
    System.out.println("🔥 finaliserTicket → Vente finalisée : " + vente);

    return venteRepository.save(vente);


}


    /*  @Override
    @Transactional
    public void deleteDetailsTicketByProduit(Long produitId, String codeTicket) {
        // 🔹 Chercher le détail correspondant au produit et au ticket
        DetailsVentes detail = detailsVenteRepository
                .findByProduitIdAndCodeTicket(produitId, codeTicket)
                .orElseThrow(() -> new RuntimeException(
                        "Détail introuvable pour le produitId=" + produitId + " et codeTicket=" + codeTicket
                ));

        // 🔹 Rétablir le stock du produit
        Produit produit = produitRepository.findById(produitId)
                .orElseThrow(() -> new RuntimeException("Produit introuvable pour ce détail"));

        int stockActuel = (produit.getStockReel() != null) ? produit.getStockReel() : 0;
        produit.setStockReel(stockActuel + detail.getQuantite());
        produitRepository.save(produit);

        // 🔹 Suppression logique du détail
        detail.setQuantite(0);
        detail.setEtat(false);
        detailsVenteRepository.save(detail);

        System.out.println("✅ Détail supprimé logiquement pour produitId=" + produitId + ", codeTicket=" + codeTicket);
    }
*/
  @Transactional
  public void deleteDetailsTicketByProduit(Long produitId, String codeTicket) {
      // 🔹 Chercher le détail correspondant au produit et au ticket
      DetailsVentes detail = detailsVenteRepository
              .findByProduitIdAndCodeTicket(produitId, codeTicket)
              .orElseThrow(() -> new RuntimeException(
                      "Détail introuvable pour le produitId=" + produitId + " et codeTicket=" + codeTicket
              ));

      // 🔹 Rétablir le stock du produit
      Produit produit = produitRepository.findById(produitId)
              .orElseThrow(() -> new RuntimeException("Produit introuvable pour ce détail"));

      int stockActuel = (produit.getStockReel() != null) ? produit.getStockReel() : 0;
      produit.setStockReel(stockActuel + detail.getQuantite());
      produitRepository.save(produit);

      // 🔹 Suppression réelle du détail
      detailsVenteRepository.delete(detail);

      System.out.println("✅ Détail supprimé définitivement pour produitId=" + produitId + ", codeTicket=" + codeTicket);
  }

    @Override
    public int getStockVenduParProduit(Long produitId) {
        return detailsVenteRepository.findByProduitIdAndEtatTrue(produitId)
                .stream()
                .mapToInt(DetailsVentes::getQuantite)
                .sum();
    }

    @Override
    public double getTotalVenteParProduit(Long produitId) {
        return detailsVenteRepository.findByProduitIdAndEtatTrue(produitId)
                .stream()
                .mapToDouble(d -> d.getPrixUnitaire() * d.getQuantite())
                .sum();
    }

    @Override
    public double getBeneficeSurAchatParProduit(Long produitId) {
        return detailsVenteRepository.findByProduitIdAndEtatTrue(produitId)
                .stream()
                .mapToDouble(d -> {
                    double prixAchatUnitaire = d.getMontantachat() / d.getQuantite();
                    return (d.getPrixUnitaire() - prixAchatUnitaire) * d.getQuantite();
                })
                .sum();
    }


}
