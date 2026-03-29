package com.gestion.invoice.repository;

import com.gestion.invoice.models.NomProduit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NomProduitRepository extends JpaRepository<NomProduit,Long> {
    //Méthode personnalisée pour rechercher par nom
    NomProduit findByNom(String nom);
    List<NomProduit> findByNomContainingIgnoreCaseAndEtatTrue(String keyword);

}
