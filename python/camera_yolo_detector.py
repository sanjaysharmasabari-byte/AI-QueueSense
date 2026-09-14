#!/usr/bin/env python3
"""
AI QueueSense — Real-Time YOLOv8 & OpenCV Human Detection System
------------------------------------------------------------------
This script connects to your local webcam or IP camera feed, runs real-time
human detection using YOLOv8 or OpenCV HOG Person Detector, displays live bounding
boxes on human targets, and syncs queue counts directly to the AI QueueSense backend / Supabase.

Usage:
    python3 camera_yolo_detector.py [--camera 0] [--location canteen] [--api-url https://ai-queue-sense.vercel.app/api/locations]
"""

import sys
import time
import argparse
import json
import urllib.request
import urllib.parse
import cv2
import numpy as np

# Try importing YOLOv8 from ultralytics
USE_YOLO = False
try:
    from ultralytics import YOLO
    USE_YOLO = True
    print("[+] Ultralytics YOLOv8 library detected. Using YOLOv8 object detection engine.")
except ImportError:
    print("[!] Ultralytics library not installed. Falling back to OpenCV HOG Human Detector.")

def parse_args():
    parser = argparse.ArgumentParser(description="AI QueueSense Human Detector")
    parser.add_argument("--camera", type=int, default=0, help="Camera index (default: 0 for default webcam)")
    parser.add_argument("--location", type=str, default="canteen", help="Location ID to update (e.g. canteen, admin-office, library)")
    parser.add_argument("--api-url", type=str, default="http://localhost:3000/api/locations", help="API URL to update queue counts")
    parser.add_argument("--threshold", type=float, default=0.45, help="Confidence detection threshold (0.0 - 1.0)")
    return parser.parse_args()

def sync_count_to_api(api_url, location_id, count):
    """Sends HTTP PUT request to sync the detected human count to AI QueueSense Supabase backend."""
    try:
        data = json.dumps({
            "id": location_id,
            "peopleCount": count,
            "lastUpdated": "Just now (Python YOLO ML)"
        }).encode('utf-8')

        req = urllib.request.Request(
            api_url,
            data=data,
            headers={'Content-Type': 'application/json'},
            method='PUT'
        )
        with urllib.request.urlopen(req, timeout=3) as resp:
            if resp.status == 200:
                print(f"[API SYNC SUCCESS] Location '{location_id}' updated to {count} people in Supabase.")
    except Exception as e:
        # Ignore silent sync errors during development loop
        pass

def main():
    args = parse_args()
    print(f"[*] Starting AI QueueSense Camera Feed (Camera Index: {args.camera})...")
    
    cap = cv2.VideoCapture(args.camera)
    if not cap.isOpened():
        print(f"[ERROR] Could not open camera device at index {args.camera}. Please verify webcam connection.")
        sys.exit(1)

    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)

    # Initialize detection model
    yolo_model = None
    hog = None

    if USE_YOLO:
        print("[*] Loading YOLOv8n object detection model weights...")
        try:
            yolo_model = YOLO("yolov8n.pt")
            print("[+] YOLOv8 model loaded successfully!")
        except Exception as e:
            print(f"[!] Failed to load YOLOv8 model weights ({e}). Falling back to HOG Detector.")
            USE_YOLO = False

    if not USE_YOLO:
        hog = cv2.HOGDescriptor()
        hog.setSVMDetector(cv2.HOGDescriptor_getDefaultPeopleDetector())
        print("[+] OpenCV HOG Person Detector initialized.")

    last_sync_time = 0
    fps_start_time = time.time()
    frame_count = 0
    fps = 0.0

    print("\n========================================================")
    print("  AI QueueSense Live Optical Intelligence Running")
    print("  Press 'q' or 'Esc' in the video window to stop")
    print("========================================================\n")

    while True:
        ret, frame = cap.read()
        if not ret or frame is None:
            print("[!] Empty frame received from camera. Retrying...")
            time.sleep(0.1)
            continue

        frame_count += 1
        if time.time() - fps_start_time >= 1.0:
            fps = frame_count / (time.time() - fps_start_time)
            frame_count = 0
            fps_start_time = time.time()

        h, w, _ = frame.shape
        detected_boxes = []

        if yolo_model:
            # Run YOLOv8 detection
            results = yolo_model(frame, verbose=False, conf=args.threshold)
            for result in results:
                boxes = result.boxes
                for box in boxes:
                    cls_id = int(box.cls[0].item())
                    conf = float(box.conf[0].item())
                    # COCO class 0 is 'person'
                    if cls_id == 0:
                        x1, y1, x2, y2 = map(int, box.xyxy[0].tolist())
                        detected_boxes.append((x1, y1, x2 - x1, y2 - y1, conf))
        else:
            # Run OpenCV HOG Detection
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            boxes, weights = hog.detectMultiScale(gray, winStride=(8, 8), padding=(4, 4), scale=1.05)
            for (x, y, bw, bh), weight in zip(boxes, weights):
                if weight > 0.3:
                    detected_boxes.append((x, y, bw, bh, float(weight)))

        people_count = len(detected_boxes)

        # Draw Queue Region Polygon Overlay
        poly_pts = np.array([
            [int(w * 0.05), int(h * 0.15)],
            [int(w * 0.95), int(h * 0.15)],
            [int(w * 0.98), int(h * 0.95)],
            [int(w * 0.02), int(h * 0.95)]
        ], np.int32)
        
        # Transparent cyan polygon overlay
        overlay = frame.copy()
        cv2.fillPoly(overlay, [poly_pts], (254, 242, 0))
        cv2.addWeighted(overlay, 0.08, frame, 0.92, 0, frame)
        cv2.polylines(frame, [poly_pts], True, (254, 242, 0), 2, cv2.LINE_AA)

        # Draw Human Bounding Boxes & Confidence Labels
        for (x, y, bw, bh, conf) in detected_boxes:
            cv2.rectangle(frame, (x, y), (x + bw, y + bh), (254, 242, 0), 2)
            
            # Corner highlights
            cv2.rectangle(frame, (x - 2, y - 2), (x + 6, y + 6), (248, 189, 56), -1)
            cv2.rectangle(frame, (x + bw - 4, y - 2), (x + bw + 4, y + 6), (248, 189, 56), -1)

            # Label box
            label = f"Person {int(conf * 100)}%"
            (tw, th), _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.5, 2)
            cv2.rectangle(frame, (x, max(0, y - 22)), (x + tw + 8, max(20, y)), (254, 242, 0), -1)
            cv2.putText(frame, label, (x + 4, max(15, y - 5)), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (18, 7, 3), 2, cv2.LINE_AA)

            # Center head marker dot
            cv2.circle(frame, (x + bw // 2, y + 20), 6, (248, 189, 56), -1)

        # Top Information HUD Overlay
        cv2.rectangle(frame, (10, 10), (420, 95), (18, 7, 3), -1)
        cv2.rectangle(frame, (10, 10), (420, 95), (254, 242, 0), 1)

        cv2.putText(frame, "AI QueueSense - Optical Intelligence", (20, 35), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (254, 242, 0), 2)
        cv2.putText(frame, f"Location: {args.location.upper()} | FPS: {fps:.1f}", (20, 60), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)
        cv2.putText(frame, f"HUMANS DETECTED: {people_count}", (20, 85), cv2.FONT_HERSHEY_SIMPLEX, 0.65, (0, 255, 128), 2)

        # Show Output Frame in OpenCV GUI Window
        cv2.imshow("AI QueueSense - Real-Time YOLO Human Detector", frame)

        # Periodically sync count to backend every 3 seconds
        if time.time() - last_sync_time >= 3.0:
            sync_count_to_api(args.api_url, args.location, people_count)
            last_sync_time = time.time()

        key = cv2.waitKey(1) & 0xFF
        if key == ord('q') or key == 27:
            print("[*] User quit requested. Shutting down camera engine.")
            break

    cap.release()
    cv2.destroyAllWindows()
    print("[+] Camera vision detector stopped cleanly.")

if __name__ == "__main__":
    main()
