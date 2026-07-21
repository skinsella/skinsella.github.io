# The Price of Unity technical methodology

## Scope

The Price of Unity is a deterministic fiscal scenario engine with a separate structured-uncertainty layer. It is not an official forecast, a probability model of constitutional change or a welfare assessment of unity.

The model answers a conditional question. Given a settlement, productivity path, policy sequence, demographic path and financing strategy, what annual fiscal flows and transition-debt path follow from the stated accounting rules?

## Two counterfactual lenses

The model reports two distinct comparisons.

1. Irish Exchequer incidence compares the simulated fiscal cost borne by Ireland after unity with the direct Irish Exchequer cost under the constitutional status quo
2. Northern resource balance estimates the continuing gap between Northern public expenditure and revenue under the status quo, financed within the UK fiscal system

These concepts must not be subtracted without explanation. A UK-financed Northern deficit is a real resource transfer but is not a current Irish Exchequer liability.

## Fiscal bridge

The inherited fiscal core begins with the ONS Northern net fiscal balance and applies separately documented adjustments for defence, non-identifiable and outside-UK expenditure, tax re-attribution, pensions and debt interest.

Pensions and debt are settlement variables. The model permits the UK responsibility share to vary continuously between zero and 100 per cent.

## Annual unity account

Annual primary transition cost includes the inherited core, service additions, pay and welfare rerating, pensions borne by Ireland, debt-interest allocation, transition investment, administrative duplication and one-off implementation costs.

Revenue effects include convergence revenue, the fiscal return from mature transition investment and the revenue loss associated with tax-funded output effects.

Interest on opening transition debt is included before the annual balance is divided between borrowing and contemporaneous taxation.

## Status-quo baseline

The Northern status-quo baseline begins with ONS 2022 to 2023 revenue and managed expenditure. Health, education and social protection are projected separately using demographic indices and editable real-growth assumptions. Other managed expenditure follows population and its own real-growth rate. Revenue follows population, productivity and an editable elasticity.

This is a transparent baseline scenario rather than an official UK forecast.

## Productivity and employment

Northern productivity growth is modelled relative to Southern productivity growth. Additional employment convergence is a separate input and defaults to zero in the prudent path to reduce double counting.

The relative-output index is capped. This prevents indefinite revenue growth from a fixed convergence differential.

## Tax feedback

Contemporaneous tax funding reduces output with a one-year lag. The output effect equals tax funding multiplied by an editable fiscal multiplier. The associated revenue loss uses the common revenue share.

The default multiplier is a stress calibration informed by Irish Fiscal Advisory Council research. It is not a structural estimate for constitutional change.

## Transition investment

Investment enters a delivery pipeline. After the selected lag it enters a productive capital stock, depreciates annually and generates an editable output return. The revenue share converts that output gain into a fiscal return.

Capital spending, productive assets and current spending remain separately identifiable in the annual output.

## Services

Health, education and administration use ONS identifiable expenditure as their spending bases. Each service separates an outcome-gap target from the cost per percentage point of gap closure. Welfare and public-pay harmonisation remain within the rerating module.

Outcome targets default to zero because the project does not yet possess an approved comparable-outcomes dataset or departmental marginal unit costs.

## Pensions

The pension module distinguishes transferred legacy responsibility from new Irish-system accrual. New responsibility accumulates using the study-derived annual increment over an editable accrual period. The schedule is provisional pending actuarial validation.

## One-off implementation plan

Any selected one-off envelope is allocated across legal and treaty work, digital and data migration, tax and benefit systems, institutional integration and contingency. The envelope defaults to zero until departmental workstreams provide costed plans.

## Demography

Northern demography begins with the 21 five-year age bands in the NISRA 2024-based principal projection. Bands advance annually using ageing, age-specific mortality and age-weighted migration. Southern demography remains a broader cohort model pending a harmonised five-year dataset.

## Financing and fiscal rules

Positive annual costs are divided between borrowing and contemporaneous taxation. Surpluses reduce transition debt. The fiscal-rules view reports annual cost, transition debt and tax funding relative to the Southern GNI-star denominator.

The displayed two per cent annual-cost and ten per cent transition-debt thresholds are stress indicators, not official legal limits.

## Structured uncertainty

The uncertainty engine uses seeded correlated draws. A common macro factor links Southern growth, Northern convergence, financing rates and fiscal multipliers. A settlement factor links pension and debt responsibility. A delivery factor links implementation costs and rerating pressure.

Ranges are structured judgement intervals. They are not estimated statistical distributions. Percentages of draws must therefore not be described as objective probabilities.

## Validation

The validation page distinguishes source reproduction, accounting identities, external projection benchmarks and genuinely unvalidated behavioural relationships. Passing a source-reproduction check is not evidence that the behavioural model is predictive.

## Reproducibility

The replication package includes

- Source and transformation register
- Parameter governance register
- Scenario results
- Structured uncertainty summary and draws
- Audit JSON
- Automated regression tests
- Public model engine and interfaces

## Known limitations

- No general-equilibrium trade, currency or financial-sector model
- No actuarially certified pension projection
- No legal determination of settlement liabilities
- No approved service outcome and marginal-cost dataset
- No behavioural household-distribution module yet
- No independently estimated probability distributions
- No full Southern five-year demographic block
- No independent external replication yet

## Interpretation rule

Every reported number should be stated conditionally. The required form is that under the displayed settlement, growth, service, demographic and financing assumptions, the model produces the reported fiscal path.
