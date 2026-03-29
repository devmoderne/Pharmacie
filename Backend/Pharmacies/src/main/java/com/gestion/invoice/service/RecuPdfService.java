package com.gestion.invoice.service;

import com.gestion.invoice.models.DetailsVentes;
import com.gestion.invoice.models.RecuPdf;
import com.gestion.invoice.models.Vente;
import com.gestion.invoice.repository.DetailsVenteRepository;
import com.gestion.invoice.repository.RecuPdfRepository;
import com.gestion.invoice.repository.VenteRepository;
import com.gestion.invoice.util.TicketPdfGeneratorCompact;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class RecuPdfService {


    @Autowired
    private RecuPdfRepository recuPdfRepository;

    @Autowired
    private VenteRepository venteRepository;

    @Autowired
    private DetailsVenteRepository detailsVenteRepository;

    @Transactional
    public byte[] genererEtSauvegarder(String codeTicket) {
        Optional<RecuPdf> exist = recuPdfRepository.findByCodeTicket(codeTicket);
        if (exist.isPresent()) {
            return exist.get().getPdfData();
        }

        Vente ticket = venteRepository.findByCodeTicket(codeTicket);
        List<DetailsVentes> lignes = detailsVenteRepository.findByCodeTicket(codeTicket);
        byte[] pdfBytes = TicketPdfGeneratorCompact.generate(ticket, lignes);

        RecuPdf recu = new RecuPdf();
        recu.setCodeTicket(codeTicket);
        recu.setPdfData(pdfBytes);
        recu.setDateCreation(LocalDateTime.now());
        recu.setEtat(true); // actif
        recuPdfRepository.save(recu);

        return pdfBytes;
    }

    public  Page<RecuPdf> getAllRecusActifs(int page,int size) {
        Pageable pageable= PageRequest.of(page,size);
        return recuPdfRepository.findAllByEtatTrue(pageable);
    }


@Transactional
    public void supprimerLogiquement(String codeTicket) {
        recuPdfRepository.findByCodeTicket(codeTicket).ifPresent(recu -> {
            recu.setEtat(false);
            recuPdfRepository.save(recu);
        });
    }

    public Optional<RecuPdf> getRecuByTicket(String codeTicket) {
        return recuPdfRepository.findByCodeTicket(codeTicket);
    }





}
