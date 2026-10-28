# Managed Integration over 25 years

These are conditional fiscal feasibility examples. Their growth, revenue and negotiated-settlement assumptions are selected hypotheses, not estimated causal effects or a guarantee of viability.

## Two different tests

Annual balance means that the Republic no longer makes a net annual payment including transition interest. Cumulative payback requires later surpluses to repay the preceding financing-inclusive costs and is not the same as annual balance.

A path with annual balance and falling transition debt can be financially manageable within the horizon while retaining an overall transition cost. Whether that cost is justified requires a welfare assessment outside this model.

## The two explicit examples

Both retain full harmonisation over fifteen years, additional expenditure of €1.5bn annually during the first ten years and a recurring €0.25bn duplication allowance. Neither example counts a linked capital or consumption dividend in addition to its selected output-growth path.

Both assume UK retention of accrued pension liabilities with funding transferred over forty years, UK retention of the allocated interest flow, and acceptance of all study defence, central-spending and revenue adjustments. These are favourable negotiated conditions, not legal findings.

The NI reference real output path grows at 2.5%, the assumed marginal revenue share is 35%, and real transition interest is 2%. Baseline gross receipts and spending are constant in real terms, and no fund endowment or external transition grant is added.

| Example | NI real growth | Year-one annual cost | Year-ten annual cost | Year-25 annual cost | Cumulative cost to year 25 | Present value to year 25 | First annual balance | Cumulative payback |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Negotiated-growth illustration | 4.5% | 4.0 | 7.1 | -9.9 | 66.1 | 61.5 | Year 20 | Year 30 |
| Stronger-growth illustration | 5% | 3.8 | 5.0 | -21.1 | -36.8 | -9.9 | Year 16 | Year 24 |

Amounts are €bn in constant 2023 prices, with negative costs indicating surpluses and cumulative totals including interest without discounting. Present value discounts those financing-inclusive costs at the selected 2% real rate and is not a social welfare valuation.

The negotiated-growth illustration still carries €66.1bn of transition debt at year 25, approximately 12.3% of that year’s Republic GNI*. Its debt stock peaks in year 19 and then falls under the maintained assumptions.

## Required growth, not a forecast

The thresholds below solve the existing equations backwards while retaining the same favourable settlement and marginal revenue share. Growth rates are rounded upward for display and do not imply empirical precision.

| Real growth of baseline receipts and spending | NI growth required for annual balance by year 25 | NI growth required for cumulative payback by year 25 |
| --- | --- | --- |
| 0% | 4.03% | 4.83% |
| 1% | 4.33% | 5.16% |
| 2.5% | 4.87% | 5.72% |

The receipt and expenditure paths matter materially, so a successful result under a flat real baseline is not sufficient evidence that the scenario is robust. Higher service spending, weaker receipts, less favourable negotiations or a lower marginal revenue response can remove the apparent payback.

## Negotiated terms sensitivity

These thresholds retain a flat real fiscal baseline and a 35% assumed marginal revenue share. Only the negotiated settlement varies.

| Settlement | Required NI growth for annual balance | Required NI growth for cumulative payback |
| --- | --- | --- |
| none | 4.91% | 6.58% |
| pensions_and_interest | 4.36% | 5.44% |
| all_study_adjustments | 4.03% | 4.83% |

## Revenue response sensitivity

No marginal revenue coefficient has been estimated for Northern Ireland in this project. The following are chosen sensitivity values under the favourable settlement and flat real fiscal baseline.

| Assumed marginal revenue share | Required NI growth for annual balance | Required NI growth for cumulative payback |
| --- | --- | --- |
| 25% | 4.52% | 5.56% |
| 30% | 4.24% | 5.14% |
| 35% | 4.03% | 4.83% |
| 40% | 3.86% | 4.58% |

## Evidence requirements and reproduction

The examples establish what would be sufficient inside the equations, not that the conditions will occur. The next empirical work is to validate the fiscal vintage and output anchor, estimate marginal receipts and gross service-spending paths, and justify achievable growth against an explicit UK counterfactual.

The annual and debt recurrences were checked independently for the restricted case, and the growth thresholds were checked on both sides of each boundary. The complete settings, alternative fiscal paths, interest sensitivities and annual outputs are in [managed_integration_viability.json](../data/managed_integration_viability.json).

The two exact scenario downloads are [negotiated growth](../data/managed_integration_negotiated_growth_run.json) and [stronger growth](../data/managed_integration_faster_growth_run.json). Each can be reproduced with scripts/reproduce_run.mjs against the matching model fingerprint.

## Sources

- [Executable model](../simulator/scenario_model.mjs), [model reference](../simulator/model_reference.html) and [calibration](../data/simulator_calibration.json)
- [Doyle 2025 supplied full text](https://all-islandeconomy.com/wp-content/uploads/2025/06/21614_Public_Finances_UPDATED.pdf), used for the negotiated-settlement discussion and growth-scenario context, not a direct replication of his projections
- [FitzGerald and Morgenroth 2024](https://www.iiea.com/images/uploads/resources/Northern_Ireland_Subvention_Possible_Unification_Effects.pdf), source harmonisation benchmark and alternative liabilities
