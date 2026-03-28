package com.gestion.invoice.repository;

import com.gestion.invoice.models.Vente;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface VenteRepository extends JpaRepository<Vente, Long> {
    Vente findByCodeTicket(String codeTicket);

    // 🔹 Permet de récupérer la dernière vente
    Vente findTopByOrderByIdDesc();

    @Query("""
    SELECT DISTINCT v
    FROM Vente v
    JOIN DetailsVentes d ON d.codeTicket = v.codeTicket
    WHERE v.etat = true
      AND d.etat = true
      AND v.statut = true
""")
    List<Vente> findTicketsAvecDetails();

    @Query("""
    SELECT DISTINCT v
    FROM Vente v
    JOIN DetailsVentes d ON d.codeTicket = v.codeTicket
    WHERE v.etat = true
      AND d.etat = true
      AND v.statut = true
""")
    Page<Vente> findTicketsAvecDetails(Pageable pageable);


    @Query("SELECT v FROM Vente v " +
            "WHERE v.etat = true " +
            "AND v.statut = true " +
            "AND (:client IS NULL OR v.client.nom LIKE %:client%) " +
            "AND (:userId IS NULL OR v.createdBy.id = :userId) " +
            "AND (:startDate IS NULL OR v.dateVente >= :startDate) " +
            "AND (:endDate IS NULL OR v.dateVente <= :endDate) " +
            "ORDER BY v.dateVente DESC") // 🔹 Tri décroissant
    Page<Vente> findVentesActives(
            @Param("client") String client,
            @Param("userId") Long userId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            Pageable pageable
    );

    @Query("SELECT v FROM Vente v " +
            "WHERE v.etat = true " +
            "AND v.statut = true " +
            "AND v.createdBy.telephone = :telephone " +
            "AND FUNCTION('DATE', v.dateVente) = CURRENT_DATE " +
            "ORDER BY v.dateVente DESC")
    List<Vente> findVentesDuJourByUserTelephone(@Param("telephone") String telephone);

    @Query("SELECT v FROM Vente v " +
            "WHERE v.etat = true " +
            "AND v.statut = true " +
            "AND v.createdBy.id = :userId " +
            "AND FUNCTION('DATE', v.dateVente) = CURRENT_DATE " +
            "ORDER BY v.dateVente DESC")
    List<Vente> findVentesDuJourByUser(@Param("userId") Long userId);

}


