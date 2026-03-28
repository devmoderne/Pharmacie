package com.gestion.invoice.repository;

import com.gestion.invoice.models.Client;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClientRepository extends JpaRepository<Client,Long> {
    Client findClientById(Long id);
    List<Client> findByEtatTrue();

}
