---
title: "Thinking More Harderer about Higher Education Funding, Part Two"
date: 2008-08-20 08:41:04
categories:
  - Research
tags:
  - "Economic inequality"
  - "Gini"
  - "Gini coefficient"
  - "Household income in the United States"
  - "Social welfare function"
  - "Status quo"
  - "United States"
---

[![Graphical representation of the Gini coefficie...](http://upload.wikimedia.org/wikipedia/en/thumb/5/5b/Economics_Gini_coefficient.svg/202px-Economics_Gini_coefficient.svg.png)](http://en.wikipedia.org/wiki/Image:Economics_Gini_coefficient.svg)http://en.wikipedia.org/wiki/Image:Economics_Gini_coefficient.svg 

[In a previous post](http://www.stephenkinsella.net/2008/08/18/thinking-more-harderer-about-higher-education-funding-part-1/), I set up the [status quo](http://en.wikipedia.org/wiki/Status_quo) for our two class, 

![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_7b8b965ad4bca0e41ab51de7b31363a1.gif)

 household society, motivated by the most recent Household Budget Survey data, to formalise my thinking spelled out [in this post](http://www.stephenkinsella.net/2008/08/14/1125/). The last post was coming to a point where we could feel comfortable talking about aggregate household welfare (as measured by their disposable income) in the context of a simple tax and transfer government.

The way we modeled the status quo was to say each household 

![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_914767ffc65896751e16a5b9fbf3fc4a.gif)

 had a certain amount of taxation revenue, 

![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_1ed346930917426bc46d41e22cc525ec.gif)

,  which went to the government, removed from it, and then had a direct transfer of some revenue from the government, 

![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_215f30dd7e13ee46a99ef3a896e082ea.gif)

, added to their wealth in the form of educational services, so the `budget profile' in any period for any household, 

![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_865c0c0b4ab0e063e5caa3387c1a8741.gif)

, can be given by the expression 

![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_36e1ff51b412f423d2e00032cfbca721.gif)

. The [social welfare function](http://en.wikipedia.org/wiki/Social_welfare_function) of this list of households and their wealth is now given by

![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_8259231f4eb926405399864b2316e4cf.gif)

 

![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_cf19d0c6441ec5ae1441c217357c70b5.gif)

 

![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_be66135f5a89b10f8be98870da9b7801.gif)

.

Now let's change the status quo. Let's make the substitution of a one-fits all free education transfer to a sliding scale income contingent loan facility for those households in the list which the government deems [wealthy](http://en.wikipedia.org/wiki/Wealth) enough to support their own educational financing.

Begin with the following observation: some households in this list have more income than other households. Now the government as policy-setter can choose a filter which, for every household, assigns it to one group or another, rich 

![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_e1e1d3d40573127e9ee0480caf1283d6.gif)

, or poor, 

![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_44c29edb103a2872f519ad0c9a0fdaaa.gif)

. Those who are poor perceive no change in the status quo, because they continue to be fully funded by the government in a direct transfer as before.

Those households whom the government deems rich continue to pay their [taxes](http://en.wikipedia.org/wiki/Tax) as before, but this time they only recieve part of the educational transfer from the government, in a sliding scale going down as the income of each individual household $i$ goes up as we move up the list. The rest of the educational fees they must pay our of their disposable income net of taxes.

Now each household which belongs to the `rich' group, 

![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_e1e1d3d40573127e9ee0480caf1283d6.gif)

, has a `budget profile' like this:

![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_700a152c7d2057b1bf6240d9d9756543.gif)

,

where 

![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_02129bb861061d1a052c592e2dc6b383.gif)

 denotes the fees set by the university (of which more in a later post), and 

![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_6323ddea3fee25b3692262cddd1c0022.gif)

 is a sliding [scale parameter](http://en.wikipedia.org/wiki/Scale_parameter) dependent on the household's position in the income list within the `rich' group.

The social welfare function for this group is

![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_9e3a950d15884535baf47cff0e67e08d.gif)

 

![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_c3a9da9b5a5c4569f2b27b298b5b5a03.gif)

 

![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_d5dcc5d8265f5e0ca59f67f4a6421b22.gif)

 

![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_9b2203f0f1970fa88f2ee6ed1f4e32a0.gif)

I'll provide a numerical example in the next post.

Now we need to show that this social welfare function, 

![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_2d782cc16de3bbe4d36ea1e78d82d548.gif)

.

**Proof**

Proof strategy. It is sufficient to show 

![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_0729b898cb9738baddb9fb9730869c38.gif)

 `Lorenz' dominates 

![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_0dd1006399c052b3426aaa3a0e66e9b1.gif)

, which implies we need to show 

![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_2d782cc16de3bbe4d36ea1e78d82d548.gif)

. The way to prove this is to sum the elements of the list and compute an inequality index like [Gini](http://en.wikipedia.org/wiki/Gini_coefficient). If 

![](https://www.stephenkinsella.net/wp-content/plugins/latex/cache/tex_2d782cc16de3bbe4d36ea1e78d82d548.gif)

 as measured by gini, then using the properties of the [Atkinson index](http://en.wikipedia.org/wiki/Atkinson_index), the social welfare function will dominate another.

Due to a deadline on a paper, I'll have to do this in part three tomorrow.

###### Related articles

- [Thinking more Harderer about Higher Education Funding, Part 1](http://www.stephenkinsella.net/2008/08/18/thinking-more-harderer-about-higher-education-funding-part-1/)
- [What It Means To Be Progressive](http://thinkprogress.org/2008/08/19/power-of-progress/)

![](http://img.zemanta.com/pixy.gif?x-id=fbb1171d-31d0-49d6-9c20-2a1a66458e48)
