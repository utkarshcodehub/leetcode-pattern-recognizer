
import { useState } from "react";
import { PATTERNS } from "./patterns";

const API = "http://localhost:8000";

const DIFF_COLOR = { Easy: "#3ddc97", Medium: "#f5a623", Hard: "#ff6b6b" };

const EXAMPLE = `Given an array of integers nums and an integer k, return the number of contiguous subarrays where the product of all the elements is strictly less than k.

Example 1:
Input: nums = [10,5,2,6], k = 100
Output: 8

Example 2:
Input: nums = [1,2,3], k = 0
Output: 0

Constraints:
- 1 <= nums.length <= 3 * 10^4
- 1 <= nums[i] <= 1000
- 0 <= k <= 10^6`;

export default function App() {
  const [problem, setProblem] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePattern, setActivePattern] = useState(null);

  async function analyze() {
    if (!problem.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch(`${API}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problem }),
      });
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e.detail || "Server error");
      }
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={s.root}>
      {/* ── HEADER ── */}
      <header style={s.header}>
        <div style={s.headerInner}>
          <div style={s.logo}>
            <span style={s.logoIcon}>⌇</span>
            <span style={s.logoText}>PATTERN<span style={{ color: "var(--cyan)" }}>.</span>RECOGNIZER</span>
          </div>
          <div style={s.headerMeta}>
            <span style={s.badge}>v1.0</span>
            <span style={s.badge}>20 PATTERNS</span>
            <span style={s.badge}>GROQ · llama-3.3-70b</span>
          </div>
        </div>
        <div style={s.headerLine} />
      </header>

      <div style={s.body}>
        {/* ── SIDEBAR ── */}
        <aside style={{ ...s.sidebar, width: sidebarOpen ? 260 : 40 }}>
          <button style={s.sidebarToggle} onClick={() => setSidebarOpen(o => !o)}>
            {sidebarOpen ? "◀" : "▶"}
          </button>
          {sidebarOpen && (
            <div style={s.sidebarContent}>
              <div style={s.sidebarTitle}>PATTERN LIBRARY</div>
              {PATTERNS.map(p => (
                <button
                  key={p.name}
                  style={{
                    ...s.patternBtn,
                    ...(activePattern?.name === p.name ? s.patternBtnActive : {}),
                  }}
                  onClick={() => setActivePattern(activePattern?.name === p.name ? null : p)}
                >
                  <span style={s.patternIcon}>{p.icon}</span>
                  <span style={s.patternName}>{p.name}</span>
                </button>
              ))}
              {activePattern && (
                <div style={s.patternDetail}>
                  <div style={s.patternDetailName}>{activePattern.name}</div>
                  <div style={s.patternDetailText}>{activePattern.when}</div>
                </div>
              )}
            </div>
          )}
        </aside>

        {/* ── MAIN ── */}
        <main style={s.main}>
          {/* Input */}
          <section style={s.inputSection}>
            <div style={s.inputHeader}>
              <span style={s.sectionLabel}>// PROBLEM INPUT</span>
              <button style={s.exampleBtn} onClick={() => setProblem(EXAMPLE)}>
                load example
              </button>
            </div>
            <textarea
              style={s.textarea}
              value={problem}
              onChange={e => setProblem(e.target.value)}
              placeholder="Paste the full LeetCode problem statement here..."
              spellCheck={false}
            />
            <div style={s.inputFooter}>
              <span style={s.charCount}>{problem.length} chars</span>
              <button
                style={{ ...s.analyzeBtn, ...(loading ? s.analyzeBtnLoading : {}) }}
                onClick={analyze}
                disabled={loading || !problem.trim()}
              >
                {loading ? (
                  <span style={s.spinner}>◌ ANALYZING...</span>
                ) : (
                  "IDENTIFY PATTERN →"
                )}
              </button>
            </div>
          </section>

          {error && (
            <div style={s.errorBox}>
              <span style={{ color: "var(--red)" }}>✕ ERROR:</span> {error}
            </div>
          )}

          {/* Results */}
          {result && (
            <div style={s.results}>
              {/* Row 1: Pattern + Insight */}
              <div style={s.row2}>
                {/* Pattern Card */}
                <div style={s.card}>
                  <div style={s.cardLabel}>PRIMARY PATTERN</div>
                  <div style={s.primaryPattern}>{result.primary_pattern}</div>
                  {result.secondary_patterns?.length > 0 && (
                    <div style={s.secondaryRow}>
                      {result.secondary_patterns.map(p => (
                        <span key={p} style={s.secondaryBadge}>{p}</span>
                      ))}
                    </div>
                  )}
                  <div style={s.diffRow}>
                    <span style={s.cardLabel}>DIFFICULTY HINT</span>
                    <span style={{
                      ...s.diffBadge,
                      color: DIFF_COLOR[result.difficulty_hint] || "var(--text)",
                      borderColor: DIFF_COLOR[result.difficulty_hint] || "var(--border)",
                    }}>
                      {result.difficulty_hint}
                    </span>
                  </div>
                </div>

                {/* Insight Card */}
                <div style={s.card}>
                  <div style={s.cardLabel}>CORE INSIGHT</div>
                  <div style={s.insightText}>{result.core_insight}</div>
                  <div style={{ marginTop: 16 }}>
                    <div style={s.cardLabel}>WHY THIS PATTERN</div>
                    <div style={s.bodyText}>{result.why_this_pattern}</div>
                  </div>
                </div>
              </div>

              {/* Row 2: Template */}
              <div style={s.card}>
                <div style={s.cardLabel}>SOLUTION TEMPLATE</div>
                <pre style={s.codeBlock}>{result.solution_template}</pre>
              </div>

              {/* Row 3: Complexity + Similar */}
              <div style={s.row2}>
                {/* Complexity */}
                <div style={s.card}>
                  <div style={s.cardLabel}>COMPLEXITY</div>
                  <div style={s.complexityGrid}>
                    <div style={s.complexityItem}>
                      <span style={s.complexityLabel}>TIME</span>
                      <span style={s.complexityValue}>{result.time_complexity}</span>
                    </div>
                    <div style={s.complexityItem}>
                      <span style={s.complexityLabel}>SPACE</span>
                      <span style={s.complexityValue}>{result.space_complexity}</span>
                    </div>
                  </div>
                  <div style={s.bodyText}>{result.complexity_reasoning}</div>
                  {result.watch_out_for?.length > 0 && (
                    <div style={{ marginTop: 16 }}>
                      <div style={s.cardLabel}>⚠ WATCH OUT FOR</div>
                      {result.watch_out_for.map((w, i) => (
                        <div key={i} style={s.watchItem}>▸ {w}</div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Similar Problems */}
                <div style={s.card}>
                  <div style={s.cardLabel}>SIMILAR PROBLEMS</div>
                  {result.similar_problems?.map((p, i) => (
                    <div key={i} style={s.similarItem}>
                      <div style={s.similarHeader}>
                        <span style={s.similarNum}>#{p.number}</span>
                        <span style={s.similarName}>{p.name}</span>
                      </div>
                      <div style={s.similarWhy}>{p.why}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {!result && !loading && !error && (
            <div style={s.empty}>
              <div style={s.emptyIcon}>⌇</div>
              <div style={s.emptyText}>paste a problem → identify its pattern</div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

const s = {
  root: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "var(--bg)",
  },

  // Header
  header: { borderBottom: "1px solid var(--border)", padding: "0 24px" },
  headerInner: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    height: 56,
  },
  headerLine: { height: 1, background: "linear-gradient(90deg, var(--cyan) 0%, transparent 60%)" },
  logo: { display: "flex", alignItems: "center", gap: 10 },
  logoIcon: { fontSize: 22, color: "var(--cyan)" },
  logoText: { fontFamily: "var(--mono)", fontWeight: 700, fontSize: 15, letterSpacing: "0.12em", color: "#fff" },
  headerMeta: { display: "flex", gap: 8 },
  badge: {
    fontFamily: "var(--mono)", fontSize: 10, fontWeight: 500,
    color: "var(--text-dim)", border: "1px solid var(--border)",
    padding: "2px 8px", borderRadius: 2, letterSpacing: "0.08em",
  },

  // Layout
  body: { display: "flex", flex: 1, overflow: "hidden" },

  // Sidebar
  sidebar: {
    borderRight: "1px solid var(--border)",
    background: "var(--bg2)",
    transition: "width 0.2s ease",
    overflow: "hidden",
    flexShrink: 0,
    position: "relative",
  },
  sidebarToggle: {
    position: "absolute", top: 12, right: 8,
    background: "none", border: "1px solid var(--border)",
    color: "var(--text-dim)", cursor: "pointer",
    width: 24, height: 24, borderRadius: 3,
    fontFamily: "var(--mono)", fontSize: 10,
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 10,
  },
  sidebarContent: { padding: "12px 0 24px 0", overflowY: "auto", height: "100%" },
  sidebarTitle: {
    fontFamily: "var(--mono)", fontSize: 9, fontWeight: 600,
    letterSpacing: "0.15em", color: "var(--text-muted)",
    padding: "0 14px 10px 14px",
  },
  patternBtn: {
    width: "100%", display: "flex", alignItems: "center", gap: 8,
    padding: "6px 14px", background: "none", border: "none",
    cursor: "pointer", textAlign: "left",
    transition: "background 0.1s",
  },
  patternBtnActive: { background: "var(--cyan-dim)" },
  patternIcon: { fontSize: 12, color: "var(--cyan)", width: 16, flexShrink: 0 },
  patternName: { fontFamily: "var(--mono)", fontSize: 11, color: "var(--text)", whiteSpace: "nowrap" },
  patternDetail: {
    margin: "12px 10px 0 10px",
    background: "var(--bg3)", border: "1px solid var(--border)",
    borderRadius: 4, padding: "10px 12px",
  },
  patternDetailName: { fontFamily: "var(--mono)", fontSize: 11, fontWeight: 600, color: "var(--cyan)", marginBottom: 6 },
  patternDetailText: { fontFamily: "var(--mono)", fontSize: 10, color: "var(--text-dim)", lineHeight: 1.6 },

  // Main
  main: { flex: 1, overflowY: "auto", padding: 24, display: "flex", flexDirection: "column", gap: 20 },

  // Input
  inputSection: {
    background: "var(--bg2)", border: "1px solid var(--border)",
    borderRadius: 6, overflow: "hidden",
  },
  inputHeader: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "10px 16px", borderBottom: "1px solid var(--border)",
  },
  sectionLabel: { fontFamily: "var(--mono)", fontSize: 10, color: "var(--text-dim)", letterSpacing: "0.1em" },
  exampleBtn: {
    background: "none", border: "1px solid var(--border)", color: "var(--text-dim)",
    fontFamily: "var(--mono)", fontSize: 10, padding: "3px 10px",
    borderRadius: 3, cursor: "pointer",
    transition: "border-color 0.15s, color 0.15s",
  },
  textarea: {
    width: "100%", minHeight: 180, padding: "14px 16px",
    background: "transparent", border: "none", outline: "none",
    fontFamily: "var(--mono)", fontSize: 12, color: "var(--text)",
    resize: "vertical", lineHeight: 1.7,
  },
  inputFooter: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "10px 16px", borderTop: "1px solid var(--border)",
  },
  charCount: { fontFamily: "var(--mono)", fontSize: 10, color: "var(--text-muted)" },
  analyzeBtn: {
    background: "var(--cyan)", color: "#000",
    border: "none", borderRadius: 4,
    fontFamily: "var(--mono)", fontSize: 12, fontWeight: 700,
    padding: "8px 20px", cursor: "pointer",
    letterSpacing: "0.05em",
    transition: "opacity 0.15s",
  },
  analyzeBtnLoading: { opacity: 0.7, cursor: "not-allowed" },
  spinner: { display: "inline-block" },

  // Error
  errorBox: {
    background: "rgba(255,107,107,0.08)", border: "1px solid rgba(255,107,107,0.3)",
    borderRadius: 4, padding: "12px 16px",
    fontFamily: "var(--mono)", fontSize: 12, color: "var(--text)",
  },

  // Results
  results: { display: "flex", flexDirection: "column", gap: 16 },
  row2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },

  card: {
    background: "var(--bg2)", border: "1px solid var(--border)",
    borderRadius: 6, padding: 20,
  },
  cardLabel: {
    fontFamily: "var(--mono)", fontSize: 9, fontWeight: 600,
    letterSpacing: "0.15em", color: "var(--text-muted)",
    marginBottom: 10,
  },

  primaryPattern: {
    fontFamily: "var(--mono)", fontSize: 22, fontWeight: 700,
    color: "var(--cyan)", lineHeight: 1.2, marginBottom: 12,
  },
  secondaryRow: { display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 },
  secondaryBadge: {
    fontFamily: "var(--mono)", fontSize: 10,
    color: "var(--amber)", border: "1px solid rgba(245,166,35,0.4)",
    padding: "2px 10px", borderRadius: 12,
  },
  diffRow: { display: "flex", alignItems: "center", gap: 10, marginTop: 4 },
  diffBadge: {
    fontFamily: "var(--mono)", fontSize: 11, fontWeight: 600,
    border: "1px solid", padding: "2px 10px", borderRadius: 3,
  },

  insightText: {
    fontFamily: "var(--sans)", fontSize: 14, lineHeight: 1.7,
    color: "#e2eaf2", fontWeight: 400,
  },
  bodyText: { fontFamily: "var(--sans)", fontSize: 13, lineHeight: 1.7, color: "var(--text)" },

  codeBlock: {
    background: "var(--bg)", border: "1px solid var(--border)",
    borderRadius: 4, padding: 16,
    fontFamily: "var(--mono)", fontSize: 12, color: "#a8d8b0",
    lineHeight: 1.7, overflowX: "auto",
    whiteSpace: "pre-wrap", wordBreak: "break-word",
  },

  complexityGrid: { display: "flex", gap: 20, marginBottom: 14 },
  complexityItem: { display: "flex", flexDirection: "column", gap: 4 },
  complexityLabel: { fontFamily: "var(--mono)", fontSize: 9, color: "var(--text-muted)", letterSpacing: "0.12em" },
  complexityValue: { fontFamily: "var(--mono)", fontSize: 20, fontWeight: 700, color: "var(--green)" },

  watchItem: { fontFamily: "var(--mono)", fontSize: 11, color: "var(--amber)", marginTop: 6, lineHeight: 1.5 },

  similarItem: { marginBottom: 14 },
  similarHeader: { display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 },
  similarNum: { fontFamily: "var(--mono)", fontSize: 10, color: "var(--cyan)", fontWeight: 600 },
  similarName: { fontFamily: "var(--mono)", fontSize: 12, color: "var(--text)", fontWeight: 500 },
  similarWhy: { fontFamily: "var(--sans)", fontSize: 12, color: "var(--text-dim)", lineHeight: 1.5 },

  // Empty state
  empty: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, opacity: 0.3 },
  emptyIcon: { fontSize: 48, color: "var(--cyan)" },
  emptyText: { fontFamily: "var(--mono)", fontSize: 13, color: "var(--text-dim)" },
};
