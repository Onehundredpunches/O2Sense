# O2SENSE — MEDICAL CORRECTIVE DELTA v1.3
**Status:** FINAL AI CLEANUP BEFORE PHYSICIAN AUDIT  
**Date:** 10/09/2026  
**Depends on:** Medical Corrective Authority v1.0 + Corrective Delta v1.1 + Corrective Delta v1.2  
**Scope:** ONLY the items below.

---

# 0. FINAL-PASS GOVERNANCE

This is the **last AI medical-correction pass before physician review**.

## Freeze list — DO NOT REOPEN unless a v1.3 item explicitly requires it
- Public 5-step physiology that already passed v1.2 regression
- SpO2 Pattern ≠ Diagnosis architecture
- Differential OSA / CSA / COPD / OHS table already corrected
- 8 MythBusters except exact items explicitly named below
- 6 Clinical Scenarios unless capture verification shows a missing medical state
- v1.2 corrections for SpO2 threshold, carotid body/sinus, ANP, circulation delay, positional therapy

## Authority principle
**Medical correctness > scientific nuance > safety > clarity > UX > animation/wow effect.**

Antigravity is an implementation agent, not a medical authority.

Do NOT:
- invent new medical facts;
- add new thresholds, ranges, prevalence or performance numbers;
- create a stronger causal claim than supplied;
- add new device-performance claims;
- change approved wording merely to sound more professional;
- expand O2Sense into diagnosis/treatment;
- perform opportunistic medical rewrites outside this delta;
- claim Medical PASS.

If a new issue is encountered:
`NEW_MEDICAL_ISSUE → REPORT ONLY → DO NOT SELF-PATCH`

---

# 1. FOUNDER PRO — CAPTURE THE ACTUAL PRO MEDICAL STATE

## V13-P0-001 — Global Founder Mode is not sufficient

**Observed v1.2 problem**
Screenshots named `anim2d_step*_pro` showed the global header in Founder mode, but the internal physiology panel still displayed the Public/“Dành cho người nhà” content in the captured pixels.

### Required capture state
For every Step 1–5 Founder Pro screenshot:
1. enable global Founder mode;
2. activate the internal **“Cơ chế chuyên sâu” / Founder Pro medical-content toggle**;
3. assert that the Public panel is not the active medical panel;
4. assert a Pro-only unique label/text from that step;
5. screenshot only after the Pro panel is visible.

### PASS assertion
A Founder Pro capture must prove BOTH:
- global mode = Founder; AND
- local medical-content mode = Pro / Cơ chế chuyên sâu.

Do not count a screenshot merely because the header says Founder.

### Output
Recapture:
- `founder_pro_step1`
- `founder_pro_step2`
- `founder_pro_step3`
- `founder_pro_step4`
- `founder_pro_step5`

---

# 2. 3D ANATOMY PINS — VERIFY VISIBLE POPUP, NOT HIDDEN DOM

## V13-P0-002 — DOM existence ≠ visible selected pin

**Observed v1.2 problem**
Multiple 3D pin screenshots had different target IDs but pixels did not visibly show the corresponding annotation/popup.

### Required state verification
For each anatomical pin:
- click/select the actual pin;
- confirm pin active state;
- confirm its detail popup/card is `visible`;
- confirm opacity/display/visibility are active;
- confirm non-zero bounding box;
- confirm the expected title is inside the visible popup;
- scroll/frame camera so the popup is visible in the screenshot.

### Required pins
At minimum:
- Soft palate & uvula
- Tongue base & genioglossus
- Mandible/chin
- Obstruction region
- Nasal cavity
- Trachea/cartilage rings
- any additional medically distinct pin discovered in code

### Assertion requirements
Do not pass when text merely exists in hidden DOM.

Required:
`exists && visible && boundingBox.width>0 && boundingBox.height>0 && expected title visible`

---

# 3. QUICK REVIEW — CAPTURE MEDICAL ANSWER/EXPLANATION

## V13-P0-003

**Observed v1.2 problem**
Quick Review capture showed question/front states but did not prove every medical answer/explanation state.

### Required inventory
For each Quick Review card/question:
- front/question state;
- answer/reveal state;
- explanation/rationale state if separate;
- final challenge option feedback for each medically distinct answer.

If answer and explanation are on the same rendered side, one screenshot is acceptable only when both are visibly present.

### Required assertion
Use unique answer/explanation text, not generic modal headings.

### PASS
Every medical proposition taught by Quick Review is visible in at least one reviewed screenshot.

---

# 4. KNOWLEDGE HUB — SYMPTOMS TAB REWRITE

## V13-P0-004 — Replace deterministic symptom → mechanism chains

**Problem**
The current symptom map converts plausible mechanisms into universal mechanisms (e.g. gasping always from cortical arousal, nocturia always from ANP, morning headache from retained CO2, cognition directly from hypoxia).

### New required content architecture
For every symptom use:

`SYMPTOM / ASSOCIATION → POSSIBLE MECHANISMS → LIMITATION / NOT SPECIFIC`

Do not state a single mechanism as the cause in every patient.

---

## 4A. Snoring / witnessed pauses / gasping

### APPROVED PUBLIC
> **Ngáy, được người khác quan sát thấy ngừng thở, hoặc thức dậy với cảm giác nghẹn/hụt hơi có thể gặp ở OSA. Các biểu hiện này liên quan đến hẹp hoặc tắc nghẽn đường thở trên trong lúc ngủ, nhưng riêng một triệu chứng không đủ để chẩn đoán OSA.**

### APPROVED PRO
> **Snoring, witnessed apneas and nocturnal choking/gasping are common OSA-associated features. Event termination may involve increasing respiratory drive, upper-airway dilator recruitment and sometimes cortical arousal; no single termination mechanism is obligatory for every event.**

### REMOVE
- “im lặng 10–30 giây” as a universal event pattern;
- “não thức giấc rồi mới gasp” as a compulsory chain.

---

## 4B. Nocturia

### APPROVED PUBLIC
> **Tiểu đêm có thể gặp ở người bị OSA, nhưng có nhiều nguyên nhân khác. Thay đổi áp lực trong lồng ngực, căng thành nhĩ, peptide lợi niệu, gián đoạn giấc ngủ và bệnh đi kèm đều có thể góp phần.**

### APPROVED PRO
> **Nocturia in OSA is multifactorial. Negative intrathoracic pressure, atrial stretch/natriuretic-peptide signaling, sleep fragmentation and comorbid conditions may contribute; ANP is not a universal or exclusive mechanism.**

### REMOVE
- “thận thải nước tiểu liên tục”;
- deterministic ANP-only pathway.

---

## 4C. Night sweats / autonomic symptoms

### APPROVED PUBLIC
> **Đổ mồ hôi ban đêm có thể xuất hiện ở một số người, nhưng không đặc hiệu cho OSA. Hoạt động thần kinh tự chủ tăng quanh các đợt rối loạn hô hấp là một cơ chế có thể góp phần.**

### APPROVED PRO
> **Autonomic activation and sympathetic surges can accompany obstructive respiratory events, but nocturnal sweating is nonspecific and should not be presented as a direct readout of catecholamine release.**

### REMOVE
- “sympathetic system liên tục hoạt hóa”;
- claim that sweating proves adrenaline release.

---

## 4D. Morning headache

### APPROVED PUBLIC
> **Đau đầu buổi sáng có thể gặp ở OSA nhưng không đặc hiệu. Rối loạn trao đổi khí, giấc ngủ bị phân mảnh và các yếu tố khác có thể góp phần; triệu chứng này không cho biết mức CO₂ của một người.**

### APPROVED PRO
> **Morning headache is reported in OSA, but its mechanism is not uniquely established. Sleep fragmentation and nocturnal gas-exchange disturbance are proposed contributors; wearable SpO₂ does not measure PaCO₂.**

### REMOVE
- “suốt đêm giữ CO₂”;
- direct `CO2 → cerebral vasodilation → headache` as the universal explanation.

---

## 4E. Excessive daytime sleepiness / fatigue

### APPROVED PUBLIC
> **Buồn ngủ ban ngày quá mức là xu hướng dễ ngủ gật khi đáng lẽ phải tỉnh; mệt mỏi là cảm giác thiếu năng lượng và không hoàn toàn giống nhau. OSA có thể gây buồn ngủ hoặc mệt mỏi, nhưng không phải người bị OSA nào cũng có triệu chứng rõ.**

### APPROVED PRO
> **Excessive daytime sleepiness and fatigue are related but distinct constructs. Sleep fragmentation and other OSA-related physiological disturbances can contribute, but symptom burden varies substantially and does not map linearly to AHI.**

### REMOVE
- “hàng trăm vi thức giấc” as a generic patient statement;
- “EDS là triệu chứng quan trọng nhất” as universal wording.

---

## 4F. Cognition / mood

### APPROVED PUBLIC
> **Một số người bị OSA báo cáo khó tập trung, giảm trí nhớ hoặc thay đổi tâm trạng. Đây là các triệu chứng không đặc hiệu và có thể liên quan đến nhiều yếu tố, trong đó có giấc ngủ bị phân mảnh và rối loạn hô hấp khi ngủ.**

### APPROVED PRO
> **Cognitive and mood symptoms in OSA are multifactorial. Intermittent hypoxemia, sleep fragmentation, autonomic/inflammatory and vascular pathways may contribute; do not reduce cognitive impairment to a single direct hypoxia → prefrontal-cortex mechanism.**

---

# 5. CITATION RECORDS — CANONICAL CORRECTIONS

## V13-P0-005 — Replace known incorrect/synthetic bibliographic records

Use the following records exactly.

### SOURCE: MOSAIC RCT
**Canonical bibliographic record**
> Craig SE, Kohler M, Nicoll D, Bratton DJ, Nunn A, Davies R, Stradling JR.  
> Continuous positive airway pressure improves sleepiness but not calculated vascular risk in patients with minimally symptomatic obstructive sleep apnoea: the MOSAIC randomised controlled trial.  
> **Thorax. 2012;67(12):1090–1096.**  
> PMID: **23111478**  
> DOI: **10.1136/thoraxjnl-2012-202178**

**Allowed source summary**
> In this trial population with minimally symptomatic OSA, CPAP improved subjective/objective sleepiness and self-assessed health status but did not improve the calculated 5-year vascular-risk score over six months.

**Do NOT**
- cite Lancet Respiratory Medicine 2014;
- list Kohler as sole/first author;
- generalize the trial as proof that cardiovascular risk is never improved by CPAP.

---

### SOURCE: OSA IN WOMEN
**Canonical bibliographic record**
> Wimms AJ, Woehrle H, Ketheeswaran S, Ramanan D, Armitstead J.  
> Obstructive Sleep Apnea in Women: Specific Issues and Interventions.  
> **BioMed Research International. 2016;2016:1764837.**  
> PMID: **27699167**  
> PMCID: **PMC5028797**  
> DOI: **10.1155/2016/1764837**

**Allowed source summary**
> Women with OSA may have classic symptoms, but insomnia, fatigue, headache, mood symptoms and other less stereotypical presentations can contribute to under-recognition.

**Do NOT**
- cite Sleep Medicine Reviews 2016;36:60–70 for this title.

---

### SOURCE: CRANIOFACIAL PHENOTYPING
**Canonical bibliographic record**
> Lee RWW, Chan ASL, Grunstein RR, Cistulli PA.  
> Craniofacial phenotyping in obstructive sleep apnea — a novel quantitative photographic approach.  
> **Sleep. 2009;32(1):37–45.**  
> PMID: **19189777**  
> PMCID: **PMC2625322**

**Allowed source summary**
> Quantitative craniofacial differences were identified between the studied OSA and control groups, supporting craniofacial anatomy as one contributor to OSA susceptibility.

**Limitation**
> The study population was predominantly Caucasian; do not use this paper alone to make population-wide claims about Asian craniofacial risk.

**Do NOT**
- cite Sleep 2012;35(6):789–798 for this title.

---

### SOURCE: COPD–OSA OVERLAP
**Remove/unpublish if currently shown as**
> “Sleep-Disordered Breathing and Nocturnal Hypoxemia: Differential Diagnosis Beyond OSA.”  
> Owens RL, Malhotra A. Clin Chest Med. 2014;35(3):559–570.

This exact bibliographic record was not verified.

**Replace with canonical verified source**
> Owens RL, Malhotra A.  
> Sleep-Disordered Breathing and COPD: The Overlap Syndrome.  
> **Respiratory Care. 2010;55(10):1333–1346.**  
> PMID: **20875160**  
> PMCID: **PMC3387564**

**Allowed source summary**
> Coexisting COPD and OSA (“overlap syndrome”) is associated with more severe nocturnal hypoxemia than either condition alone and requires diagnostic context beyond oximetry pattern shape.

For OHS-specific statements, prefer:
> Mokhlesi B, Masa JF, Brozek JL, et al.  
> Evaluation and Management of Obesity Hypoventilation Syndrome. An Official American Thoracic Society Clinical Practice Guideline.  
> **Am J Respir Crit Care Med. 2019;200(3):e6–e24.**  
> PMID: **31368798**  
> PMCID: **PMC6680300**  
> DOI: **10.1164/rccm.201905-1071ST**

Do not fabricate one omnibus “differential hypoxemia” citation if multiple sources are needed.

---

# 6. SOMERS 1995 — SOURCE CLAIM FIDELITY

## V13-P0-006

**Canonical record**
> Somers VK, Dyken ME, Clary MP, Abboud FM.  
> Sympathetic neural mechanisms in obstructive sleep apnea.  
> **J Clin Invest. 1995;96(4):1897–1904.**  
> PMID: **7560081**  
> PMCID: **PMC185826**  
> DOI: **10.1172/JCI118235**

### APPROVED SOURCE SUMMARY
> **The study demonstrated marked sympathetic nerve-activity and blood-pressure responses associated with obstructive apneas, with sympathetic activity increasing during apnea and blood pressure rising markedly around event termination.**

### DO NOT ATTRIBUTE TO THIS PAPER
- direct measurement of per-event catecholamine release;
- a universal fixed heart-rate sequence;
- proof that every obstructive event produces the same autonomic response.

If another claim needs catecholamine evidence, use a separately verified source; do not stretch this citation.

---

# 7. SOURCE PANEL QUALITY GATE

## V13-P0-007 — Every visible medical source must be traceable

For each visible source panel, required fields:
- title
- authors/organization
- publication/guideline
- year
- volume/issue/pages where applicable
- DOI and/or PMID/PMCID OR official guideline URL
- evidence type
- exact O2Sense claim(s) supported

### Rule
If metadata cannot be verified:
- mark `SOURCE_UNVERIFIED`;
- hide/remove that source from the release candidate;
- do NOT invent missing bibliographic data.

### Claim fidelity
A real source with an exaggerated summary = FAIL.

---

# 8. GLOSSARY / SMALL MEDICAL WORDING CLEANUP

## V13-P1-008

### AHI
**APPROVED**
> **AHI là số lần apnea + hypopnea trung bình trên mỗi giờ ngủ khi thời gian ngủ thực được xác định. Trong chấm điểm AASM ở người lớn, apnea được xác định bởi giảm ≥90% tín hiệu luồng khí phù hợp trong ít nhất 10 giây; không yêu cầu đường thở giải phẫu phải “tắc hoàn toàn”.**

Do not use “complete anatomical obstruction” as the scoring definition.

---

### Soft palate
**APPROVED PUBLIC**
> **Khẩu cái mềm và lưỡi gà là các cấu trúc di động ở vùng hầu. Khi đường thở hẹp, các mô này có thể rung góp phần tạo tiếng ngáy và ở một số người có thể tham gia vào vị trí xẹp đường thở.**

Remove:
> “khi ngủ nó bị hút sập vào thành họng” as universal physiology.

---

### CPAP
**APPROVED PUBLIC**
> **CPAP tạo áp lực dương giúp giữ đường thở trên mở trong lúc ngủ. Hiệu quả phụ thuộc chẩn đoán đúng, lựa chọn thiết bị/áp lực phù hợp và việc sử dụng đều đặn.**

**APPROVED PRO**
> **CPAP pneumatically splints the upper airway and is an established PAP treatment for appropriately diagnosed OSA. PAP treatment should be based on objective sleep-apnea testing and appropriate clinical management.**

Remove:
> “giữ thành họng căng phồng, không thể sập lại.”

Do not provide pressure settings.

---

### EDS
Use the approved EDS/fatigue wording in V13-P0-004.

Remove:
- “triệu chứng quan trọng nhất” as a universal claim.

---

### Perfusion Index (PI)
**APPROVED**
> **Perfusion Index reflects the relative pulsatile signal at the sensor site. Low peripheral perfusion can make pulse-oximetry performance more challenging, but a low PI value alone does not prove that an SpO₂ reading is invalid. Device-specific signal-quality guidance should be followed.**

Do not invent a universal PI cutoff for reliable/unreliable SpO2.

---

# 9. O2RING / PPG DEVICE-SPECIFIC CLAIMS

## V13-P1-009

Search for:
- `660 nm`
- `940 nm`
- exact wavelength claims
- “finger artery is better”
- “ring more accurate than wrist”
- exact optical geometry attributed to O2Ring

### APPROVED PUBLIC
> **Pulse oximetry uses optical signals to estimate arterial oxygen saturation. Exact light wavelengths, optical geometry, sampling and signal-processing methods depend on the specific device.**

### APPROVED PRO
> **Do not attribute exact wavelengths, optical geometry or performance superiority to O2Ring unless those specifications are documented for the exact SKU/IFU or validated technical documentation used by this product.**

If exact SKU evidence is not present in the approved workspace authority:
- remove the device-specific number/claim;
- keep generic pulse-oximetry education.

---

# 10. CARDIOVASCULAR OUTCOME WORDING

## V13-P1-010

Search Knowledge Hub / complication cards for claims equivalent to:
- “can be reversed if treated early”
- “CPAP reduces AF recurrence” as a general promise
- “prevent cardiovascular complications” as guaranteed outcome

### APPROVED PUBLIC
> **OSA có liên quan với tăng nguy cơ tim mạch ở nhiều nhóm người. Điều trị OSA có thể cải thiện một số triệu chứng và chỉ số sức khỏe, nhưng mức lợi ích đối với từng biến cố tim mạch phụ thuộc vào người bệnh, mức độ bệnh, bệnh đi kèm và việc tuân thủ điều trị.**

### APPROVED PRO
> **OSA is associated with cardiovascular morbidity through multiple pathways. Effects of PAP on cardiovascular outcomes vary by endpoint, population and adherence; avoid presenting observational associations or subgroup findings as guaranteed treatment benefit.**

Do not create outcome promises.

---

# 11. WAVEFORM SIMULATION DURATION

## V13-P1-011

Search user-facing waveform education for fixed example durations such as:
- `10–20 s`
- `15–45 s`
- `>10–30 min`
or similar duration ranges.

### Rule
If the number is essential to a purely illustrative animation:
label:
> **Ví dụ mô phỏng — thời gian và độ sâu thực tế thay đổi.**

Preferred:
remove unnecessary fixed durations where they do not teach an accepted scoring rule.

Do NOT remove established scoring criteria such as respiratory-event duration ≥10 seconds when explicitly teaching AASM scoring.

---

# 12. CAPTURE / TRACEABILITY FINAL GATE

## V13-P0-012

Create a clean delta capture folder:
`app_screenshots_v13/`

Recapture only:
- all 5 actual Founder Pro physiology states;
- all visible 3D pin popups;
- all Quick Review answer/explanation states;
- Knowledge Hub Symptoms;
- every corrected source panel;
- every v1.3 glossary/card/device/cardiovascular/waveform state changed by this delta.

### Required manifest
`screenshot_manifest_v13.json`

Each entry:
- state ID
- source module
- mode
- correction ID
- expected visible state
- actual visible text
- DOM selector
- visibility assertion
- bounding-box assertion where interactive
- screenshot
- PASS/FAIL

### Traceability
`medical_change_traceability_v13.csv`

Columns:
- `V13-ID`
- exact delta title
- affected file/component
- before claim
- approved after claim
- implementation status
- proof screenshot IDs
- unresolved issue

No recycled/misassigned IDs.

---

# 13. FINAL STOP CRITERION

After this v1.3 pass, do NOT initiate another autonomous medical rewrite.

If all v1.3 items are implemented and independently reviewed:
> O2Sense exits AI medical cleanup and proceeds to **human Sleep Medicine / Pulmonology physician audit**.

AI implementation complete ≠ physician medical sign-off.

---

# 14. VERIFIED CORE REFERENCES FOR THIS DELTA

1. Craig SE, et al. MOSAIC RCT. Thorax. 2012;67(12):1090–1096. PMID 23111478. DOI 10.1136/thoraxjnl-2012-202178.
2. Wimms AJ, et al. Obstructive Sleep Apnea in Women. BioMed Research International. 2016;2016:1764837. PMID 27699167. DOI 10.1155/2016/1764837.
3. Lee RWW, et al. Craniofacial phenotyping in OSA. Sleep. 2009;32(1):37–45. PMID 19189777. PMCID PMC2625322.
4. Owens RL, Malhotra A. Sleep-Disordered Breathing and COPD: The Overlap Syndrome. Respir Care. 2010;55(10):1333–1346. PMID 20875160. PMCID PMC3387564.
5. Mokhlesi B, et al. Evaluation and Management of Obesity Hypoventilation Syndrome. ATS Clinical Practice Guideline. Am J Respir Crit Care Med. 2019;200(3):e6–e24. PMID 31368798. DOI 10.1164/rccm.201905-1071ST.
6. Somers VK, et al. Sympathetic neural mechanisms in obstructive sleep apnea. J Clin Invest. 1995;96(4):1897–1904. PMID 7560081. DOI 10.1172/JCI118235.
7. Patil SP, et al. Treatment of Adult OSA with Positive Airway Pressure: AASM Clinical Practice Guideline. J Clin Sleep Med. 2019;15(2):335–343. PMID 30736887. PMCID PMC6374094.
8. AASM Scoring Manual Version 3 — released February 2023; ≥4% hypopnea rule OPTIONAL.
9. FDA Pulse Oximeter guidance — performance claims under motion/low perfusion require device-specific validation.

---

# FINAL REQUIRED STATUS

End implementation report exactly:

**STATUS: CORRECTIVE v1.3 IMPLEMENTATION COMPLETE — AWAITING FINAL INDEPENDENT AI REGRESSION AUDIT BEFORE PHYSICIAN REVIEW.**
