package com.gestion.invoice.service.impl;

import com.gestion.invoice.models.EntreeStock;
import com.gestion.invoice.models.Produit;
import com.gestion.invoice.repository.EntreeStockRepository;
import com.gestion.invoice.repository.ProduitRepository;
import com.gestion.invoice.service.EntreeStockService;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional

public class EntreeStockImpl implements EntreeStockService {

    private final EntreeStockRepository entreeStockRepository;
    private final ProduitRepository produitRepository;

    public EntreeStockImpl(EntreeStockRepository entreeStockRepository, ProduitRepository produitRepository) {
        this.entreeStockRepository = entreeStockRepository;
        this.produitRepository = produitRepository;
    }

    @Override
    public EntreeStock addEntreeStock(EntreeStock entreeStock) {
        // Sauvegarder l'entrée de stock
        EntreeStock saved = entreeStockRepository.save(entreeStock);

        // Mettre à jour le stock initial du produit
        Produit produit = entreeStock.getProduit();
        int nouveauStock = produit.getStockReel() + entreeStock.getQuantite();
        produit.setStockReel(nouveauStock);
        produitRepository.save(produit);

        return saved;
    }
    @Override
    public Page<EntreeStock> searchEntrees(String search, Pageable pageable) {
        return entreeStockRepository.searchEntrees(search, pageable);
    }
    @Override
    public List<EntreeStock> allEntrees() {
        return entreeStockRepository.findAll();
    }
    @Override
    public Page<EntreeStock> allEntrees(Pageable pageable) {
        return entreeStockRepository.findAll(pageable);
    }
    @Override
    public EntreeStock updateEntreeStock(Long id, EntreeStock entreeStock) {
        EntreeStock existant = entreeStockRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Entrée de stock non trouvée"));

        // Ajuster le stock du produit : soustraire l'ancienne quantité, ajouter la nouvelle
        Produit produit = existant.getProduit();
        int stockAjuste = produit.getStockReel() - existant.getQuantite() + entreeStock.getQuantite();
        produit.setStockReel(stockAjuste);
        produitRepository.save(produit);

        // Mettre à jour l'entrée
        existant.setQuantite(entreeStock.getQuantite());
        existant.setProduit(entreeStock.getProduit());
        existant.setFournisseur(entreeStock.getFournisseur());
        existant.setPrixAchat(entreeStock.getPrixAchat());
        existant.setDateExpiration(entreeStock.getDateExpiration());

        return entreeStockRepository.save(existant);
    }

    @Override
    public void deleteEntreeStock(Long id) {
        EntreeStock entree = entreeStockRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Entrée de stock non trouvée"));

        // Réduire le stock initial du produit
        Produit produit = entree.getProduit();
        produit.setStockReel(produit.getStockReel() - entree.getQuantite());
        produitRepository.save(produit);

        entreeStockRepository.deleteById(id);
    }
    @Override
    public double getDernierPrixAchat(Produit produit) {
        return entreeStockRepository
                .findTopByProduitOrderByDateEntreeDesc(produit)
                .map(EntreeStock::getPrixAchat)
                .orElse(0.0);
    }
}
