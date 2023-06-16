---
layout: post
title: "Learning Causal Inference"
slug: navigating-causality
category: causal
usemathjax: true
---

In the [previous post](http://dsleo.github.io/causal/2023/06/01/causal-metrics.html), we discussed the influence of marketing optimization to the field of causal inference. It’s actually part of a much larger phenomenon that makes causal inference totally unique, as the meeting point of various scientific domains. Whether marketing or epistemology, clinical trials, socio-economics and econometrics or the modern tech fields. 

For instance whether the ultimate goal is to build prescriptive policy (what treatment should we give in the future, either globally or locally to a group or even an individual) or make retrospective estimation (what was the impact of a given event that isn’t necessarily controlled). Another crucial distinction is the relationship with experiments, sometimes they are not possible at all (for ethical reasons as in clinical trials) and sometimes treatment allocation can be fully controlled (marketing campaign for e-commerces).

This makes for a very diverse literature with different motivations, settings and objectives or even notations. Thankfully, [Brady Neal](https://www.bradyneal.com) put it nicely in this flowchart

![Flowchart](/assets/images/flowchart_causal_book.png)

This comes at a price for the non initiated trying to study causal inference. A price I didn’t realised I had to pay until much later in my causal journey. Probably because I made the choice to read (a bit of) all the suggested books. To show examples of this, I'll present two situations that took me quite some time to realise.

## Who owns the Treatment Assignment?

For instance, while working at Dataiku we designed a [visual causal ML suite](https://knowledge.dataiku.com/latest/ml-analytics/causal-prediction/tutorial-causal-prediction.html) which targeted non experts (think business analyst or subject expert matter). Because of our audience, we wanted to provide guardrails to ensure the validity of causal hypothesis. Be sure to check out Jean-Yves Gérardy's great [blog post](https://medium.com/data-from-the-trenches/causal-inference-on-observational-data-its-all-about-the-assumptions-6c1d6ce5453d?source=collection_detail----853867ec3a23-----19-----------------------) for an introduction to those hypothesis and their importance.

One of those is the so-called *positivity* or *overlap* hypothesis. Very simply put, this states that there is no subspace where units only receive treatment or control. If \\(X\\) is our set of observed features and \\(T\\) the treatment:

$$\forall x, 0< \mathbb{P}(T=1 | X=x) <1$$

To check for the validity of this hypothesis, various classical methods exists such as looking at propensity scores that relies on training a machine learning model for \\( \mathbb{P}(T=1 \| X=x)\\).

However if we can control for treatment allocation, say because we decide who gets the discount, we don’t necessarily need to build a model for it, at least for retrospective effect estimation. And Dataiku’s customers are very likely to fall in that category so that we could simply ask of them to provide the treatment allocation mechanism. It took us quite some time to understand this. Probably because in the textbooks we learnt from, this was never presented as such.

### Who needs causal graphs anyway?

The impact of those different background to causality is perfectly highlighted by the two main approaches or perhaps languages: the potential outcomes, associated with Donald Rubin, and the causal graphs, associated with Judea Pearl who is arguably a bit of a dag.  
Even though they are theoretically equivalent, the graphical approach seems to not be widely used in fields like social and environmental science. For a more in-depth presentation and analysis of those approach, there is a [great review paper](https://arxiv.org/pdf/1907.07271.pdf) by no other than Economy Nobel prize recipient, Guido W. Imbens.

After starting a PhD in Econometrics at Brown, Jean-Yves joined the data science team I was a part of and started to spread the gospel by organising a causal inference seminar back in 2016. We learnt about do-calculus (Pearl’s theory) and the importance of careful adjustments for valid effect estimations. The collapse of the Simpson paradox through the backdoor criterion, all of that through the causal graph lens, left an important impression on me.  

A few years later, we were ready to take up the torch and convert our data science community to the benefits of causal inference. We looked for a business situation where a reasonable data scientist would include bad controls in his model - i.e. opening backdoor paths - which would ultimately gives biased effect estimation However for an uplift use case, it would amount to control on post-treatment features (as children of treatment, which clearly are bad controls) but no reasonable data scientist would include in his model or it will seriously leak. Here is an example of such graph:

<img src="/assets/images/dag.png" style="width: 50%; height: 50%"/>

This might be a valid graph but “Visit Website” occurs after “Discount” so we wouldn’t control for it and including it in our model would introduce leakage

So with just some data science common sense, there is no need to build a graph here to avoid a biased estimation. Yes, we were so seduced by the elegance of the graphical approach that we really wished to use it… And for such causal effect estimation tasks, graphs remains a great visual tool that clearly encapsulate all of our hypothesis, whether explicit or not. 

For a thorough but compact review of the impact of adjustment for different types of graphs, be sure to check out Cinelli’s [A Crash Course in Good and Bad Controls](https://ftp.cs.ucla.edu/pub/stat_ser/r493.pdf), though I’m not sure I understand the arguments presented under Model 9 below

![Model 9](/assets/images/bad_control.png)