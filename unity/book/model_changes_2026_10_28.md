# Current repair status

The simulator includes optional negotiated-growth Managed Integration illustrations with [inverse 25-year tests](managed_integration_25_year_tests.md). The ordinary accounting reference is unchanged, and the examples are conditional hypotheses rather than estimated forecasts.

The repaired executable and its [current audit](model_audit_2026_10_28.md) supersede the earlier implementation notes below. The reference case now has no negotiated deductions or extra growth revenue, and behavioural mechanisms are optional experiments.

Gross fiscal paths and source-based gross harmonisation components are separate, pension funding endpoints reconcile, policy comparisons share negotiated terms, and exports are reproducible. The historical notes below record earlier development stages rather than the current specification.

# Scenario model changes, 28 October 2026

This update applies to simulator/unification_fiscal_simulator.jsx and its plain HTML build. It supersedes the older defaults described in the project handoff and scenario mapping, but does not update the historical policy briefs or the archived July model.

## Price basis

The fiscal bridge and full harmonisation cost now use data/rebased.json. The bridge starts at €17.058bn and leaves €1.784bn after the existing adjustments, in constant 2023 euros.

The Northern output anchor is £63.3bn converted at the project's 2023 exchange rate of €1.14970, rounded to €72.777bn. This remains the old output anchor, with no new ONS update or resolution of the documented DCU base-year uncertainty.

## Design and growth

All unity presets now target full pay and benefit alignment. Federal phases this over 20 years and Managed Integration over 15 years, while the slider still permits explicit permanent partial alignment.

Northern growth starts at an illustrative 4% and Southern growth at 2.5%. Northern growth and the slowdown switch persist when a form is selected, and comparison lines use identical growth assumptions.

This separates the user's growth assumptions from institutional design. It does not estimate the causal effect of constitutional change, investment or FDI.

The previous relative-growth revenue proxy and factor-of-two ceiling remain. These are scenario calibrations, not an estimated convergence equation or an independently established parity level.

## Financing

Interest is charged on opening incremental transition debt at a user-selected real rate. The default real interest rate and real discount rate are both illustrative 2% assumptions, not sourced forecasts.

Positive financing-inclusive balances add to debt. Surpluses repay debt, with debt floored at zero, and cumulative net savings tracked separately by the cumulative balance.

Existing allocated UK debt interest is retained separately when the Republic accepts that liability. No extra interest is charged on an inferred inherited debt principal, avoiding a second charge on the same inherited liability.

The headline annual balance and cumulative account include financing interest. Present value discounts those annual balances, while the payback indicator remains an undiscounted financing-inclusive measure.

## Counterfactuals

UK status quo means no incremental Republic expenditure. Shared Island means the Republic funds the selected investment for ten years, while the Northern regional deficit remains UK-funded.

The engine retains a separate illustrative regional-deficit field. These are fiscal-incidence comparisons from the Republic's perspective, not estimates of UK budget savings, total all-island welfare or the causal return from cooperation.

## Remaining limits

The ageing adjustment remains a stylised drift rather than a demographic projection. Full harmonisation costs remain fixed in real terms, rather than tracking Southern real wage growth.

Public-service outcomes, migration, tax behaviour, investment returns and financial-market shocks are not endogenously modelled. None of the scenario curves should be read as a forecast.

## Validation

Run node scripts/test_scenario_model.mjs for the amended engine. The pre-existing scripts/test_model.mjs points to July-workspace files absent at the repository root and is not the test entry point for this simulator.

## Private-sector responses and reunification fund

The simulator now offers optional business investment and FDI, labour supply and employment, and temporary disruption responses. All response magnitudes default to zero and are explicitly user assumptions, rather than findings from the literature.

Business and labour uplifts are additive percentage changes to Northern Ireland output, phased in linearly over the chosen maturity period. A temporary output loss starts at its full level in year one and fades to zero over the selected recovery interval.

The output effect is converted to revenue using the existing 35% share. The existing ceiling applies to the combined output factor, so the optional response does not bypass that ceiling.

These are output-level adjustments, not additional annual growth rates. The baseline growth input should exclude the optional response channels to avoid counting the same gain twice.

The controls are inactive for UK status quo. Under Shared Island, private-sector revenue effects change the UK-funded regional balance rather than the Republic's primary balance.

A hypothetical reunification fund can be given opening capital, annual contributions, a contribution period, a real investment return and an annual withdrawal ceiling. No existing sovereign fund or legal entitlement to use one is assumed.

Opening capital is an asset already available at the beginning of year one. Its preparation costs, prior financing and opportunity costs are outside the simulation horizon, and must be considered separately before drawing a policy conclusion.

Each year, returns are applied to opening assets. Withdrawals are capped by available assets, positive annual costs and the user's annual withdrawal limit, before the year's contribution is deposited.

A withdrawal reduces borrowing requirements rather than the primary spending cost. Contributions increase financing needs and fund assets by the same amount, and are not counted as extra primary expenditure.

Surpluses repay transition debt first and remaining cash is held without a modelled return. Available cash savings are used before subsequent borrowing.

Fund returns are retained in the fund accounting, while withdrawals may subsequently consume the resulting assets. Returns do not reduce the annual cost headline, which remains primary spending plus interest, but they do improve net financial assets.

The fund panel reports remaining assets, cumulative withdrawals and returns, interest avoided relative to an otherwise identical no-fund run, year-one borrowing, and the change in net liabilities. The debt and fund chart distinguishes gross transition debt, fund assets and net liabilities.

The accounting identity is change in net liabilities equals cumulative primary costs plus financing interest minus fund returns. Net liabilities deduct both fund assets and accumulated cash, and their change is measured relative to the opening fund endowment.

A deterministic annual return does not capture volatility, asset allocation or market drawdowns beyond a manually selected negative return. Employment responses do not generate endogenous population changes or associated service costs.

The extended automated tests check neutral settings, private-response direction and recovery, liability incidence, fund depletion, withdrawal ceilings, contributions, negative returns, financing costs and the net-asset accounting identity.

## Linked economic extension

The later linked extension supersedes the earlier statements that investment has no output connection. Its equations, evidence distinctions, updated description and diagram are documented in book/linked_model_description.md.

Republic growth now affects the GNI* denominator only. Northern Ireland revenue gains are measured against a separately adjustable and growing Northern Ireland counterfactual.

The selected scenario's policy settings are now respected by its line in the comparison chart. Other lines retain their institutional policy presets with common economic response assumptions.

The response controls are generated from a parameter register that labels each input as a transferred benchmark or calibration. Residual business and labour controls remain available for effects outside the linked channels and should stay at zero where those effects are already included.
