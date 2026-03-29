package com.gestion.invoice.service;

import com.gestion.invoice.models.NomProduit;

import java.util.List;

public interface NomProduitService {

    NomProduit addNomProduit(NomProduit nomProduit);

    List<NomProduit> allNomProduits();

    NomProduit updateNomProduit(Long id, NomProduit nomProduit);

    void deleteNomProduit(Long id);

    NomProduit findByNom(String nom);

    NomProduit getNomProduitById(Long id);  // pour GET /{id}

    List<NomProduit> searchNomProduit(String keyword);  // recherche par mot-clé
}
