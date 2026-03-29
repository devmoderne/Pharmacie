package com.gestion.invoice.service;

import com.gestion.invoice.models.Client;
import java.util.List;

public interface ClientService {
    Client addClient(Client client);
    List<Client> allClient();
    Client updateClient(Long id, Client client);
    void deleteClient(Long id);
}
