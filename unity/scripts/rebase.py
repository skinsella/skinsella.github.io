"""Rebase every Irish-unification cost estimate to calendar-2023 euros.

Method (primary)
  Sterling figure for period t:  £_t * (UK deflator CY2023 / UK deflator t) * (EUR per GBP, 2023 avg)
  Euro figure for year t:        €_t * (Irish HICP 2023 / Irish HICP t)
Sources
  UK GDP implied deflator, ONS series L8GG (quarterly, released 13 Aug 2026)
  Irish HICP, Eurostat via FRED CP0000IEM086NEST (2025=100), annual means
  ECB reference rates, annual averages, Bundesbank table (as of 15 Oct 2026)
  Irish GNI* 2023 = EUR 290.9bn (CSO)
"""
import csv, json

Q = {  # ONS L8GG quarterly
 2013: None,
 2014: [71.0895, 71.0361, 71.8952, 71.6479],
 2015: [71.7935, 71.6715, 71.8873, 72.2345],
 2016: [72.5674, 72.6827, 73.4284, 73.8895],
 2017: [74.1407, 74.1260, 74.1281, 74.6936],
 2018: [74.9184, 75.5318, 75.9115, 76.5581],
 2019: [76.6540, 77.4590, 77.9213, 78.3396],
 2020: [78.9741, 84.8282, 81.4303, 80.8502],
 2021: [81.9262, 80.9917, 81.8839, 82.8966],
 2022: [84.0495, 85.7671, 87.1467, 89.3502],
 2023: [90.7406, 92.0952, 92.7667, 92.7151],
 2024: [94.0008, 95.1171, 96.5632, 97.1010],
 2025: [97.8963, 98.8341, 99.6595, 100.2156],
}
def uk_cy(y): return sum(Q[y]) / 4
def uk_fy(y):  # FY y/y+1 = Q2..Q4 of y + Q1 of y+1
    return (Q[y][1] + Q[y][2] + Q[y][3] + Q[y + 1][0]) / 4

HICP = {2014: 82.10, 2015: 82.07, 2016: 81.89, 2017: 82.10, 2018: 82.71, 2019: 83.43,
        2020: 83.04, 2021: 85.05, 2022: 91.92, 2023: 96.69, 2024: 97.98, 2025: 100.00}
GBP_PER_EUR = {2014: 0.80612, 2015: 0.72584, 2016: 0.81948, 2017: 0.87667, 2018: 0.88471,
               2019: 0.87777, 2020: 0.88970, 2021: 0.85960, 2022: 0.85276, 2023: 0.86979,
               2024: 0.84662, 2025: 0.85679}
EUR_PER_GBP_2023 = 1 / GBP_PER_EUR[2023]
GNI_STAR_2023 = 290.9
UK23 = uk_cy(2023)

def gbp(v, period):
    """period: ('cy', y) or ('fy', y) meaning FY y/y+1"""
    kind, y = period
    d = uk_cy(y) if kind == "cy" else uk_fy(y)
    return v * UK23 / d * EUR_PER_GBP_2023
def eur(v, y):
    return v * HICP[2023] / HICP[y]
def pct(v): return v / GNI_STAR_2023 * 100

print("Factors")
print(f"  EUR per GBP 2023 avg      {EUR_PER_GBP_2023:.5f}")
for lab, per in [("CY2014", ("cy", 2014)), ("FY2017-18", ("fy", 2017)), ("FY2018-19", ("fy", 2018)),
                 ("CY2019", ("cy", 2019)), ("FY2021-22", ("fy", 2021)), ("FY2022-23", ("fy", 2022)),
                 ("FY2023-24", ("fy", 2023))]:
    print(f"  £ {lab:10s} -> 2023 €   x{gbp(1, per):.5f}")
for y in [2015, 2018, 2019, 2025]:
    print(f"  € {y} -> 2023 €          x{eur(1, y):.5f}")

rows = []
def add(study, year_pub, measure, orig, unit, data_period, val2023, switch, kind, weight_class):
    rows.append(dict(study=study, pub=year_pub, measure=measure, original=orig, unit=unit,
                     data=data_period, eur2023=round(val2023, 2), pct_gni=round(pct(val2023), 2),
                     switch=switch, kind=kind, quality=weight_class))

# --- McGuinness & Bergin (IZA DP 2019 / Cambridge J Econ 2020): implied residual after non-identifiables
add("McGuinness & Bergin", "2019/2020", "Subvention less non-identifiable spending (implied)",
    9.16 - 2.381, "£bn", "2014", gbp(9.16 - 2.381, ("cy", 2014)), "Dublin takes pensions, UK keeps debt", "annual", "High")
# --- McGuinness & Bergin ESRI bulletin 2020: 25% reduction of £9.2bn (2017-18)
add("McGuinness & Bergin (ESRI bulletin)", "2020", "Subvention less 25% non-continuing items",
    9.2 * 0.75, "£bn", "FY2017-18", gbp(9.2 * 0.75, ("fy", 2017)), "Dublin takes pensions, UK keeps debt", "annual", "Medium")
# --- Doyle 2021
add("Doyle", "2021", "Transferring deficit", 2.4, "£bn", "FY2018-19",
    gbp(2.4, ("fy", 2018)), "UK keeps pensions and debt", "annual", "High")
# --- FitzGerald & Morgenroth 2019 data (JSSISI 2019, IIEA 2024). Euro figures were converted at 2019 rate.
r19 = 1 / GBP_PER_EUR[2019]
fm = {"Base, Dublin takes pensions and debt": 10.910,
      "Base excluding pensions": 8.203,
      "Base excluding debt interest": 0.044 * (10.910 / 0.052),
      "Base plus immediate rerating": 20.625}
for k, v in fm.items():
    sw = {"Base, Dublin takes pensions and debt": "Dublin takes pensions and debt",
          "Base excluding pensions": "UK keeps pensions, Dublin takes debt",
          "Base excluding debt interest": "Dublin takes pensions, UK keeps debt",
          "Base plus immediate rerating": "Dublin takes both, immediate rerating"}[k]
    add("FitzGerald & Morgenroth", "2019/2024", k, round(v, 3), "€bn (2019)", "2019",
        gbp(v / r19, ("cy", 2019)), sw, "annual", "High" if "rerating" not in k else "High")
# --- Birnie 2023
add("Birnie", "2023", "Doyle method replicated", 6.8, "£bn", "FY2021-22", gbp(6.8, ("fy", 2021)),
    "UK keeps pensions and debt, fewer deductions", "annual", "High")
add("Birnie", "2023", "Assumptions relaxed", 12.6, "£bn", "FY2021-22", gbp(12.6, ("fy", 2021)),
    "Dublin takes most liabilities", "annual", "High")
add("Birnie", "2023", "Doyle 2018-19 reworked, low", 3.6, "£bn", "FY2018-19", gbp(3.6, ("fy", 2018)),
    "range", "annual", "High")
add("Birnie", "2023", "Doyle 2018-19 reworked, high", 8.8, "£bn", "FY2018-19", gbp(8.8, ("fy", 2018)),
    "range", "annual", "High")
# --- Doyle & UUEPC 2025, and Doyle 2026 (ISIA). Inherited deficit £1.487bn on ONS FY2022-23 (assumed).
inh = gbp(1.487, ("fy", 2022))
extras_2025eur = 1.0 + 0.152 + 0.115   # investment, pay step, pension step, euro amounts at 2025 prices (assumed)
y1 = inh + eur(extras_2025eur, 2025)
add("Doyle & UUEPC", "2025", "Inherited deficit", 1.487, "£bn", "FY2022-23", inh, "UK keeps pensions and debt", "annual", "Medium-High")
add("Doyle & UUEPC", "2025", "Year-one cost incl. €1bn investment", 3.017, "€bn mixed", "FY2022-23 + 2025 €", y1,
    "UK keeps pensions and debt", "annual", "Medium-High")
add("Doyle (ISIA)", "2026", "Inherited deficit, most likely", 1.5, "£bn", "FY2022-23 (assumed)",
    gbp(1.5, ("fy", 2022)), "UK keeps pensions and debt", "annual", "High")
# --- Hübner / KLC (benefits)
add("Hübner / KLC", "2015", "All-island GDP gain, 8 years (benefit)", 35.6, "€bn (2015)", "2015", eur(35.6, 2015),
    "n/a, benefit", "cumulative benefit", "Low")
add("Hübner & van Nieuwkoop / KLC", "2018", "Subvention assumed borne by Dublin", 11.4, "€bn (2018)", "2018",
    eur(11.4, 2018), "Dublin takes all", "annual", "Low")
add("Hübner & van Nieuwkoop / KLC", "2018", "NI gain to 2025 (benefit)", 17.9, "€bn (2018)", "2018",
    eur(17.9, 2018), "n/a, benefit", "cumulative benefit", "Low")
# --- Chadwick 2026 (blog, grey literature). 2026 euros, deflated with 2025 HICP as proxy.
add("Chadwick (blog)", "2026", "Year-one cost", 3.8, "€bn (2026)", "2026", eur(3.8, 2025),
    "Dublin takes pensions, pay equalised over 3 yrs", "annual", "Grey")
add("Chadwick (blog)", "2026", "20-year cumulative", 55, "€bn (2026)", "2026", eur(55, 2025),
    "same", "cumulative cost", "Grey")

print("\nRebased estimates (2023 €bn, % of 2023 GNI*)")
for r in rows:
    print(f"  {r['study'][:32]:32s} {r['measure'][:42]:42s} {r['original']:>8} {r['unit']:12s} -> €{r['eur2023']:6.2f}bn  {r['pct_gni']:5.2f}%")

# --- Waterfall in 2023 euros from Doyle & UUEPC (£m, FY2022-23 assumed)
f22 = gbp(1, ("fy", 2022))
wf = [("ONS published deficit", 14.220), ("UK keeps state pensions", -5.722), ("UK keeps debt interest", -3.533),
      ("UK defence, net of Irish uplift", -1.367), ("Out-of-UK spending", -0.400),
      ("Non-identifiable central spending", -0.177), ("Tax-system and HQ additions", -1.534)]
print("\nWaterfall, 2023 €bn")
run = 0
for k, v in wf:
    e = v * f22
    run += e
    print(f"  {k:36s} {e:7.2f}   running {run:6.2f}")
print(f"  residual inherited deficit           {run:6.2f}  ({pct(run):.2f}% GNI*)")

pens = 5.722 * f22; debt = 3.533 * f22
rerate = gbp((20.625 - 10.910) / r19, ("cy", 2019))
inv = eur(1.0, 2025); pay1 = eur(0.152, 2025); pen1 = eur(0.115, 2025)
print(f"\nAdd-backs, 2023 €bn: pensions {pens:.2f}, debt {debt:.2f}, full rerating {rerate:.2f}, "
      f"investment {inv:.2f}, pay step {pay1:.3f}, pension step {pen1:.3f}")

cells = {
 "UK keeps pensions and debt, phased rerating (Doyle)": run + inv + pay1 + pen1,
 "Dublin takes pensions only, phased": run + inv + pay1 + pens,
 "Dublin takes debt only, phased": run + inv + pay1 + pen1 + debt,
 "Dublin takes pensions and debt, phased": run + inv + pay1 + pens + debt,
 "Dublin takes both, immediate full rerating, no investment": run + pens + debt + rerate,
}
print("\nSwitch matrix, year one, 2023 €bn")
for k, v in cells.items():
    print(f"  {k:62s} €{v:6.2f}bn  {pct(v):5.2f}%")
spread = cells["Dublin takes both, immediate full rerating, no investment"] - run
print(f"\nSpread from residual to full pessimist case {spread:.2f}: rerating {rerate/spread:.1%}, "
      f"pensions {pens/spread:.1%}, debt {debt/spread:.1%}")
fm_reb = gbp(20.625 / r19, ("cy", 2019))
print(f"Cross-check: F&M base+rerating rebased €{fm_reb:.2f}bn vs bottom-up 2023 build €{cells['Dublin takes both, immediate full rerating, no investment']:.2f}bn")

# Method sensitivity
print("\nMethod sensitivity for F&M €20.625bn (2019)")
print(f"  UK deflator + 2023 FX (primary)   €{fm_reb:.2f}bn")
print(f"  Irish HICP on the euro figure     €{eur(20.625, 2019):.2f}bn")
print(f"  share of GNI* x 2023 GNI*         €{0.098 * GNI_STAR_2023:.2f}bn")
print("Simulator rate check: DCU/simulator used £1=€1.166 on FY2022-23 pounds;")
print(f"  strict 2023-euro factor is {f22:.4f}, so simulator constants are {(f22/1.166-1)*100:+.1f}% off")
print(f"  rerating constant: simulator 11.0 vs strict rebase {rerate:.2f}")

# Doyle scenario surpluses (2025 € -> 2023 €)
for k, v in [("Path A yr10 surplus", 6.8), ("Path B yr10 surplus", 3.6), ("Path C yr10 surplus", 0.8)]:
    print(f"  Doyle&UUEPC {k}: €{eur(v, 2025):.2f}bn")

json.dump(dict(rows=rows, waterfall=[(k, round(v * f22, 3)) for k, v in wf], residual=round(run, 3),
               addbacks=dict(pensions=round(pens, 3), debt=round(debt, 3), rerating=round(rerate, 3),
                             investment=round(inv, 3), pay=round(pay1, 3), pension_step=round(pen1, 3)),
               cells={k: round(v, 3) for k, v in cells.items()}),
          open("/tmp/claude-0/-home-claude/b56666ae-513d-5d12-b04b-2f21306a47dc/scratchpad/rebased.json", "w"), indent=1)
