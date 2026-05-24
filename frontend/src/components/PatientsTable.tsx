"use client";

import { FormEvent, useEffect, useState } from "react";

import {
  createPatient,
  getPatients,
  Patient,
} from "@/services/api";


type PatientsTableProps = {
    onDataChange?: () => void;
  };

export function PatientsTable({onDataChange}: PatientsTableProps) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    cpf: "",
    birth_date: "",
    city: "",
    phone: "",
    health_card_number: "",
  });


  async function loadPatients() {
    try {
      const data = await getPatients();

      setPatients(data);
    } catch (err) {
      setError("Erro ao carregar pacientes.");
    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    loadPatients();
  }, []);


  async function handleCreatePatient(event: FormEvent) {
    event.preventDefault();

    setCreating(true);
    setError("");

    try {
      await createPatient(formData);

      setFormData({
        name: "",
        cpf: "",
        birth_date: "",
        city: "",
        phone: "",
        health_card_number: "",
      });

      await loadPatients();
      onDataChange?.();
    } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Erro ao cadastrar paciente.");
        }
      } finally {
        setCreating(false);
      }
  }


  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 mt-8">
        <p className="text-gray-700">Carregando pacientes...</p>
      </div>
    );
  }


  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 mt-8 overflow-x-auto">

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Pacientes Cadastrados
        </h2>
      </div>

      <form
        onSubmit={handleCreatePatient}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
      >
        <input
          type="text"
          placeholder="Nome"
          value={formData.name}
          onChange={(event) =>
            setFormData({ ...formData, name: event.target.value })
          }
          className="border border-gray-300 rounded-lg px-4 py-2 text-gray-900"
          required
        />

        <input
          type="text"
          placeholder="CPF"
          value={formData.cpf}
          onChange={(event) =>
            setFormData({ ...formData, cpf: event.target.value })
          }
          className="border border-gray-300 rounded-lg px-4 py-2 text-gray-900"
          required
        />

        <input
          type="date"
          value={formData.birth_date}
          onChange={(event) =>
            setFormData({ ...formData, birth_date: event.target.value })
          }
          className="border border-gray-300 rounded-lg px-4 py-2 text-gray-900"
          required
        />

        <input
          type="text"
          placeholder="Cidade"
          value={formData.city}
          onChange={(event) =>
            setFormData({ ...formData, city: event.target.value })
          }
          className="border border-gray-300 rounded-lg px-4 py-2 text-gray-900"
          required
        />

        <input
          type="text"
          placeholder="Telefone"
          value={formData.phone}
          onChange={(event) =>
            setFormData({ ...formData, phone: event.target.value })
          }
          className="border border-gray-300 rounded-lg px-4 py-2 text-gray-900"
        />

        <input
          type="text"
          placeholder="Cartão SUS"
          value={formData.health_card_number}
          onChange={(event) =>
            setFormData({
              ...formData,
              health_card_number: event.target.value,
            })
          }
          className="border border-gray-300 rounded-lg px-4 py-2 text-gray-900"
        />

        <button
          type="submit"
          disabled={creating}
          className="bg-blue-600 text-white rounded-lg px-4 py-2 font-semibold hover:bg-blue-700 disabled:opacity-60"
        >
          {creating ? "Cadastrando..." : "Cadastrar Paciente"}
        </button>
      </form>

      {error && (
        <p className="text-red-600 mb-4">
          {error}
        </p>
      )}

      <table className="w-full border-collapse">

        <thead>
          <tr className="border-b">

            <th className="text-left py-3 text-gray-700 font-semibold">
              Nome
            </th>

            <th className="text-left py-3 text-gray-700 font-semibold">
              CPF
            </th>

            <th className="text-left py-3 text-gray-700 font-semibold">
              Cidade
            </th>

            <th className="text-left py-3 text-gray-700 font-semibold">
              Telefone
            </th>

          </tr>
        </thead>

        <tbody>

          {patients.map((patient) => (
            <tr
              key={patient.id}
              className="border-b hover:bg-gray-50"
            >

              <td className="py-3 text-gray-800">
                {patient.name}
              </td>

              <td className="py-3 text-gray-800">
                {patient.cpf}
              </td>

              <td className="py-3 text-gray-800">
                {patient.city}
              </td>

              <td className="py-3 text-gray-800">
                {patient.phone || "-"}
              </td>

            </tr>
          ))}

        </tbody>
      </table>
    </div>
  );
}