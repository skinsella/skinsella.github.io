# Benefits extension implementation

The extension adds a whole-island comparison alongside fiscal repayment. It does not establish that any constitutional arrangement improves household welfare.

## Decisions recorded first

Stephen confirmed the comparison dates, debt ceiling and Budget 2027 baseline rule on 29 October 2026. The existing four-of-five pass rule is retained and the annual burden threshold stays unset.

These decisions were committed in `30bb478` before extension scenario results. An unset threshold is never a pass, so all four other tests must pass while the burden test remains pending.

## Accounting boundary

The component fiscal equations remain the default engine. An optional adapter supplies unrounded output, revenue and financing adjustments, and zero-channel runs reproduce every old annual field exactly.

UK transitional payments reduce Republic financing without changing Northern output or the domestic resource proxy. They are separate from retained pension and debt obligations, so the specification’s claim that the UK saves the entire allocated transfer is not adopted.

EU support is a net additional funding assumption. Its capital share finances an already-costed investment programme and uses the existing completion, efficiency and depreciation channel, without counting the same capital allocation twice.

Border gains enter as output level changes, discounted for prior Windsor gains and offset by a separate GB friction loss. General marginal receipts are applied to the net trade output change once.

FDI jobs are additional to the existing Northern employment intensity. Output excludes tax-booked profits by definition of the required input, receipts enter separately, and displacement reduces Republic output and receipts.

Integration savings require positive implementation spending. Savings must refer to identified functions additional to the chosen administration allowance, and the research inventory remains necessary to establish that boundary.

## New comparisons

The Northern measure adds output to net domestic public spending less receipts, per resident. It excludes allocated non-local defence, central costs and debt interest, but is still a broad resource proxy rather than a national-accounts income identity.

Public production may already be included in GDP. The proxy therefore cannot be read as household disposable income, a money-metric welfare gain or evidence on the distribution of benefits.

The island measure combines NI GDP-based output with Republic GNI*. It is explicitly an output proxy rather than a homogeneous island GDP series.

Budget 2027 Table 18 gives debt ratios of 56.4%, 56.3%, 56.2% and 54.9% for 2027 to 2030. The extension maps those ratios to model years one to four and holds the last ratio thereafter, applying them to the existing real GNI* denominator.

This mapping avoids adding nominal future debt to real transition borrowing. It remains a hybrid scenario overlay because the existing model retains its illustrative 2024 demographic normalisation and frozen fiscal source vintage.

Old-age dependency uses people aged 65 and over divided by people aged 15 to 64 in both jurisdictions. NISRA annual counts and CSO Table 2.4 knots are retained with explicit annual interpolation and source-horizon limits.

The UK path has independent reference growth and residual service-cost growth settings. A transfer withdrawal reduces residual domestic services, with no automatic output loss assumed, and every paired comparison must use the same UK path.

## Interface and publication

The story adds an assessment step after the growth test. It shows the selected future alongside the same design with growth capped at a selected 1.3%, which is not presented as a verified historical estimate.

The main fiscal controls pass their settings to the benefits controls through the link. Changes on the benefits page apply to that comparison and are not silently written back to the fiscal page.

All new benefits default to zero. Uncalibrated gains are disabled in public controls, while the code and synthetic tests expose their mechanisms for review.

The named A and B scenarios remain blocked. Their EU, FDI, integration and gravity calibrations are not supplied by the specification, and convergence-gated harmonisation has no defined decision rule.

No central values were invented and no scenario was tuned after seeing results. The paired runner requires an immutable settings commit, committed executable code, matching UK paths, an adverse twin and a model fingerprint before writing a result.

## Verification

The regression suite compares all old fields on 64 complete paths with new channels off. Synthetic channel tests check financing, trade arithmetic, FDI receipts and displacement, integration symmetry, capital allocation, debt ratios, age denominators and publication guards.

The old model’s income and expenditure measures remain conditional illustrations. Passing selected proxy tests is not a finding that reunification is beneficial or affordable.

## Sources

- [Budget 2027 Economic and Fiscal Outlook, Table 18](https://assets.gov.ie/static/documents/a1841801/Budget_2027_-_Budget_2027_-_Economic_and_Fiscal_Outlook.pdf)
- [NISRA source workbook](https://www.nisra.gov.uk/system/files/statistics/2026-04/NPP24_ppp_coc.xlsx)
- [CSO population projections, Table 2.4](https://www.cso.ie/en/releasesandpublications/ep/p-plfp/populationandlabourforceprojections2023-2057/populationprojectionsresults/)
- [Specification](model_spec_benefits_2026_10_29.md)
- [Decision register](decision_register.md)
