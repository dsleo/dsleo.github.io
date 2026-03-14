---
layout: post
title: "Analogy, Grossman, Intelligence"
slug: agi analogy
category: llm
---

It's coming, they say.
AGI here, AGI there.
Can you feel it, they say. 
Of course you can't, you're not in SF.

AGI is such an ill-defined term that no one shares a clear understanding of it, and people would rather talk about when we will have AGI than what it even means.

<div class="abstract">
We examine the conceptual gap between current AI systems and the lofty ideal of AGI often imagined as human-level genius. We argue that between the abilities of induction and deduction and the pinnacle of full scientific creativity, lies analogical reasoning: the capacity to recognize structural similarities across domains and map concepts from one context to another.
This intermediate cognitive ability may be the missing step in advancing AI beyond pattern recognition toward genuine scientific discovery.
</div>

## AGI, the "G" is probably for Genius

One emerging trend in recent definitions of AGI is to associate it with the very highest levels of human intellectual achievement. For example, Sam Altman (see this [discussion](https://www.reddit.com/r/singularity/comments/1nrd8a5/sam_altman_says_gpt8_will_be_true_agi_if_it/)) has suggested that if "GPT-8 figured out quantum gravity and could tell you its story, that might qualify as true AGI". Dario Amodei, in his essay [Machines of Loving Grace](https://darioamodei.com/essay/machines-of-loving-grace), describes powerful AI—not strictly AGI—as a system that would be “smarter than a Nobel Prize winner across most relevant fields: biology, programming, math, engineering, writing, and so on.”

Along similar lines, Demis Hassabis suggested the following [thought experiments](https://www.reddit.com/r/singularity/comments/1rb3awd/demis_hassabis_the_kind_of_test_i_would_be/) in 3 steps to determine true AGI.

1. Train an AI only on knowledge available up to around 1911 (before Einstein’s theory).

2. Then ask whether the system could independently derive general relativity, like Albert Einstein did in 1915.

3. If it could rediscover the theory from earlier physics knowledge, that would be strong evidence of genuine AGI.

But there are only so many Einsteins in the world[^1]. Requiring AGI to match the achievements of the most exceptional scientific minds may simply set the bar too high. Although progress certainly has been astonishing. GPT-2 was useless for any real-world task, GPT-3.5 became useful for beginners on some tasks, GPT-5 performance may  match that of many professionals in several domains. We could measure this as a percentile on some imaginary scale of ability across the full population. But expecting AGI to sit at the very frontier of human intelligence—the extreme tail of the distribution—is the most demanding possible definition.

## Climbing the Ladder: Three Levels of Intelligence
Before jumping directly to “Einstein-level” intelligence, it may be useful to think of scientific capability as a ladder of cognitive abilities, each building on the previous one.

### Level 1 — Induction and Deduction
Induction emerges from large-scale statistical pattern recognition, and modern LLMs have become remarkably strong at it. This capability is well illustrated by systems such as [AlphaEvolve](https://arxiv.org/abs/2506.13131)[^2].
Deduction is now achieved with the advent of reasoning models together with the scaling of formalized languages. A prominent example is[AlphaProof](https://www.nature.com/articles/s41586-025-09833-y).

### Level 2 — Analogical reasoning
Analogical reasoning allows a system to transfer relational structure from one domain to another: recognizing that two situations share the same underlying pattern even if their surface details differ.

This ability enables systems to reuse conceptual structures, map ideas across fields, and generate new hypotheses.

Evidence that current language models possess robust analogical reasoning remains limited. They can often produce convincing analogies in language, but whether they truly perform structural analogy at the level required for scientific discovery is still debated.

### Level 3 — Full scientific creativity
At the highest level lies scientific creativity: the ability to invent entirely new conceptual frameworks and evaluate competing theories. This is the territory of mythical figures like Albert Einstein or Alexander Grothendieck, where new mathematics or physics reshapes the field itself.

Analogical reasoning may be the missing middle step between statistical learning and genuine scientific invention.

## AGI, the "G" is probably for Grossman

Breakthrough discoveries are often told as the triumph of a solitary genius. Eureka moments, whether bathing or napping. In practice, the story is sometimes less romantic but more instructive as it depends on something much more prosaic:  the discovery of the right (mathematical) framework.

By the early 1910s, Einstein had already reached several of the essential physical insights behind the theory of general relativity. The equivalence principle suggested that gravity and acceleration were fundamentally related, and he suspected that gravity might not be a force in the Newtonian sense but rather a property of spacetime itself.
The difficulty was mathematical. Einstein initially tried to express the theory using extensions of the formalism of special relativity and classical field theory, but these approaches had no natural way to describe curved spaces.

Einstein reached out to his old classmate from Zurich, Marcel Grossman[^3]:

>“Grossmann, you must help me, otherwise I’ll go crazy.”

And [Grossman](https://en.wikipedia.org/wiki/Marcel_Grossmann#Collaborations_with_Albert_Einstein) pointed Einstein towards Riemannian geometry and tensor calculus...

<figure style="text-align: center;">
  <img src="/assets/images/grossman.jpeg" 
       alt="Marcel Grossman & Albert Einstein" 
       style="max-width: 80%; height: auto;">
  <figcaption>
  Marcel Grossman & Albert Einstein
</figcaption>
</figure>



A similar pattern appears in the work of another genius, Richard Feynman. In the 1940s, he wondered whether quantum mechanics could be formulated directly from the action functional rather than through the Schrödinger equation or the operator formalism of Heisenberg. 

During his [1965 Nobel Prize in Physics lecture](https://www.nobelprize.org/prizes/physics/1965/feynman/lecture/), he tells the story that while stuck on this, it is by the most random chance that he met a colleague at a beer party that pointed him to the right path, that of Dirac's of course.

> “Listen, do you know any way of doing quantum mechanics, starting with action — where the action integral comes into the quantum mechanics?” “No,” he said, “but Dirac has a paper in which the Lagrangian, at least, comes into quantum mechanics. I will show it to you tomorrow.”

And this is what eventually led to the [path integral formulation](https://en.wikipedia.org/wiki/Path_integral_formulation).

In both stories the decisive step was neither induction nor deduction, but representation: recognizing the framework in which the problem becomes solvable. The problem became tractable only once it was written in the right language.

This suggests a lower bar than the usual AGI rhetoric as we might not need a system capable of reproducing Einstein but a system that reliably plays the role of Grossmann: identifying relevant frameworks and proposing the right reformulation. 

---
{: data-content="footnotes"}

[^1]: Though we are promised “a country of geniuses in a data center” by Dario Amodei, [recently](https://www.dwarkesh.com/p/dario-amodei-2).
[^2]: As well as its cousins like [ShinkaEvolve](https://sakana.ai/shinka-evolve/) or the latest [AdaEvolve](https://arxiv.org/abs/2602.20133).
[^3]: See the excellent [Marcel Grossmann and his contribution to the general theory of relativity](https://ar5iv.labs.arxiv.org/html/1312.4068).

