import { NextResponse } from 'next/server';
import { phinixBrain } from '@/lib/agents/phinix-brain';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const result = await phinixBrain.invoke({
            taskId: body.taskId,
            rawData: body.rawData,
            confidence: 0,
            riskTier: 1,
            isEscalated: false
        });

        return NextResponse.json({ success: true, analysis: result });
    } catch (error) {
        return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
    }
}
