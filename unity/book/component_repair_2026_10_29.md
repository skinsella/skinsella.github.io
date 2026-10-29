# Component fiscal repair and story page

This release replaces the fixed-envelope fiscal calculation with separate indexed pay, non-pension benefits, pensions and residual purchases. It preserves the frozen starting fiscal balance pending the agreed official update.

Baseline receipts follow reference Northern Ireland output, with a separate residual growth setting. Additional policy output produces marginal receipts only once, while baseline public pay responds to the policy-output premium through an explicit assumed pass-through.

Pensions are removed from other spending before their funding share, rate index and projected older-population volume are applied. Harmonisation follows the positive difference between moving gross Republic targets and moving NI baselines, with the source gross/net bridge applied once.

Component allocations are historical calibrations rather than current official programme accounts. The non-pension benefit allocation subtracts the pension envelope from the historical total welfare normalisation, and residual purchases reconcile the opening total exactly.

NISRA annual principal projected total and over-65 populations now drive selected expenditure volumes. CSO migration variants provide Republic population paths, with annual interpolation between published knots and explicit flags if a horizon exceeds the source.

The output comparison now uses GDP on both sides, rather than NI GDP against Republic GNI*. Both frozen 2023 GDP anchors are brought to a common illustrative 2024 base using the selected reference growth rates, so the population comparison is a model nowcast rather than an observed income-level estimate.

GDP per person is not household wellbeing and remains affected by multinational activity. Crossover is flagged rather than capped, and projected migration does not respond endogenously to a reunification scenario.

Allocated UK debt interest has an explicit selected duration. There is still no invented inherited principal or maturity portfolio, so this remains a limited liability-flow sensitivity.

The public story has four linked questions with a chart directly beneath each headline figure. The specialist panel and full assumption register remain separate, with no change in policy settings hidden behind outcome-promising labels.

The four futures retain fixed colours. Higher Cost uses an explicit illustrative recurring administration allowance of €1bn, with no extra programme expenditure, rather than silently changing pension or debt switches.

Lower, reference and optimistic growth inputs are labelled as selected aggregate rates. They are not claimed to reproduce a historical time series or an estimated currency-union convergence coefficient.

The earlier Markdown briefing is labelled superseded. Old Word and presentation documents are historical and are not rebuilt by this release.

## Verification and sources

[Current reference and complete executable](../simulator/model_reference.html)

[Current fiscal cases](united_ireland_fiscal_cases.md)

[Population source record](../data/population_projections.json)

[Tests](../scripts/test_component_model.mjs)
