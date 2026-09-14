import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { ThresholdSettings } from '@/lib/types';

function dbRowToThresholds(row: any): ThresholdSettings {
  return {
    lowMax: Number(row.low_max),
    mediumMax: Number(row.medium_max),
    highMin: Number(row.high_min),
    alertSensitivity: row.alert_sensitivity,
    autoStaffNotification: Boolean(row.auto_staff_notification),
    emailAlertsEnabled: Boolean(row.email_alerts_enabled),
  };
}

export async function GET() {
  try {
    const res = await query('SELECT * FROM thresholds WHERE id = 1');
    if (res.rows.length === 0) {
      return NextResponse.json({
        lowMax: 30,
        mediumMax: 60,
        highMin: 61,
        alertSensitivity: 'medium',
        autoStaffNotification: true,
        emailAlertsEnabled: false,
      });
    }
    return NextResponse.json(dbRowToThresholds(res.rows[0]));
  } catch (error: any) {
    console.error('Error fetching thresholds from DB:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch thresholds' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { lowMax, mediumMax, highMin, alertSensitivity, autoStaffNotification, emailAlertsEnabled } = body;

    const res = await query(
      `INSERT INTO thresholds (
        id, low_max, medium_max, high_min, alert_sensitivity, auto_staff_notification, email_alerts_enabled
      ) VALUES (1, $1, $2, $3, $4, $5, $6)
      ON CONFLICT (id) DO UPDATE SET
        low_max = EXCLUDED.low_max,
        medium_max = EXCLUDED.medium_max,
        high_min = EXCLUDED.high_min,
        alert_sensitivity = EXCLUDED.alert_sensitivity,
        auto_staff_notification = EXCLUDED.auto_staff_notification,
        email_alerts_enabled = EXCLUDED.email_alerts_enabled,
        updated_at = NOW()
      RETURNING *;`,
      [lowMax, mediumMax, highMin, alertSensitivity, autoStaffNotification, emailAlertsEnabled]
    );

    return NextResponse.json(dbRowToThresholds(res.rows[0]));
  } catch (error: any) {
    console.error('Error updating thresholds:', error);
    return NextResponse.json({ error: error.message || 'Failed to update thresholds' }, { status: 500 });
  }
}
