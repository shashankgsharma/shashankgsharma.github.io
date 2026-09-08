---
title: "One Spiking Model, Four Frameworks"
date: 2025-09-01
draft: false
ptype: "research"
summary: "A bridge between general neuromorphic frameworks and hardware-specific ones, plus a harness that measures what a port actually costs."
affiliation: "TCS Research, Kolkata"
guide: "Dr. Barnali Basak, Sounak Dey"
timeline: "Sept 2025 – present"
tags: ["Neuromorphic computing", "Spiking neural networks", "Systems", "Edge AI"]
---

## What it is

A model written for SNNTorch will not run on Lava. One tuned in Rockpool does not move
cleanly to Sinabs, or onto the hardware each of them targets. My main project at TCS
Research is the layer that makes that move possible, together with the measurement that
tells you what the move cost.

## Why porting is harder than it sounds

Every framework has an opinion about the things nobody writes down:

- what a timestep is, and whether state carries across it the same way
- when the membrane resets, and by how much
- how a surrogate gradient is shaped
- how much precision a weight is allowed before quantisation bites

None of that lives in a config file. It lives in the model definition, tangled together
with the parts you actually care about. Which is why two published accuracies from two
frameworks are not really comparable, even when the architecture diagram is identical.

## The differential harness

The abstraction itself is the boring half: a framework-neutral description of topology,
neuron model, temporal resolution and encoding, plus a lowering pass per backend.

The half I find useful is the harness. It pushes the same input through every backend and
reports where the spike trains diverge, and when. "It runs" is not a result. "It runs, and
the third layer starts drifting at timestep 40 because of the reset rule" is.

## Where it stands

Time-series classification models ported through the abstraction hold **96% accuracy**,
within **2%** of the reference implementations. Coverage is being extended from dense
spiking layers to convolutional ones, and from simulators to the constraints of actual
hardware, which is where the quantisation questions stop being theoretical.

## What I am chasing now

Adaptive-LIF neurons. Their threshold rises as they fire and decays when they do not,
which hands the network a slow memory that never touches the weights. If it behaves
predictably across backends, it should live inside the abstraction. If it does not, that
is worth knowing before anyone builds on it.
