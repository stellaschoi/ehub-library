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
    showToast("✓ Checked out successfully! Due in 2 weeks.");
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

  return (
    <div style={{minHeight:"100vh",background:"#f5f0e8",fontFamily:"'Georgia',serif",color:"#1a1a1a"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&family=Playfair+Display:wght@700;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .btn-primary { background:#1a1a1a;color:#f5f0e8;border:none;padding:12px 28px;font-family:'DM Mono',monospace;font-size:13px;letter-spacing:1px;cursor:pointer;transition:all 0.2s;text-transform:uppercase; }
        .btn-primary:hover { background:#e8542a;transform:translateY(-1px); }
        .btn-ghost { background:transparent;color:#1a1a1a;border:2px solid #1a1a1a;padding:10px 24px;font-family:'DM Mono',monospace;font-size:12px;letter-spacing:1px;cursor:pointer;transition:all 0.2s;text-transform:uppercase; }
        .btn-ghost:hover { background:#1a1a1a;color:#f5f0e8; }
        .btn-return { background:transparent;color:#e8542a;border:1.5px solid #e8542a;padding:6px 14px;font-family:'DM Mono',monospace;font-size:11px;letter-spacing:0.5px;cursor:pointer;transition:all 0.2s; }
        .btn-return:hover { background:#e8542a;color:#fff; }
        input, select { width:100%;padding:12px 14px;border:2px solid #d4cfc4;background:#fff;font-family:'DM Mono',monospace;font-size:13px;color:#1a1a1a;outline:none;transition:border 0.2s; }
        input:focus, select:focus { border-color:#1a1a1a; }
        .card { background:#fff;border:1px solid #e0dbd0;padding:20px 24px;margin-bottom:12px; }
        .tag-available { background:#d4edda;color:#155724;padding:3px 10px;font-family:'DM Mono',monospace;font-size:11px; }
        .tag-out { background:#f8d7da;color:#721c24;padding:3px 10px;font-family:'DM Mono',monospace;font-size:11px; }
        .tag-limited { background:#fff3cd;color:#856404;padding:3px 10px;font-family:'DM Mono',monospace;font-size:11px; }
      `}</style>

      {toast && (
        <div style={{position:"fixed",top:20,right:20,zIndex:9999,background:toast.type==="error"?"#e8542a":"#1a1a1a",color:"#f5f0e8",padding:"14px 24px",fontFamily:"'DM Mono',monospace",fontSize:"13px",boxShadow:"0 8px 32px rgba(0,0,0,0.2)"}}>
          {toast.msg}
        </div>
      )}

      {returnConfirm && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:999,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <div style={{background:"#fff",padding:"32px",maxWidth:"400px",width:"90%",textAlign:"center"}}>
            <p style={{fontFamily:"'Playfair Display',serif",fontSize:"20px",marginBottom:"12px"}}>Confirm Return</p>
            <p style={{fontFamily:"'DM Mono',monospace",fontSize:"13px",color:"#666",marginBottom:"24px"}}>
              Returning <strong style={{color:"#1a1a1a"}}>{BOOKS.find(b=>b.id===returnConfirm.bookId)?.title}</strong> borrowed by <strong style={{color:"#1a1a1a"}}>{returnConfirm.name}</strong>
            </p>
            <div style={{display:"flex",gap:"12px",justifyContent:"center"}}>
              <button className="btn-ghost" onClick={()=>setReturnConfirm(null)}>Cancel</button>
              <button className="btn-primary" onClick={()=>handleReturn(returnConfirm.id)}>Confirm Return</button>
            </div>
          </div>
        </div>
      )}

      <header style={{background:"#1a1a1a",padding:"0 40px",display:"flex",alignItems:"center",justifyContent:"space-between",height:"64px"}}>
        <div style={{display:"flex",alignItems:"center",gap:"20px"}}>
          <span style={{fontFamily:"'Playfair Display',serif",fontSize:"20px",color:"#f5f0e8"}}>eHub Library</span>
          <span style={{width:"1px",height:"24px",background:"#444"}}/>
          <span style={{fontFamily:"'DM Mono',monospace",fontSize:"11px",color:"#888",letterSpacing:"1px",textTransform:"uppercase"}}>Berkeley</span>
        </div>
        <nav style={{display:"flex",gap:"8px"}}>
          {[["home","Catalog"],["checkout","Check Out"],["manage","Manage"]].map(([v,label])=>(
            <button key={v} onClick={()=>setView(v)} style={{background:view===v?"#e8542a":"transparent",color:view===v?"#fff":"#aaa",border:"none",padding:"8px 16px",fontFamily:"'DM Mono',monospace",fontSize:"11px",letterSpacing:"1px",cursor:"pointer",textTransform:"uppercase",transition:"all 0.2s"}}>
              {label}
            </button>
          ))}
        </nav>
      </header>

      <main style={{maxWidth:"900px",margin:"0 auto",padding:"48px 24px"}}>
        {view === "home" && (
          <div>
            <div style={{marginBottom:"40px"}}>
              <p style={{fontFamily:"'DM Mono',monospace",fontSize:"11px",letterSpacing:"2px",textTransform:"uppercase",color:"#888",marginBottom:"8px"}}>eHub · UC Berkeley</p>
              <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"48px",lineHeight:1.1,marginBottom:"16px"}}>Library<br/>Catalog</h1>
              <p style={{fontFamily:"'DM Mono',monospace",fontSize:"13px",color:"#666",maxWidth:"500px",lineHeight:1.7}}>
                Borrow books to build better products. 2-week checkout. Return to the front desk.
              </p>
              <div style={{marginTop:"20px"}}>
                <button className="btn-primary" onClick={()=>setView("checkout")}>Check Out a Book →</button>
              </div>
            </div>
            <div style={{display:"grid",gap:"2px"}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 160px 100px 120px",background:"#1a1a1a",padding:"10px 20px"}}>
                {["Title & Author","Category","Copies","Available"].map(h=>(
                  <span key={h} style={{fontFamily:"'DM Mono',monospace",fontSize:"10px",letterSpacing:"1.5px",textTransform:"uppercase",color:"#888"}}>{h}</span>
                ))}
              </div>
              {BOOKS.map((book, i) => {
                const avail = availableCopies(book.id);
                return (
                  <div key={book.id} style={{display:"grid",gridTemplateColumns:"1fr 160px 100px 120px",background:i%2===0?"#fff":"#faf8f4",padding:"16px 20px",borderBottom:"1px solid #e8e3d8",alignItems:"center"}}>
                    <div>
                      <div style={{fontFamily:"'Georgia',serif",fontSize:"15px",fontWeight:"600",marginBottom:"2px"}}>{book.title}</div>
                      <div style={{fontFamily:"'DM Mono',monospace",fontSize:"11px",color:"#888"}}>{book.author}</div>
                    </div>
                    <div style={{fontFamily:"'DM Mono',monospace",fontSize:"11px",color:"#888"}}>Entrepreneurship</div>
                    <div style={{fontFamily:"'DM Mono',monospace",fontSize:"12px",color:"#666"}}>{book.copies} total</div>
                    <div>
                      {avail === 0 ? <span className="tag-out">All checked out</span>
                        : avail === 1 ? <span className="tag-limited">{avail} left</span>
                        : <span className="tag-available">{avail} available</span>}
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{marginTop:"32px",padding:"20px 24px",background:"#1a1a1a",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontFamily:"'DM Mono',monospace",fontSize:"12px",color:"#888"}}>Currently checked out: <strong style={{color:"#f5f0e8"}}>{active.length} books</strong></span>
              <span style={{fontFamily:"'DM Mono',monospace",fontSize:"12px",color:"#888"}}>Total collection: <strong style={{color:"#f5f0e8"}}>{BOOKS.reduce((s,b)=>s+b.copies,0)} copies</strong></span>
            </div>
          </div>
        )}

        {view === "checkout" && (
          <div style={{maxWidth:"540px"}}>
            <p style={{fontFamily:"'DM Mono',monospace",fontSize:"11px",letterSpacing:"2px",textTransform:"uppercase",color:"#888",marginBottom:"8px"}}>Borrow a book</p>
            <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"40px",marginBottom:"32px"}}>Check Out</h1>
            <div style={{display:"flex",flexDirection:"column",gap:"16px"}}>
              <div>
                <label style={{display:"block",fontFamily:"'DM Mono',monospace",fontSize:"11px",letterSpacing:"1px",textTransform:"uppercase",color:"#888",marginBottom:"6px"}}>Your Full Name *</label>
                <input placeholder="Jane Smith" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
              </div>
              <div>
                <label style={{display:"block",fontFamily:"'DM Mono',monospace",fontSize:"11px",letterSpacing:"1px",textTransform:"uppercase",color:"#888",marginBottom:"6px"}}>Email (optional)</label>
                <input placeholder="jane@berkeley.edu" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
              </div>
              <div>
                <label style={{display:"block",fontFamily:"'DM Mono',monospace",fontSize:"11px",letterSpacing:"1px",textTransform:"uppercase",color:"#888",marginBottom:"6px"}}>Select Book *</label>
                <select value={form.bookId} onChange={e=>setForm({...form,bookId:e.target.value})}>
                  <option value="">— Choose a book —</option>
                  {BOOKS.map(b=>{
                    const avail = availableCopies(b.id);
                    return <option key={b.id} value={b.id} disabled={avail===0}>{b.title} — {b.author} ({avail===0?"unavailable":`${avail} available`})</option>;
                  })}
                </select>
              </div>
              <div style={{padding:"16px",background:"#f0ede6",borderLeft:"3px solid #1a1a1a"}}>
                <p style={{fontFamily:"'DM Mono',monospace",fontSize:"11px",color:"#666",lineHeight:1.7}}>
                  📅 Checkout period: <strong style={{color:"#1a1a1a"}}>2 weeks</strong><br/>
                  📍 Return to: <strong style={{color:"#1a1a1a"}}>eHub front desk</strong><br/>
                  🔗 <a href="https://ehub.berkeley.edu/join/" target="_blank" rel="noreferrer" style={{color:"#e8542a"}}>Join the eHub community</a>
                </p>
              </div>
              <div style={{display:"flex",gap:"12px",paddingTop:"8px"}}>
                <button className="btn-ghost" onClick={()=>setView("home")}>← Back</button>
                <button className="btn-primary" onClick={handleCheckout}>Confirm Checkout →</button>
              </div>
            </div>
          </div>
        )}

        {view === "manage" && (
          <div>
            <p style={{fontFamily:"'DM Mono',monospace",fontSize:"11px",letterSpacing:"2px",textTransform:"uppercase",color:"#888",marginBottom:"8px"}}>Front desk</p>
            <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"40px",marginBottom:"32px"}}>Manage Loans</h1>
            <div style={{marginBottom:"40px"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"12px"}}>
                <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"22px"}}>Active Checkouts</h2>
                <span style={{fontFamily:"'DM Mono',monospace",fontSize:"12px",color:"#888"}}>{active.length} out</span>
              </div>
              {active.length === 0 ? (
                <div className="card" style={{textAlign:"center",padding:"40px"}}>
                  <p style={{fontFamily:"'DM Mono',monospace",fontSize:"13px",color:"#aaa"}}>All books are in.</p>
                </div>
              ) : active.map(c => {
                const book = BOOKS.find(b=>b.id===c.bookId);
                return (
                  <div key={c.id} className="card" style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"16px"}}>
                    <div style={{flex:1}}>
                      <div style={{fontFamily:"'Georgia',serif",fontSize:"15px",fontWeight:"600",marginBottom:"4px"}}>{book?.title}</div>
                      <div style={{fontFamily:"'DM Mono',monospace",fontSize:"12px",color:"#888",marginBottom:"2px"}}>👤 {c.name}{c.email?` · ${c.email}`:""}</div>
                      <div style={{fontFamily:"'DM Mono',monospace",fontSize:"11px",color:"#aaa"}}>Out: {c.checkoutDate} · Due: {c.dueDate}</div>
                    </div>
                    <button className="btn-return" onClick={()=>setReturnConfirm(c)}>Return</button>
                  </div>
                );
              })}
            </div>
            {history.length > 0 && (
              <div>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"12px"}}>
                  <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"22px",color:"#aaa"}}>Return History</h2>
                  <span style={{fontFamily:"'DM Mono',monospace",fontSize:"12px",color:"#aaa"}}>{history.length} returned</span>
                </div>
                {history.map(c=>{
                  const book = BOOKS.find(b=>b.id===c.bookId);
                  return (
                    <div key={c.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 20px",borderBottom:"1px solid #e8e3d8",opacity:0.6}}>
                      <div>
                        <span style={{fontFamily:"'Georgia',serif",fontSize:"14px"}}>{book?.title}</span>
                        <span style={{fontFamily:"'DM Mono',monospace",fontSize:"11px",color:"#aaa",marginLeft:"12px"}}>{c.name}</span>
                      </div>
                      <span style={{fontFamily:"'DM Mono',monospace",fontSize:"11px",color:"#aaa"}}>Returned {c.returnedDate}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      <footer style={{borderTop:"1px solid #e0dbd0",padding:"24px 40px",display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:"60px"}}>
        <span style={{fontFamily:"'DM Mono',monospace",fontSize:"11px",color:"#aaa",letterSpacing:"1px"}}>eHub Library · UC Berkeley</span>
        <a href="https://ehub.berkeley.edu/join/" target="_blank" rel="noreferrer" style={{fontFamily:"'DM Mono',monospace",fontSize:"11px",color:"#e8542a",textDecoration:"none"}}>Join eHub →</a>
      </footer>
    </div>
  );
}
