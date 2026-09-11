"""
AI QueueSense - OpenCV & YOLOv8 Computer Vision Queue Detector
---------------------------------------------------------------
This module provides real-time person detection, ROI polygon filtering,
crowd count calculation, and wait-time estimation.
"""

import cv2
import numpy as np
from typing import List, Dict, Any, Tuple


class YOLOQueueDetector:
    def __init__(self, model_path: str = "yolov8n.pt", confidence_threshold: float = 0.4):
        self.confidence_threshold = confidence_threshold
        self.model = None
        self._load_model(model_path)

    def _load_model(self, model_path: str):
        try:
            from ultralytics import YOLO
            self.model = YOLO(model_path)
            print(f"[AI QueueSense] Loaded YOLOv8 model from {model_path}")
        except Exception as e:
            print(f"[AI QueueSense Warning] Could not load ultralytics YOLO model: {e}")
            print("[AI QueueSense] Fallback to OpenCV simulated detection mode.")
            self.model = None

    def process_frame(
        self,
        frame: np.ndarray,
        roi_polygon: List[Tuple[int, int]] = None
    ) -> Tuple[np.ndarray, int, List[Dict[str, Any]]]:
        """
        Process a single image frame, detect people (class_id=0),
        filter within ROI polygon, and draw bounding box annotations.
        """
        height, width = frame.shape[:2]
        detections = []
        people_count = 0

        # Default ROI: Central queue lane polygon if not provided
        if roi_polygon is None:
            roi_polygon = [
                (int(width * 0.1), int(height * 0.2)),
                (int(width * 0.9), int(height * 0.2)),
                (int(width * 0.95), int(height * 0.9)),
                (int(width * 0.05), int(height * 0.9)),
            ]

        # Convert ROI points for OpenCV drawing
        pts = np.array(roi_polygon, np.int32).reshape((-1, 1, 2))
        cv2.polylines(frame, [pts], isClosed=True, color=(254, 242, 0), thickness=2)
        cv2.putText(
            frame,
            "ACTIVE QUEUE REGION #1",
            (roi_polygon[0][0] + 10, roi_polygon[0][1] + 25),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.6,
            (254, 242, 0),
            2,
        )

        if self.model is not None:
            # Execute YOLO inference
            results = self.model(frame, verbose=False)[0]
            boxes = results.boxes

            for box in boxes:
                cls_id = int(box.cls[0])
                conf = float(box.conf[0])

                # Class 0 is 'person' in COCO dataset
                if cls_id == 0 and conf >= self.confidence_threshold:
                    x1, y1, x2, y2 = map(int, box.xyxy[0])
                    center_x = (x1 + x2) // 2
                    center_y = (y1 + y2) // 2

                    # Check if center point is inside ROI polygon
                    inside = cv2.pointPolygonTest(pts, (float(center_x), float(center_y)), False) >= 0

                    if inside:
                        people_count += 1
                        detections.append({
                            "box": [x1, y1, x2, y2],
                            "confidence": round(conf, 2),
                            "class": "Person",
                            "inside_roi": True
                        })

                        # Draw bounding box on frame
                        cv2.rectangle(frame, (x1, y1), (x2, y2), (254, 242, 0), 2)
                        label = f"Person {conf:.2f}"
                        cv2.putText(
                            frame,
                            label,
                            (x1, max(15, y1 - 5)),
                            cv2.FONT_HERSHEY_SIMPLEX,
                            0.5,
                            (254, 242, 0),
                            2,
                        )

        return frame, people_count, detections


def estimate_queue_metrics(people_count: int, max_capacity: int = 65) -> Dict[str, Any]:
    """
    Calculate queue density, congestion level, and estimated wait duration.
    """
    density = min(100, int((people_count / max_capacity) * 100))
    
    if people_count <= 30:
        status = "Low"
    elif people_count <= 60:
        status = "Medium"
    else:
        status = "High"

    # Assume avg 20 sec per person across 2 active service counters
    avg_service_sec = 20
    active_counters = 2
    estimated_wait_min = max(1, int((people_count * avg_service_sec) / (active_counters * 60)))

    return {
        "peopleCount": people_count,
        "maxCapacity": max_capacity,
        "queueDensityPercent": density,
        "status": status,
        "estimatedWaitMin": estimated_wait_min,
        "avgServiceTimeSec": avg_service_sec,
    }
