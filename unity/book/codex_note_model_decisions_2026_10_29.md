# Note for Codex on Stephen's model decisions of 29 October 2026

From Claude, for Stephen. This follows book/model_error_search_2_2026_10_29.md.

## 1. What Claude changed

Commit cb2675f, with tests passing.

| Change | Where | Effect |
| --- | --- | --- |
| Pension envelope starts from Doyle's £4.4bn | `PENSION_TOPUP_FALL` constant and structural input `pensionTopUpFall` (default £1.3bn × FY2022-23 factor) in `simulator/scenario_model.mjs` and the JSX copy | The fall comes off the pension envelope and the opening deficit together. The deficit left if the UK keeps both is unchanged. The harmonisation target uses the reduced envelope, so the welfare gap is unchanged |
| Debt check divides by State income | `simulator/benefits_model.mjs` | `totalDebtPctGNI` and `debtHeadroomPctGNI` now use Republic GNI* plus NI output after unity. New fields `stateIncome` and `totalDebtPctRepublicGNI`. The burden check stays on Republic GNI* |
| Tests | `test_component_model`, `test_benefits_model`, `test_feasibility_repair`, `test_harmonisation_cases` | Legacy comparisons pass `pensionTopUpFall:0`. The feasibility test now uses 4.3% growth, because 4.5% repays without UK support |
| Rebuilt outputs | reference files, runtimes, brief_v2, `four_cases_results.json` | Fingerprints and results updated |

## 2. Changes needed

1. **Reject conflicting harmonisation settings.** In `validateInputs`, throw when any of `payGapPct`, `welfareGapPct`, `payTaxOffset` or `welfareTaxOffset` is set and differs from the named case's value, unless `harmonisationCase` is `custom`. Add a test.
2. **Relabel the debt ratio everywhere.** The story page, benefits page, simulator page, `scripts/build_brief_v2.mjs` and model reference still say "Total debt / GNI*" or "total Republic debt". Use "total State debt, % of GNI* plus NI output" and keep "% of GNI*" for the burden check.
3. **Expose the pension setting.** Show `pensionTopUpFall` on the specialist page with the Doyle and HM Treasury source, and describe it in the model reference equations.
4. **Fix `scripts/build_reference.mjs`.** It already failed before this change ("Undocumented engine variables: components, extra, row"). Either document those variables or retire it in favour of `build_component_reference.mjs`.
5. **Do not build in two sourced items yet.** The 2024 GNI* outturn and an EU contribution line are sized in book/model_error_search_2_2026_10_29.md and await Stephen's decision.

## 3. Headline results to reproduce

Managed Integration, favourable deal, 2% Northern Ireland growth, 25 years.

| Case | Year 1, €bn | Year 25, €bn | Borrowing in year 25, €bn | Total debt in year 25, % of GNI* plus NI output | Debt check first fails | Growth to repay | Growth to pass all three checks |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Upper | 4.3 | 23.0 | 380 | 107.7% | Year 16 | 4.5% | 4.1% |
| Middle | 4.1 | 16.7 | 289 | 92.4% | Year 19 | 4.3% | 3.4% |
| Rate-based | 3.7 | 4.2 | 114 | 63.0% | Never | 3.0% | 2.0% |
| Lower | 3.6 | 3.1 | 99 | 60.5% | Never | 2.9% | 1.9% |

In the rate-based and lower cases Unitary, Managed Integration and Higher Cost pass all three checks at 2% growth. Federal fails only the falling-cost check, because its cost is still rising in year 20.
