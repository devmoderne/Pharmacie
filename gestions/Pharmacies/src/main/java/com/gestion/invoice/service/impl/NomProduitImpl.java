package com.gestion.invoice.service.impl;

import com.gestion.invoice.models.NomProduit;
import com.gestion.invoice.repository.NomProduitRepository;
import com.gestion.invoice.service.NomProduitService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class NomProduitImpl implements NomProduitService {

    private final NomProduitRepository nomProduitRepository;

    public NomProduitImpl(NomProduitRepository nomProduitRepository) {
        this.nomProduitRepository = nomProduitRepository;
    }

    @Override
    public NomProduit addNomProduit(NomProduit nomProduit) {
        return nomProduitRepository.save(nomProduit);
    }

    @Override
    public List<NomProduit> allNomProduits() {
        return nomProduitRepository.findAll();
    }

    @Override
    public NomProduit updateNomProduit(Long id, NomProduit nomProduit) {
        NomProduit existant = nomProduitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("NomProduit non trouvé"));
        existant.setNom(nomProduit.getNom());
        existant.setDescription(nomProduit.getDescription());
        return nomProduitRepository.save(existant);
    }

    @Override
    public void deleteNomProduit(Long id) {
        NomProduit existant = nomProduitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("NomProduit non trouvé"));
        existant.setEtat(false); // suppression logique
        nomProduitRepository.save(existant);
    }

    @Override
    public NomProduit findByNom(String nom) {
        return nomProduitRepository.findByNom(nom);
    }

    @Override
    public NomProduit getNomProduitById(Long id) {
        return nomProduitRepository.findById(id)
                .orElse(null); // retourne null si non trouvé
    }

    @Override
    public List<NomProduit> searchNomProduit(String keyword) {
        return nomProduitRepository.findByNomContainingIgnoreCaseAndEtatTrue(keyword);
    }
}
