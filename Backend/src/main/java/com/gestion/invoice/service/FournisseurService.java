package com.gestion.invoice.service;

import com.gestion.invoice.models.Fournisseur;
import java.util.List;

public interface FournisseurService {
    Fournisseur findByNom(String nom);
    Fournisseur addFournisseur(Fournisseur fournisseur);
    List<Fournisseur> allFournisseur();
    Fournisseur updateFournisseur(Long id, Fournisseur fournisseur);
    void deleteFournisseur(Long id);
}
