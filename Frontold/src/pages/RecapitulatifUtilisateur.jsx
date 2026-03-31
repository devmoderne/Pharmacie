import React, { useRef } from "react";
import ReactToPrint from "react-to-print";
const RecapitulatifUtilisateur = ({ recapData, dateDebut, dateFin }) => {
    const componentRef = useRef();
  
    return (
      <div>
        <ReactToPrint
          trigger={() => <button className="btn btn-success">Imprimer</button>}
          content={() => componentRef.current}
        />
        <div ref={componentRef} className="a4-print">
          <h3 style={{ textAlign: "center" }}>Récapitulatif des Tickets par Utilisateur</h3>
          <p>Période : {dateDebut} au {dateFin}</p>
          <table className="recap-table">
            <thead>
              <tr>
                <th>Utilisateur</th>
                <th>Montant</th>
              </tr>
            </thead>
            <tbody>
              {recapData.map((item, index) => (
                <tr key={index}>
                  <td>{item.nomUtilisateur}</td>
                  <td>{item.montant.toLocaleString()} F</td>
                </tr>
              ))}
              <tr>
                <td><strong>Total</strong></td>
                <td><strong>{recapData.reduce((acc, curr) => acc + curr.montant, 0).toLocaleString()} F</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  
  export default RecapitulatifUtilisateur;