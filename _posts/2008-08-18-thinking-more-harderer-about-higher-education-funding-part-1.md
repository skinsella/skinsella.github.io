---
title: "Thinking more Harderer about Higher Education Funding, Part 1"
date: 2008-08-18 17:34:58
categories:
  - Research
tags:
  - "Economic inequality"
  - "Gini"
  - "Gini coefficient"
  - "Household income in the United States"
  - "Social welfare function"
  - "United States"
---

Right, time to get all economic theory on this issue, which [I've written about before in a less formal way,](http://www.stephenkinsella.net/2008/08/14/1125/)

Imagine a list of everyone in the country (organised by household), indexed by their incomes. This list looks like the following: 

![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_6043e792a80c713e7d49e4858fa0225f.gif)

, with 

![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_5032c2aa08c241b5a4eee844064960f2.gif)

 being the richest household in the list and 

![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_e2f66b6f97eb982536588a1bfa05ffbf.gif)

 being the poorest. We can draw a distribution around this list by taking a density measure, which is like drawing a histogram. The reason we want to do this is to see where the distribution peaks. Does it peak in the middle, in which case the average is a good measure of overall wealth, or does it peak somewhere else, in which case we'll have to work out some other way of properly describing this list.

Mathematically, we go looking for the [probability mass function](http://en.wikipedia.org/wiki/Probability_mass_function) (not the [probability density function](http://en.wikipedia.org/wiki/Probability_density_function)) of this list, because it is discrete. The probability mass function, pmf, gives the probability that a discrete variable (in our case, the [household income](http://en.wikipedia.org/wiki/Household_income_in_the_United_States) list) is exactly equal to some value, or in our case 

![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_19e28d90f3d6fd340a56ee4ccba0c1d5.gif)

 for all 

![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_914767ffc65896751e16a5b9fbf3fc4a.gif)

, which just says that 

![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_c1d9f50f86825a1a2302ec2449c17196.gif)

 has a distribution given by 

![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_dfb544d00535db89c1bfb1439da9d8df.gif)

. We compute this pmf, and it can tell us, for the list of household incomes we have, whether the average household income is a good way to measure [income inequality](http://en.wikipedia.org/wiki/Economic_inequality) within the households on this list. One other nice thing the pmf can back out for us is the gini coefficient of a suitably transformed [Lorenz curve](http://en.wikipedia.org/wiki/Lorenz_curve).

So, using the pmf, we can compute a discrete version of the gini coefficient. The [Gini coefficient](http://en.wikipedia.org/wiki/Gini_coefficient) measures the relationship between cumulative shares of the population according to the level of disposable income, and the cumulative share of total disposable income recieved by them. In Ireland, we find the ratio of the very highest incomes to the very lowest is something like 14 to 1, according to Nolan and Smeeding, (2004 version) page 16, so we should expect the gini to be substantially skewed. The discrete gini for our households is given in this case by

![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_00466915edb8b9309b471367a6a39706.gif)

 where 

![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_3807b3702b85f4c22966962d1a552518.gif)

, the mean of the distribution.

Or, when you compute it using the figures given in the latest household survey, you get a number like 31.7, which is Ireland's Gini for 2005 to 2005, as calculated by the [household budget survey](http://www.cso.ie/releasespublications/hbs_2004-2005final.htm). Total equality would produce a gini measure of 0, and total inequality would produce a gini of 100. A gini of 31.7 for Ireland in 2005 means we are less equal than some countries, like the USA, but less equal than others, like Denmark.

So, is the mean income a good measure of how much the country should be spending on education? Because the distribution is highly skewed, as we can see from the figure below (l[ink to spreadsheet](http://spreadsheets.google.com/pub?key=psfxkah_A9EX_9WrG9pWheA)), which maps income shares to decile year to year, the answer is no. A movement to the right from the straight lines I show for each curve would indicate an increase in overall inequality.

The chart below plots disposable income by decile from 1999-2000 and 2004-2005, the last data we have, from the household budget survey. One can see the blue line (for 1999-2000) spiking up less sharply on the right hand side of the graph than the red line (for 2004-2005), implying there is a bigger jump between the 9th and 10th deciles than before. And if the gini for Ireland in 2004/2005 is 31.7, it is 32.4, barely less than its much later measurement.

Now let's talk about social welfare functions.

**Social Welfare Functions**

A [social welfare function](http://en.wikipedia.org/wiki/Social_welfare_function), swf, is a [real valued](http://en.wikipedia.org/wiki/Function_%28mathematics%29) function 

![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_61e9c06ea9a85a5088a499df6458d276.gif)

, which is defined for a particular distribution, in our case 

![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_c1d9f50f86825a1a2302ec2449c17196.gif)

. We can display it as

![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_96e0aa0a85063274e019e57dbc0a4bae.gif)

We'll be using the social welfare function in a minute to compare two policies. The most important property of the social welfare function is direct comparability. For two distributions, say 

![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_8c3ad15b1369570a17f7e7ea6e561497.gif)

 and 

![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_6639363cd362ab1b8afa610cc1a74551.gif)

, the social welfare functions of each can be ranked, so if we have 

![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_94216cbfce8ebd91b6e7d4fe58fcc085.gif)

, then the first distribution produces higher levels of social welfare and is so-called Pareto dominant. This function is dependent on several restrictive assumptions, of which more here. Once we accept we can rank (on some criterion) two different income distributions, then we can proceed.

**A two class society**

Say there are now two clases in Irish society (there can be any number actually, but it makes things much simpler to write it out like this) and a government. We can partition the group of n people in our society into 2 groups such that any individual will fall into just one of these 2 groups. We can then compute inequality within the sub groups as if they were the only group in the function.

Our social welfare function will look like this:

![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_9ac68b89a6da1c8f1448567d993bcecc.gif)

Now 

![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_61e9c06ea9a85a5088a499df6458d276.gif)

 is, formally, an aggregation function and the terms following the semicolons represent each groups' dependency on the groups' share of the population, 

![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_699f588a90515022fcaa6f5a07dbed21.gif)

, or the group's income, 

![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_60119250131047237ce33f5f2b8e58ab.gif)

.

We can now define Atkinson, Theil, and generalised entropy class-type indices for our household distribution in a discrete and formally correct fashion, which we will do in a later post. We can also talk about embedding our inequality indices within growth models, of which more later as well.

Now let's talk about a simple proposition for our two class, one government household.

Say the households are taxed proportionally at some level 

![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_1ed346930917426bc46d41e22cc525ec.gif)

, where the total taxation take in a period, period 1, can be given by 

![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_ba7830cc4d21a2f3d9f0daa43725db0c.gif)

 for households 

![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_9b7050d57c43f0c0abfdb68c146cf700.gif)

.

This total tax take must fund the government's purchases in a single period, so the government must spend 

![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_53794d72cb7f4dc872d57bd159298b3c.gif)

 on goods and services 

![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_dfcf28d0734569a6a693bc8194de62bf.gif)

, investment 

![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_dd7536794b63bf90eccfd37f9b147d7f.gif)

, saving, 

![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_5dbc98dcc983a70728bd082d1a47546e.gif)

 and transfers, 

![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_ebe021079e5a3c4f42ca6119eab92633.gif)

.

Say the only transfers which make up 

![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_ebe021079e5a3c4f42ca6119eab92633.gif)

 are funds for the university system.

The government wishes to increase funding for the universities, to some level, without increasing 

![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_ebe021079e5a3c4f42ca6119eab92633.gif)

.

It is going to do this by changing the status quo, which I'll describe now.

**Status Quo**

The government pays for every household, giving them an automatic entitlement through their membership in the list, to the pot of money represented by 

![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_ebe021079e5a3c4f42ca6119eab92633.gif)

, so the social welfare function for the status quo will look like this:

![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_2254e623e25b05b4bd01a940f74df6e0.gif)

for all households 

![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_026c428e8931c77d1dd1a09a57b53ff4.gif)

.

That's part one. Tomorrow, I'll set up the new policy in terms of social welfare functions, derive a new optimality condition for the government, and discuss appropriate measures of redistribution if the new policy gets enacted, as well as defending the current system, flawed though it is.

**References (so far)**

Cowell, F. A.; Flachaire, E. '[Income distribution and inequality measurement: the problem of extreme values](http://ideas.repec.org/a/eee/econom/v141y2007i2p1044-1072.html).' Journal of econometrics 141, no. 2 (2007), pp. 1044-1072.

Nolan, Brian and Smeeding, Timothy M., [Ireland's Income Distribution in Comparative Perspective](%20http://ssrn.com/abstract=857798). Review of Income Wealth, Vol. 51, No. 4, pp. 537-560, December 2005

###### Related articles

- [Jared Bernstein: Poverty, Income, and Health Insurance: What to Expect and Why It Really Matters](http://www.huffingtonpost.com/jared-bernstein/poverty-income-and-health_b_119437.html)
- [How the super-rich are changing our lives](http://www.telegraph.co.uk/arts/main.jhtml?xml=/arts/2008/02/16/bopes116.xml)
- [$200,000 a Year Makes You Rich](http://www.portfolio.com/views/blogs/market-movers/2008/06/12/200000-a-year-makes-you-rich?rss=true)
- [UK income gap widens](http://www.telegraph.co.uk/money/main.jhtml?xml=/money/2008/06/26/cnincome126.xml)

![](http://img.zemanta.com/pixy.gif?x-id=818ad57e-f998-4f49-b31f-0468a5786971)
