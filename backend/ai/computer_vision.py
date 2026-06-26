"""Computer Vision Module - YOLOv8 Integration"""
import cv2
import numpy as np
from typing import List, Dict, Tuple
from dataclasses import dataclass
from pathlib import Path

@dataclass
class Detection:
    class_name: str
    confidence: float
    bbox: Tuple[int, int, int, int]  # x1, y1, x2, y2
    is_critical: bool = False

class ComputerVisionEngine:
    def __init__(self, model_path: str = None):
        """Initialize CV engine"""
        self.model_path = model_path or "models/yolov8n.pt"
        self.classes = {
            0: "person",
            1: "helmet",
            2: "no_helmet",
            3: "vest",
            4: "no_vest",
            5: "restricted_area",
            6: "smoke",
            7: "fire",
        }
        self.critical_detections = {"no_helmet", "no_vest", "fire", "smoke", "restricted_area"}

    def process_frame(self, frame: np.ndarray) -> List[Detection]:
        """
        Process a video frame and return detections.
        For demo purposes, simulate detections.
        """
        detections = []
        
        # Simulate detections
        height, width = frame.shape[:2]
        
        # Random person detection
        if np.random.random() > 0.3:
            x1, y1 = int(width * 0.1), int(height * 0.2)
            x2, y2 = int(width * 0.3), int(height * 0.8)
            detections.append(Detection(
                class_name="person",
                confidence=0.92,
                bbox=(x1, y1, x2, y2),
            ))

        # Random helmet detection
        if np.random.random() > 0.4:
            if np.random.random() > 0.7:  # Sometimes missing helmet
                detections.append(Detection(
                    class_name="no_helmet",
                    confidence=0.88,
                    bbox=(int(width * 0.1), int(height * 0.15), int(width * 0.2), int(height * 0.3)),
                    is_critical=True,
                ))
            else:
                detections.append(Detection(
                    class_name="helmet",
                    confidence=0.85,
                    bbox=(int(width * 0.1), int(height * 0.15), int(width * 0.2), int(height * 0.3)),
                ))

        # Random vest detection
        if np.random.random() > 0.5:
            if np.random.random() > 0.8:  # Sometimes missing vest
                detections.append(Detection(
                    class_name="no_vest",
                    confidence=0.80,
                    bbox=(int(width * 0.1), int(height * 0.3), int(width * 0.2), int(height * 0.7)),
                    is_critical=True,
                ))
            else:
                detections.append(Detection(
                    class_name="vest",
                    confidence=0.87,
                    bbox=(int(width * 0.1), int(height * 0.3), int(width * 0.2), int(height * 0.7)),
                ))

        # Random fire/smoke detection
        if np.random.random() > 0.95:
            detections.append(Detection(
                class_name="smoke",
                confidence=0.90,
                bbox=(int(width * 0.4), int(height * 0.1), int(width * 0.6), int(height * 0.4)),
                is_critical=True,
            ))

        return detections

    def draw_detections(self, frame: np.ndarray, detections: List[Detection]) -> np.ndarray:
        """Draw detection boxes on frame"""
        frame_copy = frame.copy()
        
        for detection in detections:
            x1, y1, x2, y2 = detection.bbox
            color = (0, 0, 255) if detection.is_critical else (0, 255, 0)  # Red for critical, green otherwise
            
            # Draw box
            cv2.rectangle(frame_copy, (x1, y1), (x2, y2), color, 2)
            
            # Draw label
            label = f"{detection.class_name} {detection.confidence:.2f}"
            cv2.putText(frame_copy, label, (x1, y1 - 10),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)
        
        return frame_copy

    def get_statistics(self, detections: List[Detection]) -> Dict:
        """Get detection statistics"""
        total_persons = sum(1 for d in detections if d.class_name == "person")
        helmets_worn = sum(1 for d in detections if d.class_name == "helmet")
        no_helmets = sum(1 for d in detections if d.class_name == "no_helmet")
        vests_worn = sum(1 for d in detections if d.class_name == "vest")
        no_vests = sum(1 for d in detections if d.class_name == "no_vest")
        critical_detections = sum(1 for d in detections if d.is_critical)
        
        helmet_compliance = (helmets_worn / total_persons * 100) if total_persons > 0 else 0
        vest_compliance = (vests_worn / total_persons * 100) if total_persons > 0 else 0
        
        return {
            "total_persons": total_persons,
            "helmets_worn": helmets_worn,
            "no_helmets": no_helmets,
            "vests_worn": vests_worn,
            "no_vests": no_vests,
            "helmet_compliance": round(helmet_compliance, 2),
            "vest_compliance": round(vest_compliance, 2),
            "critical_detections": critical_detections,
        }

# Global CV engine instance
cv_engine = ComputerVisionEngine()
