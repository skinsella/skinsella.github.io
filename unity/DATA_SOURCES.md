# Data sources and transformations

All fiscal outputs use a common 2023 price base. The simulator is a scenario model, not a forecast.

## Fiscal starting point

| Input | Model value | Source | Treatment |
|---|---:|---|---|
| Northern net fiscal deficit | €16.58bn | ONS Country and Regional Public Sector Finances, financial year ending 2023 | £14.22bn converted at £1 to €1.165 |
| Legacy state pensions | €6.67bn | Doyle and UUEPC 2025 waterfall | Negotiated switch |
| Allocated UK debt interest | €4.12bn | Doyle and UUEPC 2025 waterfall | Negotiated switch |
| Net defence adjustment | €1.59bn | Doyle and UUEPC 2025 waterfall | Study settlement assumption |
| Other non-identifiable and outside-UK spending | €0.67bn | Doyle and UUEPC 2025 waterfall | Study settlement assumption |
| Additional Northern tax attribution | €1.79bn | Doyle and UUEPC 2025 waterfall | Study-derived re-attribution |
| Residual inherited core | €1.74bn | Model arithmetic | Result of the documented bridge |

## ONS identifiable service bases

The model uses table 2 of the ONS 2022 to 2023 Northern Ireland expenditure workbook. Values are nominal £ billion and are converted at £1 to €1.165.

| Service | ONS value | Model euro base | Use |
|---|---:|---:|---|
| Health | £6.181bn | €7.20bn | Base for an explicit health-service uplift |
| Education and training | £3.427bn | €3.99bn | Base for an explicit education-service uplift |
| Social protection | £10.658bn | €12.42bn | Reference base, with harmonisation represented through rerating |
| General public services | £0.525bn | €0.61bn | Base for an explicit administration uplift |

The default service uplift is zero. The data establish the spending bases but do not establish the additional spending needed to equalise service quality. A non-zero uplift is therefore a user-selected scenario, not an empirical estimate.

The revised module separates the desired share of an observed outcome gap from the assumed cost of closing each percentage point. Unit-cost anchors are obtained by dividing ONS identifiable spending by the relevant NISRA population. The default outcome targets remain zero until comparable health, education and administrative outcome series are approved.

## Growth and productivity

| Path | Northern rate | Southern rate | Evidence status |
|---|---:|---:|---|
| Historical trend | 1.3% | 2.5% | Northern average reported by Doyle and UUEPC for 2000 to 2024 |
| Prudent convergence default | 3.5% | 2.5% | One-point productivity premium used as a conservative scenario |
| Conditional convergence upside | 4.5% | 2.5% | Two-point convergence benchmark associated with the regional convergence literature |

The growth control is interpreted as productivity per worker. The separate employment gain defaults to zero so the central path does not automatically count an employment dividend in addition to productivity growth.

ESRI Research Series 152 supplies evidence on the scale and drivers of the North-South productivity gap. It does not supply a forecast of post-unification productivity growth. ESRI Research Series 203 supplies a more recent descriptive comparison and cautions that the two economies are not fully like-for-like.

## Population

- Northern starting population and broad age shares use NISRA 2024 mid-year estimates
- Republic starting population and age groups use CSO Census and projection inputs
- Births, migration, ageing and cohort transitions after the starting year are scenario equations rather than official projections

## Financing

- The interest rate is a user-selected scenario
- Interest is charged on opening transition debt and included in annual and cumulative fiscal cost
- The borrowing share divides positive annual cost between new debt and contemporaneous taxation
- The model does not estimate the macroeconomic effects of that taxation

The revised model applies a lagged output loss to the contemporaneously tax-funded share. The default multiplier is 0.5, matching the approximate overall deficit multiplier historically used by the Department of Finance and discussed by the Irish Fiscal Advisory Council. The Council stresses that Irish multiplier estimates vary widely and have limited medium-run significance, so this remains a stress parameter rather than a settled coefficient.

## Transition investment

- Annual transition investment enters a delivery pipeline
- The default delivery lag is three years
- Mature investment adds to a productive capital stock
- The stock depreciates at 4 per cent annually
- The default annual output return is 8 per cent of the mature stock
- The resulting output is taxed at the model's 35 per cent revenue share

The lag, depreciation and return are explicit scenario calibrations. They are not estimates of a specific all-island investment programme.

## Pensions and negotiated liabilities

- The binary pension and debt switches have been replaced by UK responsibility shares from zero to 100 per cent
- The Irish pension accrual schedule defaults to the study's €115 million annual increment over 40 years
- Any legacy share not retained by the UK transfers immediately to the Irish fiscal account
- The same proportional treatment applies to allocated UK debt interest

These shares describe possible settlements without assigning probabilities to them.

## One-off implementation plan

The one-off envelope is allocated across a planning template rather than spread evenly.

- Constitutional, legal and treaty work at 15 per cent over years one and two
- Digital identity and data migration at 30 per cent over years one to five
- Tax, payroll and benefit systems at 25 per cent over years one to five
- Regulatory and institutional integration at 20 per cent over years one to eight
- Delivery contingency at 10 per cent over years one to eight

The shares and timing are planning assumptions. The envelope defaults to zero until departmental workstreams produce costed estimates.

## Five-year demographic bands

The Northern block now begins with the 21 five-year age bands in the NISRA 2024-based principal population projection. The model advances those bands annually, including ageing, band-specific mortality and age-weighted migration. The Southern block remains broader pending a harmonised five-year input series.

## Inputs that remain unsourced scenarios

- Service outcome targets and the cost per percentage point of gap closure
- One-off administrative transition envelope
- Administrative duplication costs
- The return from transition investment
- Behavioural tax responses
- The outcome of pension and debt negotiations

These inputs default to zero or remain clearly labelled switches where the available evidence does not justify a point estimate.

## Primary links

- ONS Country and Regional Public Sector Finances  
  https://www.ons.gov.uk/releases/countryandregionalpublicsectorfinancesuk
- ONS expenditure tables  
  https://www.ons.gov.uk/economy/governmentpublicsectorandtaxes/publicsectorfinance/datasets/countryandregionalpublicsectorfinancesexpendituretables
- ESRI Research Series 152  
  https://www.esri.ie/publications/modelling-productivity-levels-in-ireland-and-northern-ireland
- ESRI Research Series 203  
  https://www.esri.ie/publications/economic-overview-of-ireland-and-northern-ireland
- CSO Population and Labour Force Projections 2023 to 2057  
  https://www.cso.ie/en/releasesandpublications/ep/p-plfp/populationandlabourforceprojections2023-2057/populationprojectionsresults/
- NISRA 2024 mid-year population estimates  
  https://datavis.nisra.gov.uk/population/2024-mid-year-estimates-for-northern-ireland.html
- NISRA 2024-based population projections  
  https://www.nisra.gov.uk/publications/2024-based-population-projections-northern-ireland
- Irish Fiscal Advisory Council spending multipliers  
  https://www.fiscalcouncil.ie/irelands-spending-multipliers/
- Doyle and UUEPC 2025  
  https://all-islandeconomy.com/wp-content/uploads/2025/06/21614_Public_Finances_UPDATED.pdf
