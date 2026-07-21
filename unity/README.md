# Irish reunification fiscal research prototype

This folder contains an evidence synthesis and an illustrative fiscal scenario simulator. It is not a forecast or an official estimate.

## Main files

- `compass_artifact_wf-f9940191-6ba8-5283-a709-dc6fb0683c57_text_markdown.md` contains the annotated literature review
- `compass_artifact_wf-43e17c74-38c4-5e5a-965e-fb8f6abdd6fd_text_markdown.md` contains the harmonised meta-analysis
- The two Word briefings contain identical text and rendered pages at the time of review
- `model_core.mjs` is the auditable reference calculation engine used by the tests
- `unification_fiscal_simulator_2.jsx` is the editable React interface
- `simulator.html` is the canonical standalone browser build
- `assumptions.html` explains the equations, parameter provenance and limitations
- `unification_fiscal_simulator.html` is retained as a compatibility copy
- `model_parameters.csv` is the parameter register
- `MODEL_NOTES.md` records equations, interpretations and limitations

## Use and verification

Open `simulator.html` with an internet connection. The standalone build loads its interface libraries from public content delivery networks.

Run the model checks with Node.js.

```bash
npm test
```

When changing an input, update the parameter register, model engine, standalone snapshot, relevant test and exact source note.
# The Price of Unity

The project now has two linked simulators.

- `simulator.html` is the stable core fiscal model
- `advanced.html` adds parameter provenance, saved scenario URLs, CSV export, revenue and service composition, financing dynamics, and a stylised three-cohort population and pension block
- The advanced model also includes four coherent preset paths, scenario comparison, a plain-language interpretation, and one-at-a-time sensitivity analysis
- A financing view separates annual borrowing from contemporaneous tax funding and reports peak debt exposure
- Interest on opening transition debt is included in annual and cumulative fiscal cost before the financing split
- The default growth path uses a one-point productivity premium with no automatic employment dividend, while historical and two-point conditional-convergence paths remain explicit alternatives
- The fiscal bridge labels every adjustment by evidence and negotiation status
- Health, education, social protection and administration modules are anchored to ONS 2022 to 2023 identifiable expenditure, with service uplift and one-off transition inputs defaulting to zero until sourced targets are supplied
- Service modules now separate outcome-gap targets from the assumed cost per target point
- Contemporaneous tax funding generates a lagged output and revenue feedback using an editable multiplier
- Transition investment enters a lagged, depreciating productive stock and generates taxable output
- Pension and debt responsibility use continuous negotiated shares rather than binary switches
- A five-workstream implementation template allocates any selected one-off transition envelope
- Northern demography starts from 21 official NISRA 2024 five-year age bands
- The scenario briefing has a print layout for paper or PDF review
- A break-even frontier compares productivity growth and rerating scope while holding the remaining assumptions constant
- An inverse threshold view estimates the sustained Northern growth rate required to reach break-even by selected target years
- Shared scenario URLs clamp malformed or out-of-range values before simulation
- `convergence.html` presents three decision tests for fiscal resilience, productive convergence, and public-service readiness
- `assumptions.html` documents the shared model assumptions

Run `npm test` to check both model engines and the required interface features.
