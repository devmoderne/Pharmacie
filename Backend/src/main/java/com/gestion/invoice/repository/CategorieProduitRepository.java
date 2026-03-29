package com.gestion.invoice.repository;

import com.gestion.invoice.models.CategorieProduit;
import com.gestion.invoice.models.Fournisseur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategorieProduitRepository extends JpaRepository<CategorieProduit,Long> {
   CategorieProduit findByid(Long id);

    List<CategorieProduit> findByEtatTrue();
}
