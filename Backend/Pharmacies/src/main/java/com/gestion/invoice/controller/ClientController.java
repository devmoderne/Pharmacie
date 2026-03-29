package com.gestion.invoice.controller;

import com.gestion.invoice.models.Client;
import com.gestion.invoice.service.ClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/v1/client")

public class ClientController {

    private final ClientService clientService;

    @Autowired
    public ClientController(ClientService clientService) {
        this.clientService = clientService;
    }

    @PostMapping("/add")

    public Client addClient(@RequestBody Client client) {
        return clientService.addClient(client);
    }

    @GetMapping("/all")

    public List<Client> getAllClients() {
        return clientService.allClient();
    }

    @PutMapping("/update/{id}")

    public Client updateClient(@PathVariable Long id, @RequestBody Client client) {
        return clientService.updateClient(id, client);
    }

    @DeleteMapping("/delete/{id}")

    public void deleteClient(@PathVariable Long id) {
        clientService.deleteClient(id);
    }
}
