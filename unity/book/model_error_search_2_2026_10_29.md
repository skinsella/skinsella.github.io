# Second search for errors like the harmonisation error

Prepared by Claude for Stephen on 29 October 2026. It follows book/model_error_search_2026_10_29.md, which found seven issues, and looks for anything that search missed.

Nothing in the model has been changed. The new checks can be rerun with `node research/paper_runs/audit_extra.mjs`.

## Summary

| # | Finding | Direction | Size | Type |
| --- | --- | --- | --- | --- |
| 1 | The €1.84bn tax addition is described wrongly in the paper, and one part was misread from its source | Overstates receipts slightly. The description overstates how solid the figure is | €0.03bn from the misreading. €1.24bn of the €1.84bn is not "taxes recorded elsewhere" | Source misread, like the harmonisation error |
| 2 | The 80% debt ceiling compares State debt with the Republic's income only | Overstates the debt ratio after unity | Year-25 debt falls by about a fifth when Northern Ireland output is added, and the rate-based and lower cases never breach the ceiling | Definition choice that changes conclusions |
| 3 | The engine silently ignores custom harmonisation settings unless the case is set to custom | No current result affected | Any script that forgets the flag gets the upper case | Code hazard |
| 4 | The pension transfer follows Doyle's linear arithmetic but not his starting figure | Overstates cost on the favourable deal | Adds to finding 1 of the first search | Source used only in part |
| 5 | Year 1 uses a Republic GNI* well below the 2024 outturn | Overstates every share of GNI* in early years | Not yet sized | Calendar and data vintage |
| 6 | EU grants can be counted as a benefit, but the larger Irish EU contribution is never counted as a cost | Understates cost | Not yet sized | One-sided treatment |
| 7 | Two smaller points in the paper and the rate-based case | Small | Small | Description and source check |

## 1. The tax addition

The model adds €1.84 billion to Northern Ireland receipts. The paper describes all of it as "taxes raised in Northern Ireland but recorded elsewhere", but it has three parts, all from Doyle (2025) Table 2.

| Part | £m in Doyle | Model, €bn | What it is |
| --- | --- | --- | --- |
| Head-office effect of London-based companies | 500 | 0.60 | Corporation tax booked in Britain. This is the only part that is recorded elsewhere |
| Tax from central spending moved to Ireland | 265 | 0.32 | New tax from civil service jobs assumed to relocate |
| Irish income tax and PRSI | 769 | 0.92 | The effect of applying the Irish tax code to Northern Ireland incomes |

**The £769 million is not sterling.** Doyle takes it from Tomlinson (2022), whose Table 9 and text give €769 million in PPP-adjusted euros for 2019. Doyle enters it in a sterling table without conversion and says he does not adjust it for inflation, and the model then converts it as 2022-23 pounds.

Read correctly, it is about €0.89 billion in 2023 prices rather than €0.92 billion. The difference is small, but it is the same kind of error as the harmonisation gap, a source figure read as something it is not.

**The first search's finding 7 needs correcting.** Tomlinson's figure is already net within income tax and social insurance. It includes lower PRSI for low and middle earners and higher Irish employer contributions.

What it leaves out is VAT, corporation tax, excise and property tax. Tomlinson also says it may overstate income tax, because it ignores joint assessment for couples and pension relief.

**The head-office effect** is a 2019 estimate of UK corporation tax (FitzGerald and Morgenroth, 2019). After unity Northern Ireland would be under Irish corporation tax, so the figure measures the wrong regime.

**Recommended wording for the paper** is "add €1.84 billion of receipts identified by Doyle (2025), mainly from applying the Irish income tax code and from company profits booked in Britain".

## 2. The debt ceiling denominator

Total State debt after unity is divided by the Republic's GNI* alone, with no allowance for Northern Ireland's income. The paper discloses that ratios use the Republic's GNI*, but the debt check is presented as a ceiling on the debt of the State.

Adding Northern Ireland's output to the denominator changes the results. Northern Ireland output is measured as GDP, so the comparison is approximate.

| Case | Total debt in year 25, Republic GNI* | Total debt in year 25, plus NI output | Ceiling first reached | Burden in year 25, Republic GNI* | Burden in year 25, plus NI output |
| --- | --- | --- | --- | --- | --- |
| Upper | 140.2% | 112.2% | Year 10, or year 15 | 5.35% | 4.28% |
| Middle | 121.2% | 97.0% | Year 12, or year 18 | 4.04% | 3.23% |
| Rate-based | 83.8% | 67.0% | Year 21, or never | 1.35% | 1.08% |
| Lower | 80.5% | 64.4% | Year 25, or never | 1.12% | 0.89% |

Managed Integration, favourable deal, 2% growth. Both measures can be defended, because the burden on Republic taxpayers suits the Republic's income and the sustainability of State debt suits the whole State's income.

The paper should say which question each check answers. A good option is to keep the Republic measure for the burden check and use the all-island measure for the debt check, or to report both.

## 3. Custom harmonisation settings are silently ignored

Since Codex added named cases, the engine reads `payGapPct`, `welfareGapPct` and the two offsets only when `harmonisationCase` is `custom`. Otherwise the named case wins, and the default case is upper.

Passing zero pay and welfare gaps without the flag returns the upper case. Managed Integration in year 25 shows the same cost either way, €34.5 billion under the default settings, and no error is raised.

All current paper runs use the shared presets, and the four-case results match to 1e-6, so no published number is affected. The fix is for validation to reject custom fields that conflict with a named case.

## 4. Pensions follow Doyle's arithmetic but not his starting figure

The first search called the t/40 pension share an error against the model's own pro-rata rule. In fact Doyle's own Table 3 uses the same linear arithmetic, one fortieth of the total pension bill in each year, even though his text describes pro-rata rights.

So the model copies Doyle's simplification, which overstates the Republic's share as the first search showed. Doyle also starts from £4.4 billion, because HM Treasury expects the public service pension top-up to fall by over 75%, while the model starts from £5.722 billion and grows the whole amount with the over-65 population.

Scaling the year-25 pension cost in proportion to Doyle's starting figure would cut it by about €1.8 billion on the favourable deal. That is Claude's rough inference, not a model run, and it overlaps with the pro-rata correction.

## 5. Republic GNI* in year 1

The model grows the CSO's 2023 GNI* of €290.9 billion at 2% a year in real terms, so year 1 is about €297 billion in 2023 prices. The CSO's 2024 outturn is €321 billion at current prices, a nominal rise of about 10%.

Real GNI* growth in 2024 was well above 2%. If so, every ratio to GNI* in the early years is a little too high, which adds to the calendar point in the first search.

The 2024 GNI* deflator is needed to size this. Claude has not checked it.

## 6. EU contribution

The benefit channels can count EU grants as a gain to the Republic. A united Ireland would also pay a larger EU budget contribution, because its national income would include Northern Ireland's.

The ONS figures include a share of the UK's spending outside the UK, and Doyle keeps £311 million of it. It is not clear that this covers an EU contribution on Northern Ireland's income.

This should be sized from Department of Finance figures before any EU benefit is shown. Today the EU channel is set to nil in the central results, so the published numbers omit both sides.

## 7. Smaller points

- **Paper description.** The paper says the €0.69 billion removed is "other non-identifiable central spending", but €0.48 billion of it is Doyle's reduction in spending outside the UK. Suggested wording is "spending outside the UK and other central spending".
- **Child benefit.** The rate-based case uses Tomlinson's £130 million to bring Northern Ireland child benefit up to the Republic's rate. His own Table 3 puts the Republic's rate 40% to 80% higher in purchasing power, so the figure looks low against the size of Northern Ireland's child benefit bill. That is an inference to check against HM Treasury's outturn before the paper relies on it.

## What was checked and found sound

- Northern Ireland GDP of £63.265 billion in 2023 matches ONS regional accounts, and GNI* of €290.9 billion matches the CSO's €291 billion.
- With no harmonisation, spending or growth, the year-1 cost equals the inherited deficit plus one fortieth of pensions, so the accounts add up.
- The Shared Island row in the scenario table, €0.5 billion in year 1 and €0.1 billion in year 25, matches the engine.
- The four-case paper results are reproduced exactly by the shared presets.
- The first search's alternative runs reproduce when rerun.

## Stephen's decisions, 29 October 2026, and what was done

1. **Paper wording.** Corrected in paper version 3.7, and the Figure 3 bridge is redrawn with the new labels.
2. **Debt ceiling.** The debt check now divides total State debt by Republic GNI* plus Northern Ireland output. The burden check stays on Republic GNI*.
3. **Conflicting settings.** Passed to Codex in book/codex_note_model_decisions_2026_10_29.md.
4. **Pensions.** The envelope now starts from Doyle's £4.4 billion. The £1.3 billion fall comes off both the pension bill and the published deficit, so the deficit left if the UK keeps pensions and debt is unchanged at €1.78 billion.
5. **Sourcing.** Both items are sourced and sized below. Neither is yet built into the model.

### Republic GNI* in 2024

The CSO gives real GNI* of €305.4 billion in 2024 in 2023 prices, up 4.8%. The model's year 1 is €296.7 billion, so it is 2.9% too low.

Using the outturn lowers Managed Integration's year-25 debt ratio by about 1 point in the upper case and less in the others, and the year-25 burden by about 3%. No check result changes.

### EU contribution

Ireland paid €3.683 billion to the EU budget in 2023. That is 0.72% of 2023 GDP and 1.26% of GNI*, which brackets the contribution on Northern Ireland's income.

| Case | Year 25 cost, €bn, now | With 0.72% of NI output | With 1.26% of NI output | Debt in year 25, now | With 1.26% |
| --- | --- | --- | --- | --- | --- |
| Upper | 23.0 | 24.3 | 25.2 | 107.7% | 114.0% |
| Middle | 16.7 | 18.0 | 18.9 | 92.4% | 98.7% |
| Rate-based | 4.2 | 5.4 | 6.4 | 63.0% | 69.3% |
| Lower | 3.1 | 4.4 | 5.3 | 60.5% | 66.8% |

Managed Integration, favourable deal, 2% growth. The first-year cost rises by €0.5 billion to €0.9 billion, and the rate-based and lower cases still never reach the ceiling.

These are gross figures. EU receipts in Northern Ireland, such as farm payments now funded by the UK, would offset part of the cost but are not yet sized. Claude recommends adding the contribution as a cost line, with receipts beside it, before the paper is final.

## Decisions put to Stephen

1. Whether to correct the paper's description of the tax addition and the €0.69 billion, as in sections 1 and 7.
2. Which denominator the debt ceiling should use, or whether to report both.
3. Whether Codex should make the engine reject conflicting harmonisation settings.
4. Whether to start the pension envelope from Doyle's £4.4 billion, alongside the pro-rata question from the first search.
5. Whether to source the 2024 GNI* deflator and the EU contribution before the paper is final.

## Sources

- [Doyle, The Projected Public Finances of the Early Years of a United Ireland, 2025](https://all-islandeconomy.com/wp-content/uploads/2025/06/21614_Public_Finances_UPDATED.pdf), Tables 2 and 3, research/pdf_text/doyle_2025.txt
- [Tomlinson, Social Security in a Unified Ireland, 2022](https://muse.jhu.edu/article/853103), Tables 3, 9 and 10, research/pdf_text/tomlinson_2022.txt
- [ONS, Regional economic activity by gross domestic product, UK, 1998 to 2023](https://www.ons.gov.uk/economy/grossdomesticproductgdp/bulletins/regionaleconomicactivitybygrossdomesticproductuk/1998to2023)
- [CSO, Annual National Accounts 2024, GNI and de-globalised results](https://www.cso.ie/en/releasesandpublications/ep/p-ana/annualnationalaccounts2024/gniandde-globalisedresults)
- [Dáil written answer on Ireland's payments to the EU budget, 9 April 2024](https://www.oireachtas.ie/en/debates/question/2024-04-09/272/)
