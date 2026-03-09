---
title: "Limit Order Only Markets"
date: 2008-08-01 21:42:05
categories:
  - Research
tags:
  - "Greedy algorithm"
  - "Limit Orders"
  - "Order"
  - "Probability distribution"
  - "Research"
  - "Supply and demand"
---

[![Levy distribution](http://upload.wikimedia.org/wikipedia/commons/thumb/5/58/LevyDistribution.png/202px-LevyDistribution.png)](http://commons.wikipedia.org/wiki/Image:LevyDistribution.png)Image via [Wikipedia](http://commons.wikipedia.org/wiki/Image:LevyDistribution.png)

*Attention conservation notice*: apologies for all the 

![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_c51d7e23458ca0e7373a8ed6ab56b2b9.gif)

 code/typos/stupidity here, I'm working on some notes on Limit Orders for a paper I'm writing. Any comments most welcome.

A [limit order](http://en.wikipedia.org/wiki/Order_(exchange)) is an instruction to trade a specific quantity of an asset at a specified price, or a better price. The order is an ex-ante pre-commitment 

![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_fa47538c9d210e44754c5c9abc76487b.gif)

 made on a date 

![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_e358efa489f58062f10dd7316b65649e.gif)

 to trade up to a given amount 

![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_9dd4e461268c8034f5c8564e155c67a6.gif)

 of an asset 

![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_363b122c528f54df4a0446b6bab05515.gif)

 at a prespecified limit price 

![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_83878c91171338902e0fe0fb97a8c47a.gif)

. The order is in force until filled or cancelled, so unfilled orders accumulate in an [limit order](http://en.wikipedia.org/wiki/Order_%28exchange%29) book [(Kyle, 1989)](http://www.jstor.org/pss/2297551).

Limit orders differ from standard [market](http://en.wikipedia.org/wiki/Market) orders, which are requests to trade immediately at the best available price in the market. In a limit order setting the order execution is always filled at the limit price set by the buyer or [seller](http://en.wikipedia.org/wiki/Sales). In limit orders, price priority holds, which means the limit orders offering better terms of trade (buyers buying higher, sellers selling lower) execute ahead of limit orders at worse prices. Time priority can also hold, where at each price 

![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_83878c91171338902e0fe0fb97a8c47a.gif)

, older limit orders are executed ahead of newer ones in a queuing system which thus rewards first movers who give up liquid positions to allow the LOOM to work more effectively. The price and time priorities may be taken together to define a [probability distribution](http://en.wikipedia.org/wiki/Probability_distribution) over execution timing. The notion of equilibrium in limit order markets is different to other continuously clearing markets, because buyers arrive and trade asynchronously in a limit order market, so there is no unique market-wide `[market-clearing](http://en.wikipedia.org/wiki/Market_clearing)' price, except in degenerate cases. Rather, there is a sequence of bilateral transaction prices at which endogenously matched pairs of investors choose to trade over time.

A limit order to buy 100 shares can be filled at \$47.50 or below. A limit order to sell at \$50.25 can be filled at \$50.25 and above. The existence of the limit order is independent of having anyone to actually trade to fulfil the order. As time passes, one might not be able to fill the order. There several advantages to limit order markets. The first is the ability to obtain a better price within tolerant risk boundaries as defined or perceived by the buyer or seller. The second is the discrete nature of each trade: a limit order to buy simply means you specify how much of something you want, and and how much you are willing to pay for it, and vice versa for the supplier. Both [demand and supply](http://en.wikipedia.org/wiki/Supply_and_demand) are discrete functions of price. Any combination of these orders in a specific time and place gives rise to a limit order only interupted market where the orders are matched up for execution (O[sborne, 1977, Chapter 2)](http://www.amazon.com/%20Stock-Market-Finance-Physicists-Viewpoint/dp/0964629208) is the classic exposition of LOOM). The third advantage of the LOOM structure is it's simplicity in execution: one can easily define a [greedy algorithm](http://en.wikipedia.org/wiki/Greedy_algorithm) for such a market.

The execution of a simple market algorithm will always generate either a highest bid (if there are no sell orders), a lowest offer (no buy orders), a quote, (bid and offer but no transaction) or a transaction at a unique price. The only requirement is the orders have finite price limits on them. The market algorithm puts the orders to buy and sell in ranks, applies an ambiguity rule to ensure there is a unique price.

And this algorithm will look something like this:

**Assigning transactions Algorithm**

1. **Begin.** Sort buyers in descending order by the suggested price per unit.

2. Sort sellers in ascending order by the requested price per unit.

3. Traverse the two lists from top to bottom, and perform transactions while maintaining the total amount sold equal to the total amount bought. **Repeat.**

4. **Stop** when the offered price in the buyer's list is lower than the requested price in the seller's list.

Next bit of the paper---simulate this thing, and see what happens. Then apply it somewhere cool

###### Related articles

- [Profits In Stock market](http://sariches.wordpress.com/2008/07/01/profits-in-stock-market/)

![](http://img.zemanta.com/pixy.gif?x-id=b3381489-55ec-42ec-819c-2fe1e3f3620b)
