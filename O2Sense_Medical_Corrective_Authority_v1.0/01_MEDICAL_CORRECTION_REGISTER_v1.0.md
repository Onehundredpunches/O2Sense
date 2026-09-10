# O2SENSE — MEDICAL CORRECTION REGISTER v1.0
**Status:** IMPLEMENTATION SPEC — DO NOT REWRITE MEDICAL COPY  
**Ngày:** 09/09/2026  
**Input evidence:** `HINH_ANH_TOAN_BO_APP_O2SENSE.zip` + medical deep research  
**Medical authority:** `02_CANONICAL_MEDICAL_CONTENT_v1.0.md`

---

# 0. IMPLEMENTATION CONTRACT

Antigravity is an implementation agent.

For every `MED-*` item:
1. locate all occurrences in code/components/content;
2. replace with approved copy or behavior;
3. do not paraphrase approved medical text;
4. do not research independently to “improve” content;
5. if a new medical question appears: report it as `NEW_MEDICAL_ISSUE`, do not patch it;
6. after implementation, capture the affected UI state for regression review.

Priority:
- **P0:** blocks medical-content release;
- **P1:** must be fixed before physician audit;
- **P2:** precision/clarity improvement, still required before final medical sign-off.

---

# 1. COVERAGE FINDING — SCREENSHOT CAPTURE IS NOT 100% STATE COVERAGE

## MED-P0-001 — Recapture interactive states
**Evidence:** screenshots 19–22, 23–26, and 27–31 are visually identical within each group despite different filenames/intended states.

**Observed**
- `19_Do_thi...OSA...png`
- `20_Do_thi...ngay_don_thuan.png`
- `21_Do_thi...COPD.png`
- `22_Do_thi...Cheyne_Stokes.png`
show the same Sawtooth state.

Likewise:
- 23–26 show the same AHI tab.
- 27–31 show the same MythBusters overview.

**Medical risk**
Content in hidden tabs/scenarios cannot be declared medically reviewed.

**ACTION**
After corrections:
- explicitly activate each tab/state;
- wait for rendered state;
- capture each unique UI state;
- generate a screenshot manifest including selected tab/state;
- no “100% coverage” claim until each medical state is unique and reviewed.

**PASS WHEN**
Every medically distinct state has an independently reviewable screenshot.

---

# 2. GLOBAL / HOME

## MED-P1-002 — Preserve disclaimer but strengthen data boundary
**Screens:** 01–35
**CURRENT**
“Công cụ học tập cá nhân — KHÔNG dùng để chẩn đoán, KHÔNG thay thế tư vấn y tế.”

**KEEP. ADD where SpO₂/wearable interpretation starts**
**APPROVED PUBLIC**
> Dữ liệu SpO₂ từ wearable có thể giúp quan sát xu hướng, nhưng không đủ để tự chẩn đoán hoặc loại trừ ngưng thở khi ngủ.

**APPROVED PRO**
> Pulse-oximetry/wearable signals alone cannot establish or exclude OSA and generally cannot reliably distinguish OSA from other sleep-related breathing disorders.

**SOURCE:** CMC-01 / EVD-005.

---

# 3. 5-STEP PHYSIOLOGY

## MED-P0-003 — Rewrite top-level causal chain
**Screens:** 04–09
**CURRENT observed summary**
“thông khí phế nang → vòm họng rung ngáy → cuống lưỡi sập cơ học → chuông báo cháy não bộ vi thức giấc kéo mở đường thở.”

**PROBLEM**
Implies a compulsory linear mechanism and tongue-base collapse for every OSA event.

**REPLACE — PUBLIC**
> Khi ngủ, đường thở trên có thể trở nên dễ hẹp/xẹp hơn. Nếu luồng khí giảm nhiều, cơ thể tăng nỗ lực hô hấp; oxy có thể giảm và CO₂ có thể tăng. Các cơ giúp mở đường thở tăng hoạt động và luồng khí được phục hồi; một vi thức giấc có thể đi kèm nhưng không phải lúc nào cũng cần thiết.

**REPLACE — PRO**
Use CMC-03A→03E canonical sequence.

**VISUAL**
Do not animate arousal as a mandatory trigger switch.

**SOURCE:** CMC-03 / EVD-007 / EVD-008.

---

## MED-P1-004 — Step 1: remove fixed “normal physiology” implication
**Screen:** 04
**CURRENT observed**
Airflow 100%, SpO₂ 98%, HR 62 bpm, EEG “Ngủ êm”.

**PROBLEM**
Acceptable as simulation values only; currently appears physiological/clinical.

**ACTION**
Add persistent micro-label near values:
> **Giá trị mô phỏng minh họa — không phải ngưỡng bình thường hay dữ liệu đo của người dùng.**

**Do not define**
97–99% or HR 60–70 as universal normal during sleep.

**SOURCE:** CMC-03A / CMC-11 / EVD-012.

---

## MED-P0-005 — Step 1 anatomical label: “Thụ thể hóa học xoang cảnh”
**Screens:** 04–09 and any glossary/3D label
**CURRENT**
“Thụ thể hóa học xoang cảnh”

**REPLACE**
> **Thể cảnh (carotid body) — thụ thể hóa học ngoại biên**

If carotid sinus is separately shown:
> **Xoang cảnh (carotid sinus) — vùng thụ thể áp lực**

**SOURCE:** CMC-03D / EVD-010 / EVD-011.

---

## MED-P0-006 — Step 2 title/content mismatch
**Screen:** 05
**CURRENT**
Step tab: “Trao đổi khí phế nang”
but metaphor says soft palate vibrates/snoring; showcase filename says snoring/3.2 mm.

**ACTION**
Make the physiology sequence internally coherent.

**APPROVED TITLE — PUBLIC**
> **Hẹp đường thở & ngáy**

**APPROVED TITLE — PRO**
> **Upper-airway narrowing, flow limitation & snoring**

If alveolar gas exchange education is desired, move it to a separate foundational card, not Step 2 of an OSA obstruction sequence.

**SOURCE:** CMC-03B.

---

## MED-P1-007 — Snoring frequency 30–50 times/s
**Screen:** 05
**CURRENT**
“rung bần bật 30–50 lần mỗi giây”

**PROBLEM**
Some literature reports low-frequency components in this range, but human snoring frequency varies widely with anatomical source; it is not a universal educational value.

**REPLACE — PUBLIC**
> Khi luồng khí đi qua đường thở hẹp, mô mềm như khẩu cái mềm hoặc thành hầu có thể rung và tạo tiếng ngáy.

**REPLACE — PRO**
> Snoring results from vibration of upper-airway soft tissues; acoustic frequency varies by vibrating structure and obstruction site and is not a diagnostic threshold.

**SOURCE:** CMC-03B / EVD-020.

---

## MED-P0-008 — Fixed airway diameter / 0.0 mm
**Screens:** 06, 11 and all 2.5D/3D states using 12.0 / 3.2 / 0.0 / 11.5 mm
**CURRENT**
“Bít tắc hầu họng 100%”, “khẩu kính 0.0 mm”, “luồng khí 0%”.

**PROBLEM**
AASM scoring apnea is based on airflow signal reduction, not anatomical mm. Upper airway has no single AASM “normal diameter”.

**ACTION — preferred**
Replace mm gauge with qualitative state:
- OPEN
- NARROWED / FLOW-LIMITED
- NEAR-COMPLETE OR COMPLETE FUNCTIONAL OBSTRUCTION
- REOPENING / RECOVERY

**If mm must remain for animation**
Add immediately visible:
> **Giá trị hình học mô phỏng — không phải số đo giải phẫu hoặc ngưỡng chẩn đoán.**

Remove “Chuẩn 10–13 mm”.

**SOURCE:** CMC-03C / EVD-009 / AASM scoring definitions.

---

## MED-P1-009 — Step 3 wording “cuống lưỡi đè bẹp”
**Screen:** 06
**CURRENT**
Implies tongue-base posterior-wall collapse as universal OSA mechanism.

**REPLACE — PUBLIC**
> Ở một số người, mô mềm vùng hầu có thể xẹp nhiều làm luồng khí giảm mạnh hoặc gần như ngừng, trong khi cơ hô hấp vẫn tiếp tục cố gắng thở.

**REPLACE — PRO**
> Obstruction can occur at one or multiple upper-airway levels, including velum, lateral pharyngeal walls, tongue base and/or epiglottic region; tongue-base collapse is one possible phenotype, not the universal mechanism.

**SOURCE:** CMC-02 / CMC-03C / EVD-009.

---

## MED-P0-010 — Step 4 “chuông báo cháy” mandatory arousal chain
**Screens:** 07, 12
**CURRENT observed**
“cảm biến khói (thụ thể xoang cảnh) phát hiện oxy tụt, lập tức rung chuông báo động đánh thức vỏ não 3–5 giây”
and “não bắt buộc phải giật mình thức giấc... để cứu mạng”.

**REPLACE — PUBLIC**
> Khi thông khí giảm, oxy có thể giảm và CO₂ có thể tăng. Nỗ lực hô hấp và tín hiệu điều khiển hô hấp tăng dần. Một vi thức giấc ngắn có thể xuất hiện khi event kết thúc, nhưng đường thở cũng có thể phục hồi mà không cần vi thức giấc rõ trên EEG.

**REPLACE — PRO**
> Reduced ventilation increases respiratory drive through blood-gas, mechanical and neural inputs. Upper-airway dilator recruitment can restore airflow with or without cortical arousal; arousal is an important but non-obligatory component of event termination.

**REMOVE**
- “3–5 giây” as time-to-arousal.
- “bắt buộc”.
- “cứu mạng” causal claim.

**SOURCE:** CMC-05 / EVD-007 / EVD-008.

---

## MED-P0-011 — CO₂ wording
**Screen:** 07
**CURRENT**
“khói độc CO₂”, “CO₂ tăng quá cao”.

**REPLACE — PUBLIC**
> Khi thông khí giảm, CO₂ có thể tăng tạm thời trong máu.

**REPLACE — PRO**
> Transient hypercapnia may develop during obstructive events and contributes to increased respiratory drive.

**REMOVE**
“khói độc”; do not imply a single routine OSA event causes severe CO₂ toxicity or clinically important respiratory acidosis.

**SOURCE:** CMC-03D / EVD-007.

---

## MED-P0-012 — Step 5 CN XII / genioglossus as sole switch
**Screens:** 08, 09
**CURRENT**
“Xung thần kinh số XII giật mạnh cơ lưỡi bung ra phía trước… cứu sống cơ thể.”

**REPLACE — PUBLIC**
> Các cơ giúp giữ đường thở mở tăng hoạt động, trong đó có cơ cằm–lưỡi, giúp luồng khí được phục hồi. Một tiếng thở mạnh hoặc hắt hơi thở có thể xuất hiện khi thông khí trở lại.

**REPLACE — PRO**
> Upper-airway dilator recruitment, including increased genioglossus activity via hypoglossal motor output, can contribute to restoration of airflow. This is a network response, not an isolated CN XII “switch”.

**SOURCE:** CMC-03E / EVD-007 / EVD-008.

---

## MED-P0-013 — SpO₂ recovery timing animation
**Screens:** 07→08 / 12→recovery
**CURRENT**
Airway reopens and SpO₂ appears to jump from ~82% to 96% in the same immediate state.

**ACTION**
Animation sequence:
1. airflow restoration/recovery breath;
2. SpO₂ may continue falling;
3. delayed nadir;
4. resaturation.

**APPROVED MICROCOPY**
> SpO₂ ở ngón tay phản ứng trễ so với thay đổi luồng khí.

**SOURCE:** CMC-04 / EVD-013.

---

## MED-P1-014 — Fixed HR response
**Screens:** 06–09
**CURRENT**
55/58 bpm during obstruction → 96 bpm after recovery; Founder Pro describes ~60→95–100 bpm.

**ACTION**
Keep numeric HR only as explicitly labeled simulation example.

**ADD**
> Giá trị mô phỏng; đáp ứng nhịp tim thực tế thay đổi giữa người và từng event.

**PRO COPY**
> Heart rate may slow, rise or remain relatively stable during an obstructive event; transient acceleration and blood-pressure surge commonly occur near/after event termination.

**SOURCE:** CMC-12 / EVD-021.

---

# 4. 3D ANATOMY

## MED-P1-015 — Anatomy model must not imply one collapse site
**Screens:** 10–18
**ACTION**
Add global 3D note:
> **Mô hình minh họa một kiểu tắc nghẽn; OSA có thể xảy ra tại nhiều mức đường thở trên và khác nhau giữa từng người.**

**SOURCE:** CMC-02 / EVD-009.

---

## MED-P1-016 — “Nội soi” camera wording
**Screen:** 14
**CURRENT naming**
“Góc nhìn nội soi tai mũi họng”

**ACTION**
If render is not anatomically validated against true endoscopy:
rename:
> **Góc nhìn mô phỏng theo hướng nội soi**

Do not present stylized WebGL anatomy as equivalent to clinical nasendoscopy/DISE.

---

# 5. SpO₂ WAVEFORM MODULE

## MED-P0-017 — Remove disease-specific waveform labels
**Screens intended:** 19–22
**CURRENT observed in 19**
“NGƯNG THỞ KHI NGỦ DO TẮC NGHẼN (OSA KINH ĐIỂN)”
“Dạng Răng Cưa Dao Động (Sawtooth Waves)”

**REPLACE TITLE**
> **Dạng giảm–phục hồi SpO₂ lặp lại**

**PUBLIC**
> Dạng tụt rồi hồi phục lặp lại có thể gặp trong rối loạn hô hấp khi ngủ, bao gồm OSA. Tuy nhiên, riêng đồ thị SpO₂ không đủ để xác định nguyên nhân hoặc chẩn đoán OSA.

**PRO**
> Repetitive desaturation–resaturation can be compatible with sleep-disordered breathing but is not pathognomonic for OSA. Confirmation requires appropriate respiratory/sleep signals and clinical assessment.

**SOURCE:** CMC-09 / EVD-005 / EVD-003.

---

## MED-P0-018 — Remove disease assignments for all four waveform tabs
**Intended tabs:** 19–22

Rename:
- “OSA” → `Repeated desaturation–resaturation`
- “Ngáy đơn thuần” → `Relatively stable oxygen trace`
- “COPD overlap” → `Sustained low-saturation pattern`
- “Cheyne–Stokes” → `Periodic oscillation pattern`

For every detail panel add:
> **Pattern ≠ Diagnosis**

**Specific rules**
- Stable SpO₂ does not prove simple snoring or exclude OSA.
- Sustained low SpO₂ is not specific for COPD/OHS.
- Periodic SpO₂ oscillation cannot diagnose Cheyne–Stokes/CSA.
- An isolated dip may be artifact, but shape alone cannot prove artifact.

**SOURCE:** CMC-09 / EVD-005 / EVD-012.

---

## MED-P0-019 — Remove universal SpO₂ traffic-light labels
**Screen:** 19 chart
**CURRENT**
`≥95% An toàn / 90–94% Cảnh báo / <90% Tụt oxy`

**REPLACE**
Legend should describe values without universal safety verdict:
- `SpO₂ value`
- optional `90% reference line for T90 visualization`

Add:
> Ý nghĩa của SpO₂ phụ thuộc baseline, triệu chứng, bệnh nền, độ cao và giới hạn thiết bị.

**SOURCE:** CMC-11 / EVD-012.

---

## MED-P0-020 — Remove false reassurance
**Screen:** 19
**CURRENT**
“Cơ thể bạn đang tự bảo vệ rất tốt bằng phản xạ vi thức giấc...”

**REPLACE**
> Các đợt giảm–phục hồi lặp lại có thể đi kèm phản ứng hô hấp và vi thức giấc. Nếu xảy ra thường xuyên, chúng có thể làm giấc ngủ bị phân mảnh và cần được đánh giá trong bối cảnh phù hợp.

**SOURCE:** CMC-03E / CMC-05.

---

## MED-P1-021 — Event duration 15–45 sec
**Screen:** 19
**CURRENT**
“Mỗi đợt tụt kéo dài 15–45 giây, phục hồi nhanh.”

**ACTION**
If retained, label explicitly:
> **Ví dụ mô phỏng — thời gian và độ sâu thực tế thay đổi.**

Prefer no fixed duration in Public Mode.

**SOURCE:** EVD-007.

---

# 6. METRICS / ENCYCLOPEDIA

## MED-P0-022 — AHI `<5 = Bình thường`
**Screen:** 23
**CURRENT**
“Bình thường — AHI <5 lần/giờ”

**REPLACE**
> **Dưới ngưỡng tần suất OSA quy ước: AHI <5 lần/giờ**

Footnote:
> AHI <5 không chứng minh rằng mọi khía cạnh giấc ngủ/hô hấp đều bình thường.

**Severity**
- Mild 5–14.9
- Moderate 15–29.9
- Severe ≥30

**SOURCE:** CMC-06 / EVD-003.

---

## MED-P0-023 — Add correct hypopnea scoring note
**Module:** AHI / Founder Pro
**APPROVED**
> AASM recommended hypopnea: ≥30% reduction in peak signal excursion for ≥10 s with either ≥3% desaturation or EEG arousal. In AASM Scoring Manual Version 3, the ≥4% desaturation-only rule is OPTIONAL.

**REMOVE**
“AASM v3 (2024)” and “Acceptable 4% rule”.

**SOURCE:** CMC-06B / EVD-002.

---

## MED-P0-024 — ODI definition
**Observed MythBusters overview / Claude-reported card**
Current example associates “15 times SpO₂ under 90%” with “ODI =15/h”.

**REPLACE**
> ODI counts desaturation events relative to a local baseline, usually ODI3 or ODI4. Crossing below 90% is not the definition of ODI.

If O2Ring algorithm is not documented/validated:
> **Do not compute/display ODI as a clinical metric.**

**SOURCE:** CMC-07 / EVD-014.

---

## MED-P0-025 — T90 terminology
**All modules**
**APPROVED**
> T90 = time or percentage of the specified denominator with SpO₂ <90%.

Must display denominator:
- sleep time, if truly measured;
- recording time, otherwise.

**REMOVE**
“gánh nặng thiếu oxy mô” / “hypoxic burden” as synonym.

**SOURCE:** CMC-08 / EVD-015.

---

## MED-P0-026 — PSG/HSAT wording
**Intended screen:** 24 — current screenshot state not captured
**APPROVED PUBLIC**
> Polysomnography (PSG) is the standard comprehensive sleep study. A home sleep apnea test (HSAT) can be appropriate for selected uncomplicated adults when ordered/interpreted in a clinical pathway.

**DO NOT**
- imply PSG is the only legitimate test;
- imply wearable SpO₂ is equivalent to HSAT;
- imply automatic HSAT scoring alone is sufficient.

**STATUS**
`PENDING UI RECAPTURE` after implementation.

**SOURCE:** CMC-01 / EVD-004 / EVD-006.

---

# 7. MYTHBUSTERS / CLINICAL SCENARIOS

## MED-P1-027 — Lean/young/fit people
**Observed overview + intended case 27**
**APPROVED**
> OSA can occur in people who are not obese. Craniofacial anatomy and other physiological traits can increase risk.

**DO NOT**
> young/lean/gym = likely severe OSA.

**SOURCE:** CMC-13A / EVD-018.

---

## MED-P1-028 — Women / atypical presentation
**Intended case 28 — state not captured**
**APPROVED**
> Women with OSA may have classic symptoms, but insomnia, fatigue, morning headaches, mood symptoms and poor sleep quality can be prominent and may contribute to under-recognition.

**DO NOT**
> absence of loud snoring makes OSA likely in women.

**STATUS**
`PENDING UI RECAPTURE`

**SOURCE:** CMC-13B / EVD-017.

---

## MED-P1-029 — Daytime spot SpO₂
**Intended case 29 — state not captured**
**APPROVED**
> A normal daytime spot SpO₂ does not rule out OSA. It also does not tell you whether apnea/hypopnea occurred during sleep.

**DO NOT**
> “daytime oximeter completely cannot detect anything”; it can identify awake oxygenation abnormalities from other causes.

**STATUS**
`PENDING UI RECAPTURE`

**SOURCE:** CMC-10 / EVD-012.

---

## MED-P1-030 — Night-to-night variability
**Intended case 30 — state not captured**
**APPROVED**
> OSA severity can vary substantially between nights, so a single night may misclassify some people.

**DO NOT**
> “night-to-night variability is 20–50%” as a universal change in AHI.

If discussing 20–50%:
> label it as **reported single-night misclassification probability in specific studies/populations**, not physiological variability percentage.

**STATUS**
`PENDING UI RECAPTURE`

**SOURCE:** CMC-13C / EVD-016.

---

## MED-P0-031 — Sleeping pills
**Intended case 31 — state not captured**
**APPROVED PUBLIC**
> Không tự dùng hoặc tăng liều thuốc ngủ để xử lý ngáy hay nghi ngờ OSA. Tác động lên hô hấp khác nhau tùy thuốc và từng người; thuốc ngủ không phải điều trị OSA.

**APPROVED PRO**
> Common hypnotics can modestly raise arousal threshold but do not consistently improve OSA severity overall; respiratory effects are drug- and phenotype-dependent.

**REMOVE**
> “thuốc ngủ luôn làm event dài hơn và SpO₂ tụt sâu hơn.”

**STATUS**
`PENDING UI RECAPTURE`

**SOURCE:** CMC-14 / EVD-019.

---

# 8. GLOSSARY

## MED-P0-032 — Glossary carotid terminology
**Screen:** 33
**CURRENT**
“Thụ Thể Hóa Học (Xoang Cảnh) — Chemoreceptors”

**REPLACE**
> **Thể cảnh (Carotid body) — Thụ thể hóa học ngoại biên**

**SOURCE:** CMC-03D / EVD-010 / EVD-011.

---

## MED-P0-033 — Glossary genioglossus explanation
**Screen:** 33
**CURRENT**
“Hiểu cơ này giúp bạn biết tại sao ngưng thở chỉ xảy ra khi ngủ say chứ ban ngày thức không bao giờ bị nghẽn.”

**PROBLEM**
OSA events are not limited to deep sleep; N3 may even have fewer events in some patients. “Never obstructs while awake” is too absolute and conflates sleep-dependent OSA with all upper-airway obstruction.

**REPLACE — PUBLIC**
> Khi ngủ, cơ chế điều khiển các cơ giữ đường thở thay đổi. Ở người dễ bị OSA, sự thay đổi này có thể làm đường thở dễ hẹp/xẹp hơn so với lúc thức.

**REPLACE — PRO**
> Sleep-related reductions in wakefulness drive and changes in upper-airway neuromuscular control can unmask pharyngeal collapsibility; event frequency varies by sleep stage and patient phenotype.

**SOURCE:** CMC-03A / EVD-003 / EVD-007.

---

# 9. CITATION DRAWER / EVIDENCE INTEGRITY

## MED-P0-034 — Eckert 2008 source is misrepresented
**Screen:** 34
**CURRENT “Kết luận chính”**
PaO₂↓ + PaCO₂↑ → chemoreceptor → EEG micro-arousal → genioglossus restored → airway opens.

**PROBLEM**
The cited review does not establish that compulsory linear pathway; it explicitly discusses multifactorial OSA physiology and evidence that ventilation can recover without cortical arousal.

**REPLACE source summary**
> OSA pathophysiology is multifactorial. Airway anatomy, upper-airway muscle responsiveness, ventilatory control and arousal threshold interact. Obstructive events produce blood-gas disturbances and sympathetic activation; airflow recovery can occur with or without cortical arousal.

**SOURCE:** EVD-007 / EVD-008.

---

## MED-P1-035 — Fix authority labeling
**Screen:** 34
**CURRENT**
“NHLBI / ATS (PubMed)”

**REPLACE citation metadata**
Use structured fields:
- Authors
- Article/guideline title
- Organization/journal
- Year
- DOI/PMID/PMCID
- Evidence type
- Exact claim supported

**RULE**
PubMed is an index/database, not a medical authority or author.

---

## MED-P0-036 — Claim-to-source fidelity
For every source drawer item:
**Required fields**
`CLAIM_ID → exact approved claim → source → evidence type → support level → last reviewed date`

No source gets a “Kết luận chính” stronger or more causal than the source supports.

**PASS WHEN**
A reviewer can trace every material medical claim to a source supporting that exact proposition.

---

# 10. CARDIOMETABOLIC CONTENT

## MED-P1-037 — AF mechanism
**Intended encyclopedia complications state — not captured**
**APPROVED PRO**
> OSA-related AF risk is multifactorial and may involve intrathoracic pressure swings, intermittent hypoxemia, autonomic dysregulation, inflammation and atrial remodeling.

**DO NOT**
> AF is caused primarily/solely by negative pressure stretching the atrium.

**STATUS**
`PENDING UI RECAPTURE`

---

## MED-P1-038 — Insulin resistance mechanism
**Intended encyclopedia complications state — not captured**
**APPROVED PRO**
> Associations between OSA and metabolic dysfunction involve interacting effects of intermittent hypoxemia, sleep fragmentation, sympathetic activation, inflammation and other pathways.

**DO NOT**
> insulin resistance = cortisol from chronic stress.

**STATUS**
`PENDING UI RECAPTURE`

---

# 11. DEVICE / O2RING BOUNDARY

## MED-P0-039 — Measured vs inferred vs simulated
Across all modules label data provenance:

### MEASURED
Only parameters the connected device actually measures/records for the exact SKU:
- SpO₂
- pulse rate
- motion, if available

### DERIVED
Algorithmic metrics whose definition is documented and validated:
- e.g., ODI3/ODI4 only if implementation is known.

### NOT MEASURED / SIMULATED
- airway diameter;
- airflow unless separately measured;
- respiratory effort;
- PaO₂;
- PaCO₂;
- EEG arousal;
- genioglossus activity;
- sleep stage unless independently measured/validated.

**UI REQUIREMENT**
Do not display simulated values in the same visual treatment as measured O2Ring values without a clear label.

**SOURCE:** CMC-10 / EVD-012 / EVD-022.

---

# 12. CLINICAL SAFETY

## MED-P0-040 — Do not invent numerical urgent-care thresholds
**REMOVE if present**
- apnea >60 s = urgent red flag;
- SpO₂ <80% for multiple nights = universal urgent threshold;
- arbitrary pulse-rate threshold outside device/clinical protocol.

**APPROVED**
Use symptom/context-based escalation from CMC-17.

---

## MED-P0-041 — No self-treatment
Across app:
- no CPAP pressure recommendation;
- no “buy CPAP based on this waveform”;
- no oxygen recommendation;
- no medication start/stop;
- no treatment decision from O2Ring pattern.

**APPROVED**
> Nếu dữ liệu hoặc triệu chứng khiến bạn lo ngại, hãy trao đổi với nhân viên y tế để được đánh giá phù hợp.

**SOURCE:** CMC-18 / AASM PAP + diagnostic guidance.

---

# 13. FINAL ACCEPTANCE TESTS FOR THIS PASS

Antigravity must return:

1. `MED-ID → changed files/components`.
2. Code diff.
3. List of any `NEW_MEDICAL_ISSUE` found but not modified.
4. No new medical wording outside approved copy.
5. Fresh screenshots of:
   - Public + Founder Pro;
   - Step 1–5;
   - all 3D medically distinct states;
   - all 4 SpO₂ waveform tabs;
   - all 5 encyclopedia tabs;
   - every MythBuster card detail;
   - every clinical scenario;
   - every glossary term;
   - every source drawer entry;
   - every quiz question + answer.
6. Screenshot manifest proving selected state.
7. No claim of `Medical PASS`.

**Medical PASS may only be assigned after independent regression audit and physician review.**
