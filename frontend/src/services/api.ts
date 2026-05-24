const API_BASE_URL = "http://127.0.0.1:8000";

export type Patient = {
  id: number;
  name: string;
  cpf: string;
  birth_date: string;
  city: string;
  phone?: string | null;
  health_card_number?: string | null;
  created_at: string;
};

export type CreatePatientData = {
  name: string;
  cpf: string;
  birth_date: string;
  city: string;
  phone?: string;
  health_card_number?: string;
};

export type Appointment = {
  id: number;
  patient_id: number;
  patient_name?: string;
  service_type: string;
  professional_name: string;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  notes?: string | null;
  created_at: string;
};

export type CreateAppointmentData = {
  patient_id: number;
  service_type: string;
  professional_name: string;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  notes?: string;
};

export type DashboardSummary = {
  total_patients: number;
  total_appointments: number;
  pending_appointments: number;
  in_progress_appointments: number;
  completed_appointments: number;
};

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const response = await fetch(`${API_BASE_URL}/dashboard/`);

  if (!response.ok) {
    throw new Error("Erro ao buscar resumo do dashboard");
  }

  return response.json();
}

export async function getPatients(): Promise<Patient[]> {
  const response = await fetch(`${API_BASE_URL}/patients/`);

  if (!response.ok) {
    throw new Error("Erro ao buscar pacientes");
  }

  return response.json();
}

export async function getAppointments(): Promise<Appointment[]> {
  const response = await fetch(`${API_BASE_URL}/appointments/`);

  if (!response.ok) {
    throw new Error("Erro ao buscar atendimentos");
  }

  return response.json();
}

export async function createPatient(data: CreatePatientData): Promise<Patient> {
  const response = await fetch(`${API_BASE_URL}/patients/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();

    throw new Error(errorData.detail || "Erro ao cadastrar paciente");
  }

  return response.json();
}

export async function createAppointment(
  data: CreateAppointmentData,
): Promise<Appointment> {
  const response = await fetch(`${API_BASE_URL}/appointments/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();

    throw new Error(errorData.detail || "Erro ao cadastrar atendimento");
  }

  return response.json();
}

export async function updateAppointmentStatus(
  appointmentId: number,
  status: CreateAppointmentData["status"],
): Promise<Appointment> {
  const response = await fetch(
    `${API_BASE_URL}/appointments/${appointmentId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    },
  );

  if (!response.ok) {
    const errorData = await response.json();

    throw new Error(errorData.detail || "Erro ao atualizar atendimento");
  }

  return response.json();
}
