import React, { useState, useEffect } from "react";
import { FaCashRegister } from "react-icons/fa";
import ApiAuth from "../api/apiauth";
import Apisynthese from "../api/Apisynthese";
import RecapitulatifCaisseModal from "./RecapitulatifCaisseModal";

const Comptabilites = () => {
  const [formData, setFormData] = useState({
    dateDebutCaisse: "",
    dateFinCaisse: "",
    userId: "",
  });

  const [usersData, setUsersData] = useState([]);
  const [dataRecap, setDataRecap] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [noResult, setNoResult] = useState(false);

  useEffect(() => {
    console.log("Chargement initial du composant Comptabilites...");
    loadUsers();
    fetchCurrentUser();
  }, []);

  const loadUsers = async () => {
    try {
      console.log("Tentative de récupération des utilisateurs...");
      const response = await ApiAuth.getAllUsers();
      console.log("Réponse ApiAuth.getAllUsers:", response);

      const usersArray = Array.isArray(response) ? response : response.users;
      if (!Array.isArray(usersArray)) {
        throw new Error("Format des utilisateurs invalide.");
      }
      setUsersData(usersArray);
      console.log("Utilisateurs chargés avec succès :", usersArray);
    } catch (error) {
      console.error("Erreur lors du chargement des utilisateurs :", error);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      console.log("Récupération de l'utilisateur courant...");
      const user = await ApiAuth.getCurrentUser();
      console.log("Utilisateur courant :", user);
      setCurrentUser(user);
    } catch (error) {
      console.error("Erreur récupération utilisateur actif :", error);
    }
  };

  const handleChange = (e) => {
    console.log(`Changement dans le champ ${e.target.name} :`, e.target.value);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenerate = async () => {
    const debut = formData.dateDebutCaisse;
    const fin = formData.dateFinCaisse;
    const userId = formData.userId;

    console.log("Début génération des données avec :");
    console.log("Date début :", debut);
    console.log("Date fin :", fin);
    console.log("Utilisateur sélectionné :", userId);

    setLoading(true);
    try {
      const recap = await Apisynthese.getSyntheseParUtilisateur(userId, debut, fin);
      console.log("Données récupérées depuis Apisynthese :", recap);

      if (recap && recap.length > 0) {
        setDataRecap(recap);
        setNoResult(false);
        setShowModal(true);
        console.log("Affichage du modal avec les données.");
      } else {
        setNoResult(true);
        setDataRecap([]);
        setShowModal(false);
        console.warn("Aucun résultat trouvé pour cette période.");
      }
    } catch (err) {
      console.error("Erreur lors de la récupération des données :", err);
      setNoResult(true);
      setDataRecap([]);
      setShowModal(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-base-100 rounded-lg shadow space-y-8">
      <h2 className="text-xl font-bold mb-6">Module de Comptabilité Générale</h2>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
          1. Récapitulatif Caisse <FaCashRegister />
        </h3>

        <div className="flex flex-wrap gap-4 items-end">
          <div className="form-control w-full md:w-1/4">
            <label className="label">Utilisateur</label>
            <select
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              className="select select-bordered"
              required
            >
              <option value="">-- Sélectionnez un utilisateur --</option>
              {Array.isArray(usersData) &&
                usersData.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.nom}
                  </option>
                ))}
            </select>
          </div>

          <div className="form-control w-full md:w-1/4">
            <label className="label">Date Début</label>
            <input
              type="datetime-local"
              name="dateDebutCaisse"
              value={formData.dateDebutCaisse}
              onChange={handleChange}
              className="input input-bordered"
              required
            />
          </div>

          <div className="form-control w-full md:w-1/4">
            <label className="label">Date Fin</label>
            <input
              type="datetime-local"
              name="dateFinCaisse"
              value={formData.dateFinCaisse}
              onChange={handleChange}
              className="input input-bordered"
              required
            />
          </div>

          <div className="form-control">
            <button onClick={handleGenerate} className="btn btn-primary" disabled={loading}>
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Générer"
              )}
            </button>
          </div>
        </div>

        {noResult && (
          <div className="text-warning mt-2">
            Aucun résultat trouvé pour cette période.
          </div>
        )}
      </div>

      {showModal && (
        <RecapitulatifCaisseModal
          isOpen={showModal}
          onRequestClose={() => setShowModal(false)}
          data={dataRecap}
          periode={{
            startDate: formData.dateDebutCaisse,
            endDate: formData.dateFinCaisse,
          }}
          printedBy={currentUser?.nom || "Utilisateur inconnu"}
        />
      )}
    </div>
  );
};

export default Comptabilites;
