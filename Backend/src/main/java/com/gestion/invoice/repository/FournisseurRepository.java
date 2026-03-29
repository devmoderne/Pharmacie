package com.gestion.invoice.repository;

import com.gestion.invoice.models.Fournisseur;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FournisseurRepository extends JpaRepository<Fournisseur, Long> {

    Fournisseur findByNom(String nom);
     List<Fournisseur> findByEtatTrue();
}
