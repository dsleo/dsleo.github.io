---
layout: post
title: "Proof by Construction: Building a Mathematician's Assistant"
slug: the adjoint
category: maths
---

What do you do after interviewing so many mathematicians to understand how their practice is evolving[^1]? After listening to them describe the newly discovered tools they have come to love[^2], alongside their long-standing frustrations?

Once again, I may be suffering from a mild form of pareidolia, seeing patterns where there are none, but I could not help feeling that my professional trajectory was finally starting to make sense. I began as an apprentice mathematician, playing with commutative diagrams and categorification. Later, I joined a data analytics company called [Dataiku](https://www.dataiku.com/), an early startup at the time, back in 2015 whose product was an end-to-end collaborative platform designed to democratize access to machine learning.

<figure style="text-align: center;">
  <img src="https://www.dataiku.com/wp-content/uploads/2024/01/Dataiku-Infrastructure-Infographic-.png" 
       alt="Dataiku platform" 
       style="max-width: 80%; height: auto;">
  <figcaption>Dataiku Platform</figcaption>
</figure>

My role there was to turn projects with significant scientific uncertainty but clear business potential into actionable product features. The first initiative focused on optimizing data labeling—primarily through active learning (through active learning [cardinal](https://github.com/dataiku-research/cardinal) mainly) while the last revolved around [causal inference](https://dsleo.github.io/causal/2023/05/11/causal-metrics.html).

In retrospect, this placed me at an intersection: a deep understanding of, and empathy for, mathematicians on the one hand, and hands-on experience building software products on the other. It began to feel almost obvious that I should try to build tools for mathematicians.

## Induction on Features: Initialization

Just as one explores a mathematical statement through its first nontrivial example, a product should begin with one—and only one—feature. Since AI-assisted proving was (and still is) very much in vogue, the initial task was to design the smoothest possible user experience for proving something collaboratively with an AI model.

The #1 pain point that consistently resurfaced in discussions with mathematicians was the iteration process itself. Once a correction is requested, the system regenerates an entirely new proof, with no guarantees that other parts have not been silently altered. The result is an experience that is simultaneously token-wasteful and deeply frustrating.

<figure style="text-align: center;">
  <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMHljd2RuYmhlY3FkbDQ2c2Z5cXhnbGllMDJ0cmh6amF2ZjEyMWUycCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/ebITvSXYKNvRm/giphy.gif" alt="Whack-a-mole for mathematicians">
  <figcaption>How a mathematician feels fixing an AI proof.</figcaption>
</figure>

Often a simple mistake (a wrong sign, a forgotten terms,...) would slip into the AI's output amidstan otherwise genuine helpful proof. Such errors would be immediately forgiven if made by a human, but not by an AI. Once again, the mathematician must point out the mistake, only for the model to stumble and generate excuses… before producing an entirely new proof from scratch.

To address these issues, we can take two complementary approaches:
1. Decompose the proof attempt into intermediate results, lemmas, together with their logical dependency graph, so that we can ask for modification of one component without altering the others. 
2. Allow direct intervention, letting the mathematician edit the proof attempt directly. Similar to Claude’s canvas feature, for instance].

This first decomposition can be achieved with a dedicated AI model and the right prompting: it takes the original proof attempt from the first model and outputs the lemmas along with the associated dependency graph. We could call this process blueprint inference, analogous to generating a “blueprint” in Lean.

<figure>
<img src="/assets/images/blueprint.png" alt="A Lean blueprint">
<figcaption>
The Lean blueprint of the [PFR conjecture](https://terrytao.wordpress.com/2023/11/18/formalizing-the-proof-of-pfr-in-lean4-using-blueprint-a-short-tour/).
</figcaption>
</figure>

An underlying assumption of this early work was to rely entirely on the capabilities of existing models. At this stage, it would have been futile to attempt training our own prover models, and similarly unwise to devise elaborate scaffolding[^3] which could quickly become obsolete following a major future release of LLMs.

## Is every interface converging to Chat?

On one hand, the chat interface is simple, versatile, and almost Zen in its minimalism. On the other hand, as the de facto default in a post-ChatGPT world, it can feel lazy and unfocused. As noted earlier regarding iteration, relying on chat as the alpha and omega of the user interface often comes with significant drawbacks.

In proving mode, chat is a second-class citizen. There are more natural ways to interact with and iterate on a tentative proof whether through direct user edits or by asking an AI model to check a lemma or any smaller substatement. Chat remains available for more open-ended questions and broader modifications. Crucially, every model output is analyzed by yet another LLM to determine its impact on the proof and to propose updates directly within the structured proof itself. 

## Wait, what if the statement... is false in the first place?

In the unlikely event that a mathematician submits a false statement and asks an AI model to prove it, what happens? The system doesn’t necessarily break, but it must clearly notify the user that the direction has changed. This is especially important because mathematicians may sincerely believe the statement to be true, and the prover model itself could be mistaken.

A recent study by researchers at INSAIT and ETH Zurich introduced [BrokenMath](https://www.sycophanticmath.ai/)[^4]. The benchmark was designed to measure this sycophancy phenomenon in AI models.

To detect it, we run a first LLM over the original proof attempt to determine whether the statement has been proved, disproved, or if nothing conclusive has been established.

## Wait, what if there is no statement to be proved... in the first place?!

As extensivly argued in [previous](https://dsleo.github.io/llm/2025/04/18/ai-for-mathematicians.html) [posts](https://dsleo.github.io/maths/2025/12/12/mathematicians-future.html), proving is only a small fraction of a mathematician activity. Mathematicians also use AI models for a variety of exploratory tasks. A natural extension of proving is exploration: starting from a half-baked statement or an open question, the mathematician begins a discussion that may eventually yield statements worth proving or disproving.

<figure>
<img src="/assets/images/tao_chatgpt.jpg" alt="Tao exploration with ChatGPT">
<figcaption>
Terence Tao conversation with ChatGPT to answer a MathOverFlow question ([mastodon post](https://mathstodon.xyz/@tao/115306424727150237)).
</figcaption>
</figure>

This changes the nature of the initial input to the app. There should be two modes: *explore* and *prove*, with smooth transitions between them. In this context, the chat interface is the natural candidate for exploration, enabling dialogue with the AI model. But, as before, chat is not the end point. We enhance the interaction by constantly scanning for the linguistic components of the mathematical discourse—statements, hypotheses, or examples—so that attempting a proof is always just a click away.

## Introducing The Adjoint

> Mal nommer les choses c'est ajouter au malheur du monde

After building all of the above, we needed a name for what we had started creating. This is when the above quote came to mind. Usually attributed to Albert Camus, it was also one of the most powerful lessons I received from one of my PhD advisors, [Michel Broué](https://webusers.imj-prg.fr/~michel.broue/). So what mathematical term could also describe a mathematician’s assistant? The adjoint, of course.

And for inasmuch as the models we rely on are occasionally forgetful, the adjoint is open source and free[^5]!

GIF at the end/ loom?

---
{: data-content="footnotes"}

[^1]: See my previous post [The Social Proof: How Mathematical Practice is Evolving](https://dsleo.github.io/maths/2025/12/12/mathematicians-future.html).
[^2]: Like [Underleaf](https://www.underleaf.ai/).
[^3]: Such as [Winning Gold at IMO 2025 with a Model-Agnostic Verification-and-Refinement Pipeline](https://arxiv.org/abs/2507.15855) or Tobias Osborne's [Alethfeld](https://github.com/tobiasosborne/alethfeld).
[^4]: Perhaps not the most precise name for the benchmark, since it is the models —not the mathematics— that are “broken”; naming things is hard...
[^5]: Within the current limits of my credits with AI companies.