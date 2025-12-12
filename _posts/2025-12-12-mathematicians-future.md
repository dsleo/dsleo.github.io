---
layout: post
title: "The Social Proof: How Mathematical Practice is Evolving"
slug: mathematicians future
category: maths
---

Here is a familiar scene from the modern "AI for Math" narrative. One of our usual AI evangelists (typically from OpenAI, 👋 Sebastian) announces, with maximal volume on social media, that AGI is upon us. The latest AI model has just proved a result beyond the reach of any human mathematician!

<figure>
  <img src="/assets/images/bubeck.jpg" alt="A claim of AI Math supremacy">
  <figcaption>
    A claim of AI Math supremacy (<a href="https://x.com/SebastienBubeck/status/1958198661139009862">original tweet</a>)
  </figcaption>
</figure>

After this year IMO, where AI dominated the field[^1], it was Erdös’ problems that became the next target. Paul Erdös, a legendary figure in mathematics with symbolic weight comparable to the IMO itself for the general audience, left behind a vast collection of questions that naturally attract AI systems positioned as aspiring mathematicians. [Thomas Bloom](http://www.thomasbloom.org/), a mathematician at the University of Manchester, has compiled over a thousand such problems from across Erdös' career on his website [www.erdosproblems.com](https://www.erdosproblems.com/). 

<figure>
  <img src="/assets/images/erdos_problem.jpg" alt="An open Erdös problem">
  <figcaption>
    An open Erdös problem (note the disclaimer).
  </figcaption>
</figure>

But the pattern is always the same. A few tweets later, the breakthrough evaporates when mathematicians point out the shortcut — usually that the result was already known, proved in the literature, or simply not that hard. This is exactly what happened in the episode now referred to as the [ErdösGate](https://garymarcus.substack.com/p/erdosgate). The AI had not proved anything new, but surfaced an existing solution in the literature.

This is then promptly reframed as “if AI is not superhuman at proving, at least it is superhuman at literature search” (as expressed by Sebastian Bubeck [here](https://x.com/SebastienBubeck/status/1977181716457701775)). And this is where the hype often overshoots reality. While the discourse celebrates AI theorem-proving as if it were a superhuman leap, what is genuinely valuable to working mathematicians is often the much more modest ability to accurately retrieve known results[^2].

In an even more striking twist, some of these resurfaced “solutions” predated the very formulation of the question (this is the case of the [Forbidden Sidon subsets problem](https://arxiv.org/abs/2510.19804)).

In other cases, the model had solved only a simplified variant, a problem at a level closer to competition mathematics than genuine research, and therefore far from any meaningful advance. And as if further clarification were needed, Thomas Bloom reminded everyone that an "Erdös problem" is not inherently difficult simply because the name Erdös appears in front of it.

<figure>
  <img src="/assets/images/erdos_problem_difficulty.jpg" alt="Erdös problem ">
  <figcaption>
    A clarification on the mathematical significance of Erdös problems.
  </figcaption>
</figure>

After watching enough of these cycles, it is hard not to grow weary of the relentless dramatization of AI’s influence on the queen of sciences[^3]. Yet, as a mathematician at heart, I could not help wondering how actual, professional, working mathematicians perceive all of this. Setting aside the noise, what is the real impact of AI on their work? And how do they imagine the future of mathematics and science in an AI-mediated world?

## Mapping the Everyday Life of Mathematical Research

One can always speculate, whether as an expert or an enthusiastic outsider, drawing on whatever theoretical framework seems convenient whether sociology of science, epistemology, or general intuition about how mathematicians think. But there is also a simpler and more reliable approach which is to ask the people who actually do the work.

A brief clarification first. I am not interested here in the philosophical or neuroscientific accounts of mathematical cognition, the interplay between intuition and formal reasoning, or the broader reflections on “how the mind does mathematics” (cf. David Bessis [work](https://davidbessis.substack.com/)). The purpose is far more concrete, it is to understand the ordinary, everyday practice of professional mathematicians.

With that goal in mind, I spent the past year speaking with thirty mathematicians, spanning all levels of seniority and a wide variety of fields. From PhD students to emeritus professors, from probability theory to algebraic geometry. I wanted to see what mathematicians actually do when they are not driking coffee and sit down to work. How do they choose problems? How do they make progress? What tools do they rely on? And what role, if any, is AI beginning to play in this workflow?

This was not a pre-registered study, but I did design a questionnaire with standard user-discovery principles in mind, aiming to avoid leading questions and minimize bias[^4]. 

<div style="background-color: #f8f9fa; border: 1px solid #e1e4e8; border-radius: 6px; padding: 20px; font-family: sans-serif; font-size: 0.9em; line-height: 1.6; color: #24292e;">
  
  <!-- Title Section -->
  <h4 style="margin-top: 0; margin-bottom: 15px; border-bottom: 1px solid #d1d5da; padding-bottom: 10px;">
    The Interview Questionnaire
  </h4>

  <!-- Scrollable Content Section -->
  <div style="max-height: 300px; overflow-y: auto; padding-right: 10px;">
    
    <p><strong>1. Current Workflow & Tools</strong><br>
    • Walk me through the last time you started working on a new problem. Where did you start, and what did you do next?<br>
    • What tools or platforms did you use during that process? (e.g., MathOverflow, Overleaf, your own scripts, libraries, provers)<br>
    • How do you keep track of partial results, abandoned ideas, or “almost proofs”?<br>
    • When was the last time you looked for similar theorems or related literature? What made it slow or tedious? Can you recall the last lemma you had to search for? How did you try to find it?<br>
    • What’s your process for checking whether a statement is already known or provable with current tools?</p>

    <p><strong>2. Pain Points in Collaboration & Discovery</strong><br>
    • Tell me about the last time you collaborated with other mathematicians online. What worked well? What didn’t?<br>
    • Have you ever tried working on an open problem collaboratively (like a Polymath project)? What was frustrating about it?</p>

    <p><strong>3. Persistence & Knowledge Management</strong><br>
    • How do you keep track of your mathematical notes, drafts, and results over time?<br>
    • What’s your process for revisiting old ideas or half-completed proofs?<br>
    • Can you think of a time when you lost track of a promising line of thought because it wasn’t documented in a good way?</p>

    <p><strong>4. AI & Computational Assistance</strong><br>
    • Have you used AI or automated tools in your mathematical work before? Which ones? How did that go?<br>
    • Tell me about the last time you thought, “This is too tedious — a machine should be able to help here.” What were you working on?</p>

  </div>
</div>
The responses were then carefully analyzed and distilled, revealing patterns and recurring themes that go beyond individual anecdotes.

Mathematicians do not march neatly from problem to proof. Ideas spark in hallway whispers, blackboard ping-pong, or the  memory of a seminar long past. The literature is a labyrinth where lemmas hide, notations shift, and old results lie buried under pages no one remembers. AI, meanwhile, arrives with promises and hallucinations alike—sometimes helpful, often exasperating. And yet, there is a shared imagination of a future where AI becomes a collaborator that spots dead ends early or help resurface that old result.

## Sparks, Conversations, and the Social Life of Discovery

Mathematical discovery rarely begins with systematic searches or literature reviews. Instead, it often emerges from small sparks: a remark in a seminar, an unusual notation in a paper, or a casual hallway conversation. Many breakthroughs arise in informal, face-to-face settings, where ideas can be tested, rephrased, or challenged immediately. [Julien Sabin](https://sites.google.com/site/juliensabin/), a junior professor at IRMAR, Université de Rennes, described this dynamic: “Two people at a blackboard can go much further than one alone,” highlighting the value of real-time discussion and iterative reasoning.

Ideas also require time to ripen. [Olivier Dudas](https://www.i2m.univ-amu.fr/perso/olivier.dudas/), at Institut de Mathématiques de Marseille, explained that insights often “marinate in your head for weeks or even months,” only revealing their significance much later. These experiences point to something essential about early-stage research: it depends as much on human reasoning than on the search for resonance, a connection or intuition sparked through conversation.

## Navigating the Ocean of Literature

Even once a promising idea appears, the literature can be a treacherous landscape. Conceptual searches are often futile: equivalent ideas may be expressed in very different vocabulary, and minor notational differences can obscure connections. Lemmas and intermediate results are often buried deep in long papers with opaque references, creating a persistent fear of rediscovery.

Sabin provided a vivid example: a few years ago, a Japanese mathematician published a result close to his own. The references included a proof from the 1980s by Russian mathematicians, but the abstraction was so high that recognizing the connection was far from obvious. 

[Samuel Le Fourn](https://www-fourier.univ-grenoble-alpes.fr/~lefourns/), a number theorist at the Institut Fourier, described the emotional cost attached with literature search: “There’s a constant fear of duplicating work that someone, somewhere, proved decades ago.”

Dudas has faced similar obstacles. He joined a lab focused on automorphic forms, far from his original area of expertise, representation theory. Working with a postdoc, they tried to extend a result specific to GLₙ, but it didn’t work. The postdoc suggested replacing it with the “theta correspondence,” yet keyword searches turned up nothing. Notational differences made the papers difficult to access: the π used for p-adic representations instead of the ρ familiar from classical representation theory. “You can’t just skim the document,” Dudas explained. “You have to translate it into your own language and reconstruct the argument yourself.” One of the essential references they eventually relied on was a paper they never would have discovered without already knowing exactly what to look for.

<figure>
  <img src="/assets/images/ocean_literature.jpg" alt="Ocean Literature">
  <figcaption>
    A researcher navigating the ocean of literature. (@studio_magga)
  </figcaption>
</figure>

Even with better tools, the terrain remains irregular. [Thomas Bitoun](https://www.simis.cn/thomas-bitoun/), professor at the Shanghai Institute for Mathematics and Interdisciplinary Sciences, noted that large models sometimes do succeed where traditional methods fail. Using Gemini's Deep Research, he once located a correct reference for a conjectural statement attributed to Jean-Pierre Serre, which was something he had been unable to track down even after asking experts. But in the same response, the model also hallucinated another reference...

## From Skepticism to Practical AI: today's frustrations, but tomorrow's research partner?

A noticeable shift occurred this year in the way mathematicians talk about AI. The initial reaction “leave me alone with this AI slop and nonsense” has softened. Not into enthusiasm, but into a pragmatic acknowledgment: some tasks genuinely benefit from it. Proving small technical lemmas (though in some domains of math more than in others), converting handwritten notes into LaTeX, producing small diagrams or simulation scripts, are now routinely delegated to AI.

Yet even here, the current AI tools remain far from frictionless. [Thomas Leblé](https://tleble.perso.math.cnrs.fr/), CNRS researcher at Paris Cité, notes that the interface is often a hindrance: “The chat is just not meant to do math; each small modification or correction leads to a new generation of text that you have to carefully check...again”.

[Paul Bourgade](https://cims.nyu.edu/~bourgade/), professor at the Courant Institute and editor at the Annals of Probability, sees another dimension: the steady rise of AI-generated submissions. Thankfully, the pattern is unmistakable currently as papers are either composed almost entirely of trivialities or, at the other extreme, wildly speculative claims backed by vague proofs. None are publishable, but the trend signals an impending difficulty. “One day, that won’t be the case anymore.” At some point, distinguishing machine-generated work from genuine submissions may become impossible.

This perspective shapes his vision for scientific publishing. In an ideal world, journals would not serve as reputational gatekeepers. Everything would live on arXiv, with human commentary and AI systems verifying proofs, ensuring consistency, and clarifying exposition; journals would certify correctness and nothing more. 

Bitoun’s experience adds a complementary perspective. He distinguishes sharply between mathematical training and mathematical practice: “Having a PhD in math is not the same as knowing how to do math.” Some AI for Math teams include researchers with advanced mathematical backgrounds, he said, but they still lack the lived sense of how mathematicians actually work. He believes the most transformative tools will be those capable of writing and adapting SAGE or MAGMA code, allowing mathematicians to test hypotheses more easily and then offload the tedious lemmas  no one wants to prove by hand to formal provers.

[Hugo Duminil-Copin](https://www.unige.ch/~duminil/), at IHES and Geneva, extended this line of thought to the structure of proofs themselves as mathematicians write in sharply different styles. Some provide exhaustive details while others presents an almost telegraphic chain of ideas. Reading across these stylistic gaps can be surprisingly hard. The prospect of AI tools that can adapt a proof into a different style, denser or more explicit, lighter or more conceptual,would in his view, be genuinely valuable.

Across these conversations, the emerging picture is of course not one of replacement, but of delegation. AI should be entering mathematics first through the pressure points: translation between notations, routine verification, exhaustive searches, and mechanical transformations of proofs, and diagrams. It is not approaching the core act of discovery—the human, social, disciplinary fabric described earlier—but rather the tasks that slow, distract, and exhaust the people engaged in it

---
{: data-content="footnotes"}

[^1]: OpenAI and DeepMind first claimed a [gold medal at the 2025 IMO](https://www.newscientist.com/article/2489248-deepmind-and-openai-claim-gold-in-international-mathematical-olympiad/), sparking [controversy](https://arstechnica.com/ai/2025/07/openai-jumps-gun-on-international-math-olympiad-gold-medal-announcement/?utm_source=chatgpt.com) as OpenAI announced its score before the official release. Shortly after followed byformal models such as ByteDance's [SeedProver](https://arxiv.org/abs/2507.23726) and Harmonic's [Aristotle](https://arxiv.org/html/2510.01346v1).)
[^2]: As already discussed in my previous [post](https://dsleo.github.io/llm/2025/04/18/ai-for-mathematicians.html).
[^3]: See this reddit thread [AI misinformation and Erdos problems](https://www.reddit.com/r/math/comments/1ob2v7t/ai_misinformation_and_erdos_problems/).
[^4]: Following the best practice of ["The Mom Test"](https://www.momtestbook.com/).
