import React, { useRef } from "react";
import writtenNumber from 'written-number';
import logoClinique from "../assets/logo.png";

writtenNumber.defaults.lang = 'fr';

const RecapitulatifCaisseModal = ({ data, periode, isOpen, onRequestClose, printedBy }) => {
  const printRef = useRef();

  if (!isOpen) return null;

  const totalPartPatient = data.reduce((acc, item) => acc + (parseFloat(item.partPatient) || 0), 0);
  const totalPartAssurance = data.reduce((acc, item) => acc + (parseFloat(item.partAssurance) || 0), 0);
  const totalMontantTotal = data.reduce((acc, item) => acc + (parseFloat(item.montantTotal) || 0), 0);

  const tickets = data.filter(item => item.type?.toLowerCase() === 'ticket');
  const cautions = data.filter(item => item.type?.toLowerCase() === 'caution');

  const totalTicket = tickets.reduce((acc, item) => acc + (parseFloat(item.montantTotal) || 0), 0);
  const totalCaution = cautions.reduce((acc, item) => acc + (parseFloat(item.montantTotal) || 0), 0);

  const handlePrint = () => {
    const printContent = printRef.current.innerHTML;
    const win = window.open('', '', 'height=700,width=900');
    win.document.write(`
      <html>
        <head>
          <title>Impression</title>
          <style>
            body { font-family: Arial, sans-serif; font-size: 12px; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            th, td { border: 1px solid #ddd; padding: 6px; font-size: 11px; }
            th { background-color: #333; color: white; }
            .total-row { background-color: #f2f2f2; font-weight: bold; }
            .summary { margin-top: 30px; }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);
    win.document.close();
    win.print();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-5xl w-full relative overflow-auto h-[90vh]">
        <button
          onClick={onRequestClose}
          className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded"
          aria-label="Fermer la fenêtre"
        >
          Fermer
        </button>

        <div ref={printRef} className="p-4 print-zone">
          <div className="flex justify-between items-center mb-4">
            <img src={logoClinique} alt="Logo Clinique" className="h-16" />
            <div className="text-right text-sm">
              <div>Période : {periode.startDate} au {periode.endDate}</div>
              <p><strong>Imprimé par :</strong> {printedBy}</p>
              <p><strong>Date impression :</strong> {new Date().toLocaleDateString()}</p>
            </div>
          </div>

          <h2 className="text-xl font-bold text-center mb-4">Récapitulatif de Caisse</h2>

          <table className="w-full table-auto border-collapse border border-gray-500 text-sm">
            <thead>
              <tr className="bg-gray-300 text-gray-800">
                <th className="border border-gray-500 px-2 py-1">Type</th>
                <th className="border border-gray-500 px-2 py-1">Date</th>
                <th className="border border-gray-500 px-2 py-1">Numéro</th>
                <th className="border border-gray-500 px-2 py-1">Patient</th>
                <th className="border border-gray-500 px-2 py-1">Part Patient</th>
                <th className="border border-gray-500 px-2 py-1">Part Assurance</th>
                <th className="border border-gray-500 px-2 py-1">Total</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="border border-gray-500 px-2 py-1">{item.type}</td>
                  <td className="border border-gray-500 px-2 py-1">{item.date}</td>
                  <td className="border border-gray-500 px-2 py-1">{item.numero}</td>
                  <td className="border border-gray-500 px-2 py-1">{item.patientNom}</td>
                  <td className="border border-gray-500 px-2 py-1 text-right">
                    {item.partPatient != null ? item.partPatient.toLocaleString() : "-"}
                  </td>
                  <td className="border border-gray-500 px-2 py-1 text-right">
                    {item.partAssurance != null ? item.partAssurance.toLocaleString() : "-"}
                  </td>
                  <td className="border border-gray-500 px-2 py-1 text-right">
                    {item.montantTotal != null ? item.montantTotal.toLocaleString() : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-200 font-semibold">
                <td colSpan="6" className="border px-2 py-1 text-right">Sous-total Tickets</td>
                <td className="border px-2 py-1 text-right text-blue-700">{totalTicket.toLocaleString()} FCFA</td>
              </tr>
              <tr className="bg-gray-200 font-semibold">
                <td colSpan="6" className="border px-2 py-1 text-right">Sous-total Cautions</td>
                <td className="border px-2 py-1 text-right text-red-700">{totalCaution.toLocaleString()} FCFA</td>
              </tr>
              <tr className="bg-neutral text-white font-bold">
                <td colSpan="4" className="border px-2 py-2 text-right">Totaux</td>
                <td className="border px-2 py-2 text-right text-green-300">{totalPartPatient.toLocaleString()} FCFA</td>
                <td className="border px-2 py-2 text-right text-blue-300">{totalPartAssurance.toLocaleString()} FCFA</td>
                <td className="border px-2 py-2 text-right text-yellow-300">{totalMontantTotal.toLocaleString()} FCFA</td>
              </tr>
            </tfoot>
          </table>

          <div className="mt-6 summary bg-gray-100 p-4 rounded shadow-inner">
            <p className="text-right font-semibold">
              <span className="text-gray-700">Total Part Patient :</span>
              <span className="ml-2 text-green-600">{totalPartPatient.toLocaleString()} FCFA</span>
            </p>
            <p className="text-right font-semibold">
              <span className="text-gray-700">Total Part Assurance :</span>
              <span className="ml-2 text-blue-600">{totalPartAssurance.toLocaleString()} FCFA</span>
            </p>
            <p className="text-right font-semibold">
              <span className="text-gray-700">Total Cautions :</span>
              <span className="ml-2 text-red-600">{totalCaution.toLocaleString()} FCFA</span>
            </p>
            <p className="text-right font-bold mt-2">
              <span className="text-gray-800">Montant Total Général :</span>
              <span className="ml-2 text-purple-700">{totalMontantTotal.toLocaleString()} FCFA</span>
            </p>
            <p className="text-right italic text-sm mt-2 text-gray-600">
              Montant en lettres : <strong>{writtenNumber(totalMontantTotal)} francs CFA</strong>
            </p>
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button onClick={handlePrint} className="btn btn-accent">
            Imprimer
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecapitulatifCaisseModal;
