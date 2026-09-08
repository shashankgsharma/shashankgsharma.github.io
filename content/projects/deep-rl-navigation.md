---
title: "Reinforcement Learning over Knowledge Graphs"
date: 2024-12-01
draft: false
ptype: "research"
summary: "An agent that walks a knowledge graph to answer a query. 95.10 AUC-PR on Countries-S3, the hardest split of the three."
affiliation: "IIIT Delhi"
guide: "Dr. Sanjit Kaul"
timeline: "Sept 2024 – Dec 2024"
github: "https://github.com/Junaidfayazlone/RL-Project"
tags: ["Reinforcement learning", "Knowledge graphs", "LSTM", "Policy gradients"]
---

## Re-implementation, not invention

This was a course project, and it was explicitly a re-implementation: take a published
approach to knowledge-graph navigation and rebuild it well enough to reproduce the claim.
I have kept it on the site because reproducing somebody else's result carefully taught me
more than most of my own first attempts did.

The framing is nice. Answering a query becomes navigation: start at an entity, pick an
outgoing relation, repeat, stop somewhere that answers the question. The path is the
explanation, which an embedding model never gives you.

## The sparse-reward problem

The agent learns nothing until it happens to land on a correct target. On a real graph with
a serious branching factor, that essentially never happens by accident.

The policy network is an LSTM over the walk so far, so each step is conditioned on the
whole path rather than the current node. Optimisation is REINFORCE with a baseline, and
the baseline is not optional. Without it the gradients are noise.

## Result

**95.10 AUC-PR** on **Countries-S3**, ahead of the baselines we compared against. S3 is the
hardest of the three splits: it needs multi-hop composition rather than a single lookup,
which is the only version of the task that tests the idea.

## What I took from it

Almost none of the difficulty was in the architecture. It was in reward shaping and in
getting enough successful trajectories in front of the agent early for credit assignment
to have anything to work with. The LSTM mattered. It mattered far less than that.
