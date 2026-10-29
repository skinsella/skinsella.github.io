# Note for Codex: harmonisation gap correction

From Claude, for Stephen, 29 October 2026. Stephen has asked for this to be treated as a major error and corrected across the whole repository.

Read book/harmonisation_gap_review_2026_10_29.md first. Do not change any published default until Stephen confirms, but every output should report all three harmonisation cases below.

## 1. The error

The model treated the F&M 2024 harmonisation figures as if part of the cost came back in tax. It did not.

- **Gross figures.** F&M 2024 Table 6 gives *gross* 2019 increments. Pay rises by £4.306bn on a £6.797bn pay bill, a 63% increase. Welfare, including pensions, rises by £4.809bn on £9.615bn, a 50% increase.
- **No tax offset.** F&M give no tax offset.
- **Not a net figure.** `RERATE_FULL` (£18.104bn less £9.577bn, Table 7) is not a net-of-tax figure. F&M's Tables 6 and 7 do not reconcile, so the implied 6.5% "net recovery" is an unexplained difference between their tables.
- **The method overstates the gap.** F&M take the pay gap from average earnings (EHECS against ASHE), not like-for-like grades. They apply a pension-payment ratio to all welfare.
- **Doyle (2025).** Uses a 48% pay gap. Equalisation costs €152m more each year for 15 years, net of taxes and contributions. See research/pdf_text/doyle_2025.txt around lines 1298 to 1306 and 1417.
- **Tomlinson (2022).** Finds Northern Ireland social security under the Irish system about £3.3bn below the current outturn, with the UK keeping state pensions.
- **Symptom.** Immediate parity under Unitary gives about €6,600 a year per Northern Ireland resident in year one. The 2023 household disposable income gap is only about 2,500 PPS per person (CSO, 2026).

## 2. What Claude has already changed

Commit 37a0b61 changes `simulator/scenario_model.mjs` and the JSX copy:
- **New inputs.** Four structural inputs: `payGapPct`, `welfareGapPct`, `payTaxOffset` and `welfareTaxOffset`.
- **Defaults.** All default to null, which reproduces the old results exactly.
- **Reference files.** `data/united_ireland_fiscal_cases.json` and `simulator/model_reference.json` were rebuilt for the new fingerprint, with no change to any result.
- **Tests.** New checks in `scripts/test_component_model.mjs`. The old-snapshot comparison in `scripts/test_benefits_model.mjs` now passes only the keys the old engine knows. `npm test` passes.
- **Runs.** `research/paper_runs/three_cases.mjs` produces every three-case figure in the paper, and `research/paper_runs/harmonisation_cases.mjs` the five-case sensitivity.

## 3. The three cases

Use these exact settings. The Doyle offset is calibrated so net pay at parity equals 15 × €152m on the F&M 2019 pay bill rebased to 2023 euros. Doyle's price basis is not verified, so keep that caveat wherever the middle and lower cases appear.

| Case | `payGapPct` | `payTaxOffset` | `welfareGapPct` | `welfareTaxOffset` | Meaning |
| --- | --- | --- | --- | --- | --- |
| Upper | null (F&M, 63.35%) | 0 | null (F&M, 50.0%) | 0 | F&M 2024 gross, no tax. Likely overstated |
| Middle | 48 | 48.8 | null (F&M) | 0 | Doyle 2025 pay gap net of tax, F&M welfare |
| Lower | 48 | 48.8 | 0 | 0 | Doyle pay, no welfare gap, in the direction of Tomlinson 2022. A bound, not an estimate |

The exact pay offset is `100*(1 - 15*0.152/(0.48*SOURCE_PAY_BASE))`, which is 48.78%.

The upper case replaces the old default. The old default kept an artefactual 6.5% offset, and nothing should present it as a separate case.

## 4. Changes needed

1. **Make the case a first-class setting.** Add `harmonisationCase` with values `upper`, `middle`, `lower` and `custom`, mapping to the table above. Keep the four inputs for `custom`. Export the presets, so the story page, benefits page, brief builder and tests share one definition.
2. **Fix scripts that use `RERATE_FULL` as net harmonisation.**
   - `scripts/build_managed_viability.mjs` line 21, `harmonisation=C.RERATE_FULL*...`
   - `scripts/assess_indexation_review.mjs` line 9

   Route both through `fiscalComponents` with the chosen case, or archive them if they are superseded.
3. **Correct every label that calls the F&M figure net, or says tax is recovered.**
   - `simulator/unification_fiscal_simulator.jsx` around line 731 ("Full net fiscal envelope")
   - `scripts/build_reference.mjs` lines 20, 31 and 132 (the formula text "net cost = phase×RERATE_FULL")
   - `scripts/build_audit.mjs` lines 59 to 62
   - `scripts/model_audit_data.mjs` (the `RERATE_FULL` entry)
   - the `netRecoveryShare` comment in the engine

   Describe `RERATE_FULL` as "F&M Table 7 difference, does not reconcile with Table 6, not a tax estimate".
4. **Report all three cases in every output.**
   - `scripts/build_brief_v2.mjs`, and regenerate `documents/brief_v2.md` and `data/brief_v2_model_checks.json`
   - the story page: add a three-way harmonisation switch, and label the upper case "F&M 2024 gross, likely overstated"
   - the benefits page and `simulator/benefits_reference.json`
   - `simulator/model_reference.html`
   - the fiscal cases in `UNITY_CASES`
5. **Tests to add.**
   - Each preset reproduces the values in `research/paper_runs/three_cases.mjs`.
   - Net harmonisation never exceeds gross.
   - A gap of zero gives zero harmonisation.
   - The upper case equals the gross increments with no offset.
   - The `custom` path with F&M values reproduces the old default exactly.
6. **Keep the benefits engine consistent.** `northernTransferPerPerson` and the unity transfer in `simulator/benefits_model.mjs` use `c.harmonisation`, so they follow the case automatically. Check that the fiscal checks and the benefit pairs are reported per case.
7. **Record the decision as open.** `book/decision_register.md` row 8 (central harmonisation case) is Stephen's decision. Until he decides, show all three cases and make no claim that one is central.

## 5. Headline results to reproduce

Managed Integration, favourable deal, 2% Northern Ireland growth, 25 years.

| Case | Year 1, €bn | Year 25, €bn | Borrowing in year 25, €bn | Total debt in year 25, % of GNI* | Growth to repay | Growth to pass all three checks |
| --- | --- | --- | --- | --- | --- | --- |
| Upper | 4.3 | 25.5 | 407 | 140.2% | 4.7% | 4.3% |
| Middle | 4.1 | 19.3 | 316 | 121.2% | 4.5% | 3.6% |
| Lower | 3.7 | 5.3 | 122 | 80.5% | 3.1% | 2.1% |

## 6. Evidence still needed

The welfare gap drives the result more than anything else, moving Managed Integration's year-25 cost by about €14bn. Two pieces of evidence are needed:
- a benefit-by-benefit costing of the Irish system for the Northern Ireland population, ideally through parallel EUROMOD and UKMOD runs
- grade-by-grade public pay scales

Do not add a fourth case, or move any default, until Stephen has seen that evidence.

## 6a. Candidate rate-based welfare case

Stephen asked for a benefit-by-benefit welfare gap built from published rate comparisons. It is in book/welfare_gap_rate_based_2026_10_29.md and research/paper_runs/rate_based_welfare.mjs, with `welfareGapPct` 4.256 and `welfareTaxOffset` 6.81 alongside Doyle's pay settings.

Add it as a fourth named preset, `rateBased`, but do not make it a default or relabel the middle case until Stephen decides.

## 7. Other documents affected

The Claude Doc briefing for the Tánaiste and the reunification paper (now version 3.5, tracked changes over Stephen's 3.4) have been or will be updated by Claude. Keep the numbers in documents/brief_v2.md consistent with section 5 once rebuilt.
