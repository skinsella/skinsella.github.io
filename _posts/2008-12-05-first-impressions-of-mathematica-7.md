---
title: "First Impressions of Mathematica 7"
date: 2008-12-05 19:28:21
categories:
  - Media
---

I use [Mathematica](http://www.wolfram.com/products/mathematica/index.html) in my teaching and research, and each time they come out with a new version, I end up spending a week relearning how to do simple things like making graphs, tabling data, and so forth.

This version is different. I began using it seriously this morning, and by the afternoon I was suckin' diesel, and coding as before in Mathematica 6.

I've been amazed first at the ease with which I can pull down data from Wolfram's servers. For example, if I want to see a graph of Ireland's Real GDP growth from 1980-2007, I use one line of code:

**DateListPlot[CountryData["Ireland", {"GDPRealGrowth", {1980, 2007}}],**

**Joined -> True, Frame -> False]**

And I get this, a professional graph, in about 30 seconds.

![fig1.png](/assets/images/2008/12/fig1.png)

I'm interested in data visualization, in particular teaching basic statistics using, say, a histogram. The new version helps the researcher by building simple, interactive bar charts really quickly.

Generate a Pareto-distributed histogram with one line of code:

****
****
****
**Histogram[RandomReal[ParetoDistribution[10, 2], 200]**
****
and you get this chart:

![fig2.png](/assets/images/2008/12/fig2.png)

You can't see it in the picture, but when you mouse over the bars, you're given information about the size of them. It's a really cool effect, and will go down well in classes.

I work with large datasets, and simulations, and all of the models I've coded in Mathematica 6, running non trivial computations on large populations of agents, run much faster in Mathematica 7.

I'll post more when I've spent more time with the app.
