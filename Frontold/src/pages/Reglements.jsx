import React, { useEffect, useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaMoneyBill, FaProductHunt, FaSortNumericUp, FaSortNumericUpAlt, FaPercentage, FaPercent, FaAd, FaDownload, FaBookMedical, FaUserCircle, FaUserFriends, FaUserNurse, FaTable, FaArrowDown, FaMoneyCheckAlt, FaUserPlus, FaCaretSquareUp, FaSdCard, FaHandHoldingMedical, FaRegUserCircle, FaBarcode, FaFingerprint, FaPrint, FaShoePrints, FaUserEdit } from 'react-icons/fa';

import Apipatients from '../api/apiPatient';  // API pour les patients
import Apisociete from '../api/apiSociete';  // API pour les sociétés
import axios from 'axios';  // Utilisé pour les requêtes HTTP

const Reglements=()=>{



     const [searchTerm, setSearchTerm] = useState('');
          const [Searchdesignation, setSearchdesignation] = useState('');
           
          const [isModalOpen, setIsModalOpen] = useState('');
          const [successMessage, setSuccessMessage] = useState('');  
          const [errorMessage, setErrorMessage] = useState(''); 
         
          const [patientsData, setPatientsData] = useState([]);
          const [societesdata, setSocietesData] = useState([]);
          const [Patients, setPatients] = useState({
            nom: '',
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
           
          }, []);
        
          
         
        
          const handleSave = async () => {
            try {
          
              const donneepatient = await Apipatients.addpatient(Patients);  // Ajouter une nouvelle assurance
            
              setPatientsData((prevData) => [...prevData, donneepatient]);  // Mettre à jour les assurances dans l'état
            
              alert(' ajoutée avec succès !');  // Afficher un message de succès
              
            } catch (error) {
          
              console.error('Erreur lors de la sauvegarde de l\'assurance:', error);
              alert('Une erreur est survenue lors de l\'ajout de l\'assurance');  // Afficher un message d'erreur
            }
          };
          
        
         
        
return (
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex justify-between items-center mb-6">
                 <h2 className="text-3xl font-bold text-gray-800">Reglement factures</h2>
         
                 <div className="flex space-x-4">
                  {/* Search Input */}
                  <div className="relative">
                           <input
                             type="text"
                             className="p-2 pl-10 border rounded-md"
                             placeholder="Rechercher..."
                             value={searchTerm}
                             onChange={(e) => setSearchTerm(e.target.value)}
                           />
                           <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  </div>
               
                 
                 {/* Ajouter Assurance Button */}
          
               </div>
               
         
         </div>
         <div className='row mb-2'>
              
    
               <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className='w-full col-span-1'>
                        {/* Carte Factures */}
              <div className="card bg-cover  bg-blue-200  bg-center p-4 h-56 rounded-lg shadow-md hover:shadow-xl transition duration-300 ease-in-out" >
              <FaUserNurse className='size-8 w-full absolute left-3 top-2  transform -translate-x-1/2'/><br></br>
                  00<label>nom:</label>
                      <label>prenom:</label>
                      <label>age:</label>
                      <label>sexe:</label>
                      <label>telephone:</label>
                      <label>Assurances:</label>
                      <label>Societe:</label>
            
              </div>
                   
             
                  </div>
                  <div className='w-full col-span-2'>
                  <div className="card bg-cover bg-center p-4 h-56 rounded-lg shadow-md hover:shadow-xl transition duration-300 ease-in-out  bg-cyan-400" >
            
            
               <div className="flex space-x-4 mt-5">
                    <label className='block text-gray-700  text-lg w-1/5' >Prix:</label>
                  {/* Search Input */}
                  <div className="relative">
                           <input
                             type="number"
                             className="p-1 pl-10 border rounded-md w-4/5   readeonly"
                            
                      
                
                           />
                           <FaMoneyBill className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  </div>
    
               </div>
                  
          
                  
               <div className="flex space-x-4 mt-5">
                    <label className='block text-gray-700  text-lg w-1/5' >Versé par:</label>
                  {/* Search Input */}
                  <div className="relative">
                           <input
                             type="text"
                             className="p-1 pl-10 border rounded-md w-full  readeonly"
                            
                          
                
                           />
                           <FaUserEdit className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  </div>
                
               </div>
               
               <div className="flex space-x-4 mt-4">
               
                  <button
                   onClick={openModal}
                   className="btn btn-primary flex items-center space-x-2 px-4 py-2 bg-blue-400 text-white  hover:bg-yellow-300"
                 >
                   <FaDownload />
                  
                 </button>
               </div>
              </div>
                  </div>
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
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Montant</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Versé par</th>

                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">TOTAL</th>
    
                          
                          </tr>
                        </thead>
                        <tbody >
                          <tr className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4 text-sm font-medium text-gray-800 ">2025-05-12</td>
                            <td className="py-3 px-4 text-sm text-gray-600">2500 Fcfa</td>
                            <td className="py-3 px-4 text-sm text-gray-600">Amadou  vaincent</td>
                                   <td className="py-3 px-4 text-sm text-gray-600 flex space-x-2">
                                  <button  className="text-blue-500 hover:text-blue-700">
                                    <FaPrint />
                                  </button>
                                 
                                </td>
                                      
                          </tr>
                         
                      
                         
                           <tr className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4 text-sm font-medium text-gray-800 ">2025-05-12</td>
                            <td className="py-3 px-4 text-sm text-gray-600">2500 Fcfa</td>
                            <td className="py-3 px-4 text-sm text-gray-600">Amadou  vaincent</td>
                            <td className="py-3 px-4 text-sm text-gray-600 flex space-x-2">
                                  <button  className="text-blue-500 hover:text-blue-700">
                                    <FaPrint />
                                  </button>
                               
                                </td>
                                      
                          </tr>
                      <tr className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4 text-sm font-medium text-gray-800 ">2025-05-12</td>
                            <td className="py-3 px-4 text-sm text-gray-600">2500 Fcfa</td>
                            <td className="py-3 px-4 text-sm text-gray-600">Amadou  vaincent</td>
                            <td className="py-3 px-4 text-sm text-gray-600 flex space-x-2">
                                  <button  className="text-blue-500 hover:text-blue-700">
                                    <FaPrint />
                                  </button>
                                  
                                </td>
                                      
                          </tr>
                          
                          
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
          </div>
      );
    };


export default Reglements;