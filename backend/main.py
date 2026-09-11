"""
AI QueueSense - FastAPI Backend Service & Real-Time WebSocket Server
---------------------------------------------------------------------
Provides REST API endpoints and WebSocket live streaming for YOLOv8 camera feeds,
queue density calculations, wait time predictions, and smart alerts.
"""

import asyncio
import json
import random
import time
from typing import List, Dict, Any
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(
    title="AI QueueSense API",
    description="Real-time Campus Queue Management & Computer Vision Inference Service",
    version="2.4.0",
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Seed Mock Data for REST API endpoints
LOCATIONS_DB = [
    {
        "id": "canteen",
        "name": "Canteen",
        "category": "Dining",
        "status": "Medium",
        "peopleCount": 42,
        "maxCapacity": 65,
        "estimatedWaitMin": 12,
        "queueDensityPercent": 65,
        "avgServiceTimeSec": 17,
        "cameraCode": "CAM-01",
        "recommendedTimeWindow": "3:30 PM – 4:00 PM",
    },
    {
        "id": "admin-office",
        "name": "Administrative Office",
        "category": "Admin",
        "status": "High",
        "peopleCount": 67,
        "maxCapacity": 75,
        "estimatedWaitMin": 21,
        "queueDensityPercent": 89,
        "avgServiceTimeSec": 45,
        "cameraCode": "CAM-03",
        "recommendedTimeWindow": "9:00 AM – 10:00 AM",
    },
    {
        "id": "library",
        "name": "Central Library",
        "category": "Academic",
        "status": "Low",
        "peopleCount": 18,
        "maxCapacity": 50,
        "estimatedWaitMin": 4,
        "queueDensityPercent": 36,
        "avgServiceTimeSec": 12,
        "cameraCode": "CAM-02",
        "recommendedTimeWindow": "Current time is optimal",
    },
    {
        "id": "student-services",
        "name": "Student Services",
        "category": "Services",
        "status": "Medium",
        "peopleCount": 34,
        "maxCapacity": 55,
        "estimatedWaitMin": 10,
        "queueDensityPercent": 61,
        "avgServiceTimeSec": 25,
        "cameraCode": "CAM-04",
        "recommendedTimeWindow": "2:00 PM – 3:00 PM",
    },
    {
        "id": "fee-counter",
        "name": "Fee Counter",
        "category": "Finance",
        "status": "Low",
        "peopleCount": 14,
        "maxCapacity": 45,
        "estimatedWaitMin": 3,
        "queueDensityPercent": 31,
        "avgServiceTimeSec": 20,
        "cameraCode": "CAM-06",
        "recommendedTimeWindow": "Current time is optimal",
    },
    {
        "id": "transport-office",
        "name": "Transport Office",
        "category": "Transit",
        "status": "Low",
        "peopleCount": 12,
        "maxCapacity": 40,
        "estimatedWaitMin": 3,
        "queueDensityPercent": 30,
        "avgServiceTimeSec": 15,
        "cameraCode": "CAM-05",
        "recommendedTimeWindow": "Current time is optimal",
    },
]

CAMERAS_DB = [
    {"id": "cam-01", "code": "CAM-01", "locationId": "canteen", "status": "LIVE", "fps": 4.8, "latency": 42},
    {"id": "cam-02", "code": "CAM-02", "locationId": "library", "status": "LIVE", "fps": 5.0, "latency": 38},
    {"id": "cam-03", "code": "CAM-03", "locationId": "admin-office", "status": "LIVE", "fps": 4.2, "latency": 55},
    {"id": "cam-04", "code": "CAM-04", "locationId": "student-services", "status": "UNSTABLE", "fps": 2.1, "latency": 110},
    {"id": "cam-05", "code": "CAM-05", "locationId": "transport-office", "status": "LIVE", "fps": 5.0, "latency": 34},
    {"id": "cam-06", "code": "CAM-06", "locationId": "fee-counter", "status": "LIVE", "fps": 4.6, "latency": 40},
]


@app.get("/")
def read_root():
    return {
        "service": "AI QueueSense FastAPI Backend",
        "status": "Operational",
        "version": "2.4.0",
        "documentation": "/docs"
    }


@app.get("/api/v1/health")
def health_check():
    return {"status": "healthy", "timestamp": time.time()}


@app.get("/api/v1/queues")
def get_all_queues():
    """Returns real-time queue congestion data across all campus counters."""
    return {"locations": LOCATIONS_DB}


@app.get("/api/v1/queues/{location_id}")
def get_queue_by_id(location_id: str):
    for loc in LOCATIONS_DB:
        if loc["id"] == location_id:
            return loc
    raise HTTPException(status_code=404, detail="Location not found")


@app.get("/api/v1/predict/{location_id}")
def get_ai_prediction(location_id: str):
    loc = next((l for l in LOCATIONS_DB if l["id"] == location_id), None)
    if not loc:
        raise HTTPException(status_code=404, detail="Location not found")

    count = loc["peopleCount"]
    wait = loc["estimatedWaitMin"]

    return {
        "locationId": location_id,
        "locationName": loc["name"],
        "currentQueue": count,
        "predictedWaitMin": wait,
        "next15MinWait": max(1, wait + random.randint(-2, 3)),
        "next30MinWait": max(1, wait + random.randint(-4, 5)),
        "trend": "Increasing" if count > 40 else "Stable",
        "confidenceScore": 94,
        "recommendedAction": "Consider opening an auxiliary counter if count exceeds 60.",
        "explanation": f"Prediction calculated from YOLO density ({loc['queueDensityPercent']}%) and historical rush-hour patterns."
    }


@app.get("/api/v1/cameras")
def get_camera_feeds():
    return {"cameras": CAMERAS_DB}


# WebSocket Manager for Real-Time Streaming
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)


manager = ConnectionManager()


@app.websocket("/ws/queues")
async def websocket_queue_stream(websocket: WebSocket):
    """
    WebSocket endpoint streaming live queue count updates and simulated bounding box frames.
    """
    await manager.connect(websocket)
    try:
        while True:
            # Simulate real-time inference updates every 3 seconds
            await asyncio.sleep(3)
            
            # Mutate random location count slightly
            loc = random.choice(LOCATIONS_DB)
            delta = random.randint(-3, 4)
            loc["peopleCount"] = max(5, min(80, loc["peopleCount"] + delta))
            loc["queueDensityPercent"] = min(100, int((loc["peopleCount"] / loc["maxCapacity"]) * 100))
            loc["estimatedWaitMin"] = max(1, int((loc["peopleCount"] * loc["avgServiceTimeSec"]) / 120))
            
            if loc["peopleCount"] > 60:
                loc["status"] = "High"
            elif loc["peopleCount"] > 30:
                loc["status"] = "Medium"
            else:
                loc["status"] = "Low"

            payload = {
                "event": "QUEUE_UPDATE",
                "timestamp": time.time(),
                "location": loc
            }
            await websocket.send_text(json.dumps(payload))
    except WebSocketDisconnect:
        manager.disconnect(websocket)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
