---
title: "Pulse of the Crowd"
date: 2024-06-01
draft: false
ptype: "research"
summary: "Measuring the energy of a crowd from what it looks like and what it sounds like. Published at IEEE MIPR 2024; I built the audio half."
affiliation: "MIDAS Lab, IIIT Delhi"
timeline: "2024"
venue: "IEEE MIPR 2024, pp. 308–314"
paper: "https://ieeexplore.ieee.org/document/10707791"
authors: "Avinash Anand, Sarthak Jain, Shashank Sharma, Akhil P. Dominic, Aman Gupta, Ashta Verma, Raj Jaiswal, Naman Lal, Rajiv Ratn Shah, Roger Zimmermann"
tags: ["Multimodal learning", "Audio-visual", "Crowd analytics", "Computer vision"]
---

## The idea

A packed but silent hall and a half-empty but roaring one are not the same event, though a
density estimator will happily tell you the first is busier. Crowd energy is a property
that only shows up when you read the picture and the sound together.

The visual side used STEERER for per-frame density estimation. The audio side was mine.

## My part: the audio

I built the classifier that separates positive crowd noise from ambient sound, using CLAP
embeddings as the representation and a ResNet50 over spectrograms for the decision. It
reached **0.85 accuracy** on positive-noise classification.

The harder problem was that no dataset existed for this distinction. Crowd audio corpora
tend to treat all crowd noise as one class, which is useless when the whole question is
whether the noise is energetic or incidental. So I curated one: 50 minutes of labelled
positive crowd audio and 40 minutes of neutral audio. That collection and labelling took
longer than the modelling, which is usually how it goes and almost never how it is
reported.

## What came out

Fused with the density signal, the combined measure tracked crowd energy across recordings
where either modality alone was ambiguous. The clearest cases were scenes that barely
changed on camera while the sound went up.

Published at the **7th IEEE International Conference on Multimedia Information Processing
and Retrieval (MIPR) 2024**, pages 308–314, with nine co-authors from IIIT Delhi and NUS.
