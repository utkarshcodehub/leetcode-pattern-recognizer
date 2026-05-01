from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
from dotenv import load_dotenv
import os, json, re

load_dotenv()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

SYSTEM_PROMPT = """You are an expert competitive programmer and CS educator. Analyze the given LeetCode problem and return ONLY a valid JSON object with no markdown fences, no preamble, no explanation outside the JSON.

Return exactly this structure:
{
  "primary_pattern": "string (one of: Two Pointers, Sliding Window, Fast & Slow Pointers, Merge Intervals, Cyclic Sort, Linked List Reversal, Tree BFS, Tree DFS, Two Heaps, Subsets/Backtracking, Binary Search, Top K Elements, K-way Merge, Dynamic Programming, Topological Sort, Graph BFS/DFS, Monotonic Stack, Prefix Sum, Bit Manipulation, Greedy)",
  "secondary_patterns": ["array of 0-2 additional patterns from the same list"],
  "difficulty_hint": "Easy | Medium | Hard",
  "core_insight": "1-2 sentences: the single key observation that unlocks this problem",
  "why_this_pattern": "2-3 sentences: why this pattern applies, what structural property of the problem maps to it",
  "solution_template": "pseudocode skeleton (10-20 lines) showing the pattern structure, NOT a full solution. Use comments to mark the parts the user fills in.",
  "time_complexity": "e.g. O(n log n)",
  "space_complexity": "e.g. O(k)",
  "complexity_reasoning": "1-2 sentences explaining the complexity",
  "similar_problems": [
    {"name": "Problem Name", "number": 123, "why": "1 sentence on similarity"},
    {"name": "Problem Name", "number": 456, "why": "1 sentence on similarity"},
    {"name": "Problem Name", "number": 789, "why": "1 sentence on similarity"}
  ],
  "watch_out_for": ["edge case or gotcha 1", "edge case or gotcha 2"]
}

Return ONLY the JSON. No other text."""


class AnalyzeRequest(BaseModel):
    problem: str


@app.post("/analyze")
async def analyze(req: AnalyzeRequest):
    if len(req.problem.strip()) < 20:
        raise HTTPException(status_code=400, detail="Problem text too short.")

    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": req.problem.strip()},
        ],
        temperature=0.2,
        max_tokens=4096,
    )

    raw = completion.choices[0].message.content.strip()
    # strip any accidental fences
    raw = re.sub(r'^```json\s*', '', raw)
    raw = re.sub(r'\s*```$', '', raw)
    # fix unescaped newlines inside JSON strings
    import re as _re
    def fix_json_strings(s):
        result = []
        in_string = False
        i = 0
        while i < len(s):
            c = s[i]
            if c == '"' and (i == 0 or s[i-1] != '\\'):
                in_string = not in_string
                result.append(c)
            elif in_string and c == '\n':
                result.append('\\n')
            elif in_string and c == '\r':
                result.append('\\r')
            elif in_string and c == '\t':
                result.append('\\t')
            else:
                result.append(c)
            i += 1
        return ''.join(result)

    raw = fix_json_strings(raw)

    try:
        data = json.loads(raw)
    except json.JSONDecodeError as e:
        print("JSON ERROR:", e)
        print("PROBLEM AREA:", repr(raw[max(0, e.pos-50):e.pos+50]))
        raise HTTPException(status_code=500, detail="Model returned invalid JSON. Try again.")

    return data


@app.get("/health")
async def health():
    return {"status": "ok"}
