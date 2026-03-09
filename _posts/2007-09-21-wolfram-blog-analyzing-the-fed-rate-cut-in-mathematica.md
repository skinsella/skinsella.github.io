---
title: "Wolfram Blog: Analyzing the Fed Rate Cut in Mathematica"
date: 2007-09-21 10:44:42
categories:
  - UL
---

[Wolfram Blog: Analyzing the Fed Rate Cut in Mathematica](http://blog.wolfram.com/2007/09/analyzing_the_fed_rate_cut.html):

A great example of the power of the *Mathematica* program.

Analyzing the Fed Rate Cut in Mathematica

September 20, 2007

Jason Cawley, Special Projects Group

The Federal Reserve cut the federal funds rate this week for the first time in four years.

And it happens that I am working on a new economics data function for Mathematica--so I wanted to see what typically results after such a reduction in the federal funds rate.

The Fed makes much of its data available on the web through the FRED II database. So, all I had to do was point Mathematica's powerful Import function to the site, and I instantly had the data in Mathematica for analysis. It took one line of code.

A couple of short Mathematica evaluations later, and I had a list of all the previous occasions when this rate fell 0.5% or more. I immediately noticed that these large drops sometimes come in "runs," and decided to focus on the large cuts in each such sequence. I found 15 of these which go back to 1954.

There are obvious natural periods
