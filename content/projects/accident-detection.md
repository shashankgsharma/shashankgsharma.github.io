---
title: "Accident Detection from Video Streams"
date: 2024-09-01
draft: false
ptype: "research"
summary: "Two pipelines built deliberately against each other: a trajectory tracker and a vision-language model. Neither one was enough."
affiliation: "MIDAS Lab, IIIT Delhi · TU Darmstadt"
guide: "Dr. Rajiv Ratn Shah, Dr. Manisha Luthra, Avinash Anand"
timeline: "June 2024 – Sept 2024"
tags: ["Computer vision", "Video analytics", "YOLO", "DeepSORT", "Vision-language models"]
---

Road accidents are a rare-event problem with a hard deadline. The frames that matter are a
vanishing fraction of the stream, and a detection that arrives late is worth nothing. This
was joint work between MIDAS Lab and TU Darmstadt, where throughput was treated as a
first-class concern rather than an afterthought.

## Two pipelines, on purpose

**Tracking.** YOLO for detection, DeepSORT for identity, and accident inference from what
the trajectories do: sudden deceleration, paths intersecting, motion stopping where it
should not. Fast, cheap, and completely dependent on someone having written down what an
accident looks like kinematically.

**Vision-language.** LLaVA-NeXT applied to sampled frames and simply asked to describe and
judge the scene. Enormously more flexible about what counts as an accident, enormously
more expensive per frame, and willing to describe events that did not occur.

## What each one got wrong

The tracker missed anything outside its kinematic template. A pedestrian incident that
didn't involve two vehicles converging simply wasn't an accident as far as it was
concerned.

The multimodal model caught those, and then confidently narrated a collision in a clip
where two cars passed each other. Precision and recall failed in opposite directions,
which turned out to be the useful finding.

## Speed

OpenCV-level preprocessing did the unglamorous work: resolution scheduling, skipping
frames on static scenes, batched decoding. Another **8%** off pipeline latency, on top of
the gap between the two architectures.

## Where it landed

A hybrid, in the end. The cheap tracker acts as a trigger and the vision-language model
adjudicates only the candidates it raises. That conclusion is less quotable than a single
benchmark number and considerably more honest about what either method can do alone.
