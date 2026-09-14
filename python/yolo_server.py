#!/usr/bin/env python3
"""
AI QueueSense — Real-Time YOLOv8 ML Computer Vision Server
------------------------------------------------------------
Standalone Python Machine Learning server powered by Ultralytics YOLOv8 & OpenCV.
Detects human targets dynamically in webcam frames, draws bounding boxes,
and pushes live crowd counts to the AI QueueSense Supabase database.

Usage:
    python3 python/yolo_server.py [--camera 0] [--location canteen] [--port 5000]
"""

import sys
import time
import argparse
import json
import threading
import urllib.request
import cv2
import numpy as np
from flask import Flask, jsonify, Response

# Initialize Flask App
app = Flask(__name__)

# Global Detector State
latest_people_count = 0
latest_fps = 0.0
is_camera_active = False
detector_lock = threading.Lock()

def parse_args():
    parser = argparse.ArgumentParser(description="AI QueueSense YOLOv8 Server")
    parser.add_argument("--camera", type=int, default=0, help="Camera index (0 for default webcam)")
    parser.add_argument("--location", type=str, default="canteen", help="Location ID (e.g. canteen, admin-office, library)")
    parser.add_argument("--api-url", type=str, default="http://localhost:3000/api/locations", help="AI QueueSense backend API endpoint")
    parser.add_argument("--port", type=int, default=5000, help="Flask server port")
    parser.add_argument("--conf", type=float, default=0.40, help="YOLO confidence detection threshold")
    return parser.parse_args()

def sync_to_supabase(api_url, location_id, count):
    """Sends HTTP PUT request to sync the detected human count to AI QueueSense Supabase database."""
    try:
        data = json.dumps({
            "id": location_id,
            "peopleCount": count,
            "lastUpdated": "Just now (Python YOLOv8 ML)"
        }).encode('utf-8')

        req = urllib.request.Request(
            api_url,
            data=data,
            headers={'Content-Type': 'application/json'},
            method='PUT'
        )
        with urllib.request.urlopen(req, timeout=3) as resp:
            pass
    except Exception:
        pass

def yolo_camera_loop(args):
    global latest_people_count, latest_fps, is_camera_active

    print(f"[*] Initializing YOLOv8 Object Detection Engine on Camera Index {args.camera}...")
    
    try:
        from ultralytics import YOLO
        yolo_model = YOLO("yolov8n.pt")
        print("[+] YOLOv8n model weights loaded successfully!")
    except Exception as e:
        print(f"[!] Ultralytics YOLOv8 import failed ({e}). Falling back to OpenCV HOG Detector.")
        yolo_model = None

    hog = None
    if not yolo_model:
        hog = cv2.HOGDescriptor()
        hog.setSVMDetector(cv2.HOGDescriptor_getDefaultPeopleDetector())

    cap = cv2.VideoCapture(args.camera)
    if not cap.isOpened():
        print(f"[ERROR] Unable to open camera at index {args.camera}. Check device connection.")
        return

    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)
    is_camera_active = True

    last_sync_time = 0
    fps_start_time = time.time()
    frame_count = 0

    print("\n========================================================")
    print("  AI QueueSense YOLOv8 Vision Pipeline Active")
    print(f"  Target Location: {args.location.upper()}")
    print("  Press 'q' or 'Esc' in GUI window to stop camera stream")
    print("========================================================\n")

    while is_camera_active:
        ret, frame = cap.read()
        if not ret or frame is None:
            time.sleep(0.1)
            continue

        frame_count += 1
        now = time.time()
        if now - fps_start_time >= 1.0:
            current_fps = frame_count / (now - fps_start_time)
            frame_count = 0
            fps_start_time = now
            with detector_lock:
                latest_fps = round(current_fps, 1)

        h, w, _ = frame.shape
        detected_boxes = []

        if yolo_model:
            # Run YOLOv8 inference on current camera frame
            results = yolo_model(frame, verbose=False, conf=args.conf)
            for result in results:
                boxes = result.boxes
                for box in boxes:
                    cls_id = int(box.cls[0].item())
                    conf = float(box.conf[0].item())
                    # Class ID 0 = 'person'
                    if cls_id == 0:
                        x1, y1, x2, y2 = map(int, box.xyxy[0].tolist())
                        detected_boxes.append((x1, y1, x2 - x1, y2 - y1, conf))
        else:
            # OpenCV HOG Fallback
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            boxes, weights = hog.detectMultiScale(gray, winStride=(8, 8), padding=(4, 4), scale=1.05)
            for (x, y, bw, bh), weight in zip(boxes, weights):
                if weight > 0.35:
                    detected_boxes.append((x, y, bw, bh, float(weight)))

        people_count = len(detected_boxes)

        with detector_lock:
            latest_people_count = people_count

        # Perspective Queue Polygon Overlay
        poly_pts = np.array([
            [int(w * 0.05), int(h * 0.15)],
            [int(w * 0.95), int(h * 0.15)],
            [int(w * 0.98), int(h * 0.95)],
            [int(w * 0.02), int(h * 0.95)]
        ], np.int32)
        
        overlay = frame.copy()
        cv2.fillPoly(overlay, [poly_pts], (254, 242, 0))
        cv2.addWeighted(overlay, 0.06, frame, 0.94, 0, frame)
        cv2.polylines(frame, [poly_pts], True, (254, 242, 0), 2, cv2.LINE_AA)

        # Draw Cyan Bounding Boxes & Confidence Tags for Detected Humans
        for i, (x, y, bw, bh, conf) in enumerate(detected_boxes):
            cv2.rectangle(frame, (x, y), (x + bw, y + bh), (254, 242, 0), 2)

            # Corner highlights
            cv2.rectangle(frame, (x - 2, y - 2), (x + 6, y + 6), (248, 189, 56), -1)
            cv2.rectangle(frame, (x + bw - 4, y - 2), (x + bw + 4, y + 6), (248, 189, 56), -1)
            cv2.rectangle(frame, (x - 2, y + bh - 4), (x + 6, y + bh + 4), (248, 189, 56), -1)
            cv2.rectangle(frame, (x + bw - 4, y + bh - 4), (x + bw + 4, y + bh + 4), (248, 189, 56), -1)

            # Label box
            label = f"Person {i+1} ({int(conf * 100)}%)"
            (tw, th), _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.5, 2)
            cv2.rectangle(frame, (x, max(0, y - 24)), (x + tw + 10, max(20, y)), (254, 242, 0), -1)
            cv2.putText(frame, label, (x + 4, max(15, y - 6)), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (18, 7, 3), 2, cv2.LINE_AA)

            # Center head marker dot
            cv2.circle(frame, (x + bw // 2, y + 20), 7, (248, 189, 56), -1)

        # Top Information HUD Overlay
        cv2.rectangle(frame, (12, 12), (440, 100), (18, 7, 3), -1)
        cv2.rectangle(frame, (12, 12), (440, 100), (254, 242, 0), 1)

        cv2.putText(frame, "AI QueueSense — YOLOv8 Vision Engine", (22, 38), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (254, 242, 0), 2)
        cv2.putText(frame, f"Location: {args.location.upper()} | FPS: {latest_fps}", (22, 63), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)
        cv2.putText(frame, f"HUMANS DETECTED: {people_count}", (22, 90), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 128), 2)

        # Show GUI Window
        cv2.imshow("AI QueueSense - Real-Time YOLOv8 Detector", frame)

        # Sync count to Supabase backend API every 2 seconds
        if now - last_sync_time >= 2.0:
            sync_to_supabase(args.api_url, args.location, people_count)
            last_sync_time = now

        key = cv2.waitKey(1) & 0xFF
        if key == ord('q') or key == 27:
            print("[*] User quit requested. Stopping camera loop.")
            is_camera_active = False
            break

    cap.release()
    cv2.destroyAllWindows()
    print("[+] YOLO Camera Engine shut down cleanly.")

# Flask Server API Routes
@app.route('/status', methods=['GET'])
def get_status():
    with detector_lock:
        return jsonify({
            "status": "LIVE" if is_camera_active else "OFFLINE",
            "detected_people_count": latest_people_count,
            "fps": latest_fps,
            "model": "YOLOv8n",
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
        })

def main():
    args = parse_args()
    
    # Start Camera Loop in Background Thread
    cam_thread = threading.Thread(target=yolo_camera_loop, args=(args,), daemon=True)
    cam_thread.start()

    print(f"[*] Starting AI QueueSense Flask ML API on http://localhost:{args.port}")
    app.run(host="0.0.0.0", port=args.port, debug=False, use_reloader=False)

if __name__ == "__main__":
    main()
