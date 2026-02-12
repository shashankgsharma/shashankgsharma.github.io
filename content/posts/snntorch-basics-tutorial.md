---
title: "Getting Started with SNNTorch: A Beginner Tutorial"
date: 2026-02-13
draft: false
tags: ["snntorch", "spiking neural networks", "pytorch", "neuromorphic"]
summary: "A practical beginner-friendly tutorial on building Spiking Neural Networks using SNNTorch."
---

Spiking Neural Networks (SNNs) are a key component of neuromorphic computing.  
Unlike standard neural networks, SNNs communicate using **discrete spikes over time**, making them more biologically realistic and potentially far more energy efficient.

In this tutorial, we will cover the basics of **SNNTorch**, one of the most popular PyTorch-based libraries for building SNNs.

---

## Why SNNTorch?

SNNTorch is useful because:

- It is built directly on **PyTorch**
- It supports backpropagation with surrogate gradients
- It provides ready-to-use spiking neuron models
- It is beginner-friendly for deep learning researchers

---

## Installation

Install SNNTorch using pip:

```bash
pip install snntorch
```

---

## Core Idea: Neurons Spike Over Time

In a normal neural network:

- Input → activation → output

In an SNN:

- Input → membrane potential accumulates  
- When threshold is reached → neuron fires a spike  
- The process repeats over **timesteps**

---

## Importing SNNTorch

A typical setup looks like:

```python
import torch
import torch.nn as nn
import snntorch as snn
from snntorch import surrogate
```

---

## The Leaky Integrate-and-Fire (LIF) Neuron

The most common neuron model is the **LIF neuron**.

It has:

- membrane potential  
- decay over time  
- threshold-based spike firing  

Example:

```python
beta = 0.9  # decay factor

lif_neuron = snn.Leaky(beta=beta)
```

---

## Building a Simple Spiking Network

Let’s define a simple 2-layer SNN:

```python
class SimpleSNN(nn.Module):
    def __init__(self):
        super().__init__()

        self.fc1 = nn.Linear(784, 256)
        self.lif1 = snn.Leaky(beta=0.95)

        self.fc2 = nn.Linear(256, 10)
        self.lif2 = snn.Leaky(beta=0.95)

    def forward(self, x):

        # Initialize membrane potentials
        mem1 = self.lif1.init_leaky()
        mem2 = self.lif2.init_leaky()

        spk2_rec = []

        # Simulate over time
        for step in range(25):

            cur1 = self.fc1(x)
            spk1, mem1 = self.lif1(cur1, mem1)

            cur2 = self.fc2(spk1)
            spk2, mem2 = self.lif2(cur2, mem2)

            spk2_rec.append(spk2)

        return torch.stack(spk2_rec)
```

---

## Key Points

Notice:

- We simulate over **timesteps**
- Neurons output spikes (`spk`)
- Membrane state (`mem`) is carried forward

---

## Loss Function for SNNs

Because spikes are non-differentiable, SNNTorch uses **surrogate gradients**.

Example:

```python
spike_grad = surrogate.fast_sigmoid()

lif = snn.Leaky(beta=0.9, spike_grad=spike_grad)
```

This allows gradient-based learning.

---

## Training an SNN (High-Level)

Training looks similar to PyTorch:

```python
optimizer = torch.optim.Adam(model.parameters(), lr=1e-3)

for data, targets in dataloader:

    spk_out = model(data)

    loss = loss_fn(spk_out.sum(dim=0), targets)

    optimizer.zero_grad()
    loss.backward()
    optimizer.step()
```

---

## Where SNNTorch is Used

SNNTorch is widely used for:

- neuromorphic vision tasks  
- event-based sensors  
- low-power AI research  
- brain-inspired architectures  

---

## Conclusion

SNNTorch provides a clean bridge between:

- deep learning (PyTorch)
- neuromorphic computing (spikes + time)

If you already know PyTorch, it is one of the best frameworks to start exploring Spiking Neural Networks.

---

## Next Steps

In future posts, I will cover:

- Training SNNs on MNIST  
- Event-based datasets  
- Deployment on neuromorphic hardware  
- Framework comparisons: Lava vs Rockpool vs SNNTorch  

Stay tuned.
