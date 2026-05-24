from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Appointment, Patient
from app.schemas import (
    AppointmentCreate, 
    AppointmentResponse,
    AppointmentUpdate
)


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

    result = []

    for appointment in appointments:
        patient = db.query(Patient).filter(
            Patient.id == appointment.patient_id
        ).first()

        appointment_dict = {
            "id": appointment.id,
            "patient_id": appointment.patient_id,
            "patient_name": patient.name if patient else None,
            "service_type": appointment.service_type,
            "professional_name": appointment.professional_name,
            "status": appointment.status,
            "notes": appointment.notes,
            "created_at": appointment.created_at,
        }

        result.append(appointment_dict)

    return result


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

@router.put(
    "/{appointment_id}",
    response_model=AppointmentResponse
)

def update_appointment(
    appointment_id: int,
    appointment_data: AppointmentUpdate,
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

    update_data = appointment_data.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(appointment, field, value)

    db.commit()

    db.refresh(appointment)

    return appointment

    

@router.delete(
    "/{appointment_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def delete_appointment(
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

    db.delete(appointment)

    db.commit()

    return None