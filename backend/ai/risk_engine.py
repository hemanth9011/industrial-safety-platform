"""Risk Engine - Compound Risk Calculation"""
import numpy as np
from typing import Dict, List, Tuple
from dataclasses import dataclass
from enum import Enum

class RiskLevel(str, Enum):
    GREEN = "green"
    YELLOW = "yellow"
    ORANGE = "orange"
    RED = "red"

@dataclass
class RiskFactors:
    temperature: float
    gas_concentration: float
    pressure: float
    smoke: float
    helmet_detection_rate: float
    permit_status: str
    machine_failure: bool
    worker_density: int
    vibration: float
    humidity: float
    shift_time: str  # morning, evening, night

class RiskEngine:
    def __init__(self):
        self.weights = {
            "temperature": 0.15,
            "gas": 0.20,
            "pressure": 0.10,
            "smoke": 0.15,
            "helmet": 0.15,
            "permit": 0.10,
            "machine": 0.10,
            "density": 0.05,
        }
        self.thresholds = {
            "low_risk": 30,
            "medium_risk": 60,
            "high_risk": 80,
        }

    def calculate_temperature_risk(self, temp: float) -> float:
        """Calculate risk from temperature (optimal 15-25°C)"""
        if 15 <= temp <= 25:
            return 0.0
        elif 10 <= temp < 15 or 25 < temp <= 35:
            return 30.0
        elif 5 <= temp < 10 or 35 < temp <= 45:
            return 60.0
        else:
            return 100.0

    def calculate_gas_risk(self, concentration: float) -> float:
        """Calculate risk from gas concentration (ppm)"""
        if concentration < 20:
            return 0.0
        elif 20 <= concentration < 50:
            return 25.0
        elif 50 <= concentration < 100:
            return 60.0
        else:
            return 100.0

    def calculate_pressure_risk(self, pressure: float) -> float:
        """Calculate risk from pressure deviation (bar)"""
        if 0.95 <= pressure <= 1.05:
            return 0.0
        elif 0.9 <= pressure < 0.95 or 1.05 < pressure <= 1.1:
            return 20.0
        else:
            return 80.0

    def calculate_smoke_risk(self, smoke: float) -> float:
        """Calculate risk from smoke (ppm)"""
        if smoke < 50:
            return 0.0
        elif 50 <= smoke < 200:
            return 40.0
        elif 200 <= smoke < 500:
            return 70.0
        else:
            return 100.0

    def calculate_helmet_risk(self, detection_rate: float) -> float:
        """Calculate risk from helmet detection (0-1)"""
        if detection_rate >= 0.95:
            return 0.0
        elif detection_rate >= 0.80:
            return 20.0
        elif detection_rate >= 0.60:
            return 50.0
        else:
            return 100.0

    def calculate_permit_risk(self, permit_status: str) -> float:
        """Calculate risk from permit status"""
        permit_risks = {
            "active": 0.0,
            "expiring_soon": 30.0,
            "expired": 80.0,
            "missing": 100.0,
        }
        return permit_risks.get(permit_status, 50.0)

    def calculate_machine_risk(self, machine_failure: bool) -> float:
        """Calculate risk from machine status"""
        return 100.0 if machine_failure else 0.0

    def calculate_density_risk(self, worker_count: int) -> float:
        """Calculate risk from worker density"""
        if worker_count <= 10:
            return 0.0
        elif 10 < worker_count <= 30:
            return 20.0
        elif 30 < worker_count <= 50:
            return 40.0
        else:
            return 80.0

    def calculate_compound_risk(self, factors: RiskFactors) -> Tuple[float, RiskLevel, List[str], List[str]]:
        """
        Calculate compound risk score considering all factors.
        Returns: (risk_score, risk_level, reasons, recommendations)
        """
        individual_risks = {
            "temperature": self.calculate_temperature_risk(factors.temperature),
            "gas": self.calculate_gas_risk(factors.gas_concentration),
            "pressure": self.calculate_pressure_risk(factors.pressure),
            "smoke": self.calculate_smoke_risk(factors.smoke),
            "helmet": self.calculate_helmet_risk(factors.helmet_detection_rate),
            "permit": self.calculate_permit_risk(factors.permit_status),
            "machine": self.calculate_machine_risk(factors.machine_failure),
            "density": self.calculate_density_risk(factors.worker_density),
        }

        # Calculate weighted risk score
        risk_score = sum(
            individual_risks[factor] * self.weights[factor]
            for factor in self.weights
        )

        # Determine risk level
        if risk_score < self.thresholds["low_risk"]:
            risk_level = RiskLevel.GREEN
        elif risk_score < self.thresholds["medium_risk"]:
            risk_level = RiskLevel.YELLOW
        elif risk_score < self.thresholds["high_risk"]:
            risk_level = RiskLevel.ORANGE
        else:
            risk_level = RiskLevel.RED

        # Generate reasons
        reasons = []
        if individual_risks["temperature"] > 30:
            reasons.append(f"Temperature {factors.temperature}°C outside safe range")
        if individual_risks["gas"] > 30:
            reasons.append(f"Gas concentration {factors.gas_concentration}ppm elevated")
        if individual_risks["helmet"] > 30:
            reasons.append(f"Helmet detection rate {factors.helmet_detection_rate*100:.1f}% below threshold")
        if individual_risks["smoke"] > 30:
            reasons.append(f"Smoke detected: {factors.smoke}ppm")
        if individual_risks["permit"] > 30:
            reasons.append(f"Permit status: {factors.permit_status}")
        if individual_risks["machine"] > 0:
            reasons.append("Machine failure detected")
        if individual_risks["density"] > 30:
            reasons.append(f"High worker density: {factors.worker_density} workers")

        # Generate recommendations
        recommendations = []
        if risk_score > 70:
            recommendations.append("CRITICAL: Evacuate zone immediately")
            recommendations.append("Contact emergency services")
        elif risk_score > 50:
            recommendations.append("WARNING: Increase monitoring")
            recommendations.append("Prepare evacuation procedures")
        else:
            recommendations.append("Continue standard operations with enhanced monitoring")

        if individual_risks["helmet"] > 50:
            recommendations.append("Enforce helmet wearing")
        if individual_risks["temperature"] > 50:
            recommendations.append("Improve ventilation")
        if individual_risks["gas"] > 50:
            recommendations.append("Check gas detection equipment")

        return risk_score, risk_level, reasons, recommendations

# Global risk engine instance
risk_engine = RiskEngine()
