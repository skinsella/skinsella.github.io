# Model repair and evidence audit

Updated 28 October 2026. This report replaces the pre-repair audit for the current executable model.

The model separates conditional accounting from optional economic experiments. It is not an estimated causal model, a forecast or a complete cost-benefit analysis.

## Corrections

| Problem | Correction |
| --- | --- |
| Default dividends | Policy growth equals reference growth. Extra-output revenue and linked responses require separate opt-in switches. |
| Negotiated terms | The initial reference assumes no liability retention or disputed deduction. Every deduction share is explicit and common across compared policy bundles. |
| Conversion provenance | Original sterling replaces reverse conversion of rounded euros. This reproduces the previous net harmonisation envelope at displayed precision. The earlier audit established a provenance question, not a material error in that amount. |
| Gross and net boundaries | Source gross pay and welfare increments are independent benchmarks. A net fiscal cost is no longer split arbitrarily into household incomes. |
| Pension endpoint | One pension envelope defines immediate and phased funding. The linear transfer reaches that same envelope, without mixing a net increment with a different gross endpoint. |
| Fiscal baseline | Gross receipts and spending have separate real growth paths. Their opening difference matches the frozen project deficit. |
| Ageing and composition | No arbitrary share of the residual deficit is aged. Ageing needs an explicit service base, and unsupported residual-deficit erosion is rejected. |
| Current and capital spending | Only an explicitly selected capital share can become productive capital. It starts at zero. |
| Overlapping induced output | The public-capital response is a reduced-form benchmark. Induced private capital, employment and recruitment are diagnostics and add no further output multiplier. |
| Private net stock | The additional net stock adjusts directly towards its target, with replacement implicit. |
| Demand capacity | Real demand gains cannot exceed selected spare capacity. With no spare capacity there is no first-round real demand dividend. |
| Output cap and slowdown | The implicit doubling cap is removed. A selected ceiling records binding years, and the slowdown can never accelerate relative growth. |
| Reproducibility | One pure policy builder serves the main run and comparisons. Selecting a policy never changes liability switches. A run export contains the executable fingerprint, all inputs, results and compared policies. |
| Break-even | Unrounded signs determine crossings. The interface says not within horizon instead of never. |
| Build and protection | Build and encryption paths are relative to the repository. The protected copy requires its configured password to rebuild. |

## Source and conversion reconciliation

Original sterling Table 7 gives a 2019 net harmonisation increment of £18.104bn minus £9.577bn. Separate Table 6 gross pay and welfare increments are £4.306bn and £4.809bn, and direct UK-deflator conversion still rounds the net envelope to €11.634bn.

The earlier HICP alternative treated the rounded euro table as the starting currency. It is not a further correction to apply on top of direct conversion of the original sterling observations.

| Benchmark | 2023 €bn | Source |
| --- | --- | --- |
| Net fiscal harmonisation | 11.633734047112508 | F&M Table 7 sterling difference |
| Gross pay increment | 5.874851507783097 | F&M Table 6 sterling |
| Gross welfare increment | 6.561114932867839 | F&M Table 6 sterling |
| Gross components less net increment | 0.8022323935384286 | Source reconciliation boundary, not assigned to a new tax mechanism |
| Opening receipts | 26.118363969453263 | Doyle Table 1 with recorded fiscal-period assumption |
| Opening reconciled spending | 43.17636396945326 | Receipts plus frozen project deficit |

## Current conditional accounting paths

These use the exact settings recorded in model_audit.json, with no negotiated deductions or extra growth revenue. They are accounting illustrations, not expected costs or rankings of constitutional arrangements.

| Bundle | Year-one annual | Year-25 annual | Cumulative to year 25 | Cumulative to year 50 |
| --- | --- | --- | --- | --- |
| Unitary | 29.2 | 46.3 | 926.4 | 2438.8 |
| Federal | 18.6 | 44 | 783.9 | 2221.1 |
| Managed Integration | 19.6 | 44.6 | 828.6 | 2286.5 |
| Higher initial cost | 28.7 | 46.1 | 919 | 2426.7 |
| UK status quo | 0 | 0 | 0 | 0 |
| Shared Island | 0.5 | 0.1 | 7.4 | 12.1 |

All monetary results are €bn in constant 2023 prices. No probability is assigned to any bundle or negotiated outcome.

## Negotiated liability alternatives

Only the pension and interest switches vary below, holding the initial Managed Integration policy and accounting settings fixed. UK pension retention starts phased funding transfer rather than removing pensions permanently.

| UK accrued pensions retained | UK interest retained | Adjusted opening gap | Year-one cost | Year-25 cost | Cumulative to year 25 |
| --- | --- | --- | --- | --- | --- |
| false | false | 17.058 | 19.6 | 44.6 | 828.6 |
| false | true | 12.82 | 15.3 | 37.8 | 692.9 |
| true | false | 10.193999999999999 | 12.9 | 39.1 | 674.6 |
| true | true | 5.955999999999999 | 8.7 | 32.3 | 538.9 |

## Remaining evidence requirements

| Area | Required evidence |
| --- | --- |
| Official fiscal vintage | Confirm the exact ONS release, fiscal period and cells. The study table labels conflict and the agreed update remains on hold. |
| Dated transition baseline | A relative model year using hybrid historical benchmarks is not a costed calendar transition date. |
| Policy harmonisation | Programme-level benefit eligibility, pay scales, staffing, service standards and tax recovery need fresh costing. Inflation rebasing does not update real policy gaps. |
| Pensions and debt | Cohort cash flows, legal terms, tax treatment and an inherited debt-stock settlement remain unresolved. Linear funding and an annual interest envelope are scenarios. |
| Capital and services | Costed projects, maintenance, current/capital classification, baseline stocks and programme outcomes are needed. |
| Behavioural estimation | NI estimates or defensible transferred ranges with explicit counterfactuals are needed for investment, wages, taxes and migration. |
| Economic closure | The optional experiment has a capacity constraint but no estimated prices, housing, external balance, trade or Republic-financing response. |
| Welfare and distribution | Fiscal balances cannot establish household incidence, public-service outcomes or an aggregate welfare gain. |

## Every fixed constant and adjustable setting

Slider bounds are chosen experiments, not confidence intervals. Source provenance and model validity are separate judgements.

| Kind | Code | Initial value | Status | Finding |
| --- | --- | --- | --- | --- |
| Constant | GNI_STAR | 290.9 | Verified frozen vintage | CSO Annual National Accounts 2023 reports €290.9bn. This is the recorded release vintage, not a claim about the latest revision. |
| Constant | NORTH_GNI | 72.77618735556858 | Arithmetic corrected, source unresolved | Uses the recorded £63.3bn project anchor and divides by verified 2023 GBP-per-EUR .86979. The official GDP cell and vintage remain unverified, so this anchor supports experiments only. |
| Constant | UK_2019_TO_2023_EUR | 1.3643408053374586 | Verified conversion inputs | Uses the original sterling figures, ONS L8GG calendar-year averages for 2019 and 2023, and the reciprocal of the verified annual ECB reference rate. No reverse conversion of rounded euro totals. |
| Constant | UK_FY2022_TO_2023_EUR | 1.199575803493008 | Verified arithmetic, fiscal period assumed | ONS L8GG FY2022–23 to CY2023 conversion with recorded 2023 FX. Whether this is the correct fiscal period of the frozen study observations remains unresolved. |
| Constant | BASE_REVENUE | 26.118363969453263 | Study traced, official cell unresolved | Doyle 2025 Table 1 reports revenue £21.773bn. The same assumed FY conversion as the frozen bridge is used. Exact official release and cell need confirmation. |
| Constant | BASE_SPENDING | 43.17636396945326 | Reconciled frozen accounting anchor | Opening revenue plus the frozen €17.058bn deficit. It reconciles exactly to the project deficit and approximates the separately rebased study spending figure within source rounding. |
| Constant | GROSS_PAY_FULL | 5.874851507783097 | Study benchmark, current applicability unresolved | F&M 2024 Table 6 gives a 2019 gross pay increment of £4.306bn. It is separately rebased, not inferred from a net fiscal envelope or treated as a current wage-policy costing. |
| Constant | GROSS_WELFARE_FULL | 6.561114932867839 | Study benchmark, current applicability unresolved | F&M 2024 Table 6 gives a 2019 gross welfare increment of £4.809bn. Eligibility, composition and future rates still require programme costing. |
| Constant | SOURCE_PAY_BASE | 9.273424453878706 | Historical source benchmark | F&M 2024 Table 6 reports a 2019 current public pay bill of £6.797bn. It is a historical normalisation, not a newly measured Northern Ireland pay bill. |
| Constant | PUBLISHED | 17.058 | Frozen study anchor | Doyle 2025 Table 1 and Table 2 contain £14.220bn. Table 2 labels the period 2019 while Table 1 and surrounding text say 2023. The official update remains on hold. |
| Constant | PENSIONS | 6.864 | Negotiated envelope, not actuarial estimate | Doyle 2025 Table 2 reports £5.722bn. The same frozen envelope now defines both immediate transfer and the endpoint of phased funding transfer, without mixing a net incremental allowance with a different gross endpoint. |
| Constant | DEBT_INT | 4.238 | Negotiated interest flow | Doyle 2025 Table 2 reports £3.533bn. It remains a frozen annual interest-flow scenario, not an allocated inherited debt principal or refinancing forecast. |
| Constant | DEFENCE_NET | 1.64 | Optional disputed deduction | Doyle 2025 Table 2 reports £1.367bn. The accepted share starts at zero, and any assumed deduction is explicit. Replacement security and defence services still need costing. |
| Constant | OTHER_NONID | 0.692 | Optional disputed deduction | Doyle 2025 Table 2 reports £0.400bn overseas and £0.177bn central costs. The accepted share starts at zero. Replacement functions and EU costs need a programme budget. |
| Constant | TAX_ADD | 1.84 | Optional disputed adjustment | Doyle 2025 Table 2 combines £0.500bn HQ, £0.265bn central spending and £0.769bn tax/PRSI changes. The accepted share starts at zero. Attribution is not automatically additional cash revenue. |
| Constant | RERATE_FULL | 11.633734047112508 | Conversion repaired, policy estimate conditional | F&M 2024 Table 7 original sterling 2019 difference £18.104bn minus £9.577bn, converted directly with the UK deflator and recorded FX. The gap between this net increment and Table 6 gross components is kept visible rather than allocated to household income. |
| structural | defenceSavingShare | 0 | Explicit setting or qualified benchmark | Accepted share of the study deduction, zero by default. A negotiation scenario, not an agreed saving. |
| structural | centralSavingShare | 0 | Explicit setting or qualified benchmark | Accepted share of the study central and overseas deductions, zero by default. Replacement functions remain a costing question. |
| structural | taxAdjustmentShare | 0 | Explicit setting or qualified benchmark | Accepted share of study revenue adjustments, zero by default. This must be reconciled to the tax base and harmonisation assumptions. |
| structural | pensionTransferYears | 40 | Explicit setting or qualified benchmark | Linear transfer of the same pension funding envelope. Forty years follows a stylised period discussed by Doyle, not a cohort forecast or agreed settlement. |
| params | gNI | 2.5 | Explicit setting or qualified benchmark | Chosen policy output growth, not a treatment effect estimated from reunification. It must exclude the linked mechanisms and residual shocks to avoid counting gains twice. |
| structural | southGrowth | 2.5 | Explicit setting or qualified benchmark | Chosen Republic real GNI* path. It changes the denominator only and does not represent spillovers or financing effects on Republic activity. |
| params | reratingScope | 100 | Explicit setting or qualified benchmark | Chosen harmonisation scope. Benefits, eligibility, staffing, hours and service quality are compressed into one envelope. |
| params | reratingYears | 15 | Explicit setting or qualified benchmark | Chosen linear schedule. The source does not identify a single pay and welfare convergence process. |
| params | investment | 1.5 | Explicit setting or qualified benchmark | Preset spending choice. Capital versus current expenditure, additionality, maintenance and procurement capacity need separate budgets. |
| params | duplication | 0.25 | Explicit setting or qualified benchmark | Preset recurring cost without a functional cost study or time-dependent transition budget. |
| structural | ageing | 0 | Explicit setting or qualified benchmark | Applies to the pension envelope and an explicitly supplied service base. Zero initially. It is not a demographic projection and must not duplicate baseline spending growth. |
| structural | realInterest | 2 | Explicit setting or qualified benchmark | Constant real marginal borrowing rate. No debt-risk premium, maturity structure, inflation surprise or fiscal response. |
| structural | discountRate | 2 | Explicit setting or qualified benchmark | Chosen real discount rate. Discounted financing-inclusive costs are a cash-flow measure, not a social welfare valuation. |
| structural | baselineRevenueGrowth | 0 | Explicit setting or qualified benchmark | Explicit real receipts path. Constant in real terms by default, not automatically tied to assumed output convergence. |
| structural | baselineSpendingGrowth | 0 | Explicit setting or qualified benchmark | Explicit real spending path. Constant in real terms by default. Any ageing already in this path must not be added again. |
| structural | ageSensitiveSpending | 0 | Explicit setting or qualified benchmark | Explicit additional non-pension service spending exposed to ageing. Zero until a programme base is supplied. Excludes ageing already in baseline spending. |
| structural | taxShare | 35 | Explicit setting or qualified benchmark | Explicit marginal revenue assumption. No average tax ratio is automatically treated as a causal tax elasticity. |
| structural | outputCeiling | 0 | Explicit setting or qualified benchmark | Optional numerical scenario bound, disabled by default. It is not measured parity with the Republic. A run records when it binds. |
| structural | businessUplift | 0 | Explicit setting or qualified benchmark | Residual assumed output-level effect, not an FDI estimate. No firm entry, profit repatriation, trade model or corporation-tax base. |
| structural | labourUplift | 0 | Explicit setting or qualified benchmark | A separately assumed residual labour output contribution in either configuration, not output calculated from diagnostic job equivalents. It must exclude effects already represented by other mechanisms. |
| structural | privateMaturity | 10 | Explicit setting or qualified benchmark | Chosen linear phase-in, not estimated business adjustment. |
| structural | transitionShock | 0 | Explicit setting or qualified benchmark | Chosen temporary output loss. No currency, banking, border, trade diversion or confidence model identifies its size. |
| structural | privateRecovery | 5 | Explicit setting or qualified benchmark | Chosen linear recovery, not an estimated transition path. |
| structural | fundOpening | 0 | Explicit setting or qualified benchmark | Existing assets are an endowment. Prior taxation, forgone public investment and alternative uses are outside the horizon. |
| structural | fundReturn | 2 | Explicit setting or qualified benchmark | Deterministic real return without risk, fees or covariance with borrowing costs. A favourable return spread is not free fiscal capacity. |
| structural | fundContribution | 0 | Explicit setting or qualified benchmark | Asset acquisition, normally financed by taxes or borrowing. The model correctly adds financing needs but has no macro financing feedback. |
| structural | fundContributionYears | 10 | Explicit setting or qualified benchmark | Chosen saving horizon. No fiscal rule or legal mandate is represented. |
| structural | fundDrawCap | 5 | Explicit setting or qualified benchmark | Chosen withdrawal ceiling. Not a sustainable spending rule or guarantee of available assets. |
| structural | investmentCapitalShare | 0 | Explicit setting or qualified benchmark | Explicit split of additional expenditure. Starts at zero so current services and welfare never automatically become productive capital. |
| structural | spareCapacity | 0 | Explicit setting or qualified benchmark | Chosen capacity margin. Starts at zero. Demand cannot create real output above the selected fixed-price capacity limit. |
| structural | baselineGrowth | 2.5 | Explicit setting or qualified benchmark | No estimated counterfactual or confidence interval. Distinguish output growth, productivity growth and population growth. |
| structural | investmentEfficiency | 80 | Explicit setting or qualified benchmark | No NI project-level delivery estimate. Spending called investment also includes recurring health, education and welfare in Doyle Table 3, so it cannot all become productive physical capital. |
| structural | investmentLag | 2 | Explicit setting or qualified benchmark | Chosen timing with all expenditure completing at one lag. No project pipeline or distributed completion profile. |
| structural | capitalDepreciation | 4 | Explicit setting or qualified benchmark | No asset mix or independently measured stock. Different public and private assets should not automatically share a depreciation rate. |
| structural | publicCapitalRatio | 100 | Explicit setting or qualified benchmark | No measured NI reference public capital stock. The elasticity cannot identify an output effect without a defensible stock denominator. |
| structural | publicCapitalElasticity | 0.106 | Explicit setting or qualified benchmark | Bom and Ligthart report an average .106 across heterogeneous studies. It is not a NI causal coefficient and may overlap private-capital and employment responses added separately. |
| structural | privateCapitalRatio | 150 | Explicit setting or qualified benchmark | Unmeasured reference stock. Results depend on this scale and on whether the stock is gross or net. |
| structural | privateCrowdIn | 1 | Explicit setting or qualified benchmark | Unestimated response. Public-capital effects may already include private adjustment, creating overlap. |
| structural | privateAdjustment | 5 | Explicit setting or qualified benchmark | Unestimated adjustment speed. The net additional stock now adjusts directly towards its target, with replacement implicit. It is a diagnostic and does not add another GDP effect. |
| structural | privateCapitalElasticity | 0.3 | Explicit setting or qualified benchmark | Chosen Cobb–Douglas exponent, not an estimated NI capital share. It is used only for a private-productivity diagnostic and does not add to headline GDP. |
| structural | publicPayBase | 9.273 | Explicit setting or qualified benchmark | A rebased historical pay-bill benchmark from F&M Table 6 replaces the invented normalisation. It is not a current measured NI pay bill or an estimate of private wage spillovers. |
| structural | payDisposableShare | 65 | Explicit setting or qualified benchmark | Illustrative after-tax share. Fiscal feedback from the pay increase has not been reconciled to the net harmonisation envelope. |
| structural | payMPC | 0.6 | Explicit setting or qualified benchmark | No recipient-specific consumption estimate. Tax financing and displaced Republic spending are absent. |
| structural | welfareMPC | 0.8 | Explicit setting or qualified benchmark | No recipient-specific consumption estimate or saving dynamics. Benefit eligibility and withdrawal rates are absent. |
| structural | domesticRetention | 50 | Explicit setting or qualified benchmark | No input-output estimate of imports or flows between NI, the Republic and Great Britain. Domestic geography must be defined. |
| structural | demandRealisation | 50 | Explicit setting or qualified benchmark | Unestimated spare-capacity closure. The first-round response is capped by the selected spare capacity. This is a fixed-price experiment, not a general-equilibrium closure. |
| structural | wageSpillover | 20 | Explicit setting or qualified benchmark | Unestimated public-to-private wage transmission. Labour groups, occupations and regional wage bargaining are not represented. |
| structural | labourSupplyElasticity | 0.2 | Explicit setting or qualified benchmark | The UCD paper does not estimate this aggregate NI coefficient. Household-specific wage elasticities cannot be directly treated as an aggregate employment effect. |
| structural | welfareIncomeElasticity | 0.05 | Explicit setting or qualified benchmark | Chosen income effect without benefit withdrawal or substitution effects. The income base is a hard-coded share of output. |
| structural | labourDemandElasticity | 0.5 | Explicit setting or qualified benchmark | Chosen response to a productivity-minus-wages index. No firm first-order conditions, labour share or NI estimation establish it. |
| structural | labourSlack | 5 | Explicit setting or qualified benchmark | No observed labour-force, hours, skills or participation constraint. Fixed reference employment does not grow with the baseline economy. |
| structural | publicRecruitmentElasticity | 0.2 | Explicit setting or qualified benchmark | A diagnostic index only. No measured staff response, vacancy closure, staffing cost or public-service benefit. |
| structural | baselineEmployment | 900000 | Explicit setting or qualified benchmark | Illustrative scale rather than verified employment. Additional jobs should be called job equivalents, not a forecast. |
| structural | migrationResponse | 0 | Explicit setting or qualified benchmark | Migration responds only to unfilled jobs. Housing, departures, return migration, composition and fiscal incidence are omitted. |
| structural | migrantHouseholdSize | 1.5 | Explicit setting or qualified benchmark | Chosen household scale with no age structure. No separate children, retirees or secondary earners. |
| structural | serviceCostPerResident | 15000 | Explicit setting or qualified benchmark | Chosen marginal cost, not a budget costing. Housing, capital infrastructure and congestion are absent. |
| structural | growthRevenue | false | Explicit setting or qualified benchmark | Off by default. Enabling this applies an assumed marginal revenue share to extra output, without claiming an estimated fiscal effect. |
| negotiation | pensionsUK | false | Explicit setting or qualified benchmark | Negotiated scenario, not a settled legal or actuarial result. The current UI wording is qualified. |
| negotiation | debtUK | false | Explicit setting or qualified benchmark | Negotiated scenario, not a settled allocation of debt stock, assets or interest. |
| params | stall | false | Explicit setting or qualified benchmark | After year seven the relative rate is capped at the lower of its previous rate and .4%. It cannot accelerate a low-growth path, but the timing and cap remain scenario assumptions. |
| structural | linkedMechanisms | false | Explicit setting or qualified benchmark | Research configuration. Enabling links creates an illustrative mechanism experiment, not an estimated causal model. |
| run | horizon | 25 | Explicit setting or qualified benchmark | Reporting choice rather than evidence. Long horizons magnify unsupported persistence, missing terminal liabilities and the output ceiling. |

## Relationship register

| Relationship | Status | Finding |
| --- | --- | --- |
| Defaults | Repaired | The opening accounting reference has no negotiated deductions, no additional growth revenue and no linked behavioural effects. It is a conditional reference, not a best estimate of transition costs. |
| Price conversion | Repaired | Net harmonisation uses original sterling Table 7 values directly. Gross pay and welfare use separate Table 6 values. All use the same recorded UK deflator and FX convention. |
| Net and gross harmonisation | Repaired boundary, policy unresolved | Gross pay and welfare no longer come from an arbitrary split of a net fiscal envelope. The source gross/net discrepancy is recorded without inventing its composition. |
| Fiscal baseline | Repaired accounting, paths assumed | Separate gross receipts and spending paths reconcile to the frozen deficit. Growth in output does not silently generate revenue. Both real fiscal growth rates are explicit. |
| Fiscal deductions | Repaired interface, settlement unresolved | Each disputed defence, central-spending and revenue adjustment has an explicit accepted share, initially zero. The UK pension and debt switches are independent of policy labels. |
| Pensions | Repaired endpoints, actuarial work needed | A single pension envelope transfers linearly over the selected period. Phased and immediate transfer agree at the endpoint, without mixing gross and net conventions or claiming a cohort projection. |
| Ageing | Repaired base, data needed | Ageing applies to pensions and an explicit non-pension service base. No arbitrary share of a residual deficit is aged and no residual balance disappears through composition. |
| Public expenditure and capital | Repaired boundary | Only the explicitly selected capital share of additional expenditure can become productive capital. That share starts at zero. Maintenance and project selection remain uncosted. |
| Capital and jobs | Repaired overlap | Public capital provides one reduced-form output effect. Induced private capital and jobs are diagnostics, not extra output multipliers stacked on that benchmark. |
| Private net capital | Repaired target | The additional net stock moves towards its target with replacement implicit. There is no second depreciation deduction preventing convergence to a fixed target. |
| Demand capacity | Repaired bound, partial closure | Real demand effects cannot exceed selected spare capacity. The fixed-price experiment has no estimated price, trade, monetary or Republic-financing response. |
| Growth and revenue | Explicit experiment | The marginal revenue rate is adjustable and feedback is off initially. Policy growth and residual shocks must exclude effects entered in other channels. |
| Output ceiling | Repaired | There is no implicit doubling ceiling or claim of income parity. An optional user-selected bound records each binding year. |
| Slowdown | Repaired direction | The switch never raises the relative growth rate after year seven. Its timing and remaining cap are still scenario settings. |
| Scenario comparison | Repaired | Policy selection does not mutate liability switches. All compared bundles use the same negotiated terms, growth and structural settings. The selected comparison line uses exactly the main-run inputs. |
| Reproduction | Repaired | A downloaded run includes policy inputs, shared settings, all compared bundles, annual results and the executable fingerprint. A CLI rejects mismatched models or results. |
| Debt, fund and cash | Accounting identities tested | Contributions acquire assets and increase financing needs. Withdrawals reduce financing, not spending. Surpluses repay debt and excess becomes cash. Opening assets are not free income. |
| Inherited debt | Scope unresolved | A constant annual interest allocation is not a negotiated debt stock. No inherited principal or refinancing model has been invented. |
| Labour and wages | Unestimated diagnostic | Wage spillovers, labour supply, welfare income effects and firm labour demand remain unestimated. Their indices cannot establish changes in employment or public-service quality. |
| Migration | Unestimated experiment | Optional migration adds residents and service costs. No return migration, cohort ageing, housing constraint or complete migrant tax account is estimated. |
| Counterfactual institutions | Scope limitation | UK status quo is zero only from the incremental Republic perspective. Shared Island allocates its extra expenditure to the Republic. No welfare ordering or constitutional causal effect follows. |
| Evidence vintage | Unresolved | The frozen ONS fiscal baseline and its exact official cells remain on hold. A historical harmonisation benchmark combined with a later deficit is a hybrid scenario, not an updated policy costing. |
| Forecasts and welfare | Outside scope | No probabilities, distributional microsimulation, banking model, currency changeover, trade model or complete all-island welfare analysis is supplied. Slider bounds are not confidence intervals. |

## Accounting-reference endpoint sensitivity

One control varies between its interface endpoints while the rest remain fixed. Zero effects for disabled mechanisms are intentional, and the ordering depends on chosen ranges rather than statistical importance.

| Control | Low | High | Year-25 annual at low | At high | Cumulative to year 25 at low | At high |
| --- | --- | --- | --- | --- | --- | --- |
| baselineSpendingGrowth | -2 | 4 | 22.2 | 133.2 | 542.8 | 1747.5 |
| baselineRevenueGrowth | -2 | 4 | 58.2 | -8.9 | 1001.5 | 272.8 |
| realInterest | 0 | 6 | 28.9 | 105.1 | 657.1 | 1374.2 |
| reratingScope | 0 | 100 | 28.3 | 44.6 | 576.5 | 828.6 |
| reratingYears | 1 | 25 | 47 | 43.2 | 949.1 | 755 |
| ageing | 0 | 2 | 44.6 | 50.1 | 828.6 | 890.3 |
| taxAdjustmentShare | 0 | 100 | 44.6 | 41.7 | 828.6 | 769.7 |
| defenceSavingShare | 0 | 100 | 44.6 | 42 | 828.6 | 776.1 |
| investment | 0 | 2.5 | 44.2 | 44.9 | 806.5 | 843.4 |
| fundOpening | 0 | 100 | 44.6 | 41.6 | 828.6 | 793.5 |
| duplication | 0 | 1 | 44.2 | 45.8 | 820.6 | 852.7 |
| centralSavingShare | 0 | 100 | 44.6 | 43.5 | 828.6 | 806.5 |
| fundContribution | 0 | 5 | 44.6 | 44.6 | 828.6 | 829.8 |
| pensionTransferYears | 1 | 60 | 44.6 | 44.6 | 828.6 | 828.6 |
| gNI | 0 | 7 | 44.6 | 44.6 | 828.6 | 828.6 |
| southGrowth | 0 | 4 | 44.6 | 44.6 | 828.6 | 828.6 |
| discountRate | 0 | 6 | 44.6 | 44.6 | 828.6 | 828.6 |
| ageSensitiveSpending | 0 | 15 | 44.6 | 44.6 | 828.6 | 828.6 |
| taxShare | 0 | 60 | 44.6 | 44.6 | 828.6 | 828.6 |
| outputCeiling | 0 | 4 | 44.6 | 44.6 | 828.6 | 828.6 |
| businessUplift | 0 | 15 | 44.6 | 44.6 | 828.6 | 828.6 |
| labourUplift | 0 | 10 | 44.6 | 44.6 | 828.6 | 828.6 |
| privateMaturity | 1 | 20 | 44.6 | 44.6 | 828.6 | 828.6 |
| transitionShock | 0 | 15 | 44.6 | 44.6 | 828.6 | 828.6 |
| privateRecovery | 1 | 15 | 44.6 | 44.6 | 828.6 | 828.6 |
| fundReturn | -10 | 8 | 44.6 | 44.6 | 828.6 | 828.6 |
| fundContributionYears | 1 | 25 | 44.6 | 44.6 | 828.6 | 828.6 |
| fundDrawCap | 0 | 15 | 44.6 | 44.6 | 828.6 | 828.6 |
| investmentCapitalShare | 0 | 100 | 44.6 | 44.6 | 828.6 | 828.6 |
| spareCapacity | 0 | 20 | 44.6 | 44.6 | 828.6 | 828.6 |
| baselineGrowth | 0 | 4 | 44.6 | 44.6 | 828.6 | 828.6 |
| investmentEfficiency | 0 | 100 | 44.6 | 44.6 | 828.6 | 828.6 |
| investmentLag | 0 | 10 | 44.6 | 44.6 | 828.6 | 828.6 |
| capitalDepreciation | 0 | 10 | 44.6 | 44.6 | 828.6 | 828.6 |
| publicCapitalRatio | 25 | 200 | 44.6 | 44.6 | 828.6 | 828.6 |
| publicCapitalElasticity | 0 | 0.25 | 44.6 | 44.6 | 828.6 | 828.6 |
| privateCapitalRatio | 50 | 300 | 44.6 | 44.6 | 828.6 | 828.6 |
| privateCrowdIn | 0 | 3 | 44.6 | 44.6 | 828.6 | 828.6 |
| privateAdjustment | 1 | 15 | 44.6 | 44.6 | 828.6 | 828.6 |
| privateCapitalElasticity | 0 | 0.6 | 44.6 | 44.6 | 828.6 | 828.6 |
| publicPayBase | 5 | 20 | 44.6 | 44.6 | 828.6 | 828.6 |
| payDisposableShare | 0 | 100 | 44.6 | 44.6 | 828.6 | 828.6 |
| payMPC | 0 | 1 | 44.6 | 44.6 | 828.6 | 828.6 |
| welfareMPC | 0 | 1 | 44.6 | 44.6 | 828.6 | 828.6 |
| domesticRetention | 0 | 100 | 44.6 | 44.6 | 828.6 | 828.6 |
| demandRealisation | 0 | 100 | 44.6 | 44.6 | 828.6 | 828.6 |
| wageSpillover | 0 | 100 | 44.6 | 44.6 | 828.6 | 828.6 |
| labourSupplyElasticity | 0 | 0.6 | 44.6 | 44.6 | 828.6 | 828.6 |
| welfareIncomeElasticity | 0 | 0.3 | 44.6 | 44.6 | 828.6 | 828.6 |
| labourDemandElasticity | 0 | 1 | 44.6 | 44.6 | 828.6 | 828.6 |
| labourSlack | 0 | 15 | 44.6 | 44.6 | 828.6 | 828.6 |
| publicRecruitmentElasticity | 0 | 0.6 | 44.6 | 44.6 | 828.6 | 828.6 |
| baselineEmployment | 700000 | 1100000 | 44.6 | 44.6 | 828.6 | 828.6 |
| migrationResponse | 0 | 100 | 44.6 | 44.6 | 828.6 | 828.6 |
| migrantHouseholdSize | 1 | 3 | 44.6 | 44.6 | 828.6 | 828.6 |
| serviceCostPerResident | 0 | 30000 | 44.6 | 44.6 | 828.6 | 828.6 |

## Separate deliberately enabled experiment

This inspection configuration enables linked responses and revenue feedback, classifies all additional expenditure as capital, and selects spare capacity. These are deliberately chosen experiments, not recommended estimates, and the complete settings are in model_audit.json.

| Control | Low | High | Year-25 annual at low | At high | Cumulative to year 25 at low | At high |
| --- | --- | --- | --- | --- | --- | --- |
| gNI | 0 | 7 | 70.7 | -63.4 | 1107.5 | -146.9 |
| baselineSpendingGrowth | -2 | 4 | 21 | 131.9 | 521.5 | 1726.2 |
| baselineRevenueGrowth | -2 | 4 | 56.9 | -10.2 | 980.3 | 251.5 |
| realInterest | 0 | 6 | 28.1 | 102.4 | 639.5 | 1342 |
| baselineGrowth | 0 | 4 | 15.9 | 68.5 | 506.3 | 1052.6 |
| reratingScope | 0 | 100 | 27.9 | 43.3 | 569.5 | 807.4 |
| reratingYears | 1 | 25 | 45.6 | 42 | 921 | 737.9 |
| businessUplift | 0 | 15 | 43.3 | 33.5 | 807.4 | 666 |
| labourUplift | 0 | 10 | 43.3 | 36.9 | 807.4 | 714.5 |
| ageing | 0 | 2 | 43.3 | 48.9 | 807.4 | 869 |
| taxAdjustmentShare | 0 | 100 | 43.3 | 40.4 | 807.4 | 748.4 |
| defenceSavingShare | 0 | 100 | 43.3 | 40.7 | 807.4 | 754.8 |
| taxShare | 0 | 60 | 44.6 | 42.4 | 828.6 | 792.1 |
| fundOpening | 0 | 100 | 43.3 | 40.3 | 807.4 | 772.2 |
| duplication | 0 | 1 | 42.9 | 44.6 | 799.3 | 831.4 |
| domesticRetention | 0 | 100 | 44.3 | 42.4 | 821.7 | 793.1 |
| demandRealisation | 0 | 100 | 44.3 | 42.4 | 821.7 | 793.1 |
| investment | 0 | 2.5 | 43.3 | 43.4 | 792.2 | 817.7 |
| centralSavingShare | 0 | 100 | 43.3 | 42.2 | 807.4 | 785.2 |
| publicCapitalRatio | 25 | 200 | 42.4 | 43.5 | 788.7 | 810.8 |
| transitionShock | 0 | 15 | 43.3 | 43.7 | 807.4 | 826.5 |
| publicCapitalElasticity | 0 | 0.25 | 43.7 | 42.9 | 814.3 | 797.8 |
| spareCapacity | 0 | 20 | 44.3 | 43.3 | 821.7 | 807.4 |
| welfareMPC | 0 | 1 | 44 | 43.2 | 817.3 | 804.9 |
| investmentEfficiency | 0 | 100 | 43.7 | 43.3 | 814.3 | 805.7 |
| payMPC | 0 | 1 | 43.6 | 43.2 | 811.7 | 804.5 |
| investmentCapitalShare | 0 | 100 | 43.7 | 43.3 | 814.3 | 807.4 |
| payDisposableShare | 0 | 100 | 43.6 | 43.2 | 811.7 | 805 |
| capitalDepreciation | 0 | 10 | 43.1 | 43.5 | 804.8 | 809.6 |
| investmentLag | 0 | 10 | 43.3 | 43.3 | 806.7 | 810.2 |
| fundContribution | 0 | 5 | 43.3 | 43.3 | 807.4 | 808.5 |
| pensionTransferYears | 1 | 60 | 43.3 | 43.3 | 807.4 | 807.4 |
| southGrowth | 0 | 4 | 43.3 | 43.3 | 807.4 | 807.4 |
| discountRate | 0 | 6 | 43.3 | 43.3 | 807.4 | 807.4 |
| ageSensitiveSpending | 0 | 15 | 43.3 | 43.3 | 807.4 | 807.4 |
| outputCeiling | 0 | 4 | 43.3 | 43.3 | 807.4 | 807.4 |
| privateMaturity | 1 | 20 | 43.3 | 43.3 | 807.4 | 807.4 |
| privateRecovery | 1 | 15 | 43.3 | 43.3 | 807.4 | 807.4 |
| fundReturn | -10 | 8 | 43.3 | 43.3 | 807.4 | 807.4 |
| fundContributionYears | 1 | 25 | 43.3 | 43.3 | 807.4 | 807.4 |
| fundDrawCap | 0 | 15 | 43.3 | 43.3 | 807.4 | 807.4 |
| privateCapitalRatio | 50 | 300 | 43.3 | 43.3 | 807.4 | 807.4 |
| privateCrowdIn | 0 | 3 | 43.3 | 43.3 | 807.4 | 807.4 |
| privateAdjustment | 1 | 15 | 43.3 | 43.3 | 807.4 | 807.4 |
| privateCapitalElasticity | 0 | 0.6 | 43.3 | 43.3 | 807.4 | 807.4 |
| publicPayBase | 5 | 20 | 43.3 | 43.3 | 807.4 | 807.4 |
| wageSpillover | 0 | 100 | 43.3 | 43.3 | 807.4 | 807.4 |
| labourSupplyElasticity | 0 | 0.6 | 43.3 | 43.3 | 807.4 | 807.4 |
| welfareIncomeElasticity | 0 | 0.3 | 43.3 | 43.3 | 807.4 | 807.4 |
| labourDemandElasticity | 0 | 1 | 43.3 | 43.3 | 807.4 | 807.4 |
| labourSlack | 0 | 15 | 43.3 | 43.3 | 807.4 | 807.4 |
| publicRecruitmentElasticity | 0 | 0.6 | 43.3 | 43.3 | 807.4 | 807.4 |
| baselineEmployment | 700000 | 1100000 | 43.3 | 43.3 | 807.4 | 807.4 |
| migrationResponse | 0 | 100 | 43.3 | 43.3 | 807.4 | 807.4 |
| migrantHouseholdSize | 1 | 3 | 43.3 | 43.3 | 807.4 | 807.4 |
| serviceCostPerResident | 0 | 30000 | 43.3 | 43.3 | 807.4 | 807.4 |

## Reproduction and limits

Run `npm run build:scenario` and `npm test`. Reproduce a downloaded browser run with `node scripts/reproduce_run.mjs /absolute/path/reunification_scenario.json`.

The previous model and audit are archived in research/model_snapshots. Earlier pension-correction figures describe that historical build, not this revised default.

Mechanical checks cannot validate behavioural coefficients or a negotiated settlement. Updated official fiscal cells, actuarial work and programme-level costings remain necessary.

Model SHA-256 `24968ec1ae0e7def373db841df88f7fd928ddf31a4b046e4b55f3f50aab29f2f`

## Sources

- [Executable model](../simulator/scenario_model.mjs), [complete register](../simulator/model_reference.json) and [audit data with exact settings](../simulator/model_audit.json)
- [Calibration and reconciliation](../data/simulator_calibration.json) and [source verification](../data/price_source_audit.json)
- [Frozen project bridge](../data/rebased.json), retained pending the official update
- [Doyle 2025 supplied full text](https://all-islandeconomy.com/wp-content/uploads/2025/06/21614_Public_Finances_UPDATED.pdf), Tables 1 to 3 and printed page 23. [Original report](https://all-islandeconomy.com/wp-content/uploads/2025/06/21614_Public_Finances_UPDATED.pdf)
- [FitzGerald and Morgenroth 2024](https://www.iiea.com/images/uploads/resources/Northern_Ireland_Subvention_Possible_Unification_Effects.pdf), Tables 6 and 7, original sterling columns
- [ONS L8GG](https://www.ons.gov.uk/economy/grossdomesticproductgdp/timeseries/l8gg/pn2), recorded 13 August 2026 vintage
- [Bundesbank annual ECB sterling rate](https://statistiken.bundesbank.de/statistiken-de/zeitreihen/BBEX3/A.GBP.EUR.BB.AC.A04)
- [CSO Annual National Accounts 2023](https://www.cso.ie/en/releasesandpublications/ep/p-ana/annualnationalaccounts2023/keyfindings/)
- [Bom and Ligthart](https://doi.org/10.1111/joes.12037), external capital benchmark
