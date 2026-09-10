# O2SENSE — FINAL HOTFIX AUTHORITY v1.3.1
**Status:** LAST AI MEDICAL HOTFIX BEFORE INDEPENDENT PHYSICIAN AUDIT  
**Scope:** BOUNDED. NO BROAD RESEARCH. NO APP-WIDE REWRITE.  
**Outcome:** `AI MEDICAL CLEANUP COMPLETE — READY FOR INDEPENDENT PHYSICIAN AUDIT` only if every acceptance gate below passes.

---

# 0. BINARY OUTCOME

This pass does NOT aim to make O2Sense “perfect”, “clinically validated”, or “release ready”.

The only acceptable end states are:

## PASS
`AI MEDICAL CLEANUP COMPLETE — READY FOR INDEPENDENT PHYSICIAN AUDIT`

Only when:
1. no known material medical-content issue in this v1.3.1 authority remains;
2. visible citation metadata and source-to-claim mapping pass the defined evidence gate;
3. Founder Pro, 3D Pins and Quick Review states are visibly correct;
4. technical build passes;
5. independent `/browser` verification subsequently passes.

## FAIL
`BLOCKED — NOT READY FOR PHYSICIAN AUDIT`

with exact unresolved blockers.

AI must never state:
- physician approved;
- clinically validated;
- medically safe for release;
- medical-device validated;
- release ready.

---

# 1. AUTHORITY & CHANGE CONTROL

## Authority precedence
1. Workspace Medical Integrity Rule
2. This attached `O2Sense_FINAL_HOTFIX_AUTHORITY_v1.3.1.md`
3. Corrective Delta v1.3
4. Corrective Delta v1.2
5. Corrective Delta v1.1
6. v1.0 Medical Correction Register / Canonical Medical Content
7. Existing app/code

Existing code is never a medical authority.

## Freeze list
Do NOT reopen content that passed the independent v1.3 review unless this file explicitly names it.

Freeze:
- Public 5-step physiology;
- Pattern ≠ Diagnosis architecture;
- OSA/CSA/COPD/OHS differential framework;
- six clinical scenarios;
- v1.2 SpO2 threshold / carotid body / ANP / circulation-delay / positional-therapy corrections;
- v1.3 Symptoms rewrite except for exact hotfixes named here;
- v1.3 glossary corrections except exact hotfixes named here.

## Closed-world rule
When exact medical copy or bibliographic metadata is provided here:
- use it exactly;
- do not strengthen it;
- do not “complete” missing fields from memory;
- do not invent DOI/PMID/PMCID;
- if a field is not verified, OMIT it rather than guess.

If another possible medical issue is discovered:
`NEW_MEDICAL_ISSUE → REPORT ONLY → DO NOT SELF-PATCH`

---

# 2. HOTFIX REGISTER

## V131-P0-001 — REMOVE UNIVERSAL MEDICATION TIMING ADVICE

### Observed issue
Waveform/Action Plan teaches a fixed rule equivalent to:
> avoid sedatives / sleeping medication for ≥4 hours before sleep.

This is not an approved universal medication-timing rule and may encourage self-modification of prescribed medicines.

### APPROVED PUBLIC COPY
> **Hạn chế rượu gần giờ ngủ. Nếu đang sử dụng thuốc ngủ, thuốc an thần hoặc thuốc có thể gây buồn ngủ, không tự ý ngừng hay thay đổi liều/thời điểm dùng; hãy trao đổi với bác sĩ hoặc dược sĩ nếu lo ngại thuốc ảnh hưởng đến hô hấp khi ngủ.**

### REQUIRED
- remove all universal `4 hours`, `≥4h`, or equivalent medication-timing instructions;
- do not tell users to stop, delay, skip, or change prescribed medicines;
- keep positional advice phenotype-dependent, not universal OSA treatment.

---

## V131-P0-002 — CRANIOFACIAL CITATION IDENTIFIER REPAIR

### Canonical record
Lee RWW, Chan ASL, Grunstein RR, Cistulli PA.  
**Craniofacial phenotyping in obstructive sleep apnea — a novel quantitative photographic approach.**  
Sleep. 2009;32(1):37–45.  
PMID: **19189777**  
PMCID: **PMC2625322**  
DOI: **10.5665/sleep/32.1.37**

### REQUIRED
Remove incorrect DOI:
`10.1093/sleep/32.1.37`

Do not add other metadata not already verified.

---

## V131-P0-003 — AASM DIAGNOSTIC GUIDELINE IDENTIFIER REPAIR

### Canonical record
Kapur VK, Auckley DH, Chowdhuri S, Kuhlmann DC, Mehra R, Ramar K, Harrod CG.  
**Clinical Practice Guideline for Diagnostic Testing for Adult Obstructive Sleep Apnea: An American Academy of Sleep Medicine Clinical Practice Guideline.**  
J Clin Sleep Med. 2017;13(3):479–504.  
PMID: **28162150**  
PMCID: **PMC5337595**  
DOI: **10.5664/jcsm.6506**

### REQUIRED
Remove incorrect identifiers:
- PMID `28380492`
- PMCID `PMC5337594`

Use only the canonical identifiers above.

### CLAIM BOUNDARY
This guideline supports the principle that OSA diagnostic testing is performed in conjunction with comprehensive sleep evaluation using appropriate PSG or HSAT pathways. Do not use it to claim pulse oximetry alone diagnoses or excludes OSA.

---

## V131-P0-004 — ECKERT & MALHOTRA 2008 IDENTIFIER REPAIR

### Canonical record
Eckert DJ, Malhotra A.  
**Pathophysiology of Adult Obstructive Sleep Apnea.**  
Proc Am Thorac Soc. 2008;5(2):144–153.  
PMID: **18250206**  
PMCID: **PMC2628457**  
DOI: **10.1513/pats.200707-114MG**

### REQUIRED
Remove incorrect identifiers:
- PMID `18250207`
- PMCID `PMC2645258`

Use only the canonical identifiers above.

---

## V131-P0-005 — FULL VISIBLE SOURCE INVENTORY & CLOSED-WORLD EVIDENCE CHECK

The previous pass corrected five source panels but did not independently prove every visible source record.

### REQUIRED BEFORE FINALIZING
Create:
`visible_medical_source_inventory_v131.json`

For EVERY medical source visible in the release-candidate UI, record:
- `source_id`
- `visible_title`
- `visible_authors_or_org`
- `visible_journal_or_issuer`
- `visible_year`
- `visible_volume_issue_pages` if shown
- `visible_doi` if shown
- `visible_pmid` if shown
- `visible_pmcid` if shown
- `evidence_type`
- `o2sense_claims_supported`
- `verification_status`

### Closed-world behavior
For the four records explicitly canonicalized in this authority, use the exact metadata above.

For all other existing source records:
- do not silently rewrite them from model memory;
- preserve existing metadata during implementation unless the current workspace already contains a verified canonical record;
- include every visible record in the source inventory for the later independent `/browser` verifier;
- if implementation itself detects a clear conflict with an existing approved authority, mark `SOURCE_UNVERIFIED` and do not fabricate a repair.

### PASS CONDITION FOR IMPLEMENTATION
100% of visible medical source panels are enumerated.
This is an inventory/completeness gate, not permission for autonomous research-driven rewrites.

---

## V131-P1-006 — FOUNDER PRO STEP 3: RESPIRATORY EFFORT PRECISION

### Problem
Thoracoabdominal paradox must not be presented as obligatory for every obstructive apnea.

### APPROVED COPY
> **Trong ngưng thở tắc nghẽn, nỗ lực hô hấp vẫn tiếp diễn và có thể kèm chuyển động ngực–bụng nghịch thường.**

### Founder Pro English/technical equivalent if needed
> **Respiratory effort persists during obstructive apnea and may be accompanied by paradoxical thoracoabdominal motion.**

### REMOVE
Any wording equivalent to:
`obstructive apnea = always paradoxical chest-abdominal movement`.

---

## V131-P1-007 — FOUNDER PRO STEP 4: GAS-EXCHANGE PRECISION

### Problem
Do not teach “mild respiratory acidosis” as an automatic outcome of a single obstructive event without pH measurement.

### APPROVED COPY
> **Giảm thông khí trong một đợt tắc nghẽn có thể gây rối loạn khí máu thoáng qua, với PaO₂ giảm và PaCO₂ tăng ở mức độ khác nhau.**

### Founder Pro equivalent
> **Reduced ventilation during an obstructive event may produce transient gas-exchange disturbance, with variable decreases in PaO₂ and increases in PaCO₂.**

### REMOVE
- automatic `(toan hô hấp nhẹ)`;
- any statement implying pH/acidosis is directly measured or universal.

---

## V131-P1-008 — FOUNDER PRO STEP 4–5: REMOVE DETERMINISTIC ARAS → GENIOGLOSSUS SWITCH

### Principle
Cortical arousal is not obligatory for recovery of airflow. Upper-airway dilator recruitment and increasing respiratory drive can contribute; genioglossus is one component, not a single on/off switch.

### APPROVED STEP-5 VISUAL LABEL
> **TĂNG HOẠT ĐỘNG CƠ GIÃN ĐƯỜNG THỞ → PHỤC HỒI LUỒNG KHÍ (MÔ PHỎNG)**

### APPROVED SUPPORTING COPY
> **Luồng khí có thể phục hồi nhờ tăng respiratory drive và huy động các cơ giãn đường thở trên; cortical arousal có thể xuất hiện và tăng cường đáp ứng nhưng không bắt buộc ở mọi sự kiện.**

### REQUIRED
- remove a visual/text chain that implies `ARAS → CN XII/genioglossus → airway opens` is mandatory;
- genioglossus may remain highlighted as an important upper-airway dilator;
- do not imply wearable SpO2 measures EEG arousal or genioglossus activity.

---

## V131-P1-009 — REMOVE UNSUPPORTED AUTHORITY BRANDING / INTERNAL-RULE AMBIGUITY

Search visible UI for:
- `AASM & WHO`
- `WHO`
- `AASM / CMC-09`
- `CMC-09`
- equivalent authority badges.

### RULE
If an exact WHO source is not mapped to the specific visible claim:
- remove `WHO` from that claim/badge.

If `CMC-09` is an internal O2Sense rule:
- do not visually present it as an AASM rule number.

### APPROVED LABEL
> **O2Sense Medical Rule CMC-09**

Optional secondary text only if accurately supported:
> **Aligned with AASM diagnostic guidance**

Do not imply CMC-09 is issued by AASM.

---

## V131-P1-010 — REMOVE UNIVERSAL “3–5 NIGHTS” RULE

### Problem
Night-to-night variability is real, but `3–5 nights` must not be taught as a universal clinical threshold without an exact protocol/source.

### APPROVED PUBLIC
> **Nếu theo dõi xu hướng tại nhà, nhiều đêm có thể cung cấp bối cảnh tốt hơn một đêm đơn lẻ vì chỉ số hô hấp/SpO₂ có thể thay đổi giữa các đêm. Dữ liệu wearable không tự xác nhận hoặc loại trừ OSA.**

### REQUIRED
Replace generic:
`theo dõi 3–5 đêm`
with:
`theo dõi nhiều đêm`
unless a specific validated protocol is explicitly named and sourced.

---

## V131-P0-011 — QUICK REVIEW OPTIONS MUST PRODUCE THE CORRECT VISIBLE FEEDBACK STATE

### Observed failure
In v1.3 screenshots, `quick_review_scenario_opt1`, `opt2`, and `opt3` did not independently prove three correct selected-option outcomes; captured pixels appeared to repeat the same feedback state.

### REQUIRED
Do not rewrite medical content unless necessary to fix a state-routing bug.

For each option:
1. record exact option text;
2. click that exact option;
3. verify selected option/index;
4. verify visible feedback title;
5. verify visible explanation/rationale;
6. capture screenshot.

Create:
`quick_review_state_map_v131.json`

Fields:
- `option_id`
- `option_text`
- `expected_feedback_id`
- `observed_feedback_title`
- `observed_explanation_snippet`
- `selected_state_visible`
- `screenshot`

### PASS
Option 1/2/3 screenshots must prove the state generated by the clicked option.
If two options intentionally share the same feedback, document that mapping explicitly from source data; do not assume it.

---

## V131-P0-012 — 3D PIN CLICK → CORRECT VISIBLE POPUP

### Observed failure
Different v1.3 pin screenshots did not independently prove different selected pin/popup states.

### REQUIRED
For every medically distinct pin:
1. click the actual visible pin control/hit target;
2. record clicked `pin_id`;
3. assert active/selected pin state;
4. assert popup visible;
5. assert popup title corresponds to clicked pin;
6. assert non-zero bounding box;
7. ensure popup is in screenshot viewport;
8. capture.

Create:
`pin_state_map_v131.json`

Minimum pins:
- nose;
- palate/uvula;
- tongue base/genioglossus;
- mandible/chin;
- obstruction region;
- trachea/cartilage rings;
- any additional medically distinct pin actually present.

### PASS
No screenshot may be credited merely because another pin's popup text exists in DOM.

---

## V131-P0-013 — IMPLEMENTATION EVIDENCE PACKAGE

Create a NEW clean folder:
`app_screenshots_v131/`

Capture ONLY affected/acceptance-critical states:
- Founder Pro Steps 3, 4, 5 after medical corrections;
- Quick Review scenario option 1, 2, 3;
- all 3D pin states;
- waveform/action-plan state with medication wording;
- authority badge/internal-rule state(s);
- multi-night wording state;
- all corrected canonical source panels;
- source-inventory overview if UI supports one.

Generate:
- `screenshot_manifest_v131.json`
- `visible_medical_source_inventory_v131.json`
- `quick_review_state_map_v131.json`
- `pin_state_map_v131.json`
- `medical_change_traceability_v131.csv`
- `AI_MEDICAL_READINESS_IMPLEMENTATION_v131.md`

### Critical limitation
The implementation agent MAY report:
`IMPLEMENTATION EVIDENCE COMPLETE`

It MUST NOT issue the final:
`READY FOR INDEPENDENT PHYSICIAN AUDIT`

That final readiness gate is reserved for independent `/browser` verification + external review.

---

# 3. IMPLEMENTATION ACCEPTANCE MATRIX

Implementation is complete only if ALL are true:

| Gate | Required result |
|---|---|
| V131 medical hotfix items | 100% implemented or explicit BLOCKED |
| TypeScript | PASS |
| Production build | PASS |
| Source inventory | 100% visible medical sources enumerated |
| Known canonical citations | exact match |
| Medication guidance | no fixed sedative timing / no self-modification advice |
| Founder Pro 3–5 | bounded, non-deterministic wording |
| Quick Review | option-to-feedback mapping proven |
| 3D pins | click-to-visible-popup mapping proven |
| Authority branding | no unsupported WHO/AASM attribution |
| Multi-night wording | no universal 3–5-night threshold |
| New medical issues | report-only |
| Final medical readiness | NOT self-declared |

---

# 4. FINAL IMPLEMENTATION STATUS

If implementation-side gates pass, end with:

**STATUS: v1.3.1 IMPLEMENTATION EVIDENCE COMPLETE — REQUIRES INDEPENDENT /browser VERIFICATION.**

If any implementation-side gate fails:

**STATUS: v1.3.1 BLOCKED — NOT READY FOR INDEPENDENT /browser VERIFICATION.**
