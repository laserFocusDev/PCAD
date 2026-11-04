import { useMemo, useState } from 'react'
import {
  DEFAULTS, SPECS, COMPONENTS, ASSUMPTIONS, runChecks,
  type Params, type ParamKey, type Assumption,
} from './params'
import { Viewport } from './Viewport'

type Tab = 'assumptions' | 'components' | 'review'

export default function App() {
  const [params, setParams] = useState<Params>(DEFAULTS)
  const [assumptions, setAssumptions] = useState<Assumption[]>(ASSUMPTIONS)
  const [selected, setSelected] = useState<string | null>(null)
  const [tab, setTab] = useState<Tab>('review')
  const [rev, setRev] = useState(0)
  const [staged, setStaged] = useState<string | null>(null)

  const checks = useMemo(() => runChecks(params, assumptions), [params, assumptions])
  const unconfirmed = assumptions.filter(a => !a.confirmed).length
  const ready = checks.every(c => c.ok) && unconfirmed === 0

  // Any change invalidates a staged revision
  const setParam = (k: ParamKey, raw: string) => {
    if (raw === '') return
    const n = Number(raw)
    if (Number.isNaN(n)) return
    setParams(p => ({ ...p, [k]: n }))
    setStaged(null)
  }

  const setAssumption = (id: string, patch: Partial<Assumption>) => {
    setAssumptions(a => a.map(x => (x.id === id ? { ...x, ...patch } : x)))
    setStaged(null)
  }

  const generate = () => {
    const next = rev + 1
    setRev(next)
    setStaged(`RIG-${String(next).padStart(3, '0')}`)
  }

  // Placeholder export: parameter set only. CAD export is not implemented yet.
  const exportJson = () => {
    const payload = { revision: staged, generatedAt: new Date().toISOString(), params, assumptions, checks }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${staged}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const groups = [...new Set(SPECS.map(s => s.group))]
  const visibleSpecs = selected ? SPECS.filter(s => s.group === selected) : SPECS
  const selectedComp = COMPONENTS.find(c => c.id === selected)

  return (
    <div className="app">
      <header className="header">
        <strong>PCAD-RIG</strong>
        <span className="muted">Bench Water-Filter Test Rig · Parametric Mounting Hardware</span>
        <span className="spacer" />
        <span className={staged ? 'status ok' : 'status'}>
          {staged ? `STAGED ${staged}` : 'DRAFT'} · checks {checks.filter(c => c.ok).length}/{checks.length} · unconfirmed {unconfirmed}
        </span>
      </header>

      <aside className="tree">
        <div className="panel-title">Components</div>
        {COMPONENTS.map(c => (
          <button
            key={c.id}
            className={`tree-item ${selected === c.id ? 'on' : ''}`}
            onClick={() => setSelected(selected === c.id ? null : c.id)}
          >
            <span>{c.name}</span>
            <span className="mono muted">×{c.qty}</span>
          </button>
        ))}
        <div className="panel-title">Layout</div>
        <div className="kv"><span>Water lines</span><span className="mono">2 (mirror)</span></div>
        <div className="kv"><span>Board</span><span className="mono">{params.boardLength}×{params.boardWidth}×{params.boardThickness}</span></div>
        <div className="kv"><span>Line offset</span><span className="mono">±{params.lineOffset}</span></div>
      </aside>

      <main className="center">
        <Viewport params={params} selected={selected} />
      </main>

      <section className="params">
        <div className="panel-title">
          Parameters{selected ? ` · ${selectedComp?.name}` : ' · all'}
          {selected && <button className="link" onClick={() => setSelected(null)}>show all</button>}
        </div>
        {(selected ? [selected] : groups).map(g => (
          <div key={g} className="group">
            {!selected && <div className="group-title">{COMPONENTS.find(c => c.id === g)?.name ?? g}</div>}
            {visibleSpecs.filter(s => s.group === g).map(s => {
              const v = params[s.key]
              const out = v < s.min || v > s.max
              return (
                <label key={s.key} className="field">
                  <span>{s.label}</span>
                  <span className="field-right">
                    <input
                      type="number"
                      className={out ? 'out' : ''}
                      value={v}
                      step={1}
                      onChange={e => setParam(s.key, e.target.value)}
                    />
                    <span className="unit">mm</span>
                  </span>
                  <span className="range mono muted">{s.min}–{s.max}</span>
                </label>
              )
            })}
          </div>
        ))}
      </section>

      <section className="bottom">
        <nav className="tabs">
          {(['assumptions', 'components', 'review'] as Tab[]).map(t => (
            <button key={t} className={tab === t ? 'on' : ''} onClick={() => setTab(t)}>
              {t === 'assumptions' ? 'Assumptions' : t === 'components' ? 'Component list' : 'Review & generate'}
            </button>
          ))}
        </nav>

        <div className="tab-body">
          {tab === 'assumptions' && (
            <table className="grid">
              <thead>
                <tr><th>ID</th><th>Assumption</th><th>Value</th><th>Unit</th><th>Source</th><th>Confirmed</th></tr>
              </thead>
              <tbody>
                {assumptions.map(a => (
                  <tr key={a.id}>
                    <td className="mono">{a.id}</td>
                    <td>{a.label}</td>
                    <td>
                      <input
                        type="number"
                        className="txt-num"
                        value={a.value}
                        step="0.1"
                        onChange={e => setAssumption(a.id, { value: Number(e.target.value) })}
                      />
                    </td>
                    <td className="mono">{a.unit}</td>
                    <td className="muted">{a.source}</td>
                    <td>
                      <input
                        type="checkbox"
                        checked={a.confirmed}
                        onChange={e => setAssumption(a.id, { confirmed: e.target.checked })}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {tab === 'components' && (
            <table className="grid">
              <thead>
                <tr><th>Component</th><th>Qty</th><th>Material</th><th>Process</th><th>Tolerance</th><th>Note</th></tr>
              </thead>
              <tbody>
                {COMPONENTS.map(c => (
                  <tr key={c.id}>
                    <td>{c.name}</td>
                    <td className="mono">{c.qty}</td>
                    <td>{c.material}</td>
                    <td>{c.process}</td>
                    <td className="mono">{c.tol}</td>
                    <td className="muted">{c.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {tab === 'review' && (
            <div className="review">
              <table className="grid">
                <thead><tr><th>Rule</th><th>Result</th><th>Detail</th></tr></thead>
                <tbody>
                  {checks.map(c => (
                    <tr key={c.label}>
                      <td>{c.label}</td>
                      <td className={`mono ${c.ok ? '' : 'fail'}`}>{c.ok ? 'PASS' : 'FAIL'}</td>
                      <td className="mono muted">{c.detail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="review-actions">
                <span className="muted">
                  {ready
                    ? 'All checks pass and all assumptions are confirmed.'
                    : `Blocked: ${checks.filter(c => !c.ok).length} failing check(s), ${unconfirmed} unconfirmed assumption(s).`}
                </span>
                <button className="primary" disabled={!ready} onClick={generate}>Confirm and generate</button>
                <button disabled={!staged} onClick={exportJson}>Export parameter set (JSON)</button>
              </div>
              <p className="muted small">
                Changing any parameter or assumption clears the staged revision. Export is a parameter set only; CAD output is not implemented.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}