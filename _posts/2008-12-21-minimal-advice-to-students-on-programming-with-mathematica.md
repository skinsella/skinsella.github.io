---
title: "Minimal Advice to Students on Programming with Mathematica"
date: 2008-12-21 23:54:04
categories:
  - UL
  - General
  - Research
  - Teaching
---

[Mathematica](http://www.wolfram.com/products/mathematica/index.html) is a powerful computational engine, and I do all my research and some of my teaching using it. [Cosma Shalizi](http://bactra.org/weblog/593.html) has posted his thoughts on programming well in R, and Martin at Geary has posted his thoughts and some cool links on [Stata](http://www.stata.com/), so I thought I'd write something about Mathematica, rather than ranting about the Irish economy for a while. There are much more qualified people than me doing that anyway.

[![gazebo1](http://farm4.static.flickr.com/3022/2867894015_fe40e96e0b_m.jpg)](http://www.flickr.com/photos/18291914@N06/2867894015/)

First thing you should know is I taught Mathematica for economists a few years ago, and the course files are located [here](http://www.stephenkinsella.net/2006/11/16/mathematica-as-a-foundation-for-economic-analysis-2/). Check them out and [give me some feedback](mailto:stephen.kinsella@ul.ie) if you like them.

Second thing you should know is I'm *not* an expert, though I have taken classes from Wolfram research on using Mathematica to program. [Details of those are here](http://www.wolfram.com/services/education/). I'm just barely qualified to use it for my own ends. I'm going to assume you've never taken a programming class, as with most social scientists. But in spite of all those caveats, I've got some tips for you, and in time-honoured bloggy fashion, I've made a list.

1. Don't jump right in. Write down what you want to do on a piece of paper before going anywhere near a computer. Jumping straight into coding is a mistake. It's better to think carefully about what you want the code to do before coming up with the code itself. Begin by asking what you want to do. Then ask how Mathematica can do that. Then search the help browser for commands and syntax to help you do that.
2. Code small. When you know what you want to do, code in tiny functions which do one thing, then splice those functions together. Don't iterate too much throughout, or you'll really slow your program down. Write comments in (* *) like this to yourself throughout the code. You'll want to do this, because right after staying up all night to finish the first draft of the code through bleeding eyeballs, you're going to...
3. Bin the first draft. When you've written the first draft, and you're sure it works, throw it away. Then cry. Then get back to work.
4. No, really. Chuck it.The first draft of the code will take, say, 30% of your time in coding, because you are really trying to find the language to ask Mathematica to perform some computation for you. The second draft will take 10% of the time it took you to write the first draft, and you'll write a better, more compact, and more efficient program. Honestly. It will save more time in the long run.
5. Write tests. Write tests for accuracy in the program. Within Mathematica, there are many simple checks you can make to ensure the program is doing what you think it might be doing, so use them, or write your own. My favourite is MaxPrecision.
6. Graph stuff. Mathematica (especially version 7) has extensive statistical and graphing capabilities, so use them to get a handle on what it is your program is doing, and what kind of outputs you can expect. Chances are you're using Mathematica to produce graphs anyway, so just build these into the program (Module) as outputs to separate files. It's a great way to produce results you can compare in different runs, especially when you simulate.
7. Ask people things.Check the help browser and the net, and if you get really stuck, join the Mathematica group, and ask a question. Most people (I say most, not all) are very helpful, and will get back to you in a week or so.
8. Read books. Here are my favourites:["Programming in Mathematica (3rd Edition)" (Roman Maeder),](http://www.amazon.com/Programming-Mathematica-3rd-Roman-Maeder/dp/020185449X%3FSubscriptionId%3D0PZ7TM66EXQCXFVTMTR2%26tag%3Dstephkinse-20%26linkCode%3Dxm2%26camp%3D2025%26creative%3D165953%26creativeASIN%3D020185449X)["Mathematical Statistics with MATHEMATICA" (Colin Rose, Murray D. Smith) and](http://www.amazon.com/Mathematical-Statistics-MATHEMATICA-Colin-Rose/dp/0387952349%3FSubscriptionId%3D0PZ7TM66EXQCXFVTMTR2%26tag%3Dstephkinse-20%26linkCode%3Dxm2%26camp%3D2025%26creative%3D165953%26creativeASIN%3D0387952349)["An Introduction to Programming with Mathematica, Third Edition" (Paul R. Wellin, Richard J. Gaylord, Samuel N. Kamin)](http://www.amazon.com/Introduction-Programming-Mathematica-Third/dp/0521846781%3FSubscriptionId%3D0PZ7TM66EXQCXFVTMTR2%26tag%3Dstephkinse-20%26linkCode%3Dxm2%26camp%3D2025%26creative%3D165953%26creativeASIN%3D0521846781)

That's it, any more hints, tips, etc, leave in comments, email me, or if I think of them, I'll post them.

###### More Mathematica Links:

- [Mathematica Symposium](http://www.stephenkinsella.net/2008/09/15/mathematica-symposium/)
- [Wolfram Releases Free Mathematica Player 7](http://insidehpc.com/2008/12/10/wolfram-releases-free-mathematica-player-7/)
- [Wolfram introduces Mathematica 7](http://www.macworld.com/article/136937/2008/11/mathematica.html?lsrc=rss_main)
- [Great talk by Stephen Wolfram on starting companies](http://blog.pmarca.com/2007/11/great-talk-by-s.html)

![](http://img.zemanta.com/pixy.gif?x-id=99903ad7-b83f-43ff-a409-5323a75dfb7f)
