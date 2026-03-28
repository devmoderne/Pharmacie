import React, { useEffect, useState } from 'react';
import {
  FaPlus, FaEdit, FaTrash, FaSearch, FaMoneyBill, FaProductHunt,
  FaSortNumericUp, FaSortNumericUpAlt, FaPercentage, FaAd,
  FaDownload, FaBookMedical, FaUserCircle, FaUserFriends,
  FaUserNurse, FaTable, FaArrowDown, FaMoneyCheckAlt,
  FaUserPlus, FaCaretSquareUp, FaSdCard, FaHandHoldingMedical,
  FaRegUserCircle, FaBarcode
} from 'react-icons/fa';
//import Paiement from "../components/Paiement";
 
import apitk from '../api/apitk';
import Apidetailsticket from '../api/Apidetailsticket';
import ErrorBoundary from '../components/ErrorBoundary';
import Apipatients from '../api/apiPatient';
import Apisociete from '../api/apiSociete';
import axios from 'axios';
import Apidesignations from '../api/apiDesignation';
import ApiMedecin from '../api/ApiMedecin';
//const API_URL = 'http://localhost:8080/api/tickets'; 
import axiosInstance from '../api/axiosInstance';


const Patients = () => {
  const [netAssurance, setNetAssurance] = useState(0);
  const [netPatient, setNetPatient] = useState(0);
  const [partAssurance, setPartAssurance] = useState(0);
  const [partPatient, setPartPatient] = useState(0);
  const [totalLigne, setTotalLigne] = useState(0);
  const [prix, setPrix] = useState(0);
  const [tk, setTk] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [Searchdesignation, setSearchdesignation] = useState('');
  const [isPourcentageDisabled, setIsPourcentageDisabled] = useState(true);
  const [details, setDetails] = useState([]);
  const [listeLignes, setListeLignes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [FilteredDesignation, setFilteredDesignation] = useState([]);
  const [patientsData, setPatientsData] = useState([]);
  const [societesdata, setSocietesData] = useState([]);
  const [DesignationData, setDesignationData] = useState([]);
  const [selectedDesignation, setSelectedDesignation] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
const [reductionAssurance, setReductionAssurance] = useState(0);
const [reductionPatient, setReductionPatient] = useState(0);
const [ttcAssurance, setTtcAssurance] = useState(0);
const [ttcPatient, setTtcPatient] = useState(0);
const [totalTTC, setTotalTTC] = useState(0);
const [isAssure, setIsAssure] = useState(false);
const [isPourcentageModifie, setIsPourcentageModifie] = useState(false);
const [patientLocked, setPatientLocked] = useState(false);
const [medecinData, setMedecinData] = useState([]);
const [remis, setRemis] = useState(0);
const [monnaieRendue, setMonnaieRendue] = useState(0);
const [netTotal, setNetTotal] = useState(0);
const [pdfUrl, setPdfUrl] = useState('');


const [loading, setLoading] = useState(false);
const [showModal, setShowModal] = useState(false);


  const [ligneData, setLigneData] = useState({
    designation_id: null,
    prix: 0,
    qte: 1,
    pourcentage: 0,
    medecin_id: null,
  });

  const [Patients, setPatients] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    sexe: '',
    dateNaissance: '',
    profession: '',
    ville: '',
    affilieSociete: false,
    societe_id: 0,
    matricule: '',
    police: '',
    sinistre: '',
    numeroAssurance: '',
  });

  const loadSociete = async () => {
    try {
      const data = await Apisociete.getSocietes();
      setSocietesData(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des sociétés :', error);
    }
  };

  const loadPatient = async () => {
    try {
      const data = await Apipatients.getpatients();  // Appel API pour récupérer les patients
      console.log('Données des patients reçues:', data);
      setPatientsData(data);  // Mettre à jour l'état des patients avec les données récupérées
    } catch (error) {
      console.error('Erreur lors de la récupération des patients :', error);
    }
  };
 const loadMedecins = async () => {
       try {
         const data = await ApiMedecin.getMedecins();
         setMedecinData(data);
       } catch (error) {
         console.error('Erreur lors du chargement des médecins :', error);
       }
      };

  const loaddesignation = async () => {
    try {
      const data = await Apidesignations.getDesignation();
      setDesignationData(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des désignations :', error);
    }
  };

  const loadLignesByTk = async (tkActuel) => {
    try {
      const tkClean = tkActuel?.trim();
      console.log("➡️ Ticket demandé :", tkClean);
  
      if (!tkClean) {
        console.warn("⛔ Ticket vide ou invalide, appel annulé.");
        return;
      }
  
      const response = await  axiosInstance.get(`/detailsticket/${tkClean}`);
      const lignes = response.data;
  
      console.log("Réponse brute de l'API :", lignes);
  
      if (!lignes || lignes.length === 0) {
        console.warn("⚠️ Aucune ligne de ticket trouvée pour :", tkClean);
        setListeLignes([]);
        setTotalLigne(0);
        setTtcAssurance(0);
        setTtcPatient(0);
        setNetPatient(0);
        setRemis(0);
        setMonnaieRendue(0);
        return;
      }
  
      // ✅ Calculs
      let totalTTC = 0;
      let totalAssurance = 0;
      let totalPatient = 0;
  
      lignes.forEach((ligne) => {
        const totalLigne = ligne.prix * ligne.qte;
        totalTTC += totalLigne;
        totalAssurance += ligne.partAssurance;
        totalPatient += ligne.partpatient;
      });
  
      setListeLignes(lignes);
      setTotalLigne(totalTTC);
      setTtcAssurance(totalAssurance);
      setTtcPatient(totalPatient);
  
      // 🎯 Application des réductions
      const assuranceApresReduction = totalAssurance * (1 - reductionAssurance / 100);
      const patientApresReduction = totalPatient * (1 - reductionPatient / 100);
  
      setNetPatient(Math.round(patientApresReduction));
      setRemis(0);
      setMonnaieRendue(0);
  
      console.log("🧮 Résumé : TTC =", totalTTC, "| Assurance =", totalAssurance, "| Patient =", totalPatient);
      console.log("🔻 Après réductions → Net Patient :", Math.round(patientApresReduction));
  
    } catch (error) {
      console.error("❌ Erreur lors de la récupération des lignes :", error);
    }
  };



  
  
  // Format de l'argent
  const formatMoney = (val) =>
    val?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " FCFA";

  useEffect(() => {
    const rendu = remis - netPatient;
    setMonnaieRendue(rendu > 0 ? rendu : 0);
  }, [remis, netPatient]);


 useEffect(() => {
  const assuranceApresReduction = ttcAssurance * (1 - reductionAssurance / 100);
  const patientApresReduction = ttcPatient * (1 - reductionPatient / 100);
  setNetPatient(Math.round(patientApresReduction));
}, [reductionAssurance, reductionPatient, ttcAssurance, ttcPatient]);

  useEffect(() => {
    setMonnaieRendue(remis - netPatient);
  }, [remis, netPatient]);
  const openModal = () => {
    setPatients({
      nom: '',
      prenom: '',
      telephone: '',
      sexe: '',
      dateNaissance: '',
      profession: '',
      ville: '',
      affilieSociete: false,
      societe_id: 0,
      matricule: '',
      police: '',
      sinistre: '',
      numeroAssurance: ''
    });
    setIsModalOpen(true);
    setSuccessMessage('');
    setErrorMessage('');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSuccessMessage('');
    setErrorMessage('');
  };
  

  useEffect(() => {
    loadSociete();
    loadPatient();
    loaddesignation();
    loadMedecins();
 
  }, []);
  useEffect(() => {
    console.log("patientsData reçu dans useEffect:", patientsData);
  
    if (searchTerm === '') {
      setFilteredPatients([]);
    } else {
      if (Array.isArray(patientsData)) {
        const results = patientsData.filter((patient) =>
          (patient.nom && patient.nom.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (patient.prenom && patient.prenom.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (patient.telephone && patient.telephone.includes(searchTerm))
        );
        setFilteredPatients(results);
      } else {
        console.error('patientsData n\'est pas un tableau:', patientsData);
        setFilteredPatients([]);
      }
    }
  }, [searchTerm, patientsData]);
  
  const [isGeneratingTk, setIsGeneratingTk] = useState(false);

  const handlePatientSelect = async (patient) => {
    // Si des lignes existent déjà, empêcher le changement de patient
    if (listeLignes.length > 0) {
      alert("Impossible de changer le patient après l'ajout de lignes.");
      return;
    }
  
    setSelectedPatient(patient);
    setSearchTerm('');
    setFilteredPatients([]);
  
    // Récupère l'ID du patient
    const patientId = patient.id;
    console.log("Patient sélectionné :", patientId);
  
    if (!tk && !isGeneratingTk) {
      setIsGeneratingTk(true);
      try {
        const newTk = await apitk.generateTk(patientId); // Passer patientId ici pour la génération du ticket
        setTk(newTk);
        await loadLignesByTk(newTk); // Charge les lignes avec le nouveau tk
      } catch (err) {
        alert("Erreur lors de la génération du ticket");
        setIsGeneratingTk(false);
        return;
      }
      setIsGeneratingTk(false);
    } else {
      // Si tk existe déjà, charge les lignes correspondantes
      await loadLignesByTk(tk);
    }
  };

  useEffect(() => {
    if (selectedPatient && selectedDesignation) {
      const prixFinal = selectedPatient.societe
        ? selectedDesignation.summerprices
        : selectedDesignation.privateprice;
  
      setPrix(prixFinal);
  
      setLigneData((prev) => ({
        ...prev,
        prix: prixFinal,
        // On applique 80% uniquement si non modifié manuellement et société existe
        pourcentage: !isPourcentageModifie && selectedPatient.societe
          ? 80
          : prev.pourcentage ?? 0,
      }));
    } else {
      setPrix(null);
      setLigneData((prev) => ({
        ...prev,
        prix: 0,
        pourcentage: 0,
      }));
    }
  }, [selectedPatient, selectedDesignation, isPourcentageModifie]);
  

  useEffect(() => {
    if (Searchdesignation === '') {
      setFilteredDesignation([]);
    } else {
      const results = DesignationData.filter((designation) =>
        designation.nom.toLowerCase().includes(Searchdesignation.toLowerCase())
      );
      setFilteredDesignation(results);
    }
  }, [Searchdesignation]);

  const handleDesignationSelect = (designation) => {
    const prixToApply = selectedPatient?.societe
      ? designation.summerprices
      : designation.privateprice;
  
    setSelectedDesignation(designation);
    setSearchdesignation(designation.nom);
    setFilteredDesignation([]);
  
    setLigneData((prev) => ({
      ...prev,
      designation_id: designation.id,
      prix: prixToApply,
      // On applique 80% uniquement si non modifié manuellement
      pourcentage:
        !isPourcentageModifie && selectedPatient?.societe
          ? 80
          : prev.pourcentage ?? 0,
    }));
  };
  const handleSave = async () => {
    try {
      if (Patients.affilieSociete && (Patients.societe_id === 0 || Patients.societe_id === "")) {
        setErrorMessage('La société doit être sélectionnée');
        return;
      }

      const patientData = {
        ...Patients,
        societe: Patients.affilieSociete ? { id: Patients.societe_id } : null,
      };

      const donneepatient = await Apipatients.addpatient(patientData);
      setPatientsData((prevData) => [...prevData, donneepatient]);
      alert('Ajoutée avec succès!');
      closeModal();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du patient :', error);
      alert('Une erreur est survenue lors de l\'ajout du patient');
    }
  };
  const handleAddLigne = async () => {
    const total = ligneData.qte * ligneData.prix;
  
    console.log("Total calculé : ", total);
  
    const pourcentageApplicable = selectedPatient?.societe ? ligneData.pourcentage : 0;
    const assurance = Math.round(total * (pourcentageApplicable / 100));
    const patient = total - assurance;
  
    const detail = {
      prix: ligneData.prix,
      qte: ligneData.qte,
      pourcentage: pourcentageApplicable,
      partAssurance: assurance,
      partpatient: patient,
      totalligne: total,
      tk: tk || '',
      prestation: {
        id: ligneData.designation_id ?? 0,
      },
      medecin: ligneData.medecin_id ? { id: ligneData.medecin_id } : null,
      annuler: 0,
      patient_id: selectedPatient.id,
    };
  
    try {
      console.log("Données envoyées à l'API details :", detail);
  
      // 🔄 Récupération des lignes existantes du ticket
      const response = await  axiosInstance.get(`/detailsticket/${tk}`);
      const lignesExistantes = response.data;
  
      const prestationExiste = lignesExistantes.find(
        (l) => l.prestation?.id === ligneData.designation_id
      );
  
      if (prestationExiste) {
        // ✅ Mise à jour : recalcul des nouvelles valeurs
        const nouvelleQte = prestationExiste.qte + ligneData.qte;
        const nouveauTotal = nouvelleQte * ligneData.prix;
        const nouvelleAssurance = Math.round(nouveauTotal * (pourcentageApplicable / 100));
        const nouveauPatient = nouveauTotal - nouvelleAssurance;
  
        console.log(`🔁 Mise à jour quantité pour la prestation avec id "${ligneData.designation_id}" :`);
        console.log(`Ancienne qte = ${prestationExiste.qte}, Ajout = ${ligneData.qte}, Total = ${nouvelleQte}`);
  
        // ✅ Appel API backend avec 3 paramètres
        await Apidetailsticket.updateQteByPrestationId(
          nouvelleQte,
          ligneData.designation_id,
          pourcentageApplicable
        );
  
        // Mise à jour locale pour l’affichage ou autres traitements si nécessaire
        detail.qte = nouvelleQte;
        detail.totalligne = nouveauTotal;
        detail.partAssurance = nouvelleAssurance;
        detail.partpatient = nouveauPatient;
  
      } else {
        // ➕ Ajouter une nouvelle ligne
        console.log(`➕ Nouvelle ligne pour la prestation avec id "${ligneData.designation_id}", qte = ${ligneData.qte}`);
        await Apidetailsticket.add(detail);
      }
  
      setSuccessMessage("Ligne traitée avec succès !");
      await loadLignesByTk(tk);
      resetForm();
  
    } catch (error) {
      console.error("❌ Erreur lors du traitement de la ligne :", error);
      setErrorMessage("Erreur lors du traitement de la ligne");
    }
  };
  
  
  
  const resetForm = () => {
    setPartAssurance(0);
    setPartPatient(0);
    setTotalLigne(0);
    setPrix(0);
    setLigneData({
      designation_id: null,
      prix: 0,
      qte: 1,
      pourcentage: selectedPatient?.societe ? 80 : 0,
      medecin_id: null,
    });
    setSearchdesignation(""); // Vide le champ de désignation
    setSelectedDesignation(null);
  };
  
  
  

  const handleDelete = async (id) => {
    try {
      // Annulation côté serveur
      await Apidetailsticket.annuler(id);
  
      // Mise à jour immédiate du tableau local : on retire la ligne
      const updatedLignes = listeLignes.filter(ligne => ligne.id !== id);
      setListeLignes(updatedLignes); // actualisation immédiate
  
      // Recalcul des totaux après suppression
      let totalTTC = 0;
      let totalAssurance = 0;
      let totalPatient = 0;
  
      const updatedDetails = updatedLignes.map((ligne) => {
        const totalLigne = ligne.prix * ligne.qte;
  
        // Calcul des parts d'assurance et du patient pour chaque ligne
        const partAssurance = totalLigne * (ligne.pourcentage / 100); // Exemple : pourcentage de réduction sur l'assurance
        const partpatient = totalLigne - partAssurance;
  
        // Mise à jour des détails de la ligne avec calculs
        return {
          ...ligne,
          totalligne: totalLigne,
          partAssurance: partAssurance,
          partpatient: partpatient,
        };
      });
  
      // Recalcul des totaux après mise à jour des lignes
      updatedDetails.forEach((ligne) => {
        totalTTC += ligne.totalligne;
        totalAssurance += ligne.partAssurance;
        totalPatient += ligne.partpatient;
      });
  
      // Mise à jour des totaux
      setTotalLigne(totalTTC);
      setTtcAssurance(totalAssurance);
      setTtcPatient(totalPatient);
  
      // Application des réductions si elles existent
      const assuranceApresReduction = totalAssurance * (1 - reductionAssurance / 100);
      const patientApresReduction = totalPatient * (1 - reductionPatient / 100);
  
      // Mise à jour de la valeur "Net Patient" après réduction
      setNetPatient(Math.round(patientApresReduction));
  
      // Mise à jour des détails des lignes après suppression et recalculs
      setListeLignes(updatedDetails);
      
    } catch (error) {
      console.error("Erreur lors de l'annulation :", error);
    }
  };
  
  
  
  const handleValidation = async () => {
    try {
      setLoading(true);
      await Apidetailsticket.valider(tk); // ✅ Valide le ticket côté backend
      alert('Ticket validé !');
  
      const currentTk = tk; // ✅ on sauvegarde l'ancien tk AVANT le reset
  
      setListeLignes([]);
      setTk('');
      setTotalTTC('');
      setTtcAssurance('');
      setSelectedPatient(null);
      setSuccessMessage('');
      setErrorMessage('');
      
      // Utiliser le bon tk pour générer le PDF
      const response = await axiosInstance.get(`/pdf/${currentTk}`, {
        responseType: 'blob'
      });
  
      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      setPdfUrl(pdfUrl);
      setShowModal(true);  // ✅ Ouvre la modale
    } catch (error) {
      alert('Erreur lors de la validation');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  

  useEffect(() => {
    const totalNetAssurance = listeLignes
      .filter((l) => l.annuler !== 1)
      .reduce((acc, ligne) => acc + ligne.netAssurance, 0);
  
    const totalNetPatient = listeLignes
      .filter((l) => l.annuler !== 1)
      .reduce((acc, ligne) => acc + ligne.netPatient, 0);
  
    const totalNet = totalNetAssurance + totalNetPatient;
  
    setNetAssurance(totalNetAssurance);
    setNetPatient(totalNetPatient);

    setNetTotal(totalNet);
  }, [listeLignes]);
 

  useEffect(() => {
    if (selectedPatient?.societe && selectedDesignation && !isPourcentageModifie) {
      setLigneData((prev) => ({
        ...prev,
        pourcentage: 80,
      }));
    } else if (!selectedPatient?.societe && !isPourcentageModifie) {
      setLigneData((prev) => ({
        ...prev,
        pourcentage: 0,
      }));
    }
  }, [selectedPatient, selectedDesignation, isPourcentageModifie]);

  useEffect(() => {
    const patientSansReduction = ttcPatient;
    const patientAvecReduction = patientSansReduction * (1 - reductionPatient / 100);
    setNetPatient(Math.round(patientAvecReduction));
  }, [ttcPatient, reductionPatient]);
  

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div>
      {successMessage && (
        <div className="bg-green-200 text-green-800 p-2 rounded-md mb-4">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="bg-red-200 text-red-800 p-2 rounded-md mb-4">
          {errorMessage}
        </div>
      )}
      </div>
     <div className="flex justify-between items-center mb-2">
  
  {isGeneratingTk && <div className="loading-message">Génération du ticket en cours...</div>}
  
  <div className="flex space-x-4">
    {/* Search Input */}
    <div className="relative mb-4">
      <input
        type="text"
        className="p-2 pl-10 border rounded-md w-full"
        placeholder="Rechercher..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
    </div>

    {filteredPatients.length > 0 && (
  <div className="absolute mt-10 w-80 border rounded-md bg-white shadow-lg z-50 max-h-60 overflow-y-auto">
    {filteredPatients.map((patient) => (
      <div
        key={patient.id}
        className={`cursor-pointer p-2 flex justify-between ${
          listeLignes.length > 0 ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-200'
        }`}
        onClick={() => {
          if (listeLignes.length > 0) {
            alert("Impossible de changer le patient après l'ajout de lignes.");
            return;
          }
          handlePatientSelect(patient);
        }}
      >
        <span>{patient.nom} {patient.prenom}</span>
        <span>{patient.telephone}</span>
      </div>
    ))}
  </div>
)}

    
    <button
      onClick={openModal}
      className="btn btn-primary flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
    >
      <FaUserPlus />
    </button>
  </div>
</div>

     <div className='row mb-2'>
          

           <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-4">
           <div className="w-full col-span-1 -mt-4">
  <div className="card bg-gradient-to-br from-blue-200 via-blue-100 to-white p-3 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out h-auto">
    <div className="flex items-center space-x-4 mb-3">
      <div className="text-blue-600 text-4xl">
        <FaRegUserCircle />
      </div>
      <div>
        <h3 className="text-md font-semibold text-gray-800">
          {selectedPatient ? `${selectedPatient.nom} ${selectedPatient.prenom}` : "Patient non sélectionné"}
        </h3>
        <p className="text-sm text-gray-600">
          {selectedPatient?.profession || "Profession non renseignée"}
        </p>
      </div>
    </div>

    {selectedPatient ? (
      <div className="text-sm text-gray-700 space-y-1">
        <div>
          <span className="font-semibold">Téléphone:</span> {selectedPatient.telephone}
        </div>
        <div>
          <span className="font-semibold">Sexe:</span> {selectedPatient.sexe}
        </div>
        <div>
          <span className="font-semibold">Date de naissance:</span> {selectedPatient.dateNaissance}
        </div>
        <div>
          <span className="font-semibold">Ville:</span> {selectedPatient.ville || "Non renseignée"}
        </div>
        <div>
          <span className="font-semibold">Société:</span>{" "}
          {selectedPatient.societe ? selectedPatient.societe.nom : <span className="italic text-gray-400">Non renseignée</span>}
        </div>
        <div>
          <span className="font-semibold">Assurance:</span>{" "}
          {selectedPatient.societe?.assurance?.nom ? selectedPatient.societe.assurance.nom : <span className="italic text-gray-400">Non renseignée</span>}
        </div>
      </div>
    ) : (
      <div className="text-center text-gray-400 italic mt-2">Aucun patient sélectionné</div>
    )}
  </div>
</div>


<div className="w-full lg:col-span-2 -mt-2">
  <div className="card bg-cyan-400 bg-cover bg-center p-3 rounded-lg shadow-md hover:shadow-xl transition duration-300 ease-in-out h-auto">
     
  
    {tk ? (
      <div className="flex items-center space-x-2 mb-3 text-sm font-semibold text-white">
        <span>Ticket en cours :</span>
        <input
          type="text"
          value={tk}
          readOnly
          className="bg-white text-blue-900 px-2 py-1 rounded shadow text-sm font-semibold"
          style={{ width: '160px' }}
        />
      </div>
    ) : (
      <div className="mt-2 mb-3 text-yellow-200 text-sm italic">
        Aucun ticket en cours
      </div>
    )}

   
    <div className="flex space-x-3 mb-2">
      {/* Désignation - 3/4 */}
      <div className="relative w-3/4">
        <input
          type="text"
          className="input input-bordered w-full pl-10 py-1.5 text-sm"
          placeholder="Désignation..."
          value={Searchdesignation}
          onChange={(e) => setSearchdesignation(e.target.value)}
        />
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />

        {FilteredDesignation.length > 0 && (
          <div className="absolute z-50 mt-1 w-full bg-white border shadow max-h-48 overflow-y-auto rounded-md text-sm">
            {FilteredDesignation.map((designation) => {
              const pricePrivate = designation.privateprice;
              const priceSummer = designation.summerprices;
              return (
                <div
                  key={designation.id}
                  className="p-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                  onMouseDown={() => handleDesignationSelect(designation)}
                >
                  <span>
                    {designation.nom.includes(Searchdesignation) ? (
                      <>
                        {designation.nom
                          .split(new RegExp(`(${Searchdesignation})`, 'gi'))
                          .map((part, i) =>
                            part.toLowerCase() === Searchdesignation.toLowerCase() ? (
                              <span key={i} className="bg-yellow-200">{part}</span>
                            ) : (
                              part
                            )
                          )}
                      </>
                    ) : designation.nom}
                  </span>

                  <span className="text-xs text-gray-500">
                    Privé: {pricePrivate} FCFA | Soc: {priceSummer} FCFA
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pourcentage - 1/4 */}
      <div className="w-1/4">
      <select
  className="select select-bordered w-full py-1.5 text-sm"
  value={ligneData.pourcentage}
  onChange={(e) => {
    setLigneData((prev) => ({
      ...prev,
      pourcentage: selectedPatient?.societe
        ? parseInt(e.target.value, 10)
        : 0,
    }));
    setIsPourcentageModifie(true); // L'utilisateur a aussi modifié manuellement ici
  }}
  disabled={!selectedPatient?.societe}
>
  {selectedPatient?.societe ? (
    [...Array(9)].map((_, i) => {
      const val = 60 + i * 5;
      return (
        <option key={val} value={val}>{val}%</option>
      );
    })
  ) : (
    <option value={0}>0%</option>
  )}
</select>



</div>
    </div>


    <div className="grid grid-cols-2 gap-3 mb-2">
      <input
        type="text"
        className="input input-bordered w-full bg-gray-100 py-1.5 text-sm"
        value={
          ligneData.prix && selectedPatient
            ? `${ligneData.prix} FCFA`
            : ''
        }
        readOnly
        placeholder="Prix"
      />

      <input
        type="number"
        min="1"
        className="input input-bordered w-full py-1.5 text-sm"
        value={ligneData.qte}
        onChange={(e) =>
          setLigneData((prev) => ({
            ...prev,
            qte: parseInt(e.target.value, 10),
          }))
        }
        placeholder="Quantité"
      />
    </div>

    {ligneData.qte && ligneData.prix && (
      <div className="flex justify-between items-center text-sm font-semibold my-2 flex-wrap gap-2">
        {/** Total */}
        <span className="text-green-700 bg-green-100 px-2 py-1 rounded-md">
          Total : {ligneData.qte * ligneData.prix} FCFA
        </span>
    
        {/** Assurance — toujours affiché même si 0 */}
        <span className="text-purple-700 bg-purple-100 px-2 py-1 rounded-md">
          Assurance : {Math.round(ligneData.qte * ligneData.prix * (ligneData.pourcentage / 100))} FCFA
        </span>
    
        {/** Patient — toujours affiché */}
        <span className="text-red-700 bg-blue-100 px-2 py-1 rounded-md">
          Patient : {Math.round(
            ligneData.qte * ligneData.prix -
            ligneData.qte * ligneData.prix * (ligneData.pourcentage / 100)
          )} FCFA
        </span>
      </div>
    )}
 
 <div className="mb-3">
  <select
    className="select select-bordered w-full py-1.5 text-sm"
    value={ligneData.medecin_id || ''}
    onChange={(e) =>
      setLigneData((prev) => ({
        ...prev,
        medecin_id: e.target.value ? parseInt(e.target.value, 10) : null,
      }))
    }
  >
    <option value="">-- Sélectionner un médecin --</option>

    {medecinData.map((med) => (
      <option key={med.id} value={med.id}>
        Dr {med.nom} {med.prenom}
      </option>
    ))}
  </select>
</div>


    <div className="text-center">
      <button
        className="btn btn-success btn-sm px-4 py-2 text-white flex items-center justify-center space-x-2"
        onClick={handleAddLigne}
      >
        <FaPlus /> <span>Ajouter</span>
      </button>
    </div>

  </div>
</div>

           </div>
           </div>
           <div className='row mt-2'>
            
 <div className="grid grid-cols-4 md:grid-cols-2 lg:grid-cols-4 gap-4">
 <div className="card bg-cover bg-center bg-cyan-100 col-span-3 p-4 h-auto rounded-lg shadow-md hover:shadow-xl transition duration-300 ease-in-out">
  {/* Tableau principal des lignes */}
  <div className="overflow-x-auto bg-white shadow-md rounded-lg">
  <table className="min-w-full table-auto text-xs"> {/* ← police réduite ici */}
    <thead>
      <tr className="bg-gray-200 text-xs"> {/* ← en-tête plus petit aussi */}
        <th className="py-2 px-3 text-left font-semibold text-gray-700">Nom</th>
        <th className="py-2 px-3 text-left font-semibold text-gray-700">Prix</th>
        <th className="py-2 px-3 text-left font-semibold text-gray-700">Quantité</th>
        <th className="py-2 px-3 text-left font-semibold text-gray-700">Assurance</th>
        <th className="py-2 px-3 text-left font-semibold text-gray-700">Patient</th>
        <th className="py-2 px-3 text-left font-semibold text-gray-700">Total</th>
        <th className="py-2 px-3 text-left font-semibold text-gray-700">Médecin</th>
        <th className="py-2 px-3 text-center font-semibold text-gray-700">Actions</th>
      </tr>
    </thead>
    <tbody>
      {listeLignes.map((ligne, index) => (
        <tr key={index} className="border-b hover:bg-gray-50">
          <td className="py-2 px-3 text-gray-800 uppercase">{ligne.prestation?.nom}</td>
          <td className="py-2 px-3 text-gray-600">{ligne.prix}</td>
          <td className="py-2 px-3 text-gray-600">{ligne.qte}</td>
          <td className="py-2 px-3 text-gray-600">{ligne.partAssurance}</td>
          <td className="py-2 px-3 text-gray-600">{ligne.partpatient}</td>
          <td className="py-2 px-3 text-gray-600">{ligne.totalligne}</td>
          <td className="py-2 px-3 text-gray-700 font-medium whitespace-nowrap">
            {ligne.medecin ? `Dr ${ligne.medecin.nom} ${ligne.medecin.prenom}` : 'N/A'}
          </td>
          <td className="py-2 px-3 text-gray-600 flex space-x-2 justify-center">
            <button
              className="text-red-500 hover:text-red-700"
              onClick={() => handleDelete(ligne.id)}
            >
              <FaTrash />
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>



</div>

  {/* Résumé / Récapitulatif sans table */}
  <div className="mt-4 col-span-1">
  <div className="bg-white border border-gray-200 rounded-md p-3 shadow-sm w-full max-w-sm text-[11px]">
    <div className="grid grid-cols-2 gap-2">
      <div>
        <label className="block text-gray-500 mb-1">TTC</label>
        <input 
          className="input input-bordered input-xs w-full" 
          value={formatMoney(ttcAssurance +ttcPatient)}
          readOnly 
        />
      </div>

      <div></div>

      <div>
        <label className="block text-gray-500 mb-1">TTC Assu</label>
        <input 
          className="input input-bordered input-xs w-full" 
          value={formatMoney(ttcAssurance)} 
          readOnly 
        />
      </div>

      <div className="bg-yellow-50 border border-yellow-100 rounded-md p-1">
        <label className="block text-gray-700 mb-1 font-semibold">TTC Pat</label>
        <input 
          className="input input-bordered input-xs w-full bg-yellow-100 text-yellow-900 font-medium" 
          value={formatMoney(ttcPatient)} 
          readOnly 
        />
      </div>

      <div>
        <label className="block text-gray-500 mb-1 text-xs">Réduct Assu</label>
        <select
          className="select select-bordered w-full h-7 text-xs"
          onChange={(e) => setReductionAssurance(Number(e.target.value))}
        >
          {[...Array(101)].map((_, i) => (
            <option key={i} value={i}>{i}%</option>
          ))}
        </select>
      </div>

      <div className="bg-yellow-50 border border-yellow-100 rounded-md p-1">
        <label className="block text-gray-700 mb-1 font-semibold text-xs">Réduct Pat</label>
        <select
  className="select select-bordered w-full h-7 text-xs bg-yellow-100 text-yellow-900"
  value={reductionPatient} // 👈 Important
  onChange={(e) => setReductionPatient(Number(e.target.value))}
>
  {[...Array(101)].map((_, i) => (
    <option key={i} value={i}>{i}%</option>
  ))}
</select>

      </div>
    </div>

    {/* NET PATIENT - ZONE ROUGE */}
    <div className="bg-red-50 border border-red-200 rounded-md p-2 mt-2 flex items-center space-x-2">
      <i className="fas fa-wallet text-red-600 text-sm ml-1"></i>
      <div className="w-full">
        <label className="block text-red-700 mb-1 font-semibold text-xs">Net Patient</label>
        <input
          className="input input-bordered input-xs w-full bg-red-100 text-red-800 font-semibold"
          value={formatMoney(netPatient)}
          readOnly
        />
      </div>
    </div>

   {/* REMIS - ZONE VERTE CLAIRE (SAISIE UTILISATEUR) */}
<div className="bg-green-50 border border-green-300 rounded-md p-2 mt-2 shadow-sm hover:shadow-md transition flex items-center space-x-2">
<i className="fas fa-hand-holding-usd text-green-700 text-base ml-1"></i>
<div className="w-full">
  <label className="block text-green-800 mb-1 font-semibold text-xs">Remis</label>
  <input
    type="text"
    className="input input-bordered input-xs w-full bg-green-100 text-green-900 font-semibold"
    value={remis === 0 ? '' : formatMoney(remis)}
    onChange={(e) => {
      const raw = e.target.value.replace(/\s/g, '').replace(/[^\d]/g, '');
      setRemis(Number(raw));
    }}
  />
</div>
</div>

{/* MONNAIE RENDUE - ZONE FERMÉE / LECTURE SEULE */}
<div className="bg-green-100 border border-green-400 rounded-md p-2 mt-2 flex items-center space-x-2">
<i className="fas fa-coins text-green-800 text-base ml-1"></i>
<div className="w-full">
  <label className="block text-green-900 mb-1 font-bold text-xs">Monnaie Rendue <span className="text-[10px] bg-green-600 text-white rounded px-1 ml-1">auto</span></label>
  <input
    className="input input-xs w-full bg-green-200 text-green-950 font-bold cursor-not-allowed"
    value={monnaieRendue > 0 ? formatMoney(monnaieRendue) : '0 FCFA'}
    readOnly
  />
</div>
</div>


 {/* Bouton Valider */}
<div className="text-right mt-3">

  <button
    className="btn btn-primary btn-sm"
    onClick={handleValidation}
  >
    Valider le ticket
  </button>
</div>
{/** modal impression */}
{showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-3xl w-full p-6 relative animate-fade-in">
            <h2 className="text-2xl font-semibold mb-4 text-center">Aperçu du Ticket PDF</h2>

            <iframe
              src={pdfUrl}
              title="Aperçu PDF"
              className="w-full h-[70vh] border rounded"
            ></iframe>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}


{/* Modal */}
<div>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
    {isModalOpen && (
      <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" aria-labelledby="modalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="modalLabel">Ajouter Patients</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={closeModal}
              ></button>
            </div>
            <div className="modal-body">
              {/* Formulaire d'ajout de patient */}
              <div>
                {/* Colonne 1 - Informations de base */}
                <div>
                  <div className="flex gap-4 mb-4">
                    <div className="w-full sm:w-1/2">
                      <label className="block text-gray-700 mb-2 text-sm">Nom</label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded-md text-sm"
                        value={Patients.nom}
                        onChange={(e) => setPatients({ ...Patients, nom: e.target.value })}
                        required
                      />
                    </div>
                    <div className="w-full sm:w-1/2">
                      <label className="block text-gray-700 mb-2 text-sm">Prénom</label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded-md text-sm"
                        value={Patients.prenom}
                        onChange={(e) => setPatients({ ...Patients, prenom: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  {/* Téléphone et Sexe */}
                  <div className="grid grid-cols-3 gap-4 mb-2">
                    <div className="w-full col-span-1">
                      <label className="block text-gray-700 mb-2 text-sm">Sexe</label>
                      <select
                        className="w-full p-2 border rounded-md text-sm"
                        value={Patients.sexe}
                        onChange={(e) => setPatients({ ...Patients, sexe: e.target.value })}
                      >
                        <option value="Homme">Homme</option>
                        <option value="Femme">Femme</option>
                      </select>
                    </div>
                    <div className="w-full col-span-1">
                      <label className="block text-gray-700 mb-2 text-sm">Téléphone</label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded-md text-sm"
                        value={Patients.telephone}
                        onChange={(e) => setPatients({ ...Patients, telephone: e.target.value })}
                        required
                      />
                    </div>
                    <div className="w-full col-span-1">
                      <label className="block text-gray-700 mb-2 text-sm">Date de naissance</label>
                      <input
                        type="date"
                        className="w-full p-2 border rounded-md text-sm"
                        value={Patients.dateNaissance}
                        onChange={(e) => setPatients({ ...Patients, dateNaissance: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Colonne 2 - Affiliation à une société et autres informations */}
                <div>
                  <div className="flex gap-4 mb-1">
                    <input
                      type="checkbox"
                      className="scale-75"
                      checked={Patients.affilieSociete}
                      onChange={(e) => setPatients({ ...Patients, affilieSociete: e.target.checked })}
                    />
                    <label className="block text-gray-700 mb-2 text-sm">Affilier à une société</label>
                  </div>

                  {/* Informations supplémentaires d'assurance */}
                  {Patients.affilieSociete && (
                    <>
                      <div className="grid grid-cols-3 gap-4 mb-2">
                        <div className="w-full col-span-2 mb-4">
                          <label className="block text-gray-700 mb-2 text-sm">Société</label>
                          <select
                            className="w-full p-2 border rounded-md text-sm"
                            value={Patients.societe_id}
                            onChange={(e) => setPatients({ ...Patients, societe_id: e.target.value })}
                          >
                            <option value="">Sélectionner une société</option>
                            {societesdata && societesdata.map((societe) => (
                              <option key={societe.id} value={societe.id}>
                                {societe.nom}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="w-full col-span-1">
                          <label className="block text-gray-700 mb-2 text-sm">Police</label>
                          <input
                            type="text"
                            className="w-full p-2 border rounded-md text-sm"
                            value={Patients.police}
                            onChange={(e) => setPatients({ ...Patients, police: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mb-2">
                        <div className="w-full col-span-1">
                          <label className="block text-gray-700 mb-2 text-sm">Sinistre</label>
                          <input
                            type="text"
                            className="w-full p-2 border rounded-md text-sm"
                            value={Patients.sinistre}
                            onChange={(e) => setPatients({ ...Patients, sinistre: e.target.value })}
                          />
                        </div>
                        <div className="w-full col-span-1">
                          <label className="block text-gray-700 mb-2 text-sm">Numéro d'Assurance</label>
                          <input
                            type="text"
                            className="w-full p-2 border rounded-md text-sm"
                            value={Patients.numeroAssurance}
                            onChange={(e) => setPatients({ ...Patients, numeroAssurance: e.target.value })}
                          />
                        </div>
                        <div className="w-full col-span-1">
                          <label className="block text-gray-700 mb-2 text-sm">Matricule</label>
                          <input
                            type="text"
                            className="w-full p-2 border rounded-md text-sm"
                            value={Patients.matricule}
                            onChange={(e) => setPatients({ ...Patients, matricule: e.target.value })}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="modal-footer">
              <button
                onClick={closeModal}
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                className="btn btn-primary"
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
</div>
</div>
</div>
</div>
</div>
</div>

      
  );
};

export default Patients;
