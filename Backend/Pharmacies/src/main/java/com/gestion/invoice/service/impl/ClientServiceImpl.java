package com.gestion.invoice.service.impl;

import com.gestion.invoice.models.Client;
import com.gestion.invoice.repository.ClientRepository;
import com.gestion.invoice.service.ClientService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ClientServiceImpl implements ClientService {

    private final ClientRepository clientRepository;

    public ClientServiceImpl(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }

    @Override
    public Client addClient(Client client) {
        return clientRepository.save(client);
    }

    @Override
    public List<Client> allClient() {
        return clientRepository.findByEtatTrue();
    }

    @Override
    public Client updateClient(Long id, Client client) {
        Client existant = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client introuvable"));

        existant.setNom(client.getNom());
        existant.setTelephone(client.getTelephone());
        existant.setAdresse(client.getAdresse()); // si tu as un champ adresse
        return clientRepository.save(existant);
    }

    @Override
    public void deleteClient(Long id) {
        Client existant = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client introuvable"));

        existant.setEtat(false); // suppression logique
        clientRepository.save(existant);
    }
}
