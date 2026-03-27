import { useState, useEffect, useRef } from "react";

// ─── Icons ───────────────────────────────────────────────────────────────────
const ChevronDown = ({ size = 20, color = "#333" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
);
const ChevronUp = ({ size = 20, color = "#333" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><polyline points="6 15 12 9 18 15" /></svg>
);
const ChevronLeft = ({ size = 20, color = "#333" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
);
const ChevronRight = ({ size = 20, color = "#333" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><polyline points="9 6 15 12 9 18" /></svg>
);
const SearchIcon = ({ size = 18, color = "#999" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
);
const XIcon = ({ size = 16, color = "#999" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
);
const UserPlus = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" /></svg>
);
const RefreshIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" /></svg>
);

// ─── Data Constants ──────────────────────────────────────────────────────────
const COURT_TYPES = {
  Pickleball: ["Indoor Pickleball"],
  Tennis: ["Clay", "Hard"],
};
const RES_TYPES = {
  Pickleball: ["Pickleball Singles", "Pickleball Doubles"],
  Tennis: ["Tennis Singles", "Tennis Doubles"],
};
const PLAYERS = [
  { id: 1, name: "John Smith", phone4: "4821" }, { id: 2, name: "Jim Parker", phone4: "7733" },
  { id: 3, name: "Tim Johnson", phone4: "2190" }, { id: 4, name: "James Wilson", phone4: "5567" },
  { id: 5, name: "Jake Davis", phone4: "8842" }, { id: 6, name: "Jeff Brown", phone4: "3310" },
  { id: 7, name: "Tom Rivera", phone4: "6654" }, { id: 8, name: "Mike Chen", phone4: "9021" },
];
const SPECIFIC_COURTS = {
  Pickleball: [
    { name: "Clukey", type: "Indoor Pickleball" },
    { name: "Pierce", type: "Indoor Pickleball" },
    { name: "Baxter", type: "Indoor Pickleball" },
  ],
  Tennis: [
    { name: "Hamilton", type: "Clay" },
    { name: "Jefferson", type: "Hard" },
    { name: "Madison", type: "Clay" },
    { name: "Monroe", type: "Hard" },
  ],
};
const CALENDAR_EVENTS = {
  Pickleball: {
    Clukey: { start: 8, end: 12, label: "OPEN PLAY", sub: "3.5+ Round Robin W/ Staff", time: "9:00 AM - 11:00 AM", color: "#f0c030" },
    Pierce: { start: 10, end: 14, label: "3.0-3.25", sub: "3.0-3.25 Round Robin", time: "11:00 AM - 1:00 PM", color: "#44dd44" },
  },
  Tennis: {
    Hamilton: { start: 6, end: 10, label: "CLINIC", sub: "Intermediate Clinic", time: "8:00 AM - 10:00 AM", color: "#5c6bc0" },
  },
};
const ADDONS_CONFIG = {
  "Pickleball Singles": {
    ballMachines: [{ id: "bm1", name: "Spinshot Player", price: 15 }, { id: "bm2", name: "Lobster Pickle", price: 20 }],
    recording: { price: 10, partner: "Save My Play" },
    extras: [{ id: "ex1", name: "Paddle Rental", price: 5 }],
  },
  "Pickleball Doubles": {
    ballMachines: null,
    recording: { price: 10, partner: "Save My Play" },
    extras: [{ id: "ex1", name: "Paddle Rental", price: 5 }, { id: "ex2", name: "Ball Hopper", price: 3 }],
  },
  "Tennis Singles": {
    ballMachines: [{ id: "bm3", name: "Lobster Elite", price: 25 }, { id: "bm4", name: "Spinfire Pro 2", price: 20 }, { id: "bm5", name: "Slinger Bag", price: 15 }],
    recording: null,
    extras: [{ id: "ex3", name: "Racket Rental", price: 8 }, { id: "ex4", name: "Ball Can (3-pack)", price: 5 }],
  },
  "Tennis Doubles": {
    ballMachines: null,
    recording: null,
    extras: [{ id: "ex3", name: "Racket Rental", price: 8 }],
  },
};

const GLOBAL_CSS = `[data-priceline] { border: none !important; }`;

// ─── Shared Style Fragments ─────────────────────────────────────────────────
const TEAL = "#4ecdc4";
const FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

const cardStyle = {
  border: "1.5px solid #e0e0e0",
  borderRadius: 14,
  padding: "20px",
  backgroundColor: "white",
  marginBottom: 14,
};

const disabledCardStyle = {
  ...cardStyle,
  padding: "18px 20px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  opacity: 0.4,
};

const initials = (name) => name.split(" ").map((n) => n[0]).join("");

// ─── Utility Components ─────────────────────────────────────────────────────
function AnimateHeight({ show, children }) {
  const ref = useRef(null);
  const [h, setH] = useState(show ? "auto" : "0px");
  const [op, setOp] = useState(show ? 1 : 0);
  useEffect(() => {
    if (show) {
      setH("0px"); setOp(0);
      requestAnimationFrame(() => {
        const el = ref.current;
        if (el) { setH(el.scrollHeight + "px"); setOp(1); }
        setTimeout(() => setH("auto"), 350);
      });
    } else {
      const el = ref.current;
      if (el) {
        setH(el.scrollHeight + "px");
        requestAnimationFrame(() => { setH("0px"); setOp(0); });
      }
    }
  }, [show]);
  return (
    <div ref={ref} style={{ overflow: "hidden", height: h, opacity: op, transition: "height 0.3s ease, opacity 0.25s ease" }}>
      {children}
    </div>
  );
}

function FadeIn({ children, onMount }) {
  const [v, setV] = useState(false);
  const ref = useRef(null);
  useEffect(() => { const t = setTimeout(() => setV(true), 0); return () => clearTimeout(t); }, []);
  useEffect(() => {
    if (v && onMount) {
      setTimeout(() => { ref.current?.scrollIntoView({ behavior: "smooth", block: "center" }); }, 100);
    }
  }, [v, onMount]);
  return (
    <div ref={ref} style={{ opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(12px)", transition: "opacity 0.35s ease, transform 0.35s ease" }}>
      {children}
    </div>
  );
}

// ─── Shell & Chrome ─────────────────────────────────────────────────────────
const Shell = ({ children }) => (
  <div style={{ margin: "0 auto", backgroundColor: "#f5f5f5", minHeight: "100vh", fontFamily: FONT, position: "relative", display: "flex", flexDirection: "column" }}>
    <style>{GLOBAL_CSS}</style>
    {children}
  </div>
);

const StatusBar = () => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 20px 4px", fontSize: 15, fontWeight: 600 }}>
    <span>2:48</span>
    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
      <span style={{ fontSize: 12 }}>●●●○</span>
      <span style={{ fontSize: 14 }}>📶</span>
      <span style={{ fontSize: 12, backgroundColor: "#4CAF50", color: "white", padding: "1px 6px", borderRadius: 4, fontWeight: 600 }}>73</span>
    </div>
  </div>
);

function BottomTabs() {
  const tabs = [
    { label: "Home", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="#1a1a1a" stroke="#1a1a1a" strokeWidth="1"><path d="M3 12l9-8 9 8v8a2 2 0 01-2 2h-4v-6H9v6H5a2 2 0 01-2-2z" /></svg>, active: true },
    { label: "Calendar", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.8"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="3" y1="10" x2="21" y2="10" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="16" y1="2" x2="16" y2="6" /></svg> },
    { label: "", icon: <div style={{ width: 52, height: 52, borderRadius: "50%", backgroundColor: TEAL, display: "flex", alignItems: "center", justifyContent: "center", marginTop: -26, boxShadow: "0 2px 8px rgba(78,205,196,0.4)" }}><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></div> },
    { label: "Alerts", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.8"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" /></svg> },
    { label: "More", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg> },
  ];
  return (
    <div style={{ position: "fixed", bottom: 0, left: 0, width: "100%", backgroundColor: "white", borderTop: "1px solid #e8e8e8", display: "flex", justifyContent: "space-around", alignItems: "center", paddingTop: 6, paddingBottom: 20, zIndex: 10 }}>
      {tabs.map((t, i) => (
        <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, cursor: "pointer", minWidth: 50 }}>
          {t.icon}
          {t.label && <span style={{ fontSize: 10, fontWeight: t.active ? 600 : 400, color: t.active ? "#1a1a1a" : "#999" }}>{t.label}</span>}
        </div>
      ))}
    </div>
  );
}

// ─── Small Reusable UI Pieces ───────────────────────────────────────────────
function Chip({ label, selected, onClick, small }) {
  return (
    <button onClick={onClick} style={{
      padding: small ? "12px 4px" : "14px",
      border: selected ? "2px solid #333" : "1.5px solid #ddd",
      borderRadius: 10,
      backgroundColor: selected ? "#fafafa" : "white",
      fontSize: small ? 14 : 15,
      fontWeight: selected ? 600 : 500,
      color: "#333", cursor: "pointer", textAlign: "center",
      transition: "all 0.2s ease", minHeight: 44,
    }}>{label}</button>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <div onClick={onChange} style={{
      width: 44, height: 26, borderRadius: 13,
      backgroundColor: checked ? TEAL : "#ddd",
      cursor: "pointer", position: "relative",
      transition: "background-color 0.2s ease", flexShrink: 0,
    }}>
      <div style={{
        width: 22, height: 22, borderRadius: "50%", backgroundColor: "white",
        position: "absolute", top: 2, left: checked ? 20 : 2,
        transition: "left 0.2s ease", boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
      }} />
    </div>
  );
}

function SummaryRow({ label, value, sub, onClick }) {
  return (
    <div onClick={onClick} style={{
      ...cardStyle, padding: "18px 20px",
      display: "flex", justifyContent: "space-between", alignItems: "flex-start",
      cursor: onClick ? "pointer" : "default",
      transition: "box-shadow 0.2s ease",
      boxShadow: onClick ? "0 1px 3px rgba(0,0,0,0.04)" : "none",
    }}>
      <span style={{ fontSize: 16, color: "#888" }}>{label}</span>
      <div style={{ textAlign: "right", display: "flex", alignItems: "center", gap: 8 }}>
        <div>
          <div style={{ fontSize: 17, fontWeight: 700 }}>{value}</div>
          {sub && <div style={{ fontSize: 14, color: "#888" }}>{sub}</div>}
        </div>
        {onClick && <ChevronDown size={16} color="#aaa" />}
      </div>
    </div>
  );
}

function SectionRow({ label, value, chevron = "down", onClick }) {
  return (
    <div onClick={onClick} style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      cursor: onClick ? "pointer" : "default", padding: "14px 0", borderBottom: "1px solid #f0f0f0",
    }}>
      <span style={{ fontSize: 16, color: "#666" }}>{label}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {value && <span style={{ fontSize: 15, fontWeight: 600 }}>{value}</span>}
        {chevron === "up" ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </div>
    </div>
  );
}

function SwipeableRow({ onRemove, children, peek }) {
  const rowRef = useRef(null);
  const startX = useRef(0);
  const currentX = useRef(0);
  const dragging = useRef(false);
  const [offset, setOffset] = useState(0);
  const DELETE_W = 72;

  useEffect(() => {
    if (!peek || !onRemove) return;
    const t1 = setTimeout(() => setOffset(-48), 300);
    const t2 = setTimeout(() => setOffset(0), 900);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const begin = (x) => {
    if (!onRemove) return;
    dragging.current = true;
    startX.current = x;
    currentX.current = offset;
  };
  const move = (x) => {
    if (!onRemove || !dragging.current) return;
    const dx = x - startX.current;
    const next = Math.min(0, Math.max(-DELETE_W, currentX.current + dx));
    setOffset(next);
  };
  const end = () => {
    if (!onRemove || !dragging.current) return;
    dragging.current = false;
    if (offset < -DELETE_W / 2) setOffset(-DELETE_W);
    else setOffset(0);
  };

  const handleDelete = () => {
    setOffset(-400);
    setTimeout(() => onRemove(), 250);
  };

  return (
    <div style={{ position: "relative", overflow: "hidden" }}>
      <div style={{
        position: "absolute", right: 0, top: 0, bottom: 0,
        width: DELETE_W, backgroundColor: "#ff3b30",
        display: "flex", alignItems: "center", justifyContent: "center",
        opacity: offset < 0 ? 1 : 0, transition: offset === 0 ? "opacity 0.2s ease" : "none",
      }}>
        <span onClick={handleDelete} style={{ color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer", padding: "8px 12px" }}>Delete</span>
      </div>
      <div
        ref={rowRef}
        onTouchStart={(e) => begin(e.touches[0].clientX)}
        onTouchMove={(e) => move(e.touches[0].clientX)}
        onTouchEnd={end}
        onMouseDown={(e) => { e.preventDefault(); begin(e.clientX); }}
        onMouseMove={(e) => move(e.clientX)}
        onMouseUp={end}
        onMouseLeave={() => { if (dragging.current) end(); }}
        style={{
          position: "relative", backgroundColor: "white",
          transform: `translateX(${offset}px)`,
          transition: !dragging.current ? "transform 0.25s ease" : "none",
          zIndex: 1, userSelect: "none",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function PlayerRow({ name, tag, phone4, onRemove, sub, peek }) {
  const content = (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", minHeight: 36 }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 15, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
          {name}
          {tag && <span style={{ fontSize: 11, color: "#888", backgroundColor: "#f0f0f0", padding: "2px 8px", borderRadius: 4, fontWeight: 500 }}>{tag}</span>}
        </div>
        {phone4 && <div style={{ fontSize: 12, color: "#aaa", marginTop: 1, letterSpacing: 0.3 }}>(•••) •••-{phone4}</div>}
        {sub && <div style={{ marginTop: 3 }}>{sub}</div>}
      </div>
      <span style={{ fontSize: 14, fontWeight: 600, flexShrink: 0 }}>$10.00</span>
    </div>
  );
  if (onRemove) {
    return <SwipeableRow onRemove={onRemove} peek={peek}>{content}</SwipeableRow>;
  }
  return content;
}

function ReservationFooter({ disabled, total, onReserve, lockoutLabel }) {
  const [loading, setLoading] = useState(false);
  const handleClick = () => {
    if (disabled || loading) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); onReserve(); }, 800);
  };
  const btnText = loading ? "Processing..." : disabled ? "Reserve" : lockoutLabel === "continue" ? "Reserve & Add Players" : `Reserve — $${total}`;
  return (
    <div style={{ padding: "16px 0 0", textAlign: "center" }}>
      <div style={{ fontSize: 13, color: "#aaa", display: "flex", alignItems: "center", justifyContent: "center", gap: 4, marginBottom: 12 }}>
        Powered by CourtReserve
        <svg width="16" height="16" viewBox="0 0 20 20" fill="#1a1a1a"><path d="M10 0a10 10 0 100 20 10 10 0 000-20zm-1 15l-5-5 1.4-1.4L9 12.2l6.6-6.6L17 7l-8 8z" /></svg>
      </div>
      <button onClick={handleClick} style={{
        width: "100%", padding: "16px",
        backgroundColor: disabled ? "#e8e8e8" : loading ? "#3dbdb5" : TEAL,
        color: disabled ? "#bbb" : "white",
        border: "none", borderRadius: 10, fontSize: 17, fontWeight: 600,
        cursor: disabled ? "default" : "pointer", marginBottom: 8,
        transition: "all 0.3s ease", opacity: loading ? 0.85 : 1,
      }}>
        {btnText}
      </button>
      <div style={{ fontSize: 12, color: "#aaa", marginBottom: 20 }}>
        By continuing, you agree to <span style={{ color: TEAL, textDecoration: "underline", cursor: "pointer" }}>Terms and Conditions</span>
      </div>
    </div>
  );
}

// ─── Pricing Section ────────────────────────────────────────────────────────
function PricingSection({ pCount, numCourts, addonsAmt, addonParts, effectiveMode, payMode, playerPayChoice, setPlayerPayChoice, addonsConfig, addons, setAddons }) {
  const courtFeePerPlayer = 10 * numCourts;
  const cLabel = numCourts > 1 ? `Court fees (${pCount} × $${courtFeePerPlayer.toFixed(2)})` : `Court fees (${pCount} × $10.00)`;

  const LineItem = ({ label, amount }) => (
    <div data-priceline="true" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: 26, fontSize: 14, color: "#888" }}>
      <span>{label}</span><span style={{ fontWeight: 500, color: "#555" }}>${amount}</span>
    </div>
  );

  const TotalRow = ({ label, amount }) => (
    <div data-priceline="true" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: 34, marginTop: 4 }}>
      <span style={{ fontSize: 16, fontWeight: 700 }}>{label}</span>
      <span style={{ fontSize: 18, fontWeight: 700 }}>${amount}</span>
    </div>
  );

  const recording = addonsConfig?.recording ? (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10, paddingTop: 10, borderTop: "1px solid #eee" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 28, height: 28, borderRadius: "50%", backgroundColor: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width="11" height="11" viewBox="0 0 14 14" fill="white"><polygon points="5,2 12,7 5,12" /></svg>
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#333" }}>Record Your Session</div>
          <div style={{ fontSize: 12, color: "#999" }}>via {addonsConfig.recording.partner} · +${addonsConfig.recording.price.toFixed(2)}</div>
        </div>
      </div>
      <Toggle checked={addons.recording} onChange={() => setAddons({ ...addons, recording: !addons.recording })} />
    </div>
  ) : null;

  const payChoice = payMode === 3 ? (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontSize: 15, fontWeight: 600, color: "#666", marginBottom: 10 }}>Fee Responsibility</div>
      <div role="radiogroup" style={{ display: "inline-flex", width: "100%", backgroundColor: "#f3f4f6", border: "1px solid #e5e7eb", borderRadius: 9999, padding: 4, boxSizing: "border-box" }}>
        {[{ key: "full", label: "Reservation Owner" }, { key: "split", label: "Split Equally" }].map((opt) => {
          const sel = playerPayChoice === opt.key;
          return (
            <button key={opt.key} role="radio" aria-checked={sel}
              onClick={() => setPlayerPayChoice(opt.key)}
              style={{
                flex: 1, padding: "8px 16px", fontSize: 13, fontWeight: 500,
                borderRadius: 9999, border: "none", cursor: "pointer",
                color: sel ? "#111827" : "#6b7280",
                backgroundColor: sel ? "white" : "transparent",
                boxShadow: sel ? "0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)" : "none",
                transition: "all 0.2s ease", whiteSpace: "nowrap",
              }}
            >{opt.label}</button>
          );
        })}
      </div>
    </div>
  ) : null;

  if (effectiveMode === 0) {
    const cf = pCount * courtFeePerPlayer;
    const sub = cf + addonsAmt;
    const tax = sub * 0.06;
    const tot = sub + tax;
    return (
      <>
        {payChoice}
        <LineItem label={cLabel} amount={cf.toFixed(2)} />
        {addonsAmt > 0 && <LineItem label={addonParts.length === 1 ? addonParts[0] : `${addonParts.length} add-ons`} amount={addonsAmt.toFixed(2)} />}
        <LineItem label="Tax (6%)" amount={tax.toFixed(2)} />
        <TotalRow label="Total Due" amount={tot.toFixed(2)} />
        {recording}
      </>
    );
  } else if (effectiveMode === 1) {
    const cf = pCount * courtFeePerPlayer;
    const sub = cf + addonsAmt;
    const tax = sub * 0.06;
    const tot = sub + tax;
    const share = tot / pCount;
    return (
      <>
        {payChoice}
        <LineItem label={cLabel} amount={cf.toFixed(2)} />
        {addonsAmt > 0 && <LineItem label={addonParts.length === 1 ? addonParts[0] : `${addonParts.length} add-ons`} amount={addonsAmt.toFixed(2)} />}
        <LineItem label="Tax (6%)" amount={tax.toFixed(2)} />
        <div data-priceline="true" style={{ display: "flex", justifyContent: "space-between", height: 22, fontSize: 13, color: "#aaa", alignItems: "center", marginTop: 4 }}>
          <span>Reservation total</span><span>${tot.toFixed(2)}</span>
        </div>
        <div data-priceline="true" style={{ display: "flex", justifyContent: "space-between", height: 22, fontSize: 13, color: "#aaa", alignItems: "center" }}>
          <span>Split {pCount} ways</span><span>${share.toFixed(2)} each</span>
        </div>
        <TotalRow label="Your Share" amount={share.toFixed(2)} />
        {recording}
      </>
    );
  } else {
    const mySub = courtFeePerPlayer + addonsAmt;
    const myTax = mySub * 0.06;
    const myTot = mySub + myTax;
    return (
      <>
        <LineItem label={`Your court fee${numCourts > 1 ? ` (${numCourts} courts)` : ""}`} amount={courtFeePerPlayer.toFixed(2)} />
        {addonsAmt > 0 && <LineItem label={addonParts.length === 1 ? addonParts[0] : `${addonParts.length} add-ons`} amount={addonsAmt.toFixed(2)} />}
        <LineItem label="Tax (6%)" amount={myTax.toFixed(2)} />
        <TotalRow label="Your Total" amount={myTot.toFixed(2)} />
        {recording}
      </>
    );
  }
}

// ─── Customize Bottom Sheet ─────────────────────────────────────────────────
function CustomizeSheet({ experience, addonsConfig, selectedCourts, setSelectedCourts, courtQty, setCourtQty, addons, setAddons, onClose }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { requestAnimationFrame(() => setVisible(true)); }, []);
  const close = () => { setVisible(false); setTimeout(onClose, 250); };
  const allCourts = SPECIFIC_COURTS[experience] || [];
  const maxCourts = allCourts.length;
  const hasBM = addonsConfig?.ballMachines?.length > 0;
  const hasRec = !!addonsConfig?.recording;
  const hasExtras = addonsConfig?.extras?.length > 0;
  const hasAnyAddons = hasBM || hasRec || hasExtras;

  const toggleCourt = (name) => {
    if (selectedCourts.includes(name)) setSelectedCourts(selectedCourts.filter((c) => c !== name));
    else setSelectedCourts([...selectedCourts, name]);
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div onClick={close} style={{ position: "absolute", inset: 0, backgroundColor: visible ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0)", transition: "background-color 0.25s ease" }} />
      <div style={{
        position: "relative", width: "100%",
        backgroundColor: "white", borderRadius: "20px 20px 0 0",
        padding: "24px 20px 32px",
        transform: visible ? "translateY(0)" : "translateY(100%)",
        transition: "transform 0.3s ease",
        maxHeight: "80vh", overflowY: "auto",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 20, fontWeight: 700 }}>Customize Reservation</div>
          <div onClick={close} style={{ cursor: "pointer", padding: 4 }}><XIcon size={20} color="#666" /></div>
        </div>

        {/* Courts */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: "#333", marginBottom: 4 }}>Courts</div>
          <div style={{ fontSize: 13, color: "#999", marginBottom: 12 }}>Select specific courts or set a quantity.</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0 14px", borderBottom: "1px solid #f0f0f0" }}>
            <span style={{ fontSize: 15, color: "#666" }}>Number of Courts</span>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div onClick={() => { setCourtQty(Math.max(1, courtQty - 1)); setSelectedCourts([]); }}
                style={{ width: 30, height: 30, borderRadius: "50%", border: "1.5px solid #ddd", display: "flex", alignItems: "center", justifyContent: "center", cursor: courtQty > 1 ? "pointer" : "default", opacity: courtQty > 1 ? 1 : 0.3 }}>
                <span style={{ fontSize: 18, fontWeight: 600, color: "#333", lineHeight: 1 }}>−</span>
              </div>
              <span style={{ fontSize: 17, fontWeight: 700, minWidth: 20, textAlign: "center" }}>{selectedCourts.length > 0 ? selectedCourts.length : courtQty}</span>
              <div onClick={() => { if (selectedCourts.length === 0) setCourtQty(Math.min(maxCourts, courtQty + 1)); }}
                style={{ width: 30, height: 30, borderRadius: "50%", border: "1.5px solid #ddd", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", opacity: (selectedCourts.length > 0 || courtQty >= maxCourts) ? 0.3 : 1 }}>
                <span style={{ fontSize: 18, fontWeight: 600, color: "#333", lineHeight: 1 }}>+</span>
              </div>
            </div>
          </div>
          <div style={{ paddingTop: 10 }}>
            <div style={{ fontSize: 13, color: "#999", marginBottom: 8 }}>Or choose specific courts:</div>
            <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 6, marginLeft: -20, marginRight: -20, paddingLeft: 20, paddingRight: 20, WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}>
              {allCourts.map((c) => {
                const sel = selectedCourts.includes(c.name);
                return (
                  <div key={c.name} onClick={() => toggleCourt(c.name)} style={{
                    padding: "8px 14px", border: sel ? "1.5px solid #4ecdc4" : "1.5px solid #e0e0e0",
                    borderRadius: 8, backgroundColor: sel ? "#f0fffe" : "white",
                    cursor: "pointer", transition: "all 0.15s ease", flexShrink: 0,
                  }}>
                    <div style={{ fontSize: 14, fontWeight: sel ? 600 : 500, color: "#333" }}>{c.name}</div>
                    <div style={{ fontSize: 11, color: "#999" }}>{c.type}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Add-ons */}
        {hasAnyAddons && (
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#333", marginBottom: 4 }}>Add-ons</div>
            <div style={{ fontSize: 13, color: "#999", marginBottom: 12 }}>Optional extras for your reservation.</div>
            {hasBM && (
              <div style={{ marginBottom: 4 }}>
                <div style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>Ball Machine</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {addonsConfig.ballMachines.map((bm) => {
                    const sel = addons.ballMachine === bm.id;
                    return (
                      <div key={bm.id} onClick={() => setAddons({ ...addons, ballMachine: sel ? null : bm.id })} style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "10px 12px", border: sel ? "1.5px solid #4ecdc4" : "1.5px solid #e8e8e8",
                        borderRadius: 8, cursor: "pointer", backgroundColor: sel ? "#f0fffe" : "white",
                        transition: "all 0.15s ease",
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 18, height: 18, borderRadius: "50%", border: sel ? "5px solid #4ecdc4" : "2px solid #ccc", boxSizing: "border-box" }} />
                          <span style={{ fontSize: 14, fontWeight: sel ? 600 : 400, color: "#333" }}>{bm.name}</span>
                        </div>
                        <span style={{ fontSize: 13, color: "#888" }}>+${bm.price.toFixed(2)}</span>
                      </div>
                    );
                  })}
                </div>
                <div style={{ borderBottom: "1px solid #f0f0f0", margin: "12px 0" }} />
              </div>
            )}
            {hasRec && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #f0f0f0" }}>
                <div>
                  <div style={{ fontSize: 15, color: "#666" }}>Record Session</div>
                  <div style={{ fontSize: 12, color: "#aaa", marginTop: 1 }}>via {addonsConfig.recording.partner} · +${addonsConfig.recording.price.toFixed(2)}</div>
                </div>
                <Toggle checked={addons.recording} onChange={() => setAddons({ ...addons, recording: !addons.recording })} />
              </div>
            )}
            {hasExtras && addonsConfig.extras.map((ex) => (
              <div key={ex.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #f0f0f0" }}>
                <div>
                  <div style={{ fontSize: 15, color: "#666" }}>{ex.name}</div>
                  <div style={{ fontSize: 12, color: "#aaa", marginTop: 1 }}>+${ex.price.toFixed(2)}</div>
                </div>
                <Toggle checked={!!addons.extras[ex.id]} onChange={() => setAddons({ ...addons, extras: { ...addons.extras, [ex.id]: !addons.extras[ex.id] } })} />
              </div>
            ))}
            <button onClick={close} style={{ width: "100%", marginTop: 20, padding: "14px", backgroundColor: TEAL, color: "white", border: "none", borderRadius: 10, fontSize: 16, fontWeight: 600, cursor: "pointer" }}>Done</button>
          </div>
        )}
        {!hasAnyAddons && (
          <button onClick={close} style={{ width: "100%", marginTop: 4, padding: "14px", backgroundColor: TEAL, color: "white", border: "none", borderRadius: 10, fontSize: 16, fontWeight: 600, cursor: "pointer" }}>Done</button>
        )}
      </div>
    </div>
  );
}

// ─── Screens ────────────────────────────────────────────────────────────────

function ExperiencePicker({ onBack, onSelect }) {
  return (
    <Shell><StatusBar />
      <div onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, padding: "16px 20px 0", cursor: "pointer" }}>
        <ChevronLeft size={18} color={TEAL} /><span style={{ fontSize: 16, fontWeight: 500, color: TEAL }}>Back</span>
      </div>
      <div style={{ padding: "20px 20px 4px" }}>
        <div style={{ fontSize: 24, fontWeight: 800 }}>View Calendar</div>
        <div style={{ fontSize: 14, color: "#777", marginTop: 4 }}>Select an experience to view available courts.</div>
      </div>
      <div style={{ padding: "24px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
        {[{ name: "Pickleball", courts: "3 courts available" }, { name: "Tennis", courts: "4 courts available" }].map((e) => (
          <button key={e.name} onClick={() => onSelect(e.name)} style={{
            width: "100%", padding: "20px", border: "none", borderRadius: 14,
            backgroundColor: "white", cursor: "pointer", textAlign: "left",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)", display: "flex",
            alignItems: "center", gap: 16, borderLeft: `4px solid ${TEAL}`,
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{e.name}</div>
              <div style={{ fontSize: 13, color: "#888", marginTop: 3 }}>{e.courts}</div>
            </div>
            <ChevronRight size={20} color="#ccc" />
          </button>
        ))}
      </div>
    </Shell>
  );
}

function CalendarScreen({ onBack, experience, onReserveSlot }) {
  const allCourts = SPECIFIC_COURTS[experience] || [];
  const events = CALENDAR_EVENTS[experience] || {};
  const times = ["6:00 AM", "6:30 AM", "7:00 AM", "7:30 AM", "8:00 AM", "8:30 AM", "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM"];

  return (
    <Shell><StatusBar />
      <div onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 20px", cursor: "pointer" }}>
        <ChevronLeft size={20} /><span style={{ fontSize: 18, fontWeight: 700 }}>Book a Court</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", padding: "0 20px 4px" }}>
        <span style={{ fontSize: 13, color: TEAL, fontWeight: 600, backgroundColor: "#e0f7f5", padding: "4px 12px", borderRadius: 6 }}>{experience} Courts</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", padding: "8px 20px 12px", gap: 12 }}>
        <button style={{ padding: "6px 14px", border: "1.5px solid #ddd", borderRadius: 8, backgroundColor: "white", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>TODAY</button>
        <div style={{ display: "flex", gap: 2 }}>
          <div style={{ cursor: "pointer", padding: 4 }}><ChevronLeft size={18} /></div>
          <div style={{ cursor: "pointer", padding: 4 }}><ChevronRight size={18} /></div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginLeft: "auto" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.8"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="3" y1="10" x2="21" y2="10" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="16" y1="2" x2="16" y2="6" /></svg>
          <span style={{ fontSize: 16, fontWeight: 600 }}>Tue, Feb 24</span>
        </div>
      </div>
      <div style={{ flex: 1, overflowX: "auto", overflowY: "auto", paddingBottom: 80 }}>
        <div style={{ minWidth: allCourts.length * 150 + 170 }}>
          <div style={{ display: "flex", position: "sticky", top: 0, zIndex: 5, backgroundColor: "#f5f5f5", borderBottom: "1px solid #e0e0e0" }}>
            <div style={{ width: 70, minWidth: 70, padding: "10px 6px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><RefreshIcon /></div>
            <div style={{ width: 90, minWidth: 90, padding: "10px 8px", flexShrink: 0 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: TEAL, letterSpacing: 0.5 }}>WAITLIST</span>
            </div>
            {allCourts.map((c, i) => (
              <div key={i} style={{ flex: 1, minWidth: 140, padding: "8px 12px", borderLeft: "1px solid #e8e8e8" }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: experience === "Pickleball" ? TEAL : "#5c6bc0" }}>{c.name}</div>
                <div style={{ fontSize: 12, color: "#999" }}>{c.type}</div>
              </div>
            ))}
          </div>
          {times.map((time, ti) => {
            const hasWL = ti >= 8;
            return (
              <div key={ti} style={{ display: "flex", borderBottom: "1px solid #f0f0f0", minHeight: 56 }}>
                <div style={{ width: 70, minWidth: 70, padding: "14px 8px", fontSize: 13, color: "#888", fontWeight: 500, textAlign: "right", flexShrink: 0 }}>{time}</div>
                <div style={{ width: 90, minWidth: 90, padding: "8px 4px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {hasWL && <button style={{ padding: "7px 8px", backgroundColor: TEAL, color: "white", border: "none", borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>Join Waitlist</button>}
                </div>
                {allCourts.map((c, ci) => {
                  const ev = events[c.name];
                  const isS = ev && ti === ev.start;
                  const isI = ev && ti >= ev.start && ti < ev.end;
                  if (isS) {
                    const sp = ev.end - ev.start;
                    return (
                      <div key={ci} style={{ flex: 1, minWidth: 140, borderLeft: "1px solid #e8e8e8", position: "relative" }}>
                        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: sp * 56, backgroundColor: ev.color, padding: 12, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 2 }}>
                          <div style={{ fontSize: 13, fontWeight: 800, color: "white", textAlign: "center" }}>{ev.label}</div>
                          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.9)", textAlign: "center", marginTop: 2 }}>{ev.sub}</div>
                          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.85)", textAlign: "center", marginTop: 2 }}>{ev.time}</div>
                          <button style={{ marginTop: 6, padding: "4px 12px", backgroundColor: "rgba(0,0,0,0.15)", color: "white", border: "1px solid rgba(255,255,255,0.4)", borderRadius: 4, fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Join Waitlist</button>
                        </div>
                      </div>
                    );
                  }
                  if (isI) return <div key={ci} style={{ flex: 1, minWidth: 140, borderLeft: "1px solid #e8e8e8" }} />;
                  return (
                    <div key={ci} onClick={() => onReserveSlot({ court: c.name, courtType: c.type, time, date: "Tue, Feb 24" })} style={{ flex: 1, minWidth: 140, borderLeft: "1px solid #e8e8e8", display: "flex", alignItems: "center", justifyContent: "center", padding: 8, cursor: "pointer" }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: "#333" }}>Reserve {time}</span>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
      <BottomTabs />
    </Shell>
  );
}

function SuccessScreen({ onDone, experience, resType, duration, dateTime, courtLabel, players, guests, total }) {
  const [v, setV] = useState(false);
  useEffect(() => { const t = setTimeout(() => setV(true), 50); return () => clearTimeout(t); }, []);
  const pCount = 1 + (players?.length || 0) + (guests?.length || 0);

  return (
    <Shell><StatusBar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px 100px", textAlign: "center" }}>
        <div style={{ opacity: v ? 1 : 0, transform: v ? "scale(1)" : "scale(0.5)", transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)", marginBottom: 24 }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", backgroundColor: TEAL, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto", boxShadow: "0 4px 20px rgba(78,205,196,0.35)" }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
          </div>
        </div>
        <div style={{ opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(16px)", transition: "all 0.4s ease 0.15s" }}>
          <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>You're All Set!</div>
          <div style={{ fontSize: 15, color: "#888", marginBottom: 28 }}>Your reservation has been confirmed.</div>
        </div>
        <div style={{ opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(16px)", transition: "all 0.4s ease 0.3s", width: "100%", backgroundColor: "white", borderRadius: 14, padding: "20px", border: "1.5px solid #e0e0e0", textAlign: "left", marginBottom: 20 }}>
          <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 14 }}>{experience}{resType ? ` — ${resType}` : ""}</div>
          {[
            { l: "Date & Time", v: dateTime },
            { l: "Duration", v: duration },
            courtLabel && { l: "Court", v: courtLabel },
            { l: "Players", v: `${pCount} player${pCount > 1 ? "s" : ""}` },
          ].filter(Boolean).map((row, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f0f0f0" }}>
              <span style={{ fontSize: 14, color: "#888" }}>{row.l}</span>
              <span style={{ fontSize: 14, fontWeight: 600 }}>{row.v}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0 0" }}>
            <span style={{ fontSize: 16, fontWeight: 700 }}>Total</span>
            <span style={{ fontSize: 16, fontWeight: 700 }}>${total}</span>
          </div>
        </div>
        <div style={{ opacity: v ? 1 : 0, transition: "opacity 0.4s ease 0.45s", width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
          <button style={{ width: "100%", padding: "14px", backgroundColor: TEAL, color: "white", border: "none", borderRadius: 10, fontSize: 16, fontWeight: 600, cursor: "pointer" }}>Add to Calendar</button>
          <button onClick={onDone} style={{ width: "100%", padding: "14px", backgroundColor: "white", color: "#333", border: "1.5px solid #ddd", borderRadius: 10, fontSize: 16, fontWeight: 500, cursor: "pointer" }}>Back to Home</button>
        </div>
      </div>
    </Shell>
  );
}

function NumberStepper({ label, value, onChange, min = 0, max = 20 }) {
  const v = value === "" ? "" : Number(value);
  return (
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 13, color: "#888", marginBottom: 6 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, border: "1.5px solid #e0e0e0", borderRadius: 10, padding: "6px 10px" }}>
        <div onClick={() => { if (v !== "" && v > min) onChange(v - 1); }} style={{ width: 26, height: 26, borderRadius: "50%", border: "1px solid #ddd", display: "flex", alignItems: "center", justifyContent: "center", cursor: v > min ? "pointer" : "default", opacity: v <= min ? 0.3 : 1 }}>
          <span style={{ fontSize: 16, fontWeight: 600, color: "#333", lineHeight: 1 }}>−</span>
        </div>
        <span style={{ fontSize: 15, fontWeight: 700, minWidth: 20, textAlign: "center" }}>{v === "" ? "—" : v}</span>
        <div onClick={() => { const next = v === "" ? min : v + 1; if (next <= max) onChange(next); }} style={{ width: 26, height: 26, borderRadius: "50%", border: "1px solid #ddd", display: "flex", alignItems: "center", justifyContent: "center", cursor: v >= max ? "default" : "pointer", opacity: v >= max ? 0.3 : 1 }}>
          <span style={{ fontSize: 16, fontWeight: 600, color: "#333", lineHeight: 1 }}>+</span>
        </div>
      </div>
    </div>
  );
}

function AddPlayersScreen({ onDone, experience, resType, courtLabel, maxPlayers }) {
  const [players, setPlayers] = useState([]);
  const [guests, setGuests] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddGuest, setShowAddGuest] = useState(false);
  const [guestFirst, setGuestFirst] = useState("");
  const [guestLast, setGuestLast] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const filteredPlayers = PLAYERS.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()) && !players.find((s) => s.id === p.id));
  const spotsLeft = Math.max(0, (maxPlayers || 3) - players.length - guests.length);
  const pCount = 1 + players.length + guests.length;
  const sub = pCount * 10;
  const displayTotal = (sub + sub * 0.06).toFixed(2);
  const deadline = "2:53 PM";

  return (
    <Shell><StatusBar />
      <div style={{ padding: "16px 20px 4px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", backgroundColor: "#f0a04b", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>Spot Held</div>
            <div style={{ fontSize: 13, color: "#888" }}>{experience}{resType ? ` · ${resType}` : ""}</div>
          </div>
        </div>
      </div>

      <div style={{ padding: "12px 20px", flex: 1, overflowY: "auto", paddingBottom: 100 }}>
        <div style={{ padding: "14px 16px", borderRadius: 10, backgroundColor: "#fefce8", border: "1.5px solid #fde68a", marginBottom: 16 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: "#92400e" }}>Add players to your reservation</div>
          <div style={{ fontSize: 13, color: "#a16207", marginTop: 2 }}>You have until <span style={{ fontWeight: 700 }}>{deadline}</span> to finalize your group.</div>
        </div>

        <div style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700 }}>Players</div>
              <div style={{ fontSize: 12, color: "#aaa" }}>{spotsLeft} spot{spotsLeft !== 1 ? "s" : ""} remaining</div>
            </div>
            <button onClick={() => setShowAddGuest(!showAddGuest)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", backgroundColor: TEAL, border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, color: "white", cursor: "pointer" }}>
              <UserPlus /> Add Guest
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, border: "1.5px solid #ddd", borderRadius: 10, padding: "11px 14px", marginBottom: 6, backgroundColor: "#fafafa" }}>
            <SearchIcon />
            <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search players..." style={{ border: "none", outline: "none", fontSize: 16, flex: 1, backgroundColor: "transparent" }} />
            {searchQuery && <div onClick={() => setSearchQuery("")} style={{ cursor: "pointer" }}><XIcon size={14} /></div>}
          </div>
          <AnimateHeight show={searchQuery.length > 0}>
            <div style={{ border: "1px solid #e8e8e8", borderRadius: 10, backgroundColor: "white", marginBottom: 8, maxHeight: 180, overflowY: "auto", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
              {filteredPlayers.map((p) => (
                <div key={p.id} onClick={() => { if (spotsLeft > 0) { setPlayers([...players, p]); setSearchQuery(""); } }} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", cursor: spotsLeft > 0 ? "pointer" : "default", borderBottom: "1px solid #f5f5f5", opacity: spotsLeft > 0 ? 1 : 0.4 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{p.name}</div>
                    {p.phone4 && <div style={{ fontSize: 11, color: "#aaa", marginTop: 1 }}>(•••) •••-{p.phone4}</div>}
                  </div>
                </div>
              ))}
              {filteredPlayers.length === 0 && <div style={{ fontSize: 14, color: "#aaa", textAlign: "center", padding: 16 }}>No players found</div>}
            </div>
          </AnimateHeight>

          <AnimateHeight show={showAddGuest}>
            <div style={{ border: "1px solid #e8e8e8", borderRadius: 10, padding: 16, marginBottom: 8, marginTop: 8, backgroundColor: "#fafafa", overflow: "hidden" }}>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 10 }}>Add a Guest</div>
              <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <input value={guestFirst} onChange={(e) => setGuestFirst(e.target.value)} placeholder="First name" style={{ flex: 1, minWidth: 0, boxSizing: "border-box", border: "1.5px solid #ddd", borderRadius: 10, padding: "11px 14px", fontSize: 16, outline: "none", backgroundColor: "white" }} />
                <input value={guestLast} onChange={(e) => setGuestLast(e.target.value)} placeholder="Last name" style={{ flex: 1, minWidth: 0, boxSizing: "border-box", border: "1.5px solid #ddd", borderRadius: 10, padding: "11px 14px", fontSize: 16, outline: "none", backgroundColor: "white" }} />
              </div>
              <input value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} placeholder="Guest email" style={{ width: "100%", boxSizing: "border-box", border: "1.5px solid #ddd", borderRadius: 10, padding: "11px 14px", fontSize: 16, marginBottom: 10, outline: "none", backgroundColor: "white" }} />
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => { setShowAddGuest(false); setGuestFirst(""); setGuestLast(""); setGuestEmail(""); }} style={{ flex: 1, padding: "11px", backgroundColor: "white", border: "1.5px solid #ddd", borderRadius: 10, fontSize: 14, fontWeight: 500, cursor: "pointer", color: "#666" }}>Cancel</button>
                <button onClick={() => { if (guestFirst && spotsLeft > 0) { setGuests([...guests, { name: [guestFirst, guestLast].filter(Boolean).join(" ") }]); setGuestFirst(""); setGuestLast(""); setGuestEmail(""); setShowAddGuest(false); } }} style={{ flex: 1, padding: "11px", backgroundColor: guestFirst && spotsLeft > 0 ? TEAL : "#e8e8e8", color: guestFirst && spotsLeft > 0 ? "white" : "#bbb", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: guestFirst && spotsLeft > 0 ? "pointer" : "default" }}>Add</button>
              </div>
            </div>
          </AnimateHeight>

          <div style={{ borderTop: "1px solid #f0f0f0", marginTop: 8, paddingTop: 4 }}>
            <PlayerRow name="Josh Weese" tag="You" />
            {players.map((p, idx) => (
              <PlayerRow key={p.id} name={p.name} phone4={p.phone4} peek={idx === players.length - 1} onRemove={() => setPlayers(players.filter((x) => x.id !== p.id))} />
            ))}
            {guests.map((g, i) => (
              <PlayerRow key={"g" + i} name={g.name} peek={i === guests.length - 1} onRemove={() => setGuests(guests.filter((_, idx) => idx !== i))} />
            ))}
          </div>
        </div>
      </div>

      <div style={{ position: "fixed", bottom: 0, left: 0, width: "100%", padding: "12px 20px 28px", backgroundColor: "white", borderTop: "1px solid #e8e8e8", boxSizing: "border-box" }}>
        <button onClick={onDone} style={{ width: "100%", padding: "16px", backgroundColor: TEAL, color: "white", border: "none", borderRadius: 10, fontSize: 17, fontWeight: 600, cursor: "pointer" }}>
          {`Reserve — $${displayTotal}`}
        </button>
      </div>
    </Shell>
  );
}

// ─── Main Reservation Flow ──────────────────────────────────────────────────
function ReservationFlow({ onCalendar, prefill, payMode = 0, lockout = false }) {
  const [experience, setExperience] = useState(prefill ? prefill.experience : null);
  const [courtType, setCourtType] = useState(prefill ? prefill.courtType : null);
  const [selectedCourts, setSelectedCourts] = useState(prefill ? [prefill.court] : []);
  const [courtQty, setCourtQty] = useState(1);
  const [resType, setResType] = useState(prefill ? prefill.resType : null);
  const [duration, setDuration] = useState("1 hr");
  const [selDay, setSelDay] = useState(prefill ? prefill.dayIndex : null);
  const [selTime, setSelTime] = useState(prefill ? prefill.time : null);
  const hr = new Date().getHours();
  const [morningOpen, setMorningOpen] = useState(hr < 12);
  const [afternoonOpen, setAfternoonOpen] = useState(hr >= 12 && hr < 17);
  const [eveningOpen, setEveningOpen] = useState(hr >= 17);
  const [players, setPlayers] = useState([]);
  const [guests, setGuests] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddGuest, setShowAddGuest] = useState(false);
  const [guestFirst, setGuestFirst] = useState("");
  const [guestLast, setGuestLast] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [editWhat, setEditWhat] = useState(false);
  const [editWhen, setEditWhen] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [addons, setAddons] = useState({ ballMachine: null, recording: false, extras: {} });
  const [playerPayChoice, setPlayerPayChoice] = useState("full");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showAddPlayers, setShowAddPlayers] = useState(false);

  const whenRef = useRef(null);
  const timeSlotsRef = useRef(null);
  const whoRef = useRef(null);
  const scrollTo = (ref, delay = 380) => {
    setTimeout(() => { ref.current?.scrollIntoView({ behavior: "smooth", block: "center" }); }, delay);
  };

  const fromCalendar = !!prefill;
  const courts = experience ? COURT_TYPES[experience] : [];
  const skipCourt = courts.length === 1;
  const effectiveCourt = skipCourt ? courts[0] : courtType;
  const resTypes = experience ? RES_TYPES[experience] : [];
  const skipRes = resTypes.length === 1;
  const effectiveRes = skipRes ? resTypes[0] : resType;
  const allWhatDone = experience && effectiveCourt && effectiveRes && !editWhat;
  const calWhenDone = fromCalendar && duration;
  const normWhenDone = !fromCalendar && duration && selDay !== null && selTime && !editWhen;
  const allWhenDone = calWhenDone || normWhenDone;
  const canReserve = allWhatDone && allWhenDone;

  const addonsConfig = effectiveRes ? ADDONS_CONFIG[effectiveRes] : null;
  const numCourts = selectedCourts.length > 0 ? selectedCourts.length : courtQty;

  const addonsSummary = () => {
    const p = [];
    if (addons.ballMachine) {
      const bm = addonsConfig?.ballMachines?.find((b) => b.id === addons.ballMachine);
      if (bm) p.push(bm.name);
    }
    if (addons.recording) p.push("Recording");
    (addonsConfig?.extras || []).forEach((ex) => { if (addons.extras[ex.id]) p.push(ex.name); });
    return p;
  };

  const addonTotal = () => {
    let t = 0;
    if (addons.ballMachine) {
      const bm = addonsConfig?.ballMachines?.find((b) => b.id === addons.ballMachine);
      if (bm) t += bm.price;
    }
    if (addons.recording) t += addonsConfig?.recording?.price || 0;
    (addonsConfig?.extras || []).forEach((ex) => { if (addons.extras[ex.id]) t += ex.price; });
    return t;
  };

  const hasCustomizations = () => {
    const ap = addonsSummary();
    return numCourts > 1 || selectedCourts.length > 0 || ap.length > 0;
  };

  const whatSub = () => {
    const parts = [effectiveCourt, effectiveRes].filter(Boolean);
    const courtCount = selectedCourts.length > 0 ? selectedCourts.length : courtQty;
    if (selectedCourts.length === 1) parts.push(selectedCourts[0]);
    else parts.push(`${courtCount} court${courtCount > 1 ? "s" : ""}`);
    const ap = addonsSummary();
    if (ap.length > 0) parts.push(`+${ap.length} add-on${ap.length > 1 ? "s" : ""}`);
    return parts.join(" · ");
  };

  const resetAll = () => {
    setSelectedCourts([]);
    setCourtQty(1);
    setAddons({ ballMachine: null, recording: false, extras: {} });
  };

  const durations = ["1 hr", "1 hr 30 min", "2 hrs", "2 hrs 30 min"];
  const days = [{ day: "Fri", num: 9 }, { day: "Sat", num: 10 }, { day: "Sun", num: 11 }, { day: "Mon", num: 12 }, { day: "Tue", num: 13 }, { day: "Wed", num: 14 }];
  const mSlots = ["08:00 AM", "08:15 AM", "08:30 AM", "08:45 AM", "09:30 AM", "10:15 AM", "10:30 AM", "10:45 AM"];
  const aSlots = ["12:00 PM", "12:30 PM", "1:00 PM", "2:00 PM", "3:00 PM"];
  const eSlots = ["5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM"];
  const filteredPlayers = PLAYERS.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()) && !players.find((s) => s.id === p.id));

  const getDisplayTotal = () => {
    const pCount = 1 + players.length + guests.length;
    const addonsAmt = addonTotal();
    const courtFeePerPlayer = 10 * numCourts;
    const effectiveMode = payMode === 3 ? (playerPayChoice === "split" ? 1 : 0) : payMode;
    if (effectiveMode === 0) { const cf = pCount * courtFeePerPlayer; const sub = cf + addonsAmt; const tax = sub * 0.06; return (sub + tax).toFixed(2); }
    else if (effectiveMode === 1) { const cf = pCount * courtFeePerPlayer; const sub = cf + addonsAmt; const tax = sub * 0.06; const tot = sub + tax; return (tot / pCount).toFixed(2); }
    else { const mySub = courtFeePerPlayer + addonsAmt; const myTax = mySub * 0.06; return (mySub + myTax).toFixed(2); }
  };

  const getDateTimeLabel = () => {
    if (fromCalendar) return `${prefill.date}, ${prefill.time}`;
    if (selDay !== null && selTime) return `${days[selDay].day} ${days[selDay].num}, ${selTime}`;
    return "";
  };

  const getCourtLabel = () => {
    if (selectedCourts.length > 0) return selectedCourts.join(", ");
    if (numCourts > 1) return `${numCourts} courts`;
    return null;
  };

  const prevWhatDone = useRef(allWhatDone);
  useEffect(() => { if (allWhatDone && !prevWhatDone.current) scrollTo(whenRef); prevWhatDone.current = allWhatDone; }, [allWhatDone]);
  const prevSelDay = useRef(selDay);
  useEffect(() => { if (selDay !== null && prevSelDay.current === null) scrollTo(timeSlotsRef); prevSelDay.current = selDay; }, [selDay]);
  const prevWhenDone = useRef(allWhenDone);
  useEffect(() => { if (allWhenDone && !prevWhenDone.current) scrollTo(whoRef); prevWhenDone.current = allWhenDone; }, [allWhenDone]);

  if (showAddPlayers) {
    return <AddPlayersScreen onDone={() => { setShowAddPlayers(false); setShowSuccess(true); }} experience={experience} resType={effectiveRes} courtLabel={getCourtLabel()} maxPlayers={4} />;
  }

  if (showSuccess) {
    return <SuccessScreen onDone={() => window.location.reload()} experience={experience} resType={effectiveRes} duration={duration} dateTime={getDateTimeLabel()} courtLabel={getCourtLabel()} players={players} guests={guests} total={getDisplayTotal()} />;
  }

  const pCount = 1 + players.length + guests.length;
  const addonsAmt = addonTotal();
  const addonParts = addonsSummary();
  const effectiveMode = payMode === 3 ? (playerPayChoice === "split" ? 1 : 0) : payMode;

  return (
    <Shell><StatusBar />
      <div style={{ padding: "20px 20px 4px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 24, fontWeight: 800 }}>Book Now</div>
          <button onClick={() => onCalendar(experience)} style={{ padding: "8px 16px", backgroundColor: "white", border: "1.5px solid #ddd", borderRadius: 8, fontSize: 13, fontWeight: 600, color: "#333", cursor: "pointer" }}>View Calendar</button>
        </div>
        <div style={{ fontSize: 14, color: "#777", marginTop: 4 }}>Reserve in a few short steps.</div>
      </div>

      <div style={{ padding: "16px 20px", flex: 1, overflowY: "auto", paddingBottom: 40 }}>
        {/* ── WHAT ── */}
        {allWhatDone ? (
          <FadeIn>
            <div style={{ ...cardStyle, padding: "18px 20px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
              <div onClick={fromCalendar ? undefined : () => setEditWhat(true)} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", cursor: fromCalendar ? "default" : "pointer" }}>
                <span style={{ fontSize: 16, color: "#888" }}>What</span>
                <div style={{ textAlign: "right", display: "flex", alignItems: "center", gap: 8 }}>
                  <div>
                    <div style={{ fontSize: 17, fontWeight: 700 }}>{experience}</div>
                    <div style={{ fontSize: 14, color: "#888" }}>{whatSub()}</div>
                  </div>
                  {!fromCalendar && <ChevronDown size={16} color="#aaa" />}
                </div>
              </div>
              <div onClick={() => setShowCustomize(true)} style={{ display: "flex", alignItems: "center", gap: 6, paddingTop: 12, marginTop: 12, borderTop: "1px solid #f0f0f0", cursor: "pointer" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={TEAL} strokeWidth="2"><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                <span style={{ fontSize: 14, color: TEAL, fontWeight: 500 }}>{hasCustomizations() ? "Edit courts & add-ons" : "Courts, add-ons & more"}</span>
              </div>
            </div>
          </FadeIn>
        ) : (
          <div style={cardStyle}>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>What</div>
            <SectionRow label="Experience" value={experience || undefined} chevron={!experience ? "up" : "down"} onClick={experience ? () => { setExperience(null); setCourtType(null); setResType(null); resetAll(); } : undefined} />
            <AnimateHeight show={!experience}>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, padding: "12px 0" }}>
                <Chip label="Book Pickleball" onClick={() => { setExperience("Pickleball"); setCourtType(null); setResType(null); resetAll(); }} />
                <Chip label="Book Tennis" onClick={() => { setExperience("Tennis"); setCourtType(null); setResType(null); resetAll(); }} />
              </div>
            </AnimateHeight>
            <SectionRow label="Court Type" value={effectiveCourt || undefined} chevron={experience && !skipCourt && !courtType ? "up" : "down"} onClick={courtType && !skipCourt ? () => { setCourtType(null); setResType(null); resetAll(); } : undefined} />
            <AnimateHeight show={!!experience && !skipCourt && !courtType}>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, padding: "12px 0" }}>
                {courts.map((c) => <Chip key={c} label={c} onClick={() => { setCourtType(c); resetAll(); }} />)}
              </div>
            </AnimateHeight>
            <SectionRow label="Reservation Type" value={effectiveRes || undefined} chevron={experience && (skipCourt || courtType) && !skipRes && !resType ? "up" : "down"} onClick={effectiveRes && !skipRes ? () => { setResType(null); resetAll(); } : undefined} />
            <AnimateHeight show={!!experience && (skipCourt || !!courtType) && !skipRes && !resType}>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingBottom: 8, paddingTop: 12 }}>
                {resTypes.map((r) => <Chip key={r} label={r} onClick={() => { setResType(r); setEditWhat(false); resetAll(); }} />)}
              </div>
            </AnimateHeight>
          </div>
        )}

        {/* ── WHEN ── */}
        <div ref={whenRef}>
          {fromCalendar && allWhatDone ? (
            allWhenDone ? (
              <FadeIn><SummaryRow label="When" value={`${prefill.date}, ${prefill.time}`} sub={`${selectedCourts.join(", ")} · ${duration}`} /></FadeIn>
            ) : (
              <FadeIn onMount>
                <div style={cardStyle}>
                  <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 14 }}>When</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0 14px", borderBottom: "1px solid #f0f0f0" }}>
                    <span style={{ fontSize: 15, color: "#666" }}>Date & Time</span>
                    <span style={{ fontSize: 15, fontWeight: 600 }}>{prefill.date}, {prefill.time}</span>
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 600, marginTop: 14, marginBottom: 10 }}>Duration</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    {durations.map((d) => <Chip key={d} label={d} selected={duration === d} onClick={() => setDuration(d)} />)}
                  </div>
                </div>
              </FadeIn>
            )
          ) : !allWhatDone ? (
            <div style={disabledCardStyle}>
              <span style={{ fontSize: 16, color: "#666" }}>When</span>
              <span style={{ fontSize: 15, fontWeight: 600, color: "#aaa" }}>Select a date</span>
            </div>
          ) : allWhenDone ? (
            <FadeIn><SummaryRow label="When" value={`${days[selDay].day} ${days[selDay].num}, ${selTime}`} sub={duration} onClick={() => setEditWhen(true)} /></FadeIn>
          ) : allWhatDone ? (
            <FadeIn onMount>
              <div style={cardStyle}>
                <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 14 }}>When</div>
                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 10 }}>Duration</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 18 }}>
                  {durations.map((d) => <Chip key={d} label={d} selected={duration === d} onClick={() => setDuration(d)} />)}
                </div>
                <AnimateHeight show={!!duration}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                    <span style={{ fontSize: 16, fontWeight: 700 }}>September 2025</span>
                    <div style={{ display: "flex", gap: 4, marginLeft: "auto" }}>
                      <div style={{ cursor: "pointer", padding: 4 }}><ChevronLeft size={18} /></div>
                      <div style={{ cursor: "pointer", padding: 4 }}><ChevronRight size={18} /></div>
                    </div>
                    <button style={{ padding: "6px 14px", border: "1.5px solid #ddd", borderRadius: 8, backgroundColor: "white", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>Today</button>
                  </div>
                  <div style={{ display: "flex", gap: 6, marginBottom: 18 }}>
                    {days.map((d, i) => (
                      <div key={i} onClick={() => setSelDay(i)} style={{ flex: 1, textAlign: "center", padding: "8px 2px", borderRadius: 10, border: selDay === i ? "2px solid #333" : "1.5px solid transparent", cursor: "pointer", transition: "all 0.15s ease" }}>
                        <div style={{ fontSize: 13, color: "#666", fontWeight: 500 }}>{d.day}</div>
                        <div style={{ fontSize: 17, fontWeight: 600 }}>{d.num}</div>
                      </div>
                    ))}
                  </div>
                </AnimateHeight>
                <div ref={timeSlotsRef}>
                  <AnimateHeight show={selDay !== null}>
                    <div style={{ borderTop: "1px solid #eee", paddingTop: 14 }}>
                      <div onClick={() => setMorningOpen(!morningOpen)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", marginBottom: morningOpen ? 12 : 4 }}>
                        <span style={{ fontSize: 16, fontWeight: 600 }}>Morning</span>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontSize: 13, color: "#888" }}>{mSlots.length} slots</span>
                          {morningOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </div>
                      </div>
                      <AnimateHeight show={morningOpen}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
                          {mSlots.map((s) => <Chip key={s} label={s} small selected={selTime === s} onClick={() => { setSelTime(s); setEditWhen(false); }} />)}
                        </div>
                      </AnimateHeight>
                    </div>
                    <div style={{ borderTop: "1px solid #eee", paddingTop: 14 }}>
                      <div onClick={() => setAfternoonOpen(!afternoonOpen)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", marginBottom: afternoonOpen ? 12 : 4 }}>
                        <span style={{ fontSize: 16, fontWeight: 600 }}>Afternoon</span>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontSize: 13, color: "#888" }}>{aSlots.length} slots</span>
                          {afternoonOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </div>
                      </div>
                      <AnimateHeight show={afternoonOpen}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
                          {aSlots.map((s) => <Chip key={s} label={s} small selected={selTime === s} onClick={() => { setSelTime(s); setEditWhen(false); }} />)}
                        </div>
                      </AnimateHeight>
                    </div>
                    <div style={{ borderTop: "1px solid #eee", paddingTop: 14, marginTop: 4 }}>
                      <div onClick={() => setEveningOpen(!eveningOpen)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", marginBottom: eveningOpen ? 12 : 0 }}>
                        <span style={{ fontSize: 16, fontWeight: 600 }}>Evening</span>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontSize: 13, color: "#888" }}>{eSlots.length} slots</span>
                          {eveningOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </div>
                      </div>
                      <AnimateHeight show={eveningOpen}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, paddingBottom: 4 }}>
                          {eSlots.map((s) => <Chip key={s} label={s} small selected={selTime === s} onClick={() => { setSelTime(s); setEditWhen(false); }} />)}
                        </div>
                      </AnimateHeight>
                    </div>
                  </AnimateHeight>
                </div>
              </div>
            </FadeIn>
          ) : null}
        </div>

        {/* ── WHO ── */}
        <div ref={whoRef}>
          {!allWhatDone || !allWhenDone ? (
            <div style={disabledCardStyle}>
              <span style={{ fontSize: 16, color: "#666" }}>Who</span>
              <span style={{ fontSize: 15, fontWeight: 600, color: "#aaa" }}>Add players</span>
            </div>
          ) : (
            <FadeIn onMount>
              {lockout ? (
                <div style={cardStyle}>
                  <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Who</div>
                  <div style={{ fontSize: 13, color: "#888", marginBottom: 12, padding: "10px 14px", backgroundColor: "#fefce8", border: "1.5px solid #fde68a", borderRadius: 8 }}>
                    You'll add players after reserving your spot.
                  </div>
                  <PlayerRow name="Josh Weese" tag="You" />
                  <div style={{ borderTop: "1.5px solid #e0e0e0", marginTop: 8, paddingTop: 10 }}>
                    <PricingSection
                      pCount={1} numCourts={numCourts} addonsAmt={addonsAmt}
                      addonParts={addonParts} effectiveMode={effectiveMode} payMode={payMode}
                      playerPayChoice={playerPayChoice} setPlayerPayChoice={setPlayerPayChoice}
                      addonsConfig={addonsConfig} addons={addons} setAddons={setAddons}
                    />
                  </div>
                </div>
              ) : (
                <div style={cardStyle}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <span style={{ fontSize: 18, fontWeight: 700 }}>Who</span>
                    <button onClick={() => setShowAddGuest(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", backgroundColor: TEAL, border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, color: "white", cursor: "pointer" }}>
                      <UserPlus /> Add Guest
                    </button>
                  </div>
                  <div style={{ height: 8 }} />

                  <AnimateHeight show={true}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, border: "1.5px solid #ddd", borderRadius: 10, padding: "11px 14px", marginBottom: 6, backgroundColor: "#fafafa" }}>
                      <SearchIcon />
                      <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search players..." style={{ border: "none", outline: "none", fontSize: 16, flex: 1, backgroundColor: "transparent" }} />
                      {searchQuery && <div onClick={() => setSearchQuery("")} style={{ cursor: "pointer" }}><XIcon size={14} /></div>}
                    </div>
                    <AnimateHeight show={searchQuery.length > 0}>
                      <div style={{ border: "1px solid #e8e8e8", borderRadius: 10, backgroundColor: "white", marginBottom: 8, maxHeight: 180, overflowY: "auto", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
                        {filteredPlayers.map((p) => (
                          <div key={p.id} onClick={() => { setPlayers([...players, p]); setSearchQuery(""); }} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", cursor: "pointer", borderBottom: "1px solid #f5f5f5" }}>
                            <div>
                              <div style={{ fontSize: 14, fontWeight: 500 }}>{p.name}</div>
                              {p.phone4 && <div style={{ fontSize: 11, color: "#aaa", marginTop: 1 }}>(•••) •••-{p.phone4}</div>}
                            </div>
                          </div>
                        ))}
                        {filteredPlayers.length === 0 && <div style={{ fontSize: 14, color: "#aaa", textAlign: "center", padding: 16 }}>No players found</div>}
                      </div>
                    </AnimateHeight>
                    <AnimateHeight show={showAddGuest}>
                      <div style={{ border: "1px solid #e8e8e8", borderRadius: 10, padding: 16, marginBottom: 8, marginTop: 8, backgroundColor: "#fafafa", overflow: "hidden" }}>
                        <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 10 }}>Add a Guest</div>
                        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                          <input value={guestFirst} onChange={(e) => setGuestFirst(e.target.value)} placeholder="First name" style={{ flex: 1, minWidth: 0, boxSizing: "border-box", border: "1.5px solid #ddd", borderRadius: 10, padding: "11px 14px", fontSize: 16, outline: "none", backgroundColor: "white" }} />
                          <input value={guestLast} onChange={(e) => setGuestLast(e.target.value)} placeholder="Last name" style={{ flex: 1, minWidth: 0, boxSizing: "border-box", border: "1.5px solid #ddd", borderRadius: 10, padding: "11px 14px", fontSize: 16, outline: "none", backgroundColor: "white" }} />
                        </div>
                        <input value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} placeholder="Guest email" style={{ width: "100%", boxSizing: "border-box", border: "1.5px solid #ddd", borderRadius: 10, padding: "11px 14px", fontSize: 16, marginBottom: 10, outline: "none", backgroundColor: "white" }} />
                        <div style={{ display: "flex", gap: 8 }}>
                          <button onClick={() => { setShowAddGuest(false); setGuestFirst(""); setGuestLast(""); setGuestEmail(""); }} style={{ flex: 1, padding: "11px", backgroundColor: "white", border: "1.5px solid #ddd", borderRadius: 10, fontSize: 14, fontWeight: 500, cursor: "pointer", color: "#666" }}>Cancel</button>
                          <button onClick={() => { if (guestFirst) { const fullName = [guestFirst, guestLast].filter(Boolean).join(" "); setGuests([...guests, { name: fullName, owner: "you" }]); setGuestFirst(""); setGuestLast(""); setGuestEmail(""); setShowAddGuest(false); } }} style={{ flex: 1, padding: "11px", backgroundColor: guestFirst ? TEAL : "#e8e8e8", color: guestFirst ? "white" : "#bbb", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: guestFirst ? "pointer" : "default" }}>Add</button>
                        </div>
                      </div>
                    </AnimateHeight>
                    <div style={{ marginTop: 8 }}>
                      <PlayerRow name="Josh Weese" tag="You" />
                      {players.map((p, idx) => (
                        <PlayerRow key={p.id} name={p.name} phone4={p.phone4} peek={idx === players.length - 1} onRemove={() => setPlayers(players.filter((x) => x.id !== p.id))} />
                      ))}
                      {guests.map((g, i) => (
                        <PlayerRow key={"g" + i} name={g.name} peek={i === guests.length - 1} onRemove={() => setGuests(guests.filter((_, idx) => idx !== i))} />
                      ))}
                    </div>
                  </AnimateHeight>

                  <div style={{ borderTop: "1.5px solid #e0e0e0", marginTop: 8, paddingTop: 10 }}>
                    <PricingSection
                      pCount={pCount} numCourts={numCourts} addonsAmt={addonsAmt}
                      addonParts={addonParts} effectiveMode={effectiveMode} payMode={payMode}
                      playerPayChoice={playerPayChoice} setPlayerPayChoice={setPlayerPayChoice}
                      addonsConfig={addonsConfig} addons={addons} setAddons={setAddons}
                    />
                  </div>
                </div>
              )}
            </FadeIn>
          )}
        </div>

        <ReservationFooter disabled={!canReserve} total={canReserve ? getDisplayTotal() : "0.00"} onReserve={() => { if (lockout) setShowAddPlayers(true); else setShowSuccess(true); }} lockoutLabel={lockout ? "continue" : null} />
      </div>

      {showCustomize && (
        <CustomizeSheet
          experience={experience} addonsConfig={addonsConfig}
          selectedCourts={selectedCourts} setSelectedCourts={setSelectedCourts}
          courtQty={courtQty} setCourtQty={setCourtQty}
          addons={addons} setAddons={setAddons}
          onClose={() => setShowCustomize(false)}
        />
      )}
    </Shell>
  );
}

// ─── Phone Frame ─────────────────────────────────────────────────────────────
function PhoneFrame({ children }) {
  return (
    <div style={{
      width: 390, height: 844, borderRadius: 44,
      border: "6px solid #1a1a1a", backgroundColor: "#1a1a1a",
      overflow: "hidden", position: "relative", flexShrink: 0,
      boxShadow: "0 20px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.05)",
    }}>
      <div style={{
        position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
        width: 160, height: 28, backgroundColor: "#1a1a1a",
        borderRadius: "0 0 20px 20px", zIndex: 20,
      }} />
      <div style={{ width: "100%", height: "100%", overflow: "hidden", borderRadius: 38 }}>
        <div style={{ width: "100%", height: "100%", overflowY: "auto", transform: "translateZ(0)" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

// ─── Root App ────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("reserve");
  const [calExp, setCalExp] = useState(null);
  const [prefill, setPrefill] = useState(null);

  const goCalendar = (exp) => {
    if (exp) { setCalExp(exp); setScreen("calendar"); }
    else setScreen("expPicker");
  };

  const handleReserveSlot = (slot) => {
    const exp = calExp;
    const cts = COURT_TYPES[exp];
    const ct = cts.length === 1 ? cts[0] : slot.courtType;
    const rt = RES_TYPES[exp];
    setPrefill({
      experience: exp, courtType: ct,
      resType: rt.length === 1 ? rt[0] : null,
      court: slot.court, time: slot.time, date: slot.date, dayIndex: 4,
    });
    setScreen("reserve");
  };

  let content;
  if (screen === "expPicker") content = <ExperiencePicker onBack={() => setScreen("reserve")} onSelect={(exp) => { setCalExp(exp); setScreen("calendar"); }} />;
  else if (screen === "calendar") content = <CalendarScreen onBack={() => { setPrefill(null); setScreen("reserve"); }} experience={calExp} onReserveSlot={handleReserveSlot} />;
  else content = <ReservationFlow onCalendar={goCalendar} prefill={prefill} payMode={0} lockout={false} />;

  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "32px 24px", minHeight: "100vh", backgroundColor: "#111", fontFamily: FONT }}>
      <PhoneFrame>{content}</PhoneFrame>
    </div>
  );
}
