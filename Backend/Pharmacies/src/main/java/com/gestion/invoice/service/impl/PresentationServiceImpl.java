package com.gestion.invoice.service.impl;

import com.gestion.invoice.exception.ResourceNotFoundException;
import com.gestion.invoice.models.Presentation;
import com.gestion.invoice.repository.PresentationRepository;
import com.gestion.invoice.service.PresentationService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class PresentationServiceImpl implements PresentationService {

    private final PresentationRepository presentationRepository;

    public PresentationServiceImpl(PresentationRepository presentationRepository) {
        this.presentationRepository = presentationRepository;
    }

    @Override
    public Presentation findByNom(String nom) {
        return presentationRepository.findByNom(nom);
    }

    @Override
    public Presentation addPresentation(Presentation presentation) {
        System.out.println("Ajout d'une nouvelle présentation : " + presentation);
        return presentationRepository.save(presentation);
    }

    @Override
    public List<Presentation> allPresentation() {
        System.out.println("Chargement de toutes les présentations actives...");
        List<Presentation> list = presentationRepository.findByEtatTrue();
        System.out.println("Nombre de présentations trouvées : " + list.size());
        return list;
    }

    @Override
    public Presentation updatePresentation(Long id, Presentation present) {
        try {
            Presentation pres = presentationRepository.findByIdPresentation(id);


            System.out.println("Valeur actuelle : " + pres);
            System.out.println("Valeur reçue : " + present);

            pres.setNom(present.getNom());
            pres.setNombreParUnite(present.getNombreParUnite());

            return presentationRepository.save(pres);

        } catch (ResourceNotFoundException e) {
            System.err.println("❌ Erreur : " + e.getMessage());
            throw e;
        } catch (Exception e) {
            System.err.println("⚠️ Erreur inattendue lors de la mise à jour de la présentation ID " + id + " : " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Erreur interne lors de la mise à jour de la présentation", e);
        }
    }

    @Override
    public void deletePresentation(Long id) {
        try {
            System.out.println("Requête reçue pour suppression ID: " + id);

            Presentation existingPresentation = presentationRepository.findByIdPresentation(id);


            existingPresentation.setEtat(false); // suppression logique
            presentationRepository.save(existingPresentation);

            System.out.println("✅ Présentation ID " + id + " désactivée avec succès (soft delete).");

        } catch (ResourceNotFoundException e) {
            System.err.println("❌ Suppression impossible : " + e.getMessage());
            throw e;
        } catch (Exception e) {
            System.err.println("⚠️ Erreur inattendue lors de la suppression de la présentation ID " + id + " : " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Erreur interne lors de la suppression de la présentation", e);
        }
    }
}
