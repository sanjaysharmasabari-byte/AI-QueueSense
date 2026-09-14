import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';
import { INITIAL_LOCATIONS, INITIAL_CAMERAS, INITIAL_ALERTS, DEFAULT_THRESHOLDS } from '../src/lib/mockData';

// Load .env.local if available
const envLocalPath = path.join(__dirname, '../.env.local');
if (fs.existsSync(envLocalPath)) {
  const envContent = fs.readFileSync(envLocalPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*"(.*)"\s*$/) || line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
    if (match) {
      process.env[match[1]] = match[2];
    }
  });
}

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('Error: DATABASE_URL is not set in environment or .env.local');
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

async function main() {
  console.log('Connecting to Supabase PostgreSQL database...');
  const client = await pool.connect();
  try {
    console.log('Reading schema.sql...');
    const schemaSql = fs.readFileSync(path.join(__dirname, '../src/lib/db/schema.sql'), 'utf8');
    
    console.log('Running database migrations...');
    await client.query(schemaSql);
    console.log('Database tables created/verified successfully.');

    console.log('Seeding baseline campus locations...');
    for (const loc of INITIAL_LOCATIONS) {
      await client.query(
        `INSERT INTO locations (
          id, name, category, status, people_count, max_capacity, estimated_wait_min,
          queue_density_percent, avg_service_time_sec, last_updated, camera_code,
          recommended_time_window, queue_growth_percent, service_rate_people_per_min,
          map_x, map_y, description, hourly_trends, weekly_trends
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19
        ) ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          category = EXCLUDED.category,
          status = EXCLUDED.status,
          people_count = EXCLUDED.people_count,
          max_capacity = EXCLUDED.max_capacity,
          estimated_wait_min = EXCLUDED.estimated_wait_min,
          queue_density_percent = EXCLUDED.queue_density_percent,
          avg_service_time_sec = EXCLUDED.avg_service_time_sec,
          last_updated = EXCLUDED.last_updated,
          camera_code = EXCLUDED.camera_code,
          recommended_time_window = EXCLUDED.recommended_time_window,
          queue_growth_percent = EXCLUDED.queue_growth_percent,
          service_rate_people_per_min = EXCLUDED.service_rate_people_per_min,
          map_x = EXCLUDED.map_x,
          map_y = EXCLUDED.map_y,
          description = EXCLUDED.description,
          hourly_trends = EXCLUDED.hourly_trends,
          weekly_trends = EXCLUDED.weekly_trends,
          updated_at = NOW();`,
        [
          loc.id,
          loc.name,
          loc.category,
          loc.status,
          loc.peopleCount,
          loc.maxCapacity,
          loc.estimatedWaitMin,
          loc.queueDensityPercent,
          loc.avgServiceTimeSec,
          loc.lastUpdated,
          loc.cameraCode,
          loc.recommendedTimeWindow,
          loc.queueGrowthPercent,
          loc.serviceRatePeoplePerMin,
          loc.mapX,
          loc.mapY,
          loc.description,
          JSON.stringify(loc.hourlyTrends),
          JSON.stringify(loc.weeklyTrends),
        ]
      );
    }
    console.log(`Seeded ${INITIAL_LOCATIONS.length} locations.`);

    console.log('Seeding baseline camera feeds...');
    for (const cam of INITIAL_CAMERAS) {
      await client.query(
        `INSERT INTO cameras (
          id, code, location_id, location_name, status, fps, queue_region_active,
          resolution, detected_people_count, model_confidence, processing_latency_ms
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
        ) ON CONFLICT (id) DO UPDATE SET
          code = EXCLUDED.code,
          location_id = EXCLUDED.location_id,
          location_name = EXCLUDED.location_name,
          status = EXCLUDED.status,
          fps = EXCLUDED.fps,
          queue_region_active = EXCLUDED.queue_region_active,
          resolution = EXCLUDED.resolution,
          detected_people_count = EXCLUDED.detected_people_count,
          model_confidence = EXCLUDED.model_confidence,
          processing_latency_ms = EXCLUDED.processing_latency_ms,
          updated_at = NOW();`,
        [
          cam.id,
          cam.code,
          cam.locationId,
          cam.locationName,
          cam.status,
          cam.fps,
          cam.queueRegionActive,
          cam.resolution,
          cam.detectedPeopleCount,
          cam.modelConfidence,
          cam.processingLatencyMs,
        ]
      );
    }
    console.log(`Seeded ${INITIAL_CAMERAS.length} cameras.`);

    console.log('Seeding smart alerts...');
    for (const alert of INITIAL_ALERTS) {
      await client.query(
        `INSERT INTO alerts (
          id, severity, type, location_id, location_name, timestamp, title, description, is_read
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9
        ) ON CONFLICT (id) DO UPDATE SET
          severity = EXCLUDED.severity,
          type = EXCLUDED.type,
          location_id = EXCLUDED.location_id,
          location_name = EXCLUDED.location_name,
          timestamp = EXCLUDED.timestamp,
          title = EXCLUDED.title,
          description = EXCLUDED.description,
          is_read = EXCLUDED.is_read;`,
        [
          alert.id,
          alert.severity,
          alert.type,
          alert.locationId,
          alert.locationName,
          alert.timestamp,
          alert.title,
          alert.description,
          alert.isRead,
        ]
      );
    }
    console.log(`Seeded ${INITIAL_ALERTS.length} smart alerts.`);

    console.log('Seeding threshold settings...');
    await client.query(
      `INSERT INTO thresholds (
        id, low_max, medium_max, high_min, alert_sensitivity, auto_staff_notification, email_alerts_enabled
      ) VALUES (
        1, $1, $2, $3, $4, $5, $6
      ) ON CONFLICT (id) DO UPDATE SET
        low_max = EXCLUDED.low_max,
        medium_max = EXCLUDED.medium_max,
        high_min = EXCLUDED.high_min,
        alert_sensitivity = EXCLUDED.alert_sensitivity,
        auto_staff_notification = EXCLUDED.auto_staff_notification,
        email_alerts_enabled = EXCLUDED.email_alerts_enabled,
        updated_at = NOW();`,
      [
        DEFAULT_THRESHOLDS.lowMax,
        DEFAULT_THRESHOLDS.mediumMax,
        DEFAULT_THRESHOLDS.highMin,
        DEFAULT_THRESHOLDS.alertSensitivity,
        DEFAULT_THRESHOLDS.autoStaffNotification,
        DEFAULT_THRESHOLDS.emailAlertsEnabled,
      ]
    );
    console.log('Seeded default threshold settings.');

    console.log('✅ Supabase database migration and seeding completed successfully!');
  } catch (err) {
    console.error('Migration/Seeding Error:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
