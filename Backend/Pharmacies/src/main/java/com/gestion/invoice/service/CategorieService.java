package com.gestion.invoice.service;

import com.gestion.invoice.models.CategorieProduit;
import java.util.List;

public interface CategorieService {
    CategorieProduit addCategorieProduit(CategorieProduit categorieProduit);
    List<CategorieProduit> allCategorieProduit();
    CategorieProduit updateCategorieProduit(Long id, CategorieProduit categorieProduit);
    void deleteCategorieProduit(Long id);
}
