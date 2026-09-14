import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { CameraFeed } from '@/lib/types';

function dbRowToCamera(row: any): CameraFeed {
  return {
    id: row.id,
    code: row.code,
    locationId: row.location_id,
    locationName: row.location_name,
    status: row.status,
    fps: Number(row.fps),
    queueRegionActive: Boolean(row.queue_region_active),
    resolution: row.resolution,
    detectedPeopleCount: Number(row.detected_people_count),
    modelConfidence: Number(row.model_confidence),
    processingLatencyMs: Number(row.processing_latency_ms),
  };
}

export async function GET() {
  try {
    const res = await query('SELECT * FROM cameras ORDER BY code ASC');
    const cameras = res.rows.map(dbRowToCamera);
    return NextResponse.json(cameras);
  } catch (error: any) {
    console.error('Error fetching cameras from DB:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch cameras' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status, queueRegionActive, fps, detectedPeopleCount, processingLatencyMs } = body;

    if (!id) {
      return NextResponse.json({ error: 'Camera ID is required' }, { status: 400 });
    }

    const res = await query(
      `UPDATE cameras
       SET status = COALESCE($1, status),
           queue_region_active = COALESCE($2, queue_region_active),
           fps = COALESCE($3, fps),
           detected_people_count = COALESCE($4, detected_people_count),
           processing_latency_ms = COALESCE($5, processing_latency_ms),
           updated_at = NOW()
       WHERE id = $6
       RETURNING *;`,
      [status, queueRegionActive, fps, detectedPeopleCount, processingLatencyMs, id]
    );

    if (res.rows.length === 0) {
      return NextResponse.json({ error: 'Camera not found' }, { status: 404 });
    }

    return NextResponse.json(dbRowToCamera(res.rows[0]));
  } catch (error: any) {
    console.error('Error updating camera:', error);
    return NextResponse.json({ error: error.message || 'Failed to update camera' }, { status: 500 });
  }
}
