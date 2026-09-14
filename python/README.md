# AI QueueSense — Python ML Human Detection Engine

This directory contains the real-time Python Computer Vision & YOLOv8 Machine Learning pipeline for **AI QueueSense**.

## Requirements & Setup on macOS / Linux / Windows

On macOS, system Python uses `python3` and `python3 -m pip`.

### 1. Install Dependencies
```bash
python3 -m pip install -r python/requirements.txt
```

*Or create a virtual environment first:*
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r python/requirements.txt
```

### 2. Run the YOLOv8 ML Detection Server
```bash
python3 python/yolo_server.py --camera 0 --location canteen
```

## Options & Arguments

- `--camera 0`: Camera index (`0` for default webcam, `1` for USB webcam, or RTSP stream URL).
- `--location canteen`: Campus location ID to update (`canteen`, `admin-office`, `library`, `student-services`, `fee-counter`, `transport-office`).
- `--api-url https://ai-queue-sense.vercel.app/api/locations`: Backend API endpoint to update live queue count.
- `--port 5000`: Flask status API server port.
- `--conf 0.40`: YOLOv8 detection confidence threshold.

## Features

- **YOLOv8 & OpenCV Engine**: Uses YOLOv8 (`yolov8n.pt`) to detect humans in video frames.
- **Dynamic Real-Time Bounding Boxes**: Detects the exact number of people in frame (0, 1, 2, 3, etc.) and draws animated cyan bounding boxes (`Person 1 (96%)`).
- **Live Supabase Sync**: Syncs detected crowd count to the AI QueueSense backend API every 2 seconds, updating Student Overview, Staff Dashboard, Congestion Status, and Wait Times live!
