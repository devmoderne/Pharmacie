package com.gestion.invoice.service.impl;

import com.gestion.invoice.models.Fournisseur;
import com.gestion.invoice.repository.FournisseurRepository;
import com.gestion.invoice.service.FournisseurService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class FournisseurImpl implements FournisseurService {

    private final FournisseurRepository fournisseurRepository;

    public FournisseurImpl(FournisseurRepository fournisseurRepository) {
        this.fournisseurRepository = fournisseurRepository;
    }

    @Override
    public Fournisseur findByNom(String nom) {
        return fournisseurRepository.findByNom(nom);
    }

    @Override
    public Fournisseur addFournisseur(Fournisseur fournisseur) {
        return fournisseurRepository.save(fournisseur);
    }

    @Override
    public List<Fournisseur> allFournisseur() {
        return fournisseurRepository.findByEtatTrue();
    }

    @Override
    public Fournisseur updateFournisseur(Long id, Fournisseur fournisseur) {
        Fournisseur existant = fournisseurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Fournisseur introuvable"));

        existant.setNom(fournisseur.getNom());
        existant.setTelephone(fournisseur.getTelephone());
        existant.setAdresse(fournisseur.getAdresse()); // si tu as un champ adresse
        return fournisseurRepository.save(existant);
    }

    @Override
    public void deleteFournisseur(Long id) {
        Fournisseur existant = fournisseurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Fournisseur introuvable"));

        existant.setEtat(false); // suppression logique
        fournisseurRepository.save(existant);
    }
}
