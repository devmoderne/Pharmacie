package com.gestion.invoice.service.impl;


import com.gestion.invoice.models.CategorieProduit;
import com.gestion.invoice.models.CompteurTicket;
import com.gestion.invoice.models.Fournisseur;
import com.gestion.invoice.repository.CategorieProduitRepository;
import com.gestion.invoice.repository.CompteurTicketRepository;
import com.gestion.invoice.service.CategorieService;
import com.gestion.invoice.service.CompteurticketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategorieServiceImpl implements CategorieService {
    private final CategorieProduitRepository  categorieProduitRepository;

    public CategorieServiceImpl(CategorieProduitRepository categorieProduitRepository) {
        this.categorieProduitRepository = categorieProduitRepository;
    }

    @Override
    public CategorieProduit addCategorieProduit(CategorieProduit categorieProduit) {
        return categorieProduitRepository.save(categorieProduit);
    }

    @Override
    public List<CategorieProduit> allCategorieProduit() {
        return categorieProduitRepository.findByEtatTrue();
    }

    @Override
    public CategorieProduit updateCategorieProduit(Long id, CategorieProduit categorieProduit) {
        CategorieProduit existant = categorieProduitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("categorie introuvable"));

        existant.setNomCategorie(categorieProduit.getNomCategorie());

        existant.setDescription(categorieProduit.getDescription()); // si tu as un champ adresse
        return categorieProduitRepository.save(existant);
    }

    @Override
    public void deleteCategorieProduit(Long id) {
        CategorieProduit existant = categorieProduitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("categorie introuvable"));

        existant.setEtat(false);

        categorieProduitRepository.save(existant);
    }
}

