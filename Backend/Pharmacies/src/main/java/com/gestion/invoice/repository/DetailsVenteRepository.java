package com.gestion.invoice.repository;

import com.gestion.invoice.models.DetailsVentes;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface DetailsVenteRepository extends JpaRepository<DetailsVentes, Long> {
    List<DetailsVentes> findByCodeTicket(String codeticket);
    DetailsVentes findDetailsTicketById(Long id);
    Optional<DetailsVentes> findByProduitIdAndCodeTicket(Long produitId, String codeTicket);
    List<DetailsVentes> findByProduitIdAndEtatTrue(Long produitId);


}
