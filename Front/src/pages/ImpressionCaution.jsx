import { jsPDF } from "jspdf";

// Fonction pour convertir les montants en lettres (en français)
function nombreEnLettres(nombre) {
  // Pour la version complète, tu peux utiliser une lib comme "nombres-en-lettres"
  // Ici, version simplifiée
  const formatter = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF",
    minimumFractionDigits: 0,
  });
  return formatter.format(nombre) + " (à écrire en lettres manuellement)";
}

export default function printCaution(caut) {
  const doc = new jsPDF({
    format: "a5",
    orientation: "portrait",
    unit: "mm",
  });

  const cliniqueNom = "Polyclinique Santé Plus";
  const adresse = "Email: abdoulazizseini@yahoo.fr Adresse : Harobanda, Route Torodi, Niamey - Niger";
  const telephone = "+227  20 31 52 18";

  // En-tête
  doc.setFontSize(14);
  doc.text(cliniqueNom, 20, 20);
  doc.setFontSize(10);
  doc.text(adresse, 20, 26);
  doc.text("Tél: " + telephone, 20, 30);
  doc.line(20, 33, 190, 33);

  // Titre
  doc.setFontSize(12);
  doc.text("Reçu de Caution", 80, 40);
  doc.setFontSize(10);

  // Infos
  doc.text("Numéro : " + caut.numero, 20, 50);
  doc.text("Date : " + new Date(caut.date).toLocaleDateString('fr-FR'), 20, 55);
  doc.text("Client : " + caut.client, 20, 60);
  doc.text("Patient : " + (caut.patient?.nom || "Inconnu"), 20, 65);
  doc.text("Montant : " + caut.montant + " FCFA", 20, 70);
  doc.text("Utilisateur : " + (caut.appUser?.nom || "N/A"), 20, 75);

  // Montant en lettres
  doc.setFont("times", "italic");
  doc.text("Arrêté le montant à :", 20, 85);
  doc.setFont("times", "normal");
  doc.text(nombreEnLettres(caut.montant), 20, 90);

  // Signature
  doc.line(20, 95, 190, 95);
  doc.text("Merci pour votre confiance.", 20, 100);
  doc.text("Signature :", 150, 110);

  // Générer le PDF
  doc.save(`recu_caution_${caut.numero}.pdf`);
}
