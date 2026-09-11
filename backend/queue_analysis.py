"""
AI QueueSense - Queue Analysis & Metrics Calculation Module
------------------------------------------------------------
Provides transparent mathematical functions for queue density,
waiting time estimation, congestion status banding, and AI recommendations.
"""

from typing import Dict, Any


def calculate_queue_density(people_count: int, max_capacity: int = 65) -> float:
    """Calculates queue density percentage capped at 100%."""
    if max_capacity <= 0:
        return 0.0
    return round(min(100.0, (people_count / max_capacity) * 100.0), 2)


def estimate_waiting_time(people_count: int, average_service_time_min: float = 0.5) -> float:
    """
    Estimates waiting time in minutes using transparent formula:
    waiting_time = people_count * average_service_time
    """
    return round(max(0.0, people_count * average_service_time_min), 1)


def determine_queue_status(queue_density: float) -> str:
    """
    Categorizes queue status based on density thresholds:
    0–30%   -> Low
    31–60%  -> Moderate
    61–80%  -> High
    81–100% -> Critical
    """
    if queue_density <= 30.0:
        return "Low"
    elif queue_density <= 60.0:
        return "Moderate"
    elif queue_density <= 80.0:
        return "High"
    else:
        return "Critical"


def get_ai_recommendation(status: str, queue_density: float) -> Dict[str, str]:
    """Generates operational suggestions based on queue congestion status."""
    if status in ["High", "Critical"]:
        action = "Consider opening an additional service counter or redirecting users to an available counter."
    elif status == "Moderate":
        action = "Monitor inflow velocity and prepare secondary line stanchions."
    else:
        action = "Maintain standard service operations."

    return {
        "title": "AI-Assisted Queue Recommendation",
        "status": status,
        "recommended_action": action,
        "notice": "All recommendations are AI-assisted non-binding operational estimates."
    }
