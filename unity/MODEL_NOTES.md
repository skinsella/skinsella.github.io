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

Relative Northern output is calculated from Northern growth divided by Southern growth. The output gain is multiplied by a fixed 35 per cent revenue share. This is a reduced-form revenue calculation rather than a general-equilibrium fiscal model.

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
- Scenario labels are stylised bundles, not institutional estimates

Annual break-even means the annual simulated balance first reaches zero. Cumulative payback means later simulated surpluses offset all earlier deficits. Neither means income convergence.
