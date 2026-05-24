"use client";

import { useEffect, useState } from "react";

import { AppointmentsTable } from "@/components/AppointmentsTable";
import { PatientsTable } from "@/components/PatientsTable";
import {
  DashboardSummary,
  getDashboardSummary,
} from "@/services/api";


export default function HomePage() {
  const [dashboard, setDashboard] =
    useState<DashboardSummary | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  async function loadDashboard() {
    try {
      const data = await getDashboardSummary();

      setDashboard(data);
    } catch {
      setError("Erro ao carregar dashboard.");
    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    loadDashboard();
  }, []);


  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-800">
          Carregando dashboard...
        </p>
      </main>
    );
  }


  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-lg">
          {error}
        </p>
      </main>
    );
  }


  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Dashboard FESF-SUS
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">

          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
            <h2 className="text-gray-500 text-sm">
              Pacientes
            </h2>

            <p className="text-3xl font-bold mt-2 text-gray-900">
              {dashboard?.total_patients}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
            <h2 className="text-gray-500 text-sm">
              Atendimentos
            </h2>

            <p className="text-3xl font-bold mt-2 text-gray-900">
              {dashboard?.total_appointments}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
            <h2 className="text-gray-500 text-sm">
              Pendentes
            </h2>

            <p className="text-3xl font-bold mt-2 text-yellow-500">
              {dashboard?.pending_appointments}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
            <h2 className="text-gray-500 text-sm">
              Em andamento
            </h2>

            <p className="text-3xl font-bold mt-2 text-blue-500">
              {dashboard?.in_progress_appointments}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
            <h2 className="text-gray-500 text-sm">
              Concluídos
            </h2>

            <p className="text-3xl font-bold mt-2 text-green-500">
              {dashboard?.completed_appointments}
            </p>
          </div>

        </div>

        <PatientsTable onDataChange={loadDashboard} />

        <AppointmentsTable onDataChange={loadDashboard} />

      </div>
    </main>
  );
}