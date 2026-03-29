package com.gestion.invoice.service;

import com.gestion.invoice.models.EntreeStock;
import com.gestion.invoice.models.Produit;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;




public interface EntreeStockService {

    EntreeStock addEntreeStock(EntreeStock entreeStock);

    List<EntreeStock> allEntrees();

    Page<EntreeStock> allEntrees(Pageable pageable);

    EntreeStock updateEntreeStock(Long id, EntreeStock entreeStock);

    void deleteEntreeStock(Long id);

    Page<EntreeStock> searchEntrees(String search, Pageable pageable);

    double getDernierPrixAchat(Produit produit);
}