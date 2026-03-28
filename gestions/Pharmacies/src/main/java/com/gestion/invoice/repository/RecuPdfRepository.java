package com.gestion.invoice.repository;
import java.util.List;

import com.gestion.invoice.models.RecuPdf;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RecuPdfRepository extends JpaRepository<RecuPdf, Long> {
    Optional<RecuPdf> findByCodeTicketAndEtatTrue(String codeTicket);

    Page<RecuPdf> findAllByEtatTrue(Pageable pageable);
    Optional<RecuPdf> findByCodeTicket(String codeTicket);

}
