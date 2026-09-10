export interface MedicalSource {
  id: string;
  title: string;
  organization: string; // e.g., 'AASM', 'NHLBI', 'USPSTF', 'JAMA', 'PubMed'
  year: number;
  url: string;
  citation: string;
  keyFinding: string;
  authors?: string;
  journal?: string;
  volumePages?: string;
  pmid?: string;
  pmcid?: string;
  doi?: string;
  evidenceType?: string;
  supportedClaims?: string;
}

export interface CognitiveTrap {
  id: string;
  title: string;
  category: 'spo2' | 'snoring' | 'fatigue' | 'asymptomatic' | 'gender' | 'wearable' | 'heart_rate' | 'anatomy';
  observation: string; // Điều quan sát được
  fallacy: string; // KHÔNG được kết luận từ đó (Bẫy suy diễn)
  why: string; // Bản chất y sinh & thống kê (Tại sao sai?)
  interviewRisk: string; // Nguy cơ khi phỏng vấn user
  betterQuestion: string; // Câu hỏi phỏng vấn chuẩn xác
  sourceIds: string[];
}

export type QuestionOptionType = 'safe' | 'labeling' | 'leading' | 'premature_conclusion' | 'dangerous_advice' | 'sensor_blindness';

export interface ScenarioOption {
  id: string;
  text: string;
  type: QuestionOptionType;
  typeLabel: string; // Ví dụ: "An toàn (Mở rộng trải nghiệm)", "Bẫy gán nhãn bệnh"
  isSafe: boolean;
  feedback: string;
  explanation: string;
}

export interface RoleplayScenario {
  id: string;
  title: string;
  difficulty: 'cơ bản' | 'nâng cao' | 'tinh tế';
  userProfile: {
    name: string;
    age: number;
    gender: 'Nam' | 'Nữ';
    occupation: string;
    deviceUsed: string;
  };
  userStatement: string; // Lời nói tự nhiên của người dùng ảo
  context: string;
  options: ScenarioOption[];
  reflectionPrompt: string; // Yêu cầu Founder tự viết 2-3 câu tóm tắt
}

export interface MechanismStep {
  step: number;
  title: string;
  shortSummary: string;
  metaphor: {
    name: string;
    icon: string;
    analogy: string;
  };
  laymanExplanation: string; // Giải thích cho người nhà / không chuyên môn
  physiologicalDetail: string; // Cơ chế y sinh chuyên sâu
  metrics: {
    airflowPercent: number; // 0 to 150%
    spo2Percent: number; // 78 to 99%
    paco2Status: 'bình thường (40 mmHg)' | 'tăng dần (46 mmHg)' | 'ứ đọng nặng (>50 mmHg)' | 'giảm nhẹ do thở bù';
    heartRateBpm: number;
    arousalStatus: 'Ngủ êm' | 'Giảm trương lực' | 'Gắng sức thở' | 'KÍCH HOẠT VI TỈNH THỨC' | 'Hồi phục thở';
  };
  visualState: {
    airwayStatus: 'open' | 'narrowed' | 'collapsed' | 'reopening';
    chestEffort: 'normal' | 'increased' | 'straining' | 'recovery';
    bloodColor: 'bright_red' | 'darkening' | 'cyanotic' | 'reoxygenating';
    brainArousal: boolean;
    sympatheticSurge: boolean;
  };
  sourceIds: string[];
}

// Module Mới 1: 4 Hình Thái Dạng Sóng SpO2 Ban Đêm
export interface SpO2WaveformPattern {
  id: string;
  name: string;
  shapeTitle: string; // e.g. "Dạng Răng Cưa (Sawtooth)"
  frequency: string; // e.g. "Chu kỳ lặp 30-90 giây"
  typicalDipDuration: string; // e.g. "Tụt 10-45 giây rồi vọt lên ngay"
  primaryCause: string; // e.g. "Ngưng thở tắc nghẽn (OSA)"
  category: 'airway_osa' | 'pulmonary' | 'sensor_artifact' | 'cardiac_central';
  badgeColor: 'rose' | 'amber' | 'emerald' | 'purple';
  isArtifact: boolean; // Nếu là nhiễu do nằm đè ngón tay
  analogy: string; // Ẩn dụ đời thường
  mechanismWhy: string; // Cơ chế tại sao dạng sóng lại như vậy
  reassuringMessage: string; // Thông điệp an tâm, không hoang mang
  exclusionChecklist: string[]; // Các câu hỏi tự kiểm tra loại trừ
  actionSteps: {
    immediate: string; // Việc làm ngay tối nay (vệ sinh giấc ngủ, ngủ nghiêng)
    monitoring: string; // Cách theo dõi nhiều đêm tới
    clinical: string; // Khi nào đi khám & câu hỏi hỏi bác sĩ
  };
  sampleSvgWave: string; // Path SVG dạng sóng trực quan
}

// Module Mới 2: Bách Khoa Tri Thức & Tra Cứu Y Khoa
export interface MedicalKnowledgeHub {
  definitionSection: {
    whatIsOSA: string;
    laymanAnalogy: string;
    ahiStandards: {
      metric: string;
      scoringRuleNote?: string;
      ranges: { label: string; range: string; meaning: string; severityColor: string }[];
    };
    underlyingCauses: { title: string; desc: string; icon: string }[];
  };
  symptomSection: {
    nighttime: { symptom: string; why: string; icon: string; whyPro?: string }[];
    daytime: { symptom: string; why: string; icon: string; whyPro?: string }[];
  };
  differentialDiagnosis: {
    condition: string;
    mainMechanism: string;
    observableSpO2: string;
    additionalDataNeeded: string;
    doNotInfer: string;
  }[];
  ppgSensorScience: {
    howItWorks: string;
    twoWavelengths: { wave: string; nanometers: string; role: string }[];
    circulationDelay: string;
    whyRingBetterThanWrist: string;
    commonArtifacts: string[];
  };
  cardiovascularComplications: {
    name: string;
    mechanism: string;
    reversibleWithTreatment: string;
  }[];
}

// Thuật ngữ & Ẩn Dụ 1-Chạm
export interface GlossaryItem {
  id: string;
  term: string;
  vietnameseName: string;
  metaphor: string; // Ẩn dụ đời thường (ví dụ: "Bộ cảm biến khói")
  plainDefinition: string; // Giải thích bình dân không chuyên môn
  clinicalDetail: string; // Chi tiết chuyên sâu y khoa
  whyItMatters: string; // Tại sao người dùng O2Ring cần biết
}

export interface DiseaseData {
  diseaseId: string;
  diseaseName: string;
  subtitle: string;
  disclaimer: string;
  sources: MedicalSource[];
  traps: CognitiveTrap[];
  scenarios: RoleplayScenario[];
  mechanismSteps: MechanismStep[];
  waveformPatterns: SpO2WaveformPattern[];
  knowledgeHub: MedicalKnowledgeHub;
  glossary: GlossaryItem[];
}
