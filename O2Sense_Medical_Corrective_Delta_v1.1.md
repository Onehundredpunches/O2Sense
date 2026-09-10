# O2SENSE — MEDICAL CORRECTIVE DELTA v1.1
**Status:** BOUNDED CORRECTIVE PASS — IMPLEMENTATION AUTHORITY  
**Date:** 09/09/2026  
**Depends on:** Medical Corrective Authority v1.0  
**Goal:** Fix only remaining medical-content blockers and screenshot/state-verification defects found after the first Antigravity implementation pass.

---

# 0. HARD SCOPE

This is a **delta pass**, not a rewrite.

Do NOT:
- redesign the app;
- reopen already-passed medical copy unless needed by an item below;
- introduce new medical mechanisms, thresholds, numeric physiology values, or references;
- add “more professional” or “more detailed” medical wording;
- change unrelated UX;
- claim Medical PASS.

Medical correctness overrides visual impact, animation and implementation convenience.

Any new medical statement not explicitly approved below:
`NEW_MEDICAL_ISSUE → REPORT ONLY → DO NOT PATCH`.

---

# 1. QA / STATE COVERAGE

## V11-P0-001 — Replace SHA uniqueness with DOM-state verification
**Problem**
35 unique image hashes do not prove 35 medically distinct UI states. Previous output contained screenshot files whose filenames indicated different states while the rendered selected tab/state remained the same.

**Required implementation**
For every screenshot target:
1. navigate to route/module;
2. explicitly activate the required state/tab/card/step;
3. wait for deterministic render completion;
4. assert the selected state in DOM before capture;
5. only then save screenshot.

**Required assertions**
Each capture manifest entry must include:
- screenshot filename;
- route;
- module;
- expected state ID;
- DOM selector/assertion;
- observed selected label;
- mode: Public / Founder Pro;
- pass/fail.

**Do NOT use**
`SHA-256 unique` as evidence of state coverage.

Hashes may remain as an integrity check only.

**PASS**
Every medically distinct state has a positive DOM assertion before screenshot capture.

---

## V11-P0-002 — Capture all medically distinct states, not a fixed 35 if more are required
Required minimum coverage:
- 5 physiology steps — Public;
- 5 physiology steps — Founder Pro;
- all medically distinct 3D states;
- all 4 SpO2 waveform tabs;
- every encyclopedia tab;
- every MythBuster front AND back;
- every clinical scenario and its medical feedback;
- glossary entries with medical content;
- every source/citation detail panel;
- every quiz question plus correct-answer explanation;
- all safety/disclaimer states materially affecting interpretation.

If this exceeds 35 screenshots, capture more than 35.

**PASS**
Coverage is based on medical-state inventory, not legacy screenshot count.

---

# 2. DATA PROVENANCE

## V11-P0-003 — Remove misleading `[ĐO LƯỜNG]` on simulation pages
**Problem**
Example/simulated SpO2 and HR were visually labeled `[ĐO LƯỜNG]`, while the same screen stated that the values were simulated and not user measurements.

**Rule**
Simulation page values are NOT measured user data.

**Replace labels on simulated pages**
`[ĐO LƯỜNG]` → `[VÍ DỤ GIẢ LẬP]`

Alternative short label:
`[MÔ PHỎNG]`

**Approved explanatory copy**
> Các giá trị trên màn hình này dùng để minh họa cơ chế và không phải dữ liệu đo từ một người dùng cụ thể.

**If explaining device capability**
Use:
> Thông số có thể được thiết bị phù hợp ghi nhận.

Do NOT label such a value “measured” unless actual session/device provenance exists.

**PASS**
No simulated numeric value appears visually equivalent to live/measured user data.

---

# 3. DIFFERENTIAL-DIAGNOSIS TABLE

## V11-P0-004 — Rewrite OSA / CSA / COPD-OHS differentiation table
**Problem**
Current table overstates disease-specific SpO2 patterns and uses absolute language.

### Approved table structure
Columns:
1. `Tình trạng`
2. `Cơ chế chính`
3. `SpO2 có thể quan sát`
4. `Dữ liệu cần thêm để phân biệt`
5. `Không được suy diễn`

### OSA — approved
**Cơ chế chính**
> Đường thở trên hẹp/xẹp lặp lại trong lúc ngủ trong khi nỗ lực hô hấp vẫn còn.

**SpO2 có thể quan sát**
> Có thể xuất hiện các đợt giảm–phục hồi SpO2 lặp lại, nhưng mức độ và hình dạng thay đổi giữa từng người và từng đêm.

**Dữ liệu cần thêm**
> Luồng khí, nỗ lực hô hấp, thời gian ngủ và đánh giá lâm sàng; PSG hoặc HSAT phù hợp khi có chỉ định.

**Không được suy diễn**
> SpO2 ban ngày bình thường hoặc dạng “răng cưa” không tự xác nhận OSA.

**Remove**
- “Ban ngày SpO2 97–99% hoàn toàn bình thường.”
- “đáp ứng rất tốt với nằm nghiêng” as a distinguishing signature.

### CSA — approved
**Cơ chế chính**
> Trong event trung ương, tín hiệu điều khiển hô hấp tạm thời giảm hoặc ngừng, nên nỗ lực hô hấp cũng giảm hoặc mất.

**SpO2 có thể quan sát**
> Có thể xuất hiện dao động oxy theo chu kỳ, nhưng SpO2 riêng lẻ không xác định CSA hay Cheyne–Stokes breathing.

**Dữ liệu cần thêm**
> Luồng khí và nỗ lực hô hấp; các tín hiệu PSG/HSAT phù hợp và bối cảnh tim mạch, thần kinh, thuốc hoặc độ cao.

**Không được suy diễn**
> Không phải mọi CSA đều là Cheyne–Stokes.

**Remove**
- “Não quên phát lệnh thở.”
- “CSA = sóng hình sin mềm mại / Cheyne–Stokes.”

### COPD / chronic pulmonary disease — approved
**Cơ chế chính**
> Bệnh phổi mạn có thể gây bất thường trao đổi khí hoặc giảm dự trữ oxy, làm SpO2 thấp hơn hoặc giảm kéo dài trong một số trường hợp.

**SpO2 có thể quan sát**
> Có thể thấy nền SpO2 thấp hoặc giảm kéo dài, nhưng hình dạng không đặc hiệu.

**Dữ liệu cần thêm**
> Triệu chứng, tiền sử, chức năng hô hấp, khí máu khi phù hợp và đánh giá lâm sàng.

**Không được suy diễn**
> Sustained low SpO2 không tự chẩn đoán COPD.

### OHS / hypoventilation — approved
**Cơ chế chính**
> Giảm thông khí có thể gây tăng CO2 và giảm oxy kéo dài, đặc biệt trong lúc ngủ.

**SpO2 có thể quan sát**
> Có thể có giảm oxy kéo dài hoặc nền thấp, nhưng SpO2 không đo trực tiếp CO2 và không xác nhận OHS.

**Dữ liệu cần thêm**
> PaCO2 hoặc chỉ số CO2 phù hợp, BMI/bối cảnh lâm sàng, sleep study khi có chỉ định.

**Không được suy diễn**
> SpO2 đơn thuần không phân biệt OHS với các nguyên nhân giảm oxy khác.

**PASS**
No disease row uses a SpO2 waveform as a diagnostic signature.

---

# 4. REMOVE NEW UNSANCTIONED PHYSIOLOGY NUMBERS

## V11-P0-005 — Remove fixed Pcrit and intrathoracic-pressure numbers added by implementation agent
**Problem**
Founder Pro introduced numerical values such as:
- `Pcrit < -4 cmH2O`
- intrathoracic pressure `-1 to -2 cmH2O`
without approval in the canonical authority.

**Action**
Remove fixed numeric claims from user-facing medical education.

**Approved Pcrit copy**
> Pcrit là một chỉ số nghiên cứu phản ánh mức độ dễ xẹp của đường thở trên; Pcrit càng âm thường phản ánh đường thở ít dễ xẹp hơn. Giá trị phụ thuộc phương pháp đo và điều kiện sinh lý.

**Approved pressure copy**
> Nỗ lực hít vào chống lại tắc nghẽn có thể tạo áp lực âm trong lồng ngực; mức độ thay đổi đáng kể giữa từng event và từng người.

Do not add replacement numeric ranges.

**PASS**
No new unapproved numeric physiology remains.

---

# 5. WAVEFORM ARTIFACT LANGUAGE

## V11-P0-006 — Remove `90% = nhiễu do đè tay`
**Problem**
An isolated 90% reading was presented as motion/compression artifact.

**Replace badge**
> **Điểm giảm đơn lẻ — cần kiểm tra chất lượng tín hiệu**

**Approved Public copy**
> Một điểm giảm SpO2 đơn lẻ có thể do nhiễu cảm biến, chuyển động hoặc tưới máu kém, nhưng cũng có thể là số đo thật. Cần xem chất lượng tín hiệu, xu hướng lặp lại và bối cảnh.

**Founder Pro**
> An isolated dip is nonspecific. Artifact is one possibility; signal quality, motion/perfusion context and repeatability should be reviewed before physiological interpretation.

Do not associate any fixed SpO2 number with artifact.

**PASS**
No UI implies shape or one threshold proves artifact.

---

# 6. GENIOGLOSSUS GLOSSARY

## V11-P1-007 — Remove deterministic sleep → tongue-falls-back explanation
**Replace Public**
> Genioglossus là một trong các cơ quan trọng giúp giữ đường thở vùng hầu mở. Khi ngủ, cách hệ thần kinh điều khiển cơ này thay đổi; ở người có đường thở dễ xẹp, khả năng bù trừ có thể không đủ trong một số thời điểm của giấc ngủ.

**Replace Founder Pro**
> Genioglossus is a major upper-airway dilator. Its tonic and phasic activity changes across wakefulness, sleep stage and respiratory loading. In OSA, effective neuromuscular compensation may be insufficient relative to pharyngeal collapsibility.

**Remove**
- “ngủ say → cơ giảm → lưỡi tụt” as universal chain;
- any claim that OSA occurs only in deep sleep.

---

# 7. SOURCE TAXONOMY

## V11-P1-008 — Correct source-authority taxonomy
**Problem**
Current source modal groups NHLBI, AASM, USPSTF, JAMA and PubMed as equivalent organizations/authorities.

**Replace introductory copy**
> Nguồn được ưu tiên theo loại bằng chứng: guideline/consensus từ cơ quan và hiệp hội chuyên môn; nghiên cứu bình duyệt trên các tạp chí khoa học; và cơ sở dữ liệu dùng để truy xuất tài liệu.

**Metadata rules**
- AASM → professional society / guideline source
- NHLBI → research institute / public-health source
- USPSTF → independent preventive-services task force
- JAMA → peer-reviewed medical journal
- PubMed → bibliographic database/index

Do not display PubMed as author, publisher or guideline authority.

---

# 8. AHI LABEL CLEANUP

## V11-P1-009 — Remove “TIÊU CHUẨN VÀNG AASM” for AHI
**Replace**
> **Phân tầng AHI theo quy ước sử dụng trong y học giấc ngủ**

Keep:
- `<5/h`: Dưới ngưỡng tần suất OSA quy ước
- `5–14.9/h`: Nhẹ
- `15–29.9/h`: Vừa
- `≥30/h`: Nặng

Keep note:
> AHI phải được hiểu trong bối cảnh lâm sàng và phương pháp đo/chấm điểm.

Do not call AHI itself a “gold standard”.

---

# 9. SLEEP-STAGE WORDING

## V11-P1-010 — Replace “khi ngủ say” causal wording
Search all Public/Pro content and metaphors for phrases equivalent to:
- “ngủ say làm đường thở xẹp”;
- “ngưng thở chỉ xảy ra khi ngủ sâu”;
- “khi ngủ say cơ họng thả lỏng hoàn toàn”.

**Approved generic Public wording**
> Khi chuyển sang trạng thái ngủ, điều khiển thần kinh–cơ của đường thở thay đổi. Mức độ tắc nghẽn có thể khác nhau theo giai đoạn ngủ, tư thế và từng người.

**PASS**
No educational content teaches deep sleep as a required cause/state for OSA.

---

# 10. FINAL REGRESSION PACKAGE

After implementation return:

## A. CHANGE LOG
`V11-ID → files/components changed → exact change`

## B. MEDICAL CONTENT DIFF
All medical-copy changes only.

## C. NEW_MEDICAL_ISSUES
Found but not modified.

## D. BUILD
- TypeScript check result
- production build result

## E. STATE MANIFEST
For every screenshot:
- file
- route
- target state
- selected-state DOM assertion
- mode
- assertion result

## F. SCREENSHOTS
Capture every medically distinct state required in V11-P0-001/002.

## G. STOP
Do not declare Medical PASS.

Final status:
`CORRECTIVE v1.1 IMPLEMENTATION COMPLETE — AWAITING INDEPENDENT MEDICAL REGRESSION AUDIT`
