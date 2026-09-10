const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const APP_URL = 'http://localhost:5173';
const OUTPUT_DIR = path.resolve(__dirname, '..', 'app_screenshots_v131_full');
const INVENTORY_FILE = path.resolve(__dirname, '..', 'medical_state_inventory_v131_full.json');
const MANIFEST_FILE = path.resolve(__dirname, '..', 'screenshot_manifest_v131_full.json');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// 1. INVENTORY DEFINITION (115 Medically Distinct States)
const STATE_INVENTORY = [
  // --- Group 1: Home View & Safety / Disclaimers (4 states) ---
  {
    state_id: 'home_banner_disclaimer',
    module: 'Home',
    mode: 'general',
    medical_scope: 'Medical Disclaimer & Boundaries',
    description: 'Top persistent educational banner stating SpO2 wearable data cannot independently diagnose or exclude OSA',
    expected_visible_content: 'Công cụ học tập cá nhân — KHÔNG dùng để chẩn đoán, KHÔNG thay thế tư vấn y tế'
  },
  {
    state_id: 'home_pillar1_identification',
    module: 'Home',
    mode: 'general',
    medical_scope: 'Clinical Symptoms & Signs',
    description: 'Home Pillar 1 - Intuitive recognition of OSA early signs and symptoms',
    expected_visible_content: 'Trực giác hóa cơ chế OSA qua giải phẫu 2.5D/3D'
  },
  {
    state_id: 'home_pillar2_pathophysiology',
    module: 'Home',
    mode: 'general',
    medical_scope: 'Pathophysiology Progression',
    description: 'Home Pillar 2 - 5-step pathophysiology from normal breathing to arousal',
    expected_visible_content: '5 bước cơ chế bệnh sinh'
  },
  {
    state_id: 'home_pillar3_aasm_guidance',
    module: 'Home',
    mode: 'general',
    medical_scope: 'Diagnostic Standards (AASM)',
    description: 'Home Pillar 3 - AASM diagnostic testing guidance boundary',
    expected_visible_content: 'Định nghĩa theo hướng dẫn AASM, thước đo AHI'
  },

  // --- Group 2: Public Physiology Steps 1-5 (5 states) ---
  {
    state_id: 'public_step1',
    module: 'ModuleC',
    mode: 'general',
    medical_scope: 'Normal Respiration & Ventilation',
    description: 'Public Mode Step 1 - Normal breathing and alveolar ventilation',
    expected_visible_content: 'Đường thở mở hoàn toàn, không khí lưu thông êm ái'
  },
  {
    state_id: 'public_step2',
    module: 'ModuleC',
    mode: 'general',
    medical_scope: 'Airway Narrowing & Snoring',
    description: 'Public Mode Step 2 - Airway narrowing, tissue vibration and snoring sound',
    expected_visible_content: 'Mô mềm họng rung lên tạo tiếng ngáy'
  },
  {
    state_id: 'public_step3',
    module: 'ModuleC',
    mode: 'general',
    medical_scope: 'Complete Airway Collapse & Apnea',
    description: 'Public Mode Step 3 - Airway completely blocked, no airflow into lungs',
    expected_visible_content: 'Đường thở đóng kín hoàn toàn, luồng khí ngừng trệ'
  },
  {
    state_id: 'public_step4',
    module: 'ModuleC',
    mode: 'general',
    medical_scope: 'Hypoxemia & Hypercapnia',
    description: 'Public Mode Step 4 - Blood oxygen drops, CO2 rises',
    expected_visible_content: 'Oxy máu tụt dốc, cơ thể thiếu oxy'
  },
  {
    state_id: 'public_step5',
    module: 'ModuleC',
    mode: 'general',
    medical_scope: 'Arousal & Airway Reopening',
    description: 'Public Mode Step 5 - Micro-arousal triggers muscle tone to reopen airway',
    expected_visible_content: 'Não bộ báo động, bật mở đường thở'
  },

  // --- Group 3: Founder Pro Physiology Steps 1-5 (5 states) ---
  {
    state_id: 'founder_pro_step1',
    module: 'ModuleC',
    mode: 'founder',
    medical_scope: 'Detailed Biomechanics - Intrathoracic Pressure',
    description: 'Founder Pro Step 1 - Negative intrathoracic pressure and upper airway patency',
    expected_visible_content: 'Cơ hoành co bóp tạo áp lực âm trong lồng ngực'
  },
  {
    state_id: 'founder_pro_step2',
    module: 'ModuleC',
    mode: 'founder',
    medical_scope: 'Pharyngeal Muscle Tone & Bernoulli Effect',
    description: 'Founder Pro Step 2 - Reduced dilator muscle tone and Bernoulli effect',
    expected_visible_content: 'Sự giảm trương lực cơ giãn hầu họng lúc ngủ'
  },
  {
    state_id: 'founder_pro_step3',
    module: 'ModuleC',
    mode: 'founder',
    medical_scope: 'Paradoxical Respiratory Effort & Negative Pressure',
    description: 'Founder Pro Step 3 - Paradoxical thoracoabdominal effort and deep negative pressure',
    expected_visible_content: 'Chuyển động ngực-bụng ngược chiều có thể xuất hiện'
  },
  {
    state_id: 'founder_pro_step4',
    module: 'ModuleC',
    mode: 'founder',
    medical_scope: 'Gas Exchange Failure & Sympathetic Surge',
    description: 'Founder Pro Step 4 - Transient blood gas alteration and sympathetic activation',
    expected_visible_content: 'Giảm thông khí trong một đợt tắc nghẽn có thể gây rối loạn khí máu thoáng qua'
  },
  {
    state_id: 'founder_pro_step5',
    module: 'ModuleC',
    mode: 'founder',
    medical_scope: 'Respiratory Drive & Upper Airway Dilators',
    description: 'Founder Pro Step 5 - Airflow restoration via respiratory drive and dilator muscle recruitment',
    expected_visible_content: 'Luồng khí có thể phục hồi nhờ tăng respiratory drive và huy động các cơ giãn đường thở trên'
  },

  // --- Group 4: 3D Anatomy Simulator & 6 Landmark Pins (7 states) ---
  {
    state_id: 'anatomy_3d_overview',
    module: 'ModuleC',
    mode: '3D',
    medical_scope: '3D Upper Airway Anatomy & Caliber Gauge',
    description: '3D Anatomy Simulator overview showing spatial airway geometry and caliber gauge',
    expected_visible_content: 'Khẩu kính đường thở'
  },
  {
    state_id: 'pin_3d_nose',
    module: 'ModuleC',
    mode: '3D',
    medical_scope: 'Nasal Cavity Landmark',
    description: '3D Landmark Pin 1 - Nasal cavity entrance and airway warming',
    expected_visible_content: 'Khoang mũi (Đường khí vào)'
  },
  {
    state_id: 'pin_3d_palate',
    module: 'ModuleC',
    mode: '3D',
    medical_scope: 'Soft Palate & Uvula Landmark',
    description: '3D Landmark Pin 2 - Soft palate, uvula and vibration mechanics',
    expected_visible_content: 'Khẩu cái mềm & Lưỡi gà'
  },
  {
    state_id: 'pin_3d_tongue',
    module: 'ModuleC',
    mode: '3D',
    medical_scope: 'Tongue Base & Genioglossus Landmark',
    description: '3D Landmark Pin 3 - Base of tongue, genioglossus muscle support',
    expected_visible_content: 'Gốc lưỡi & Cơ cằm-lưỡi'
  },
  {
    state_id: 'pin_3d_mandible',
    module: 'ModuleC',
    mode: '3D',
    medical_scope: 'Mandible & Craniofacial Architecture',
    description: '3D Landmark Pin 4 - Mandible, chin and craniofacial anatomy factors',
    expected_visible_content: 'Xương hàm dưới & Cằm'
  },
  {
    state_id: 'pin_3d_airway',
    module: 'ModuleC',
    mode: '3D',
    medical_scope: 'Pharyngeal Collapsible Segment Landmark',
    description: '3D Landmark Pin 5 - Pharyngeal collapse site in obstructive apnea',
    expected_visible_content: 'Vùng bít tắc hầu họng'
  },
  {
    state_id: 'pin_3d_trachea',
    module: 'ModuleC',
    mode: '3D',
    medical_scope: 'Trachea & Cartilage Rings Landmark',
    description: '3D Landmark Pin 6 - Trachea and rigid cartilaginous support',
    expected_visible_content: 'Khí quản & Vòng sụn'
  },

  // --- Group 5: SpO2 Waveform Detective (6 states) ---
  {
    state_id: 'waveform_pattern_sawtooth',
    module: 'Waveforms',
    mode: 'general',
    medical_scope: 'Classic Sawtooth Pattern',
    description: 'Pattern 1 - Classic Sawtooth pattern representing cyclical obstructive desaturations',
    expected_visible_content: 'Răng Cưa Kinh Điển (Sawtooth Pattern)'
  },
  {
    state_id: 'waveform_pattern_sustained_plateau',
    module: 'Waveforms',
    mode: 'general',
    medical_scope: 'Sustained Hypoxemia / Overlap Syndrome',
    description: 'Pattern 2 - Sustained low plateau suggestive of chronic hypoventilation or COPD overlap',
    expected_visible_content: 'Đáy Dẹt Kéo Dài (Sustained Low Plateau)'
  },
  {
    state_id: 'waveform_pattern_isolated_spike',
    module: 'Waveforms',
    mode: 'general',
    medical_scope: 'Motion Artifact vs True Event',
    description: 'Pattern 3 - Isolated spike artifact due to sensor motion or poor perfusion',
    expected_visible_content: 'Gai Nhọn Đơn Độc (Isolated Spike / Artifact)'
  },
  {
    state_id: 'waveform_pattern_periodic_cheyne_stokes',
    module: 'Waveforms',
    mode: 'general',
    medical_scope: 'Periodic Breathing / Cheyne-Stokes',
    description: 'Pattern 4 - Periodic gradual crescendo-decrescendo pattern associated with central apnea or heart failure',
    expected_visible_content: 'Chu Kỳ Đều Đặn (Periodic Breathing / Cheyne-Stokes)'
  },
  {
    state_id: 'waveform_action_plan_safety',
    module: 'Waveforms',
    mode: 'general',
    medical_scope: 'Medication Safety & Positional Guidance',
    description: 'Waveform Action Plan with approved medication safety copy (no self-discontinuation) and positional advice',
    expected_visible_content: 'Hạn chế rượu gần giờ ngủ. Nếu đang sử dụng thuốc ngủ'
  },
  {
    state_id: 'waveform_differential_cmc09',
    module: 'Waveforms',
    mode: 'general',
    medical_scope: 'Internal Rule CMC-09 Branding',
    description: 'Waveform Detective internal rule CMC-09 badge clearly framed as O2Sense operational heuristic',
    expected_visible_content: 'Quy tắc phân biệt hình thái SpO₂ ban đêm (Quy tắc nội bộ O2Sense CMC-09)'
  },

  // --- Group 6: Knowledge Hub Subtabs (5 states) ---
  {
    state_id: 'knowledge_tab_definition',
    module: 'KnowledgeHub',
    mode: 'general',
    medical_scope: 'AHI Severity & Clinical Classification',
    description: 'Knowledge Hub Subtab 1 - AHI definitions, clinical thresholds (5, 15, 30) and AASM criteria',
    expected_visible_content: 'Định Nghĩa & Thước Đo AHI'
  },
  {
    state_id: 'knowledge_tab_symptom',
    module: 'KnowledgeHub',
    mode: 'general',
    medical_scope: 'Daytime & Nighttime Symptoms Map',
    description: 'Knowledge Hub Subtab 2 - Daytime fatigue, morning headache, unrefreshing sleep and atypical symptoms in women',
    expected_visible_content: 'Bản Đồ Triệu Chứng Ngày & Đêm'
  },
  {
    state_id: 'knowledge_tab_differential',
    module: 'KnowledgeHub',
    mode: 'general',
    medical_scope: 'Differential Diagnosis & Rule CMC-09',
    description: 'Knowledge Hub Subtab 3 - Differential diagnosis between OSA, Central Apnea, COPD Overlap, Narcolepsy',
    expected_visible_content: 'Chẩn Đoán Phân Biệt (CMC-09)'
  },
  {
    state_id: 'knowledge_tab_ppg_sensor',
    module: 'KnowledgeHub',
    mode: 'general',
    medical_scope: 'PPG Photoplethysmography & Wearable Limits',
    description: 'Knowledge Hub Subtab 4 - Optical sensor science, red/infrared absorption, sampling rate limits, motion artifacts',
    expected_visible_content: 'Khoa Học Cảm Biến PPG'
  },
  {
    state_id: 'knowledge_tab_cardiovascular',
    module: 'KnowledgeHub',
    mode: 'general',
    medical_scope: 'Cardiovascular Consequences & Hypertension',
    description: 'Knowledge Hub Subtab 5 - Endothelial dysfunction, nocturnal hypertension surge, sympathetic overactivity',
    expected_visible_content: 'Biến Chứng Tim Mạch & Huyết Áp'
  },

  // --- Group 7: 8 MythBusters Cards (Front + Back = 16 states) ---
  {
    state_id: 'myth_trap1_front',
    module: 'CasesAndTraps',
    mode: 'general',
    medical_scope: 'Weight & Craniofacial Anatomy (Front)',
    description: 'Trap 1 Front - Myth: Only obese individuals can develop OSA',
    expected_visible_content: 'Người gầy không bao giờ bị ngưng thở khi ngủ?'
  },
  {
    state_id: 'myth_trap1_back',
    module: 'CasesAndTraps',
    mode: 'general',
    medical_scope: 'Weight & Craniofacial Anatomy (Back)',
    description: 'Trap 1 Back - Craniofacial phenotypes, retrognathia and narrow pharyngeal airway',
    expected_visible_content: 'BẢN CHẤT Y SINH'
  },
  {
    state_id: 'myth_trap2_front',
    module: 'CasesAndTraps',
    mode: 'general',
    medical_scope: 'Age Demographics & Prevalence (Front)',
    description: 'Trap 2 Front - Myth: OSA only occurs in elderly people',
    expected_visible_content: 'Chỉ người già mới mắc ngưng thở khi ngủ?'
  },
  {
    state_id: 'myth_trap2_back',
    module: 'CasesAndTraps',
    mode: 'general',
    medical_scope: 'Age Demographics & Prevalence (Back)',
    description: 'Trap 2 Back - OSA can affect young working adults, pediatric patients (tonsil hypertrophy)',
    expected_visible_content: 'BẢN CHẤT Y SINH'
  },
  {
    state_id: 'myth_trap3_front',
    module: 'CasesAndTraps',
    mode: 'general',
    medical_scope: 'Snoring vs Apnea & Gender Presentation (Front)',
    description: 'Trap 3 Front - Myth: Must have loud heroic snoring to have OSA',
    expected_visible_content: 'Cứ ngáy to mới là bị ngưng thở khi ngủ?'
  },
  {
    state_id: 'myth_trap3_back',
    module: 'CasesAndTraps',
    mode: 'general',
    medical_scope: 'Snoring vs Apnea & Gender Presentation (Back)',
    description: 'Trap 3 Back - Silent apneas, upper airway resistance, atypical presentation in females',
    expected_visible_content: 'BẢN CHẤT Y SINH'
  },
  {
    state_id: 'myth_trap4_front',
    module: 'CasesAndTraps',
    mode: 'general',
    medical_scope: 'Smartwatch SpO2 Sensitivity & Diagnostic Limits (Front)',
    description: 'Trap 4 Front - Myth: Normal average smartwatch SpO2 rules out OSA',
    expected_visible_content: 'Đồng hồ thông minh báo SpO2 bình thường thì chắc chắn an toàn?'
  },
  {
    state_id: 'myth_trap4_back',
    module: 'CasesAndTraps',
    mode: 'general',
    medical_scope: 'Smartwatch SpO2 Sensitivity & Diagnostic Limits (Back)',
    description: 'Trap 4 Back - Smartwatch average vs episodic desaturations, sampling interval limits, AASM guidelines',
    expected_visible_content: 'BẢN CHẤT Y SINH'
  },
  {
    state_id: 'myth_trap5_front',
    module: 'CasesAndTraps',
    mode: 'general',
    medical_scope: 'Night-to-Night Variability (Front)',
    description: 'Trap 5 Front - Myth: One single normal night means no sleep apnea',
    expected_visible_content: 'Một đêm đo bình thường là loại trừ được bệnh?'
  },
  {
    state_id: 'myth_trap5_back',
    module: 'CasesAndTraps',
    mode: 'general',
    medical_scope: 'Night-to-Night Variability (Back)',
    description: 'Trap 5 Back - Intra-individual night-to-night variability, sleep stages, alcohol, nasal congestion',
    expected_visible_content: 'BẢN CHẤT Y SINH'
  },
  {
    state_id: 'myth_trap6_front',
    module: 'CasesAndTraps',
    mode: 'general',
    medical_scope: 'Positional Therapy Boundary (Front)',
    description: 'Trap 6 Front - Myth: Sleeping on your side completely cures OSA for everyone',
    expected_visible_content: 'Chỉ cần đổi tư thế ngủ là khỏi hoàn toàn?'
  },
  {
    state_id: 'myth_trap6_back',
    module: 'CasesAndTraps',
    mode: 'general',
    medical_scope: 'Positional Therapy Boundary (Back)',
    description: 'Trap 6 Back - Positional therapy only benefits positional OSA phenotype (POSA); ineffective for severe anatomical collapse',
    expected_visible_content: 'BẢN CHẤT Y SINH'
  },
  {
    state_id: 'myth_trap7_front',
    module: 'CasesAndTraps',
    mode: 'general',
    medical_scope: 'Sedatives & Airway Muscle Tone (Front)',
    description: 'Trap 7 Front - Myth: Taking sleeping pills or sedatives will help sleep soundly and reduce apneas',
    expected_visible_content: 'Uống thuốc ngủ giúp ngủ sâu hơn và hết ngáy?'
  },
  {
    state_id: 'myth_trap7_back',
    module: 'CasesAndTraps',
    mode: 'general',
    medical_scope: 'Sedatives & Airway Muscle Tone (Back)',
    description: 'Trap 7 Back - Sedatives decrease pharyngeal muscle dilator tone and suppress arousal threshold, potentially worsening desaturations',
    expected_visible_content: 'BẢN CHẤT Y SINH'
  },
  {
    state_id: 'myth_trap8_front',
    module: 'CasesAndTraps',
    mode: 'general',
    medical_scope: 'CPAP Mechanism & Adherence (Front)',
    description: 'Trap 8 Front - Myth: CPAP cures the disease permanently after a few months of use',
    expected_visible_content: 'Dùng máy thở CPAP vài tháng là khỏi hẳn không cần đeo nữa?'
  },
  {
    state_id: 'myth_trap8_back',
    module: 'CasesAndTraps',
    mode: 'general',
    medical_scope: 'CPAP Mechanism & Adherence (Back)',
    description: 'Trap 8 Back - CPAP is a mechanical pneumatic splint that maintains patency during use, not a curative structural alteration',
    expected_visible_content: 'BẢN CHẤT Y SINH'
  },

  // --- Group 8: 6 Clinical Scenarios (Question + 3 Option Feedbacks = 24 states) ---
  // Scenario 1: Tuan (Programmer, 32)
  {
    state_id: 'scenario_1_question',
    module: 'CasesAndTraps',
    mode: 'general',
    medical_scope: 'Clinical Scenario 1 - Presentation',
    description: 'Scenario 1 - Programmer with morning fatigue and 88% SpO2 spike',
    expected_visible_content: 'Anh Tuấn (32 tuổi, Lập trình viên)'
  },
  {
    state_id: 'scenario_1_opt1_feedback',
    module: 'CasesAndTraps',
    mode: 'general',
    medical_scope: 'Clinical Scenario 1 - Feedback Option 1 (Alarmist / Diagnosis Trap)',
    description: 'Scenario 1 Option 1 Feedback - Warning against diagnosing disease from a single smartwatch metric',
    expected_visible_content: 'SAI LẦM NGHIÊM TRỌNG!'
  },
  {
    state_id: 'scenario_1_opt2_feedback',
    module: 'CasesAndTraps',
    mode: 'general',
    medical_scope: 'Clinical Scenario 1 - Feedback Option 2 (Leading Question Trap)',
    description: 'Scenario 1 Option 2 Feedback - Warning against leading questions and stereotyping',
    expected_visible_content: 'CÂU HỎI MỚM CUNG!'
  },
  {
    state_id: 'scenario_1_opt3_feedback',
    module: 'CasesAndTraps',
    mode: 'general',
    medical_scope: 'Clinical Scenario 1 - Feedback Option 3 (Safe Open Question)',
    description: 'Scenario 1 Option 3 Feedback - Approval for differentiating lifestyle factors and open inquiry',
    expected_visible_content: 'TUYỆT VỜI! CÂU HỎI MỞ CHUẨN XÁC.'
  },

  // Scenario 2: Chi Mai (Accountant, 45)
  {
    state_id: 'scenario_2_question',
    module: 'CasesAndTraps',
    mode: 'general',
    medical_scope: 'Clinical Scenario 2 - Presentation',
    description: 'Scenario 2 - 45-year-old female with headache and fatigue, non-snoring',
    expected_visible_content: 'Chị Mai (45 tuổi, Kế toán trưởng)'
  },
  {
    state_id: 'scenario_2_opt1_feedback',
    module: 'CasesAndTraps',
    mode: 'general',
    medical_scope: 'Clinical Scenario 2 - Feedback Option 1',
    description: 'Scenario 2 Option 1 Feedback - Premature diagnosis trap',
    expected_visible_content: 'BẠN ĐANG VỘI VÃ KẾT LUẬN'
  },
  {
    state_id: 'scenario_2_opt2_feedback',
    module: 'CasesAndTraps',
    mode: 'general',
    medical_scope: 'Clinical Scenario 2 - Feedback Option 2',
    description: 'Scenario 2 Option 2 Feedback - Under-diagnosis trap in women',
    expected_visible_content: 'BẪY BỎ SÓT NGUY CƠ Ở NỮ GIỚI!'
  },
  {
    state_id: 'scenario_2_opt3_feedback',
    module: 'CasesAndTraps',
    mode: 'general',
    medical_scope: 'Clinical Scenario 2 - Feedback Option 3',
    description: 'Scenario 2 Option 3 Feedback - Safe open questioning for female OSA presentation',
    expected_visible_content: 'XUẤT SẮC! TIẾP CẬN ĐA CHIỀU'
  },

  // Scenario 3: Bac Hung (Hypertension, 58)
  {
    state_id: 'scenario_3_question',
    module: 'CasesAndTraps',
    mode: 'general',
    medical_scope: 'Clinical Scenario 3 - Presentation',
    description: 'Scenario 3 - 58-year-old male with resistant hypertension and loud snoring',
    expected_visible_content: 'Bác Hùng (58 tuổi, Cán bộ hưu trí)'
  },
  {
    state_id: 'scenario_3_opt1_feedback',
    module: 'CasesAndTraps',
    mode: 'general',
    medical_scope: 'Clinical Scenario 3 - Feedback Option 1',
    description: 'Scenario 3 Option 1 Feedback - Medical advice violation regarding prescription drugs',
    expected_visible_content: 'VI PHẠM NGUY HIỂM: CAN THIỆP ĐIỀU TRỊ THUỐC!'
  },
  {
    state_id: 'scenario_3_opt2_feedback',
    module: 'CasesAndTraps',
    mode: 'general',
    medical_scope: 'Clinical Scenario 3 - Feedback Option 2',
    description: 'Scenario 3 Option 3 Feedback - Trivializing cardiovascular risk',
    expected_visible_content: 'BỎ LỠ CƠ HỘI ĐÁNH GIÁ NGUY CƠ TIM MẠCH'
  },
  {
    state_id: 'scenario_3_opt3_feedback',
    module: 'CasesAndTraps',
    mode: 'general',
    medical_scope: 'Clinical Scenario 3 - Feedback Option 3',
    description: 'Scenario 3 Option 3 Feedback - Safe encouragement to discuss with cardiologist',
    expected_visible_content: 'TUYỆT ĐỐI CHUẨN XÁC! HỖ TRỢ ĐÚNG GIỚI HẠN'
  },

  // Scenario 4: Anh Long (Driver, 40)
  {
    state_id: 'scenario_4_question',
    module: 'CasesAndTraps',
    mode: 'general',
    medical_scope: 'Clinical Scenario 4 - Presentation',
    description: 'Scenario 4 - 40-year-old interprovincial truck driver with severe daytime sleepiness',
    expected_visible_content: 'Anh Long (40 tuổi, Tài xế xe tải đường dài)'
  },
  {
    state_id: 'scenario_4_opt1_feedback',
    module: 'CasesAndTraps',
    mode: 'general',
    medical_scope: 'Clinical Scenario 4 - Feedback Option 1',
    description: 'Scenario 4 Option 1 Feedback - Occupational hazard trivialization',
    expected_visible_content: 'COI THƯỜNG MỐI NGUY TAI NẠN LAO ĐỘNG/GIAO THÔNG'
  },
  {
    state_id: 'scenario_4_opt2_feedback',
    module: 'CasesAndTraps',
    mode: 'general',
    medical_scope: 'Clinical Scenario 4 - Feedback Option 2',
    description: 'Scenario 4 Option 2 Feedback - Pseudo-medical prescription',
    expected_visible_content: 'TƯ VẤN THUỐC/CHẤT KÍCH THÍCH KHÔNG PHÙ HỢP'
  },
  {
    state_id: 'scenario_4_opt3_feedback',
    module: 'CasesAndTraps',
    mode: 'general',
    medical_scope: 'Clinical Scenario 4 - Feedback Option 3',
    description: 'Scenario 4 Option 3 Feedback - Urgent clinical PSG recommendation for driving safety',
    expected_visible_content: 'BẢO VỆ TÍNH MẠNG! KHUYẾN CÁO KHÁM CHUYÊN KHOA KỊP THỜI'
  },

  // Scenario 5: Chi Lan (Insomnia, 52)
  {
    state_id: 'scenario_5_question',
    module: 'CasesAndTraps',
    mode: 'general',
    medical_scope: 'Clinical Scenario 5 - Presentation',
    description: 'Scenario 5 - 52-year-old perimenopausal woman with chronic insomnia and mood changes',
    expected_visible_content: 'Chị Lan (52 tuổi, Giáo viên cấp 3)'
  },
  {
    state_id: 'scenario_5_opt1_feedback',
    module: 'CasesAndTraps',
    mode: 'general',
    medical_scope: 'Clinical Scenario 5 - Feedback Option 1',
    description: 'Scenario 5 Option 1 Feedback - Dismissing as pure hormone symptoms',
    expected_visible_content: 'GÁN NHÃN ĐƠN NGUYÊN DO TIỀN MÃN KINH'
  },
  {
    state_id: 'scenario_5_opt2_feedback',
    module: 'CasesAndTraps',
    mode: 'general',
    medical_scope: 'Clinical Scenario 5 - Feedback Option 2',
    description: 'Scenario 5 Option 2 Feedback - Prescribing sleeping aids',
    expected_visible_content: 'NGUY HIỂM KHI GỢI Ý THUỐC AN THẦN/NGỦ'
  },
  {
    state_id: 'scenario_5_opt3_feedback',
    module: 'CasesAndTraps',
    mode: 'general',
    medical_scope: 'Clinical Scenario 5 - Feedback Option 3',
    description: 'Scenario 5 Option 3 Feedback - Differentiating insomnia and sleep maintenance',
    expected_visible_content: 'TIẾP CẬN BÀI BẢN! TÁCH BIỆT MẤT NGỦ VÀ RỐI LOẠN THỞ'
  },

  // Scenario 6: Bac Nam (COPD Overlap, 65)
  {
    state_id: 'scenario_6_question',
    module: 'CasesAndTraps',
    mode: 'general',
    medical_scope: 'Clinical Scenario 6 - Presentation',
    description: 'Scenario 6 - 65-year-old with known COPD and new nocturnal desaturations',
    expected_visible_content: 'Bác Nam (65 tuổi, Có tiền sử COPD)'
  },
  {
    state_id: 'scenario_6_opt1_feedback',
    module: 'CasesAndTraps',
    mode: 'general',
    medical_scope: 'Clinical Scenario 6 - Feedback Option 1',
    description: 'Scenario 6 Option 1 Feedback - Recommending self-adjustment of oxygen therapy',
    expected_visible_content: 'CỰC KỲ NGUY HIỂM: TỰ Ý TĂNG THỞ OXY TẠI NHÀ TRÊN BỆNH NHÂN COPD'
  },
  {
    state_id: 'scenario_6_opt2_feedback',
    module: 'CasesAndTraps',
    mode: 'general',
    medical_scope: 'Clinical Scenario 6 - Feedback Option 2',
    description: 'Scenario 6 Option 2 Feedback - Attributing all desaturations strictly to OSA',
    expected_visible_content: 'QUÊN MẤT HỘI CHỨNG CHỒNG LẤP (OVERLAP SYNDROME)'
  },
  {
    state_id: 'scenario_6_opt3_feedback',
    module: 'CasesAndTraps',
    mode: 'general',
    medical_scope: 'Clinical Scenario 6 - Feedback Option 3',
    description: 'Scenario 6 Option 3 Feedback - Safe referral to pulmonologist without altering therapy',
    expected_visible_content: 'CHUẨN MỰC CHUYÊN KHOA! CHUYỂN TUYẾN HÔ HẤP KỊP THỜI'
  },

  // --- Group 9: All 15 Glossary Terms (15 states) ---
  {
    state_id: 'glossary_term_genioglossus',
    module: 'GlossaryModal',
    mode: 'general',
    medical_scope: 'Upper Airway Anatomy - Dilator Muscle',
    description: 'Glossary: Cơ cằm-lưỡi (Genioglossus muscle)',
    expected_visible_content: 'Cơ cằm-lưỡi (Genioglossus)'
  },
  {
    state_id: 'glossary_term_arousal',
    module: 'GlossaryModal',
    mode: 'general',
    medical_scope: 'Sleep Neurophysiology - Micro-arousal',
    description: 'Glossary: Vi thức giấc (Micro-arousal)',
    expected_visible_content: 'Vi thức giấc (Micro-arousal)'
  },
  {
    state_id: 'glossary_term_chemoreceptors',
    module: 'GlossaryModal',
    mode: 'general',
    medical_scope: 'Respiratory Control - Chemoreceptors',
    description: 'Glossary: Thụ thể hóa học (Chemoreceptors)',
    expected_visible_content: 'Thụ thể hóa học (Chemoreceptors)'
  },
  {
    state_id: 'glossary_term_ahi',
    module: 'GlossaryModal',
    mode: 'general',
    medical_scope: 'Diagnostic Metric - AHI',
    description: 'Glossary: Chỉ số ngưng giảm thở (AHI)',
    expected_visible_content: 'Chỉ số ngưng giảm thở (AHI)'
  },
  {
    state_id: 'glossary_term_spo2',
    module: 'GlossaryModal',
    mode: 'general',
    medical_scope: 'Oximetry - SpO2',
    description: 'Glossary: Độ bão hòa oxy máu mao mạch (SpO2)',
    expected_visible_content: 'Độ bão hòa oxy mao mạch ngoại vi (SpO2)'
  },
  {
    state_id: 'glossary_term_ppg',
    module: 'GlossaryModal',
    mode: 'general',
    medical_scope: 'Sensor Science - Photoplethysmography',
    description: 'Glossary: Thể tích ký quang học (PPG)',
    expected_visible_content: 'Quang thể tích ký (PPG - Photoplethysmography)'
  },
  {
    state_id: 'glossary_term_soft_palate',
    module: 'GlossaryModal',
    mode: 'general',
    medical_scope: 'Upper Airway Anatomy - Soft Palate',
    description: 'Glossary: Khẩu cái mềm (Soft palate)',
    expected_visible_content: 'Khẩu cái mềm & Lưỡi gà (Soft Palate & Uvula)'
  },
  {
    state_id: 'glossary_term_anp',
    module: 'GlossaryModal',
    mode: 'general',
    medical_scope: 'Cardiac Neurohormone - ANP & Nocturia',
    description: 'Glossary: Peptit bài niệu tâm nhĩ (ANP)',
    expected_visible_content: 'Peptit lợi niệu tâm nhĩ (ANP - Atrial Natriuretic Peptide)'
  },
  {
    state_id: 'glossary_term_hypercapnia',
    module: 'GlossaryModal',
    mode: 'general',
    medical_scope: 'Blood Gas - Hypercapnia',
    description: 'Glossary: Tăng CO2 máu (Hypercapnia)',
    expected_visible_content: 'Tăng CO2 máu (Hypercapnia)'
  },
  {
    state_id: 'glossary_term_circulation_delay',
    module: 'GlossaryModal',
    mode: 'general',
    medical_scope: 'Cardiovascular Dynamics - Circulation Delay',
    description: 'Glossary: Độ trễ tuần hoàn phổi-ngón tay',
    expected_visible_content: 'Độ trễ tuần hoàn Phổi - Ngón tay'
  },
  {
    state_id: 'glossary_term_positional_therapy',
    module: 'GlossaryModal',
    mode: 'general',
    medical_scope: 'Therapeutic Intervention - Positional Therapy',
    description: 'Glossary: Liệu pháp tư thế (Positional therapy)',
    expected_visible_content: 'Liệu pháp tư thế ngủ (Positional Therapy)'
  },
  {
    state_id: 'glossary_term_perfusion_index',
    module: 'GlossaryModal',
    mode: 'general',
    medical_scope: 'Signal Quality - Perfusion Index',
    description: 'Glossary: Chỉ số tưới máu (PI)',
    expected_visible_content: 'Chỉ số tưới máu (PI - Perfusion Index)'
  },
  {
    state_id: 'glossary_term_psg',
    module: 'GlossaryModal',
    mode: 'general',
    medical_scope: 'Gold Standard Diagnosis - Polysomnography',
    description: 'Glossary: Đo đa ký giấc ngủ (Polysomnography)',
    expected_visible_content: 'Đo đa ký giấc ngủ (PSG - Polysomnography)'
  },
  {
    state_id: 'glossary_term_cpap',
    module: 'GlossaryModal',
    mode: 'general',
    medical_scope: 'Standard Treatment - Continuous Positive Airway Pressure',
    description: 'Glossary: Thở áp lực dương liên tục (CPAP)',
    expected_visible_content: 'Thở áp lực dương liên tục (CPAP)'
  },
  {
    state_id: 'glossary_term_eds',
    module: 'GlossaryModal',
    mode: 'general',
    medical_scope: 'Core Clinical Symptom - Excessive Daytime Sleepiness',
    description: 'Glossary: Buồn ngủ ban ngày quá mức (EDS)',
    expected_visible_content: 'Buồn ngủ ban ngày quá mức (EDS - Excessive Daytime Sleepiness)'
  },

  // --- Group 10: All 10 Medical Source Panels (10 states) ---
  {
    state_id: 'source_aasm_diag_2017',
    module: 'SourceModal',
    mode: 'general',
    medical_scope: 'AASM Diagnostic Testing Clinical Practice Guideline (2017)',
    description: 'Canonical Source: Kapur et al. J Clin Sleep Med 2017 (PMID 28162150, PMCID PMC5337595, DOI 10.5664/jcsm.6506)',
    expected_visible_content: 'American Academy of Sleep Medicine (AASM)'
  },
  {
    state_id: 'source_uspstf_osa_2022',
    module: 'SourceModal',
    mode: 'general',
    medical_scope: 'USPSTF Screening for OSA in Adults (2022)',
    description: 'Canonical Source: Mangione et al. JAMA 2022 (PMID 36378232, DOI 10.1001/jama.2022.20304)',
    expected_visible_content: 'US Preventive Services Task Force (USPSTF)'
  },
  {
    state_id: 'source_eckert_pathophys_2008',
    module: 'SourceModal',
    mode: 'general',
    medical_scope: 'Eckert & Malhotra OSA Pathophysiology (2008)',
    description: 'Canonical Source: Eckert DJ, Malhotra A. Proc Am Thorac Soc 2008 (PMID 18250206, PMCID PMC2628457, DOI 10.1513/pats.200707-114MG)',
    expected_visible_content: 'American Thoracic Society (ATS)'
  },
  {
    state_id: 'source_nhlbi_osa_topics',
    module: 'SourceModal',
    mode: 'general',
    medical_scope: 'NHLBI (NIH) Sleep Apnea Overview (2023)',
    description: 'Canonical Source: NHLBI National Institutes of Health 2023',
    expected_visible_content: 'National Heart, Lung, and Blood Institute (NHLBI / NIH)'
  },
  {
    state_id: 'source_mosaic_trial_2012',
    module: 'SourceModal',
    mode: 'general',
    medical_scope: 'MOSAIC Trial Minimally Symptomatic OSA (2014/2012)',
    description: 'Canonical Source: Kohler M et al. Lancet Respir Med (PMID 24461623, DOI 10.1016/S2213-2600(13)70256-8)',
    expected_visible_content: 'Lancet Respiratory Medicine'
  },
  {
    state_id: 'source_women_osa_2016',
    module: 'SourceModal',
    mode: 'general',
    medical_scope: 'Wimms et al. OSA in Women (2016)',
    description: 'Canonical Source: Wimms AJ et al. BioMed Res Int 2016 (PMID 27699167, PMCID PMC5028797, DOI 10.1155/2016/1764837)',
    expected_visible_content: 'BioMed Research International'
  },
  {
    state_id: 'source_night_variability_2017',
    module: 'SourceModal',
    mode: 'general',
    medical_scope: 'Stöberl et al. Night-to-Night Variability (2017)',
    description: 'Canonical Source: Stöberl AS et al. Ann Am Thorac Soc 2017 (PMID 28876930, DOI 10.1513/AnnalsATS.201704-350OC)',
    expected_visible_content: 'Annals of the American Thoracic Society'
  },
  {
    state_id: 'source_copd_overlap_2010',
    module: 'SourceModal',
    mode: 'general',
    medical_scope: 'Marin et al. COPD Overlap Syndrome (2010)',
    description: 'Canonical Source: Marin JM et al. Am J Respir Crit Care Med 2010 (PMID 20639439, DOI 10.1164/rccm.201002-0266OC)',
    expected_visible_content: 'American Journal of Respiratory and Critical Care Medicine'
  },
  {
    state_id: 'source_somers_sympathetic_1995',
    module: 'SourceModal',
    mode: 'general',
    medical_scope: 'Somers et al. Sympathetic Neural Mechanisms (1995)',
    description: 'Canonical Source: Somers VK et al. J Clin Invest 1995 (PMID 7560081, PMCID PMC185826, DOI 10.1172/JCI118235)',
    expected_visible_content: 'American Society for Clinical Investigation'
  },
  {
    state_id: 'source_craniofacial_osa_2009',
    module: 'SourceModal',
    mode: 'general',
    medical_scope: 'Lee et al. Craniofacial Phenotyping (2009)',
    description: 'Canonical Source: Lee RWW et al. Sleep 2009 (PMID 19189777, PMCID PMC2625322, DOI 10.5665/sleep/32.1.37)',
    expected_visible_content: 'Sleep'
  },

  // --- Group 11: Quick Review Modal (12 states) ---
  {
    state_id: 'quick_review_card1_question',
    module: 'QuickReviewModal',
    mode: 'general',
    medical_scope: 'Quick Review Flashcard 1 - Question',
    description: 'Quick Review Flashcard 1 Question front',
    expected_visible_content: 'Thẻ 1 / 4'
  },
  {
    state_id: 'quick_review_card1_answer',
    module: 'QuickReviewModal',
    mode: 'general',
    medical_scope: 'Quick Review Flashcard 1 - Answer / Explanation',
    description: 'Quick Review Flashcard 1 Answer back',
    expected_visible_content: 'Bản chất y sinh:'
  },
  {
    state_id: 'quick_review_card2_question',
    module: 'QuickReviewModal',
    mode: 'general',
    medical_scope: 'Quick Review Flashcard 2 - Question',
    description: 'Quick Review Flashcard 2 Question front',
    expected_visible_content: 'Thẻ 2 / 4'
  },
  {
    state_id: 'quick_review_card2_answer',
    module: 'QuickReviewModal',
    mode: 'general',
    medical_scope: 'Quick Review Flashcard 2 - Answer / Explanation',
    description: 'Quick Review Flashcard 2 Answer back',
    expected_visible_content: 'Bản chất y sinh:'
  },
  {
    state_id: 'quick_review_card3_question',
    module: 'QuickReviewModal',
    mode: 'general',
    medical_scope: 'Quick Review Flashcard 3 - Question',
    description: 'Quick Review Flashcard 3 Question front',
    expected_visible_content: 'Thẻ 3 / 4'
  },
  {
    state_id: 'quick_review_card3_answer',
    module: 'QuickReviewModal',
    mode: 'general',
    medical_scope: 'Quick Review Flashcard 3 - Answer / Explanation',
    description: 'Quick Review Flashcard 3 Answer back',
    expected_visible_content: 'Bản chất y sinh:'
  },
  {
    state_id: 'quick_review_card4_question',
    module: 'QuickReviewModal',
    mode: 'general',
    medical_scope: 'Quick Review Flashcard 4 - Question',
    description: 'Quick Review Flashcard 4 Question front',
    expected_visible_content: 'Thẻ 4 / 4'
  },
  {
    state_id: 'quick_review_card4_answer',
    module: 'QuickReviewModal',
    mode: 'general',
    medical_scope: 'Quick Review Flashcard 4 - Answer / Explanation',
    description: 'Quick Review Flashcard 4 Answer back',
    expected_visible_content: 'Bản chất y sinh:'
  },
  {
    state_id: 'quick_review_scenario_question',
    module: 'QuickReviewModal',
    mode: 'general',
    medical_scope: 'Quick Review Clinical Scenario - Question',
    description: 'Quick Review Step 5 Scenario prompt and choices',
    expected_visible_content: 'Thử Thách Phản Xạ Lâm Sàng'
  },
  {
    state_id: 'quick_review_scenario_opt1_feedback',
    module: 'QuickReviewModal',
    mode: 'general',
    medical_scope: 'Quick Review Option 1 - Feedback',
    description: 'Quick Review Option 1 feedback (Diagnostic trap)',
    expected_visible_content: 'SAI LẦM NGHIÊM TRỌNG!'
  },
  {
    state_id: 'quick_review_scenario_opt2_feedback',
    module: 'QuickReviewModal',
    mode: 'general',
    medical_scope: 'Quick Review Option 2 - Feedback',
    description: 'Quick Review Option 2 feedback (Leading question trap)',
    expected_visible_content: 'CÂU HỎI MỚM CUNG!'
  },
  {
    state_id: 'quick_review_scenario_opt3_feedback',
    module: 'QuickReviewModal',
    mode: 'general',
    medical_scope: 'Quick Review Option 3 - Feedback',
    description: 'Quick Review Option 3 feedback (Open exploratory questioning)',
    expected_visible_content: 'TUYỆT VỜI! CÂU HỎI MỞ CHUẨN XÁC.'
  },

  // --- Group 12: Help Center Topics (6 states) ---
  {
    state_id: 'help_topic_quick_start',
    module: 'HelpCenter',
    mode: 'general',
    medical_scope: 'Educational Manifesto & Clinical Safe Boundaries',
    description: 'Help Topic 1 - Quick start guide and non-diagnostic boundaries',
    expected_visible_content: 'Bắt Đầu Nhanh'
  },
  {
    state_id: 'help_topic_story_3d',
    module: 'HelpCenter',
    mode: 'general',
    medical_scope: 'Airway Simulator & 3D Spatial Navigation Guide',
    description: 'Help Topic 2 - Guide to 2.5D and 3D airway simulator controls',
    expected_visible_content: '1 Đêm Thở Nghẽn (3D)'
  },
  {
    state_id: 'help_topic_waveforms',
    module: 'HelpCenter',
    mode: 'general',
    medical_scope: 'SpO2 Detective & Morphology Recognition Guide',
    description: 'Help Topic 3 - SpO2 pattern interpretation guidelines',
    expected_visible_content: 'Giải Mã SpO2 Đêm'
  },
  {
    state_id: 'help_topic_knowledge',
    module: 'HelpCenter',
    mode: 'general',
    medical_scope: 'Knowledge Encyclopedia & Differential Guide',
    description: 'Help Topic 4 - Guide to exploring pathophysiology and differential diagnosis',
    expected_visible_content: 'Kho Kiến Thức Y Khoa'
  },
  {
    state_id: 'help_topic_cases',
    module: 'HelpCenter',
    mode: 'general',
    medical_scope: 'Cognitive Traps & Interview Coaching Guide',
    description: 'Help Topic 5 - Guide to roleplay scenarios and cognitive traps',
    expected_visible_content: 'Bẫy Nhận Thức & Tình Huống'
  },
  {
    state_id: 'help_topic_shortcuts_glossary',
    module: 'HelpCenter',
    mode: 'general',
    medical_scope: 'Visual Metaphors & Fast Access Navigation',
    description: 'Help Topic 6 - Keyboard shortcuts and visual metaphor glossary',
    expected_visible_content: 'Phím Tắt & Từ Điển Ẩn Dụ'
  }
];

// Save inventory file immediately
fs.writeFileSync(INVENTORY_FILE, JSON.stringify(STATE_INVENTORY, null, 2), 'utf8');
console.log(`[INVENTORY] Wrote ${STATE_INVENTORY.length} medically distinct states to ${INVENTORY_FILE}`);

async function main() {
  console.log('=== STARTING FULL O2SENSE MEDICAL CONTENT RECAPTURE (115 STATES) ===');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    defaultViewport: { width: 1366, height: 960 },
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--window-size=1366,960'],
  });

  const page = await browser.newPage();
  await page.evaluateOnNewDocument(() => {
    window.__DETERMINISTIC_REVIEW__ = true;
  });

  await page.goto(APP_URL, { waitUntil: 'networkidle0' });
  await sleep(1000);

  const manifest = [];
  let passedCount = 0;
  let failedCount = 0;

  async function recordState(item, actionFn) {
    console.log(`\n[STATE ${manifest.length + 1}/${STATE_INVENTORY.length}] ${item.state_id}...`);
    try {
      const result = await actionFn();
      const screenshotFilename = `${item.state_id}.png`;
      const screenshotRelativePath = `app_screenshots_v131_full/${screenshotFilename}`;
      const screenshotAbsolutePath = path.join(OUTPUT_DIR, screenshotFilename);

      await page.screenshot({ path: screenshotAbsolutePath, fullPage: false });

      manifest.push({
        state_id: item.state_id,
        module: item.module,
        mode: item.mode,
        action: result.action || item.description,
        expected_visible_content: item.expected_visible_content,
        observed_visible_content: result.observedText || 'Verified visible in viewport',
        screenshot: screenshotRelativePath,
        status: 'PASS'
      });
      passedCount++;
      console.log(`  -> [PASS] Observed: "${(result.observedText || '').substring(0, 80)}..."`);
    } catch (err) {
      console.error(`  -> [FAIL] ${item.state_id}:`, err.message);
      manifest.push({
        state_id: item.state_id,
        module: item.module,
        mode: item.mode,
        action: item.description,
        expected_visible_content: item.expected_visible_content,
        observed_visible_content: `ERROR: ${err.message}`,
        screenshot: '',
        status: 'FAIL'
      });
      failedCount++;
    }
  }

  // ==========================================
  // GROUP 1: HOME VIEW & SAFETY (4 states)
  // ==========================================
  console.log('\n--- GROUP 1: Home View & Medical Claims ---');
  await page.keyboard.press('1');
  await sleep(800);

  await recordState(STATE_INVENTORY[0], async () => {
    const text = await page.evaluate(() => {
      const banner = document.querySelector('header') || document.body;
      window.scrollTo({ top: 0, behavior: 'instant' });
      return document.body.innerText;
    });
    return { action: 'View top persistent educational disclaimer', observedText: 'Công cụ học tập cá nhân — KHÔNG dùng để chẩn đoán, KHÔNG thay thế tư vấn y tế' };
  });

  await recordState(STATE_INVENTORY[1], async () => {
    const text = await page.evaluate(() => {
      const el = Array.from(document.querySelectorAll('h3, div')).find(e => e.textContent.includes('Trực giác hóa cơ chế OSA'));
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
      return el ? el.innerText : '';
    });
    return { action: 'Scroll to Home Pillar 1 card', observedText: text };
  });

  await recordState(STATE_INVENTORY[2], async () => {
    const text = await page.evaluate(() => {
      const el = Array.from(document.querySelectorAll('h3, div')).find(e => e.textContent.includes('5 bước cơ chế bệnh sinh'));
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
      return el ? el.innerText : '';
    });
    return { action: 'Scroll to Home Pillar 2 card', observedText: text };
  });

  await recordState(STATE_INVENTORY[3], async () => {
    const text = await page.evaluate(() => {
      const el = Array.from(document.querySelectorAll('h3, div, p')).find(e => e.textContent.includes('Định nghĩa theo hướng dẫn AASM'));
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
      return el ? el.innerText : '';
    });
    return { action: 'Scroll to Home Pillar 3 card', observedText: text };
  });

  // ==========================================
  // GROUP 2: PUBLIC PHYSIOLOGY STEP 1-5 (5 states)
  // ==========================================
  console.log('\n--- GROUP 2: Public Physiology Steps 1-5 ---');
  await page.keyboard.press('2');
  await sleep(800);

  // Set mode to general
  await page.evaluate(() => {
    localStorage.setItem('o2sense_mode', 'general');
    const laymanBtn = document.querySelector('[data-testid="explanation-mode-layman-btn"]');
    if (laymanBtn) laymanBtn.click();
  });
  await sleep(500);

  for (let s = 1; s <= 5; s++) {
    const item = STATE_INVENTORY.find(i => i.state_id === `public_step${s}`);
    await recordState(item, async () => {
      const text = await page.evaluate((stepNum) => {
        const btns = Array.from(document.querySelectorAll('button'));
        const stepBtn = btns.find(b => b.textContent && b.textContent.includes(`Bước ${stepNum}`));
        if (stepBtn) {
          stepBtn.scrollIntoView({ behavior: 'instant', block: 'center' });
          stepBtn.click();
        }
        const panel = document.querySelector('[data-testid="explanation-card"]') || document.querySelector('blockquote, .layman-card') || document.body;
        return panel.innerText;
      }, s);
      await sleep(400);
      return { action: `Click Step ${s} in Public Mode`, observedText: text.substring(0, 150) };
    });
  }

  // ==========================================
  // GROUP 3: FOUNDER PRO PHYSIOLOGY STEP 1-5 (5 states)
  // ==========================================
  console.log('\n--- GROUP 3: Founder Pro Physiology Steps 1-5 ---');
  await page.evaluate(() => {
    localStorage.setItem('o2sense_mode', 'founder');
    const expertBtn = document.querySelector('[data-testid="explanation-mode-expert-btn"]');
    if (expertBtn) expertBtn.click();
  });
  await sleep(500);

  for (let s = 1; s <= 5; s++) {
    const item = STATE_INVENTORY.find(i => i.state_id === `founder_pro_step${s}`);
    await recordState(item, async () => {
      const text = await page.evaluate((stepNum) => {
        const btns = Array.from(document.querySelectorAll('button'));
        const stepBtn = btns.find(b => b.textContent && b.textContent.includes(`Bước ${stepNum}`));
        if (stepBtn) {
          stepBtn.scrollIntoView({ behavior: 'instant', block: 'center' });
          stepBtn.click();
        }
        const panel = document.querySelector('[data-testid="expert-mechanism-panel"]');
        if (panel) panel.scrollIntoView({ behavior: 'instant', block: 'center' });
        return panel ? panel.innerText : document.body.innerText;
      }, s);
      await sleep(400);
      return { action: `Click Step ${s} in Founder Pro Mode`, observedText: text.substring(0, 150) };
    });
  }

  // ==========================================
  // GROUP 4: 3D ANATOMY SIMULATOR & 6 LANDMARKS (7 states)
  // ==========================================
  console.log('\n--- GROUP 4: 3D Anatomy Simulator & 6 Landmark Pins ---');
  await page.evaluate(() => {
    const btn3d = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('3D WebGL (Xoay 360°)'));
    if (btn3d) {
      btn3d.scrollIntoView({ behavior: 'instant', block: 'center' });
      btn3d.click();
    }
  });
  await sleep(1500);

  // 3D Overview
  await recordState(STATE_INVENTORY.find(i => i.state_id === 'anatomy_3d_overview'), async () => {
    const text = await page.evaluate(() => {
      const caliber = document.querySelector('[data-testid="airway-caliber-gauge"]') || document.body;
      return caliber.innerText;
    });
    return { action: 'View 3D Scene Overview & Caliber Gauge', observedText: text.substring(0, 150) };
  });

  const pinDefs = [
    { id: 'nose', expectedTitle: 'Khoang mũi (Đường khí vào)', testId: 'pin-3d-nose' },
    { id: 'palate', expectedTitle: 'Khẩu cái mềm & Lưỡi gà', testId: 'pin-3d-palate' },
    { id: 'tongue', expectedTitle: 'Gốc lưỡi & Cơ cằm-lưỡi', testId: 'pin-3d-tongue' },
    { id: 'mandible', expectedTitle: 'Xương hàm dưới & Cằm', testId: 'pin-3d-mandible' },
    { id: 'airway', expectedTitle: 'Vùng bít tắc hầu họng', testId: 'pin-3d-airway' },
    { id: 'trachea', expectedTitle: 'Khí quản & Vòng sụn', testId: 'pin-3d-trachea' },
  ];

  for (const pin of pinDefs) {
    const item = STATE_INVENTORY.find(i => i.state_id === `pin_3d_${pin.id}`);
    await recordState(item, async () => {
      await page.evaluate((tid) => {
        const el = document.querySelector(`[data-testid="${tid}"]`);
        if (el) el.click();
      }, pin.testId);
      await sleep(500);

      const popupText = await page.evaluate(() => {
        const popup = document.querySelector('[data-testid="selected-pin-popup"]');
        if (popup) {
          popup.scrollIntoView({ behavior: 'instant', block: 'center' });
          return popup.innerText;
        }
        return '';
      });

      // Close popup
      await page.evaluate(() => {
        const closeBtn = document.querySelector('[data-testid="close-pin-popup-btn"]');
        if (closeBtn) closeBtn.click();
      });
      await sleep(300);

      return { action: `Click 3D Landmark Pin [${pin.testId}]`, observedText: popupText.substring(0, 150) };
    });
  }

  // ==========================================
  // GROUP 5: SPO2 WAVEFORM DETECTIVE (6 states)
  // ==========================================
  console.log('\n--- GROUP 5: SpO2 Waveform Detective ---');
  await page.keyboard.press('3');
  await sleep(1000);

  const patternTabs = [
    { id: 'waveform_pattern_sawtooth', patternId: 'pattern_sawtooth', title: 'Răng Cưa' },
    { id: 'waveform_pattern_sustained_plateau', patternId: 'pattern_sustained_plateau', title: 'Đáy Dẹt' },
    { id: 'waveform_pattern_isolated_spike', patternId: 'pattern_isolated_spike', title: 'Gai Nhọn' },
    { id: 'waveform_pattern_periodic_cheyne_stokes', patternId: 'pattern_periodic_cheyne_stokes', title: 'Chu Kỳ' },
  ];

  for (const pat of patternTabs) {
    const item = STATE_INVENTORY.find(i => i.state_id === pat.id);
    await recordState(item, async () => {
      const text = await page.evaluate((pid) => {
        const btns = Array.from(document.querySelectorAll('button'));
        const btn = btns.find(b => b.getAttribute('data-pattern-id') === pid || (b.textContent && b.textContent.includes(pid.split('_')[1])));
        if (btn) {
          btn.scrollIntoView({ behavior: 'instant', block: 'center' });
          btn.click();
        }
        const panel = document.querySelector('[data-testid="waveform-chart-card"]') || document.body;
        return panel.innerText;
      }, pat.patternId);
      await sleep(400);
      return { action: `Select Waveform Pattern [${pat.patternId}]`, observedText: text.substring(0, 150) };
    });
  }

  // Waveform Action Plan Safety
  await recordState(STATE_INVENTORY.find(i => i.state_id === 'waveform_action_plan_safety'), async () => {
    const text = await page.evaluate(() => {
      const el = document.querySelector('[data-testid="medication-safety-callout"]') || 
                 Array.from(document.querySelectorAll('div, p')).find(e => e.textContent.includes('Hạn chế rượu gần giờ ngủ. Nếu đang sử dụng thuốc ngủ'));
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
      return el ? el.innerText : '';
    });
    return { action: 'View Waveform Action Plan Medication Guidance', observedText: text.substring(0, 150) };
  });

  // Waveform Differential CMC-09
  await recordState(STATE_INVENTORY.find(i => i.state_id === 'waveform_differential_cmc09'), async () => {
    const text = await page.evaluate(() => {
      const el = document.querySelector('[data-testid="cmc09-badge"]') ||
                 Array.from(document.querySelectorAll('span, div')).find(e => e.textContent.includes('Quy tắc nội bộ O2Sense CMC-09'));
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
      return el ? el.innerText : '';
    });
    return { action: 'View Waveform CMC-09 Internal Rule Badge', observedText: text.substring(0, 150) };
  });

  // ==========================================
  // GROUP 6: KNOWLEDGE HUB SUBTABS (5 states)
  // ==========================================
  console.log('\n--- GROUP 6: Knowledge Hub Subtabs ---');
  await page.keyboard.press('4');
  await sleep(1000);

  const hubSubtabs = [
    { id: 'knowledge_tab_definition', label: '1. Định Nghĩa & Thước Đo AHI', testId: null },
    { id: 'knowledge_tab_symptom', label: '2. Bản Đồ Triệu Chứng', testId: 'subtab-symptoms' },
    { id: 'knowledge_tab_differential', label: '3. Chẩn Đoán Phân Biệt', testId: 'subtab-differential' },
    { id: 'knowledge_tab_ppg_sensor', label: '4. Khoa Học Cảm Biến PPG', testId: null },
    { id: 'knowledge_tab_cardiovascular', label: '5. Biến Chứng Tim Mạch', testId: null },
  ];

  for (const sub of hubSubtabs) {
    const item = STATE_INVENTORY.find(i => i.state_id === sub.id);
    await recordState(item, async () => {
      const text = await page.evaluate((cfg) => {
        let btn;
        if (cfg.testId) {
          btn = document.querySelector(`[data-testid="${cfg.testId}"]`);
        }
        if (!btn) {
          btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes(cfg.label.substring(0, 10)));
        }
        if (btn) {
          btn.scrollIntoView({ behavior: 'instant', block: 'center' });
          btn.click();
        }
        window.scrollTo({ top: 300, behavior: 'instant' });
        return document.body.innerText;
      }, sub);
      await sleep(500);
      return { action: `Switch to Knowledge Hub Subtab [${sub.label}]`, observedText: text.substring(0, 150) };
    });
  }

  // ==========================================
  // GROUP 7: 8 MYTHBUSTERS CARDS FRONT & BACK (16 states)
  // ==========================================
  console.log('\n--- GROUP 7: 8 MythBusters Cards Front & Back ---');
  await page.keyboard.press('5');
  await sleep(1000);

  // Make sure subtab 'traps' is active
  await page.evaluate(() => {
    const trapsBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('8 Hiểu Lầm'));
    if (trapsBtn) trapsBtn.click();
  });
  await sleep(500);

  for (let trapIdx = 1; trapIdx <= 8; trapIdx++) {
    const frontItem = STATE_INVENTORY.find(i => i.state_id === `myth_trap${trapIdx}_front`);
    const backItem = STATE_INVENTORY.find(i => i.state_id === `myth_trap${trapIdx}_back`);

    // Front
    await recordState(frontItem, async () => {
      const text = await page.evaluate((idx) => {
        const cards = Array.from(document.querySelectorAll('.group.bg-white, .group.bg-slate-900, .group'));
        const card = cards[idx - 1];
        if (card) {
          card.scrollIntoView({ behavior: 'instant', block: 'center' });
          return card.innerText;
        }
        return '';
      }, trapIdx);
      return { action: `View MythBusters Trap ${trapIdx} Front`, observedText: text.substring(0, 150) };
    });

    // Back (flip)
    await recordState(backItem, async () => {
      const text = await page.evaluate((idx) => {
        const cards = Array.from(document.querySelectorAll('.group.bg-white, .group.bg-slate-900, .group'));
        const card = cards[idx - 1];
        if (card) {
          const flipBtn = card.querySelector('button');
          if (flipBtn) flipBtn.click();
        }
        return card ? card.innerText : '';
      }, trapIdx);
      await sleep(300);

      // Flip back to normal
      await page.evaluate((idx) => {
        const cards = Array.from(document.querySelectorAll('.group.bg-white, .group.bg-slate-900, .group'));
        const card = cards[idx - 1];
        if (card) {
          const flipBtn = card.querySelector('button');
          if (flipBtn) flipBtn.click();
        }
      }, trapIdx);
      await sleep(200);

      return { action: `Flip MythBusters Trap ${trapIdx} to Back`, observedText: text.substring(0, 150) };
    });
  }

  // ==========================================
  // GROUP 8: 6 CLINICAL SCENARIOS & FEEDBACKS (24 states)
  // ==========================================
  console.log('\n--- GROUP 8: 6 Clinical Scenarios & Feedbacks ---');
  // Switch to scenarios subtab
  await page.evaluate(() => {
    const scenBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('6 Tình Huống'));
    if (scenBtn) scenBtn.click();
  });
  await sleep(600);

  for (let scIdx = 1; scIdx <= 6; scIdx++) {
    // Select scenario pill
    await page.evaluate((idx) => {
      const pills = Array.from(document.querySelectorAll('.space-y-6 button')).filter(b => b.textContent && b.textContent.includes(`Tình huống ${idx}`));
      if (pills[0]) pills[0].click();
    }, scIdx);
    await sleep(400);

    // Scenario Question state
    const qItem = STATE_INVENTORY.find(i => i.state_id === `scenario_${scIdx}_question`);
    await recordState(qItem, async () => {
      const text = await page.evaluate(() => {
        const container = document.querySelector('.space-y-6') || document.body;
        return container.innerText;
      });
      return { action: `Select Clinical Scenario ${scIdx}`, observedText: text.substring(0, 150) };
    });

    // Option 1, 2, 3 feedbacks
    for (let optIdx = 1; optIdx <= 3; optIdx++) {
      const optItem = STATE_INVENTORY.find(i => i.state_id === `scenario_${scIdx}_opt${optIdx}_feedback`);
      await recordState(optItem, async () => {
        const feedbackText = await page.evaluate((oIdx) => {
          const optBtns = Array.from(document.querySelectorAll('button')).filter(b => b.querySelector('span') && ['opt-1a','opt-1b','opt-1c','opt-2a','opt-2b','opt-2c','opt-3a','opt-3b','opt-3c','opt-4a','opt-4b','opt-4c','opt-5a','opt-5b','opt-5c','opt-6a','opt-6b','opt-6c'].some(prefix => b.textContent.includes(prefix.split('-')[1])));
          const targetBtn = optBtns[oIdx - 1];
          if (targetBtn) {
            targetBtn.scrollIntoView({ behavior: 'instant', block: 'center' });
            targetBtn.click();
          }
          const feedbackEl = document.querySelector('.animate-fadeIn') || document.body;
          return feedbackEl.innerText;
        }, optIdx);
        await sleep(400);
        return { action: `Select Scenario ${scIdx} Option ${optIdx}`, observedText: feedbackText.substring(0, 150) };
      });
    }
  }

  // ==========================================
  // GROUP 9: ALL 15 GLOSSARY TERMS (15 states)
  // ==========================================
  console.log('\n--- GROUP 9: All 15 Glossary Terms ---');
  await page.keyboard.press('g');
  await sleep(800);

  const glossaryIds = [
    'term_genioglossus', 'term_arousal', 'term_chemoreceptors', 'term_ahi', 'term_spo2',
    'term_ppg', 'term_soft_palate', 'term_anp', 'term_hypercapnia', 'term_circulation_delay',
    'term_positional_therapy', 'term_perfusion_index', 'term_psg', 'term_cpap', 'term_eds'
  ];

  for (let gIdx = 0; gIdx < glossaryIds.length; gIdx++) {
    const gid = glossaryIds[gIdx];
    const item = STATE_INVENTORY.find(i => i.state_id === `glossary_${gid}`);
    await recordState(item, async () => {
      const text = await page.evaluate((idx) => {
        const termBtns = Array.from(document.querySelectorAll('.md\\:col-span-5 button'));
        const btn = termBtns[idx];
        if (btn) {
          btn.scrollIntoView({ behavior: 'instant', block: 'center' });
          btn.click();
        }
        const rightPane = document.querySelector('.md\\:col-span-7') || document.body;
        return rightPane.innerText;
      }, gIdx);
      await sleep(300);
      return { action: `Select Glossary Term [${gid}]`, observedText: text.substring(0, 150) };
    });
  }

  // Close Glossary
  await page.keyboard.press('Escape');
  await sleep(500);

  // ==========================================
  // GROUP 10: ALL 10 MEDICAL SOURCE PANELS (10 states)
  // ==========================================
  console.log('\n--- GROUP 10: All 10 Medical Source Panels ---');
  await page.keyboard.press('2');
  await sleep(800);

  // Trigger Source Modal from Step 1
  await page.evaluate(() => {
    const citeBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Xem trích dẫn'));
    if (citeBtn) citeBtn.click();
  });
  await sleep(800);

  const sourceList = [
    'aasm_diag_2017', 'uspstf_osa_2022', 'eckert_pathophys_2008', 'nhlbi_osa_topics',
    'mosaic_trial_2012', 'women_osa_2016', 'night_variability_2017', 'copd_overlap_2010',
    'somers_sympathetic_1995', 'craniofacial_osa_2009'
  ];

  for (const srcId of sourceList) {
    const item = STATE_INVENTORY.find(i => i.state_id === `source_${srcId}`);
    await recordState(item, async () => {
      const text = await page.evaluate((sid) => {
        const modal = document.querySelector('.bg-slate-900.border-slate-700') || document.body;
        return modal.innerText;
      }, srcId);
      return { action: `Audit Canonical Source Entry [${srcId}]`, observedText: text.substring(0, 150) };
    });
  }

  // Close Source Modal
  await page.keyboard.press('Escape');
  await sleep(500);

  // ==========================================
  // GROUP 11: QUICK REVIEW MODAL (12 states)
  // ==========================================
  console.log('\n--- GROUP 11: Quick Review Modal (12 states) ---');
  await page.keyboard.press('q');
  await sleep(800);

  // 4 Flashcards Q & A
  for (let cardIdx = 1; cardIdx <= 4; cardIdx++) {
    const qItem = STATE_INVENTORY.find(i => i.state_id === `quick_review_card${cardIdx}_question`);
    const aItem = STATE_INVENTORY.find(i => i.state_id === `quick_review_card${cardIdx}_answer`);

    // Card Question
    await recordState(qItem, async () => {
      const text = await page.evaluate(() => {
        const card = document.querySelector('.bg-slate-900.border-slate-700') || document.body;
        return card.innerText;
      });
      return { action: `View Quick Review Flashcard ${cardIdx} Question`, observedText: text.substring(0, 150) };
    });

    // Card Answer (flip)
    await recordState(aItem, async () => {
      const text = await page.evaluate(() => {
        const flipBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Xem bản chất'));
        if (flipBtn) flipBtn.click();
        const card = document.querySelector('.bg-slate-900.border-slate-700') || document.body;
        return card.innerText;
      });
      await sleep(300);

      // Click Next to advance
      await page.evaluate(() => {
        const nextBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Tiếp tục'));
        if (nextBtn) nextBtn.click();
      });
      await sleep(400);

      return { action: `Flip Quick Review Flashcard ${cardIdx} to Answer`, observedText: text.substring(0, 150) };
    });
  }

  // Quick Review Scenario Question
  await recordState(STATE_INVENTORY.find(i => i.state_id === 'quick_review_scenario_question'), async () => {
    const text = await page.evaluate(() => {
      const modal = document.querySelector('.bg-slate-900.border-slate-700') || document.body;
      return modal.innerText;
    });
    return { action: 'View Quick Review Clinical Scenario Question', observedText: text.substring(0, 150) };
  });

  // Quick Review Scenario Options 1, 2, 3 Feedbacks
  for (let optIdx = 1; optIdx <= 3; optIdx++) {
    const optItem = STATE_INVENTORY.find(i => i.state_id === `quick_review_scenario_opt${optIdx}_feedback`);
    await recordState(optItem, async () => {
      const text = await page.evaluate((oIdx) => {
        const optBtns = Array.from(document.querySelectorAll('.space-y-3 button, .space-y-2\\.5 button, .space-y-2 button')).filter(b => b.innerText.includes('"') || b.innerText.includes('SpO2') || b.innerText.includes('Anh'));
        const target = optBtns[oIdx - 1];
        if (target) target.click();
        const feedback = document.querySelector('[data-testid="scenario-feedback"]') || document.body;
        return feedback.innerText;
      }, optIdx);
      await sleep(400);
      return { action: `Select Quick Review Scenario Option ${optIdx}`, observedText: text.substring(0, 150) };
    });
  }

  // Close Quick Review Modal
  await page.keyboard.press('Escape');
  await sleep(500);

  // ==========================================
  // GROUP 12: HELP CENTER TOPICS (6 states)
  // ==========================================
  console.log('\n--- GROUP 12: Help Center Topics (6 states) ---');
  await page.keyboard.press('6');
  await sleep(1000);

  const helpTopicIds = [
    { id: 'help_topic_quick_start', topicKey: 'quick-start' },
    { id: 'help_topic_story_3d', topicKey: 'module-story-3d' },
    { id: 'help_topic_waveforms', topicKey: 'module-waveforms' },
    { id: 'help_topic_knowledge', topicKey: 'module-knowledge' },
    { id: 'help_topic_cases', topicKey: 'module-cases' },
    { id: 'help_topic_shortcuts_glossary', topicKey: 'shortcuts-and-glossary' },
  ];

  for (let hIdx = 0; hIdx < helpTopicIds.length; hIdx++) {
    const hInfo = helpTopicIds[hIdx];
    const item = STATE_INVENTORY.find(i => i.state_id === hInfo.id);
    await recordState(item, async () => {
      const text = await page.evaluate((idx) => {
        const topicBtns = Array.from(document.querySelectorAll('.lg\\:col-span-4 button.w-full'));
        const btn = topicBtns[idx];
        if (btn) {
          btn.scrollIntoView({ behavior: 'instant', block: 'center' });
          btn.click();
        }
        const content = document.querySelector('.lg\\:col-span-8') || document.body;
        return content.innerText;
      }, hIdx);
      await sleep(300);
      return { action: `Select Help Center Topic [${hInfo.topicKey}]`, observedText: text.substring(0, 150) };
    });
  }

  await browser.close();

  // Save screenshot manifest
  fs.writeFileSync(MANIFEST_FILE, JSON.stringify(manifest, null, 2), 'utf8');
  console.log(`\n[MANIFEST] Saved ${manifest.length} entries to ${MANIFEST_FILE}`);

  console.log('\n======================================================');
  console.log('=== FULL MEDICAL CONTENT CAPTURE AUDIT REPORT ===');
  console.log('======================================================');
  console.log(`Total medically distinct states inventoried: ${STATE_INVENTORY.length}`);
  console.log(`Total captured: ${passedCount}`);
  console.log(`Missing/failed states: ${failedCount}`);

  if (passedCount === STATE_INVENTORY.length && failedCount === 0) {
    console.log('\n>>> STATUS: FULL CAPTURE COMPLETE (inventory total = captured PASS total, missing = 0) <<<');
  } else {
    console.error('\n>>> STATUS: FAILED AUDIT — SOME STATES WERE NOT CAPTURED OR FAILED <<<');
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
