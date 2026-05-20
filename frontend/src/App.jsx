import { useState, useEffect, useCallback } from "react";

const API = "http://localhost:5050/api";

const useFetch = (url, deps = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const refetch = useCallback(async () => {
    setLoading(true);
    try { const r = await fetch(url); setData(await r.json()); } catch {}
    finally { setLoading(false); }
  }, [url]);
  useEffect(() => { refetch(); }, deps);
  return { data, loading, refetch };
};

// ── Icons ──────────────────────────────────────────────────────────────────────
const Ic = ({ n, s = 16 }) => {
  const paths = {
    zap:      "M13 2 3 14h9l-1 8 10-12h-9z",
    grid:     "M3 3h7v7H3zm11 0h7v7h-7zM3 14h7v7H3zm11 0h7v7h-7z",
    globe:    "M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z",
    check:    "M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4 12 14.01l-3-3",
    wallet:   "M20 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zm0 0V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v2m10 5h2a2 2 0 1 1 0 4h-2",
    bell:     "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0",
    cog:      "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm7-3a1.5 1.5 0 0 0 .3 1.66l.06.05a2 2 0 0 1-2.83 2.83l-.06-.05A1.5 1.5 0 0 0 15 16.5a1.5 1.5 0 0 0-.91 1.37V18a2 2 0 0 1-4 0v-.09A1.5 1.5 0 0 0 9 16.5a1.5 1.5 0 0 0-1.66.3l-.05.06a2 2 0 0 1-2.83-2.83l.05-.06A1.5 1.5 0 0 0 4.5 12a1.5 1.5 0 0 0-1.37-.91H3a2 2 0 0 1 0-4h.09A1.5 1.5 0 0 0 4.5 6.4a1.5 1.5 0 0 0-.3-1.66l-.06-.05a2 2 0 0 1 2.83-2.83l.06.05A1.5 1.5 0 0 0 9 2.2a1.5 1.5 0 0 0 .91-1.37V.75",
    book:     "M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15z",
    plus:     "M12 5v14M5 12h14",
    play:     "M5 3l14 9-14 9V3z",
    pause:    "M6 4h4v16H6zM14 4h4v16h-4z",
    trash:    "M3 6h18M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2",
    refresh:  "M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15",
    send:     "M22 2 11 13M22 2 15 22 11 13 2 9l20-7z",
    shield:   "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    link:     "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",
    sun:      "M12 7a5 5 0 1 0 0 10A5 5 0 0 0 12 7zM12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42",
    moon:     "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z",
    activity: "M22 12h-4l-3 9L9 3l-3 9H2",
    x:        "M18 6 6 18M6 6l12 12",
    cpu:      "M9 9h6v6H9zM4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5",
    ok:       "M20 6 9 17l-5-5",
    eye:      "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  };
  const fill = ["zap","play"].includes(n);
  return (
    <svg width={s} height={s} viewBox="0 0 24 24"
      fill={fill ? "currentColor" : "none"}
      stroke={fill ? "none" : "currentColor"}
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={paths[n] || ""}/>
    </svg>
  );
};

// ── Shared Components ──────────────────────────────────────────────────────────
const Badge = ({ text }) => {
  const map = {
    testnet:"#4f63e7",points:"#0ea5e9",swap:"#f59e0b",bridge:"#8b5cf6",
    nft:"#ec4899",social:"#14b8a6",unknown:"#64748b",active:"#10b981",
    paused:"#f59e0b",success:"#10b981",failed:"#ef4444",manual:"#f59e0b",
    running:"#0ea5e9",skipped:"#64748b",ethereum:"#4f63e7",arbitrum:"#0ea5e9",
    optimism:"#ef4444",base:"#0ea5e9",solana:"#8b5cf6",cosmos:"#14b8a6",
    polygon:"#8b5cf6",bsc:"#f59e0b",sui:"#0ea5e9",aptos:"#14b8a6",avalanche:"#ef4444",
  };
  const c = map[text?.toLowerCase()] || "#64748b";
  return (
    <span style={{
      display:"inline-flex",alignItems:"center",padding:"2px 10px",borderRadius:20,
      fontSize:11,fontWeight:600,letterSpacing:".02em",
      background:c+"18",color:c,border:`1px solid ${c}30`
    }}>{text}</span>
  );
};

const Ring = ({ score = 0 }) => {
  const r = 22, c = 2 * Math.PI * r, prog = (score / 100) * c;
  const col = score > 70 ? "#10b981" : score > 40 ? "#f59e0b" : "#ef4444";
  return (
    <svg width="56" height="56" viewBox="0 0 56 56">
      <circle cx="28" cy="28" r={r} fill="none" stroke="currentColor" strokeOpacity=".1" strokeWidth="4"/>
      <circle cx="28" cy="28" r={r} fill="none" stroke={col} strokeWidth="4"
        strokeDasharray={`${prog} ${c}`} strokeLinecap="round"
        transform="rotate(-90 28 28)" style={{transition:"stroke-dasharray .6s ease"}}/>
      <text x="28" y="33" textAnchor="middle" fontSize="12" fontWeight="700" fill={col}>{score}</text>
    </svg>
  );
};

const Spin = ({ sm }) => (
  <span style={{
    display:"inline-block",width:sm?13:28,height:sm?13:28,
    border:`${sm?2:3}px solid currentColor`,borderTopColor:"transparent",
    borderRadius:"50%",animation:"_spin .7s linear infinite",opacity:.5,flexShrink:0
  }}/>
);

const Toast = ({ msg, type, onClose }) => {
  const c = {success:"#10b981",error:"#ef4444",info:"#4f63e7"}[type]||"#4f63e7";
  return (
    <div style={{
      display:"flex",alignItems:"center",gap:10,padding:"12px 16px",borderRadius:12,
      background:"var(--surface)",border:`1px solid ${c}30`,
      boxShadow:"0 8px 32px rgba(0,0,0,.2)",fontSize:13,color:"var(--text)",
      minWidth:230,animation:"_slideUp .2s ease",fontFamily:"inherit"
    }}>
      <span style={{color:c,fontSize:16}}>●</span>
      <span style={{flex:1}}>{msg}</span>
      <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:"var(--text2)",display:"flex",padding:0}}>
        <Ic n="x" s={13}/>
      </button>
    </div>
  );
};

// ── Field / Form helpers ───────────────────────────────────────────────────────
const Field = ({ label, hint, children }) => (
  <div style={{display:"flex",flexDirection:"column",gap:6}}>
    <label style={{fontSize:12,fontWeight:600,color:"var(--text2)",letterSpacing:".01em"}}>{label}</label>
    {children}
    {hint && <p style={{fontSize:11,color:"var(--text3)",margin:0}}>{hint}</p>}
  </div>
);

const inp = {
  padding:"10px 14px",background:"var(--surface2)",border:"1px solid var(--border)",
  borderRadius:10,color:"var(--text)",fontSize:13,fontFamily:"inherit",outline:"none",
  transition:"border-color .15s, box-shadow .15s",width:"100%"
};

// ═══════════════════════════════════════════════════════════════════════════════
//  DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════════
const Dashboard = () => {
  const { data: stats, loading } = useFetch(`${API}/stats`, []);
  const { data: health } = useFetch(`${API}/health`, []);

  const cards = [
    { label:"Active Projects", val:stats?.projects?.active,   sub:`${stats?.projects?.total||0} total`,     icon:"globe",    c:"#4f63e7" },
    { label:"Tasks Executed",  val:stats?.tasks?.total,       sub:`${stats?.tasks?.success_rate||0}% ok`,   icon:"activity", c:"#10b981" },
    { label:"Wallets Tracked", val:stats?.wallets?.total,     sub:"public only",                            icon:"wallet",   c:"#0ea5e9" },
    { label:"Unread Alerts",   val:stats?.notifications?.unread, sub:"from bot runs",                       icon:"bell",     c:"#f59e0b" },
  ];

  return (
    <div className="panel">
      {/* ── Hero ── */}
      <div className="hero">
        <div className="hero-left">
          <div className="hero-pill">
            <span className="dot-pulse"/>
            {health?.status === "online" ? "System Online · v2.0" : "⚠ Backend Offline"}
          </div>
          <h1 className="hero-h1">Track. Analyze.<br/><span className="grad">Automate.</span></h1>
          <p className="hero-p">AI-powered airdrop farming — real scraping, live task execution, 24/7 scheduling and notifications.</p>
        </div>
        <div className="hero-right">
          <div className="orb o1"/><div className="orb o2"/>
          <div className="term">
            <div className="term-dots"><span/><span/><span/></div>
            <pre className="term-code">{`$ bot run --all-active
▶ Scanning active projects…
✓ Site health    online 142ms
✓ Faucet check   endpoint found
✓ Announcement   no keywords yet
✓ Eligibility    testing…
✓ Tasks done     6/6 success`}</pre>
          </div>
        </div>
      </div>

      {/* ── Metric cards ── */}
      <div className="metric-grid">
        {cards.map(m => (
          <div key={m.label} className="metric-card" style={{"--mc":m.c}}>
            <div style={{color:m.c,marginBottom:14}}><Ic n={m.icon} s={20}/></div>
            <div className="metric-val">{loading ? "…" : (m.val ?? "—")}</div>
            <div className="metric-lbl">{m.label}</div>
            <div className="metric-sub">{m.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Recent activity ── */}
      {stats?.recent_tasks?.length > 0 && (
        <div className="card">
          <div className="card-head"><h3>Recent Activity</h3></div>
          <table className="tbl">
            <thead><tr><th>Task</th><th>Project</th><th>Status</th><th>Time</th></tr></thead>
            <tbody>{stats.recent_tasks.map(t => (
              <tr key={t.id}>
                <td>{t.task_name}</td><td>{t.project_name}</td>
                <td><Badge text={t.status}/></td>
                <td className="mono" style={{fontSize:11,color:"var(--text3)"}}>{new Date(t.created_at).toLocaleString()}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}

      {stats?.type_breakdown && (
        <div className="two-col">
          {[["Project Types", stats.type_breakdown], ["Chains", stats.chain_breakdown]].map(([title, data]) => (
            <div key={title} className="card">
              <div className="card-head"><h3>{title}</h3></div>
              <div style={{padding:"16px 20px",display:"flex",flexDirection:"column",gap:10}}>
                {Object.entries(data||{}).map(([k,v]) => (
                  <div key={k} style={{display:"flex",alignItems:"center",gap:10}}>
                    <Badge text={k}/>
                    <div style={{flex:1,height:4,background:"var(--border)",borderRadius:2,overflow:"hidden"}}>
                      <div style={{height:"100%",background:"var(--accent)",width:`${(v/(stats.projects.total||1))*100}%`,transition:"width .5s"}}/>
                    </div>
                    <span className="mono" style={{fontSize:11,color:"var(--text3)",minWidth:14}}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
//  PROJECTS
// ═══════════════════════════════════════════════════════════════════════════════
const Projects = ({ toast }) => {
  const { data: projects, loading, refetch } = useFetch(`${API}/projects`, []);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name:"", url:"", description:"" });
  const [adding, setAdding] = useState(false);
  const [running, setRunning] = useState({});
  const f = k => e => setForm(p => ({...p, [k]: e.target.value}));

  const add = async () => {
    if (!form.name || !form.url) return toast("Name and URL required", "error");
    setAdding(true);
    try {
      const r = await fetch(`${API}/projects`, {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)});
      if (!r.ok) throw 0;
      toast("Project analyzed & added!", "success");
      setShowAdd(false); setForm({name:"",url:"",description:""}); refetch();
    } catch { toast("Failed to add project", "error"); }
    finally { setAdding(false); }
  };

  const runBot = async (id, name) => {
    setRunning(r => ({...r,[id]:true}));
    try { await fetch(`${API}/tasks/run/${id}`,{method:"POST"}); toast(`Bot ran: ${name}`,"success"); refetch(); }
    catch { toast("Run failed","error"); }
    finally { setRunning(r => ({...r,[id]:false})); }
  };

  const toggle = async (id, s) => {
    await fetch(`${API}/projects/${id}/status`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({status:s==="active"?"paused":"active"})});
    refetch();
  };
  const del = async (id, name) => {
    if (!confirm(`Delete "${name}"?`)) return;
    await fetch(`${API}/projects/${id}`,{method:"DELETE"}); toast("Deleted","info"); refetch();
  };
  const reanalize = async (id, name) => {
    toast(`Re-analyzing ${name}…`,"info");
    await fetch(`${API}/projects/${id}/reanalyze`,{method:"POST"});
    toast("Analysis updated!","success"); refetch();
  };

  return (
    <div className="panel">
      <div className="sec-head">
        <div><h2 className="sec-title">Projects</h2><p className="sec-sub">{projects?.length||0} projects — add URL to auto-generate tasks via AI</p></div>
        <div style={{display:"flex",gap:10}}>
          <button className="btn-ghost" onClick={refetch}><Ic n="refresh" s={13}/> Refresh</button>
          <button className="btn-primary" onClick={() => setShowAdd(v => !v)}><Ic n="plus" s={13}/> Add Project</button>
        </div>
      </div>

      {showAdd && (
        <div className="card" style={{padding:24,marginBottom:24}}>
          <h3 style={{fontSize:15,fontWeight:700,marginBottom:18}}>Add New Project</h3>
          <div className="form-grid">
            <Field label="Project Name *"><input style={inp} placeholder="e.g. LayerZero" value={form.name} onChange={f("name")} onFocus={e=>e.target.style.borderColor="var(--accent)"} onBlur={e=>e.target.style.borderColor="var(--border)"}/></Field>
            <Field label="Website URL *"><input style={inp} placeholder="https://layerzero.network" value={form.url} onChange={f("url")} onFocus={e=>e.target.style.borderColor="var(--accent)"} onBlur={e=>e.target.style.borderColor="var(--border)"}/></Field>
            <Field label="Notes (optional)" style={{gridColumn:"1/-1"}}><input style={{...inp}} placeholder="Brief description" value={form.description} onChange={f("description")} onFocus={e=>e.target.style.borderColor="var(--accent)"} onBlur={e=>e.target.style.borderColor="var(--border)"}/></Field>
          </div>
          {adding && <p style={{fontSize:12,color:"var(--accent)",marginTop:12}}>⚡ AI scraping project site — this may take 10–30 seconds…</p>}
          <div style={{display:"flex",gap:10,marginTop:18}}>
            <button className="btn-ghost" onClick={() => setShowAdd(false)}>Cancel</button>
            <button className="btn-primary" onClick={add} disabled={adding}>
              {adding ? <><Spin sm/>&nbsp;Analyzing…</> : <><Ic n="zap" s={13}/> Analyze & Add</>}
            </button>
          </div>
        </div>
      )}

      {loading ? <div className="loading"><Spin/></div> :
        !projects?.length ? <div className="empty"><Ic n="globe" s={40}/><h3>No projects yet</h3><p>Add your first project URL above</p></div> :
        <div className="proj-grid">
          {projects.map(p => (
            <div key={p.id} className={`proj-card${p.status==="paused"?" paused":""}`}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                <div>
                  <div style={{fontWeight:700,fontSize:16,marginBottom:8}}>{p.name}</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:6}}><Badge text={p.type}/><Badge text={p.chain}/><Badge text={p.status}/></div>
                </div>
                <Ring score={p.score||0}/>
              </div>
              <p style={{fontSize:12,color:"var(--text2)",lineHeight:1.65,marginBottom:12}}>{p.summary||"No summary yet"}</p>
              <div style={{fontSize:11,color:"var(--text3)",display:"flex",alignItems:"center",gap:6,marginBottom:12}}>
                <Ic n="link" s={11}/><a href={p.url} target="_blank" rel="noreferrer" style={{color:"var(--accent)",textDecoration:"none"}}>{p.url}</a>
              </div>
              {p.tasks?.length > 0 && (
                <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:12}}>
                  {p.tasks.slice(0,4).map((t,i) => <span key={i} className="chip">{t.name}</span>)}
                  {p.tasks.length > 4 && <span className="chip" style={{color:"var(--text3)"}}>+{p.tasks.length-4}</span>}
                </div>
              )}
              {p.social_links && Object.keys(p.social_links).length > 0 && (
                <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:12}}>
                  {Object.entries(p.social_links).map(([k,v]) => <a key={k} href={v} target="_blank" rel="noreferrer" className="social-chip">{k}</a>)}
                </div>
              )}
              {p.last_run && <div className="mono" style={{fontSize:10,color:"var(--text3)",marginBottom:12}}>Last run: {new Date(p.last_run).toLocaleString()}</div>}
              <div style={{display:"flex",gap:7,flexWrap:"wrap",paddingTop:14,borderTop:"1px solid var(--border)"}}>
                <button className="btn-primary btn-sm" onClick={() => runBot(p.id,p.name)} disabled={running[p.id]}>
                  {running[p.id] ? <Spin sm/> : <Ic n="play" s={12}/>} Run Bot
                </button>
                <button className="btn-ghost btn-sm" onClick={() => toggle(p.id,p.status)}>
                  <Ic n={p.status==="active"?"pause":"play"} s={12}/> {p.status==="active"?"Pause":"Resume"}
                </button>
                <button className="btn-ghost btn-sm" onClick={() => reanalize(p.id,p.name)}><Ic n="refresh" s={12}/> Re-analyze</button>
                <button className="btn-danger btn-sm" onClick={() => del(p.id,p.name)}><Ic n="trash" s={12}/></button>
              </div>
            </div>
          ))}
        </div>
      }
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
//  TASK LOGS
// ═══════════════════════════════════════════════════════════════════════════════
const TaskLogs = () => {
  const { data: tasks, loading, refetch } = useFetch(`${API}/tasks?limit=200`, []);
  const [filter, setFilter] = useState("all");
  const filters = ["all","success","failed","manual","skipped","running"];
  const shown = filter === "all" ? tasks : tasks?.filter(t => t.status === filter);
  return (
    <div className="panel">
      <div className="sec-head">
        <div><h2 className="sec-title">Task Logs</h2><p className="sec-sub">{tasks?.length||0} execution records</p></div>
        <button className="btn-ghost" onClick={refetch}><Ic n="refresh" s={13}/> Refresh</button>
      </div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:20}}>
        {filters.map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{
            padding:"6px 16px",borderRadius:20,fontSize:12,fontWeight:500,cursor:"pointer",
            border:`1px solid ${filter===s?"var(--accent)":"var(--border)"}`,
            background:filter===s?"var(--accent)":"transparent",
            color:filter===s?"#fff":"var(--text2)",transition:"all .15s",fontFamily:"inherit"
          }}>{s}</button>
        ))}
      </div>
      {loading ? <div className="loading"><Spin/></div> :
        !shown?.length ? <div className="empty"><Ic n="activity" s={40}/><h3>No logs yet</h3><p>Run the bot on a project to see records</p></div> :
        <div className="card">
          <table className="tbl">
            <thead><tr><th>#</th><th>Task</th><th>Project</th><th>Status</th><th>Result</th><th>Wallet</th><th>Time</th></tr></thead>
            <tbody>{shown.map(t => (
              <tr key={t.id}>
                <td style={{color:"var(--text3)",fontSize:11}}>{t.id}</td>
                <td style={{fontWeight:500}}>{t.task_name}</td><td>{t.project_name}</td>
                <td><Badge text={t.status}/></td>
                <td style={{fontSize:12,color:"var(--text2)",maxWidth:180}}>{t.result||"—"}</td>
                <td className="mono" style={{fontSize:11}}>{t.wallet?t.wallet.slice(0,8)+"…":"—"}</td>
                <td className="mono" style={{fontSize:11,color:"var(--text3)"}}>{new Date(t.created_at).toLocaleString()}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      }
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
//  WALLETS
// ═══════════════════════════════════════════════════════════════════════════════
const Wallets = ({ toast }) => {
  const { data: wallets, loading, refetch } = useFetch(`${API}/wallets`, []);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ address:"", chain:"ethereum", label:"" });
  const chains = ["ethereum","arbitrum","optimism","base","solana","cosmos","sui","aptos","polygon","bsc","avalanche"];
  const add = async () => {
    if (!form.address) return toast("Address required","error");
    await fetch(`${API}/wallets`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)});
    toast("Wallet added","success"); setForm({address:"",chain:"ethereum",label:""}); setShowAdd(false); refetch();
  };
  const del = async id => { await fetch(`${API}/wallets/${id}`,{method:"DELETE"}); toast("Removed","info"); refetch(); };
  return (
    <div className="panel">
      <div className="sec-head">
        <div><h2 className="sec-title">Wallets</h2><p className="sec-sub">Public addresses only — private keys never stored</p></div>
        <button className="btn-primary" onClick={() => setShowAdd(v => !v)}><Ic n="plus" s={13}/> Add Wallet</button>
      </div>
      <div className="info-banner"><Ic n="shield" s={15}/> Only public wallet addresses are stored. All on-chain transactions require manual approval.</div>
      {showAdd && (
        <div className="card" style={{padding:20,marginBottom:20}}>
          <div className="form-grid">
            <Field label="Public Address *" style={{gridColumn:"1/-1"}}><input style={inp} placeholder="0x… or sol1…" value={form.address} onChange={e=>setForm(p=>({...p,address:e.target.value}))} onFocus={e=>e.target.style.borderColor="var(--accent)"} onBlur={e=>e.target.style.borderColor="var(--border)"}/></Field>
            <Field label="Chain">
              <select style={inp} value={form.chain} onChange={e=>setForm(p=>({...p,chain:e.target.value}))}>
                {chains.map(c=><option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Label"><input style={inp} placeholder="Main Wallet" value={form.label} onChange={e=>setForm(p=>({...p,label:e.target.value}))} onFocus={e=>e.target.style.borderColor="var(--accent)"} onBlur={e=>e.target.style.borderColor="var(--border)"}/></Field>
          </div>
          <div style={{display:"flex",gap:10,marginTop:16}}>
            <button className="btn-ghost" onClick={() => setShowAdd(false)}>Cancel</button>
            <button className="btn-primary" onClick={add}><Ic n="plus" s={13}/> Add</button>
          </div>
        </div>
      )}
      {loading ? <div className="loading"><Spin/></div> :
        !wallets?.length ? <div className="empty"><Ic n="wallet" s={40}/><h3>No wallets</h3><p>Add your first public address</p></div> :
        <div className="card">
          <table className="tbl">
            <thead><tr><th>Label</th><th>Address</th><th>Chain</th><th>Added</th><th></th></tr></thead>
            <tbody>{wallets.map(w => (
              <tr key={w.id}>
                <td style={{fontWeight:500}}>{w.label||"—"}</td>
                <td className="mono" style={{fontSize:12}}>{w.address}</td>
                <td><Badge text={w.chain}/></td>
                <td className="mono" style={{fontSize:11,color:"var(--text3)"}}>{new Date(w.created_at).toLocaleString()}</td>
                <td><button className="btn-danger btn-sm" onClick={()=>del(w.id)}><Ic n="trash" s={12}/></button></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      }
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
//  ALERTS
// ═══════════════════════════════════════════════════════════════════════════════
const Alerts = ({ toast }) => {
  const { data, loading, refetch } = useFetch(`${API}/notifications`, []);
  const markRead = async () => { await fetch(`${API}/notifications/read`,{method:"POST"}); refetch(); };
  const clear = async () => { await fetch(`${API}/notifications/clear`,{method:"DELETE"}); toast("Cleared","info"); refetch(); };
  const col = { success:"#10b981", error:"#ef4444", alert:"#f59e0b", info:"#4f63e7" };
  return (
    <div className="panel">
      <div className="sec-head">
        <div><h2 className="sec-title">Alerts</h2><p className="sec-sub">{data?.unread||0} unread</p></div>
        <div style={{display:"flex",gap:10}}>
          <button className="btn-ghost" onClick={markRead}><Ic n="ok" s={13}/> Mark Read</button>
          <button className="btn-danger" onClick={clear}><Ic n="trash" s={13}/> Clear All</button>
        </div>
      </div>
      {loading ? <div className="loading"><Spin/></div> :
        !data?.notifications?.length ? <div className="empty"><Ic n="bell" s={40}/><h3>No alerts</h3><p>Bot notifications appear here</p></div> :
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {data.notifications.map(n => (
            <div key={n.id} style={{
              display:"flex",gap:14,padding:"14px 18px",borderRadius:12,
              background:"var(--surface)",border:"1px solid var(--border)",
              borderLeft:`3px solid ${col[n.type]||"#4f63e7"}`,opacity:n.read?.8:1
            }}>
              <div style={{width:8,height:8,borderRadius:"50%",background:col[n.type]||"#4f63e7",marginTop:5,flexShrink:0}}/>
              <div style={{flex:1}}>
                <div style={{fontWeight:600,fontSize:13,marginBottom:4}}>{n.title}</div>
                <div style={{fontSize:12,color:"var(--text2)",marginBottom:6}}>{n.message}</div>
                <div className="mono" style={{fontSize:10,color:"var(--text3)"}}>{new Date(n.created_at).toLocaleString()}</div>
              </div>
              {!n.read && <div style={{width:8,height:8,background:"var(--accent)",borderRadius:"50%",marginTop:5,flexShrink:0}}/>}
            </div>
          ))}
        </div>
      }
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
//  SETTINGS
// ═══════════════════════════════════════════════════════════════════════════════
const Settings = ({ toast }) => {
  const { data: s, loading, refetch } = useFetch(`${API}/settings`, []);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  useEffect(() => { if (s) setForm(s); }, [s]);
  const set = (k, v) => setForm(f => ({...f, [k]: v}));
  const save = async () => {
    setSaving(true);
    await fetch(`${API}/settings`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)});
    toast("Saved!","success"); setSaving(false); refetch();
  };
  const testTg = async () => {
    const r = await fetch(`${API}/settings/test-telegram`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({token:form.telegram_bot_token,chat_id:form.telegram_chat_id})});
    const d = await r.json(); toast(d.message, d.success?"success":"error");
  };
  const testDc = async () => {
    const r = await fetch(`${API}/settings/test-discord`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({webhook:form.discord_webhook})});
    const d = await r.json(); toast(d.message, d.success?"success":"error");
  };

  const SCard = ({ title, icon, children }) => (
    <div className="card" style={{padding:24,marginBottom:16}}>
      <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:18,paddingBottom:14,borderBottom:"1px solid var(--border)"}}>
        <span style={{color:"var(--accent)"}}><Ic n={icon} s={16}/></span>
        <h3 style={{fontSize:14,fontWeight:700}}>{title}</h3>
      </div>
      {children}
    </div>
  );

  if (loading) return <div className="loading"><Spin/></div>;
  return (
    <div className="panel">
      <div className="sec-head">
        <div><h2 className="sec-title">Settings</h2><p className="sec-sub">Keys, notifications, and automation config</p></div>
        <button className="btn-primary" onClick={save} disabled={saving}>
          {saving ? <><Spin sm/>&nbsp;Saving…</> : <><Ic n="ok" s={13}/> Save All</>}
        </button>
      </div>
      <SCard title="AI Analysis" icon="cpu">
        <Field label="Anthropic API Key" hint="Get yours at console.anthropic.com — enables intelligent task generation">
          <input style={inp} type="password" placeholder="sk-ant-…" value={form.anthropic_api_key||""} onChange={e=>set("anthropic_api_key",e.target.value)} onFocus={e=>e.target.style.borderColor="var(--accent)"} onBlur={e=>e.target.style.borderColor="var(--border)"}/>
        </Field>
      </SCard>
      <SCard title="Telegram Notifications" icon="send">
        <div className="form-grid" style={{marginBottom:14}}>
          <Field label="Bot Token"><input style={inp} type="password" placeholder="123456:ABC…" value={form.telegram_bot_token||""} onChange={e=>set("telegram_bot_token",e.target.value)} onFocus={e=>e.target.style.borderColor="var(--accent)"} onBlur={e=>e.target.style.borderColor="var(--border)"}/></Field>
          <Field label="Chat ID"><input style={inp} placeholder="-100123…" value={form.telegram_chat_id||""} onChange={e=>set("telegram_chat_id",e.target.value)} onFocus={e=>e.target.style.borderColor="var(--accent)"} onBlur={e=>e.target.style.borderColor="var(--border)"}/></Field>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:16}}>
          <label style={{display:"flex",alignItems:"center",gap:8,fontSize:13,cursor:"pointer"}}>
            <input type="checkbox" style={{accentColor:"var(--accent)"}} checked={form.enable_telegram==="true"} onChange={e=>set("enable_telegram",e.target.checked?"true":"false")}/>
            Enable Telegram
          </label>
          <button className="btn-ghost btn-sm" onClick={testTg}><Ic n="send" s={12}/> Test</button>
        </div>
      </SCard>
      <SCard title="Discord Notifications" icon="globe">
        <Field label="Webhook URL" style={{marginBottom:14}}>
          <input style={inp} type="password" placeholder="https://discord.com/api/webhooks/…" value={form.discord_webhook||""} onChange={e=>set("discord_webhook",e.target.value)} onFocus={e=>e.target.style.borderColor="var(--accent)"} onBlur={e=>e.target.style.borderColor="var(--border)"}/>
        </Field>
        <div style={{display:"flex",alignItems:"center",gap:16}}>
          <label style={{display:"flex",alignItems:"center",gap:8,fontSize:13,cursor:"pointer"}}>
            <input type="checkbox" style={{accentColor:"var(--accent)"}} checked={form.enable_discord==="true"} onChange={e=>set("enable_discord",e.target.checked?"true":"false")}/>
            Enable Discord
          </label>
          <button className="btn-ghost btn-sm" onClick={testDc}><Ic n="send" s={12}/> Test</button>
        </div>
      </SCard>
      <SCard title="Scheduler" icon="activity">
        <div className="form-grid" style={{marginBottom:14}}>
          <Field label="Auto-Run Interval (hours)"><input style={inp} type="number" min="1" value={form.auto_run_interval_hours||24} onChange={e=>set("auto_run_interval_hours",e.target.value)}/></Field>
          <Field label="Announcement Check (minutes)"><input style={inp} type="number" min="15" value={form.announcement_check_minutes||60} onChange={e=>set("announcement_check_minutes",e.target.value)}/></Field>
        </div>
        <label style={{display:"flex",alignItems:"center",gap:8,fontSize:13,cursor:"pointer"}}>
          <input type="checkbox" style={{accentColor:"var(--accent)"}} checked={form.enable_scheduler==="true"} onChange={e=>set("enable_scheduler",e.target.checked?"true":"false")}/>
          Enable Background Scheduler
        </label>
      </SCard>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
//  DOCS
// ═══════════════════════════════════════════════════════════════════════════════
const Docs = () => {
  const [active, setActive] = useState("overview");
  const nav = [
    {id:"overview",l:"Overview"},{id:"quickstart",l:"Quick Start"},{id:"install",l:"Installation"},
    {id:"config",l:"Configuration"},{id:"projects",l:"Projects"},{id:"taskbot",l:"Task Bot"},
    {id:"wallets",l:"Wallets"},{id:"production",l:"Going Live"},{id:"deploy",l:"Deployment"},
    {id:"notifications",l:"Notifications"},{id:"api",l:"API Reference"},{id:"faq",l:"FAQ"},
    {id:"rules",l:"Rules & Ethics"},{id:"community",l:"Community"},
  ];
  const Code = ({ch}) => <pre style={{background:"var(--surface2)",border:"1px solid var(--border)",borderRadius:10,padding:"14px 16px",fontFamily:"'Fira Code',monospace",fontSize:12,color:"var(--accent)",overflowX:"auto",lineHeight:1.75,margin:"12px 0"}}>{ch}</pre>;
  const Call = ({type="info",ch}) => {
    const c={info:"#4f63e7",success:"#10b981",warning:"#f59e0b"};
    return <div style={{padding:"12px 16px",borderRadius:8,background:c[type]+"12",border:`1px solid ${c[type]}25`,color:c[type],fontSize:13,lineHeight:1.65,margin:"14px 0"}}>{ch}</div>;
  };
  const DT = ({cols,rows}) => (
    <div style={{overflowX:"auto",margin:"12px 0",borderRadius:10,border:"1px solid var(--border)",overflow:"hidden"}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
        <thead><tr>{cols.map(c=><th key={c} style={{background:"var(--surface2)",padding:"9px 14px",textAlign:"left",fontWeight:700,color:"var(--text3)",textTransform:"uppercase",fontSize:10,letterSpacing:".06em"}}>{c}</th>)}</tr></thead>
        <tbody>{rows.map((r,i)=><tr key={i}>{r.map((c,j)=><td key={j} style={{padding:"10px 14px",borderTop:"1px solid var(--border)",color:"var(--text)",fontFamily:j===0?"'Fira Code',monospace":"inherit",fontSize:j===0?11:12}}>{c}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
  const content = {
    overview:<div><h2>Airdrop Automation Bot v2.0</h2><p>Track, analyze, and automate airdrop-eligible tasks across crypto projects. Powered by Claude AI, real web scraping, APScheduler, and Telegram/Discord alerts.</p><Call type="info" ch="Philosophy: 3–5 wallets with genuine activity beats thousands of flagged wallets. This tool keeps you organized, early, and consistent."/><h3>Architecture</h3><Code ch={`React 18 (Vite) ──► Flask REST API (:5050)\n                          │\n              ┌───────────┴────────────┐\n         SQLite DB            Claude AI Analysis\n                          │\n              APScheduler (24h auto-run)\n                          │\n         Telegram / Discord notifications`}/></div>,
    quickstart:<div><h2>Quick Start</h2><ol style={{paddingLeft:20,display:"flex",flexDirection:"column",gap:10,fontSize:13,color:"var(--text2)",lineHeight:1.7}}>{["Extract the ZIP to any folder","Copy backend/.env.example → .env and add your API keys","Windows: double-click start.bat | Mac/Linux: ./start.sh","Open http://localhost:3000","Settings → enter Anthropic API key","Projects → Add Project → paste any crypto project URL"].map((s,i)=><li key={i}><strong>Step {i+1}:</strong> {s}</li>)}</ol><Call type="success" ch="Works without an API key using rule-based fallback. Add your Anthropic key for AI-powered task generation."/></div>,
    install:<div><h2>Manual Installation</h2><h3>Backend</h3><Code ch={`cd backend\npython -m venv venv\nsource venv/bin/activate   # Mac/Linux\nvenv\\Scripts\\activate.bat  # Windows\npip install -r requirements.txt\ncp .env.example .env\npython app.py`}/><h3>Frontend</h3><Code ch={`cd frontend\nnpm install\nnpm run dev`}/><p style={{fontSize:13,color:"var(--text2)"}}>Frontend → <strong>http://localhost:3000</strong> · Backend → <strong>http://localhost:5050</strong></p></div>,
    config:<div><h2>Configuration</h2><DT cols={["Variable","Description","Default"]} rows={[["ANTHROPIC_API_KEY","Claude AI for analysis","empty"],["TELEGRAM_BOT_TOKEN","BotFather token","empty"],["TELEGRAM_CHAT_ID","Your chat/group ID","empty"],["DISCORD_WEBHOOK","Discord webhook URL","empty"],["ENABLE_SCHEDULER","Background auto-run","true"],["AUTO_RUN_INTERVAL_HOURS","Auto-run frequency","24"],["ANNOUNCEMENT_CHECK_INTERVAL_MINUTES","Scan frequency","60"],["PORT","Backend port","5050"]]}/><Call type="info" ch="Settings saved in the dashboard override .env values at runtime."/></div>,
    projects:<div><h2>Projects</h2><p style={{fontSize:13,color:"var(--text2)",lineHeight:1.7}}>Projects are the core unit. Each represents a crypto protocol to farm. Add a URL and the bot scrapes + analyzes it automatically via Claude AI.</p><DT cols={["Type","Description","Auto Tasks"]} rows={[["testnet","Test network with faucet","Faucet claim, test swaps"],["points","XP/points leaderboard","Daily check-in, point tasks"],["swap","DEX/AMM protocol","Swap tracking"],["bridge","Cross-chain bridge","Bridge activity log"],["nft","NFT minting","Mint detection"],["social","Community airdrop","Social completions"],["governance","DAO voting","Proposal monitoring"]]}/></div>,
    taskbot:<div><h2>Task Bot</h2><DT cols={["Task","Mode","Notes"]} rows={[["Site Health Check","✅ Auto","Uptime + latency per project"],["Faucet Request","✅ Auto","POSTs wallet to detected endpoint"],["Social Discovery","✅ Auto","Extracts Twitter, Discord, Telegram"],["Announcement Scan","✅ Auto","Keyword check every 60 min"],["Eligibility Check","✅ Auto","Tests /eligibility API patterns"],["Daily Check-in","✅ Auto","Logs visit for activity"],["On-chain Swaps","❌ Manual","Requires wallet signing"],["Liquidity Provision","❌ Manual","Requires wallet signing"],["Governance Vote","❌ Manual","Opens page in browser"]]}/></div>,
    wallets:<div><h2>Wallets</h2><Call type="warning" ch="Only public wallet addresses are ever stored. Private keys are never required, stored, or transmitted."/><h3>Best Practices</h3><ul style={{paddingLeft:20,fontSize:13,color:"var(--text2)",lineHeight:2}}><li>3–5 wallets with genuine on-chain history</li><li>Different seed phrases, stored securely offline</li><li>Fund each with small real amounts for gas</li><li>Separate browser profiles per wallet</li><li>Avoid bulk wallet creation — Sybil detection is advanced in 2026</li></ul></div>,
    production:<div><h2>Going Live</h2>{[["Add Anthropic API Key","Settings → AI Analysis → paste sk-ant-… key. Works immediately."],["Configure Notifications","Add Telegram token + Discord webhook, click Test buttons."],["Enable Scheduler","Settings → Scheduler → Enable Background Scheduler."],["Deploy Online","Railway (backend) + Vercel (frontend) for 24/7 cloud operation."]].map(([t,d],i)=><div key={i} style={{display:"flex",gap:14,marginBottom:16,alignItems:"flex-start"}}><div style={{width:28,height:28,borderRadius:"50%",background:"linear-gradient(135deg,var(--accent),var(--accent2,#10b981))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:"#fff",flexShrink:0}}>{i+1}</div><div><strong style={{display:"block",marginBottom:3,fontSize:13}}>{t}</strong><p style={{fontSize:12,color:"var(--text2)",margin:0}}>{d}</p></div></div>)}</div>,
    deploy:<div><h2>Cloud Deployment</h2><h3>Railway + Vercel (Free)</h3><Code ch={`# Backend → Railway\nnpm install -g @railway/cli\ncd backend && railway init && railway up\nrailway variables set ANTHROPIC_API_KEY=sk-ant-...\n\n# Frontend → Vercel\ncd frontend && npm run build && vercel --prod`}/><h3>VPS (~$5/month)</h3><Code ch={`pm2 start "python app.py" --name airdrop-bot\npm2 save && pm2 startup\n# nginx: serve frontend + proxy /api → :5050`}/></div>,
    notifications:<div><h2>Notifications</h2><h3>Telegram</h3><ol style={{paddingLeft:20,fontSize:13,color:"var(--text2)",lineHeight:2}}><li>Telegram → @BotFather → /newbot</li><li>Copy token (123456:ABC-DEF…)</li><li>Visit: https://api.telegram.org/bot{"{TOKEN}"}/getUpdates</li><li>Copy chat_id from response</li><li>Settings → Telegram → Test</li></ol><h3>Discord</h3><ol style={{paddingLeft:20,fontSize:13,color:"var(--text2)",lineHeight:2}}><li>Server Settings → Integrations → Webhooks → New Webhook</li><li>Choose channel → Copy URL → Settings → Discord → Test</li></ol></div>,
    api:<div><h2>API Reference</h2><p style={{fontSize:13,color:"var(--text2)",marginBottom:12}}>Base: <code style={{fontFamily:"'Fira Code',monospace",background:"var(--surface2)",padding:"2px 8px",borderRadius:4,color:"var(--accent)"}}>http://localhost:5050</code></p><DT cols={["Method","Endpoint","Description"]} rows={[["GET","/api/health","Status + scheduler state"],["GET","/api/projects","All projects with tasks"],["POST","/api/projects","Add: {name, url}"],["DELETE","/api/projects/:id","Delete project"],["PATCH","/api/projects/:id/status","Pause/resume"],["POST","/api/projects/:id/reanalyze","Re-run AI analysis"],["POST","/api/tasks/run/:id","Run bot for project"],["GET","/api/tasks","Logs (?project_id&limit)"],["GET","/api/wallets","List wallets"],["POST","/api/wallets","Add: {address, chain, label}"],["GET","/api/notifications","Alerts + unread count"],["POST","/api/notifications/read","Mark all read"],["GET","/api/stats","Dashboard metrics"],["GET/POST","/api/settings","Get/save settings"],["POST","/api/settings/test-telegram","Test Telegram"],["POST","/api/settings/test-discord","Test Discord"]]}/></div>,
    faq:<div><h2>FAQ</h2><div style={{display:"flex",flexDirection:"column",gap:10}}>{[["Is this safe?","Yes. Public addresses only. No on-chain actions automated. All signing is manual."],["Will I get flagged?","No — the bot tracks and reminds. You execute swaps manually. Genuine activity is the goal."],["Need Anthropic key?","No. Rule-based fallback works. With it, task generation is far more accurate."],["How many wallets?","3–5 with genuine activity. Mass wallet farming is heavily penalized in 2026."],["Backend won't start?","Check Python 3.9+, venv active, requirements installed, port 5050 free."],["Dashboard offline?","Start the Python backend first. Check terminal for errors."],["Where is data?","Locally in data/projects.db. Nothing leaves your machine except optional Anthropic API calls."]].map(([q,a])=><div key={q} style={{background:"var(--surface2)",border:"1px solid var(--border)",borderRadius:10,padding:14}}><div style={{fontWeight:600,fontSize:13,color:"var(--accent)",marginBottom:6}}>{q}</div><div style={{fontSize:13,color:"var(--text2)",lineHeight:1.6}}>{a}</div></div>)}</div></div>,
    rules:<div><h2>Rules & Ethics</h2><Call type="warning" ch="This bot helps you stay organized and consistent — not to cheat or exploit protocols."/><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginTop:16}}><div style={{background:"var(--accent)0c",border:"1px solid var(--accent)20",borderRadius:10,padding:16}}><div style={{fontWeight:700,marginBottom:10,color:"var(--accent)"}}>✅ What it does</div>{["Tracks projects & tasks","Checks faucet endpoints","Discovers social links","Monitors announcements","Logs activity history","Sends alerts when needed"].map(i=><div key={i} style={{fontSize:12,color:"var(--text2)",padding:"3px 0"}}>{i}</div>)}</div><div style={{background:"#ef444408",border:"1px solid #ef444420",borderRadius:10,padding:16}}><div style={{fontWeight:700,marginBottom:10,color:"#ef4444"}}>❌ What it does NOT</div>{["Execute on-chain transactions","Store private keys","Create Sybil wallets","Automate DEX swaps","Bypass protocol ToS"].map(i=><div key={i} style={{fontSize:12,color:"var(--text2)",padding:"3px 0"}}>{i}</div>)}</div></div><p style={{fontSize:13,color:"var(--text3)",marginTop:16}}>MIT License — Made by Aditya GFX</p></div>,
    community:<div><h2>Community</h2><div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:24}}>{[{icon:"💬",l:"Discord Server",url:"https://discord.gg/airdropbot",d:"Strategy, project alerts, and bot support"},{icon:"🐦",l:"X / Twitter",url:"https://x.com/AirdropBotApp",d:"@AirdropBotApp — airdrop announcements and updates"}].map(c=><a key={c.l} href={c.url} target="_blank" rel="noreferrer" style={{display:"flex",gap:14,padding:16,borderRadius:12,background:"var(--surface)",border:"1px solid var(--border)",textDecoration:"none"}}><span style={{fontSize:24}}>{c.icon}</span><div><strong style={{display:"block",color:"var(--text)",fontSize:13}}>{c.l}</strong><p style={{fontSize:12,color:"var(--text2)",margin:0}}>{c.d}</p></div></a>)}</div><h3>Alpha Sources</h3><ul style={{paddingLeft:20,fontSize:13,color:"var(--text2)",lineHeight:2}}><li><strong>DeFiLlama</strong> — Track TVL and new protocols</li><li><strong>Layer3.xyz</strong> — Curated task-based campaigns</li><li><strong>Earni.fi</strong> — Airdrop eligibility tracker</li><li><strong>Bankless</strong> — Weekly high-potential airdrop research</li><li><strong>Rabby Wallet</strong> — Built-in eligibility tracker</li></ul></div>,
  };

  return (
    <div style={{display:"flex",minHeight:"calc(100vh - 64px)"}}>
      <div style={{width:190,flexShrink:0,borderRight:"1px solid var(--border)",padding:"24px 8px",position:"sticky",top:64,alignSelf:"flex-start",maxHeight:"calc(100vh - 64px)",overflowY:"auto"}}>
        <div style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:".1em",color:"var(--text3)",padding:"0 10px 12px"}}>Docs</div>
        {nav.map(n => (
          <button key={n.id} onClick={() => setActive(n.id)} style={{
            display:"block",width:"100%",textAlign:"left",padding:"7px 12px",borderRadius:8,
            background:active===n.id?"var(--accent)15":"none",
            color:active===n.id?"var(--accent)":"var(--text2)",
            border:"none",fontSize:12,fontFamily:"inherit",cursor:"pointer",marginBottom:1,transition:"all .15s",fontWeight:active===n.id?600:400
          }}>{n.l}</button>
        ))}
      </div>
      <div style={{flex:1,padding:"36px 44px",maxWidth:760}}>
        <style>{`.dc h2{font-size:22px;font-weight:800;margin-bottom:12px;letter-spacing:-.03em;color:var(--text)}.dc h3{font-size:14px;font-weight:700;margin:22px 0 10px;color:var(--text)}.dc p{font-size:13px;color:var(--text2);line-height:1.7;margin-bottom:10px}`}</style>
        <div className="dc">{content[active]}</div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
//  ROOT
// ═══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [page, setPage] = useState("dashboard");
  const [dark, setDark] = useState(true);
  const [toasts, setToasts] = useState([]);
  const { data: notif } = useFetch(`${API}/notifications`, [page]);
  const unread = notif?.unread || 0;

  const toast = (msg, type = "info") => {
    const id = Date.now();
    setToasts(t => [...t, {id, msg, type}]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000);
  };

  const navItems = [
    {id:"dashboard", label:"Dashboard", icon:"grid"},
    {id:"projects",  label:"Projects",  icon:"globe"},
    {id:"tasks",     label:"Task Logs", icon:"check"},
    {id:"wallets",   label:"Wallets",   icon:"wallet"},
    {id:"alerts",    label:"Alerts",    icon:"bell",  badge:unread},
    {id:"settings",  label:"Settings",  icon:"cog"},
    {id:"docs",      label:"Docs",      icon:"book"},
  ];

  const panels = {
    dashboard: <Dashboard/>,
    projects:  <Projects toast={toast}/>,
    tasks:     <TaskLogs/>,
    wallets:   <Wallets toast={toast}/>,
    alerts:    <Alerts toast={toast}/>,
    settings:  <Settings toast={toast}/>,
    docs:      <Docs/>,
  };

  const D = {
    bg:"#080d1a",surface:"#0e1629",surface2:"#121e35",border:"#1a2c4a",border2:"#243d60",
    text:"#e4eaf5",text2:"#6b85ad",text3:"#304560",accent:"#4f63e7",accent2:"#10b981",nav:"rgba(8,13,26,.92)",
  };
  const L = {
    bg:"#eef2fb",surface:"#ffffff",surface2:"#f3f6ff",border:"#dde4f5",border2:"#c5d0eb",
    text:"#0a1628",text2:"#4a5878",text3:"#90a0bb",accent:"#4f63e7",accent2:"#059669",nav:"rgba(255,255,255,.92)",
  };
  const T = dark ? D : L;

  return (
    <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",background:T.bg,color:T.text,minHeight:"100vh"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Fira+Code:wght@400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body{-webkit-font-smoothing:antialiased}
        :root{
          --bg:${T.bg};--surface:${T.surface};--surface2:${T.surface2};
          --border:${T.border};--border2:${T.border2};
          --text:${T.text};--text2:${T.text2};--text3:${T.text3};
          --accent:${T.accent};--accent2:${T.accent2};
        }
        @keyframes _spin{to{transform:rotate(360deg)}}
        @keyframes _fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes _slideUp{from{opacity:0;transform:translateX(16px)}to{opacity:1;transform:translateX(0)}}

        /* ── Topnav ── */
        .topnav{position:fixed;top:0;left:0;right:0;height:64px;z-index:200;background:${T.nav};backdrop-filter:blur(20px);border-bottom:1px solid ${T.border}}
        .topnav-inner{display:flex;align-items:center;height:100%;padding:0 28px;gap:0}
        .brand{display:flex;align-items:center;gap:10px;cursor:pointer;margin-right:28px;flex-shrink:0;text-decoration:none}
        .brand-mark{width:34px;height:34px;background:linear-gradient(135deg,${T.accent},${T.accent2});border-radius:9px;display:flex;align-items:center;justify-content:center;color:#fff}
        .brand-name{font-weight:800;font-size:15px;letter-spacing:-.025em;color:${T.text}}
        .brand-ver{font-size:9px;color:${T.text3};font-family:'Fira Code',monospace;margin-left:5px;border:1px solid ${T.border};padding:1px 5px;border-radius:4px}
        .nav-items{display:flex;align-items:center;gap:2px;flex:1}
        .nb{display:flex;align-items:center;gap:7px;padding:7px 13px;border-radius:8px;font-size:13px;font-weight:500;cursor:pointer;background:none;border:none;color:${T.text2};font-family:inherit;transition:all .15s;position:relative;white-space:nowrap}
        .nb:hover{background:${T.surface2};color:${T.text}}
        .nb.on{background:${T.accent}1a;color:${T.accent};font-weight:600}
        .nb .ni{display:flex;align-items:center;opacity:.65}
        .nb.on .ni{opacity:1}
        .nbadge{margin-left:2px;background:#ef4444;color:#fff;border-radius:10px;padding:1px 6px;font-size:9px;font-weight:700}
        .thr{display:flex;align-items:center;gap:8px;margin-left:auto;flex-shrink:0}
        .tbtn{width:36px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center;background:${T.surface2};border:1px solid ${T.border};cursor:pointer;color:${T.text2};transition:all .15s}
        .tbtn:hover{border-color:${T.accent};color:${T.accent}}

        /* ── Layout ── */
        .main{margin-top:64px;min-height:calc(100vh - 64px)}
        .panel{padding:36px 40px;max-width:1180px;margin:0 auto;animation:_fadeIn .2s ease}
        .sec-head{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:28px;gap:16px}
        .sec-title{font-size:26px;font-weight:800;letter-spacing:-.035em;margin-bottom:4px}
        .sec-sub{font-size:13px;color:${T.text2}}

        /* ── Hero ── */
        .hero{display:grid;grid-template-columns:1fr 400px;gap:40px;align-items:center;padding:44px 48px;margin-bottom:28px;border-radius:20px;background:linear-gradient(135deg,#0d1635 0%,#091228 100%);color:#e4eaf5;overflow:hidden;position:relative;border:1px solid #1a2c4a}
        .hero-left{position:relative;z-index:1}
        .hero-pill{display:inline-flex;align-items:center;gap:8px;font-size:11px;color:#5a7ba0;margin-bottom:16px;font-family:'Fira Code',monospace;border:1px solid #1a2c4a;background:#0d1635;padding:5px 12px;border-radius:20px}
        .dot-pulse{width:7px;height:7px;background:#10b981;border-radius:50%;box-shadow:0 0 8px #10b981}
        .hero-h1{font-size:44px;font-weight:800;letter-spacing:-.045em;line-height:1.12;margin-bottom:14px}
        .grad{background:linear-gradient(90deg,#4f63e7,#10b981);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
        .hero-p{font-size:14px;color:#5a7ba0;line-height:1.65;max-width:360px}
        .hero-right{position:relative;display:flex;align-items:center;justify-content:center}
        .orb{position:absolute;border-radius:50%;filter:blur(55px);pointer-events:none}
        .o1{width:200px;height:200px;background:#4f63e750;top:-50px;right:-30px}
        .o2{width:140px;height:140px;background:#10b98140;bottom:-20px;left:10px}
        .term{position:relative;z-index:1;background:#050b18;border:1px solid #1a2c4a;border-radius:12px;padding:16px;width:100%}
        .term-dots{display:flex;gap:6px;margin-bottom:12px}
        .term-dots span{width:10px;height:10px;border-radius:50%;background:#1a2c4a}
        .term-dots span:nth-child(1){background:#ef4444}
        .term-dots span:nth-child(2){background:#f59e0b}
        .term-dots span:nth-child(3){background:#10b981}
        .term-code{font-family:'Fira Code',monospace;font-size:11px;color:#4ade80;line-height:1.85;white-space:pre}

        /* ── Metrics ── */
        .metric-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:28px}
        .metric-card{background:${T.surface};border:1px solid ${T.border};border-radius:16px;padding:24px;transition:all .2s;position:relative;overflow:hidden}
        .metric-card::after{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--mc,${T.accent}),transparent);opacity:0;transition:opacity .2s}
        .metric-card:hover{border-color:var(--mc,${T.accent})60;transform:translateY(-2px);box-shadow:0 8px 28px rgba(0,0,0,.1)}
        .metric-card:hover::after{opacity:1}
        .metric-val{font-size:34px;font-weight:800;letter-spacing:-.045em;margin-bottom:4px;font-family:'Fira Code',monospace}
        .metric-lbl{font-size:13px;font-weight:600;margin-bottom:2px}
        .metric-sub{font-size:11px;color:${T.text3}}

        /* ── Cards ── */
        .card{background:${T.surface};border:1px solid ${T.border};border-radius:16px;margin-bottom:20px;overflow:hidden}
        .card-head{padding:16px 20px;border-bottom:1px solid ${T.border};display:flex;align-items:center;justify-content:space-between}
        .card-head h3{font-size:14px;font-weight:700}
        .two-col{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px}

        /* ── Table ── */
        .tbl{width:100%;border-collapse:collapse;font-size:13px}
        .tbl th{padding:12px 18px;text-align:left;font-size:10px;font-weight:700;color:${T.text3};text-transform:uppercase;letter-spacing:.06em;border-bottom:1px solid ${T.border};background:${T.surface2}}
        .tbl td{padding:13px 18px;border-bottom:1px solid ${T.border};vertical-align:middle}
        .tbl tr:last-child td{border-bottom:none}
        .tbl tr:hover td{background:${T.surface2}}
        .mono{font-family:'Fira Code',monospace}

        /* ── Project grid ── */
        .proj-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(360px,1fr));gap:20px}
        .proj-card{background:${T.surface};border:1px solid ${T.border};border-radius:16px;padding:22px;transition:all .2s}
        .proj-card:hover{border-color:${T.border2};box-shadow:0 4px 24px rgba(0,0,0,.07)}
        .proj-card.paused{opacity:.65}
        .chip{padding:3px 10px;border-radius:20px;font-size:11px;background:${T.surface2};border:1px solid ${T.border};color:${T.text2}}
        .social-chip{font-size:11px;padding:3px 10px;border-radius:20px;background:${T.accent}12;color:${T.accent};border:1px solid ${T.accent}28;text-decoration:none}

        /* ── Form ── */
        .form-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}

        /* ── Buttons ── */
        .btn-primary{display:inline-flex;align-items:center;gap:7px;padding:9px 18px;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;border:none;font-family:inherit;background:${T.accent};color:#fff;transition:all .15s}
        .btn-primary:hover{background:#3a4fd0;box-shadow:0 4px 14px ${T.accent}45}
        .btn-primary:disabled{opacity:.5;cursor:not-allowed}
        .btn-ghost{display:inline-flex;align-items:center;gap:7px;padding:9px 16px;border-radius:10px;font-size:13px;font-weight:500;cursor:pointer;font-family:inherit;background:${T.surface};border:1px solid ${T.border};color:${T.text2};transition:all .15s}
        .btn-ghost:hover{border-color:${T.accent};color:${T.accent};background:${T.accent}0a}
        .btn-danger{display:inline-flex;align-items:center;gap:7px;padding:9px 16px;border-radius:10px;font-size:13px;font-weight:500;cursor:pointer;font-family:inherit;background:#ef444410;border:1px solid #ef444425;color:#ef4444;transition:all .15s}
        .btn-danger:hover{background:#ef444422}
        .btn-sm{padding:5px 11px!important;font-size:12px!important}

        /* ── Misc ── */
        .info-banner{display:flex;align-items:center;gap:10px;padding:12px 16px;background:${T.accent}0d;border:1px solid ${T.accent}22;border-radius:10px;margin-bottom:20px;font-size:13px;color:${T.accent}}
        .loading{display:flex;justify-content:center;align-items:center;padding:80px;color:${T.text3}}
        .empty{text-align:center;padding:80px 20px;color:${T.text3}}
        .empty svg{margin-bottom:16px;opacity:.2}
        .empty h3{font-size:16px;color:${T.text2};margin-bottom:6px;font-weight:600}
        .empty p{font-size:13px}

        @media(max-width:880px){
          .hero{grid-template-columns:1fr}.hero-right{display:none}
          .metric-grid{grid-template-columns:repeat(2,1fr)}
          .nb span:not(.ni):not(.nbadge){display:none}
          .panel{padding:20px 16px}
          .form-grid{grid-template-columns:1fr}
        }
      `}</style>

      {/* ── Top Nav ── */}
      <header className="topnav">
        <div className="topnav-inner">
          <div className="brand" onClick={() => setPage("dashboard")}>
            <div className="brand-mark"><Ic n="zap" s={17}/></div>
            <span className="brand-name">AirdropBot</span>
            <span className="brand-ver">v2.0</span>
          </div>

          <nav className="nav-items">
            {navItems.map(n => (
              <button key={n.id} className={`nb ${page===n.id?"on":""}`} onClick={() => setPage(n.id)}>
                <span className="ni"><Ic n={n.icon} s={14}/></span>
                <span>{n.label}</span>
                {n.badge > 0 && <span className="nbadge">{n.badge}</span>}
              </button>
            ))}
          </nav>

          <div className="thr">
            <button className="tbtn" onClick={() => setDark(d => !d)}>
              <Ic n={dark ? "sun" : "moon"} s={16}/>
            </button>
          </div>
        </div>
      </header>

      {/* ── Content ── */}
      <main className="main">
        <div key={page}>{panels[page]}</div>
      </main>

      {/* ── Toasts ── */}
      <div style={{position:"fixed",bottom:24,right:24,zIndex:999,display:"flex",flexDirection:"column",gap:8}}>
        {toasts.map(t => (
          <Toast key={t.id} msg={t.msg} type={t.type} onClose={() => setToasts(ts => ts.filter(x => x.id !== t.id))}/>
        ))}
      </div>
    </div>
  );
}
