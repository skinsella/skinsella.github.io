---
title: "Notes to Self: Directed Acyclic Graphs"
date: 2008-11-04 11:21:41
categories:
  - UL
tags:
  - "Agricultural Economics"
  - "Directed acyclic graph"
  - "Directories"
  - "Dov Gabbay"
  - "Economic"
  - "Publications"
  - "Social Science"
  - "Universidad del CEMA"
---

A recent seminar presentation at UL by [Prof. Denis Jansen](http://econweb.tamu.edu/jansen/) and a conversation with[Dr Tom Arbuckle](http://www.csis.ul.ie/staff/TomArbuckle/) today convinced me that a better, more algorithmic way to establish statistical causality in a a connected system would be something like [directed acyclic graph](http://en.wikipedia.org/wiki/Directed_acyclic_graph) theory, so I'm putting these resources in one place while I get my thinking right on the matter.

**Definition**. A *directed acyclic graph* (DAG) is a [directed graph](http://en.wikipedia.org/wiki/Graph_%28mathematics%29) that contains no cycle.

Why is this useful for economists? Consider the standard [consumption function](http://en.wikipedia.org/wiki/Consumption_function), which looks like this:

![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_583fbd1f5359d9bc048cf8ded1023012.gif)

This just says output (

![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_57cec4137b614c87cb4e24a3d003a3e0.gif)

) is a linear combination of present consumption (

![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_0d61f8370cad1d412f80b84d143e1257.gif)

) times the [marginal propensity to consume](http://en.wikipedia.org/wiki/Marginal_propensity_to_consume) of out of present income, (

![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_7b7f9dbfea05c83784f8b85149852f08.gif)

), and the propensity to spend out of past income (

![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_372afb07b6ef2ceab57295d34fa3f594.gif)

).

But why should this causal structure hold? Why isn't there a non linear interaction between the various vectors being represented? Why not simply ask the data to help figure out statistical causality for us?

We can use a DAG to help us try. The DAG works because by imposing a DAG structure on, say, the columns of Ireland's National Accounts, it will give rise to a [partial order](http://en.wikipedia.org/wiki/Partial_order) 

![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_49dc1443f33cf63082d6e193dd2af78f.gif)

 on its vertices, where 

![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_676b9da4e88c5244ff8ad894075d9add.gif)

 exactly when there exists a [directed path](http://en.wikipedia.org/wiki/Glossary_of_graph_theory#Directed_path) from 

![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_7b774effe4a349c6dd82ad4f4f21d34c.gif)

 to 

![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_9e3669d19b675bd57058fd4664205d2a.gif)

 in the DAG.

Cool papers on this really new field are mostly by [Kevin Hoover](http://www.econ.duke.edu/~kdh9/) in economics, with [David Bessler](http://ideas.repec.org/e/pbe1.html) in Agricultural Economics. Anybody who knows of more papers in economics in this area, please [email me](mailto:stephen.kinsella@ul.ie).

If you want to manipulate a DAG to get a handle on the idea, click [here](http://demonstrations.wolfram.com/EnumeratingTheDirectedGraphs/).

**Papers**

Selva Demiralp, Kevin D. Hoover, and Stephen J. Perez, ["A Bootst](http://econ.duke.edu/%7Ekdh9/Source%20Materials/Research/Bootstrap%20SVAR%203%20%20April%202007.pdf)[rap Method for Identifying and Evaluating a Structural Vector Autoregression"](http://econ.duke.edu/%7Ekdh9/Source%20Materials/Research/Bootstrap%20SVAR%203%20%20April%202007.pdf), *Oxford Bulletin of Economics and Statistics*, 2008

[Kevin Hoover, "Economic          Theory and Causal Inference,"](http://www.econ.duke.edu/%7Ekdh9/Source%20Materials/Research/Economic%20Theory%20and%20Causal%20Inference.pdf) forthcoming in Uskali Mäki, editor* Handbook          of the Philosophy of Economic, (one volume of the **Handbook of the Philosophy of          Science*, [Dov Gabbay](http://en.wikipedia.org/wiki/Dov_Gabbay), Paul Thagard, and John Woods, general editors.           Amsterdam:  Elsevier/North-Holland.)

*[Kevin Hoover, "Automatic Inference of the Contemporaneous Causal Order of a System of          Equations,"](http://www.econ.duke.edu/%7Ekdh9/Source%20Materials/Research/Automatic%20Inference%20%28Econometric%20Theory%29.pdf) **Econometric Theory*, 21(1), 2005, pp. 69-77.

*Matthew C. Stockton & Oral Capps Jr. & David A. Bessler, 2008. "**[Samuelson´s full duality and the use of directed acyclical graphs](http://ideas.repec.org/a/cem/jaecon/v11y2008n1p167-191.html)**," [Journal of Applied Economics](http://ideas.repec.org/s/cem/jaecon.html), [Universidad del CEMA](http://www.cema.edu.ar/), vol. 0, pages 167-191, May.*

*Haesun Park & James W. Mjelde & David A. Bessler, 2007. "**[Time-varying threshold cointegration and the law of one price](http://ideas.repec.org/a/taf/applec/v39y2007i9p1091-1105.html)**," [Applied Economics](http://ideas.repec.org/s/taf/applec.html), Taylor and Francis Journals, vol. 39(9), pages 1091-1105.*

*Zijun Wang & David A. Bessler, 2006. "**[Price and quantity endogeneity in demand analysis: evidence from directed acyclic graphs](http://ideas.repec.org/a/bla/agecon/v34y2006i1p87-95.html)**," [Agricultural Economics](http://ideas.repec.org/s/bla/agecon.html), International Association of Agricultural Economists, vol. 34(1), pages 87-95, 0*

*.*

![](http://img.zemanta.com/pixy.gif?x-id=fc0fdf5e-76ee-47bc-ae02-1af02d86b8c0)
