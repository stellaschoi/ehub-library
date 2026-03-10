import { useState, useEffect } from "react";

const BOOKS = [
  { id: 1, title: "Testing Business Ideas", author: "Bland, David", copies: 4 },
  { id: 2, title: "Talking to Humans", author: "Constable, Giff", copies: 2 },
  { id: 3, title: "The Mom Test", author: "Fitzpatrick, Rob", copies: 5 },
  { id: 4, title: "The Field Guide to Human-Centered Design", author: "IDEO", copies: 2 },
  { id: 5, title: "The Lean Startup", author: "Ries, Eric", copies: 4 },
  { id: 6, title: "This Is a Prototype", author: "Witthoft, Scott", copies: 2 },
];

export default function EHubLibrary() {
  const [checkouts, setCheckouts] = useState([]);
  const [view, setView] = useState("home");
  const [form, setForm] = useState({ name: "", bookId: "", email: "" });
  const [toast, setToast] = useState(null);
  const [returnConfirm, setReturnConfirm] = useState(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("ehub-checkouts");
      if (saved) setCheckouts(JSON.parse(saved));
    } catch {}
  }, []);

  const save = (data) => {
    try { localStorage.setItem("ehub-checkouts", JSON.stringify(data)); } catch {}
  };

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const availableCopies = (bookId) => {
    const book = BOOKS.find(b => b.id === bookId);
    const out = checkouts.filter(c => c.bookId === bookId && !c.returned).length;
    return book.copies - out;
  };

  const handleCheckout = () => {
    if (!form.name.trim() || !form.bookId) return showToast("Fill in all fields", "error");
    if (availableCopies(+form.bookId) <= 0) return showToast("No copies available", "error");
    const newCheckout = {
      id: Date.now(),
      name: form.name.trim(),
      email: form.email.trim(),
      bookId: +form.bookId,
      checkoutDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      dueDate: new Date(Date.now() + 14*24*60*60*1000).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      returned: false,
    };
    const updated = [...checkouts, newCheckout];
    setCheckouts(updated);
    save(updated);
    setForm({ name: "", bookId: "", email: "" });
    showToast("✓ Checked out! Due in 2 weeks.");
    setView("home");
  };

  const handleReturn = (id) => {
    const updated = checkouts.map(c => c.id === id ? { ...c, returned: true, returnedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) } : c);
    setCheckouts(updated);
    save(updated);
    setReturnConfirm(null);
    showToast("Book returned. Thank you!");
  };

  const active = checkouts.filter(c => !c.returned);
  const history = checkouts.filter(c => c.returned);

  // Berkeley colors
  const BLUE = "#003262";
  const GOLD = "#FDB515";
  const LIGHT_BLUE = "#dce9f5";
  const WHITE = "#ffffff";
  const GRAY = "#f4f4f4";

  return (
    <div style={{minHeight:"100vh",background:GRAY,fontFamily:"'Source Sans Pro',Arial,sans-serif",color:"#1a1a1a"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300;400;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .btn-primary { background:${GOLD};color:${BLUE};border:none;padding:12px 28px;font-family:'Source Sans Pro',sans-serif;font-size:14px;font-weight:700;letter-spacing:0.5px;cursor:pointer;transition:all 0.2s;text-transform:uppercase; }
        .btn-primary:hover { background:#e6a200;transform:translateY(-1px); }
        .btn-ghost { background:transparent;color:${BLUE};border:2px solid ${BLUE};padding:10px 24px;font-family:'Source Sans Pro',sans-serif;font-size:13px;font-weight:600;cursor:pointer;transition:all 0.2s;text-transform:uppercase; }
        .btn-ghost:hover { background:${BLUE};color:${WHITE}; }
        .btn-return { background:transparent;color:${BLUE};border:1.5px solid ${BLUE};padding:6px 14px;font-family:'Source Sans Pro',sans-serif;font-size:12px;font-weight:600;cursor:pointer;transition:all 0.2s; }
        .btn-return:hover { background:${BLUE};color:${WHITE}; }
        input, select { width:100%;padding:12px 14px;border:2px solid #ccc;background:${WHITE};font-family:'Source Sans Pro',sans-serif;font-size:14px;color:#1a1a1a;outline:none;transition:border 0.2s; }
        input:focus, select:focus { border-color:${BLUE}; }
        .card { background:${WHITE};border:1px solid #ddd;padding:20px 24px;margin-bottom:12px; }
        .tag-available { background:#d4edda;color:#155724;padding:3px 10px;font-size:12px;font-weight:600; }
        .tag-out { background:#f8d7da;color:#721c24;padding:3px 10px;font-size:12px;font-weight:600; }
        .tag-limited { background:#fff3cd;color:#856404;padding:3px 10px;font-size:12px;font-weight:600; }
      `}</style>

      {toast && (
        <div style={{position:"fixed",top:20,right:20,zIndex:9999,background:toast.type==="error"?"#c00":"#003262",color:WHITE,padding:"14px 24px",fontSize:"14px",fontWeight:600,boxShadow:"0 8px 32px rgba(0,0,0,0.2)"}}>
          {toast.msg}
        </div>
      )}

      {returnConfirm && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:999,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <div style={{background:WHITE,padding:"32px",maxWidth:"400px",width:"90%",textAlign:"center",borderTop:`4px solid ${GOLD}`}}>
            <p style={{fontSize:"20px",fontWeight:700,color:BLUE,marginBottom:"12px"}}>Confirm Return</p>
            <p style={{fontSize:"14px",color:"#555",marginBottom:"24px"}}>
              Returning <strong style={{color:BLUE}}>{BOOKS.find(b=>b.id===returnConfirm.bookId)?.title}</strong> borrowed by <strong style={{color:BLUE}}>{returnConfirm.name}</strong>
            </p>
            <div style={{display:"flex",gap:"12px",justifyContent:"center"}}>
              <button className="btn-ghost" onClick={()=>setReturnConfirm(null)}>Cancel</button>
              <button className="btn-primary" onClick={()=>handleReturn(returnConfirm.id)}>Confirm Return</button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <header style={{background:BLUE,padding:"0 40px",display:"flex",alignItems:"center",justifyContent:"space-between",height:"68px",borderBottom:`4px solid ${GOLD}`}}>
        <div style={{display:"flex",alignItems:"center",gap:"16px"}}>
          <span style={{fontSize:"22px",fontWeight:700,color:GOLD,letterSpacing:"0.5px"}}>the<span style={{color:WHITE}}>eHub</span></span>
          <span style={{width:"1px",height:"24px",background:"rgba(255,255,255,0.3)"}}/>
          <span style={{fontSize:"12px",color:"rgba(255,255,255,0.7)",letterSpacing:"1px",textTransform:"uppercase"}}>Library</span>
        </div>
        <nav style={{display:"flex",gap:"4px"}}>
          {[["home","Catalog"],["checkout","+ Check Out"],["manage","Manage"]].map(([v,label])=>(
            <button key={v} onClick={()=>setView(v)} style={{background:view===v?GOLD:"transparent",color:view===v?BLUE:"rgba(255,255,255,0.8)",border:"none",padding:"8px 18px",fontSize:"13px",fontWeight:700,cursor:"pointer",textTransform:"uppercase",letterSpacing:"0.5px",transition:"all 0.2s"}}>
              {label}
            </button>
          ))}
        </nav>
      </header>

      <main style={{maxWidth:"920px",margin:"0 auto",padding:"48px 24px"}}>

        {view === "home" && (
          <div>
            <div style={{marginBottom:"40px",borderLeft:`4px solid ${GOLD}`,paddingLeft:"20px"}}>
              <p style={{fontSize:"12px",letterSpacing:"2px",textTransform:"uppercase",color:"#666",marginBottom:"6px"}}>Berkeley Haas Entrepreneurship Hub</p>
              <h1 style={{fontSize:"42px",fontWeight:700,color:BLUE,lineHeight:1.1,marginBottom:"14px"}}>Library Catalog</h1>
              <p style={{fontSize:"15px",color:"#555",maxWidth:"500px",lineHeight:1.7}}>
                Borrow books to build better products. 2-week checkout. Return to the front desk.
              </p>
              <div style={{marginTop:"20px"}}>
                <button className="btn-primary" onClick={()=>setView("checkout")}>+ Check Out a Book</button>
              </div>
            </div>

            <div style={{display:"grid",gap:"2px"}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 160px 100px 130px",background:BLUE,padding:"12px 20px"}}>
                {["Title & Author","Category","Copies","Available"].map(h=>(
                  <span key={h} style={{fontSize:"11px",letterSpacing:"1.5px",textTransform:"uppercase",color:"rgba(255,255,255,0.7)",fontWeight:600}}>{h}</span>
                ))}
              </div>
              {BOOKS.map((book, i) => {
                const avail = availableCopies(book.id);
                return (
                  <div key={book.id} style={{display:"grid",gridTemplateColumns:"1fr 160px 100px 130px",background:i%2===0?WHITE:"#f9f9f9",padding:"16px 20px",borderBottom:"1px solid #e0e0e0",alignItems:"center"}}>
                    <div>
                      <div style={{fontSize:"15px",fontWeight:600,color:BLUE,marginBottom:"2px"}}>{book.title}</div>
                      <div style={{fontSize:"12px",color:"#777"}}>{book.author}</div>
                    </div>
                    <div style={{fontSize:"12px",color:"#777"}}>Entrepreneurship</div>
                    <div style={{fontSize:"13px",color:"#555"}}>{book.copies} total</div>
                    <div>
                      {avail === 0 ? <span className="tag-out">All checked out</span>
                        : avail === 1 ? <span className="tag-limited">{avail} left</span>
                        : <span className="tag-available">{avail} available</span>}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{marginTop:"24px",padding:"18px 24px",background:BLUE,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:"13px",color:"rgba(255,255,255,0.7)"}}>Checked out: <strong style={{color:GOLD}}>{active.length} books</strong></span>
              <span style={{fontSize:"13px",color:"rgba(255,255,255,0.7)"}}>Total collection: <strong style={{color:GOLD}}>{BOOKS.reduce((s,b)=>s+b.copies,0)} copies</strong></span>
            </div>
          </div>
        )}

        {view === "checkout" && (
          <div style={{maxWidth:"540px"}}>
            <div style={{borderLeft:`4px solid ${GOLD}`,paddingLeft:"20px",marginBottom:"32px"}}>
              <p style={{fontSize:"12px",letterSpacing:"2px",textTransform:"uppercase",color:"#666",marginBottom:"6px"}}>Borrow a book</p>
              <h1 style={{fontSize:"38px",fontWeight:700,color:BLUE}}>Check Out</h1>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:"18px"}}>
              <div>
                <label style={{display:"block",fontSize:"12px",letterSpacing:"1px",textTransform:"uppercase",color:"#555",fontWeight:600,marginBottom:"6px"}}>Your Full Name *</label>
                <input placeholder="Jane Smith" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
              </div>
              <div>
                <label style={{display:"block",fontSize:"12px",letterSpacing:"1px",textTransform:"uppercase",color:"#555",fontWeight:600,marginBottom:"6px"}}>Email (optional)</label>
                <input placeholder="jane@berkeley.edu" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
              </div>
              <div>
                <label style={{display:"block",fontSize:"12px",letterSpacing:"1px",textTransform:"uppercase",color:"#555",fontWeight:600,marginBottom:"6px"}}>Select Book *</label>
                <select value={form.bookId} onChange={e=>setForm({...form,bookId:e.target.value})}>
                  <option value="">— Choose a book —</option>
                  {BOOKS.map(b=>{
                    const avail = availableCopies(b.id);
                    return <option key={b.id} value={b.id} disabled={avail===0}>{b.title} — {b.author} ({avail===0?"unavailable":`${avail} available`})</option>;
                  })}
                </select>
              </div>
              <div style={{padding:"16px 20px",background:LIGHT_BLUE,borderLeft:`3px solid ${BLUE}`}}>
                <p style={{fontSize:"13px",color:BLUE,lineHeight:1.8}}>
                  📅 Checkout period: <strong>2 weeks</strong><br/>
                  📍 Return to: <strong>eHub front desk</strong><br/>
                  🔗 <a href="https://ehub.berkeley.edu/join/" target="_blank" rel="noreferrer" style={{color:BLUE,fontWeight:700}}>Join the eHub community →</a>
                </p>
              </div>
              <div style={{display:"flex",gap:"12px",paddingTop:"8px"}}>
                <button className="btn-ghost" onClick={()=>setView("home")}>← Back</button>
                <button className="btn-primary" onClick={handleCheckout}>Confirm Checkout</button>
              </div>
            </div>
          </div>
        )}

        {view === "manage" && (
          <div>
            <div style={{borderLeft:`4px solid ${GOLD}`,paddingLeft:"20px",marginBottom:"32px"}}>
              <p style={{fontSize:"12px",letterSpacing:"2px",textTransform:"uppercase",color:"#666",marginBottom:"6px"}}>Front desk</p>
              <h1 style={{fontSize:"38px",fontWeight:700,color:BLUE}}>Manage Loans</h1>
            </div>
            <div style={{marginBottom:"40px"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"14px"}}>
                <h2 style={{fontSize:"20px",fontWeight:700,color:BLUE}}>Active Checkouts</h2>
                <span style={{fontSize:"13px",color:"#777",background:GOLD,padding:"3px 12px",fontWeight:700,color:BLUE}}>{active.length} out</span>
              </div>
              {active.length === 0 ? (
                <div className="card" style={{textAlign:"center",padding:"40px",borderTop:`3px solid ${GOLD}`}}>
                  <p style={{fontSize:"14px",color:"#aaa"}}>All books are in.</p>
                </div>
              ) : active.map(c => {
                const book = BOOKS.find(b=>b.id===c.bookId);
                return (
                  <div key={c.id} className="card" style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"16px",borderLeft:`4px solid ${GOLD}`}}>
                    <div style={{flex:1}}>
                      <div style={{fontSize:"15px",fontWeight:700,color:BLUE,marginBottom:"4px"}}>{book?.title}</div>
                      <div style={{fontSize:"13px",color:"#555",marginBottom:"2px"}}>👤 {c.name}{c.email?` · ${c.email}`:""}</div>
                      <div style={{fontSize:"12px",color:"#999"}}>Out: {c.checkoutDate} · Due: {c.dueDate}</div>
                    </div>
                    <button className="btn-return" onClick={()=>setReturnConfirm(c)}>Return</button>
                  </div>
                );
              })}
            </div>
            {history.length > 0 && (
              <div>
                <h2 style={{fontSize:"20px",fontWeight:700,color:"#aaa",marginBottom:"14px"}}>Return History ({history.length})</h2>
                {history.map(c=>{
                  const book = BOOKS.find(b=>b.id===c.bookId);
                  return (
                    <div key={c.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 20px",borderBottom:"1px solid #e0e0e0",opacity:0.6}}>
                      <div>
                        <span style={{fontSize:"14px",fontWeight:600,color:BLUE}}>{book?.title}</span>
                        <span style={{fontSize:"12px",color:"#aaa",marginLeft:"12px"}}>{c.name}</span>
                      </div>
                      <span style={{fontSize:"12px",color:"#aaa"}}>Returned {c.returnedDate}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      <footer style={{background:BLUE,borderTop:`4px solid ${GOLD}`,padding:"24px 40px",display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:"60px"}}>
        <span style={{fontSize:"13px",color:"rgba(255,255,255,0.6)"}}>eHub Library · Berkeley Haas</span>
        <a href="https://ehub.berkeley.edu/join/" target="_blank" rel="noreferrer" style={{fontSize:"13px",color:GOLD,textDecoration:"none",fontWeight:700}}>+ Join the eHub →</a>
      </footer>
    </div>
  );
}
