import pool from './db';

export async function seedPlatforms() {
    const platforms = [
        { name: 'Toloka', status: 'Online', risk_level: 'Low' },
        { name: 'Appen Connect', status: 'Online', risk_level: 'Medium' },
        { name: 'Clickworker', status: 'Maintenance', risk_level: 'Low' }
    ];

    for (const p of platforms) {
        try {
            await pool.query(
                'INSERT INTO platforms (name, status, risk_level) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING',
                [p.name, p.status, p.risk_level]
            );
        } catch (err) {
            console.error(`Failed to seed ${p.name}:`, err);
        }
    }
}
