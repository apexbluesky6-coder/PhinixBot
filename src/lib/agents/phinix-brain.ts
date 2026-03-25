import { StateGraph, START, END } from "@langchain/langgraph";
import fs from 'fs';
import path from 'path';

// Define the expanded state for Universal Job + Microtask support
interface AgentState {
    id?: string;
    url?: string;
    mode: "scout" | "analyze_form" | "generate_answers" | "full_run";
    profileId: "JOB_SEEKER_1" | "MICROTASK_WORKER_1";

    // Phase 1: Discovery
    rawListings?: any[];
    topQueue?: any[];

    // Phase 2: Analysis
    formData?: any;
    screenQs?: any;

    // Intelligence Metrics
    confidence: number;
    riskTier: number;
    matchScore: number;

    // Status
    actionTaken?: "AUTO_SUBMITTED" | "READY_FOR_HUMAN" | "ESCALATED_GUARDRAIL";
    feedback?: string;
    summary?: string;
}

/**
 * PHASE 1: DISCOVERY (Scouting)
 * Analyzes platform listings and scores them against the profile.
 */
const discoveryNode = async (state: AgentState): Promise<Partial<AgentState>> => {
    if (state.mode !== "scout" && state.mode !== "full_run") return {};

    console.log(`--- PHASE 1: Scouting ${state.url} ---`);
    // Mock scoring logic based on the new Master Prompt rubrics
    const matchScore = 85; // Example
    return {
        matchScore,
        summary: `Found listings on ${state.url}. Match score: ${matchScore}`,
        topQueue: [{ id: state.id || "job_001", title: "Remote Developer", score: matchScore }]
    };
};

/**
 * PHASE 2: FORM ANALYSIS & AUTO-FILL
 * Detects form fields and generates smart answers using the profile.
 */
const analysisNode = async (state: AgentState): Promise<Partial<AgentState>> => {
    if (state.mode === "scout") return {};

    console.log("--- PHASE 2: Analyzing Form Fields ---");
    const hasCaptcha = false; // Mock check

    return {
        riskTier: hasCaptcha ? 3 : 1,
        confidence: hasCaptcha ? 0.4 : 0.95,
        formData: {
            coverLetter: "Highly interested in this React role...",
            experience: "2+ years of professional automation."
        }
    };
};

/**
 * PHASE 3: EXECUTION DECISION
 * Determines if the package is ready for human review or auto-submission.
 */
const executionNode = async (state: AgentState): Promise<Partial<AgentState>> => {
    const isSafe = state.confidence > 0.9 && state.riskTier < 2;

    return {
        actionTaken: isSafe ? "READY_FOR_HUMAN" : "ESCALATED_GUARDRAIL",
        summary: isSafe
            ? "Application package prepared and ready for final human approval."
            : "High risk or low confidence detected. Flagged for manual review."
    };
};

/**
 * REINFORCEMENT: Learning Loop
 */
const reinforcementNode = async (state: AgentState): Promise<Partial<AgentState>> => {
    if (state.feedback) {
        const correctionPath = path.join(process.cwd(), 'knowledge/corrections', `${Date.now()}_job_learning.md`);
        const content = `# Job Learning Log\n**Task**: ${state.id}\n**Correction**: ${state.feedback}`;
        fs.mkdirSync(path.dirname(correctionPath), { recursive: true });
        fs.writeFileSync(correctionPath, content);
    }
    return {};
};

// Build the Universal JobPilot Graph
const workflow = new StateGraph<AgentState>({
    channels: {
        id: null,
        url: null,
        mode: null,
        profileId: null,
        rawListings: null,
        topQueue: null,
        formData: null,
        screenQs: null,
        confidence: null,
        riskTier: null,
        matchScore: null,
        actionTaken: null,
        feedback: null,
        summary: null,
    }
})
    .addNode("discovery", discoveryNode)
    .addNode("analysis", analysisNode)
    .addNode("execution", executionNode)
    .addNode("reinforcement", reinforcementNode)
    .addEdge(START, "discovery")
    .addEdge("discovery", "analysis")
    .addEdge("analysis", "execution")
    .addEdge("execution", "reinforcement")
    .addEdge("reinforcement", END);

export const phinixBrain = workflow.compile();
