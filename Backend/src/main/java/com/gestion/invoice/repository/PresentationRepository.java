package com.gestion.invoice.repository;

import com.gestion.invoice.models.Fournisseur;
import com.gestion.invoice.models.Presentation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PresentationRepository extends JpaRepository<Presentation,Long> {
    Presentation findByIdPresentation (Long idPresentation);
    Presentation findByNom(String nom);
    List<Presentation> findByEtatTrue();

}
