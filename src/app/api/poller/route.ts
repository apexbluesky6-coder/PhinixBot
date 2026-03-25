import { NextResponse } from 'next/server';
import { globalPoller } from '@/lib/services/poller';

export async function POST(req: Request) {
    try {
        const { action } = await req.json();

        if (action === 'start') {
            await globalPoller.start(300000); // 5 minutes
            return NextResponse.json({ success: true, message: 'Fleet Poller Started', status: 'Running' });
        } else if (action === 'stop') {
            await globalPoller.stop();
            return NextResponse.json({ success: true, message: 'Fleet Poller Stopped', status: 'Stopped' });
        } else {
            return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
        }
    } catch (error) {
        return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
    }
}
