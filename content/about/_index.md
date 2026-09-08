---
title: "About"
eyebrow: "Who I am"
lede: "I get spiking neural networks to run in places they were not written for, and try to find out what breaks in the move."
---

At TCS Research in Kolkata, my main project is a bridge between the general neuromorphic
frameworks and the hardware-specific ones. Take a spiking model written in SNNTorch and
get the same behaviour out of Rockpool, Lava or Sinabs.

That sounds like plumbing, and a lot of it is. But every framework holds its own opinion
about what a timestep means, when a membrane resets, and how much precision a weight
deserves. Those opinions are buried in the model definition instead of written down. So
the job became a more interesting one: state the network once, lower it onto each backend,
then measure exactly where the spike trains stop agreeing. Ported time-series classifiers
currently sit at 96% accuracy, within 2% of the hand-written versions.

Getting there meant learning SNNs properly rather than as an analogy. How event-based data
should be represented before you hand it to anything. Which multimodal tasks genuinely get
cheaper when computation is sparse, and which ones only look like they should.

Two things have my attention at the moment. The first is language. Text is the least
natural fit for spiking networks: there is no event stream to begin with, the dependencies
are long, and the embeddings are dense. I am trying to locate the real failure points
rather than push a number up. The second is adaptive-LIF neurons, whose firing threshold
moves as they spike. That gives a network a kind of short-term memory the weights never
see, and I want to know how much of it can be trusted, and whether it belongs in the
porting project.

## Before Kolkata

M.Tech at IIIT Delhi, 2023 to 2025, AI specialisation, alongside two years as a teaching
assistant for NLP, DSA, AI and Intelligent Systems. Nine months of that was at MIDAS Lab
with Dr. Rajiv Ratn Shah, working on crowd analytics, person attribute recognition, and
accident detection from live video, the last one jointly with TU Darmstadt. A final
semester project on controllable summarisation with Dr. Shad Akhtar pulled me towards
language models.

Before that, four years of Information & Communication Technology at Adani Institute in
Ahmedabad. Signals and circuits, mostly, at a point when I had no idea any of it would
be useful.

## What I actually enjoy

The part where a model has to leave the notebook. A pipeline that must keep up with a
video stream. An audio dataset that has to be recorded and labelled before a single
experiment can run. A network that has to be re-expressed in a framework that never
imagined it. That is usually where the real result is hiding, and it is almost never the
part that gets written up.
