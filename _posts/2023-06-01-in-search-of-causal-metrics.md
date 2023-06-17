---
layout: post
title: "In Search of Causal Metrics"
slug: causal metrics
category: causal
usemathjax: true
---

This post is the first in a serie that chronicles my journey into Causal Machine Learning.

When leaving the realm of traditional Machine Mearning to join the shore of Causal Inference, it’s not the fancy deep learning algorithms that we ultimately miss the most, it’s the metrics. Without metrics, without statistical learning theory, no performance guarantee.  
  
As a direct consequence of [the fundamental problem of causal inference](https://en.wikipedia.org/wiki/Rubin_causal_model#The_fundamental_problem_of_causal_inference), it is hard to evaluate what we partially observe. The very notion of ground truth disappears. If a policy suggests a treatment different than the one a unit actually received, how can we tell which treatment allocation is the best one?  

Taking a ML practitioner perpspetive, the absence of a dedicated model validation section in [econML](https://github.com/py-why/EconML), a major open source framework for causal ML practitioner really is a mystery. Fortunately, [causalML](https://github.com/uber/causalml) another major open source library offers standard uplift metrics (such as Qini and uplift) and isn't the only one[^1]. This is probably due to marketing being the original domain of application of uplift modelling and one of the use case at Uber. 

Quick side story, a few years ago, we spent probably as much time training uplift models than convincing the head of marketing of a major makeup company to do random action allocation for the next round of model training[^2]. If you want to see any change in a marketing strategy, you better have very sound and convincing numbers to show for in order to extend marketing campaigns.

Way before the rise of Data Science and to answer this marketing need, [Victor Lo](https://scholar.google.com/citations?user=WNH2c1oAAAAJ&hl=en) wrote a comprehensive serie of papers on uplift analytics[^3]. Very pragmatic in scope, they cover real-life requirements such as the need for metrics or how to make uplift policies under constraints.

## Classic Uplift Metrics

**Settings**. Let's start by consider the case of binary treatment \\(T\\). We try to estimate the cumulative gain of treatment if we were to follow a given policy, possibly trained on historical data.  

For a given uplift policy \\(\mu\\), we ranked unit by decreasing predicted ITE. We denote by \\(Y_{i}\\)  the outcome of unit \\(i\\) , \\(D_i\\) (resp. \\(D_i^{Treated}\\) and \\(D_i^{Control}\\)) the number of units with predicted ITE less or equal than unit \\(i\\) (resp. in the treated and control group). For a ranked unit \\(k\\), 

$$Uplift@k := (\frac{\sum_{i=1}^{k}Y_i*\unicode{x1D7D9}_{i \in Treated}}{D_k^{Treated}} - \frac{\sum_{i=1}^{k}Y_i*\unicode{x1D7D9}_{i \in Control}}{D_k^{Control}}) \cdot D_k$$

The function \\(k \mapsto Uplift@k\\) is the so-called *uplift curve*. Here is what it looks like in [Dataiku](https://knowledge.dataiku.com/latest/ml-analytics/causal-prediction/tutorial-causal-prediction.html)'s platform.

![Uplift curves in DSS](/assets/images/dss-uplift2.png)


For a complete and rigorous presentation of those metrics and all their variants, this work from Criteo, [About Evaluation Metrics for Contextual Uplift modeling](https://arxiv.org/pdf/2107.00537.pdf) is the most comprehensive resource. Those variants are consequence of the choice of normalization and whether the population ranking is done separately over groups or jointly. This is summarized in this table presented in the above paper:

![Qini and Uplift Curves Definition](/assets/images/qini-uplift-def.png)


In [Learning to Rank For Uplift Modeling](https://arxiv.org/pdf/2002.05897.pdf), the discrepancies in the literature around Qini/uplift curves is also nicely presented.

We will now discuss three specific points with those metrics: the extension from binary to multi-treatment, the perfect uplift curve and a robust extension to uplift curve.

## Extension to Multi-treatment

We now move to multiple treatments settings with still a control. We can extend the previous metric naturally by replacing the left term \\(D_i^{Treated}\\) with \\(D_i^{T=\mu(X)}\\), the subpopulation of units that received the treatment that the policy \\(\mu\\) would have proposed.

$$Uplift@k :=(\frac{\sum_{i=1}^{k}Y_i*\unicode{x1D7D9}_{i \in Treated}}{D_k^{T=\mu(X)}} - \frac{\sum_{i=1}^{k}Y_i*\unicode{x1D7D9}_{i \in Control}}{D_k^{Control}}) \cdot D_k$$

For randomized experiment data, this gives an unbiased estimation of the uplift metric (see Lemma 2.1 in [Uplift Modeling with Multiple Treatments and General Response Types](https://arxiv.org/pdf/1705.08492.pdf)). Note that this imposes a filtering that might drastically reduces validation dataset size.

In this Uber's paper [Uplift Modeling for Multiple Treatments with Cost Optimization](https://arxiv.org/pdf/1908.05372.pdf), we see that the binary-treatment policies on the left-hand plot are ending at the same point while the right-hand plot for multi-treatment policies ends at different points.

![Binary and Multi-treatment curves](/assets/images/uber-uplift.png)

What's going on ? In binary settings, all uplift metrics end at the global ATE on the validation data, which is not the case for multi-treatment. 
This means that we need to be very careful in how normalization is done in order to do model selection.

We cannot normalise by the policy's predicted ATE (the curve's last point) anymore as this depends on the population policy, which is the control group together with \\(D^{T=\mu(X)}\\). This normalization makes model comparison impossible[^4] and we need to control for the total population policy size.

**Extensions.** 
1. When doing cross-validation, a better strategy is to do that normalization over each fold and average the folds by the global fold ATE.    
2. Outside of randomized experiments, but within the bound of unconfoundedness, the above can be generalized with IPW-weighting[^5].

**Note.** After writing this, I came across [mr_uplift](https://github.com/Ibotta/mr_uplift) which is a library dedicated to multi-treatment uplift that offer similar metrics.

## What’s *the* perfect uplift curve?

Let’s go back to binary treatment. One of the benefits of uplift curves is that you can define a theoretical perfect policy on the historical data. Of course, this is only a restrospective and not a prescriptive policy but it’s always interesting to have upper bound.

In scikit-uplift, a [heuristic perfect uplift curve i](https://www.uplift-modeling.com/en/latest/_modules/sklift/metrics/metrics.html#perfect_uplift_curve)s proposed. It ranks the four populations (treated/not treated and converted/not converted) and the policy is constant over each population.

Naturally, it first ranks the treated converted and then the control not-converted. We then need to decide who to rank next. We denote the number of control who responded by \\(CR\\) and the treated who didn't responded by \\(TN\\). If \\(CR < TN\\), it starts with treated not-converted, otherwise it starts with not-converted.

This is under the implicit hypothesis that there are as many treated as control. Indeed, as you can see from this beautiful screenshot, we should control for that ratio (treated/control).

![Beautiful Screenshot](/assets/images/perfect-uplift.jpeg)

## Robust Uplift (Iso-predicted uplift)

In (again) the very nice [About Evaluation Metrics for Contextual Uplift modeling](https://arxiv.org/pdf/2107.00537.pdf), the authors discusses how to deal with segments of the population with same predicted uplift.

![Iso-uplift](/assets/images/iso-uplift.png)

As suggested we can do linear interpolation for such segments (see python code below). This is a sort of average optimum. Another way to proceed is to consider the minimum and maxium uplift curve segment which convey the natural uncertainty of those segments.

```python
def constant_segments(x):
    '''Returns locations and segments lengths of constants subsegments in x'''
    x = np.sort(x)
    
    mask = np.concatenate(([True], x[1:] != x[:-1],[True]))
    nonzero_ix = np.where(mask)[0]
    
    locations = nonzero_ix[:-1]
    segments_length = np.diff(nonzero_ix)
    
    return locations, segments_length

def linear_interpolation_smoothing(y, locations, segments_length):
    """Returns a copy of y where constants segments are linearly interpolated"""
    new_y = np.copy(y)
    new_y = new_y.astype(float)

    for i, ix_length in enumerate(segments_length):
        if ix_length>1:
            ix_start = locations[i]
            
            if ix_start ==0:
                start_value = new_y[ix_start]
                end_value = new_y[ix_start+ix_length-1]
            else:
                start_value = new_y[ix_start-1]
                end_value = new_y[ix_start+ix_length-1]
            
            slope = (end_value - start_value)/ix_length
            intercept = start_value
            
            if ix_start ==0:
                linear = slope * np.arange(0,ix_length) + intercept
                new_y[ix_start: ix_start+ix_length] = linear
            else:
                linear = slope * np.arange(1,ix_length) + intercept
                new_y[ix_start: ix_start+ix_length-1] = linear
    return new_y
```

Last but not least, note that the issues discussed here with metrics for uplift modelling have natural strong connections with offline policy evaluation in Reinforcement Learning, but we’ll leave this for another time...


---
{: data-content="footnotes"}

[^1]: There are others like [scikit-uplift](https://github.com/maks-sh/scikit-uplift), [causallift](https://github.com/Minyus/causallift), the now-archived Wayfair library[pylift](https://github.com/wayfair/pylift), or the highly scalable Booking [UpliftML](https://github.com/bookingcom/upliftml).
[^2]: During my tenure at [Dataiku](http://dataiku.com).
[^3]: Papers like [Mining for the truly responsive customers and prospects using true-lift modeling: Comparison of new and existing methods](https://link.springer.com/article/10.1057/jma.2014.18) or [From predictive uplift modeling to prescriptive uplift analytics: A practical approach to treatment optimization while accounting for estimation risk](https://link.springer.com/article/10.1057/jma.2015.5)... that can be easily found on sci-hub thankfully.
[^4]: Unfortunately this is how normalization is done in causalML [at this point](https://github.com/uber/causalml/blob/master/causalml/metrics/visualize.py#L178).
[^5]: Also presented in the [Criteo paper](https://arxiv.org/pdf/2107.00537.pdf).
