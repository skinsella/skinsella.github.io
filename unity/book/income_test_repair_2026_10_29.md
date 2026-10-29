# Fiscal assessment after the income-test review

This revision implements the reporting boundary in Claude’s latest specification and brief. The public model now reports three fiscal checks, not an overall verdict on whether reunification is economically favourable.

## What changed

The output-plus-transfer income proxy has been removed. Neither a larger fiscal transfer nor a higher growth input supplies an income-test pass.

Household earned income remains null and unassessed. NI output per resident and the fiscal transfer per resident are separate diagnostic fields rather than substitutes for household income.

The specification also proposes subtracting net fiscal transfers from Northern output. That operation does not construct household earned income, so it has not been implemented as an income measure.

CSO describes disposable household income through wages, self-employment, property income, benefits and transfers, less household payments. The fiscal model does not contain that household account or the information needed to separate those flows reliably.

The research data now separate capital, trade and net FDI output terms from the assumed growth gap. The trade term includes the Republic border term and GB friction, while net FDI subtracts Republic displacement.

The capital term compares output with a second core run in which programme and EU-funded capital are removed. Chosen growth, wages, demand settings and other inputs remain fixed, so the mechanical output difference is not counted twice through induced jobs or private capital.

The total output difference reconciles to the assumed growth gap, the three separate channel terms and other residual effects. Uncalibrated channel terms remain experiments and do not pass an economic test.

## What remains unchanged

Annual fiscal costs, borrowing, repayment, pension and interest allocations are unchanged. The new checks compare all old fiscal fields and the three fiscal classifications across the existing scenario grid.

The annual burden limit remains 2% of GNI* with 1% and 3% sensitivities. The baseline debt overlay retains the published Budget 2027 ratio schedule and the chosen 80% comparison ceiling.

The direction check retains the existing strict interpretation, including the change from year 19 to year 20. The open decision has not been resolved by changing the rule to make Federal pass at 3% growth.

The four-of-five rule remains recorded for future use once all economic tests can be measured. It is not applied to the three fiscal checks, and no favourable classification is currently available.

## Verification

Regression checks retain all original fiscal fields and classifications across the existing design, growth and liability grid. Additional checks ensure that transfers, welfare increases and assumed growth cannot pass an economic test.

Synthetic mechanism checks verify the channel decomposition, GB losses, Republic FDI displacement, the capital counterfactual and full output reconciliation. These synthetic inputs test arithmetic rather than provide calibration evidence.

## Sources

- [Latest specification](model_spec_benefits_2026_10_29.md)
- [Decision register](decision_register.md)
- [CSO Household Gross Disposable Income](https://www.cso.ie/en/interactivezone/statisticsexplained/nationalaccountsexplained/householdgrossdisposableincome/)
- [ECB GDP, output, demand and income](https://data.ecb.europa.eu/methodology/gdp-output-demand-and-income)
