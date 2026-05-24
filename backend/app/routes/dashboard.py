from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Patient, Appointment

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)

@router.get("/")
def get_dashboard_summary(
    db: Session = Depends(get_db)
):
    total_patients = db.query(Patient).count()

    total_appointments = db.query(Appointment).count()

    pending_appointments = db.query(Appointment).filter(
        Appointment.status == "pending"
    ).count()

    in_progress_appointments = db.query(Appointment).filter(
        Appointment.status == "in_progress"
    ).count()

    completed_appointments = db.query(Appointment).filter(
        Appointment.status == "completed"
    ).count()

    return {
        "total_patients": total_patients,
        "total_appointments": total_appointments,
        "pending_appointments": pending_appointments,
        "in_progress_appointments": in_progress_appointments,
        "completed_appointments": completed_appointments,
    }

