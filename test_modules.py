import sys
sys.path.insert(0, 'backend')

from ai.risk_engine import risk_engine, RiskFactors
from ai.computer_vision import cv_engine
from ai.ml_predictor import predictor
from ai.rag_system import rag_system
from ai.iot_simulator import simulator

def test_risk_engine():
    print("\n=== Testing Risk Engine ===")
    factors = RiskFactors(
        temperature=28.5,
        gas_concentration=45.0,
        pressure=1.02,
        smoke=100.0,
        helmet_detection_rate=0.92,
        permit_status="active",
        machine_failure=False,
        worker_density=25,
        vibration=8.5,
        humidity=55.0,
        shift_time="morning"
    )
    
    risk_score, risk_level, reasons, recommendations = risk_engine.calculate_compound_risk(factors)
    print(f"Risk Score: {risk_score:.2f}")
    print(f"Risk Level: {risk_level}")
    print(f"Reasons: {reasons}")
    print(f"Recommendations: {recommendations}")

def test_computer_vision():
    print("\n=== Testing Computer Vision ===")
    import numpy as np
    frame = np.zeros((480, 640, 3), dtype=np.uint8)
    
    detections = cv_engine.process_frame(frame)
    print(f"Detections: {len(detections)}")
    for det in detections:
        print(f"  - {det.class_name}: {det.confidence:.2f}")
    
    stats = cv_engine.get_statistics(detections)
    print(f"Statistics: {stats}")

def test_ml_predictor():
    print("\n=== Testing ML Predictor ===")
    features = {
        "temperature": 25.0,
        "gas_concentration": 35.0,
        "pressure": 1.0,
        "smoke": 100.0,
        "helmet_detection": 0.9,
        "worker_density": 30,
        "vibration": 5.0,
        "humidity": 50.0
    }
    
    risk_level, confidence, risk_score = predictor.predict(features)
    print(f"Risk Level: {risk_level}")
    print(f"Confidence: {confidence:.3f}")
    print(f"Risk Score: {risk_score:.2f}")

def test_rag_system():
    print("\n=== Testing RAG System ===")
    
    questions = [
        "What should I do in case of fire?",
        "What PPE is required?",
        "How do I enter a confined space?",
    ]
    
    for question in questions:
        print(f"\nQ: {question}")
        result = rag_system.query(question)
        print(f"A: {result['answer'][:100]}...")
        print(f"Source: {result['source']}")

def test_iot_simulator():
    print("\n=== Testing IoT Simulator ===")
    
    # Generate normal readings
    readings = simulator.generate_batch(anomaly_probability=0.1)
    print(f"Generated {len(readings)} sensor readings")
    
    # Count by status
    normal = sum(1 for r in readings if r['status'] == 'normal')
    warning = sum(1 for r in readings if r['status'] == 'warning')
    critical = sum(1 for r in readings if r['status'] == 'critical')
    print(f"Status: Normal={normal}, Warning={warning}, Critical={critical}")
    
    # Generate emergency scenario
    print("\nGenerating emergency scenario...")
    emergency_readings = simulator.trigger_emergency_scenario()
    print(f"Generated {len(emergency_readings)} emergency readings")

if __name__ == "__main__":
    print("\n" + "="*50)
    print("Industrial Safety Intelligence Platform")
    print("AI/ML Module Tests")
    print("="*50)
    
    test_risk_engine()
    test_computer_vision()
    test_ml_predictor()
    test_rag_system()
    test_iot_simulator()
    
    print("\n" + "="*50)
    print("All tests completed successfully!")
    print("="*50)
