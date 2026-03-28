import React, { useState } from 'react';
import Apidesignations from '../../api/apiDesignation';

const RechercheMedicament = ({ onChange }) => {
  const [keyword, setKeyword] = useState('');
  const [resultats, setResultats] = useState([]);
  const [medicamentsSelectionnes, setMedicamentsSelectionnes] = useState([]);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setKeyword(value);
    if (value.trim() !== '') {
      try {
        const meds = await Apidesignations.searchMedicament(value);
        setResultats(meds);
      } catch (error) {
        console.error('Erreur lors de la recherche des médicaments :', error);
      }
    } else {
      setResultats([]);
    }
  };

  const handleSelect = (med) => {
    if (!medicamentsSelectionnes.some(m => m.id === med.id)) {
      const newSelection = [
        ...medicamentsSelectionnes,
        { ...med, quantite: 1, posologie: '' }
      ];
      setMedicamentsSelectionnes(newSelection);
      onChange?.(newSelection);
    }
    setKeyword('');
    setResultats([]);
  };

  const handleRemove = (id) => {
    const newList = medicamentsSelectionnes.filter(m => m.id !== id);
    setMedicamentsSelectionnes(newList);
    onChange?.(newList);
  };

  const handleFieldChange = (id, field, value) => {
    const newList = medicamentsSelectionnes.map((m) =>
      m.id === id ? { ...m, [field]: field === 'quantite' ? parseInt(value) || 1 : value } : m
    );
    setMedicamentsSelectionnes(newList);
    onChange?.(newList);
  };

  return (
    <div className="bg-white shadow p-4 rounded-lg w-full">
      <h2 className="text-lg font-semibold text-black mb-2">💊 Prescrire des médicaments</h2>

      <input
        type="text"
        placeholder="🔍 Rechercher un médicament..."
        className="input input-bordered w-full mb-2"
        value={keyword}
        onChange={handleSearch}
      />

      {resultats.length > 0 && (
        <ul className="border rounded bg-white shadow max-h-40 overflow-y-auto">
          {resultats.map((med) => (
            <li
              key={med.id}
              onClick={() => handleSelect(med)}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100"
            >
              {med.nom}
            </li>
          ))}
        </ul>
      )}

      {medicamentsSelectionnes.length > 0 && (
        <div className="mt-4 space-y-4">
          {medicamentsSelectionnes.map((med) => (
            <div
              key={med.id}
              className="bg-gray-100 px-4 py-3 rounded flex flex-col md:flex-row md:items-center justify-between gap-2"
            >
              <div className="flex-1">
                <span className="font-medium text-black block">{med.nom}</span>
                <div className="flex gap-2 mt-2">
                  <input
                    type="number"
                    min="1"
                    className="input input-sm w-20"
                    value={med.quantite}
                    onChange={(e) => handleFieldChange(med.id, 'quantite', e.target.value)}
                    placeholder="Quantité"
                  />
                  <input
                    type="text"
                    className="input input-sm w-full"
                    value={med.posologie}
                    onChange={(e) => handleFieldChange(med.id, 'posologie', e.target.value)}
                    placeholder="Posologie (ex: 2x/jour)"
                  />
                </div>
              </div>

              <button
                onClick={() => handleRemove(med.id)}
                className="text-red-500 hover:text-red-700 font-bold text-lg self-start md:self-center"
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

export default RechercheMedicament;
