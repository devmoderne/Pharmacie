import React, { useEffect, useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaMoneyBill, FaProductHunt, FaSortNumericUp, FaSortNumericUpAlt, FaPercentage, FaPercent, FaAd, FaDownload, FaBookMedical, FaUserCircle, FaUserFriends, FaUserNurse, FaTable, FaArrowDown, FaMoneyCheckAlt, FaUserPlus, FaCaretSquareUp, FaSdCard, FaHandHoldingMedical, FaRegUserCircle, FaBarcode, FaFingerprint, FaPrint, FaShoePrints, FaUserEdit } from 'react-icons/fa';
import RecuCaution from './RecuCaisse';
import IframePrinter from './IframePrinter';
import Apipatients from '../api/apiPatient';  // API pour les patients
import Apisociete from '../api/apiSociete';  // API pour les sociétés
import axios from 'axios';  // Utilisé pour les requêtes HTTP
import ApiCautions from '../api/apicautions';

const Cautions=()=>{
  const [selectedCaution, setSelectedCaution] = useState(null);
  const [showRecu, setShowRecu] = useState(false);
  
  const [listeLignes, setListeLignes] = useState([]);

      const [searchTerm, setSearchTerm] = useState('');
      const [Searchdesignation, setSearchdesignation] = useState('');
       const [selectedPatient, setSelectedPatient] = useState(null);
      const [isModalOpen, setIsModalOpen] = useState('');
      const [successMessage, setSuccessMessage] = useState('');  
      const [errorMessage, setErrorMessage] = useState(''); 
      const [cautionsData, setcautionsData] = useState([]);
     const  [filteredPatients, setFilteredPatients] = useState([]);
      const [patientsData, setPatientsData] = useState([]);
      const [societesdata, setSocietesData] = useState([]);
       const [userRole, setUserRole] = useState([]);
       const [isRoleLoaded, setIsRoleLoaded] = useState(false);

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
 
   const [currentcautions, setCurrentCautions] = useState({
    numero: '',
    client: '',
    montant: '',
    date: '',
    patient: null,
    appUser: null,
  });
        
    const loadPatient = async () => {
        try {
          const data = await Apipatients.getpatients();  // Appel API pour récupérer les patients
          console.log('Données des patients reçues:', data);
          setPatientsData(data);  // Mettre à jour l'état des patients avec les données récupérées
        } catch (error) {
          console.error('Erreur lors de la récupération des patients :', error);
        }
      };

      const loadSociete = async () => {
        try {
          const data = await Apisociete.getSocietes(); 
          setSocietesData(data);
        } catch (error) {
          console.error('Erreur lors de la récupération des sociétés :', error);
        }
      };
      const handleDeleteCaution = async (id) => {
        const confirmDelete = window.confirm("Voulez-vous vraiment supprimer cette caution ?");
        
        if (!confirmDelete) return;
      
        try {
          await ApiCautions.annulerCaution(id); // suppression dans le backend
      
          const supp = cautionsData.filter(ligne => ligne.id !== id); // mise à jour du tableau local
          setcautionsData(supp);
        } catch (error) {
          console.error("Erreur lors de la suppression :", error);
        }
      };
      
      const loadCautions = async () => {
        try {
          const data = await ApiCautions.getAllCautions(); 

          setcautionsData(data);
        } catch (error) {
          console.error('Erreur lors de la récupération des sociétés :', error);
        }
      };
     // Ouvrir la modale pour ajouter une assurance
     const openModal = () => {
      setPatients({  nom: '',
        prenom: '',
        telephone: '',
        sexe: '',
        dateNaissance: '',
        profession: '',
        ville: '',
        affilieSociete: false,
        societe_id: '',
        matricule: '',
        police: '',
        sinistre: '',
        numeroAssurance: '' });
      setIsModalOpen(true);
      setSuccessMessage(''); // Réinitialiser les messages
      setErrorMessage('');
    };
    
    // Fermer la modale
    const closeModal = () => {
      setIsModalOpen(false);
      setSuccessMessage('');
      setErrorMessage('');
    };
     
    
      
      useEffect(() => {
        loadSociete();
        loadCautions(); 
        loadPatient();
      }, []);

      useEffect(() => {
        const userString = localStorage.getItem('user');
        if (userString) {
          try {
            const user = JSON.parse(userString);
            if (user && user.roles) {
              const roles = Array.isArray(user.roles) ? user.roles : [user.roles];
              setUserRole(roles);
              setIsRoleLoaded(true);
            }
          } catch (error) {
            console.error("Erreur lors du parsing du user :", error);
          }
        }
    
        
      }, []);
    
    
    
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
      const handleSaveCaution = async () => {
        try {
          if (!selectedPatient) {
            alert("Veuillez sélectionner un patient avant d'ajouter une caution.");
            return;
          }
      
          if (!currentcautions.client || currentcautions.client.trim() === "") {
            alert("Le nom du client ne peut pas être vide.");
            return;
          }
      
          if (!currentcautions.montant || isNaN(currentcautions.montant) || parseFloat(currentcautions.montant) <= 0) {
            alert("Le montant doit être un nombre supérieur à zéro.");
            return;
          }
      
          // Appel API pour ajouter la caution
          await ApiCautions.addCaution({
            client: currentcautions.client,
            montant: currentcautions.montant,
            patient: selectedPatient,
          });
      
          // Réinitialisation des champs
          setCurrentCautions({
            numero: '',
            client: '',
            montant: '',
            date: '',
            patient: null,
            appUser: null,
          });
      
          setSelectedPatient(null); // Réinitialisation du champ patient
      
          // Recharge les données
          const updatedCautions = await ApiCautions.getAllCautions();
          setcautionsData(updatedCautions);
      
          alert('Caution ajoutée avec succès!');
        } catch (error) {
          console.error('Erreur lors de la sauvegarde de la caution:', error);
          alert("Une erreur est survenue lors de l'ajout de la caution.");
        }
      };
      
     
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
    
      };
    
     
      return (
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex justify-between items-center mb-6">
                 <h2 className="text-3xl font-bold text-gray-800">Cautions</h2>
         {/* debut zone recherhe et ajout patient*/}
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
                
                    <div className="absolute mt-10 w-80 border rounded-md bg-white shadow-lg z-50 max-h-60 overflow-y-auto">
  {filteredPatients.length > 0 && filteredPatients.map(patient => (
    <div
      key={patient.id}
      onClick={() => handlePatientSelect(patient)}
      className="p-2 cursor-pointer hover:bg-gray-200"
    >
      {patient.nom} {patient.prenom}
    </div>
  ))}
  {filteredPatients.length === 0 && searchTerm !== '' && (
    <div className="p-2 text-gray-500 italic">Aucun patient trouvé</div>
  )}
</div>

              
                  <button
                    onClick={openModal}
                    className="btn btn-primary flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    <FaUserPlus />
                  </button>
               </div>

         </div>
{/* fin zone recherhe et ajout patient*/}
{/* debut zone affichage patient*/}
          <div className='row mb-2'>
                   
         
<div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
      <div><span className="font-semibold">Téléphone:</span> {selectedPatient.telephone}</div>
      <div><span className="font-semibold">Sexe:</span> {selectedPatient.sexe}</div>
      <div><span className="font-semibold">Date de naissance:</span> {selectedPatient.dateNaissance}</div>
      <div><span className="font-semibold">Ville:</span> {selectedPatient.ville || "Non renseignée"}</div>
      <div><span className="font-semibold">Société:</span> {selectedPatient.societe?.nom || <span className="italic text-gray-400">Non renseignée</span>}</div>
    </div>
  ) : (
    <div className="text-center text-gray-400 italic mt-2">Aucun patient sélectionné</div>
  )}
</div>

             {/* */}     
                  <div className='w-full col-span-2'>
                  <div className="card bg-cover bg-center p-4 h-56 rounded-lg shadow-md hover:shadow-xl transition duration-300 ease-in-out  bg-cyan-400" >
    {/* fin zone raffichage  patient*/}        
        {/* formulaire caution */}   
               <div className="flex space-x-4 mt-5">
                    <label className='block text-gray-700  text-lg w-1/5' >Prix:</label>
                
                  <div className="relative">
                           <input
                             type="number"
                             className="p-1 pl-10 border rounded-md w-4/5   readeonly"
                             value={currentcautions.montant}
                             onChange={(e) => setCurrentCautions({ ...currentcautions,montant: e.target.value })}
                           />
                           <FaMoneyBill className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  </div>
    
               </div>
                  
          
                  
               <div className="flex space-x-4 mt-5">
                    <label className='block text-gray-700  text-lg w-1/5' >Versé par:</label>
                
                  <div className="relative">
                           <input
                             type="text"
                             className="p-1 pl-10 border rounded-md w-full  readeonly"
                             value={currentcautions.client}
                             onChange={(e) => setCurrentCautions({ ...currentcautions, client: e.target.value })}
                           />
                           <FaUserEdit className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  </div>
                
               </div>
               
               <div className="flex justify-end mt-6">
  <button
    onClick={handleSaveCaution}
    className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition duration-200"
  >
    <FaMoneyCheckAlt className="text-white" />
    <span>Ajouter une Caution</span>
  </button>
</div>


              </div>
                  </div>
 {/* fin */}  

 </div>
               </div>
               
               <div className='row mt-2'>
                
               <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-4">
               <div className="card bg-cover bg-center bg-cyan-100 col-span-3 p-4 h-56 rounded-lg shadow-md hover:shadow-xl transition duration-300 ease-in-out" >
               <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                     
                      <table className="min-w-full table-auto" >
                      
                        <thead >
                          <tr className="bg-gray-200">
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Date</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Code</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Montant</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Versé par</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">User</th>
    
                          
                          </tr>
                        </thead>
                        <tbody >
                        {Array.isArray(cautionsData) && cautionsData.map((caut) => (
  <tr key={caut.id} className="border-b hover:bg-gray-50">
            <td className="py-3 px-4 text-sm font-medium text-gray-800">
  {new Date(caut.date).toLocaleDateString('fr-FR')}

  
</td>

        <td className="py-3 px-4 text-sm font-medium text-gray-800">{caut.numero}</td>

    <td className="py-3 px-4 text-sm text-gray-600">{caut.montant} Fcfa</td>
    <td className="py-3 px-4 text-sm text-gray-600">{caut.client}</td>
    <td className="py-3 px-4 text-sm text-gray-600">{caut.appUser?.nom || 'N/A'}</td>
    <td className="py-3 px-4">
    {userRole.includes("ADMIN") && (
  <button
    onClick={() => handleDeleteCaution(caut.id)} // À adapter selon votre fonction de suppression
    className="text-red-600 hover:text-red-800"
  >
    <FaTrash />
  </button>
)}

    </td>
    <td className="py-3 px-4 text-sm text-gray-600 flex space-x-2">
  <button
    className="text-blue-500 hover:text-blue-700"
    onClick={() => {
      setSelectedCaution(caut); // ⬅️ On stocke la caution à imprimer
      setShowRecu(true);         // ⬅️ On affiche le modal
    }}
  >
    <FaPrint />
  </button>
</td>

  </tr>
))}

                        
                        
                        </tbody>
                      </table>
                     
                    </div>
              </div>

               </div>
           </div>
               
         
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
          <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {isModalOpen && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
                <h3 className="text-xl font-semibold mb-4">Ajouter Assurance</h3>
    
              {/* Formulaire d'ajout de patient */}
    
    
                {/* Colonne 1 - Informations de base */}
                <div>
    
    
                  {/* Nom et Prénom sur la même ligne */}
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
                    <div className="w-full  col-span-1">
                      <label className="block text-gray-700 mb-2 text-sm">Téléphone</label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded-md text-sm"
                        value={Patients.telephone}
                        onChange={(e) => setPatients({ ...Patients, telephone: e.target.value })}
                        required
                      />
                    </div>
                    <div className="w-full  col-span-1">
                      <label className="block text-gray-700 mb-2 text-sm">Date de naissance</label>
                      <input
                        type="date"
                        className="w-full p-2 border rounded-md text-sm"
                        value={Patients.dateNaissance}
                        onChange={(e) => setPatients({ ...Patients, dateNaissance: e.target.value })}
                      />
                    </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-2">
                       <div className="w-full col-span-1">
                      <label className="block text-gray-700 mb-2 text-sm">Profession</label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded-md text-sm"
                        value={Patients.profession}
                        onChange={(e) => setPatients({ ...Patients, profession: e.target.value })}
                      />
                    </div>
                         <div className="w-full col-span-1">
                      <label className="block text-gray-700 mb-2 text-sm">Ville</label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded-md text-sm"
                        value={Patients.ville}
                        onChange={(e) => setPatients({ ...Patients, ville: e.target.value })}
                      />
                    </div>
                  </div>
    
               
    
                  
                </div>
    
                {/* Colonne 2 - Affiliation à une société et autres informations */}
                
                <div>
                   
                  {/* Affiliation à une société */}
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
                        <div className="w-full col-span-2 mb-4 ">
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
            
    
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={closeModal}
                    className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleSave}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Ajouter
                  </button>
                </div>
          
         </div>
         </div>
       
          )}
         </div>
          </div>

          {showRecu && selectedCaution && (
  <IframePrinter caution={selectedCaution} onClose={() => setShowRecu(false)} />
)}


          </div>
      );
    };
export default Cautions;