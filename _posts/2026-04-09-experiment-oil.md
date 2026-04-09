---
layout: post
title: "Lost in Translation: Data Is Nothing Without Experiments"
slug: experiments 
category: causal
---

When you first drink Coca-Cola, you might wonder what makes it so dominant. The intuitive answer is: a better product. So you look for the “secret recipe.” 

Very naturally—and a bit naively—you assume that the best product wins. Unfortunately, the recipe is a well-guarded secret, and even Coca-Cola employees are often kept in the dark when preparing the drink. But the recipe is not the point[^1].

<div class="abstract">
<p>The “data is the new oil” narrative shaped a generation of business strategy, but it misses a crucial ingredient: experimentation.</p>
<p>Data helps us understand the past and experiments allow us to establish causality and make reliable decisions. </p>
<p>The real competitive advantage of modern tech companies is not just data collection, but their ability to run controlled experiments at scale.</p>
</div>

A modern version of the Coca-Cola story is the "data is the new oil" narrative.

## Remember, Data is the new oil?

One of Google’s early innovations, PageRank, leveraged existing internet data to assign importance to webpages. Other big tech companies (Amazon, Facebook, Twitter, Netflix,...) built their platforms on top of the data they collected. This marked the rise of personalized systems.

Soon enough, the whole industry, especially legacy actors lagging behind, started investigating these successes, trying to understand how to replicate them. The result was the now-famous phrase: “data is the new oil.” The metaphor is appealing but misleading.

<figure style="text-align: center;">
  <img src="/assets/images/economist.jpg" 
       alt="The Economist cover - data is the new oil" 
       style="max-width: 80%; height: auto;">
  <figcaption>
  The Economist Cover
</figcaption>
</figure>

The formula was to collect data, like we extract oil, and build insights from this data, like we refine oil. Insights could be simple data analysis to understand business patterns or complex Machine Learning pipelines.

This gave birth to an entirely new industry, the "data economy", with two main artefacts: new roles and new tools. “Data” roles emerged, such as the now-ubiquitous data scientist, and an entire ecosystem of tools followed:

<figure style="text-align: center;">
  <img src="/assets/images/technoslavia.jpg" 
       alt="The Big Data Landscape in 2016" 
       style="max-width: 80%; height: auto;">
  <figcaption>
  The Big Data Landscape in 2016 (from Matt Turck)
</figcaption>
</figure>

## The missing ingredient: Experiments

More than fifteen years later, it is undeniable that the focus on data has delivered better products and services. But a crucial part of the story is missing.

The culture of experimentation is what is missing. Harvesting and refining data enables you to gain insights on the past as well as craft policies for the future. But you never blindly deploy a policy, machine-learning metrics on past data are never sufficient, you proceed by runnning experiments on samples of the available units of experimentation (say the users). It could be as simple as an A/B test or as fancy as contextualised multi-armed bandits.  

This is where the power of data (quite literally) comes to light. The more data you have, the smaller the effects you can detect, and the more informed your decisions become.

<figure style="text-align: center;">
  <img src="/assets/images/power.jpg" 
       alt="Statistical Power" 
       style="max-width: 80%; height: auto;">
  <figcaption>
  	Statistical Power
  <a href="https://www.ml-science.com/statistical-power-of-a-test"
      target="_blank"
      rel="noopener noreferrer">(source)</a>
</figcaption>
</figure>

“Big data” doesn't just improve machine learning models, it also increases the statistical power of experiments, making their conclusions more reliable.

Running experiments is the essence of experimental science. Without them, you are operating without causal validation.
One reason experiments did not become central to the “big data” narrative is that they are harder. The challenges are not only theoretical—ensuring randomization, choosing the right statistical test, interpreting results—but also organizational.

While working on optimizing and personalizing discounts at a retailer, we built uplift models and proposed running experiments. The head of marketing was reluctant to treat users differently (one group with the current policy, one with random discounts, one with the optimized policy). If the model was better, why not deploy it to everyone?

Thankfully, there is now a well-established body of work[^2] on experimentation in business settings, covering both statistical and organizational aspects.

## Data is the new Coke

To circle back to Coca-Cola: even with the perfect recipe, you would not automatically build a beverage empire. The real “secret recipe” of modern tech companies is not just data, but their ability to run experiments at scale. Data informs, experiments decide.

---
{: data-content="footnotes"}

[^1]: Well actually, it often only takes [a very dedicated and smart individual](https://youtu.be/TDkH3EbWTYc) to get to the bottom of that.
[^2]: Some of my [favorites](https://www.cambridge.org/core/books/trustworthy-online-controlled-experiments/D97B26382EB0EB2DC2019A7A7B518F59) [ones](https://www.hks.harvard.edu/centers/mrcbg/programs/growthpolicy/experimentation-works-surprising-power-business-experiments).
