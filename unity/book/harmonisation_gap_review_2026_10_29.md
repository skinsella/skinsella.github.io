# Harmonisation gap review

Prepared 29 October 2026 after Stephen questioned the year-one gain of about €6,600 per Northern Ireland resident under Unitary. The figure is larger than the whole household income gap with the Republic, about 2,500 PPS per person in 2023, so the harmonisation inputs were traced to source.

## What the model was using

The gap comes from FitzGerald and Morgenroth (2024), Table 6, for 2019. Pay rises by £4.306bn on a pay bill of £6.797bn, a 63% increase. Welfare, including pensions, rises by £4.809bn on £9.615bn, a 50% increase.

F&M compute the pay increase from the ratio of average public sector earnings, CSO EHECS against NISRA ASHE. They compute the welfare increase by applying the ratio of average pension payments to all welfare.

Both increments are gross, and F&M give no tax offset. The model's 6.5% "net recovery" was the difference between F&M Table 7 (£18.104bn less £9.577bn) and the Table 6 gross total (£9.115bn). F&M's totals do not reconcile, so the 6.5% is an unexplained table difference, not a tax estimate.

## Why it is likely to overstate the cost

1. **Pay.** Average earnings are not like-for-like grades, and the comparison is at market exchange rates. Doyle (2025) uses a 48% gap and costs equalisation net of taxes and contributions at €152m more each year for 15 years.
2. **Welfare.** A pension ratio is applied to child benefit, Universal Credit and disability payments. Tomlinson (2022) costs the Irish system for Northern Ireland and finds social security spending about £3.3bn below the current outturn, with the UK keeping state pensions.
3. **Tax.** Pay rises and some benefits would be taxed under the Irish system, and none of this is counted.

## Model change, commit on 29 October 2026

Four structural inputs are added to `simulator/scenario_model.mjs` and the JSX copy: `payGapPct`, `welfareGapPct`, `payTaxOffset` and `welfareTaxOffset`. All default to null, which reproduces the F&M treatment exactly, so every published result is unchanged.

The gaps are percentages of the F&M 2019 pay and welfare bills. The offsets are the shares of each gross increase returned through tax, social insurance and benefit withdrawal.

Tests in `scripts/test_component_model.mjs` check that explicit settings reproduce the default, that offsets apply once to each component and that invalid values are refused. The fiscal cases and model reference were rebuilt for the new fingerprint, with no change to any result.

## Sensitivity cases

Run with `node research/paper_runs/harmonisation_cases.mjs`. All use 2% Northern Ireland growth and the favourable deal.

| Case | Managed Integration year 25, €bn | Total debt in year 25, % of GNI* | Growth needed to repay |
| --- | --- | --- | --- |
| A. F&M as now | 24.0 | 135.6% | 4.6% |
| B. F&M gross, no offset | 25.5 | 140.2% | 4.7% |
| C. Doyle 48% pay gap, F&M welfare, no offset | 23.1 | 132.7% | 4.5% |
| D. Doyle pay gap net of tax, F&M welfare | 19.3 | 121.2% | 4.5% |
| E. Doyle pay net of tax, no welfare gap | 5.3 | 80.5% | 3.1% |

Case D sets the pay tax offset at 48.8%, calibrated so net pay at parity equals Doyle's 15 × €152m. Doyle's price basis is not verified. Case E is a lower bound in the direction of Tomlinson, not an estimate.

The welfare gap drives the result. Pay changes move the year-25 cost by a few billion, while removing the welfare gap cuts it from about €19bn to about €5bn.

## Decisions for Stephen

1. Which case is central in the paper and the Tánaiste brief, or whether both show F&M as an upper bound beside a lower case.
2. Whether to commission a benefit-by-benefit costing of the welfare gap, run through a tax-benefit model, before either document is final.

## For Codex

The story, benefits and brief builders still use the F&M default. Expose the four inputs on the specialist page with the F&M default labelled "upper bound, gross", and do not change any default until Stephen decides.
