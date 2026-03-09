---
title: "Notes to Self: Kendrick et al's Computational Economics"
date: 2008-07-10 10:12:23
categories:
  - General
  - Research
  - Teaching
---

Notes for Kendrick, Mercado and Amman's 2006 Princeton University Press book:

![](http://ecx.images-amazon.com/images/I/41XYX%2BcaT-L._SL160_.jpg)

http://www.amazon.com/gp/redirect.html%3FASIN=069112549X%26tag=stephkinse-20%26lcode=xm2%26cID=2025%26ccmID=165953%26location=/Computational-Economics-David-Kendrick/dp/069112549X%253FSubscriptionId=0PZ7TM66EXQCXFVTMTR2[Computational Economics](http://www.amazon.com/gp/redirect.html%3FASIN=069112549X%26tag=stephkinse-20%26lcode=xm2%26cID=2025%26ccmID=165953%26location=/Computational-Economics-David-Kendrick/dp/069112549X%253FSubscriptionId=0PZ7TM66EXQCXFVTMTR2)

(C[ode for the programs in this book is here](http://www.eco.utexas.edu/compeco/))

This is a pedagogical book with a lovely idea at the core: teach standard micro and macroeconomic models and principles using computer programs like Excel, Mathematica, MATLAB, and others.

The book takes us through a series of simple and well known examples, using student's familiarity with the textbook models as a foil to show the usefulness and extensibility of the computational approach.

So, we see partial equilibrium analysis and game theory in Mathematica, Derivatives analysis and genetic algorithms in MATLAB, and CGE models in [GAMS](http://www.gams.com/) as well as other programming languages. Throughout students are encouraged to go it alone by modifying the authors' code (which is itself a point of interesting pedagogy, see this Journal of Economic Education article for more)

The bits of the book which are most interesting for me are the Mathematica and Excel chapters on Growth, Game Theory, and Partial Equilibrium analysis.

Each chapter follows the same structure. For example, in the first real chapter, the authors give an Excel solver routine to solve the Neoclassical growth model in it's simplest form, as presented by, say, Romer in [Advanced Macroeconomics](http://www.amazon.com/gp/redirect.html%3FASIN=0072877308%26tag=stephkinse-20%26lcode=xm2%26cID=2025%26ccmID=165953%26location=/Advanced-Macroeconomics-David-Romer/dp/0072877308%253FSubscriptionId=0PZ7TM66EXQCXFVTMTR2). The exposition is clear and concise, and any student with some previous exposure to the mathematics will have no trouble fathoming the model's basics. Then we see the Excel implementation of the model, with links to the code for the model itself so students can use and modify the parameters and basic assumptions as they like. [That code, by the way, is here](http://www.eco.utexas.edu/compeco/).

The Mathematica notebooks all run well in Version 6.02, and the use of game theoretic concepts in a LISP-like environment such as Mathematica really makes it clear what a high level and extensible computer architecture Mathematica is. The work, really, is a precursor of the currently white-hot topic of [Algorithmic Game Theory,](http://theory.stanford.edu/~tim/f06/f06.html) even though the authors don't mean their work as such, just seeing the canonical models implemented in a computable set theoretic way (by definition, because it's on a computer) is a real step forward.

One thing I would have loved to see was a comparison of one model built in two different languages: how one would go about translating, say, an Eviews program to MATLAB, or something like that. Maybe I'll add that to the ideas list. Another idea to really sell the book would be to make each 'program' section of the book downloadable separately. Most institutions don't have blanket subscriptions to Mathematica, MATLAB, Eviews, GAUSS, TSP, Stata, etc, so by allowing readers to pick and choose by program, the authors might make themselves a few more shekels. Who knows?

So all in all, a very nice pedagogical book, and well worth purchasing for a library or graduate student interested in teaching computational economics. Glad I read it.
