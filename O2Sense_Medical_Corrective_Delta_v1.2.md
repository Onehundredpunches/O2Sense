# O2SENSE — MEDICAL CORRECTIVE DELTA v1.2
**Status:** MICRO-CORRECTIVE PASS — FINAL AI MEDICAL CLEANUP BEFORE PHYSICIAN AUDIT  
**Date:** 09/09/2026  
**Depends on:** Medical Corrective Authority v1.0 + Corrective Delta v1.1  
**Scope:** Only the items below. Do NOT reopen already-passed content unless technically required by a v1.2 item.

---

# 0. HARD RELEASE PRINCIPLE

**Medical correctness > scientific nuance > safety > clarity > UX > animation/wow effect.**

This pass exists to remove remaining medically misleading, over-precise, weakly supported, or incompletely audited content before physician review.

Antigravity is an implementation agent, not the medical authority.

Do NOT:
- invent new medical facts;
- add new thresholds or numeric ranges;
- strengthen medical wording;
- “improve” approved copy;
- add new diagnosis/treatment guidance;
- expand claims for O2Ring or wearable devices;
- patch unrelated medical content unless reported as `NEW_MEDICAL_ISSUE`;
- claim Medical PASS.

If implementation needs wording not supplied here:
`PENDING_MEDICAL_REVIEW` → report only.

---

# 1. FULL MEDICAL-STATE COVERAGE

## V12-P0-001 — Replace “57/57 selected targets” with full medical-content inventory coverage

**Problem**
v1.1 proved that 57 selected targets passed DOM assertions, but this did NOT cover all medically distinct content states.

Known gaps from v1.1:
- App contains 6 clinical scenarios, but only scenario 1 options + feedback were captured.
- Glossary contains ~15 medical terms, but only Genioglossus + Carotid Body details were captured.
- Source/Citation modal captured only one taxonomy state, not every source-detail panel.
- Quick Review captured only one question/explanation pair, not every medically distinct card/question/answer explanation.

**Required process**
Before capturing:
1. recursively inventory ALL medically distinct UI states from source/data;
2. generate `medical_state_inventory_v12.json`;
3. compare inventory vs capture targets;
4. fail capture if any medical state has no target.

**Inventory categories must include at minimum**
- Home/Public/Founder Pro disclaimer states;
- 2.5D Step 1–5 Public;
- 2.5D Step 1–5 Founder Pro;
- all medically distinct 3D steps, cameras, pins/popups;
- all SpO2 waveform tabs;
- all Knowledge Hub tabs/subtabs;
- all 8 MythBusters front + back;
- all 6 clinical scenarios:
  - overview;
  - options/decision state;
  - every distinct medical feedback/explanation state;
- every glossary medical term detail;
- every source/citation detail item;
- every Quick Review medical question + correct-answer explanation;
- all safety/help states with medical claims.

**Important**
The final number may be >57. Do not target a legacy fixed count.

---

## V12-P0-002 — DOM assertion must validate semantic state, not generic page text

For each screenshot target, manifest must include:
- `state_id`
- `route/module`
- `mode`
- `expected medical item ID`
- `selector used`
- `expected exact/normalized selected label`
- `observed selected label`
- `assertion result`
- screenshot filename
- SHA-256 (integrity only)

**Assertion FAIL conditions**
- generic heading only;
- same heading shared by multiple substates;
- button clicked but selected content not verified;
- state is hidden/offscreen and not confirmed;
- screenshot exists but medical item ID not matched.

**PASS**
Every inventory item maps 1:1 to a positively asserted rendered state.

---

## V12-P0-003 — Use a clean v1.2 capture folder

Create:
`app_screenshots_v12/`

Do not mix legacy v1.0/v1.1 screenshots with v1.2 output.

Required outputs:
- `app_screenshots_v12/`
- `medical_state_inventory_v12.json`
- `screenshot_manifest_v12.json`
- `O2Sense_Full_App_Showcase_v12.html`

---

# 2. CIRCULATION DELAY — CORRECT THE DEFINITION

## V12-P0-004 — Remove fixed “15–30 seconds from airway closure to finger drop” teaching

**Problem**
Current sensor education still frames circulation delay approximately as:
airway obstruction starts → 15–30 s later “oxygen-poor blood reaches the finger” → SpO2 falls.

This is too simplistic and uses a fixed range as if it were a rule.

### APPROVED PUBLIC
> **SpO₂ ở ngón tay phản ứng trễ so với thay đổi hô hấp. Vì vậy, sau khi một đợt rối loạn hô hấp kết thúc và luồng khí đã phục hồi, SpO₂ ngoại vi vẫn có thể tiếp tục giảm một lúc trước khi chạm đáy rồi mới tăng trở lại. Khoảng trễ thay đổi giữa từng người và thiết bị.**

### APPROVED FOUNDER PRO
> **Peripheral SpO₂ is delayed relative to respiratory events because of cardiopulmonary-to-peripheral transit time and signal processing. In sleep physiology research, lung-to-finger circulation time is commonly estimated from respiratory-event termination/recovery ventilation to the subsequent SpO₂ nadir. The interval varies across individuals, cardiovascular state and measurement systems.**

**REMOVE**
- “15–30 s” as a headline/clinical rule;
- definition from airway closure onset → first finger desaturation;
- wording implying a parcel of “oxygen-poor blood” simply travels from throat to finger.

**Animation**
Use:
`event → reopening/recovery breath → delayed continued SpO2 fall → nadir → resaturation`

**Evidence**
- Lung-to-finger circulation-time sleep studies: respiratory-event termination/recovery ventilation → SpO₂ nadir.
- Example source: PMCID PMC4067439; PMCID PMC11261378.

---

# 3. GLOSSARY — SpO2 <90%

## V12-P1-005 — Remove universal “<90% = clinically significant hypoxemia” claim

**Current issue**
Glossary reportedly states:
“Dưới 90% được xem là tụt oxy máu có ý nghĩa lâm sàng.”

### APPROVED PUBLIC
> **SpO₂ dưới 90% là một mốc thường được dùng trong một số chỉ số như T90, nhưng ý nghĩa của một giá trị SpO₂ cụ thể phụ thuộc vào triệu chứng, mức nền của từng người, bệnh nền, độ cao và giới hạn của thiết bị. Không nên dùng một lần đo đơn lẻ để tự chẩn đoán nguyên nhân.**

### APPROVED PRO
> **SpO₂ <90% is a commonly used threshold for metrics such as T90, but it is not a universal diagnostic or emergency threshold. Interpretation depends on baseline oxygenation, clinical context, altitude, repeated trend and device performance.**

**Evidence**
FDA: pulse-oximeter readings must be interpreted with symptoms/context and can be inaccurate under multiple conditions.

---

# 4. GLOSSARY — EEG AROUSAL

## V12-P1-006 — Correct `3–15 seconds` wording

**Problem**
AASM arousal scoring uses an abrupt EEG frequency shift lasting **at least 3 seconds**, after at least 10 seconds of stable sleep. “3–15 seconds” must not be presented as the scoring definition or maximum duration.

### APPROVED PUBLIC
> **Vi thức giấc là một thay đổi ngắn trên điện não trong lúc ngủ. Người bệnh thường không nhận biết hoặc nhớ sự kiện này. Đây là tín hiệu được chấm trên EEG trong nghiên cứu giấc ngủ, không thể quan sát trực tiếp chỉ từ SpO₂ của wearable.**

### APPROVED FOUNDER PRO
> **An EEG arousal is scored when there is an abrupt shift in EEG frequency lasting at least 3 seconds, with at least 10 seconds of stable sleep preceding the change, according to AASM scoring conventions. It is not synonymous with full conscious awakening and is not directly measured by pulse oximetry.**

**REMOVE**
- `3–15 s` as AASM definition;
- any claim that a wearable SpO2 trace directly shows EEG arousal.

---

# 5. CAROTID BODY vs CAROTID SINUS

## V12-P1-007 — Make the distinction explicit and non-confusing

### APPROVED PUBLIC
> **Thể cảnh (carotid body)** chứa các thụ thể hóa học ngoại biên, nhạy với thay đổi O₂ và góp phần đáp ứng với CO₂/pH. **Xoang cảnh (carotid sinus)** là vùng thụ thể áp lực, chủ yếu tham gia điều hòa huyết áp. Hai cấu trúc nằm gần nhau nhưng có chức năng khác nhau.

### APPROVED FOUNDER PRO
> **Carotid bodies are peripheral chemoreceptor organs; the carotid sinus is primarily a baroreceptor region. Do not conflate carotid chemoreflex and carotid baroreflex physiology.**

No extra disclaimer is necessary if the wording itself is explicit.

---

# 6. ANP / NOCTURIA METAPHOR

## V12-P1-008 — Remove “lệnh xả nước cứu tim”

**Problem**
The metaphor is dramatic and can imply a deterministic heart-failure mechanism.

### APPROVED PUBLIC
> **Một số người bị OSA có thể tiểu đêm nhiều hơn. Thay đổi áp lực trong lồng ngực và căng thành nhĩ có thể góp phần làm tăng peptide lợi niệu, nhưng tiểu đêm còn có nhiều nguyên nhân khác.**

### APPROVED FOUNDER PRO
> **OSA-related nocturia is multifactorial. Negative intrathoracic pressure and atrial stretch may increase atrial natriuretic peptide signaling and natriuresis/diuresis, but this is not the sole mechanism.**

**REMOVE**
- “lệnh xả nước cứu tim”;
- implication that nocturia indicates heart failure.

---

# 7. POSITIONAL THERAPY

## V12-P1-009 — Restrict positional-therapy claim to positional OSA

**Problem**
General OSA/waveform education may suggest lateral sleep is broadly effective treatment.

### APPROVED PUBLIC
> **Tư thế ngủ có thể ảnh hưởng mức độ OSA ở một số người. Liệu pháp tư thế phù hợp nhất khi OSA rõ ràng nặng hơn ở tư thế nằm ngửa; không phải mọi người bị OSA đều đáp ứng giống nhau.**

### APPROVED FOUNDER PRO
> **Positional therapy is principally relevant to position-dependent OSA, where respiratory-event frequency is materially higher supine than non-supine. It should not be presented as a universal OSA treatment or a diagnostic test.**

**Evidence**
ERS guideline/reviews restrict positional therapy to position-dependent OSA phenotypes.

---

# 8. DEVICE CLAIM — RING vs WRIST

## V12-P1-010 — Remove universal “finger ring is more accurate than wrist watch”

**Problem**
A universal superiority claim is not supported merely by sensor location or by FDA clearance of a specific ring pulse oximeter.

### APPROVED PUBLIC
> **Độ chính xác phụ thuộc vào thiết bị cụ thể, cách thiết kế cảm biến, vị trí đeo, chuyển động, tưới máu và thuật toán xử lý. Không nên kết luận một dạng thiết bị luôn chính xác hơn dạng khác nếu chưa có nghiên cứu so sánh trực tiếp.**

### APPROVED PRO
> **Accuracy is device- and validation-specific. Sensor location alone does not establish universal superiority; comparative claims require head-to-head validation for the exact devices and conditions of use.**

**Device boundary**
For Viatom PO2/PO2A/PO2B, FDA K242876 supports measuring/displaying/storing/transmitting SpO₂ and pulse rate for adults, including spot-check and/or continuous data collection; it does not by itself establish superiority over wrist wearables or an OSA diagnostic indication.

---

# 9. SNORING NUMERIC CLAIMS

## V12-P1-011 — Remove unsupported universal prevalence / sensitivity / specificity numbers

Search for claims equivalent to:
- snoring sensitivity 80–90%;
- specificity 30–40%;
- “~50% of men snore”;
- any fixed screening performance number without exact source/population/definition.

### APPROVED PUBLIC
> **Ngáy thường gặp và có liên quan với OSA, nhưng ngáy đơn thuần không đủ để chẩn đoán OSA. Có người ngáy không bị OSA và cũng có người OSA không được nhận biết là ngáy.**

### APPROVED FOUNDER PRO
> **Snoring is a common symptom associated with OSA, but its diagnostic performance varies substantially with population, symptom definition and reference standard. Do not present a universal sensitivity/specificity or prevalence without an exact source and context.**

If exact numbers are retained:
- source must be explicit;
- population/definition must be displayed;
- no generalization outside that context.

Preferred implementation: remove fixed numbers.

---

# 10. “MINIMALLY SYMPTOMATIC OSA”

## V12-P1-012 — Remove rigid definition `AHI >30 + ESS <10`

**Problem**
This may describe a study subgroup but is not a universal diagnostic definition.

### APPROVED PUBLIC
> **Một số người có OSA, kể cả mức độ event cao, vẫn không cảm thấy buồn ngủ ban ngày rõ rệt. Mức độ triệu chứng và AHI không phải lúc nào cũng song hành.**

### APPROVED FOUNDER PRO
> **Minimally symptomatic or nonsleepy OSA describes a clinical phenotype rather than a single universally accepted AHI/ESS definition. Study-specific thresholds should not be presented as a diagnostic rule.**

Remove fixed AHI/ESS pairing unless explicitly labeled as one study’s inclusion criterion.

---

# 11. “100% OBSTRUCTION / AIRFLOW 0%”

## V12-P1-013 — Remove unnecessary false precision

Search all user-facing text/labels for:
- “BÍT TẮC 100%”
- “airflow 0%”
- “khí ngừng chảy 100%”
- equivalent exact claims.

### APPROVED PUBLIC
> **Đường thở có thể xẹp gần như hoàn toàn hoặc hoàn toàn về mặt chức năng, làm luồng khí giảm rất mạnh hoặc gần như ngừng trong một đợt ngưng thở tắc nghẽn.**

### APPROVED FOUNDER PRO
> **AASM scoring defines apnea by a ≥90% reduction in the relevant airflow signal for ≥10 seconds; it does not require an anatomical lumen measurement of zero or literal zero flow.**

If the visual represents one illustrative complete-occlusion example:
> **Mô phỏng một tình huống tắc nghẽn hoàn toàn — không phải ngưỡng giải phẫu/định nghĩa chẩn đoán.**

Preferred implementation: qualitative state only.

---

# 12. TRACEABILITY REPAIR

## V12-P0-014 — MED/V11/V12 IDs must map to the correct specification item

**Problem**
v1.1 walkthrough assigned V11-P0-001/P0-002 descriptions that did not match the actual v1.1 delta definitions.

**Required**
Create:
`medical_change_traceability_v12.csv`

Columns:
- authority version;
- item ID;
- exact item title;
- files/components changed;
- implementation status;
- screenshot/state IDs proving implementation;
- unresolved issue;
- reviewer note.

No reused/misassigned ID descriptions.

**PASS**
Every v1.2 ID maps exactly to this delta.

---

# 13. FINAL REGRESSION PACKAGE

After implementation, return:

### A. CHANGE LOG
Exact V12-ID mapping.

### B. MEDICAL CONTENT DIFF
Only medical text/logic changes.

### C. FULL MEDICAL STATE INVENTORY
`medical_state_inventory_v12.json`

### D. SCREENSHOT MANIFEST
`screenshot_manifest_v12.json`

### E. TRACEABILITY
`medical_change_traceability_v12.csv`

### F. SCREENSHOTS
`app_screenshots_v12/`

### G. SHOWCASE
`O2Sense_Full_App_Showcase_v12.html`

### H. BUILD
- `npx tsc --noEmit`
- `npm run build`

### I. NEW_MEDICAL_ISSUES
Report but do not self-patch.

### J. FINAL STATUS
End exactly:

**STATUS: CORRECTIVE v1.2 IMPLEMENTATION COMPLETE — AWAITING INDEPENDENT MEDICAL REGRESSION AUDIT.**

Do NOT state:
- Medical PASS
- physician approved
- clinically validated
- medically safe for release
- release ready
