import { useState, useEffect } from "react";

export default function ContatosCrud() {
  const [contatos, setContatos] = useState([]);
  const [secretarias, setSecretarias] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState({ id: null, nome: "", cargo: "", ramal: "", telefone: "", whatsapp: "", email: "", secretaria_id: "" });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/contatos")
      .then((res) => res.json())
      .then((data) => setContatos(data));
    
    fetch("http://localhost:5000/secretarias")
      .then((res) => res.json())
      .then((data) => setSecretarias(data));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      await fetch(`http://localhost:5000/contatos/${form.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setContatos(contatos.map((contato) => (contato.id === form.id ? form : contato)));
      setIsEditing(false);
    } else {
      const response = await fetch("http://localhost:5000/contatos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (response.ok) {
        const newContato = await response.json();
        setContatos([...contatos, newContato]);
      }
    }
    setForm({ id: null, nome: "", cargo: "", ramal: "", telefone: "", whatsapp: "", email: "", secretaria_id: "" });
  };

  const handleEdit = (contato) => {
    setForm(contato);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:5000/contatos/${id}`, { method: "DELETE" });
    setContatos(contatos.filter((contato) => contato.id !== id));
  };

  const getSecretariaNome = (id) => {
    const secretaria = secretarias.find(sec => sec.id === id);
    return secretaria ? secretaria.nome : "Sem Secretaria";
  };

  const filteredContacts = contatos.filter(contato => 
    contato.nome.toLowerCase().includes(searchTerm) ||
    contato.cargo.toLowerCase().includes(searchTerm) ||
    contato.ramal.toLowerCase().includes(searchTerm) ||
    contato.telefone.toLowerCase().includes(searchTerm) ||
    getSecretariaNome(contato.secretaria_id).toLowerCase().includes(searchTerm)
  );

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>{isEditing ? "Editar Contato" : "Gerenciar Contatos"}</h1>
      
      
      
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <input name="nome" placeholder="Nome" value={form.nome} onChange={handleChange} required style={{ padding: "8px" }} />
        <input name="cargo" placeholder="Cargo" value={form.cargo} onChange={handleChange} required style={{ padding: "8px" }} />
        <input name="ramal" placeholder="Ramal" value={form.ramal} onChange={handleChange} style={{ padding: "8px" }} />
        <input name="telefone" placeholder="Telefone" value={form.telefone} onChange={handleChange} style={{ padding: "8px" }} />
        <input name="whatsapp" placeholder="WhatsApp" value={form.whatsapp} onChange={handleChange} style={{ padding: "8px" }} />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required style={{ padding: "8px" }} />
        <select name="secretaria_id" value={form.secretaria_id} onChange={handleChange} style={{ padding: "8px" }}>
          <option value="">Selecione uma secretaria</option>
          {secretarias.map((sec) => (
            <option key={sec.id} value={sec.id}>{sec.nome}</option>
          ))}
        </select>
        <button type="submit" style={{ padding: "8px 12px", backgroundColor: isEditing ? "#28a745" : "#007BFF", color: "white", border: "none", cursor: "pointer" }}>
          {isEditing ? "Salvar" : "Adicionar"}
        </button>
      </form>
      <input 
        type="text" 
        placeholder="Pesquisar por nome, cargo, ramal, telefone ou secretaria" 
        value={searchTerm} 
        onChange={handleSearch} 
        style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
      />
      <ul style={{ listStyle: "none", padding: 0 }}>
        {filteredContacts.map((contato) => (
          <li key={contato.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px", borderBottom: "1px solid #ddd" }}>
            <span>{contato.nome} - {contato.cargo} - {contato.ramal} - {contato.telefone} {getSecretariaNome(contato.secretaria_id)}</span>
            <div>
              <button onClick={() => handleEdit(contato)} style={{ padding: "5px 10px", marginRight: "5px", backgroundColor: "#ffc107", color: "black", border: "none", cursor: "pointer" }}>Editar</button>
              <button onClick={() => handleDelete(contato.id)} style={{ padding: "5px 10px", backgroundColor: "red", color: "white", border: "none", cursor: "pointer" }}>Excluir</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
