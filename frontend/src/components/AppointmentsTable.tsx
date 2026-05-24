"use client";

import { FormEvent, useEffect, useState } from "react";

import {
  Appointment,
  createAppointment,
  getAppointments,
  getPatients,
  Patient,
  updateAppointmentStatus,
} from "@/services/api";

type AppointmentsTableProps = {
  onDataChange?: () => void;
};

export function AppointmentsTable({ onDataChange }: AppointmentsTableProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    patient_id: "",
    service_type: "",
    professional_name: "",
    status: "pending" as Appointment["status"],
    notes: "",
  });

  async function loadData() {
    try {
      const [appointmentsData, patientsData] = await Promise.all([
        getAppointments(),
        getPatients(),
      ]);

      setAppointments(appointmentsData);
      setPatients(patientsData);
    } catch {
      setError("Erro ao carregar atendimentos.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleCreateAppointment(event: FormEvent) {
    event.preventDefault();

    setCreating(true);
    setError("");

    try {
      await createAppointment({
        patient_id: Number(formData.patient_id),
        service_type: formData.service_type,
        professional_name: formData.professional_name,
        status: formData.status,
        notes: formData.notes,
      });

      setFormData({
        patient_id: "",
        service_type: "",
        professional_name: "",
        status: "pending",
        notes: "",
      });

      await loadData();
      onDataChange?.();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Erro ao cadastrar atendimento.");
      }
    } finally {
      setCreating(false);
    }
  }

  async function handleStatusChange(
    appointmentId: number,
    status: Appointment["status"],
  ) {
    try {
      await updateAppointmentStatus(appointmentId, status);

      await loadData();
      onDataChange?.();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Erro ao atualizar status.");
      }
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 mt-8">
        <p className="text-gray-700">Carregando atendimentos...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 mt-8 overflow-x-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Atendimentos</h2>

      <form
        onSubmit={handleCreateAppointment}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
      >
        <select
          value={formData.patient_id}
          onChange={(event) =>
            setFormData({ ...formData, patient_id: event.target.value })
          }
          className="border border-gray-300 rounded-lg px-4 py-2 text-gray-900"
          required
        >
          <option value="">Selecione o paciente</option>

          {patients.map((patient) => (
            <option key={patient.id} value={patient.id}>
              {patient.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Tipo de atendimento"
          value={formData.service_type}
          onChange={(event) =>
            setFormData({ ...formData, service_type: event.target.value })
          }
          className="border border-gray-300 rounded-lg px-4 py-2 text-gray-900"
          required
        />

        <input
          type="text"
          placeholder="Profissional responsável"
          value={formData.professional_name}
          onChange={(event) =>
            setFormData({ ...formData, professional_name: event.target.value })
          }
          className="border border-gray-300 rounded-lg px-4 py-2 text-gray-900"
          required
        />

        <select
          value={formData.status}
          onChange={(event) =>
            setFormData({
              ...formData,
              status: event.target.value as Appointment["status"],
            })
          }
          className="border border-gray-300 rounded-lg px-4 py-2 text-gray-900"
        >
          <option value="pending">Pendente</option>
          <option value="in_progress">Em andamento</option>
          <option value="completed">Concluído</option>
          <option value="cancelled">Cancelado</option>
        </select>

        <input
          type="text"
          placeholder="Observações"
          value={formData.notes}
          onChange={(event) =>
            setFormData({ ...formData, notes: event.target.value })
          }
          className="border border-gray-300 rounded-lg px-4 py-2 text-gray-900"
        />

        <button
          type="submit"
          disabled={creating}
          className="bg-blue-600 text-white rounded-lg px-4 py-2 font-semibold hover:bg-blue-700 disabled:opacity-60"
        >
          {creating ? "Cadastrando..." : "Cadastrar Atendimento"}
        </button>
      </form>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 text-gray-700 font-semibold">
              Paciente ID
            </th>

            <th className="text-left py-3 text-gray-700 font-semibold">Tipo</th>

            <th className="text-left py-3 text-gray-700 font-semibold">
              Profissional
            </th>

            <th className="text-left py-3 text-gray-700 font-semibold">
              Status
            </th>
          </tr>
        </thead>

        <tbody>
          {appointments.map((appointment) => (
            <tr key={appointment.id} className="border-b hover:bg-gray-50">
              <td className="py-3 text-gray-800">{appointment.patient_id}</td>

              <td className="py-3 text-gray-800">{appointment.service_type}</td>

              <td className="py-3 text-gray-800">
                {appointment.professional_name}
              </td>

              <td className="py-3 text-gray-800">
                <select
                  value={appointment.status}
                  onChange={(event) =>
                    handleStatusChange(
                      appointment.id,
                      event.target.value as Appointment["status"],
                    )
                  }
                  className="border border-gray-300 rounded-lg px-3 py-1 text-gray-900"
                >
                  <option value="pending">Pendente</option>
                  <option value="in_progress">Em andamento</option>
                  <option value="completed">Concluído</option>
                  <option value="cancelled">Cancelado</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
