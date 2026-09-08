---
title: "Knowledge-Augmented LLMs for Intent-Based Summarization"
date: 2025-04-01
draft: false
ptype: "research"
summary: "Steering healthcare summaries towards a requested perspective, using classifier guidance and an energy term over adapters and prefix tuning."
affiliation: "IIIT Delhi"
guide: "Dr. Shad Akhtar"
timeline: "Jan 2025 – Apr 2025"
github: "https://github.com/shashank23088/nlp_project"
tags: ["NLP", "Summarization", "LLMs", "PEFT", "Healthcare AI"]
---

## The setup

A healthcare question thread holds several kinds of answer at once. A clinical suggestion.
Somebody's personal experience. Reassurance. A warning. A normal summariser blends all of
them into one grey paragraph, which is the least useful thing it could do, because the
reader almost always wants one specific perspective.

So: given a thread and a requested intent, produce a summary that stays inside it.

## What we built

Three pieces, stacked.

A RoBERTa classifier scores candidate summaries for perspective adherence, and that score
feeds back into training instead of sitting in a post-hoc filter. On top of it, an
energy term penalises drift away from the requested perspective, which plain likelihood
loss is completely indifferent to. Underneath both, prefix tuning and adapters over
Flan-T5 and LLaMA 3, so each perspective carries a small set of its own weights rather
than an entire fine-tuned copy of the model.

## Numbers

**BLEU 0.78** on the intent-conditioned task. The ablation was more interesting than the
headline: guidance and the energy term earned their keep mainly on threads that mixed
several perspectives, which is exactly the case a plain summariser mangles.

## Where I think it falls down

BLEU cannot tell you whether a summary respects a perspective. It can only tell you the
words overlapped. If I ran this again I would build a preference-based evaluation and
score perspective adherence and factual accuracy separately, because a summary can be
loyal to the requested viewpoint and still wrong about the medicine.
