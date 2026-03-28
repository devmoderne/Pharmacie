import React, { useState } from 'react';
import Apipatients from "../../api/apiPatient";

const RecherchePatient = ({ selectedPatient, onSelectPatient }) => {
  const [keyword, setKeyword] = useState('');
  const [resultats, setResultats] = useState([]);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setKeyword(value);

    if (value.length >= 2) {
      try {
        const patients = await Apipatients.searchPatients(value);
        setResultats(patients);
      } catch (error) {
        console.error("Erreur lors de la recherche :", error);
      }
    } else {
      setResultats([]);
    }
  };

  const handleSelect = (patient) => {
    onSelectPatient(patient);  // remonte la sélection au parent
    setKeyword('');
    setResultats([]);
  };

  return (
    <div className="max-w-3xl mx-auto mt-2 p-4">
      {/* Champ de recherche */}
      <input
        type="text"
        placeholder="🔍 Rechercher un patient (nom, prénom, téléphone...)"
        className="input input-bordered w-full mb-2"
        value={keyword}
        onChange={handleSearch}
        disabled={!!selectedPatient}  // désactive si un patient est sélectionné
      />

      {/* Résultats */}
      {resultats.length > 0 && (
        <ul className="border rounded bg-white shadow max-h-60 overflow-y-auto mb-4">
          {resultats.map((patient) => (
            <li
              key={patient.id}
              onClick={() => handleSelect(patient)}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100"
            >
              {patient.nom} {patient.prenom} — {patient.telephone}
            </li>
          ))}
        </ul>
      )}

      {/* Carte du patient sélectionné */}
      {selectedPatient && (
        <div className="p-5 border rounded-lg shadow bg-white">
          <h2 className="text-xl font-bold text-blue-700 mb-2">👤 Patient</h2>
          <p><strong>Nom :</strong> {selectedPatient.nom}</p>
          <p><strong>Prénom :</strong> {selectedPatient.prenom}</p>
          <p><strong>Sexe :</strong> {selectedPatient.sexe}</p>
          <p><strong>Date  :</strong> {selectedPatient.dateNaissance}</p>
          <p><strong>Téléphone :</strong> {selectedPatient.telephone}</p>
          <p><strong>Ville :</strong> {selectedPatient.ville}</p>
          {selectedPatient.numeroAssurance && (
            <p><strong>N° Assurance :</strong> {selectedPatient.numeroAssurance}</p>
          )}
          {/* Bouton pour réinitialiser la sélection */}
          <button
            className="btn btn-sm btn-warning mt-4"
            onClick={() => onSelectPatient(null)}
          >
            Changer de patient
          </button>
        </div>
      )}
    </div>
  );
};

export default RecherchePatient;
