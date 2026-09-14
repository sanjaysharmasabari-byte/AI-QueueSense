# AI QueueSense — Python ML Human Detection Engine

This directory contains the real-time Python Computer Vision & YOLOv8 Machine Learning pipeline for **AI QueueSense**.

## Requirements & Setup

1. **Install Python dependencies**:
   ```bash
   pip install -r python/requirements.txt
   ```

2. **Run the Camera YOLO Detector**:
   ```bash
   python3 python/camera_yolo_detector.py --camera 0 --location canteen
   ```

## Features

- **Real-Time Human Detection**: Uses YOLOv8 (or OpenCV HOG default fallback) to detect humans in webcam video frames.
- **Bounding Boxes & Labels**: Draws animated cyan bounding boxes (`Person 95%`) and head markers over every human target in real time.
- **Live Supabase Sync**: Automatically syncs the detected crowd count to the AI QueueSense backend API every 3 seconds, updating Student Overview, Staff Dashboard, Congestion Status, and Wait Times live!
