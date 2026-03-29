package com.gestion.invoice.repository;

import com.gestion.invoice.models.Produit;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ProduitRepository extends JpaRepository<Produit,Long> {
    @Query("SELECT p FROM Produit p WHERE p.nomProduit = :nom")
    Produit findByNom(@Param("nom") String nom);
    @Query("SELECT COALESCE(SUM(d.quantite), 0) FROM DetailsVentes d WHERE   d.produit.id = :produitId")
    int getTotalVentes(@Param("produitId") Long produitId);
    Page<Produit> findByNomProduitContainingIgnoreCase(String keyword, Pageable pageable);


}
