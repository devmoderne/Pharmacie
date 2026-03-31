import React, { useState } from 'react';
import ApiConsultations from '../../api/ApiConsultations'; // ton api consultation importée
import RecherchePatient from './Recherchepatients';
const Consultations = () => {
  const [diagnostic, setDiagnostic] = useState('');
  const [numConsultation, setNumConsultation] = useState(''); 
  const [patientSelectionne, setPatientSelectionne] = useState(null);

  // Nouveaux états pour constantes vitales
  const [poids, setPoids] = useState('');
  const [taille, setTaille] = useState('');
  const [temperature, setTemperature] = useState('');

  const creerConsultation = async () => {
    if (!patientSelectionne) {
      alert("Veuillez sélectionner un patient avant de créer la consultation.");
      return;
    }
    if (!diagnostic.trim()) {
      alert("Veuillez saisir un diagnostic avant de créer la consultation.");
      return;
    }
    if (!poids || !taille || !temperature) {
      alert("Veuillez saisir toutes les constantes vitales (poids, taille, température).");
      return;
    }

    try {
      const consultationVide = {
        diagnostic: diagnostic,
        patient: { id: patientSelectionne.id },
        date: new Date().toISOString(),
        poids: parseFloat(poids),
        taille: parseFloat(taille),
        temperature: parseFloat(temperature),
        etat: true,
        attente: true,
        cloturee: false,
      };

      const nouvelleConsultation = await ApiConsultations.addConsultation(consultationVide);
      setNumConsultation(nouvelleConsultation.numcons);
      alert("Consultation créée avec succès !");
    } catch (error) {
      console.error("Erreur lors de la création de la consultation :", error);
      alert("Erreur lors de la création de la consultation.");
    }
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Recherche Patient */}
        <div className="bg-white shadow p-4 rounded-lg w-full lg:w-1/3">
          <h2 className="text-lg font-bold text-black">🔍 Rechercher</h2>
          <RecherchePatient
            selectedPatient={patientSelectionne}
            onSelectPatient={setPatientSelectionne}
          />
        </div>

        {/* Constantes Vitales */}
        <div className="bg-white shadow p-4 rounded-lg w-full lg:w-1/4">
          <h2 className="text-lg font-bold text-black mb-4">📊 Constantes</h2>
          <div className="space-y-2">
            <div>
              <label className="block text-sm font-semibold text-black">⚖️ Poids (kg)</label>
              <input
                type="number"
                placeholder="70"
                className="input input-bordered w-full"
                value={poids}
                onChange={(e) => setPoids(e.target.value)}
                disabled={!!numConsultation}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-black">📏 Taille (cm)</label>
              <input
                type="number"
                placeholder="175"
                className="input input-bordered w-full"
                value={taille}
                onChange={(e) => setTaille(e.target.value)}
                disabled={!!numConsultation}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-black">🌡️ Temp (°C)</label>
              <input
                type="number"
                placeholder="36.5"
                className="input input-bordered w-full"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                disabled={!!numConsultation}
              />
            </div>
          </div>
        </div>

        {/* Diagnostic */}
        <div className="bg-white shadow p-4 rounded-lg w-full lg:w-2/5 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold text-black">📝 Diagnostic</h2>
            <div className="flex space-x-2 text-gray-600 text-xl">
              <span title="Note">🗒️</span>
              <span title="Historique">📚</span>
              <span title="Alerte">⚠️</span>
            </div>
          </div>

          {/* Numéro consultation */}
          <div className="mb-4">
            <label className="block font-semibold text-black mb-1">Numéro Consultation</label>
            <input
              type="text"
              value={numConsultation}
              disabled
              className="input input-bordered w-full bg-gray-100 cursor-not-allowed"
              placeholder="Le numéro s'affichera ici après création"
            />
          </div>

          <textarea
            rows={7}
            value={diagnostic}
            onChange={(e) => setDiagnostic(e.target.value)}
            className="textarea textarea-bordered resize-none w-full mb-4"
            placeholder="Écrire le diagnostic ici..."
            disabled={!!numConsultation}
          />

          <button
            onClick={creerConsultation}
            disabled={!!numConsultation}
            className={`btn btn-primary ${numConsultation ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Créer consultation
          </button>
        </div>
      </div>
    </>
  );
};

export default Consultations;
