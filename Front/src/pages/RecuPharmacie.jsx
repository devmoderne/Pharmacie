import React, { useRef } from "react";
import writtenNumber from "written-number";

writtenNumber.defaults.lang = "fr";

const RecuPharmacie = ({ ticket }) => {
const printRef = useRef();
const montantLettre = writtenNumber(ticket.netAPayer || 0);

return (
<div
ref={printRef}
style={{
width: "105mm", // format A6
minHeight: "148mm",
margin: "5mm auto",
backgroundColor: "white",
padding: "5mm 8mm",
border: "1px solid #888",
borderRadius: "4px",
fontSize: "10px", // petite police
boxSizing: "border-box",
fontFamily: "Arial, sans-serif",
}}
>
{/* En-tête */}
<div style={{ textAlign: "center", marginBottom: "8px" }}>
<h3 style={{ fontSize: "12px", margin: "2px 0", fontWeight: "bold" }}>
PHARMACIE [Nom de la pharmacie] </h3>
<p style={{ margin: "0", fontSize: "9px" }}>
Adresse : [Adresse] | Tel : [Téléphone] </p>
<p style={{ margin: "0", fontSize: "9px" }}>NIF : [NIF / RCCM]</p>
<hr style={{ margin: "4px auto", borderColor: "#aaa" }} />
<h4 style={{ fontSize: "11px", textDecoration: "underline", margin: "4px 0" }}>
REÇU DE VENTE </h4> </div>

```
  {/* Infos ticket */}
  <div style={{ marginBottom: "6px" }}>
    <p style={{ margin: "2px 0" }}><strong>Ticket :</strong> {ticket.codeTicket}</p>
    <p style={{ margin: "2px 0" }}><strong>Date :</strong> {new Date(ticket.dateVente).toLocaleString()}</p>
    <p style={{ margin: "2px 0" }}><strong>Client :</strong> {ticket.client?.nom || "N/A"}</p>
    <p style={{ margin: "2px 0" }}><strong>Téléphone :</strong> {ticket.client?.telephone || "N/A"}</p>
    <p style={{ margin: "2px 0" }}><strong>Vendeur :</strong> {ticket.user?.nom || "N/A"}</p>
  </div>

  {/* Tableau produits */}
  <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "6px" }}>
    <thead>
      <tr style={{ backgroundColor: "#eee", fontSize: "9px" }}>
        <th style={thStyle}>Produit</th>
        <th style={thStyle}>PU</th>
        <th style={thStyle}>Qté</th>
        <th style={thStyle}>Montant</th>
      </tr>
    </thead>
    <tbody>
      {ticket.lignes.map((l, idx) => (
        <tr key={idx} style={{ fontSize: "9px", borderBottom: "1px solid #ccc" }}>
          <td style={tdStyle}>{l.produit.nomProduit}</td>
          <td style={tdStyle}>{l.prixVente.toLocaleString()}</td>
          <td style={tdStyle}>{l.quantite}</td>
          <td style={tdStyle}>{l.montant.toLocaleString()}</td>
        </tr>
      ))}
      <tr>
        <td colSpan="4" style={{ ...tdStyle, fontStyle: "italic", fontSize: "9px" }}>
          Montant en lettres : {montantLettre.toUpperCase()} FRANCS CFA
        </td>
      </tr>
    </tbody>
  </table>

  {/* Récapitulatif */}
  <div style={{ fontSize: "10px" }}>
    <p><strong>Total :</strong> {ticket.total?.toLocaleString()} Fcfa</p>
    <p><strong>TVA :</strong> {ticket.tva}%</p>
    <p><strong>Remise :</strong> {ticket.remise}%</p>
    <p><strong>Net à payer :</strong> {ticket.netAPayer?.toLocaleString()} Fcfa</p>
    <p><strong>Remis :</strong> {ticket.remis?.toLocaleString()} Fcfa</p>
    <p><strong>Rendu :</strong> {ticket.rendu?.toLocaleString()} Fcfa</p>
  </div>
</div>


);
};

// Styles condensés
const thStyle = {
padding: "2px",
textAlign: "left",
borderBottom: "1px solid #666",
fontWeight: "bold",
fontSize: "9px",
};

const tdStyle = {
padding: "2px",
borderBottom: "1px solid #ccc",
fontSize: "9px",
};

export default RecuPharmacie;
