# LeetCode Pattern Recognizer

> Paste any LeetCode-style problem and get instant pattern classification, solution strategy, and similar problems — so you study smarter, not harder.


---

## Overview

The single biggest unlock in DSA preparation is recognizing patterns — knowing that a problem is a sliding window variant, or that it maps to a graph BFS, before writing a single line of code. LeetCode Pattern Recognizer automates this.

Paste a problem statement, and the AI identifies the underlying algorithmic pattern, explains why, outlines the optimal approach, gives time/space complexity, and lists similar problems to practice next.

---

## Features

- **Pattern classification** — identifies patterns like Sliding Window, Two Pointers, Dynamic Programming, Graph Traversal, Monotonic Stack, Binary Search, Backtracking, and more
- **Approach breakdown** — step-by-step solution strategy in plain English before any code
- **Complexity analysis** — time and space complexity with justification
- **Similar problems** — curated list of related LeetCode problems to reinforce the pattern
- **Confidence score** — AI rates how strongly the problem fits the identified pattern
- **Pattern library** — reference panel showing all recognizable patterns with descriptions

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite + Tailwind CSS |
| Backend | FastAPI (Python) |
| AI | Groq API — Llama 3.3 70B |
| Deployment | Vercel (frontend) + Render (backend) |

---

## Architecture

```
User pastes problem statement
        ↓
Frontend → POST /analyze (FastAPI)
        ↓
Groq LLM → classify pattern + generate strategy
        ↓
Structured JSON response → Frontend renders breakdown
```

---

## Setup

### Backend

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Add GROQ_API_KEY to .env
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
# Set VITE_API_URL=http://localhost:8000
npm run dev
```

### Environment Variables

**Backend `.env`:**
```
GROQ_API_KEY=your_groq_api_key
```

**Frontend `.env`:**
```
VITE_API_URL=http://localhost:8000
```

---

## API

### `POST /analyze`

**Request:**
```json
{
  "problem": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target..."
}
```

**Response:**
```json
{
  "pattern": "Hash Map / Two Sum",
  "confidence": 0.97,
  "explanation": "This problem requires finding pairs that satisfy a condition — classic hash map lookup pattern.",
  "approach": ["Iterate through array", "For each element, check if complement exists in map", "Store current element in map"],
  "time_complexity": "O(n)",
  "space_complexity": "O(n)",
  "similar_problems": ["3Sum", "Two Sum II", "4Sum", "Subarray Sum Equals K"]
}
```

---

## Supported Patterns

- Arrays & Hashing
- Two Pointers
- Sliding Window
- Stack / Monotonic Stack
- Binary Search
- Linked List
- Trees (DFS / BFS)
- Graphs (DFS / BFS / Topological Sort)
- Dynamic Programming (1D / 2D / Interval)
- Greedy
- Backtracking
- Heap / Priority Queue
- Tries
- Bit Manipulation

---

## Project Structure

```
leetcode-pattern-recognizer/
├── backend/
│   ├── main.py
│   ├── routers/
│   │   └── analyze.py
│   ├── services/
│   │   └── ai.py
│   └── requirements.txt
└── frontend/
    └── src/
        ├── App.jsx
        └── components/
            ├── ProblemInput.jsx
            ├── PatternResult.jsx
            └── PatternLibrary.jsx
```

---

