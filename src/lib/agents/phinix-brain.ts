import { StateGraph, START, END } from "@langchain/langgraph";
import fs from 'fs';
import path from 'path';

// Define the state interface
interface AgentState {
    taskId?: string;
    rawData?: string;
    instructions?: string[];
    confidence: number;
    riskTier: number;
    suggestion?: string;
    isEscalated: boolean;
    actionTaken?: "AUTO_SUBMITTED" | "ESCALATED_TO_HUMAN";
    feedback?: string;
}

// 1. Planner Node: Analyzes the task type
const planner = async (state: AgentState): Promise<Partial<AgentState>> => {
    const isHighRisk = state.rawData?.toLowerCase().includes("trap") || state.rawData?.toLowerCase().includes("broken");
    return {
        riskTier: isHighRisk ? 3 : 1,
        confidence: isHighRisk ? 0.4 : 0.92
    };
};

// 2. Explainer Node: Simplifies instructions
const explainer = async (state: AgentState): Promise<Partial<AgentState>> => {
    return {
        instructions: [
            "Analyze image density",
            state.riskTier === 3 ? "WARNING: Potential Attention Check detected" : "Standard classification"
        ]
    };
};

// 3. Executor Node: Decides if it can auto-submit
const executor = async (state: AgentState): Promise<Partial<AgentState>> => {
    const canAutoSubmit = state.confidence > 0.9 && state.riskTier === 1;
    return {
        suggestion: "Label: URBAN",
        isEscalated: !canAutoSubmit,
        actionTaken: canAutoSubmit ? "AUTO_SUBMITTED" : "ESCALATED_TO_HUMAN"
    };
};

/**
 * 4. REINFORCEMENT NODE: Progressive Learning Logic
 * Collects "Human Feedback" or Successful Outcomes and saves them as Local Knowledge.
 */
const reinforcement = async (state: AgentState): Promise<Partial<AgentState>> => {
    if (state.feedback) {
        console.log("--- REINFORCEMENT: Learning from human correction... ---");
        const correctionPath = path.join(process.cwd(), 'knowledge/corrections', `${Date.now()}_correction.md`);
        const content = `# Automated Learning Log\n**Task**: ${state.taskId}\n**Correction**: ${state.feedback}\n**Date**: ${new Date().toISOString()}`;

        // In a production app, we would append to a RAG index here.
        // For now, we seed the /knowledge/corrections folder.
        fs.mkdirSync(path.dirname(correctionPath), { recursive: true });
        fs.writeFileSync(correctionPath, content);
    }
    return {};
};

// Build the graph
const workflow = new StateGraph<AgentState>({
    channels: {
        taskId: null,
        rawData: null,
        instructions: null,
        confidence: null,
        riskTier: null,
        suggestion: null,
        isEscalated: null,
        actionTaken: null,
        feedback: null,
    }
})
    .addNode("planner", planner)
    .addNode("explainer", explainer)
    .addNode("executor", executor)
    .addNode("reinforcement", reinforcement)
    .addEdge(START, "planner")
    .addEdge("planner", "explainer")
    .addEdge("explainer", "executor")
    .addEdge("executor", "reinforcement") // Learning happens after every decision
    .addEdge("reinforcement", END);

export const phinixBrain = workflow.compile();
