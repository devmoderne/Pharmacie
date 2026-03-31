import { useState, useEffect } from "react";

const formatMoney = (val) =>
  val?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " FCFA";

const Paiement = ({ ttc, ttcAssurance }) => {
  const [reductionAssurance, setReductionAssurance] = useState(0); // en %
  const [reductionPatient, setReductionPatient] = useState(0);     // en %
  const [netPatient, setNetPatient] = useState(0);
  const [remis, setRemis] = useState(0);
  const [monnaieRendue, setMonnaieRendue] = useState(0);

  useEffect(() => {
    // Calcule le totalTTC en fonction des prix et quantités
    const calculatedTotalTTC = lignes.reduce((total, ligne) => {
      return total + ligne.prix * ligne.quantite;
    }, 0);
    setTotalTTC(calculatedTotalTTC);
  }, [lignes]);  // Recaclule chaque fois que les lignes changent

  // Calcul net à payer par le patient
  useEffect(() => {
    const partAssurance = ttcAssurance - (ttcAssurance * reductionAssurance) / 100;
    const partPatient = (ttc - ttcAssurance) - ((ttc - ttcAssurance) * reductionPatient) / 100;
    setNetPatient(Math.round(partPatient));
  }, [ttc, ttcAssurance, reductionAssurance, reductionPatient]);

  // Calcul de la monnaie à rendre
  useEffect(() => {
    setMonnaieRendue(remis - netPatient);
  }, [remis, netPatient]);

  const handleValidation = () => {
    alert(`Validation avec : Net Patient = ${formatMoney(netPatient)}, Remis = ${formatMoney(remis)}`);
  };

  return (
    <div className="mt-4 p-4 border rounded shadow">
      <h3 className="text-lg font-bold mb-2">Paiement</h3>
      <p>Total TTC : <strong>{formatMoney(ttc)}</strong></p>
      <p>Pris en charge assurance : <strong>{formatMoney(ttcAssurance)}</strong></p>
      <div className="flex gap-4 mt-3">
        <div>
          <label>% Réduction assurance :</label><br />
          <input
            type="number"
            value={reductionAssurance}
            onChange={(e) => setReductionAssurance(Number(e.target.value))}
            className="border p-1"
          />
        </div>
        <div>
          <label>% Réduction patient :</label><br />
          <input
            type="number"
            value={reductionPatient}
            onChange={(e) => setReductionPatient(Number(e.target.value))}
            className="border p-1"
          />
        </div>
      </div>

      <div className="mt-3">
        <p>Net à payer par le patient : <strong>{formatMoney(netPatient)}</strong></p>
        <label>Montant remis :</label><br />
        <input
          type="number"
          value={remis}
          onChange={(e) => setRemis(Number(e.target.value))}
          className="border p-1"
        />
        <p className="mt-2">Monnaie à rendre : <strong>{formatMoney(monnaieRendue)}</strong></p>
      </div>

      <button onClick={handleValidation} className="mt-3 bg-blue-500 text-white px-4 py-2 rounded">
        Valider
      </button>
    </div>
  );
};

export default Paiement;
