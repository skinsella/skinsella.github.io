---
title: "Maximum Likelihood Estimation of Stable Paretian Distributions Applied to Index and Option Data"
date: 2009-01-30 11:06:57
categories:
  - Research
---

Here's a new paper I've written with my colleague [Dr Fergal O'Brien](http://www2.ul.ie/web/WWW/Faculties/Kemmy%20Business%20School/Departments/Accounting%20&%20Finance/Faculty%20&%20Staff/Fergal%20O%20Brien), using so-called stable Paretian distributions to price financial assets which exhibit infrequent, but massive, price changes. The standard way to characterise these moves is by [Ordinary Least Squares](http://en.wikipedia.org/wiki/Least_squares) fitting to a [log-log plot](http://en.wikipedia.org/wiki/Log-log_graph). We derive a symbolic dynamic expression for the right way to estimate this thing, and test it using [high frequency](http://en.wikipedia.org/wiki/High_frequency), long run data sets, the AMEX-OIL data set, and [Liffe](http://en.wikipedia.org/wiki/London_International_Financial_Futures_and_Options_Exchange)-ESX options data. It's a cool paper, which we're hoping to submit to a good journal. Anyone interested in this stuff, please download the paper, have a read, and tell us what you think. 

> Abstract: Ample evidence exists documenting the fat-tailed character of returns in financial markets \citep{rachev:2000}. Several papers attempt to model these fat tailed distributions as power laws of the form 
> 
> ![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_296e50381163fe2fcd045c5777f7d6d7.gif)
> 
> , where 
> 
> ![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_8ce4b16b22b58894aa86c421e8759df3.gif)
> 
>  is a positive integer measuring asset returns. 
> 
> ![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_ddd98a24e4c12250af36914cf78932fe.gif)
> 
>  is the probability of actually observing 
> 
> ![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_8ce4b16b22b58894aa86c421e8759df3.gif)
> 
> , 
> 
> ![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_7b7f9dbfea05c83784f8b85149852f08.gif)
> 
>  is the power law exponent, and 
> 
> ![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_06776c43b093ad7d8ed601107b0c36a4.gif)
> 
>  is the [Riemann zeta function](http://en.wikipedia.org/wiki/Riemann_zeta_function) defined as 
> 
> ![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_de061a0656e379857cea4776126cd489.gif)
> 
> . The method most employed in determining the power law exponent is graphical analysis of the log of the ranked data followed by regression. In this paper, we point out the flaws of this method of discovering power laws, and argue for a more direct method of discovery using [maximum likelihood estimation](http://en.wikipedia.org/wiki/Maximum_likelihood) over a bounded field. After deriving our model, we test it on two high frequency [time series](http://en.wikipedia.org/wiki/Time_series): 
> 
> ![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_2242a4d841a5f87d2c1157475c0bafa8.gif)
> 
> , and European-style exercise options on FSTES 100. Relative to the standard OLS power law fitting procedure, we find a much more accurate fit to the data using the maximum likelihood method, estimating 
> 
> ![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_7b7f9dbfea05c83784f8b85149852f08.gif)
> 
>  exponents of approximately 
> 
> ![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_5aee0cc44da9dd93c7b7f7493389cea8.gif)
> 
> , which we verify using [Kolmogorov-Smirnov](http://en.wikipedia.org/wiki/Kolmogorov-Smirnov_test) tests.

[Download the paper here.](http://stephenkinsella.net/WordPress/wp-content/uploads/2009/01/MLE.pdf)

###### Related articles

- [Gibbs Sampling for Semi-Supervised Learning](http://lingpipe-blog.com/2008/12/18/gibbs-sampling-semi-supervised-learning/)(lingpipe-blog.com)
- [In thinking about the Current Crisis, don't use visuals, because...](http://www.stephenkinsella.net/2008/11/26/in-thinking-about-the-current-crisis-dont-use-visuals-because/)(stephenkinsella.net)
- [Estimator - Pt. Surya Prima Bahtera](http://www.acakadut.com/jobs/estimator-pt-surya-prima-bahtera/)(acakadut.com)
- [Don't blame models](http://stumblingandmumbling.typepad.com/stumbling_and_mumbling/2009/01/dont-blame-models.html)(stumblingandmumbling.typepad.com)

![](http://img.zemanta.com/pixy.gif?x-id=dbb62cdc-4a21-43dd-877d-523825410ef9)
