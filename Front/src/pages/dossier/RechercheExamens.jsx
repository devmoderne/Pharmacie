import React, { useState } from 'react';
import Apidesignations from '../../api/apiDesignation';

const RechercheExamen = ({ onChange }) => {
  const [keyword, setKeyword] = useState('');
  const [resultats, setResultats] = useState([]);
  const [examensSelectionnes, setExamensSelectionnes] = useState([]);

  // Rechercher les examens
  const handleSearch = async (e) => {
    const value = e.target.value;
    setKeyword(value);
    if (value.trim() !== '') {
      try {
        const examens = await Apidesignations.searchExamen(value);
        setResultats(examens);
      } catch (error) {
        console.error('Erreur lors de la recherche d’examens :', error);
      }
    } else {
      setResultats([]);
    }
  };

  // Ajouter à la sélection
  const handleSelect = (examen) => {
    if (!examensSelectionnes.some(e => e.id === examen.id)) {
      const newSelection = [...examensSelectionnes, examen];
      setExamensSelectionnes(newSelection);
      onChange?.(newSelection); // notification vers parent
    }
    setKeyword('');
    setResultats([]);
  };

  // Supprimer de la sélection
  const handleRemove = (id) => {
    const newList = examensSelectionnes.filter(e => e.id !== id);
    setExamensSelectionnes(newList);
    onChange?.(newList); // notification vers parent
  };

  return (
    <div className="bg-white shadow p-4 rounded-lg w-full">
      <h2 className="text-lg font-semibold text-black mb-2">🧪 Prescrire des examens</h2>

      <input
        type="text"
        placeholder="🔍 Rechercher un examen..."
        className="input input-bordered w-full mb-2"
        value={keyword}
        onChange={handleSearch}
      />

      {resultats.length > 0 && (
        <ul className="border rounded bg-white shadow max-h-40 overflow-y-auto">
          {resultats.map((examen) => (
            <li
              key={examen.id}
              onClick={() => handleSelect(examen)}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100"
            >
              {examen.nom}
            </li>
          ))}
        </ul>
      )}

      {/* Examens sélectionnés */}
      {examensSelectionnes.length > 0 && (
        <div className="mt-4 space-y-2">
          {examensSelectionnes.map((examen) => (
            <div key={examen.id} className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded">
              <span className="text-black font-medium">{examen.nom}</span>
              <button
                onClick={() => handleRemove(examen.id)}
                className="text-red-500 hover:text-red-700 font-bold text-lg"
                title="Supprimer"
              >
                ✖
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RechercheExamen;
