# AI FINAL ANTI CORRECTIVE TRACEABILITY TABLE — O2SENSE
**Scope:** LAST AI CONTENT CORRECTION BEFORE PHYSICIAN REVIEW  
**Status:** IMPLEMENTATION COMPLETE — REQUIRES INDEPENDENT `/browser` VERIFICATION  

---

## 1. COMPACT CORRECTIVE TRACEABILITY TABLE (11 REGISTERED ITEMS)

| Issue ID | File / Component Changed | Old Meaning / Wording | Approved New Meaning / Wording | Verification Result |
| :--- | :--- | :--- | :--- | :--- |
| **I-01** (P2) | `src/data/helpCenterData.ts` (Chapters 1 & 5) | Manual referred to "5 Ca Bệnh" while live module contains 6 scenarios | Changed all references to 6 scenarios ("6 Tình Huống Thực Tế"), matching the live module | **PASS** (0 stale "5 ca" occurrences; build clean) |
| **I-02** (P2) | `src/components/WaveformDetectiveView.tsx`<br>`src/components/KnowledgeHubView.tsx` | CMC-09 badge implied alignment with official AASM rule | Framed neutrally as internal operational heuristic: *"Quy tắc nội bộ O2Sense CMC-09"* | **PASS** (No official AASM rule claim; build clean) |
| **I-03** (P0) | `src/data/helpCenterData.ts` (Chapter 4) | Mandatory prescription framing: patient *"bắt buộc phải đeo máy thở CPAP"* | Bounded guidance: *"Nếu CPAP đã được bác sĩ/chuyên gia y tế chỉ định, kiến thức trong mục này có thể giúp giải thích vì sao việc sử dụng đều đặn theo hướng dẫn là quan trọng. Không dùng O2Sense để tự quyết định mình hoặc người khác cần CPAP."* | **PASS** (0 mandatory statements; build clean) |
| **I-04** (P1) | `src/data/helpCenterData.ts` (Chapter 4) | Uniform "3-3-3" multiplier (3× risk for stroke, hypertension, accidents) | Bounded qualitative statement: *"OSA có liên quan với tăng nguy cơ tim mạch và tai nạn do buồn ngủ, nhưng mức nguy cơ khác nhau giữa từng kết cục, từng nhóm người bệnh và từng nghiên cứu."* | **PASS** (0 occurrences of "3-3-3"; build clean) |
| **I-05** (P1) | `src/data/helpCenterData.ts` (Chapter 6) | Fear-based script: *"Mỗi đêm tim và não... bị giật mình bóp nghẹt 30 lần mỗi tiếng..."* | Calm educational communication: *"Các biến cố hô hấp khi ngủ có thể làm giấc ngủ bị gián đoạn và gây dao động oxy hoặc đáp ứng tim mạch ở một số người. Mức độ cần được đánh giá dựa trên dữ liệu và bối cảnh lâm sàng, không nên suy đoán từ một dấu hiệu đơn lẻ."* | **PASS** (0 fear-based copy; build clean) |
| **I-06** (P1) | `src/data/helpCenterData.ts` (Chapter 5) | Framing as *"nhập vai bác sĩ điều trị"*, selecting *"hướng xử trí"* | Accurate coaching framing: *"6 tình huống thực tế giúp luyện cách đặt câu hỏi trung lập, nhận diện bẫy suy diễn và giao tiếp an toàn mà không tự chẩn đoán hoặc đưa ra chỉ định điều trị."* | **PASS** (0 "nhập vai" or "hướng xử trí"; build clean) |
| **I-07** (P1) | `src/data/helpCenterData.ts` (Chapter 2) | 4 stages, rigid example vitals, cortical micro-arousal framed as mandatory | Conceptually aligned with approved 5-step model; vitals qualified as simulation only; cortical arousal explicitly marked optional for airway reopening | **PASS** (Aligned with 5 steps; arousal non-mandatory; build clean) |
| **I-08** (P2) | `src/data/helpCenterData.ts` (Chapter 3)<br>`src/data/osa.json` | Waveform values (95% → 82%, 40–90 s) looked diagnostic | Prominent visible qualifier: *"Ví dụ mô phỏng — thời gian, độ sâu và hình dạng tín hiệu thực tế thay đổi giữa từng người và từng đêm; không dùng mẫu này để tự chẩn đoán."* | **PASS** (Qualifier verified visible in required cards; build clean) |
| **I-09** (P2) | `src/data/helpCenterData.ts` (Chapter 4) | Deterministic arrow chain: *"Thiếu oxy → Tăng CO2 → Co thắt mạch phổi → Tăng gánh thất phải"* | Bounded mechanism wording: *"Thiếu oxy và/hoặc tăng CO₂, đặc biệt khi kéo dài hoặc lặp lại trong bối cảnh phù hợp, có thể góp phần gây co mạch phổi và tăng gánh cho thất phải."* | **PASS** (0 deterministic arrow chains; build clean) |
| **I-10** (P1) | `src/data/helpCenterData.ts` (Chapter 5) | Generic numerical promise: *"CPAP có thể giúp giảm từ 5–10 mmHg huyết áp mà không cần tăng thêm thuốc."* | Bounded clinical copy: *"Ở một số người mắc OSA, điều trị phù hợp — bao gồm CPAP khi có chỉ định — có thể góp phần cải thiện kiểm soát huyết áp. Mức đáp ứng thay đổi theo từng người, mức độ bệnh, tuân thủ điều trị và bệnh lý đi kèm."* | **PASS** (0 generic 5–10 mmHg BP promises; build clean) |
| **I-11** (P1) | `src/data/osa.json` (Step 2 & Trap 1) | Owens & Malhotra 2010 (COPD overlap) incorrectly attached to Step 2 snoring mechanics | Removed Owens 2010 from Step 2 (retained strictly under COPD overlap trap); attached Pevernagie D, Aarts RM, De Meyer M. 2010 (*Sleep Med Rev*, PMID 19665907, DOI 10.1016/j.smrv.2009.06.002); bounded snoring mechanism to multi-factorial soft-tissue vibration | **PASS** (Exact bibliographic metadata & canonical schema; build clean) |

---

## 2. BUILD & STATIC VERIFICATION RECORD
- `tsc --noEmit`: 0 errors
- `npm run build`: Exit code 0 (1880 modules transformed, production bundles generated in `dist/`)
- Global string audit: 0 obsolete/forbidden strings found across all `.ts`, `.tsx`, and `.json` files in `src/`.
- All user-facing content preserved in Vietnamese.
