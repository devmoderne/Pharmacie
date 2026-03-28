import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import RecuCaution from "./RecuCaisse";
import RecuPharmacie from "./RecuPharmacie";

const IframePrinter = ({ caution, onClose }) => {
  const iframeRef = useRef(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe) {
      const doc = iframe.contentDocument || iframe.contentWindow.document;

      doc.open();
      doc.write("<!DOCTYPE html><html><head><title>Reçu</title></head><body></body></html>");
      doc.close();

      const mountNode = doc.body.appendChild(document.createElement("div"));
      ReactDOM.render(<RecuPharmacie pharmacie={pharmacie} />, mountNode);
    }
  }, [caution]);

  const handlePrint = () => {
    iframeRef.current?.contentWindow?.focus();
    iframeRef.current?.contentWindow?.print();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-2 rounded shadow-lg w-[230mm] h-[160mm] overflow-hidden">
        <div className="flex justify-between items-center mb-2">
          <button className="btn btn-sm btn-error" onClick={onClose}>
            Fermer
          </button>
          <button className="btn btn-sm btn-primary" onClick={handlePrint}>
            Imprimer
          </button>
        </div>
        <iframe
          ref={iframeRef}
          title="Reçu Caution"
          className="w-full h-full border rounded"
        />
      </div>
    </div>
  );
};

export default IframePrinter;
