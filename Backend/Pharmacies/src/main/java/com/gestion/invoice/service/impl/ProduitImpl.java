package com.gestion.invoice.service.impl;

import com.gestion.invoice.exception.ResourceNotFoundException;
import com.gestion.invoice.models.EntreeStock;
import com.gestion.invoice.models.Produit;
import com.gestion.invoice.models.CategorieProduit;
import com.gestion.invoice.repository.CategorieProduitRepository;
import com.gestion.invoice.repository.EntreeStockRepository;
import com.gestion.invoice.repository.ProduitRepository;
import com.gestion.invoice.service.ProduitService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ProduitImpl implements ProduitService {

    private final ProduitRepository produitRepository;
    private final EntreeStockRepository entreeStockRepository;
    private final CategorieProduitRepository categorieProduitRepository;

    public ProduitImpl(ProduitRepository produitRepository,
                       EntreeStockRepository entreeStockRepository,
                       CategorieProduitRepository categorieProduitRepository) {
        this.produitRepository = produitRepository;
        this.entreeStockRepository = entreeStockRepository;
        this.categorieProduitRepository = categorieProduitRepository;
    }

    @Override
    public Produit addProduit(Produit produit) {
        if (produit.getCategorie() != null && produit.getCategorie().getId() != null) {
            CategorieProduit categorie = categorieProduitRepository
                    .findById(produit.getCategorie().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Catégorie introuvable"));
            produit.setCategorie(categorie);
        } else {
            throw new IllegalArgumentException("La catégorie du produit doit être existante");
        }

        return produitRepository.save(produit);
    }

    @Override
    public List<Produit> allProduit() {
        List<Produit> produits = produitRepository.findAll();
        produits.forEach(this::calculerStockReel);
        return produits;
    }

    @Override
    public Page<Produit> getAllproduit(Pageable pageable) {
        Page<Produit> page = produitRepository.findAll(pageable);
        page.forEach(this::calculerStockReel);
        return page;
    }

    @Override
    public Produit updateProduit(Long id, Produit produit) {
        Produit existant = produitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produit non trouvé"));

        existant.setNomProduit(produit.getNomProduit());
        existant.setPrixVente(produit.getPrixVente());
        existant.setAlerte(produit.getAlerte());
        existant.setImageProduit(produit.getImageProduit());

        if (produit.getCategorie() != null && produit.getCategorie().getId() != null) {
            CategorieProduit categorieExistante = categorieProduitRepository.findById(produit.getCategorie().getId())
                    .orElseThrow(() -> new RuntimeException("Catégorie non trouvée"));
            existant.setCategorie(categorieExistante);
        }

        return produitRepository.save(existant);
    }

    @Override
    public void deleteProduit(Long id) {
        Produit produit = produitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produit non trouvé"));
        produit.setEtat(false);
        produitRepository.save(produit);
    }

    @Override
    public Produit findById(Long id) {
        Produit produit = produitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produit introuvable"));
        calculerStockReel(produit);
        return produit;
    }

    @Override
    public boolean verifierStockDisponible(Produit produit, double quantiteDemandee) {
        calculerStockReel(produit);
        return produit.getStockReel() >= quantiteDemandee;
    }



    @Override
    public Produit findByNom(String nom) {
        Produit produit = produitRepository.findByNom(nom);
        if (produit != null) calculerStockReel(produit);
        return produit;
    }


    @Override
    public void calculerStockReel(Produit produit) {
        // Total des entrées
        int totalEntrees = entreeStockRepository
                .findByProduit(produit)
                .stream()
                .mapToInt(EntreeStock::getQuantite)
                .sum();

        // Total des ventes
        int totalVentes = 0;
        try {
            totalVentes = produitRepository.getTotalVentes(produit.getId());
        } catch (Exception e) {
            totalVentes = 0;
        }

        int stockReel = totalEntrees - totalVentes;
        produit.setStockReel(Math.max(stockReel, 0));
    }

    @Override
    public Page<Produit> searchProduits(String keyword, Pageable pageable) {
        return produitRepository.findByNomProduitContainingIgnoreCase(keyword, pageable);
    }


}
