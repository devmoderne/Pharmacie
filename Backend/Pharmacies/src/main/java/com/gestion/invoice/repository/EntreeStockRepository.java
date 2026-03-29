package com.gestion.invoice.repository;

import com.gestion.invoice.models.EntreeStock;
import com.gestion.invoice.models.Produit;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;
import java.util.Arrays;
import java.util.List;

public interface EntreeStockRepository extends JpaRepository<EntreeStock,Long> {
    // Cette méthode permet de récupérer toutes les entrées d'un produit

    Optional<EntreeStock> findTopByProduitOrderByDateEntreeDesc(Produit produit);

    List<EntreeStock> findByProduit(Produit produit);
    @Query("""
SELECT e FROM EntreeStock e
JOIN e.produit p
WHERE LOWER(p.nomProduit) LIKE LOWER(CONCAT('%', :search, '%'))
""")
    Page<EntreeStock> searchEntrees(@Param("search") String search, Pageable pageable);


}
