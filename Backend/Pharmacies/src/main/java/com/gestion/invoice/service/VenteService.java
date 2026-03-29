package com.gestion.invoice.service;


import com.gestion.invoice.dto.VenteCreateDTO;
import com.gestion.invoice.models.Vente;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface VenteService {
    Vente findByCodeTicket(String codeTicket);
    Vente addTicket(Vente vente);
    List<Vente> allTicket();
    Page<Vente> allTicket(Pageable pageable);
    Vente updateTicket(Long id, Vente vente);
    void deleteTicket(Long id);
    List<Vente> getVentesDuJourByUser(String username);
    Vente createTicket(VenteCreateDTO dto);
<<<<<<< HEAD
    List<Vente> allTicket(String startDate, String endDate);
=======
>>>>>>> a45223998defebbae8d29fde1e3be01e5f3c73f8

}
