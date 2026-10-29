# Decision register

This register separates settled working conventions from choices that still require Stephen's decision.

## Settled working conventions

| Decision | Position | Reason |
| --- | --- | --- |
| Repository | `skinsella/UI` is the canonical project home | Keeps research, model, drafts and provenance together |
| Model status | Scenario tool, not forecast | Outcomes depend on constitutional design, negotiation and policy choices |
| Transparency | Expose assumptions, sources and ranges | Allows criticism to be directed at identifiable parameters |
| Fiscal denominator | Use GNI star for the Republic | Avoids distortion from multinational activity in headline GDP |
| Negotiated items | Keep pensions and UK debt as switches | Responsibility cannot be known in advance |
| Evidence discipline | Unverified values remain excluded or clearly labelled | Prevents provisional numbers becoming facts through repetition |
| Private material | Do not publish raw private chats | The useful output is the documented decision and its provenance |
| Success tests, 29 October 2026, Stephen | Northern resident income and island output higher than on the UK path by year 15, Republic total debt below 80% of GNI\* in every year, yearly transfer falling from year 20, yearly transfer no more than 2% of GNI\* in every year with 1% and 3% as sensitivities | Fixed before any favourable scenario is run. Affects book/model_spec_benefits_2026_10_29.md |
| Income tests redefined, 29 October 2026, Stephen | Northern living standards uses income earned in the North, excluding net fiscal transfers. Island prosperity counts only output gains from a modelled channel, not the growth input. No scenario is called favourable until both are measured this way, and the brief reports the three fiscal tests only | As first built, the Northern test passed in every future because the transfer counted as a gain, and the island test only repeated the growth assumption. Affects book/model_spec_benefits_2026_10_29.md, simulator/benefits_model.mjs and documents/brief_v2.md |
| Pass rule, 29 October 2026, Stephen | A scenario is favourable if it passes four of the five tests | Full repayment is not required, in line with how German unification is judged. Affects book/model_spec_benefits_2026_10_29.md |
| Baseline Republic debt, 29 October 2026, Stephen | Follows Budget 2027 and Department of Finance projections, then holds steady. Total debt including transition borrowing may rise to 80% of GNI\* | Leaves about 24 points of headroom from a baseline near 56%. Replaces an earlier same-day rule allowing the baseline to reach 70%. Affects book/model_spec_benefits_2026_10_29.md |

## Benefits extension implementation decisions

Stephen explicitly confirmed publication of the 2% annual burden rule, the 1% and 3% sensitivities, and the completed model on 29 October 2026. This direct confirmation also authorises finishing the archive push.

Confirmed by Stephen on 29 October 2026 before extension results. Adopt the proposed comparison dates and debt ceiling, retain the recorded four-of-five pass rule, with the annual burden threshold subsequently fixed in commit `e59d454` at no more than 2% of Republic GNI* each year and 1% and 3% sensitivities.

Use the Budget 2027 debt ratios for 2027 to 2030, then hold the final ratio constant. Apply those ratios to the model’s real GNI* denominator rather than adding nominal 2027 debt to constant 2023 euro borrowing.

The new comparison uses the same official demographic normalisation as the existing engine. Budget years index the baseline ratio schedule only, so this remains a hybrid scenario rather than a calendar-year fiscal forecast.

An unassessed test is never counted as a pass. The agreed four-of-five rule applies across all five tests, and a comparison using an income proxy cannot establish household welfare.

The model follow-up reports only the three fiscal checks and leaves earned household income unassessed. GDP plus or minus a regional fiscal transfer is not used as an income estimate, and assumed growth is separated from mechanical channel output terms.

The existing strict direction rule is retained pending the open decision below. No overall favourable classification is currently reported.

## Decisions required

| Priority | Decision | Current position | Consequence of delay |
| --- | --- | --- | --- |
| 1 | Choose the book's scenario architecture | Five proposal scenarios and four simulator forms do not align | Model, chapters and public explanation continue to diverge |
| 2 | Confirm one price basis | The brief uses strict 2023 euros while part of the simulator uses an older basis | Headline results differ by about 2.9 per cent |
| 3 | Define the UK Path baseline | Not yet represented in the current simulator | Other scenarios lack a clean status quo counterfactual |
| 4 | Set standards for convergence tests | Three tests exist but thresholds and data vintages are not fixed | Sequencing claims remain qualitative |
| 5 | Decide the public release model | Password protected preview exists, while long term access is unsettled | Reproducibility and public engagement remain limited |
| 6 | Decide how to treat general equilibrium effects | Current framework is mainly structural accounting with selected feedbacks | Behavioural claims may exceed the implemented model |
| 7 | Define "falling from year 20" | Code requires year 20 to be below year 19, the earlier brief draft did not | Federal at 3% growth passes or fails the direction test depending on the reading |
| 8 | Choose the central harmonisation case | Model default is F&M 2024 gross gap, which likely overstates cost. Lower cases in book/harmonisation_gap_review_2026_10_29.md | Every headline cost in the paper and brief depends on it |

## Rule for closing a decision

A decision is closed only when the chosen option, date, owner, rationale and affected files are recorded here. Changes to numerical conventions must also update the simulator, derived data, charts and narrative documents in the same commit.

## Sources

- `AGENTS.md`
- `book/scenario_mapping.md`
- `chats/codex_project_history.md`
- `README.md`

The harmonisation implementation now reports the upper, middle and lower cases together. The initial upper view removes the unsupported table-difference offset, while decision 8 on a central case remains open.

The rateBased candidate is a separate sensitivity under the updated implementation note. It does not replace middle or resolve the central-case decision.
