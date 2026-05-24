from datetime import date, datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, field_validator


class PatientBase(BaseModel):
    name: str
    cpf: str
    birth_date: date
    city: str
    phone: Optional[str] = None
    health_card_number: Optional[str] = None

    @field_validator("name")
    @classmethod
    def validate_name(cls, value: str):
        if not value.strip():
            raise ValueError("O nome é obrigatório.")

        if any(char.isdigit() for char in value):
            raise ValueError("O nome não pode conter números.")

        return value.strip()

    @field_validator("city")
    @classmethod
    def validate_city(cls, value: str):
        if not value.strip():
            raise ValueError("A cidade é obrigatória.")

        if any(char.isdigit() for char in value):
            raise ValueError("A cidade não pode conter números.")

        return value.strip()

    @field_validator("cpf")
    @classmethod
    def validate_cpf(cls, value: str):
        cpf = "".join(filter(str.isdigit, value))

        if len(cpf) != 11:
            raise ValueError("O CPF deve conter exatamente 11 números.")

        return cpf

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, value: Optional[str]):
        if value is None or value == "":
            return None

        phone = "".join(filter(str.isdigit, value))

        if len(phone) < 10 or len(phone) > 11:
            raise ValueError("O telefone deve conter 10 ou 11 números.")

        return phone

    @field_validator("health_card_number")
    @classmethod
    def validate_health_card_number(cls, value: Optional[str]):
        if value is None or value == "":
            return None

        card_number = "".join(filter(str.isdigit, value))

        if len(card_number) < 3:
            raise ValueError("O cartão SUS deve conter apenas números válidos.")

        return card_number


class PatientCreate(PatientBase):
    pass


class PatientUpdate(BaseModel):
    name: Optional[str] = None
    cpf: Optional[str] = None
    birth_date: Optional[date] = None
    city: Optional[str] = None
    phone: Optional[str] = None
    health_card_number: Optional[str] = None

    @field_validator("name")
    @classmethod
    def validate_name(cls, value: Optional[str]):
        if value is None:
            return value

        if not value.strip():
            raise ValueError("O nome não pode ser vazio.")

        if any(char.isdigit() for char in value):
            raise ValueError("O nome não pode conter números.")

        return value.strip()

    @field_validator("city")
    @classmethod
    def validate_city(cls, value: Optional[str]):
        if value is None:
            return value

        if not value.strip():
            raise ValueError("A cidade não pode ser vazia.")

        if any(char.isdigit() for char in value):
            raise ValueError("A cidade não pode conter números.")

        return value.strip()

    @field_validator("cpf")
    @classmethod
    def validate_cpf(cls, value: Optional[str]):
        if value is None:
            return value

        cpf = "".join(filter(str.isdigit, value))

        if len(cpf) != 11:
            raise ValueError("O CPF deve conter exatamente 11 números.")

        return cpf

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, value: Optional[str]):
        if value is None or value == "":
            return None

        phone = "".join(filter(str.isdigit, value))

        if len(phone) < 10 or len(phone) > 11:
            raise ValueError("O telefone deve conter 10 ou 11 números.")

        return phone

    @field_validator("health_card_number")
    @classmethod
    def validate_health_card_number(cls, value: Optional[str]):
        if value is None or value == "":
            return None

        card_number = "".join(filter(str.isdigit, value))

        if len(card_number) < 3:
            raise ValueError("O cartão SUS deve conter apenas números válidos.")

        return card_number


class PatientResponse(PatientBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class AppointmentStatus(str, Enum):
    pending = "pending"
    in_progress = "in_progress"
    completed = "completed"
    cancelled = "cancelled"


class AppointmentBase(BaseModel):
    patient_id: int
    service_type: str
    professional_name: str
    status: AppointmentStatus = AppointmentStatus.pending
    notes: Optional[str] = None


class AppointmentCreate(AppointmentBase):
    pass


class AppointmentUpdate(BaseModel):
    service_type: Optional[str] = None
    professional_name: Optional[str] = None
    status: Optional[AppointmentStatus] = None
    notes: Optional[str] = None


class AppointmentResponse(AppointmentBase):
    id: int
    created_at: datetime
    patient_name: Optional[str] = None

    class Config:
        from_attributes = True