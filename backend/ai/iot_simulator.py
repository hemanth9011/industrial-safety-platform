"""IoT Simulator - Generates realistic sensor data"""
import random
from datetime import datetime
from typing import Dict, List
import uuid

class IoTSimulator:
    def __init__(self):
        self.zones = ["A", "B", "C", "D"]
        self.sensor_types = [
            "temperature",
            "pressure",
            "gas_concentration",
            "humidity",
            "smoke",
            "vibration",
            "power_usage",
        ]
        self.sensor_configs = {
            "temperature": {"min": 15, "max": 35, "unit": "°C", "optimal": (18, 25)},
            "pressure": {"min": 0.8, "max": 1.2, "unit": "bar", "optimal": (0.95, 1.05)},
            "gas_concentration": {"min": 0, "max": 500, "unit": "ppm", "optimal": (0, 20)},
            "humidity": {"min": 10, "max": 90, "unit": "%", "optimal": (30, 70)},
            "smoke": {"min": 0, "max": 1000, "unit": "ppm", "optimal": (0, 50)},
            "vibration": {"min": 0, "max": 50, "unit": "mm/s", "optimal": (0, 10)},
            "power_usage": {"min": 100, "max": 5000, "unit": "W", "optimal": (1000, 3000)},
        }

    def generate_reading(self, sensor_type: str, zone: str, anomaly: bool = False) -> Dict:
        """
        Generate a single sensor reading.
        If anomaly=True, reading will be outside optimal range.
        """
        config = self.sensor_configs[sensor_type]
        
        if anomaly:
            # Generate anomalous reading
            if random.random() > 0.5:
                value = random.uniform(config["min"], config["optimal"][0])
            else:
                value = random.uniform(config["optimal"][1], config["max"])
        else:
            # Generate normal reading
            value = random.uniform(config["optimal"][0], config["optimal"][1])
        
        # Add small noise
        value += random.gauss(0, (config["max"] - config["min"]) * 0.02)
        value = max(config["min"], min(config["max"], value))
        value = round(value, 2)
        
        # Determine status
        if config["optimal"][0] <= value <= config["optimal"][1]:
            status = "normal"
        elif config["min"] <= value < config["optimal"][0] or config["optimal"][1] < value <= config["max"]:
            status = "warning"
        else:
            status = "critical"
        
        return {
            "id": str(uuid.uuid4()),
            "sensor_id": f"sensor_{zone}_{sensor_type}",
            "sensor_type": sensor_type,
            "value": value,
            "unit": config["unit"],
            "zone": zone,
            "status": status,
            "timestamp": datetime.utcnow().isoformat(),
        }

    def generate_batch(self, anomaly_probability: float = 0.1) -> List[Dict]:
        """
        Generate a batch of sensor readings from all zones.
        """
        readings = []
        for zone in self.zones:
            for sensor_type in self.sensor_types:
                anomaly = random.random() < anomaly_probability
                reading = self.generate_reading(sensor_type, zone, anomaly)
                readings.append(reading)
        return readings

    def trigger_emergency_scenario(self) -> List[Dict]:
        """
        Generate readings that simulate an emergency scenario.
        """
        readings = []
        affected_zones = random.sample(self.zones, 2)  # Affect 2 zones
        
        for zone in affected_zones:
            # High temperature
            readings.append({
                "sensor_id": f"sensor_{zone}_temperature",
                "sensor_type": "temperature",
                "value": random.uniform(40, 50),
                "unit": "°C",
                "zone": zone,
                "status": "critical",
                "timestamp": datetime.utcnow().isoformat(),
            })
            # Gas leak
            readings.append({
                "sensor_id": f"sensor_{zone}_gas_concentration",
                "sensor_type": "gas_concentration",
                "value": random.uniform(200, 500),
                "unit": "ppm",
                "zone": zone,
                "status": "critical",
                "timestamp": datetime.utcnow().isoformat(),
            })
            # Smoke
            readings.append({
                "sensor_id": f"sensor_{zone}_smoke",
                "sensor_type": "smoke",
                "value": random.uniform(300, 800),
                "unit": "ppm",
                "zone": zone,
                "status": "critical",
                "timestamp": datetime.utcnow().isoformat(),
            })
        
        return readings

# Global simulator instance
simulator = IoTSimulator()
