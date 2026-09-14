import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { SmartAlert } from '@/lib/types';

function dbRowToAlert(row: any): SmartAlert {
  return {
    id: row.id,
    severity: row.severity,
    type: row.type,
    locationId: row.location_id,
    locationName: row.location_name,
    timestamp: row.timestamp,
    title: row.title,
    description: row.description,
    isRead: Boolean(row.is_read),
  };
}

export async function GET() {
  try {
    const res = await query('SELECT * FROM alerts ORDER BY created_at DESC');
    const alerts = res.rows.map(dbRowToAlert);
    return NextResponse.json(alerts);
  } catch (error: any) {
    console.error('Error fetching alerts from DB:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch alerts' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, severity, type, locationId, locationName, timestamp, title, description } = body;

    const alertId = id || `alert-${Date.now()}`;
    const res = await query(
      `INSERT INTO alerts (
        id, severity, type, location_id, location_name, timestamp, title, description, is_read
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, FALSE)
      RETURNING *;`,
      [alertId, severity, type, locationId, locationName, timestamp || 'Just now', title, description]
    );

    return NextResponse.json(dbRowToAlert(res.rows[0]), { status: 201 });
  } catch (error: any) {
    console.error('Error creating alert:', error);
    return NextResponse.json({ error: error.message || 'Failed to create alert' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, isRead, markAllRead } = body;

    if (markAllRead) {
      await query('UPDATE alerts SET is_read = TRUE');
      return NextResponse.json({ success: true, message: 'All alerts marked as read' });
    }

    if (!id) {
      return NextResponse.json({ error: 'Alert ID is required' }, { status: 400 });
    }

    const res = await query(
      `UPDATE alerts
       SET is_read = $1
       WHERE id = $2
       RETURNING *;`,
      [isRead !== undefined ? isRead : true, id]
    );

    if (res.rows.length === 0) {
      return NextResponse.json({ error: 'Alert not found' }, { status: 404 });
    }

    return NextResponse.json(dbRowToAlert(res.rows[0]));
  } catch (error: any) {
    console.error('Error updating alert:', error);
    return NextResponse.json({ error: error.message || 'Failed to update alert' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (id) {
      await query('DELETE FROM alerts WHERE id = $1', [id]);
      return NextResponse.json({ success: true, deletedId: id });
    } else {
      await query('DELETE FROM alerts');
      return NextResponse.json({ success: true, message: 'All alerts cleared' });
    }
  } catch (error: any) {
    console.error('Error deleting alerts:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete alerts' }, { status: 500 });
  }
}
