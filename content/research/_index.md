---
title: "Research"
eyebrow: "Statement"
lede: "Where computation should be spent, and what it costs to move a model from the framework it was born in."
---

The question I keep circling is a cost question. Modern models are capable because they
are large, and almost every interesting constraint appears when that size stops being an
option: on a camera at the edge of a city, on a stream that will not pause, on silicon
that computes in events instead of floating point.

Spiking neural networks are the sharpest version of that constraint. A neuron says nothing
until it has something to say, so energy tracks information rather than parameter count.
The promise is real. The difficulty is that it only pays off on the right kind of problem,
represented the right way, on hardware that can exploit the sparsity, and each of those
three conditions is easy to get wrong quietly.

**Now.** I am working on where spiking networks fail at language, since text gives you no
natural event stream and long dependencies that spikes handle badly. In parallel I am
studying adaptive-LIF neurons: their threshold adapts with activity, which gives the
network state that lives outside the weights. If that state turns out to be reliable, it
belongs inside the portability work rather than beside it.

**The portability work.** SNNTorch, Lava, Rockpool and Sinabs each assume something
different about time, reset and quantisation. A result that cannot survive the move
between them is a result about a framework, not about a model. I build the abstraction
that makes the move possible and the harness that reports what the move costs.

**Before this,** the same cost question showed up in language and vision. Adapters and
prefix tuning to specialise a large model without retraining it. Classifier guidance and
an energy term to steer a summary towards a requested perspective. A cascade that put an
attribute transformer behind a detector so it could keep up with a live camera.

What I would like to do next is bring these together: spiking models that handle language
and perception at once, on hardware where the sparsity is actually cashed in.
