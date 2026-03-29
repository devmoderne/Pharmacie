package com.gestion.invoice.service.impl;



import com.gestion.invoice.dto.VenteCreateDTO;
import com.gestion.invoice.exception.ResourceNotFoundException;
import com.gestion.invoice.models.AppUser;
import com.gestion.invoice.models.Client;
import com.gestion.invoice.models.DetailsVentes;
import com.gestion.invoice.models.Vente;
import com.gestion.invoice.repository.ClientRepository;
import com.gestion.invoice.repository.DetailsVenteRepository;
import com.gestion.invoice.repository.UserRepository;
import com.gestion.invoice.repository.VenteRepository;
import com.gestion.invoice.service.DetailsVenteService;
import com.gestion.invoice.service.VenteService;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

<<<<<<< HEAD
import java.time.LocalDate;
=======
>>>>>>> a45223998defebbae8d29fde1e3be01e5f3c73f8
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class VenteImpl implements VenteService {

    private final VenteRepository venteRepository;
    private final DetailsVenteService detailsVenteService;
    private final UserRepository userRepository;
    private final ClientRepository clientRepository;
    private final DetailsVenteRepository detailsVenteRepository;
    public VenteImpl(VenteRepository venteRepository, ClientRepository clientRepository, DetailsVenteService detailsVenteService, UserRepository userRepository, ClientRepository clientRepository1, DetailsVenteRepository detailsVenteRepository) {
        this.venteRepository = venteRepository;
        this.detailsVenteService = detailsVenteService;

        this.userRepository = userRepository;
        this.clientRepository = clientRepository1;
        this.detailsVenteRepository = detailsVenteRepository;
    }

    @Override
    public Vente findByCodeTicket(String codeTicket) {
        return venteRepository.findByCodeTicket(codeTicket);
    }

   @Override
    public Vente addTicket(Vente vente) {
        // Génération automatique de la date si non fournie
        if (vente.getDateVente() == null) {
            vente.setDateVente(LocalDateTime.now());
        }
        return venteRepository.save(vente);
    }



    @Override
    public List<Vente> allTicket() {
        return venteRepository.findTicketsAvecDetails();
    }

    @Override
    public Page<Vente> allTicket(Pageable pageable) {
        return venteRepository.findTicketsAvecDetails(pageable);
    }

    @Override
    public Vente updateTicket(Long id, Vente vente) {
        Vente existant = venteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket non trouvé"));

        existant.setClient(vente.getClient());

        existant.setDateVente(vente.getDateVente());
        existant.setTotal(vente.getTotal());
        existant.setRemise(vente.getRemise());
        existant.setRemis(vente.getRemis());
        existant.setRendue(vente.getRendue());
        existant.setTva(vente.getTva());
        existant.setBenefice(vente.getBenefice());
       // existant.setQtes(vente.getQtes());

        return venteRepository.save(existant);
    }


    @Override
    @Transactional
    public void deleteTicket(Long id) {
        // 🔹 Récupérer le ticket existant
        Vente existant = venteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket non trouvé"));

        // 🔹 Récupérer tous les détails du ticket
        List<DetailsVentes> details = detailsVenteRepository.findByCodeTicket(existant.getCodeTicket());

        // 🔹 Parcourir les détails et appeler deleteDetailsTicket pour chaque
        for (DetailsVentes detail : details) {
            detailsVenteService.deleteDetailsTicket(detail.getId());
        }

        // 🔹 Désactiver le ticket
        existant.setEtat(false);
        venteRepository.save(existant);

        System.out.println("✅ Ticket " + existant.getCodeTicket() + " annulé et stocks rétablis !");
    }

@Override
    public List<Vente> getVentesDuJourByUser(String phone) {
        AppUser user = userRepository.findByTelephone(phone);
        if (user == null) return new ArrayList<>();
        return venteRepository.findVentesDuJourByUser(user.getId());
    }

    @Override
    public Vente createTicket(VenteCreateDTO dto) {

        Vente vente = new Vente();
        vente.setCodeTicket(dto.getCodeTicket());
        vente.setDateVente(LocalDateTime.now());
        vente.setEtat(true);

        if (dto.getClientId() != null) {
            Client client = clientRepository.findById(dto.getClientId())
                    .orElseThrow(() -> new RuntimeException("Client introuvable"));
            vente.setClient(client);
        }

        return venteRepository.saveAndFlush(vente); // 🔥 flush = ID garanti
    }
<<<<<<< HEAD
    @Override
    public List<Vente> allTicket(String startDate, String endDate) {
        if (startDate != null && endDate != null) {
            LocalDate start = LocalDate.parse(startDate);
            LocalDate end = LocalDate.parse(endDate);
            return venteRepository.findByDateVenteBetweenAndEtatTrue(start, end);
        }
        return venteRepository.findAll();
    }
=======


>>>>>>> a45223998defebbae8d29fde1e3be01e5f3c73f8
}
