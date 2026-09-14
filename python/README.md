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

### 2. Run the Camera YOLO Detector
```bash
python3 python/camera_yolo_detector.py --camera 0 --location canteen
```

## Options & Arguments

- `--camera 0`: Camera index (default: `0` for default laptop webcam, `1` for external USB camera, or RTSP stream URL).
- `--location canteen`: Campus location ID to update (`canteen`, `admin-office`, `library`, `student-services`, `fee-counter`, `transport-office`).
- `--api-url https://ai-queue-sense.vercel.app/api/locations`: Backend API endpoint to update live queue count.
- `--threshold 0.45`: Detection confidence threshold.

## Features

- **YOLOv8 & OpenCV Engine**: Uses YOLOv8 (or OpenCV HOG default fallback) to detect humans in video frames.
- **Real-Time Bounding Boxes**: Draws cyan bounding boxes (`Person 95%`) and head markers over every human target.
- **Live Supabase Sync**: Syncs detected crowd count to the AI QueueSense backend API every 3 seconds, updating Student Overview, Staff Dashboard, Congestion Status, and Wait Times live!
