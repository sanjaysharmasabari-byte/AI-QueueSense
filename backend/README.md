# AI QueueSense - Python FastAPI & YOLOv8 Vision Backend

This directory contains the Python FastAPI service and OpenCV/YOLOv8 computer vision engine for **AI QueueSense**.

---

## 🏗 Architecture Overview

```
[ IP / USB Cameras ] (RTSP / Webcam feed)
         │
         ▼
[ YOLOv8 Detector ] (Counts people per region via OpenCV)
         │
         ▼
[ FastAPI Backend + DB ] (Stores live counts, history, provides WebSocket)
         │
         ▼
[ Next.js Dashboard ] (Polls or subscribes for live data)
```

---

## 🚀 How to Run the Backend

1. **Navigate to the `backend/` directory:**
   ```bash
   cd backend
   ```

2. **Create a virtual environment:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Start the FastAPI server:**
   ```bash
   uvicorn main:app --reload --port 8000
   ```

5. **Access Interactive API Docs:**
   - Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
   - ReDoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)
   - WebSocket Stream: `ws://localhost:8000/ws/queues`

---

## 📌 REST API Endpoints

- `GET /api/v1/health` - Health check
- `GET /api/v1/queues` - Get all campus queue congestion metrics
- `GET /api/v1/queues/{location_id}` - Get specific queue location details
- `GET /api/v1/predict/{location_id}` - Get AI-assisted wait predictions and visit timing
- `GET /api/v1/cameras` - Get camera stream metadata
- `WS /ws/queues` - Real-time WebSocket live queue update stream
