import { useState, useEffect } from "react";
import './PublicContacts.css'; // Importe o CSS aqui

export default function PublicContacts() {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/contatos")
      .then((res) => res.json())
      .then((data) => setContacts(data))
      .catch((err) => console.error("Erro ao carregar contatos:", err));
  }, []);

  // Ordem desejada das secretarias
  const ordemSecretarias = [
    "GAP", "PGM", "LAGEADO", "SEPLAN", "Controladoria",
    "SADM", "SMF", "SAMA", "SIC", "SEL", "SECTUR",
    "SMED", "SMS", "SAS", "SOSUH"
  ];

  // Agrupar contatos por secretaria
  const groupedContacts = contacts.reduce((groups, contact) => {
    const groupName = contact.secretaria_nome || "Sem Secretaria";
    if (!groups[groupName]) {
      groups[groupName] = [];
    }
    groups[groupName].push(contact);
    return groups;
  }, {});

  // Ordenar secretarias com base na ordem definida
  const sortedSecretarias = Object.keys(groupedContacts).sort((a, b) => {
    const indexA = ordemSecretarias.indexOf(a.toUpperCase());
    const indexB = ordemSecretarias.indexOf(b.toUpperCase());

    // Se a secretaria estiver na lista, ordena conforme a posição dela
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    
    // Se apenas uma secretaria estiver na lista, ela vem primeiro
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;

    // Caso contrário, ordena alfabeticamente
    return a.localeCompare(b);
  });

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      {sortedSecretarias.map((groupName) => (
        <div key={groupName} className="secretaria" style={{ marginBottom: "40px" }}>
          <h2>{groupName}</h2>
          {groupedContacts[groupName].map((contact) => (
            <div key={contact.id} className="function" style={{ marginBottom: "20px", padding: "10px", border: "1px solid #ddd" }}>
              <h3>
                {contact.nome} <span className="cargo" style={{ fontWeight: "normal", fontStyle: "italic" }}>({contact.cargo})</span>
              </h3>
              {contact.ramal && <p className="fonte">Ramal: {contact.ramal}</p>}
              {contact.telefone && <p className="fonte">Telefone: {contact.telefone}</p>}
              {contact.whatsapp && (
                <p className="fonte">
                  Whatsapp: <a href={`https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, '')}`}>{contact.whatsapp}</a>
                </p>
              )}
              {contact.email && (
                <p className="fonte">
                  Email: <a className="espaco" href={`mailto:${contact.email}`}>{contact.email}</a>
                </p>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
