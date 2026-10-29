# A rate-based welfare gap

Prepared 29 October 2026 at Stephen's request. This builds a welfare gap from published rate comparisons, benefit by benefit, as a candidate replacement for the FitzGerald and Morgenroth (F&M) welfare gap used in the upper and middle cases.

## Why a new estimate is needed

F&M (2024) apply the ratio of average pension payments South and North to the whole Northern Ireland welfare bill. That gives a 50% uplift, about €6.6 billion a year in 2023 euros at full parity.

The average Northern Ireland pension is held down by people on the older basic pension and by incomplete contribution records. Applying a pension ratio to disability, family and housing payments has no basis in their rates.

## Components

| Benefit area | Northern Ireland spending, 2019/20, £m (Tomlinson Table 10) | Rate-based gap, € billion, 2023 prices | Source and treatment |
| --- | --- | --- | --- |
| State pensions | 3,278 | 0.381 gross, 0.343 after tax | Doyle (2025). Raising the new UK state pension and pension credit to Irish contributory and non-contributory rates, about €20 and €12 a week more. Price basis not stated |
| Incapacity, disability and injury | 2,721 | 0 | Doyle (2025) finds payments "not much different" North and South once Personal Independence Payment is counted |
| Family and children | 1,615 | 0.177 | Tomlinson (2022) child benefit supplement of £130m to raise Northern Ireland child benefit to the Southern value, rebased from 2019 at the model's sterling factor |
| Housing | 479 | 0 | Kept at current cost, as in Tomlinson |
| Survivors | 88 | 0 | Kept at current cost, as in Tomlinson |
| Unemployment | 43 | 0 | Southern rates are higher, but few people claim, and neither study gives a cost |
| **Total** | **8,224** | **0.558 gross, 0.520 net** | |

In model terms this is `welfareGapPct` = 4.26% of the F&M 2019 welfare bill, with `welfareTaxOffset` = 6.8%. F&M's equivalent is 50.0% with no offset.

## Results

Rate-based case, 2% Northern Ireland growth, with Doyle's pay gap net of tax as in the middle case. Run with `node research/paper_runs/rate_based_welfare.mjs`.

| Managed Integration | Upper | Middle | Rate-based | Lower |
| --- | --- | --- | --- | --- |
| Favourable deal, year 1, €bn | 4.3 | 4.1 | 3.7 | 3.7 |
| Favourable deal, year 25, €bn | 25.5 | 19.3 | 6.4 | 5.3 |
| Total debt in year 25, % of GNI* | 140.2% | 121.2% | 83.8% | 80.5% |
| Debt check first fails | Year 10 | Year 12 | Year 21 | Year 25 |
| Growth needed to repay | 4.7% | 4.5% | 3.2% | 3.1% |
| Growth needed to pass all three checks | 4.3% | 3.6% | 2.2% | 2.1% |
| Adverse deal, year 25, €bn | 41.2 | 34.9 | 22.1 | 21.0 |

Across the four designs on the favourable deal, the rate-based case needs growth of 3.1% to 3.4% to repay, and 2.2% to 2.4% to pass all three checks. Immediate parity under Unitary gives a gross gain of about €2,600 per Northern Ireland resident in year one, close to the 2023 household income gap of about 2,500 PPS per person.

## Why it may be too low

- **Older pensioners.** Doyle assumes most pensioners are on the new state pension by the time of unity. Topping up those still on the older basic pension would cost more.
- **Irish extra benefits.** Fuel Allowance, the Household Benefits Package, Free Travel and the Working Family Payment are not costed, and some of them could be material.
- **Taxation of benefits.** Only Doyle's pension tax adjustment is counted, and the Irish treatment of other benefits is not applied.
- **Eligibility rules.** Applying Irish eligibility, not just Irish rates, to Northern Ireland caseloads could move costs either way, most of all for disability.

## Why it may be too high

- **Disability.** Tomlinson scales Northern Ireland disability spending down by about £444m, sharing conflict-related costs with Britain. That is a negotiation outcome, so it is not counted here.

## Source balance

Doyle and Tomlinson both argue that unity is more affordable than critics claim, and F&M's IIEA paper takes the opposite side. This case uses rate comparisons rather than conclusions, but a benefit-by-benefit costing through UKMOD and EUROMOD or SWITCH is still the right test.

## Decision for Stephen

Whether to replace the middle case's welfare gap with this rate-based gap. If so, the middle case's Managed Integration cost in year 25 falls from €19.3 billion to €6.4 billion, and the three cases would run from €25.5 billion to €5.3 billion with the middle case close to the lower one.

## Sources

- [FitzGerald and Morgenroth, Northern Ireland Subvention, Possible Unification Effects, IIEA, 2024](https://www.iiea.com/images/uploads/resources/Northern_Ireland_Subvention_Possible_Unification_Effects.pdf)
- [Doyle, The Projected Public Finances of the Early Years of a United Ireland, 2025](https://all-islandeconomy.com/wp-content/uploads/2025/06/21614_Public_Finances_UPDATED.pdf), pension equalisation and disability comparison, around lines 1225 to 1262 of research/pdf_text/doyle_2025.txt
- [Tomlinson, Social Security in a Unified Ireland, Irish Studies in International Affairs, 2022](https://muse.jhu.edu/article/853103), Tables 3 and 10
