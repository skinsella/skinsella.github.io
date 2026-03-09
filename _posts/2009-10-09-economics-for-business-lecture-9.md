---
title: "Economics for Business Lecture 9"
date: 2009-10-09 13:14:29
categories:
  - Teaching
tags:
  - "Economics"
  - "Game"
  - "Game theory"
  - "Institutes"
  - "Nash"
  - "Nash Equilibrium"
  - "Prisoner's dilemma"
  - "Social Sciences"
---

[![Will the two prisoners cooperate, or will both...](http://upload.wikimedia.org/wikipedia/commons/0/0f/Prison.jpg)](http://commons.wikipedia.org/wiki/Image:Prison.jpg)
Image via [Wikipedia](http://commons.wikipedia.org/wiki/Image:Prison.jpg)

In this lecture we introduce game theory, following recap over the risk and [insurance](http://www.wikinvest.com/industry/Insurance) parts of the module we looked at last week. Game theory is the study of strategic interaction. In this lecture we looked at the history of [game theory](http://en.wikipedia.org/wiki/Game_theory) and the components of any game: players, strategies, and payoffs. We also discussed the first [equilibrium concept](http://en.wikipedia.org/wiki/Solution_concept) we are going to see: the [Nash equilibrium](http://en.wikipedia.org/wiki/Nash_equilibrium).

Let us look at a few games in normal and Iterated forms, and talk about solution methods for these games when talking about the [Prisoner's dilemma](http://en.wikipedia.org/wiki/Prisoner%27s_dilemma). Click below for [lecture notes](http://stephenkinsella.net/WordPress/wp-content/uploads/2009/10/ec4004_2009_lecture9.key.pdf), links, and a podcast of the lecture.

[Economics for Business Lecture 9](http://vimeo.com/6979483) from [Stephen Kinsella](http://vimeo.com/stephenkinsella) on [Vimeo](http://vimeo.com).

**The [prisoner's dilemma](http://en.wikipedia.org/wiki/Prisoner%27s_dilemma)** The prisoners in the game are two suspects, 

![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_7fc56270e7a70fa81a5935b72eacbe29.gif)

 and 

![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_9d5ed678fe57bcca610140957afab571.gif)

, who have been caught in the act doing something illegal. The two suspects are put in different cells, where they can't communicate, and they are given the following set of choices by the [police officer](http://en.wikipedia.org/wiki/Police_officer), who withdraws and lets them choose. The players can choose either to 1) confess all, or 2) say nothing. We summarise their payoffs to each choice using the [Normal form](http://en.wikipedia.org/wiki/Normal-form_game) of a game, where player 

![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_7fc56270e7a70fa81a5935b72eacbe29.gif)

's strategies are summarised on the rows, and player 

![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_9d5ed678fe57bcca610140957afab571.gif)

's strategies are summarised in the columns. The matrix allows us to glance and see the payoffs from each [strategy](http://en.wikipedia.org/wiki/Strategy) by each player in one simple box. Think of the matrix as the user interface for the game, kind of like the desktop on a computer. The payoffs look like :  

Prisoner B Stays Silent
Prisoner B Betrays

Prisoner A Stays Silent
Each serves 6 months

Prisoner A: 10 years
Prisoner B: goes free

Prisoner A Betrays

Prisoner A: goes free
Prisoner B: 10 years

Each serves 5 years

What's the Nash equilibrium of this game?

The Nash equilibrium, recall from the last lecture, is defined as

**Definition (Nash Equilibrium)**. A set of strategies 

![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_03cf6d8da2cc712326e00a5f25377a9c.gif)

 is a Nash equilibrium if 

![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_50794e7c791e489731a2e0896a0401e6.gif)

 is a best response for 

![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_7fc56270e7a70fa81a5935b72eacbe29.gif)

 against 

![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_2d070609e2e2cc18b39d80574e4bac39.gif)

, and 

![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_2d070609e2e2cc18b39d80574e4bac39.gif)

 is a best response for 

![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_9d5ed678fe57bcca610140957afab571.gif)

 against 

![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_50794e7c791e489731a2e0896a0401e6.gif)

.

See chapter 6 of the course textbook for more on the history of the Nash equilibrium concept. Or,  or 

We solve the game by looking at each box and asking if there is an incentive for any player to deviate from playing that strategy. When we find one that both players will settle on, that is the Nash equilibrium in pure strategies. 

 

 

So, begin with the bottom left hand box, say. Player 

![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_7fc56270e7a70fa81a5935b72eacbe29.gif)

 will go free, but player 

![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_9d5ed678fe57bcca610140957afab571.gif)

 will spend 10 years in prison. Not cool for 

![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_9d5ed678fe57bcca610140957afab571.gif)

, because he can increase his payoff from the game by moving to a strategy of telling the authorities everything, so he will play the 'betray' strategy.

The same goes for player 

![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_9d5ed678fe57bcca610140957afab571.gif)

. If both betray, they both end up doing 5 years, but if they trusted one another, they would only serve 6 months on a misdemeanour charge.

A process of elimination leads us to the bottom left hand corner of the matrix, which is where both suspects confess and get 5 years each. This is the Nash equilibrium, because for both players, there is no incentive to deviate from this strategy, taking the strategy of the other player into account.

The sad thing is for this game, the Nash equilibrium is not actually the best outcome for each player individually---that would be each staying silent. This is called the 'global optimum', but it is not stable---the local optimum of both betraying is stable, and so that is the solution to the game.

We can look at the prisoners' dilemma in  as

subgames, which I'll talk about in the next lecture. I'll use a  to show you what I mean by extensive form games in class.

Next we'll move on to consider the Tragedy of the commons.

First discussed in 1968 by Garret Hardin (see his article ), the tragedy of the commons describes a dilemma

> "in which multiple individuals acting independently in their own self-interest can ultimately destroy a shared resource even where it is clear that it is not in anyone's long term interest for this to happen" [].

We can apply the theory of the tragedy of the commons to talk about overpopulation, pollution, and other areas of resource management in economics.

![](http://img.zemanta.com/pixy.gif?x-id=5180a233-d83d-460a-a260-a319ca0355bd)
