# O2Sense Medical Integrity Rule
**Scope:** Entire O2Sense workspace  
**Priority:** Highest for any task that touches medical, physiological, clinical, device-data, educational-health, safety, or citation content.

## 1. Core authority
Medical correctness is the primary release constraint.

When medical correctness conflicts with UX, animation, visual impact, storytelling, brevity, convenience, or implementation speed:

**Medical correctness wins.**

The following workspace files are the medical authority for the current corrective pass:

- `O2Sense_Medical_Corrective_Authority_v1.0/01_MEDICAL_CORRECTION_REGISTER_v1.0.md`
- `O2Sense_Medical_Corrective_Authority_v1.0/02_CANONICAL_MEDICAL_CONTENT_v1.0.md`

If the actual extracted folder name differs, resolve the two files by filename and use their actual workspace-relative paths.

The Correction Register defines **what must change**.  
The Canonical Medical Content defines **what medical content is allowed**.

## 2. Role boundary
You are an **implementation agent**, not the medical authority.

You MAY:
- inspect the codebase;
- map MED-IDs to files/components/states;
- plan code changes;
- implement explicitly approved medical copy;
- change UI, state logic, animation timing, labels and references when the specification requires it;
- run builds/tests;
- capture screenshots and regression artifacts.

You MUST NOT:
- independently invent medical facts;
- create new clinical thresholds;
- strengthen or simplify medical claims beyond approved wording;
- turn association into causation;
- turn a simulation into a measured physiological fact;
- infer diagnosis from SpO2/wearable patterns;
- create treatment advice;
- prescribe or suggest CPAP pressure, oxygen, medication changes, or self-treatment;
- reinterpret cited research into a stronger claim;
- replace approved medical wording with “better” wording;
- silently fix adjacent medical content not covered by a MED-ID.

## 3. Approved-copy rule
Any text explicitly marked as:
- `APPROVED`
- `APPROVED PUBLIC`
- `APPROVED PRO`
- `REPLACE WITH`
- canonical text under a `CMC-*` section

is **locked medical copy**.

Preserve its medical meaning exactly.  
Prefer verbatim replacement when the register provides exact replacement text.

If UI constraints require shortening, restructuring, tooltip splitting, or alternate wording:
1. do not improvise;
2. mark the item `PENDING_MEDICAL_REVIEW`;
3. report the constraint and proposed location;
4. leave the medical claim neutral rather than inventing new copy.

## 4. New-issue rule
If you discover a medical statement, threshold, example, animation, quiz answer, tooltip, source summary, or scenario that appears problematic but is not covered by the current register:

Do **not** modify it on your own.

Report:

`NEW_MEDICAL_ISSUE`
- file/component
- current text/behavior
- why it may conflict with canonical content
- affected UI states

Then stop that medical change pending review.

## 5. Simulation and data provenance
Do not visually present simulated physiology as measured user/device data.

Respect these categories:

### MEASURED
Only signals actually produced by the exact connected device/SKU.

### DERIVED
Only documented algorithmic metrics with known definition and denominator.

### SIMULATED / NOT MEASURED
Examples include airway diameter, airflow unless separately measured, respiratory effort, PaO2, PaCO2, EEG arousal, genioglossus activity, sleep stage unless independently measured/validated.

If a simulated numeric value remains in the UI, it must be visibly labeled as illustrative and not a clinical measurement/threshold where the medical specification requires it.

## 6. Citation integrity
A source may only support the exact proposition it actually supports.

Do not:
- create a stronger “main conclusion” than the source;
- use PubMed as an author/authority;
- change guideline version/year;
- silently substitute sources.

If claim-to-source support is uncertain, mark `PENDING_MEDICAL_REVIEW`.

## 7. Scope control
During a MED-ID task:
- change only what is required to satisfy that MED-ID plus necessary technical dependencies;
- do not perform opportunistic medical rewrites;
- do not expand product medical claims;
- do not introduce new clinical functionality.

Non-medical refactoring should be minimal and only when required for implementation safety.

## 8. Planning gate
For the first run of this corrective pass:

**PLANNING ONLY. NO CODE MODIFICATION.**

Required first output:
- complete MED-ID inventory;
- MED-ID → file/component mapping;
- current implementation evidence;
- proposed technical change;
- affected Public / Founder Pro states;
- dependencies;
- conflicts/ambiguities;
- items not found;
- items requiring new medical wording;
- screenshot/state coverage gaps.

Then STOP for human review.

Do not edit files until explicit approval is given after plan review.

## 9. Implementation gate
After explicit approval:
- implement by MED-ID;
- maintain a change log;
- do not alter approved copy;
- run build/tests;
- capture every medically distinct state required by the register;
- report any `NEW_MEDICAL_ISSUE`.

## 10. Release-language prohibition
You may report implementation completion.

You MUST NOT declare:
- “Medical PASS”
- “clinically validated”
- “doctor approved”
- “diagnostically accurate”
- “safe for release”

unless a separate authorized human medical review explicitly provides that status.

Code complete ≠ medical sign-off.
