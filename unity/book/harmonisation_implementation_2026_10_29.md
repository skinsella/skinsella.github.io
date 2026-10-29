# Harmonisation correction and next modelling priorities

The supplied Codex note is implemented as three principal harmonisation cases, a separate rate-based candidate and a custom path. The unsupported Table 7 offset has been removed from all named cases and no central calibration has been selected.

The initial view shows the upper gross case as an explicit sensitivity. This replaces the erroneous inferred-tax treatment and does not designate upper as a best estimate.

## Shared definitions

Upper uses the F&M Table 6 gross gaps with no tax offset and is labelled likely overstated. Middle uses the specified Doyle pay gap and calibrated offset, with F&M gross welfare.

Lower uses the same Doyle pay calibration with zero welfare gap. It is a bound rather than an estimate or a replication of Tomlinson.

The Doyle offset is calculated from the exact historical pay bill and the supplied 15 × €152m calibration. Its price basis remains unverified wherever middle and lower are reported.

Named cases override the custom fields. The custom path accepts separate pay and welfare gaps and offsets, with zero automatic offset when a custom offset is null.

The old results can be reproduced only through explicitly supplied custom offsets in regression tests. Their value is an unsupported Table 6 and Table 7 reconciliation difference, not tax evidence or an additional public case.

## Rate-based candidate

The latest section 6a adds a fourth preset named rateBased, without replacing middle or making the candidate a default. It combines the specified Doyle pay settings with a welfare gap derived from the supplied pension and child-benefit components.

The pension price basis is unverified, and the candidate does not cost all older pensions, Irish extra benefits, benefit taxation or eligibility changes. It is a published-rate sensitivity rather than a complete programme costing.

## Outputs

The story has a harmonisation switch and a table showing all cases under the same chosen design, growth and negotiated terms. Switching cases updates the annual paths, repayment thresholds, support solver and fiscal checks.

The specialist and additional-assumptions pages also show all cases. Saved scenarios, fiscal case files, paired benefit exports, the generated brief and its calculation ledger retain the separate case settings and results.

The model reference and diagram use explicit case-specific offsets. Superseded fixed-envelope viability and indexation scripts have been archived and their old entry points no longer generate current results.

## Reproduction and one rounding correction

The tests reproduce the supplied paper results for Managed Integration in all three cases. They also verify gross bounds, zero gaps, the upper gross treatment, rejection of invalid cases and custom reproduction of historical results.

The middle growth threshold for all fiscal checks is about 3.642% in the supplied paper calculation. A rate rounded upwards to a sufficient tenth is 3.7%, while 3.6% is only a nearest-tenth description and does not pass.

The full generated figures and exact settings are in [the brief calculation record](../data/brief_v2_model_checks.json). The published tables report thresholds consistently rounded upwards.

## Further improvements proposed

Per-resident harmonisation expenditure is not a household disposable-income gain. Do not validate it against a PPS disposable-income gap, because the coverage, fiscal incidence and price concepts differ.

The rate-based pension and child-benefit components should next be kept separate, with older-person and child caseload volumes rather than one aggregate welfare index. Their sum currently enters the requested welfare-gap sensitivity, which is not a programme-level projection.

The next priority is benefit-by-benefit harmonisation using matched NI households and the Republic tax-benefit system. Separate state and occupational pensions, retirement cohorts, taxable benefits, eligibility and service entitlements before narrowing the welfare range.

Public pay needs matched grades, hours, staffing and employer contributions. Average-earnings differences should not be treated as the cost of matching identical jobs.

Replace the calibrated aggregate tax offset with explicit income-tax, social-insurance and benefit-withdrawal calculations. Reconcile those receipts with the separate accepted tax adjustment and marginal growth receipts to prevent overlap.

The public-pay response still needs to separate staffing, productivity and wages. It should treat growth from capital, trade and other sources consistently rather than excluding some channels from the pay feedback.

Inherited debt should be an explicit negotiated payment schedule or a debt stock with maturities, and Republic baseline debt needs a consistent fiscal recurrence. The existing interest-duration switch and debt-ratio overlay remain limited sensitivities.

Keep productive investment experimental until programme costs, capital shares, maintenance and delivery capacity are identified. No favourable central estimates have been invented to fill those gaps.

## Sources

[Supplied implementation note](codex_note_harmonisation_2026_10_29.md)

[Harmonisation evidence review](harmonisation_gap_review_2026_10_29.md)

[Rate-based welfare candidate](welfare_gap_rate_based_2026_10_29.md)

[Current model reference](https://stephenkinsella.net/unity/model_reference.html)
