# Current model connections

The component fiscal engine separates reference-linked receipts, public pay, non-pension benefits, pensions and residual purchases. The full description and source limitations are in [the component repair note](component_repair_2026_10_29.md).

```mermaid
flowchart TD
    SELECT["Scenario and negotiated terms"] --> SPEND["Pay, benefits, purchases and inherited interest"]
    SELECT --> HARM["Moving Republic pay and benefit targets"]
    SELECT --> GROW["NI policy and reference output paths"]
    POP["NISRA and CSO population projections"] --> SPEND
    POP --> PENSION["Indexed pension envelope and funding share"]
    GROW --> WAGE["Assumed output premium passed to public pay"]
    WAGE --> SPEND
    WAGE --> HARM
    GROW --> TAX["Reference-linked receipts and marginal policy receipts"]
    SPEND --> COST["Republic cost before transition interest"]
    PENSION --> COST
    HARM --> COST
    TAX --> COST
    EXTRA["Additional spending and duplication"] --> COST
    EXTRA --> ECON["Optional capital and demand experiments"]
    ECON --> TAX
    COST --> ANNUAL["Annual fiscal cost including interest"]
    FUND["Fund assets, returns, contributions and draws"] --> FIN["Financing, debt repayment and cash"]
    ANNUAL --> FIN
    FIN --> INTEREST["Interest on opening transition debt"]
    INTEREST --> ANNUAL
    ANNUAL --> BALANCE["Annual balance and cumulative payback"]
    FIN --> DEBT["Peak and remaining transition debt"]
    ROI["Republic GNI* path"] --> BURDEN["Cost and debt relative to GNI*"]
    DEBT --> BURDEN
    ANNUAL --> BURDEN
    GROW --> PERPERSON["Matched GDP per person and crossover flag"]
    POP --> PERPERSON
    ROI --> PERPERSON
```

The harmonisation input now has upper, middle and lower cases, a separate rate-based welfare candidate and a custom sensitivity. All use explicit pay and welfare gaps and offsets, with no tax recovery inferred from the unreconciled F&M tables.

No central case is selected. The rate-based candidate leaves some benefits and eligibility effects uncosted, and all Doyle-based cases retain an unverified price-basis caveat.
