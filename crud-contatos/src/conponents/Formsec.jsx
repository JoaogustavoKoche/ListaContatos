import React, { useState, useEffect } from 'react';

export default function FormSec() {
    const [secretarias, setSecretarias] = useState([]);
    const [form, setForm] = useState({ id: null, nome: "" });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetch("http://localhost:5000/secretarias")
            .then((res) => res.json())
            .then((data) => setSecretarias(data))
            .catch((err) => console.error("Erro ao buscar secretarias:", err));
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isEditing) {
            await fetch(`http://localhost:5000/secretarias/${form.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nome: form.nome }),
            });

            setSecretarias(secretarias.map((secretaria) => 
                (secretaria.id === form.id ? form : secretaria)
            ));
            setIsEditing(false);
        } else {
            const response = await fetch("http://localhost:5000/secretarias", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nome: form.nome }),
            });

            if (response.ok) {
                const newSecretaria = await response.json();
                setSecretarias([...secretarias, newSecretaria]);
            } else {
                console.error("Erro ao criar secretaria:", response.status);
            }
        }

        setForm({ id: null, nome: "" });
    }

    const handleEdit = (secretaria) => {
        setForm(secretaria);
        setIsEditing(true);
    }

    const handleDelete = async (id) => {
        await fetch(`http://localhost:5000/secretarias/${id}`, { method: "DELETE" });
        setSecretarias(secretarias.filter((secretaria) => secretaria.id !== id));
    }

    const filteredSec = secretarias.filter(secretaria => secretaria.nome);

    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h1>{isEditing ? "Editar Secretaria" : "Gerenciar Secretaria"}</h1>

            <form 
                onSubmit={handleSubmit} 
                style={{ marginBottom: "20px", display: "flex", gap: "10px", flexWrap: "wrap" }}
            >
                <input 
                    name="nome" 
                    placeholder="Nome Secretaria" 
                    value={form.nome || ""}  // Protege para não ser undefined
                    onChange={handleChange} 
                    required 
                    style={{ padding: "8px" }} 
                />
                <button 
                    type='submit' 
                    style={{ padding: "8px 12px", backgroundColor: isEditing ? "#28a745" : "#007BFF", color: "white", border: "none", cursor: "pointer" }}
                >
                    {isEditing ? "Salvar" : "Adicionar"}
                </button>
            </form>

            <ul style={{ listStyle: "none", padding: 0 }}>
                {filteredSec.map((secretaria) => (
                    <li key={secretaria.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px", borderBottom: "1px solid #ddd" }}>
                        <span>{secretaria.nome}</span>
                        <div>
                            <button 
                                onClick={() => handleEdit(secretaria)} 
                                style={{ padding: "5px 10px", marginRight: "5px", backgroundColor: "#ffc107", color: "black", border: "none", cursor: "pointer" }}
                            >
                                Editar
                            </button>
                            <button 
                                onClick={() => handleDelete(secretaria.id)} 
                                style={{ padding: "5px 10px", backgroundColor: "red", color: "white", border: "none", cursor: "pointer" }}
                            >
                                Excluir
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
