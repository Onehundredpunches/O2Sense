# O2SENSE — CANONICAL MEDICAL CONTENT v1.0
**Status:** MEDICAL SOURCE OF TRUTH — DRAFT FOR IMPLEMENTATION  
**Ngày:** 09/09/2026  
**Mục tiêu:** Khóa nội dung y khoa chuẩn để Antigravity chỉ IMPLEMENT, không tự quyết định y khoa.  
**Phạm vi:** Người lớn; giáo dục về OSA, SpO₂, pulse oximetry, AHI/ODI/T90, mô phỏng sinh lý bệnh và tình huống giáo dục.  
**Không bao gồm:** Chẩn đoán cá nhân, kê đơn, chỉnh CPAP, chỉ định oxy, hoặc thay thế đánh giá của bác sĩ.

---

## 0. AUTHORITY RULE

Trong mọi xung đột:

**Medical correctness > Scientific nuance > Safety > Clarity > UX > Animation/Wow effect.**

Agent build KHÔNG được:
- tự bổ sung kiến thức y khoa;
- tự tạo threshold;
- tự biến association thành causation;
- tự biến simulation thành measurement;
- tự biến SpO₂ pattern thành diagnosis;
- tự “làm mạnh” wording để hấp dẫn hơn;
- tự viết advice về CPAP, oxygen, thuốc ngủ/an thần;
- tự sửa approved medical copy ngoài specification.

Nếu cần nội dung y khoa mới chưa có trong tài liệu này:  
**MARK `PENDING_MEDICAL_REVIEW` — không tự điền.**

---

# 1. CANONICAL POSITIONING & DIAGNOSTIC BOUNDARY

### CMC-01 — O2Sense là công cụ giáo dục, không phải công cụ chẩn đoán
**Approved statement — Public**
> O2Sense giúp bạn hiểu cơ chế hô hấp khi ngủ và cách đọc dữ liệu SpO₂ theo hướng giáo dục. Dữ liệu từ wearable hoặc pulse oximeter không đủ để tự chẩn đoán hay loại trừ ngưng thở khi ngủ.

**Approved statement — Founder Pro**
> O2Sense is an educational interpretation layer. Pulse-oximetry and consumer/wearable-derived signals alone cannot establish or exclude OSA, and generally cannot reliably distinguish OSA from other sleep-related breathing disorders.

**Clinical boundary**
- OSA là chẩn đoán y khoa.
- PSG là phương pháp chẩn đoán chuẩn trong phòng ngủ; HSAT là phương án thay thế phù hợp ở một số người lớn không phức tạp, có nguy cơ OSA trung bình-nặng theo đánh giá lâm sàng.
- Không dựa chỉ vào automatic scoring để ra chẩn đoán/quyết định điều trị.
- PAP treatment phải dựa trên chẩn đoán OSA bằng objective sleep apnea testing.

---

# 2. CANONICAL OSA DEFINITION

### CMC-02 — Bản chất OSA
**Public**
> OSA là tình trạng đường thở trên bị hẹp hoặc xẹp lặp đi lặp lại trong lúc ngủ, làm luồng khí giảm mạnh hoặc tạm ngừng. Trong các đợt tắc nghẽn, cơ hô hấp thường vẫn tiếp tục cố gắng thở.

**Founder Pro**
> Obstructive sleep apnea is characterized by recurrent partial or complete functional collapse of the pharyngeal upper airway during sleep, producing hypopneas or apneas despite persistent respiratory effort.

**Không được nói**
- OSA = “cuống lưỡi luôn dính vào thành sau họng”.
- OSA = đường kính họng bằng 0 mm.
- OSA chỉ xảy ra khi “ngủ sâu”.
- OSA luôn gây ngáy.
- OSA luôn gây desaturation sâu.

---

# 3. CANONICAL 5-STEP PHYSIOLOGY

## CMC-03A — Bước 1: Ngủ làm thay đổi ổn định đường thở
**Public**
> Khi chuyển từ thức sang ngủ, hoạt động của các cơ giúp giữ đường thở trên mở thay đổi. Ở người có đường thở dễ xẹp, khả năng bù trừ này có thể không đủ trong một số thời điểm của giấc ngủ.

**Founder Pro**
> Sleep onset reduces wakefulness-related neuromuscular compensation of the upper airway. Whether obstruction occurs depends on the interaction between anatomical collapsibility, upper-airway dilator responsiveness, ventilatory control stability, arousal threshold, sleep stage, body position and other patient-specific factors.

**Không dùng**
- “ngủ sâu làm cơ họng mất hoàn toàn trương lực”.
- một giá trị đường kính mm làm “bình thường chuẩn”.

---

## CMC-03B — Bước 2: Hẹp đường thở / flow limitation / snoring
**Public**
> Đường thở có thể hẹp hơn, làm luồng khí bị giới hạn. Mô mềm ở hầu họng có thể rung tạo tiếng ngáy. Ngáy là một dấu hiệu có thể gặp, nhưng không đồng nghĩa với OSA.

**Founder Pro**
> Increasing upper-airway resistance and flow limitation can produce vibration of soft-palate, pharyngeal-wall, tongue-base or epiglottic structures. Snoring acoustics vary substantially by anatomy and obstruction site; no single vibration frequency is a clinical diagnostic threshold.

**Không dùng**
- “khẩu kính 3.2 mm = ngáy”.
- “30–50 lần/giây” như universal human snoring frequency.
- Bernoulli như cơ chế duy nhất.

---

## CMC-03C — Bước 3: Partial/complete functional obstruction
**Public**
> Khi đường thở hẹp nhiều hoặc xẹp chức năng, luồng khí có thể giảm mạnh hoặc gần như ngừng, trong khi lồng ngực và cơ hoành vẫn tiếp tục nỗ lực thở.

**Founder Pro**
> Obstructive respiratory events are defined physiologically by airflow reduction with persistent respiratory effort. Complete anatomical lumen closure is not required by the scoring definition of an apnea.

**Visual rule**
- Dùng trạng thái: `OPEN → NARROWED/FLOW-LIMITED → NEAR-COMPLETE OR COMPLETE FUNCTIONAL OBSTRUCTION`.
- Nếu animation bắt buộc dùng số mm: gắn nhãn rõ  
  **“Illustrative simulation value — not an anatomical measurement or diagnostic threshold.”**

---

## CMC-03D — Bước 4: Gas disturbance + respiratory drive + autonomic response
**Public**
> Khi thông khí giảm, oxy trong máu có thể giảm và CO₂ có thể tăng. Cơ thể tăng nỗ lực hô hấp và các phản xạ thần kinh để cố khôi phục luồng khí.

**Founder Pro**
> Reduced alveolar ventilation during an obstructive event can produce transient hypoxemia and hypercapnia, increasing respiratory drive. Progressive inspiratory effort, negative intrathoracic pressure, chemoreflex activity and autonomic responses develop to varying degrees across events and individuals.

**Carotid terminology**
- **Carotid body / thể cảnh:** peripheral chemoreceptor for arterial O₂, CO₂/H⁺.
- **Carotid sinus / xoang cảnh:** primarily baroreceptor region sensing arterial pressure/stretch.
- Không gọi “chemoreceptor xoang cảnh”.

**Không dùng**
- “máu ngừng nhận oxy”.
- “CO₂ là khói độc”.
- “một event chắc chắn gây toan hô hấp”.
- một SpO₂ nadir cố định để đại diện moderate/severe OSA.

---

## CMC-03E — Bước 5: Event termination / airway reopening / possible arousal
**Public**
> Khi đáp ứng hô hấp đủ mạnh, các cơ giúp giữ đường thở mở tăng hoạt động và luồng khí được phục hồi. Một vi thức giấc ngắn có thể đi kèm, nhưng không phải mọi đợt tắc nghẽn đều cần vi thức giấc để kết thúc.

**Founder Pro**
> Upper-airway dilator recruitment and changes in respiratory timing can restore ventilation. Cortical arousal frequently accompanies event termination and can augment ventilatory and dilator-muscle responses, but airflow can recover without cortical arousal in a meaningful proportion of obstructive events.

**CN XII / genioglossus**
- Hypoglossal motor output and genioglossus are important.
- Không mô tả CN XII như “công tắc duy nhất”.
- Dùng: “upper-airway dilator muscles, including genioglossus”.

**Post-event**
> Recovery ventilation may transiently increase. Heart rate and blood pressure can change abruptly around event termination, but the exact pattern is not identical in every patient/event.

---

# 4. SpO₂ TIMING & CIRCULATION DELAY

### CMC-04
**Public**
> SpO₂ ở ngón tay phản ứng trễ so với thay đổi luồng khí. Vì vậy, sau khi đường thở đã mở lại, SpO₂ vẫn có thể tiếp tục giảm một lúc trước khi chạm đáy rồi mới hồi phục.

**Founder Pro**
> Peripheral SpO₂ is delayed by pulmonary-to-peripheral circulation time and signal processing. Lung-to-finger circulation time is commonly measured from respiratory-event termination/recovery ventilation to the subsequent SpO₂ nadir. Values around the high-teens of seconds are common in studied cohorts, but vary across individuals and cardiovascular state.

**Animation rule**
`Obstruction → reopening/recovery breath → continued delayed SpO₂ fall → nadir → resaturation`

**Không dùng**
- airway opens → SpO₂ immediately returns to 96–98%.
- “15–30 s” như clinical threshold.
- định nghĩa delay là “từ lúc họng đóng đến lúc ngón tay bắt đầu tụt”.

---

# 5. AROUSAL

### CMC-05
**Public**
> Vi thức giấc là một thay đổi ngắn trên hoạt động não trong lúc ngủ; người bệnh thường không nhớ mình đã tỉnh. Nó có thể xuất hiện khi một đợt rối loạn hô hấp kết thúc.

**Founder Pro**
> An EEG arousal is a brief cortical activation defined by sleep-scoring criteria; it is not synonymous with full conscious awakening. Respiratory arousal is multifactorial and may relate to respiratory effort, ventilatory drive, blood-gas disturbance and mechanoreceptive stimuli.

**Không dùng**
- “thiếu O₂ được phát hiện và 3–5 giây sau não bắt buộc thức”.
- “ARAS là chuỗi bắt buộc trước khi airway mở”.
- “vi thức giấc cứu mạng” như universal mechanism.

---

# 6. AHI / APNEA / HYPOPNEA / REI / RDI

### CMC-06A — Adult apnea
> A respiratory event scored as apnea requires a ≥90% reduction in the relevant airflow signal for ≥10 seconds under AASM scoring rules. Anatomical airway diameter is not part of the scoring definition.

### CMC-06B — Adult hypopnea
**AASM recommended**
> ≥30% reduction in peak signal excursion for ≥10 seconds AND either ≥3% oxygen desaturation from pre-event baseline OR an EEG arousal.

**AASM Version 3**
> The ≥4% desaturation-only hypopnea rule is **OPTIONAL**, not “ACCEPTABLE”.

### CMC-06C — AHI
> AHI = number of apneas + hypopneas per hour of **sleep** on PSG.

Conventional adult event-frequency categories:
- `<5/h`: below conventional OSA event-frequency threshold;
- `5–14.9/h`: mild;
- `15–29.9/h`: moderate;
- `≥30/h`: severe.

**Do not label `<5` simply “normal”.**

OSA diagnostic context:
- symptoms/clinical features + predominantly obstructive events ≥5/h can support diagnosis;
- OSA may also be diagnosed without symptoms when AHI ≥15/h;
- diagnosis is not made from AHI-like wearable estimates alone.

### CMC-06D — REI / HSAT
> When true sleep time is not measured, do not silently call an events-per-hour value “AHI”. Use the metric defined by the validated test/algorithm (e.g., REI/monitoring-time denominator as applicable).

---

# 7. ODI

### CMC-07
**Definition**
> ODI quantifies oxygen desaturation events relative to a local baseline, usually ≥3% (ODI3) or ≥4% (ODI4), per unit time. The desaturation threshold and denominator must be stated.

**Critical rules**
- `ODI3` and `ODI4` are not interchangeable.
- “Số lần SpO₂ xuống dưới 90%” ≠ ODI.
- If sleep time is not measured, do not call the denominator “hours of sleep”.
- Device/software algorithms differ in baseline, duration, smoothing and artifact rejection.

**O2Ring/Oximetry-only display**
Preferred label:
> `ODI3 (theo thời gian ghi)` or `ODI4 (theo thời gian ghi)`  
only if the algorithm truly implements that definition and is validated/documented.

If algorithm is unknown:
> Do not display ODI.

---

# 8. T90

### CMC-08
> T90 is the time or percentage of a defined denominator during which SpO₂ is below 90%.

Must specify:
- `T90 by sleep time` if actual/validated sleep time is available;
- `T90 by recording time` if only recording time is available.

**Do not call T90**
- “tissue hypoxia burden”;
- “OSA hypoxic burden”;
- a diagnostic OSA metric.

T90 can be influenced by baseline oxygenation and non-OSA cardiopulmonary disease.

---

# 9. SpO₂ WAVEFORM INTERPRETATION

### CMC-09 — Core rule
> A SpO₂ pattern can be **suggestive**, never disease-specific by itself.

Approved pattern names:
1. **Repeated desaturation–resaturation pattern**
2. **Sustained low-saturation pattern**
3. **Single abrupt/isolated dip**
4. **Periodic oscillation pattern**

For each pattern use:
`WHAT IS OBSERVED → POSSIBLE EXPLANATIONS → WHAT CANNOT BE CONCLUDED → WHAT OTHER DATA WOULD HELP`

### Repeated desaturation–resaturation
Allowed:
> Can occur with sleep-disordered breathing, including OSA.

Forbidden:
> “OSA kinh điển” / “this pattern means obstructive apnea”.

### Sustained low saturation
Allowed:
> May reflect baseline or sustained hypoxemia and requires clinical context; causes can include pulmonary, cardiac, hypoventilation, altitude and other factors.

Forbidden:
> “This waveform = COPD/OHS.”

### Single abrupt dip
Allowed:
> Artifact is one possibility, especially with motion/poor perfusion/sensor disturbance, but cannot be proven from shape alone.

Forbidden:
> “90% chắc chắn do đè tay.”

### Periodic oscillation
Allowed:
> Periodic oxygen oscillation can accompany periodic breathing, but SpO₂ alone does not diagnose Cheyne–Stokes respiration or central sleep apnea.

Forbidden:
> “Cheyne–Stokes waveform” based only on oximetry.

---

# 10. PULSE OXIMETRY / O2RING DATA BOUNDARY

### CMC-10
Pulse oximetry estimates functional arterial oxygen saturation and pulse rate.

Possible limitations include:
- motion;
- poor perfusion/circulation;
- skin pigmentation;
- skin temperature/thickness;
- nail polish/external coloring;
- sensor placement;
- dyshemoglobins and other device-specific interferences.

**Never**
- rely on one isolated reading as a diagnosis;
- infer airflow, respiratory effort, PaO₂, PaCO₂, EEG arousal or airway diameter directly from SpO₂;
- infer OSA from O2Ring data alone.

**O2Ring regulatory/intended-use note**
Viatom/FDA materials support measurement/collection of SpO₂ and pulse rate for relevant cleared pulse-oximeter models. This must not be expanded into an OSA diagnostic indication unless the exact SKU, jurisdiction and intended use explicitly support it.

---

# 11. SpO₂ NUMERIC COMMUNICATION

### CMC-11
Do not use a universal traffic-light rule such as:
- `≥95% = SAFE`
- `90–94% = WARNING`
- `<90% = DANGEROUS`

without clinical/device context.

Preferred Public wording:
> SpO₂ should be interpreted together with your usual baseline, symptoms, repeated trend, altitude, medical conditions and device limitations. A single number is not enough to diagnose the cause.

The threshold `<90%` may be used to define **T90**, but that does not convert it into a universal emergency threshold.

---

# 12. HEART RATE / SYMPATHETIC RESPONSE

### CMC-12
**Public**
> Nhịp tim và huyết áp có thể dao động quanh các đợt tắc nghẽn; một số người có nhịp chậm trong event rồi tăng nhanh khi event kết thúc.

**Founder Pro**
> Autonomic responses are dynamic. Vagal influences can contribute to bradycardia during obstructive events, while sympathetic activity commonly rises and may peak near event termination, with transient tachycardia and blood-pressure surges. The exact sequence is not universal.

**Do not hard-code**
- HR 60 → 95–100 bpm as physiology;
- every event = bradycardia then tachycardia;
- “sympathetic storm” as a measured event if only SpO₂/PR is available.

---

# 13. RISK FACTORS & PRESENTATION

### CMC-13A — Weight/anatomy
> Obesity increases OSA risk but is not required. Craniofacial restriction, retrognathia and other upper-airway anatomical factors can contribute, including in non-obese people.

For East Asian populations:
> Craniofacial skeletal restriction may contribute to OSA at lower BMI in some populations; do not imply all Asian people share the same risk.

### CMC-13B — Women
> Women with OSA may report classic symptoms, but insomnia, fatigue, morning headache, mood symptoms and poor sleep quality can be prominent and may contribute to under-recognition.

### CMC-13C — Night-to-night variability
> OSA severity can vary materially from night to night. Single-night testing can misclassify some patients, but do not present “20–50% variability” as a universal physiological percentage.

---

# 14. HYPNOTICS / SLEEPING PILLS

### CMC-14
**Public**
> Không tự dùng hoặc tăng liều thuốc ngủ để xử lý ngáy hay nghi ngờ OSA. Tác động lên hô hấp khác nhau tùy thuốc và từng người; thuốc ngủ không phải điều trị OSA.

**Founder Pro**
> Hypnotics can modestly alter arousal threshold, but current randomized evidence does not show a consistent clinically meaningful improvement in OSA severity overall. Effects are drug- and phenotype-dependent; they should not be presented as a universal cause of deeper desaturation or as an OSA treatment.

**Forbidden**
> “Thuốc ngủ luôn làm đợt tắc nghẽn kéo dài và SpO₂ tụt sâu hơn.”

---

# 15. CARDIOMETABOLIC COMPLICATIONS

### CMC-15
OSA is associated with cardiovascular and metabolic disease through **multifactorial** pathways including:
- intermittent hypoxemia/reoxygenation;
- sleep fragmentation;
- sympathetic activation;
- intrathoracic pressure swings;
- oxidative stress/inflammation;
- endothelial and metabolic effects.

Do not reduce:
- atrial fibrillation → “because negative pressure stretches the atrium” only;
- insulin resistance → “because cortisol increases” only.

Use association/risk language unless causality is well established for the exact statement.

---

# 16. PATIENT-FRIENDLY METAPHOR GOVERNANCE

| Metaphor | Status | Rule |
|---|---|---|
| “Đường hầm/ống mềm” | KEEP WITH QUALIFIER | Explain it is an analogy, not anatomy to scale |
| “Chuông báo cháy não bộ” | MODIFY | May illustrate arousal signal, but cannot imply hypoxia always triggers a compulsory wake-up sequence |
| “Cơn bão giao cảm” | MODIFY | Prefer “tăng hoạt động giao cảm tạm thời”; keep stronger metaphor only with explicit analogy label |
| “CO₂ là khói độc” | REMOVE | Distorts normal physiology |
| “Bàn đạp ga cứu hộ / gasp cứu sống” | REMOVE/MODIFY | Too deterministic/dramatic |
| “0 mm” | REMOVE AS CLINICAL VALUE | If kept for rendering, mark illustrative only |

---

# 17. CLINICAL SAFETY / ESCALATION

### Emergency-oriented wording
If a user has serious or worsening symptoms such as severe breathing difficulty, chest pain/tightness, bluish/gray discoloration, confusion, fainting or other acute concerning symptoms:
> seek urgent medical evaluation rather than continuing to interpret wearable data.

### Driving safety
If excessive sleepiness causes dozing while driving, crashes or near-misses:
> do not continue driving until medically evaluated/managed.

### Non-emergency clinical review
Repeated abnormal overnight trends, witnessed apneas/gasping, persistent excessive daytime sleepiness, or significant cardiopulmonary disease:
> discuss with a qualified health professional.

**Do not invent universal red flags**
- apnea >60 seconds;
- SpO₂ <80% for N nights;
- specific pulse-rate cutoffs;
unless a validated clinical/device protocol explicitly defines them for the intended use.

---

# 18. TREATMENT BOUNDARY

O2Sense must not:
- prescribe CPAP/APAP pressure;
- tell users to buy/use PAP based only on wearable data;
- recommend supplemental oxygen;
- advise starting/stopping sedatives or other medication;
- recommend treatment intensity based solely on SpO₂ waveform.

Allowed:
> Explain common diagnostic and treatment pathways and encourage clinician review when appropriate.

---

# 19. EVIDENCE MAP — CORE SOURCES

**EVD-001 — AASM ICSD-3-TR**
- International Classification of Sleep Disorders, Third Edition, Text Revision (2023)
- https://aasm.org/clinical-resources/international-classification-sleep-disorders/

**EVD-002 — AASM Scoring Manual Version 3**
- Released 15/02/2023; ≥4% hypopnea rule changed from ACCEPTABLE to OPTIONAL.
- https://aasm.org/aasm-releases-updated-version-scoring-manual/
- https://aasm.org/clinical-resources/scoring-manual/

**EVD-003 — International Consensus Statement on OSA**
- International Consensus Statement on Obstructive Sleep Apnea.
- PMCID: PMC10359192
- https://pmc.ncbi.nlm.nih.gov/articles/PMC10359192/

**EVD-004 — AASM diagnostic testing guideline**
- Clinical Practice Guideline for Diagnostic Testing for Adult OSA.
- PMCID: PMC5337595
- https://pmc.ncbi.nlm.nih.gov/articles/PMC5337595/

**EVD-005 — AASM 2025 sleep apps/devices health advisory**
- Apps/devices cannot diagnose OSA or confirm its absence.
- https://aasm.org/advocacy/position-statements/sleep-apps-and-devices-that-self-assess-risk-of-obstructive-sleep-apnea/

**EVD-006 — AASM HSAT position**
- Clinical use of a home sleep apnea test.
- https://aasm.org/advocacy/position-statements/clinical-use-of-a-home-sleep-apnea-test-an-updated-american-academy-of-sleep-medicine-position-statement/

**EVD-007 — OSA physiology / arousal / genioglossus**
- Eckert DJ, Malhotra A. Pathophysiology of Adult Obstructive Sleep Apnea. 2008.
- DOI: 10.1513/pats.200707-114MG
- PMCID: PMC2628457
- https://pmc.ncbi.nlm.nih.gov/articles/PMC2628457/

**EVD-008 — Event termination without cortical arousal**
- Jordan AS et al. Mechanisms used to restore ventilation after partial upper airway collapse during sleep.
- PMID: 17412778
- https://pubmed.ncbi.nlm.nih.gov/17412778/
- Younes/related physiology: respiratory events can terminate without clear cortical arousal.
- PMID: 21836132
- https://pubmed.ncbi.nlm.nih.gov/21836132/

**EVD-009 — Upper-airway anatomy/collapsibility**
- Anatomical determinants of upper airway collapsibility in OSA: systematic review/meta-analysis.
- PMCID: PMC11493082
- https://pmc.ncbi.nlm.nih.gov/articles/PMC11493082/

**EVD-010 — Carotid body physiology**
- Carotid body chemoreceptors: physiology, pathology, and implications for health and disease.
- PMCID: PMC8526340
- https://pmc.ncbi.nlm.nih.gov/articles/PMC8526340/

**EVD-011 — Carotid sinus**
- NCBI Bookshelf: Carotid Sinus — baroreceptor function.
- https://www.ncbi.nlm.nih.gov/books/NBK554378/

**EVD-012 — Pulse oximeter limitations**
- FDA Pulse Oximeters.
- https://www.fda.gov/medical-devices/products-and-medical-procedures/pulse-oximeters
- FDA Pulse Oximeter Basics.
- https://www.fda.gov/consumers/consumer-updates/pulse-oximeter-basics

**EVD-013 — Circulation delay**
- Prolonged lung-to-finger circulation time...
- PMCID: PMC11261378
- https://pmc.ncbi.nlm.nih.gov/articles/PMC11261378/

**EVD-014 — ODI**
- International Consensus Statement on OSA, ODI3/ODI4 definitions.
- PMCID: PMC10359192
- ODI calculation caveats: PMCID PMC11063702
- https://pmc.ncbi.nlm.nih.gov/articles/PMC11063702/

**EVD-015 — T90 / hypoxic burden limitations**
- Physiologic Consequences of Upper Airway Obstruction in Sleep Apnea.
- PMCID: PMC11562659
- https://pmc.ncbi.nlm.nih.gov/articles/PMC11562659/
- Hypoxic burden review: PMCID PMC11451971
- https://pmc.ncbi.nlm.nih.gov/articles/PMC11451971/

**EVD-016 — Night-to-night variability**
- Multinight Prevalence, Variability, and Diagnostic Misclassification of OSA.
- PMCID: PMC8906484
- https://pmc.ncbi.nlm.nih.gov/articles/PMC8906484/

**EVD-017 — Women / atypical presentation**
- Gender medicine and sleep disorders.
- PMCID: PMC11267506
- https://pmc.ncbi.nlm.nih.gov/articles/PMC11267506/

**EVD-018 — Craniofacial / Asian populations**
- International Consensus Statement on OSA: PMCID PMC10359192.
- Differences in Craniofacial Structures and Obesity in Caucasian and Chinese OSA.
- PMCID: PMC2910536
- https://pmc.ncbi.nlm.nih.gov/articles/PMC2910536/

**EVD-019 — Hypnotics**
- Messineo L, Sands SA, Labarca G. Hypnotics on OSA Severity and Endotypes: Systematic Review and Meta-analysis. 2024.
- PMID: 39042859; PMCID: PMC11716028
- https://pmc.ncbi.nlm.nih.gov/articles/PMC11716028/

**EVD-020 — Snoring acoustics**
- Pevernagie D et al. The acoustics of snoring. Sleep Med Rev. 2010.
- PMID: 19665907
- https://pubmed.ncbi.nlm.nih.gov/19665907/

**EVD-021 — Autonomic response**
- Sleep Apnea, Cardiac Arrhythmias, and Sudden Death.
- PMCID: PMC3147220
- https://pmc.ncbi.nlm.nih.gov/articles/PMC3147220/

**EVD-022 — Viatom/O2Ring device boundary**
- FDA K242876 Pulse Oximeter (PO2/PO2A/PO2B).
- https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfPMN/pmn.cfm?ID=K242876
- FDA K203812 / K191088 related Viatom pulse oximeter clearances.
- Viatom O2Ring product materials must be matched to exact SKU/jurisdiction before commercial claims.

---

# 20. RELEASE RULE

This file defines **medical truth used by the build**.  
It does **not** itself constitute physician sign-off or regulatory clearance.

**No medical content may be considered PASS if:**
1. it contradicts this canonical file;
2. source mapping does not support the exact claim;
3. screenshot/state has not been inspected;
4. implementation introduces new medical wording not approved here.
