# Model notes

## Purpose

The model shows how results change under alternative assumptions. It does not estimate the probability of a settlement or growth path. Euro outputs are in constant 2023 prices.

## Accounting

The core inherited deficit is the published deficit less defence, other non-identifiable spending, additional attributed revenue, pensions and debt interest. Current inputs produce €1.74 billion.

Annual net cost adds liabilities borne by Dublin, pension transition, rerating, investment and duplication to the age-adjusted core deficit, then subtracts structural erosion and convergence-related revenue.

## Pension interpretation

The supplied briefing says UK pension obligations would remain with the UK while Irish responsibility transferred gradually as new contributions accrued. When the UK retains legacy liabilities, year `t` therefore includes the following transition cost.

```text
min(t × €0.115 billion, €6.67 billion) × ageing factor
```

This replaces the earlier flat €115 million annual charge. It remains a study-dependent interpretation and should be revised if the underlying report provides a different stock-flow schedule.

## Growth channel

Relative Northern output per worker is calculated from Northern productivity growth divided by Southern productivity growth. A separate employment gain is applied only when explicitly selected and defaults to zero to avoid building an employment dividend into the central path. The output gain is multiplied by a fixed 35 per cent revenue share. This is a reduced-form revenue calculation rather than a general-equilibrium fiscal model.

The default is now a prudent one percentage point Northern productivity premium. The historical scenario uses the 1.3 per cent Northern growth average for 2000 to 2024 reported by Doyle and UUEPC. The two percentage point conditional-convergence benchmark is retained as an upside scenario rather than the central case.

## Financing consistency

Interest on opening transition debt is included in annual gross cost, annual net cost and cumulative fiscal cost. Positive net costs are then divided between borrowing and contemporaneous tax funding. The debt stock increases only by the borrowing share because the interest component has already entered the annual cost. Modelled surpluses reduce the debt stock.

## Fiscal bridge and services

The bridge from the ONS Northern net fiscal balance to the inherited core is stored explicitly in `FISCAL_BRIDGE`, with each adjustment labelled as official-derived, study-derived or negotiation-dependent.

Health, education, social protection and general public-services bases now use ONS 2022 to 2023 identifiable expenditure for Northern Ireland. They are converted at the model's common £1 to €1.165 rate. The service uplift controls apply explicit percentage additions to those bases. Their default is zero because no defensible service-quality target or unit-cost gap has yet been estimated. Welfare and public-pay harmonisation remain in the separate rerating module. A separate one-off transition envelope is available and also defaults to zero pending a sourced implementation plan.

The expanded service module separates outcome-gap closure targets from the assumed cost per percentage point of gap closure. Unit-cost anchors use ONS spending divided by the relevant NISRA population. Targets remain zero by default.

The tax-funded share now produces a lagged output and revenue loss through an editable multiplier. Transition investment enters a lagged, depreciating productive stock and returns additional taxable output. Both channels are stress mechanisms rather than structural macroeconomic estimates.

Negotiated pension and debt responsibility now use continuous UK shares rather than binary switches. The pension schedule uses the study's €115 million annual increment over a default 40-year accrual period for the UK-retained legacy share.

The one-off transition envelope is allocated across legal, digital, payment-system, institutional and contingency workstreams. Its default remains zero until departmental estimates exist.

Northern demography now starts from 21 NISRA 2024 five-year age bands. The Southern side remains a broad-cohort scenario, so the support ratio is still less robust than the Northern service-cost indices.

## Author calibrations

- Thirty-five per cent of the core deficit is age-sensitive
- Structural adjustment completes over 30 years
- Relative Northern output is capped at twice its starting level
- A stalled path falls to 0.4 per cent annual relative growth after year seven
- The revenue share remains fixed at 35 per cent

These require sensitivity testing and must not be represented as empirical findings.

## Advanced model

The advanced model adds three population cohorts for the North and South, disaggregated revenue and public services, and an explicit financing account. It also provides coherent scenario presets and one-at-a-time sensitivity tests.

The population block is stylised. Children enter working age over sixteen years, working-age people retire over forty-nine years, and the older cohort exits according to an assumed remaining lifetime. Migration is allocated across the three cohorts. These equations are scenarios rather than official projections.

Revenue gains are allocated across labour, consumption, corporation, and property and other taxes using transparent calibration shares. The inherited core deficit is allocated across health, education, welfare, and administration and scaled by the relevant cohorts.

## Limitations

- Pension and debt treatment are negotiation outcomes
- Northern GDP is compared with Irish GNI*
- Rerating remains fixed in 2023 euros
- The three-cohort population block does not replace a single-year-of-age projection
- Marginal public-service costs and behavioural responses are omitted
- Transition investment has no estimated supply-side return
- Service uplift percentages and the one-off transition envelope are scenarios, not empirical estimates
- Contemporaneous tax funding has no behavioural or macroeconomic feedback
- Scenario labels are stylised bundles, not institutional estimates

Annual break-even means the annual simulated balance first reaches zero. Cumulative payback means later simulated surpluses offset all earlier deficits. Neither means income convergence.
