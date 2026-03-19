export interface Story {
  id: string;
  title: string;
  source: string;
  category: string;
  timestamp: string;
  snippet: string;
  imageUrl?: string;
}

export interface BriefingData {
  id: string;
  title: string;
  source: string;
  publishedAt: string;
  summary: string;
  timeline: { date: string; event: string }[];
  entities: { name: string; type: "company" | "person" | "org"; role: string }[];
  keyNumbers: { value: string; label: string; context: string }[];
  bullish: string[];
  bearish: string[];
  watchNext: string[];
  whyItMatters: string;
}

export const trendingStories: Story[] = [
  {
    id: "1",
    title: "RBI Holds Rates Steady as Inflation Cools to 18-Month Low",
    source: "Economic Times",
    category: "Monetary Policy",
    timestamp: "2 hours ago",
    snippet: "The Reserve Bank of India kept its benchmark repo rate unchanged at 6.5% for the eighth consecutive meeting, signaling confidence in the disinflation trajectory.",
  },
  {
    id: "2",
    title: "Reliance Jio Announces $3.2B Data Center Expansion Across India",
    source: "Bloomberg",
    category: "Technology",
    timestamp: "4 hours ago",
    snippet: "Reliance Jio Infocomm plans to invest $3.2 billion in building hyperscale data centers across six Indian cities to capture growing AI and cloud demand.",
  },
  {
    id: "3",
    title: "Tata Motors EV Sales Surge 68% in Q3 as Subsidies Drive Adoption",
    source: "Mint",
    category: "Automotive",
    timestamp: "5 hours ago",
    snippet: "Tata Motors reported a 68% year-over-year jump in electric vehicle sales, cementing its lead in India's fast-growing EV market.",
  },
  {
    id: "4",
    title: "India's UPI Crosses 20 Billion Transactions in Single Month",
    source: "Reuters",
    category: "Fintech",
    timestamp: "6 hours ago",
    snippet: "India's Unified Payments Interface processed over 20 billion transactions in a single month for the first time, underscoring digital payment dominance.",
  },
  {
    id: "5",
    title: "Infosys Wins $2B Deal with European Telecom Giant",
    source: "Business Standard",
    category: "IT Services",
    timestamp: "8 hours ago",
    snippet: "Infosys secured one of its largest deals ever, a $2 billion multi-year engagement with a major European telecommunications company for digital transformation.",
  },
  {
    id: "6",
    title: "SEBI Proposes New Framework for AI-Driven Trading Algorithms",
    source: "Moneycontrol",
    category: "Regulation",
    timestamp: "10 hours ago",
    snippet: "Markets regulator SEBI released a consultation paper proposing stricter oversight of AI and machine learning-based algorithmic trading strategies.",
  },
];

export const sampleBriefing: BriefingData = {
  id: "2",
  title: "Reliance Jio Announces $3.2B Data Center Expansion Across India",
  source: "Bloomberg",
  publishedAt: "March 19, 2026",
  summary:
    "Reliance Jio Infocomm, India's largest telecom operator, has unveiled plans to invest $3.2 billion in building hyperscale data centers across six major Indian cities. The expansion targets the rapidly growing demand for AI compute, cloud services, and enterprise data hosting. This move positions Jio as a direct competitor to global cloud giants AWS, Azure, and Google Cloud in the Indian market. The first facilities are expected to be operational by Q2 2027.",
  timeline: [
    { date: "Jan 2024", event: "Jio Platforms announces AI-first strategy at AGM" },
    { date: "Jun 2024", event: "Partnership signed with NVIDIA for GPU cluster deployment" },
    { date: "Oct 2024", event: "First pilot data center launched in Navi Mumbai" },
    { date: "Jan 2025", event: "Jio Cloud services reach 100,000 enterprise customers" },
    { date: "Mar 2025", event: "Board approves $3.2B capex for hyperscale expansion" },
    { date: "Mar 2026", event: "Formal announcement of 6-city data center build-out" },
  ],
  entities: [
    { name: "Reliance Jio", type: "company", role: "Primary investor and operator" },
    { name: "Mukesh Ambani", type: "person", role: "Chairman, Reliance Industries" },
    { name: "NVIDIA", type: "company", role: "GPU and AI infrastructure partner" },
    { name: "AWS India", type: "company", role: "Key competitor in Indian cloud market" },
    { name: "MeitY", type: "org", role: "Government ministry overseeing digital infra policy" },
  ],
  keyNumbers: [
    { value: "$3.2B", label: "Total Investment", context: "Largest single data center investment in Indian history" },
    { value: "6", label: "Cities", context: "Mumbai, Delhi, Hyderabad, Chennai, Bengaluru, Kolkata" },
    { value: "200 MW", label: "Total Capacity", context: "Combined power capacity across all facilities" },
    { value: "15,000", label: "New Jobs", context: "Direct and indirect employment expected by 2028" },
  ],
  bullish: [
    "India's cloud market is growing at 25% CAGR — massive total addressable market",
    "Jio's existing 450M+ subscriber base provides built-in enterprise distribution",
    "Data localization regulations favor domestic data center operators",
    "Partnership with NVIDIA gives access to cutting-edge AI infrastructure",
  ],
  bearish: [
    "AWS, Azure, and GCP are aggressively expanding India presence with deeper expertise",
    "Massive capex creates execution risk and long payback periods",
    "Talent shortage in India for data center operations and cloud engineering",
    "Energy costs and grid reliability remain concerns in some target cities",
  ],
  watchNext: [
    "Q2 2026 earnings call for updated capex guidance and construction milestones",
    "Government policy on data localization and cloud-first mandates for public sector",
    "Competitive response from AWS and Azure on India pricing and capacity",
    "Jio's enterprise customer acquisition rate over the next two quarters",
    "NVIDIA's next-gen GPU allocation priorities for Indian partners",
  ],
  whyItMatters:
    "This is the largest single data center investment in Indian history and signals a structural shift in how India's digital infrastructure is built. If Jio succeeds, it could fundamentally alter the competitive dynamics of cloud computing in Asia's third-largest economy, reduce dependence on foreign cloud providers, and accelerate India's AI capabilities.",
};
