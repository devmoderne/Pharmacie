package com.gestion.invoice.models;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "recu_pdf")
public class RecuPdf extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "code_ticket", nullable = false)
    private String codeTicket;

    // ✅ Stockage sécurisé et volumineux
    @Lob
    @Column(name = "pdf_data", nullable = false, columnDefinition = "LONGBLOB")
    private byte[] pdfData;

    @Column(name = "date_creation", nullable = false)
    private LocalDateTime dateCreation = LocalDateTime.now();
}
