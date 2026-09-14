import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { LocationItem } from '@/lib/types';

function dbRowToLocation(row: any): LocationItem {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    status: row.status,
    peopleCount: Number(row.people_count),
    maxCapacity: Number(row.max_capacity),
    estimatedWaitMin: Number(row.estimated_wait_min),
    queueDensityPercent: Number(row.queue_density_percent),
    avgServiceTimeSec: Number(row.avg_service_time_sec),
    lastUpdated: row.last_updated,
    cameraCode: row.camera_code,
    recommendedTimeWindow: row.recommended_time_window,
    queueGrowthPercent: Number(row.queue_growth_percent),
    serviceRatePeoplePerMin: Number(row.service_rate_people_per_min),
    mapX: Number(row.map_x),
    mapY: Number(row.map_y),
    description: row.description,
    hourlyTrends: typeof row.hourly_trends === 'string' ? JSON.parse(row.hourly_trends) : (row.hourly_trends || []),
    weeklyTrends: typeof row.weekly_trends === 'string' ? JSON.parse(row.weekly_trends) : (row.weekly_trends || []),
  };
}

export async function GET() {
  try {
    const res = await query('SELECT * FROM locations ORDER BY name ASC');
    const locations = res.rows.map(dbRowToLocation);
    return NextResponse.json(locations);
  } catch (error: any) {
    console.error('Error fetching locations from DB:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch locations' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, peopleCount, status, estimatedWaitMin, queueDensityPercent, lastUpdated, queueGrowthPercent, serviceRatePeoplePerMin } = body;

    if (!id) {
      return NextResponse.json({ error: 'Location ID is required' }, { status: 400 });
    }

    const res = await query(
      `UPDATE locations
       SET people_count = COALESCE($1, people_count),
           status = COALESCE($2, status),
           estimated_wait_min = COALESCE($3, estimated_wait_min),
           queue_density_percent = COALESCE($4, queue_density_percent),
           last_updated = COALESCE($5, last_updated),
           queue_growth_percent = COALESCE($6, queue_growth_percent),
           service_rate_people_per_min = COALESCE($7, service_rate_people_per_min),
           updated_at = NOW()
       WHERE id = $8
       RETURNING *;`,
      [peopleCount, status, estimatedWaitMin, queueDensityPercent, lastUpdated, queueGrowthPercent, serviceRatePeoplePerMin, id]
    );

    if (res.rows.length === 0) {
      return NextResponse.json({ error: 'Location not found' }, { status: 404 });
    }

    return NextResponse.json(dbRowToLocation(res.rows[0]));
  } catch (error: any) {
    console.error('Error updating location:', error);
    return NextResponse.json({ error: error.message || 'Failed to update location' }, { status: 500 });
  }
}
