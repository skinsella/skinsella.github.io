# Feasibility improvements after the model audit

The simulator now distinguishes the cost of a programme from an optional productive-capital experiment. It can also solve the negotiated UK payment needed for repayment while holding the reader's growth and other policies fixed.

These changes help identify conditional routes to feasibility without assigning a reunification growth dividend or changing the agreed frozen fiscal baseline. No new trade, FDI, integration-savings or EU calibration has been invented.

## What the reader can test

The Four futures section includes a programme-capital share, initially zero. Raising it enables the existing capital channel with the registered delivery efficiency, lag, depreciation and external elasticity.

The default remains a cost-only comparison because the programme portfolio is not yet identified. The external private-output elasticity is used only as an aggregate-output experiment, not an NI treatment estimate or project appraisal.

The growth section now solves the smallest hypothetical UK payment needed for repayment within the reporting horizon. The payment follows the existing ten-year declining schedule and the search stops at the registered 50% bound.

The solved payment is a requirement rather than an expected settlement or an estimate of UK savings. The table reports both its first-year percentage and euro amount.

## A conditional route for Managed Integration

Under the saved favourable liability settlement, accepted deductions, 15-year alignment and 4.5% NI growth, Managed Integration has €4.5bn transition debt left at year 25 without support. The solver finds that a first-year UK payment of 3.2% of the frozen transfer, about €0.55bn, declining over the existing schedule, brings repayment to year 25.

This leaves growth optimistic and the settlement favourable. It demonstrates a negotiated funding requirement under those assumptions, not that either condition is likely.

In a separate experiment, assigning the whole programme envelope to capital under the existing response settings also brings repayment to year 25. That is an experiment limit, not a recommendation to classify all programme spending as capital or evidence that its return has been estimated.

At 2% growth, the tested UK payment range does not deliver Managed Integration repayment. The model retains that result instead of silently weakening spending indexation.

Exact settings and numerical results are saved in [the check record](../data/feasibility_repair_checks.json). The default fiscal paths remain unchanged and regression checks still match the earlier paths.

## Repairs to confirmed defects

Shared settings are schema-checked before rendering. Imported values are assigned through DOM properties rather than interpolated into HTML.

Engine input domains are enforced for residual shocks, timing, finance and funds, with a guard against non-finite results. These are engineering limits, not empirical uncertainty intervals.

Paired exports now compare every structural input used by the UK fiscal and output path and require equal horizons. The same-path claim can no longer be satisfied by matching only headline growth and purchases growth.

Fiscal classifications require a complete annual sequence through at least year 25. Short or incomplete runs leave all three checks unassessed.

Repayment now requires cumulative costs to remain repaid through the reported horizon. An always-surplus path is recognised, while an all-zero comparison is not reported as a repayment event.

Endogenous migration is unavailable in the engine and its interactive controls are removed. Official projection volumes remain, while the experimental migrant account stays closed until people, output, receipts and services can be reconciled.

## Remaining limits

The public-pay equation still needs a wage and staffing model rather than a reference-relative aggregate-output rule. Capital experiment gains do not yet feed back into that pay rule, and the public caption states this.

Historical component budgets, the source currency and year ambiguities, pension cohorts and an inherited debt stock remain unresolved. The Republic debt overlay is still a conditional comparison rather than a sovereign financing forecast.

None of those gaps has been filled with a favourable invented estimate. Household income and overall economic benefit remain unassessed.

## Verification

The current accounting, linked-mechanism, story-maths and benefits tests pass. New checks cover imported HTML, wrong input types, extreme domains, truncated horizons, mismatched UK paths, repayment reversals, support-solver boundaries and the optional capital effect.

The original audit has frozen reviewed executables beside its probes. Its old vulnerabilities can be reproduced without pretending they remain in the repaired code.

## Sources

[Saved model calculations](../data/feasibility_repair_checks.json)

[Current fiscal reference](../simulator/model_reference.html)

[Current extension source register](../simulator/benefits_reference.json)

The original audit is retained in the research archive.

[Bom and Ligthart public-capital meta-analysis](https://onlinelibrary.wiley.com/doi/10.1111/joes.12037)
