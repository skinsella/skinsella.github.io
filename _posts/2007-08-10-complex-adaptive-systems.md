---
title: "Complex Adaptive Systems"
date: 2007-08-10 21:35:28
categories:
  - Research
---

**Complex Adaptive Systems: An Introduction to Computational Models of Social Life **(Princeton Studies in Complexity) (Paperback)

by [John H. Miller](http://zia.hss.cmu.edu/miller/research.html) and [Scott E. Page](http://www.cscs.umich.edu/~spage/)

Princeton University Press (March 5, 2007), ISBN 0691127026, USD 24.95.

This book is a non technical introduction to the field of Complex Adaptive Systems (CAS) from the Santa-Fe perspective, which means it emphasizes the role of emergent phenomena such as scaling distributions in attempting to build models of the economy which are more closely aligned with economic reality than standard neoclassical, axiom driven, reductionistic models prevalent in the mainstream. The main point of CAS is to use computational methods to study `complexity’ in social systems no easily captured in standard modeling methodologies.

The Miller and Page definition of complexity is (pg. 9):

> "Complexity is a deep property of the system...[a] complex system dies when an element is removed...[the] behavior of many complex systems emerges from the activities of lower level forces."

Contrasting this with Foley, pg. 2, 2003, who defines complexity in a broader, more agent-friendly way in order to connect complexity-economics to classical theories of value, we see how the definition of this central concept is malleable:

> “Complexity theory represents an ambitious effort to analyze the functioning of highly organized but decentralized systems composed of very large numbers of individual components. The basic processes of life, involving the chemical interactions of thousands of proteins, the living cell, which localizes and organizes these processes, the human brain in which thousands of cells interact to maintain consciousness, ecological systems arising from the interaction of thousands of species, the processes of biological evolution from which new species emerges, and the capitalist economy, which arises from the interaction of millions of human individuals, each of them already a complex entity, are leading examples.“

The book is intended as a primer for the field. Miller and Page provide a nice motivating in the first Chapter, showing how models of standing ovations require both agent-level and systems level perspectives to model the phenomenon correctly.

Having established that yes, there is a need for systems research of this kind, they move on to consider the implications of searching for emergence-type results in research, and the change in modeling methodology this implies. Miller and Page provide a nice caricature of their method on pages 40––42, but really offer us little in the way of methodological meat. An example of the fluff:

> "A model requires choices of both the equivalence classes  and the transition function, and the art of modeling lies in judicious choices of both" (pg. 40).

Of course this statement is correct, but the authors could be talking about *any* type of modeling––there is nothing really here to suggest the authors can provide a roadmap for young scholars trying to get to grips with exactly *how* one should go about modeling a system as complex. The next chapter is a nice description of emergence as a social and physical concept, but for me it doesn't provide enough links to the deeper parts of the economic literature on the subject for the would-be CAS scholar.

In a text like this, I, the interested reader, should be able to get 2 or 3 seminal articles on emergent phenomena in the economics literature from a Chapter like this. In total, in Chapter 4, not including the admittedly very cool opening quotes, there are 2 references, neither to economically motivated examples of the modeling of emergence. They provide a theory of emergence using the weak law of large numbers as an example of what Shalizi and Moore (2006) call a `macrostate', which is a good way to tell the story, but the next logical step to take is to Pareto and power-law-like phenomena in social systems, which are also macrostates, and that has to wait until section 9.6. Personally in this chapter I'd love to have seen references to interesting applications of emergent phenomena as a backup for the theory Miller and Page advance: writers like Leijonhufvud (1997), Tesfatsion, (2002), Fafchamps (2002), Chavas and Holt (1993), Krugman (1996), especially the first two Chapters), Young (1998), Arthur, (1989), Folmer, (1974), and anything by Jose A. Scheinkman (most of his papers are up at [http://www.princeton.edu/~joses/wp.html](http://www.princeton.edu/~joses/wp.html)).

Next up, Miller and Page give us their version of computational theory, or rather the theory of computational modeling as a productive enterprise. This is the only place where the book really disappoints me. There is a theory of computation, and Profs. Page and Miller are well aware of it’s existence (they use parts of it very well in Chapters 9 and 10).  Rather than providing a primer to the theory of computability to the interested reader with economic applications in Chapter 5, they skirt the topic, largely relegating the problem of uncomputable functions in economic systems to a footnote on page 174:

> "It can be proved formally that not all functions can be solved by a standard computer (that is, not all functions are "computable"). We leave it as an open question whether any of the functions are of most interest to complex adaptive social systems, such as the behavior of a typical social agent, are in this latter group."

It has been formally proven recently by Velupillai (2006) that general equilibrium models don't actually compute the solution to an Arrow-Debreu type economy, but there is more research out there on this topic, and it would be wonderful to have this research included  in a second edition. CAS is about using computers and computational models to understand economic phenomena. Using the mathematics that underpin the digital computer (as Miller and Page do in later chapters) seems like a good idea, and a development of this theory can be found in Velupillai (2000). Thus a chapter on computability theory would be a welcome addition to the book.

Miller and Page write on page 65 that:

> "The types of computational models we wish to focus on here are those in which the abstractions maintain a close association with the real-world agents of interest, and where uncovering the implications of the abstractions requires a sequential set of computations involving those abstractions."

I think Miller and Page want to replicate the strategy of Borgesian map-making that characterizes much of Stephen Wolfram's *New Kind of Science* approach to modeling phenomena, and in fact they do allude to Borges on page 33, but the real meat of a theory and method of complex adaptive systems slips us by in this chapter. The authors are distinguished economists whose reputations as computational social scientists put them in a position to be able to make methodological claims for

Throughout the book, the authors claim a varied intellectual heritage for CAS: Hayek, Schelling, Crutchfield and Li/Packard, Wolfram and his NKS approach, and Herbert Simon, who is normally credited with anything that includes agents with limited information. However, the theories of these great men aren’t tied in with the models we are shown in the later chapters, so one feels a bit disconnected from their contributions. This is to be expected in a general overview book, but I do wish someone would tie all the strands together in a coherent way. CAS, like any other discipline, needs roots in the intellectual firmament, and the best way to do that with integrity is to build a catalogue of antecedents, obviously avoid ing whig history as you go.

To the meat of the book. Chapters 7––11 show us applications of the theory of CAS. This set of Chapters is a fantastic, simple overview, and is a really excellent pedagogical showing us forest fire models, 1 dimensional Cellular Automata, and other models. In Chapter 9  we are shown lots of models with dynamic content, from Schelling's Beach and its variant, the El-Farol/Minority Game problem, to the formation of cities (simple agglomeration models), to network (small-world & Pack) formation, and Schelling's Segregation model, and Bak's Sandpile model.

Section 9.6 is really the best part of the book for me. It is a discussion of Power Laws. The definition and example Page and Miller give on page 165 is so good I’m going to quote it in its entirety:

> A system is subject to a power law when Prob[X=x] ~x^{-k}. If x is the number of occurrences of some event of a particular size, then a power law would imply that the likelihood of this event is proportional to the size of the event raised to the -kth power. Thus, if  k=1, events of size 100 are 1/100th as likely as events of size 1. This implies that power-law governed systems are characterized by many small events and a few, rare, big ones.

They discuss the prevalence of scaling phenomena in different economic contexts, but don’t really tie the existence of power laws to the macrostate/emergent property search that CAS is really there to conduct.

Chapter 11 models the organization as an information aggregation mechanism, an agglomeration of nodes that funnels information into itself through these nodes to solve Boolean (TRUE/FALSE) functions. Surely this isn't the best way to tell this story? Chapter 11 doesn't really build on anything previously and is more of a non-technical synopsis of the authors’ work. Maybe more research will be done on this in this area soon.

Following Chapter 11 the book moves into concluding chapters and appendices.

The appendices are excellent notes to the researcher, guides and hints for best practice in CAS modeling, and an attempt to set out an agenda.

Personally, if I were asked to edit this book, following the usual motivating Chapters, I would have put the applications of the theory first, with the hints for modeling in Appendix  A moved to the heart of the book, with worked examples of real (possibly open) research problems, showing how the Borgesian-map strategy can be used more effectively than standard reductionist approaches in certain contexts. The `manifesto’ for CAS modeling deserves a book in in itself. I enjoyed this book, and, while it is flawed in places, with patches of rigor and patches of simple (but accurate) description, I think it represents a significant step forward for CAS research. That the field is large enough to require a book such as this is heartening, and the authors are to be congratulated for their efforts.

**Further Reading
**

Starred references are robbed from C.S. Shalizi’s Notebooks. [http://cscs.umich.edu/~crshalizi/notebooks/soc.html](http://cscs.umich.edu/~crshalizi/notebooks/soc.html).

![](http://ec1.images-amazon.com/images/I/01SMVAP2C5L.jpg)

["An Unholy Trinity : Labor, Capital and Land in the New Economy" (Duncan Foley)](http://www.amazon.ca/gp/redirect.html%3FASIN=0415310792%26tag=ws%26lcode=xm2%26cID=2025%26ccmID=165953%26location=/o/ASIN/0415310792%253FSubscriptionId=02ZH6J1W0649DTNS6002)

CRS and Cris Moore, "What Is a Macrostate? Subjective Measurements and Objective Dynamics," cond-mat/0303625;

[http://arxiv.org/abs/cond-mat/0303625](http://arxiv.org/abs/cond-mat/0303625)

Leigh Tesfatsion, Economic Agents and Markets as Emergent Phenomena, Proceedings of the National Academy of Sciences of the United States of America, Vol. 99, No. 10, Supplement 3: Arthur M. Sackler Colloquium of the National Academy of Sciences. Sackler Colloquium on Adaptive Agents, Intelligence, and Emergent Human Organization: Capturing Complexity though Agent-Based Modeling (May 14, 2002), pp. 7191-7192, [http://links.jstor.org/sici?sici=0027-8424%2820020514%2999%3A10%3C7191%3AEAAMAE%3E2.0.CO%3B2-4](http://links.jstor.org/sici?sici=0027-8424%2820020514%2999%3A10%3C7191%3AEAAMAE%3E2.0.CO%3B2-4)

Edwardo Zambrano 2004 “The Interplay Between Analytics and Computation in the Study of  Congestion Externalities: The Case of the El Farol Problem.” Journal of Public Economic Theory, 6(2), 2004, [http://www.nd.edu/%7Eezambran/WebPapers/compufinal.pdf](http://www.nd.edu/%7Eezambran/WebPapers/compufinal.pdf)

Marcel Fafchamps (2002) "Spontaneous Market Emergence," Topics in Theoretical Economics: Vol. 2 : Iss. 1, Article 2. Available at: [http://www.bepress.com/bejte/topics/vol2/iss1/art2](http://www.bepress.com/bejte/topics/vol2/iss1/art2)

* F. Clementi, T. Di Matteo, M. Gallegati, "The Power-law Tail Exponent of Income Distributions", [physics/0603061](http://arxiv.org/abs/physics/0603061) = [Physica A 370 (2006): 49--53](http://dx.doi.org/10.1016/j.physa.2006.04.027)

Jean-Paul Chavas; Matthew T. Holt Market Instability and Nonlinear Dynamics

American Journal of Agricultural Economics, Vol. 75, No. 1. (Feb., 1993), pp. 113-120.

[http://links.jstor.org/sici?sici=0002-9092%28199302%2975%3A1%3C113%3AMIAND%3E2.0.CO%3B2-0](http://links.jstor.org/sici?sici=0002-9092%28199302%2975%3A1%3C113%3AMIAND%3E2.0.CO%3B2-0)

Laherrère and D. Sornette, "Stretched exponential distributions in nature and economy: 'fat tails' with characteristic scales", The European Physical Journal B 2 (1998): 525--539

Clementi, M. Gallegati, "Pareto's Law of Income Distribution: Evidence for Germany, the United Kingdom, and the United States", [physics/0504217](http://arxiv.org/abs/physics/0504217)

*Michael Batty, "Rank Clocks", [Nature 444 (2006): 592--596](http://dx.doi.org/10.1038/nature05302)

Kevin E. Bassler, Joseph L. McCauley, Gemunu H. Gunaratne, "Nonstationary Increments, Scaling Distributions, and Variable Diffusion Processes in Financial Markets", [physics/0609198](http://arxiv.org/abs/physics/0609198)

A. Arenas, A. Diaz-Guilera, C.J. Perez and F. Vega-Redondo, "Self-organized criticality in evolutionary systems with local interaction," [cond-mat/0103496](http://arxiv.org/abs/cond-mat/0103496)

W. Brian Arthur, Competing Technologies, Increasing Returns, and Lock-In by Historical Events, The Economic Journal, Vol. 99, No. 394. (Mar., 1989), pp. 116-131.

[http://links.jstor.org/sici?sici=0013-0133%28198903%2999%3A394%3C116%3ACTIRAL%3E2.0.CO%3B2-R](http://links.jstor.org/sici?sici=0013-0133%28198903%2999%3A394%3C116%3ACTIRAL%3E2.0.CO%3B2-R)

![](http://ec1.images-amazon.com/images/I/01eqwPCAkAL.jpg)

["Individual Strategy and Social Structure: An Evolutionary Theory of Institutions" (H. Peyton Young)](http://www.amazon.com/gp/redirect.html%3FASIN=0691086877%26tag=ws%26lcode=xm2%26cID=2025%26ccmID=165953%26location=/o/ASIN/0691086877%253FSubscriptionId=02ZH6J1W0649DTNS6002)

![](http://ec1.images-amazon.com/images/I/01KMVW4ZQFL.jpg)

["The Self-Organizing Economy" (Paul R. Krugman)](http://www.amazon.com/gp/redirect.html%3FASIN=1557866996%26tag=ws%26lcode=xm2%26cID=2025%26ccmID=165953%26location=/o/ASIN/1557866996%253FSubscriptionId=02ZH6J1W0649DTNS6002)

 Oxford: Blackwell Publishers, 1996.

Leijonhufvud, Axel. 1997. "Macroeconomics and Complexity: Inflation Theory," in The Economy as an Evolving Complex System II. Arthur, W. Brian, Steven N. Durlauf, and David A. Lane, eds. Reading: Addison-Wesley, 1997, pp. 321-35.

Folmer, H, 1974, Random Economies with many interacting agents. Journal of Mathematical Economics, 1/1, 51--62. doi:10.1016/0304-4068(74)90035-4

“The Algorithmic Foundations of Computable General Equilibrium Theory”,

Journal of Applied Mathematics and Computation, Vol. 179, #1, August, pp. 360-9, 2006. doi:10.1016/j.amc.2005.11.113
