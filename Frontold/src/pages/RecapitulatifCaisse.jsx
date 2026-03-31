import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import Modal from "react-modal";
import logoClinique from "../assets/logo.png"; 

Modal.setAppElement("#root"); // Important pour l'accessibilité

const RecapitulatifCaisseModal = ({ isOpen, onRequestClose, data, dateDebut, dateFin }) => {
  const printRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "Recap Caisse",
  });

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Récapitulatif Caisse"
      style={{
        content: {
          maxWidth: "800px",
          margin: "auto",
          inset: "auto",
          padding: "20px",
          borderRadius: "10px",
        },
      }}
    >
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">Récapitulatif de Caisse</h2>
        <button onClick={handlePrint} className="btn btn-primary">Imprimer</button>
      </div>

      <div ref={printRef} className="p-4 bg-white text-black">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <img src={logoClinique} alt="Logo Clinique" style={{ width: "100px" }} />
          <div className="text-right">
            <p><strong>Période :</strong></p>
            <p>Du {dateDebut} au {dateFin}</p>
          </div>
        </div>

        <table className="table-auto w-full border-collapse border text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Utilisateur</th>
              <th className="border p-2"># Tickets</th>
              <th className="border p-2">Net Patient</th>
              <th className="border p-2">Net Assurance</th>
              <th className="border p-2">Total TTC</th>
              <th className="border p-2"># Cautions</th>
              <th className="border p-2">Montant Cautions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((user, idx) => (
              <tr key={idx}>
                <td className="border p-1">{user.nomUtilisateur}</td>
                <td className="border p-1 text-center">{user.nombreTickets}</td>
                <td className="border p-1 text-right">{(user.totalNetPatient || 0).toLocaleString()} FCFA</td>
                <td className="border p-1 text-right">{(user.totalNetAssurance || 0).toLocaleString()} FCFA</td>
                <td className="border p-1 text-right">{(user.totalTtc || 0).toLocaleString()} FCFA</td>
                <td className="border p-1 text-center">{user.nombreCautions}</td>
                <td className="border p-1 text-right">{(user.montantTotalCautions || 0).toLocaleString()} FCFA</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-8 flex justify-between">
          <div>
            <p><strong>Signature Responsable :</strong></p>
            <div style={{ height: "50px", borderBottom: "1px solid #000", width: "200px" }}></div>
          </div>
          <div>
            <p><strong>Date :</strong> {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default RecapitulatifCaisseModal;
