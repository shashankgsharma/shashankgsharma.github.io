---
title: "Real-Time Attribute Recognition for Indian Street Scenes"
date: 2024-07-01
draft: false
ptype: "research"
summary: "Person attribute recognition retuned for Indian pedestrians and put behind a detector cascade so it could keep up with a live camera."
affiliation: "MIDAS Lab, IIIT Delhi"
timeline: "2024"
venue: "arXiv:2407.03305"
paper: "https://arxiv.org/abs/2407.03305"
authors: "Shubham Kale, Shashank Sharma, Abhilash Khuntia"
tags: ["Computer vision", "Person attribute recognition", "Transformers", "Real-time systems"]
---

## Context

Person attribute recognition models are trained mostly on Western pedestrian datasets, and
they get noticeably worse on an Indian street: different clothing, different headgear,
denser and far less orderly scenes. That is a data problem and it is fixable.

The second problem is not. Running an attribute transformer on every frame of a
surveillance feed is nowhere near real time, no matter how well it is tuned.

## My part

Fine-tuning the transformer backbone on pedestrian imagery for attributes like upper-body
colour, clothing, accessories and headgear, and then dealing with the speed problem.

The fix was a cascade rather than a faster model. YOLOv10 finds people first. The
attribute network only sees the crops, and only when the tracker reports an identity it
has not already classified. Nearly all of the **98% latency reduction** comes from that
one structural decision, not from any optimisation inside the model.

Attribute labels are also badly imbalanced. Most attributes are absent most of the time,
and unweighted BCE learns that lesson enthusiastically and stops there. Dropout plus
**ScaledBCELoss** brought accuracy to **0.86** and stopped the model from collapsing onto
the majority class.

## Status

Preprint on arXiv (2407.03305), with Shubham Kale and Abhilash Khuntia. Related work
placed **second** in the Smart City Surveillance Challenge 2024, run by Vehant
Technologies.
