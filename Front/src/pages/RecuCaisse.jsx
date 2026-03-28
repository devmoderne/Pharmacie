import React, { useRef } from "react";
import writtenNumber from 'written-number';

writtenNumber.defaults.lang = 'fr';

const RecuCaution = ({ caution }) => {
  const printRef = useRef();
  const montantLettre = writtenNumber(caution.montant || 0);

  return (
    <div
      ref={printRef}
      style={{
        width: '150mm', // légèrement en dessous de A5
        minHeight: '100mm', // réduit pour rester sur une seule page
        margin: '5mm auto',
        backgroundColor: 'white',
        padding: '8mm 10mm',
        border: '1px solid #888',
        borderRadius: '6px',
        fontSize: '12px', // réduit
        boxSizing: 'border-box'
      }}
    >
      {/* En-tête */}
      <div style={{ textAlign: 'center', marginBottom: '12px', marginTop: '0' }}>
        <h2 style={{
          fontSize: '16px',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          margin: '2px 0'
        }}>
        Clinique BOULI
        </h2>
        <p style={{ margin: 0 }}>Email: bouli@gmail.com Adresse : quartier Reference 

Tel :96804645/89448385, Niamey - Niger</p>
     
        <hr style={{ margin: '6px auto', borderColor: '#aaa', width: '65%' }} />
        <h3 style={{
          fontSize: '14px',
          textDecoration: 'underline',
          marginTop: '6px',
          marginBottom: '8px'
        }}>REÇU DE CAUTION</h3>
      </div>

      {/* Agent */}
      <div style={{ marginBottom: '6px' }}>
        <strong>Agent :</strong> {caution.appUser?.nom || "N/A"}
      </div>

      {/* Infos transaction */}
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginBottom: '20px'
        }}
      >
        <thead style={{ backgroundColor: '#333', color: 'white' }}>
          <tr>
            <th style={thStyle}>Code</th>
            <th style={thStyle}>Date</th>
            <th style={thStyle}>Patient</th>
            <th style={thStyle}>Montant</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={tdStyle}>{caution.numero}</td>
            <td style={tdStyle}>
              {new Date(caution.dateOperation || new Date()).toLocaleDateString()}
            </td>
            <td style={tdStyle}>{caution.patient?.nom || "Inconnu"}</td>
            <td style={tdStyle}>{caution.montant} FCFA</td>
          </tr>
          <tr>
            <td colSpan="4" style={{ ...tdStyle, fontStyle: 'italic' }}>
              <strong>Montant en lettres :</strong> {montantLettre.toUpperCase()} FRANCS CFA
            </td>
          </tr>
          <tr>
            <td colSpan="4" style={tdStyle}>
              <strong>Payé par :</strong> {caution.client}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Signature plus proche */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
        <div style={{ textAlign: 'right' }}>
          <p style={{ marginBottom: '6px' }}>Signature du Caissier</p>
          <div style={{ borderBottom: '1px solid #444', width: '120px', height: '1px' }}></div>
        </div>
      </div>
    </div>
  );
};

// Styles condensés
const thStyle = {
  padding: '5px',
  textAlign: 'left',
  border: '1px solid #666',
  fontWeight: 'bold',
  fontSize: '11px'
};

const tdStyle = {
  padding: '5px',
  border: '1px solid #999',
  fontSize: '11px'
};

export default RecuCaution;
