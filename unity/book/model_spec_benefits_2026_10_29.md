# Specification for the benefits and whole-island extension

Prepared 29 October 2026 for Codex and Stephen. This extends the component fiscal model (version 2026-10-29-component-fiscal) so it can test whether a united Ireland is a good idea on stated grounds, not only what it costs the Exchequer.

Nothing here changes the existing fiscal engine. Every new channel starts switched off, so current results stay reproducible.

Implementation update after review. The public model reports the three fiscal checks only, while household earned income remains unassessed.

The proposed output-minus-transfer formula below has not been used as an earned-income estimate. See [the repair record](income_test_repair_2026_10_29.md) for the accounting distinction and the separate channel diagnostics.

## 1. Why the model needs this

The current model measures one thing, the additional cost to the Republic's Exchequer. On that measure unification is always a bill, because most benefits fall on Northern households, on firms, on the island's economy and on the UK Treasury.

The book proposal promised UK transitional payments, EU support, trade gains, investment effects and a distributional analysis. None of these is in the model yet, so it cannot show a favourable case however its settings are chosen.

## 2. Rules for this work

1. **Tests before results.** The success tests in section 3 are fixed and committed before any favourable scenario is run. Their thresholds are Stephen's decision and must be recorded in book/decision_register.md first.
2. **Settings before results.** Each scenario's settings are chosen from the evidence ranges in section 4 and committed before the run. Settings are never adjusted after seeing an outcome.
3. **Every favourable scenario has an adverse twin.** The twin uses the low end of the same evidence ranges and is always shown beside it.
4. **No double counting.** Growth from trade, investment or capital spending enters through its own module. The existing growth input `gNI` then means growth from all other causes, and the interface must say so.
5. **Benefits and costs are treated alike.** If a module adds a gain, its matching cost or risk is added in the same commit. One-off integration costs come in with integration savings.
6. **Unverified ranges stay labelled.** Any range marked "source needed" below must be sourced or replaced before it appears in a public result.

## 3. Success tests

A scenario counts as favourable if it passes at least four of the five tests. Stephen agreed the thresholds below on 29 October 2026.

| Test | Measure | Threshold | Where it comes from |
| --- | --- | --- | --- |
| Northern living standards | Northern earned income per person against the UK path, excluding net fiscal transfers from either government | Higher by year 15 | New output, section 4.8 |
| Island prosperity | Island output against the UK path, counting only gains from a modelled channel | Higher by year 15 | New output, section 4.8 |
| Republic debt | Total Republic gross debt as a share of GNI\* | Below 80% in every year | New output, section 4.8 |
| Southern burden | Yearly net transfer as a share of Republic GNI\*, also shown per Republic resident | No more than 2% of GNI\* in every year, about €1,100 per resident at 2023 values. Report 1% and 3% as sensitivities | New output, section 4.8 |
| Direction of travel | Yearly net transfer | Falls every year from year 20, compared with the year before. Open question in section 9 | Existing output |

Full repayment of transition borrowing is reported but is not required to pass. Germany's unification is generally judged on the second and third kind of test, not on repayment.

### 3.1 Why the two income tests were redefined

Stephen agreed on 29 October 2026 to redefine both income tests. As first built, neither could tell a good future from a bad one.

The first Northern measure added Northern output to the net transfer into the North. Under unity, Southern pay and welfare rates are paid for by the South, so the transfer alone lifts the measure.

Run on the released model with the favourable deal, every future passed the Northern test at 1.3%, 2% and 3% Northern growth. At 1.3% Northern output was about €9.6bn lower than on the UK path by year 15, yet the measure still showed a gain of about €3,100 per person.

The first island measure added Northern output to Republic GNI\*. With every benefit channel at nil, the only difference from the UK path is the growth input, so the test passed when growth was set above the UK path and failed otherwise.

At 2% the gain was exactly nil and the test failed by a tie. At 3% it passed. The test was reporting an input, not a result.

The corrected tests have to be earned. Northern income counts only what is earned in the North, and island output counts only gains that come through a module in section 4.

### 3.2 How results are reported until then

No scenario is called favourable until both income tests are measured on the corrected definitions. Until then, published results and the Tánaiste brief report the three fiscal tests only, and say plainly that they measure whether the State could carry a future, not whether people are better off.

The four-of-five rule still stands. It applies once all five tests can be measured.

## 4. New modules

Each module lists the policy question, the new inputs, the mechanism, the evidence and the guard against double counting. Input names follow the existing `structural` and `policy` style.

### 4.1 UK transitional payment

**Question.** How much would a declining UK payment reduce the Republic's cost?

| Input | Default | Range | Meaning |
| --- | --- | --- | --- |
| `ukTransitionShare` | 0% | 0% to 50% | Share of the opening UK fiscal transfer paid in year one |
| `ukTransitionYears` | 10 | 1 to 20 | Years over which the payment falls linearly to nil |

**Mechanism.** The payment in year t equals the share times the frozen opening transfer of €17.058bn, times (1 − (t−1)/years), and never below nil. It reduces the Republic's yearly cost and sits in the interface beside the pension and debt switches.

**Evidence.** The UK saves the whole transfer if the North leaves, which is the basis of any negotiation. Precedents in the Czech and Slovak separation and the Hong Kong handover were raised in the February design notes but need sourcing before any default above nil is used. Source needed.

**Guard.** The payment is a negotiated outcome, never a forecast. It must be labelled as a switch, like pensions and debt.

### 4.2 EU support

**Question.** How much EU regional and cohesion funding could the North and border counties receive?

| Input | Default | Range | Meaning |
| --- | --- | --- | --- |
| `euSupportPeak` | 0% | 0% to 3% | Peak yearly EU funding as a share of Northern reference output |
| `euSupportRamp` | 3 | 1 to 10 | Years to reach the peak |
| `euSupportYears` | 10 | 1 to 20 | Years at or after the peak before a linear phase-out over 5 years |

**Mechanism.** EU funding reduces the Republic's yearly cost. A selected share, `euCapitalShare`, defaulting to nil, can also feed the existing public capital channel when linked mechanisms are on.

**Evidence.** The February design notes cited peaks of about 2% to 4% of recipient regional GDP in eastern enlargement. The 2028 to 2034 EU budget and the Republic's net contributor status must be checked, since a richer united state may receive less. Source needed.

**Guard.** EU funding is not growth. Any growth it produces enters only through the capital channel, not through `gNI`.

### 4.3 Trade gains from removing the border

**Question.** How much extra output would North-South trade generate once the border effect falls?

| Input | Default | Range | Meaning |
| --- | --- | --- | --- |
| `borderGainMax` | 0% | 0% to 4% | Long-run Northern output gain from full removal of remaining border costs |
| `borderGainRepublic` | 0% | 0% to 1% | Long-run Republic output gain |
| `borderPhaseYears` | 10 | 3 to 20 | Years to reach the long-run gain |
| `windsorShareRemoved` | 0% | 0% to 100% | Share of the border effect already removed by the Windsor Framework, which is not counted again |

**Mechanism.** Northern output is raised by `borderGainMax × (1 − windsorShareRemoved) × min(t/borderPhaseYears, 1)`. The extra output yields receipts at the existing marginal rate `taxShare`.

**Evidence.** The ranges are placeholders until the chapter 6 gravity model is estimated. Head and Mayer (2014) set out the method and the size of typical border effects. The output gain must come from the estimated trade response, not from the border effect directly. Source needed, from the project's own gravity estimates.

**Guard.** A matched cost input, `gbFrictionLoss`, defaulting to nil, records output lost if new barriers arise on trade with Great Britain. Great Britain is the North's largest outside market, so a favourable scenario cannot set this to nil without stating why.

### 4.4 Investment moving North

**Question.** Would a single industrial policy, Southern tax rates and full single-market access draw foreign investment into the North?

| Input | Default | Range | Meaning |
| --- | --- | --- | --- |
| `fdiNorthShare` | 0% | 0% to 50% | Northern foreign-owned employment per head reached, as a share of the Republic's rate |
| `fdiRampYears` | 15 | 5 to 25 | Years to reach that share |
| `fdiOutputPerJob` | set from data | source needed | Output per foreign-owned job, excluding profits booked for tax reasons |
| `fdiTaxPerJob` | set from data | source needed | Corporation tax and payroll receipts per job |

**Mechanism.** Extra foreign-owned jobs add output and receipts directly. Corporation tax enters separately at `fdiTaxPerJob` rather than at the general marginal rate, so tax-driven profit shifting is not counted as Northern output.

**Evidence.** IDA Ireland and Invest NI employment data give the starting gap. The OECD global minimum tax and Pillar Two reduce the Republic's tax advantage and must narrow the upper range. The February notes suggested nil, moderate and strong cases at roughly 0%, 20% to 30% and 50% of the Republic's per-head rate within 15 years. Source needed.

**Guard.** Displacement from the Republic must be recorded. A share `fdiDisplacement`, defaulting to 50% until evidence is found, of each Northern job is subtracted from Republic output and receipts.

### 4.5 Lasting savings from merging systems

**Question.** Which merged functions save money once the transition is over?

| Input | Default | Range | Meaning |
| --- | --- | --- | --- |
| `integrationSaving` | 0 | 0 to 1 €bn a year | Recurring saving at maturity |
| `integrationSavingStart` | 5 | 1 to 15 | Year savings begin |
| `integrationOneOff` | 0 | 0.5 to 5 €bn in total | One-off cost of merging tax, welfare, IT, policing and data systems |
| `integrationOneOffYears` | 5 | 1 to 10 | Years over which the one-off cost is spent |

**Mechanism.** The one-off cost is spread evenly over its years. Savings ramp up over five years from the start year.

**Evidence.** The one-off range of €0.5bn to €5bn is in the earlier brief. The research assistant's inventories of public bodies, North and South, should set the saving range. Galizzi, Rota and Sicilia (2023) find merger savings modest and slow. Source needed for the saving.

**Guard.** The one-off cost must be switched on whenever the saving is. Savings already counted in the `duplication` setting must not be counted again.

### 4.6 Demography

**Question.** Does the North's age structure change the island's long-run pension and health pressures?

**Mechanism.** No new input. The model already uses NISRA and CSO population projections. The change is a new output showing the island's old-age dependency ratio against the Republic's own, so any demographic benefit is visible rather than assumed.

**Evidence.** NISRA 2024-based and CSO 2023-2057 projections, already in data/population_projections.json.

### 4.7 The UK path as a real comparison

**Question.** What happens to the North if it stays in the UK?

| Input | Default | Range | Meaning |
| --- | --- | --- | --- |
| `ukPathGrowth` | equals `baselineGrowth` | 0% to 3% | Northern growth on the UK path |
| `ukPathSpendingGrowth` | equals `baselineSpendingGrowth` | −2% to 3% | Real growth in UK spending in the North |
| `ukPathTransferRisk` | 0% | 0% to 30% | Share of the UK transfer withdrawn by year 25 under a weaker UK commitment |

**Mechanism.** The UK path stays at zero cost to the Republic, as now. Northern resident income and island output are calculated on this path, so the comparison tests in section 3 have something real to compare against.

**Guard.** A favourable unity scenario may not be paired with a pessimistic UK path unless the adverse twin uses the same UK path. Otherwise unity looks good only because the comparison was weakened.

### 4.8 New outputs

| Output | Definition | Status |
| --- | --- | --- |
| Northern earned income per person | Northern output less net fiscal transfers into the North from either government, per resident. Report the transfer separately beside it | Proxy only, until the distributional microsimulation exists |
| Island output gain | Sum of the output terms from sections 4.3 and 4.4 and any capital channel, less GB friction and displacement, against the UK path. The difference between `gNI` and `ukPathGrowth` is reported separately and never counted towards the test | New |
| Gain against the UK path | Each of the above minus its UK-path value | New |
| Republic total gross debt | Existing debt path plus transition borrowing | Needs a baseline debt path |
| Yearly net transfer per Republic resident | Yearly cost divided by Republic population | New |
| Old-age dependency, island and Republic | People 65 and over per person aged 15 to 64 | New |

The baseline Republic debt path starts from Budget 2027, €214.0bn or 56.4% of GNI\* in 2027. It follows the Department of Finance's medium-term projection where one exists, then holds the ratio constant.

Stephen decided on 29 October 2026 that total debt, the baseline plus transition borrowing, may rise to 80% of GNI\*. On a baseline of about 56%, this leaves roughly 24 points of GNI\* for transition borrowing, and the interface should show that headroom directly.

The income proxy is not household welfare. It must carry that label until the FRS and EU-SILC microsimulation in chapter 14 replaces it.

## 5. Scenarios to run

Settings for each scenario must be filled in from sourced ranges and committed before the run. The table shows the intended design, not final values.

| Scenario | Purpose | Main settings |
| --- | --- | --- |
| A. Negotiated, supported transition | Tests whether a good deal plus outside support keeps debt within limits while Northern incomes rise | Managed Integration. UK keeps pensions and debt and pays a declining transition sum. EU support at a sourced mid-range value. Pay and welfare gated by convergence tests. Moderate investment, no trade or investment dividend beyond sourced central values |
| A twin. Supported transition, weak delivery | Adverse twin of A | Same deal. EU support and UK payment at the low end. Growth at the 2000 to 2024 record |
| B. All-island growth dividend | Tests whether the island is better off even with a lasting transfer | Managed Integration or Federal. Border gains and investment moving North at sourced central values. Capital share of early investment above nil. Growth from other causes equal to the South's |
| B twin. Growth dividend, poor execution | Adverse twin of B | Same design. Border and investment gains at the low end. Friction with Great Britain switched on. Wages ahead of productivity through the linked wage channel |

Each scenario reports all five tests from section 3, plus the existing repayment measures.

## 6. Interface changes

- **A new step on the story page.** Add "Is it worth it?" after the growth test. It shows the five tests as pass or fail for the selected scenario and its twin, with Northern income and island output against the UK path.
- **Negotiation switches.** The UK transitional payment and EU support join pensions and debt as switches in step 2.
- **The specialist page.** All new inputs appear with their ranges, sources and "source needed" flags.
- **Labels.** Scenario names describe settings, never outcomes. "Negotiated, supported transition" is acceptable. "Unity pays" is not.

## 7. Checks

1. **Off by default.** With every new input at its default, results match the current release to the cent. This is a test in scripts/test_component_model.mjs.
2. **No double counting.** Turning on border gains with `gNI` unchanged must raise output by exactly the border term.
3. **Symmetry.** Turning on integration savings without the one-off cost must raise an error.
4. **Twins.** A scenario cannot be exported without its adverse twin.
5. **Reproduction.** Each scenario file records the commit, model fingerprint and the date its settings were fixed, so it can be shown that settings came before results.

## 8. Order of work

1. Stephen sets the test thresholds and the baseline debt rule, recorded in the decision register.
2. Build the new outputs and the UK path (sections 4.7 and 4.8), with no new benefits switched on. Done by Codex on 29 October 2026. The two income outputs now need rebuilding to the definitions in section 3.1.
3. Add the UK payment and EU support (4.1 and 4.2), which need negotiation ranges rather than estimates.
4. Add integration savings and one-off costs (4.5), using the research assistant's inventories.
5. Add investment moving North (4.4), with displacement.
6. Add border gains (4.3) once the chapter 6 gravity estimates exist. Until then the input stays at nil.
7. Fix scenario settings, commit them, then run and publish A, B and their twins.

## 9. Decisions for Stephen

1. Settled.
2. Settled. The baseline follows Budget 2027 and Department of Finance projections, then holds steady, with total debt allowed up to 80% of GNI\*.
3. Settled. A scenario must pass four of the five tests.
4. Whether the book presents A and B as its central favourable cases, alongside the existing four futures.
5. Open. Whether "falling from year 20" means year 20 must already be lower than year 19, as the code now does, or only that the transfer falls over years 20 to 25. The two readings differ only for Federal at 3% Northern growth, where pay rerating ends in year 20.
6. Open. Whether `gNI` above `ukPathGrowth` may ever count towards island output. It should not, unless the difference comes from a modelled channel with its own evidence.

## Sources

- book/proposal.md and book/model_design_notes.md, February 2026 proposal and design notes
- book/red_team_and_title.md, the red-team warning that the calculator could be tuned to any answer
- Head and Mayer, Gravity Equations, Workhorse, Toolkit, and Cookbook, Handbook of International Economics, Vol. 4, 2014
- [Galizzi, Rota and Sicilia, Local government amalgamations, Public Management Review, 2023](https://ideas.repec.org/a/taf/rpxmxx/v25y2023i12p2428-2450.html)
- [Department of Finance, Budget 2027 Economic and Fiscal Outlook](https://assets.gov.ie/static/documents/a1841801/Budget_2027_-_Budget_2027_-_Economic_and_Fiscal_Outlook.pdf)
- [NISRA, 2024-based population projections](https://www.nisra.gov.uk/publications/2024-based-population-projections-northern-ireland) and [CSO, Population and Labour Force Projections 2023-2057](https://www.cso.ie/en/releasesandpublications/ep/p-plfp/populationandlabourforceprojections2023-2057/populationprojectionsresults/)
- research/east_german_tfp_update.md, the German convergence evidence
