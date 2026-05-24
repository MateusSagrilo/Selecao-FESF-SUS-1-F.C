from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Appointment, Patient
from app.schemas import AppointmentCreate, AppointmentResponse


router = APIRouter(
    prefix="/appointments",
    tags=["Appointments"]
)


@router.post(
    "/",
    response_model=AppointmentResponse,
    status_code=status.HTTP_201_CREATED
)
def create_appointment(
    appointment: AppointmentCreate,
    db: Session = Depends(get_db)
):
    patient = db.query(Patient).filter(
        Patient.id == appointment.patient_id
    ).first()

    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Paciente não encontrado."
        )

    db_appointment = Appointment(
        patient_id=appointment.patient_id,
        service_type=appointment.service_type,
        professional_name=appointment.professional_name,
        status=appointment.status,
        notes=appointment.notes
    )

    db.add(db_appointment)
    db.commit()
    db.refresh(db_appointment)

    return db_appointment


@router.get(
    "/",
    response_model=List[AppointmentResponse]
)
def list_appointments(
    db: Session = Depends(get_db)
):
    appointments = db.query(Appointment).order_by(
        Appointment.created_at.desc()
    ).all()

    return appointments


@router.get(
    "/{appointment_id}",
    response_model=AppointmentResponse
)
def get_appointment_by_id(
    appointment_id: int,
    db: Session = Depends(get_db)
):
    appointment = db.query(Appointment).filter(
        Appointment.id == appointment_id
    ).first()

    if not appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Atendimento não encontrado."
        )

    return appointment