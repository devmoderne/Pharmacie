package com.gestion.invoice.service;

import com.gestion.invoice.models.Presentation;
import java.util.List;

public interface PresentationService {
    Presentation findByNom(String nom);
    Presentation addPresentation(Presentation presentation);
    List<Presentation> allPresentation();
    Presentation updatePresentation(Long id, Presentation presentation);
    void deletePresentation(Long id);

}
