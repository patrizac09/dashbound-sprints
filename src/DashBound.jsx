import { useState, useEffect, useCallback } from "react";

// ── DATA ──────────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: "nieve",    label: "Nieve",    emoji: "❄️", desc: "Snowboards · Esquís · Bastones",          img: "https://images.unsplash.com/photo-1548777123-e216912df7d8?w=800&q=85" },
  { id: "montana",  label: "Montaña",  emoji: "⛰️", desc: "Carpas técnicas · Mochilas de expedición", img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=85" },
  { id: "escalada", label: "Escalada", emoji: "🧗", desc: "Arneses · Cuerdas · Pies de gato",         img: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=85" },
  { id: "agua",     label: "Agua",     emoji: "🌊", desc: "Kitesurf · Kayaks · Neoprene",             img: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&q=85" },
];

const PRODUCTS_RAW = [
  { id: 1,  cat: "Nieve",    name: "Snowboard Freeride Pro",         desc: "Tabla directional con flex medio, ideal para nieve virgen y fuera de pista.",          price: 4200, img: "https://images.unsplash.com/photo-1518364538800-6bae3c2ea0f2?w=400&q=80",  featureIds: [1,2,5,8] },
  { id: 2,  cat: "Nieve",    name: "Esquís Carving Twin",            desc: "Esquís de carving clásico, torsión alta y rebote rápido en pistas duras.",             price: 3800, img: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&q=80",  featureIds: [1,5,6] },
  { id: 3,  cat: "Nieve",    name: "Bastones Carbono K2",            desc: "Bastones ultraligeros con empuñadura ergonómica y anillo para powder.",                price: 650,  img: "https://images.unsplash.com/photo-1547234935-80c7145ec969?w=400&q=80",  featureIds: [2,4,6] },
  { id: 4,  cat: "Montaña",  name: "Carpa Técnica 3 Estaciones",     desc: "Doble capa, 1.8 kg, soporta vientos de hasta 80 km/h en campamentos de altura.",      price: 5500, img: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&q=80",  featureIds: [1,2,5,7] },
  { id: 5,  cat: "Montaña",  name: "Mochila Expedición 75 L",        desc: "Sistema de soporte adaptable, bolsillos de acceso rápido y cubierta lluvia incluida.", price: 3200, img: "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&q=80",  featureIds: [1,2,4,7] },
  { id: 6,  cat: "Montaña",  name: "Saco de Dormir -15°C",           desc: "Relleno de plumón 800fp, compresión extrema, peso 980 g.",                            price: 2800, img: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=400&q=80",  featureIds: [2,5,6] },
  { id: 7,  cat: "Escalada", name: "Arnés Climbing Evo",             desc: "Arnés deportivo con ajuste en piernas y cadera, certificación UIAA.",                 price: 1200, img: "https://images.unsplash.com/photo-1522163182402-834f871fd851?w=400&q=80",  featureIds: [3,4,5,6] },
  { id: 8,  cat: "Escalada", name: "Cuerda Dinámica 60 m",           desc: "10.2 mm, dry-treatment, aprobada UIAA para escalada deportiva y aventura.",           price: 1800, img: "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=400&q=80",  featureIds: [3,5] },
  { id: 9,  cat: "Escalada", name: "Pies de Gato Performance",       desc: "Puntera asimétrica, suela Vibram XS Grip2, cierre velcro doble.",                     price: 1500, img: "https://images.unsplash.com/photo-1564415315949-7a0c4c73aab4?w=400&q=80",  featureIds: [3,4,5] },
  { id: 10, cat: "Agua",     name: "Tabla Kitesurf Twintip",         desc: "137×41 cm, construcción sandwich, ideal para freeride y trucos básicos.",              price: 4800, img: "https://images.unsplash.com/photo-1530053969600-caed2596d242?w=400&q=80",  featureIds: [1,5,8] },
  { id: 11, cat: "Agua",     name: "Kayak de Mar Touring",           desc: "Fibra de vidrio, 5.2 m, timón retráctil, compartimentos estancos proa/popa.",         price: 6200, img: "https://images.unsplash.com/photo-1474732132769-c3fb7d8d3a7e?w=400&q=80",  featureIds: [1,2,5,7] },
  { id: 12, cat: "Agua",     name: "Neoprene 3/2 mm Full",           desc: "Cierre chest-zip, costuras reforzadas, termoforro en pecho y espalda.",               price: 2100, img: "https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=400&q=80",  featureIds: [1,4,6] },
  { id: 13, cat: "Nieve",    name: "Casco Ski All-Mountain",         desc: "EPS certificado EN1077, ventilación ajustable, compatible con goggle.",               price: 900,  img: "https://images.unsplash.com/photo-1578763363228-6e8428de69b2?w=400&q=80",  featureIds: [3,5,6] },
  { id: 14, cat: "Montaña",  name: "Bastones Trekking Telescópicos", desc: "Aluminio 7075, puntas intercambiables, empuñadura corcho natural.",                   price: 780,  img: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=400&q=80",  featureIds: [2,4,6] },
  { id: 15, cat: "Escalada", name: "Set Fisureros + Excentricas",    desc: "10 piezas aluminio anodizado, includes bag de transporte.",                           price: 2200, img: "https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=400&q=80",  featureIds: [3,5,7] },
  { id: 16, cat: "Agua",     name: "Paddle Surf 10'6\" Inflable",    desc: "Drop-stitch de doble cámara, 15 PSI, kit bomba y correa incluidos.",                  price: 3500, img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80",  featureIds: [1,2,8] },
  { id: 17, cat: "Montaña",  name: "Gaiters Impermeables",           desc: "Gore-Tex, velcro + hebilla frontal, compatible con crampones.",                       price: 560,  img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80",  featureIds: [1,3,4] },
  { id: 18, cat: "Escalada", name: "Magnesera + 300 g Magnesio",     desc: "Bolsa de tela con cierre elástico, incluye bloque 300 g.",                            price: 320,  img: "https://images.unsplash.com/photo-1601142634808-38923eb7c560?w=400&q=80",  featureIds: [7,8] },
  { id: 19, cat: "Agua",     name: "Licra UV 50+ Manga Larga",       desc: "Poliéster reciclado, secado ultra-rápido, protección UPF 50+.",                       price: 480,  img: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=400&q=80",  featureIds: [2,6,8] },
  { id: 20, cat: "Nieve",    name: "Gafas Ski Espejo Revo",          desc: "Lente cilíndrica doble, ventilación anti-vaho, correa elástica 45 mm.",               price: 720,  img: "https://images.unsplash.com/photo-1605540436563-5bca919ae766?w=400&q=80",  featureIds: [4,6,8] },
];

const DEFAULT_FEATURES = [
  { id: 1, name: "Impermeable",        icon: "💧" },
  { id: 2, name: "Ultraligero",        icon: "🪶" },
  { id: 3, name: "Certificado UIAA",   icon: "✅" },
  { id: 4, name: "Ajuste ergonómico",  icon: "🔧" },
  { id: 5, name: "Alta resistencia",   icon: "💪" },
  { id: 6, name: "Talla universal",    icon: "📐" },
  { id: 7, name: "Incluye bolso",      icon: "🎒" },
  { id: 8, name: "Apto principiantes", icon: "⭐" },
];

const INITIAL_USERS = [
  { id: 1, nombre: "Admin", apellido: "DashBound", email: "admin@dashbound.com", password: "Admin123!", isAdmin: true },
];

const PAGE_SIZE = 10;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function validateEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }
function validatePassword(p) { return p.length >= 6; }
function validateName(n) { return n.trim().length >= 2; }

// ── ICONS ─────────────────────────────────────────────────────────────────────
const IconFB = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>;
const IconLI = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>;
const IconTW = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/></svg>;
const IconIG = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>;

// ── AVATAR + LOGOUT ───────────────────────────────────────────────────────────
function Avatar({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const initials = `${user.nombre[0]}${user.apellido[0]}`.toUpperCase();
  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => setOpen(o => !o)} style={{ width: "38px", height: "38px", borderRadius: "50%", background: "linear-gradient(135deg, #1DBEB4, #54547E)", border: "2px solid rgba(29,190,180,0.5)", color: "#fff", fontWeight: "800", fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {initials}
      </button>
      {open && (
        <div style={{ position: "absolute", top: "48px", right: 0, zIndex: 300, background: "#1e1e1f", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "0.75rem", minWidth: "190px", boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}>
          <div style={{ padding: "8px 12px", borderBottom: "1px solid rgba(255,255,255,0.07)", marginBottom: "6px" }}>
            <div style={{ color: "#fff", fontWeight: "700", fontSize: "14px" }}>{user.nombre} {user.apellido}</div>
            <div style={{ color: "#666", fontSize: "12px" }}>{user.email}</div>
            {user.isAdmin && <div style={{ color: "#1DBEB4", fontSize: "11px", fontWeight: "700", marginTop: "2px" }}>Administrador</div>}
          </div>
          <button onClick={() => { setOpen(false); onLogout(); }} style={{ width: "100%", background: "none", border: "none", color: "#e74c3c", fontSize: "13px", cursor: "pointer", padding: "8px 12px", borderRadius: "6px", textAlign: "left", transition: "background 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(231,76,60,0.1)"}
            onMouseLeave={e => e.currentTarget.style.background = "none"}
          >Cerrar sesión</button>
        </div>
      )}
    </div>
  );
}

// ── HEADER ────────────────────────────────────────────────────────────────────
function Header({ onHome, onLogin, onRegister, onAdmin, currentUser, onLogout }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: scrolled ? "rgba(20,20,21,0.97)" : "#1A1A1B", borderBottom: scrolled ? "1px solid rgba(29,190,180,0.2)" : "1px solid rgba(255,255,255,0.06)", backdropFilter: scrolled ? "blur(12px)" : "none", transition: "all 0.3s", padding: "0 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px" }}>
      <button onClick={onHome} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{ width: "40px", height: "40px", background: "linear-gradient(135deg, #1DBEB4, #54547E)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Georgia', serif", fontWeight: "bold", fontSize: "18px", color: "#fff", letterSpacing: "-1px", position: "relative", overflow: "hidden" }}>
          <span style={{ position: "relative", zIndex: 1 }}>Db</span>
          <div style={{ position: "absolute", top: "2px", left: "6px", width: "60%", height: "2px", background: "rgba(255,255,255,0.4)", transform: "rotate(-15deg)" }}/>
        </div>
        <div style={{ textAlign: "left" }}>
          <div style={{ fontWeight: "700", fontSize: "18px", color: "#fff", letterSpacing: "-0.3px" }}>Dash<span style={{ color: "#1DBEB4" }}>Bound</span></div>
          <div style={{ fontSize: "11px", color: "#888", letterSpacing: "0.3px" }}>Tu equipo para el próximo desafío</div>
        </div>
      </button>

      <nav style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        {currentUser?.isAdmin && (
          <button onClick={onAdmin} style={{ background: "none", border: "none", cursor: "pointer", color: "#1DBEB4", fontSize: "13px", padding: "6px 12px", borderRadius: "6px", transition: "background 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(29,190,180,0.1)"}
            onMouseLeave={e => e.currentTarget.style.background = "none"}
          >Panel Admin</button>
        )}
        {currentUser ? (
          <Avatar user={currentUser} onLogout={onLogout} />
        ) : (
          <>
            <button onClick={onRegister} style={{ background: "none", border: "1px solid rgba(84,84,126,0.6)", cursor: "pointer", color: "#bbb", fontSize: "13px", padding: "7px 16px", borderRadius: "8px", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#54547E"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(84,84,126,0.6)"; e.currentTarget.style.color = "#bbb"; }}
            >Crear cuenta</button>
            <button onClick={onLogin} style={{ background: "#1DBEB4", border: "none", cursor: "pointer", color: "#0d1a19", fontSize: "13px", fontWeight: "600", padding: "8px 18px", borderRadius: "8px", transition: "all 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.background = "#25d4ca"}
              onMouseLeave={e => e.currentTarget.style.background = "#1DBEB4"}
            >Iniciar sesión</button>
          </>
        )}
      </nav>
    </header>
  );
}

// ── REGISTER MODAL ────────────────────────────────────────────────────────────
function RegisterModal({ onClose, onSuccess, users }) {
  const [form, setForm] = useState({ nombre: "", apellido: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!validateName(form.nombre)) e.nombre = "Mínimo 2 caracteres.";
    if (!validateName(form.apellido)) e.apellido = "Mínimo 2 caracteres.";
    if (!validateEmail(form.email)) e.email = "Email inválido.";
    if (users.some(u => u.email === form.email)) e.email = "Este email ya está registrado.";
    if (!validatePassword(form.password)) e.password = "Mínimo 6 caracteres.";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    onSuccess({ id: Date.now(), ...form, isAdmin: false });
  };

  const inp = (err) => ({ width: "100%", background: "rgba(255,255,255,0.05)", border: `1px solid ${err ? "#e74c3c" : "rgba(255,255,255,0.1)"}`, borderRadius: "8px", padding: "10px 14px", color: "#fff", fontSize: "14px", outline: "none", boxSizing: "border-box" });

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }} onClick={onClose}>
      <div style={{ background: "#1e1e1f", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px", padding: "2.5rem", maxWidth: "440px", width: "100%", position: "relative" }} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} style={{ position: "absolute", top: "16px", right: "16px", background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: "20px" }}>✕</button>
        <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "linear-gradient(135deg, #1DBEB4, #54547E)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "18px", color: "#fff", marginBottom: "1.25rem" }}>Db</div>
        <h3 style={{ color: "#fff", fontWeight: "800", fontSize: "1.4rem", marginBottom: "0.25rem" }}>Crear cuenta</h3>
        <p style={{ color: "#666", fontSize: "13px", marginBottom: "1.5rem" }}>Completá tus datos para registrarte.</p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
          {[["nombre", "Nombre"], ["apellido", "Apellido"]].map(([k, l]) => (
            <div key={k}>
              <label style={{ display: "block", fontSize: "11px", color: "#888", marginBottom: "5px", fontWeight: "600" }}>{l}</label>
              <input value={form[k]} onChange={e => set(k, e.target.value)} placeholder={l} style={inp(errors[k])} />
              {errors[k] && <p style={{ color: "#e74c3c", fontSize: "11px", marginTop: "4px" }}>{errors[k]}</p>}
            </div>
          ))}
        </div>
        {[["email", "Email", "text", "ejemplo@correo.com"], ["password", "Contraseña", "password", "Mínimo 6 caracteres"]].map(([k, l, t, ph]) => (
          <div key={k} style={{ marginBottom: "12px" }}>
            <label style={{ display: "block", fontSize: "11px", color: "#888", marginBottom: "5px", fontWeight: "600" }}>{l}</label>
            <input type={t} value={form[k]} onChange={e => set(k, e.target.value)} placeholder={ph} style={inp(errors[k])} />
            {errors[k] && <p style={{ color: "#e74c3c", fontSize: "11px", marginTop: "4px" }}>{errors[k]}</p>}
          </div>
        ))}
        <button onClick={handleSubmit} style={{ width: "100%", background: "#1DBEB4", border: "none", cursor: "pointer", color: "#0d1a19", fontWeight: "700", fontSize: "15px", padding: "12px", borderRadius: "10px", marginTop: "8px" }}>Registrarme</button>
      </div>
    </div>
  );
}

// ── LOGIN MODAL ───────────────────────────────────────────────────────────────
function LoginModal({ onClose, onSuccess, users }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    setError("");
    if (!validateEmail(email)) { setError("Ingresá un email válido."); return; }
    if (!password) { setError("Ingresá tu contraseña."); return; }
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) { setError("Email o contraseña incorrectos. Verificá tus datos."); return; }
    onSuccess(user);
  };

  const inp = (err) => ({ width: "100%", background: "rgba(255,255,255,0.05)", border: `1px solid ${err ? "#e74c3c" : "rgba(255,255,255,0.1)"}`, borderRadius: "8px", padding: "10px 14px", color: "#fff", fontSize: "14px", outline: "none", boxSizing: "border-box" });

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }} onClick={onClose}>
      <div style={{ background: "#1e1e1f", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px", padding: "2.5rem", maxWidth: "400px", width: "100%", position: "relative" }} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} style={{ position: "absolute", top: "16px", right: "16px", background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: "20px" }}>✕</button>
        <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "linear-gradient(135deg, #1DBEB4, #54547E)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "18px", color: "#fff", marginBottom: "1.25rem" }}>Db</div>
        <h3 style={{ color: "#fff", fontWeight: "800", fontSize: "1.4rem", marginBottom: "0.25rem" }}>Iniciar sesión</h3>
        <p style={{ color: "#666", fontSize: "13px", marginBottom: "1.5rem" }}>Ingresá con tu cuenta de DashBound.</p>

        {error && <div style={{ background: "rgba(231,76,60,0.12)", border: "1px solid rgba(231,76,60,0.4)", borderRadius: "8px", padding: "10px 14px", marginBottom: "14px", color: "#e74c3c", fontSize: "13px", display: "flex", gap: "8px" }}><span>⚠</span><span>{error}</span></div>}

        <div style={{ marginBottom: "12px" }}>
          <label style={{ display: "block", fontSize: "11px", color: "#888", marginBottom: "5px", fontWeight: "600" }}>Email</label>
          <input type="text" value={email} onChange={e => setEmail(e.target.value)} placeholder="ejemplo@correo.com" style={inp(!!error)} />
        </div>
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", fontSize: "11px", color: "#888", marginBottom: "5px", fontWeight: "600" }}>Contraseña</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={inp(!!error)} onKeyDown={e => e.key === "Enter" && handleSubmit()} />
        </div>
        <button onClick={handleSubmit} style={{ width: "100%", background: "#1DBEB4", border: "none", cursor: "pointer", color: "#0d1a19", fontWeight: "700", fontSize: "15px", padding: "12px", borderRadius: "10px" }}>Iniciar sesión</button>
        <p style={{ color: "#555", fontSize: "12px", textAlign: "center", marginTop: "14px" }}>Admin demo: admin@dashbound.com / Admin123!</p>
      </div>
    </div>
  );
}

// ── HERO SEARCH ───────────────────────────────────────────────────────────────
function HeroSearch({ onSearch }) {
  const [sport, setSport] = useState("");
  const [dateOut, setDateOut] = useState("");
  const [dateBack, setDateBack] = useState("");

  return (
    <section style={{ minHeight: "100vh", paddingTop: "64px", background: "#1A1A1B", position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: `url("https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1400&q=60")`, backgroundSize: "cover", backgroundPosition: "center", opacity: 0.18 }}/>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 60%, rgba(29,190,180,0.08) 0%, transparent 70%)" }}/>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "200px", background: "linear-gradient(to bottom, transparent, #1A1A1B)" }}/>
      <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "2rem", maxWidth: "860px", width: "100%" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(29,190,180,0.12)", border: "1px solid rgba(29,190,180,0.3)", borderRadius: "100px", padding: "5px 14px", marginBottom: "1.5rem", fontSize: "12px", color: "#1DBEB4", fontWeight: "600", letterSpacing: "1px", textTransform: "uppercase" }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#1DBEB4", display: "inline-block" }}/>
          Equipamiento técnico certificado
        </div>
        <h1 style={{ fontSize: "clamp(2.4rem, 6vw, 4.2rem)", fontWeight: "800", color: "#fff", lineHeight: "1.1", marginBottom: "1rem", letterSpacing: "-1px" }}>
          Equipate para<br/><span style={{ color: "#1DBEB4" }}>la aventura</span>
        </h1>
        <p style={{ color: "#999", fontSize: "1.1rem", marginBottom: "2.5rem", lineHeight: "1.6" }}>Alquilá el mejor equipamiento deportivo sin complicaciones.<br/>Retirás, usás, devolvés.</p>
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", padding: "1.5rem", backdropFilter: "blur(20px)", display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: "12px", alignItems: "end" }}>
          {[
            { label: "Deporte / Equipo", placeholder: "Ej: Kayak, Snowboard…", val: sport, set: setSport, type: "text" },
            { label: "Fecha de salida", placeholder: "", val: dateOut, set: setDateOut, type: "date" },
            { label: "Fecha de regreso", placeholder: "", val: dateBack, set: setDateBack, type: "date" },
          ].map(f => (
            <div key={f.label}>
              <label style={{ display: "block", fontSize: "11px", color: "#1DBEB4", fontWeight: "600", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.8px" }}>{f.label}</label>
              <input type={f.type} placeholder={f.placeholder} value={f.val} onChange={e => f.set(e.target.value)} style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "8px", padding: "10px 12px", color: "#fff", fontSize: "14px", outline: "none", boxSizing: "border-box", colorScheme: "dark" }} />
            </div>
          ))}
          <button onClick={() => onSearch({ sport, dateOut, dateBack })} style={{ background: "#1DBEB4", border: "none", cursor: "pointer", color: "#0d1a19", fontWeight: "700", fontSize: "15px", padding: "11px 28px", borderRadius: "8px", whiteSpace: "nowrap", transition: "all 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.background = "#25d4ca"}
            onMouseLeave={e => e.currentTarget.style.background = "#1DBEB4"}
          >Explorar</button>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: "3rem", marginTop: "2rem" }}>
          {[["500+", "Productos"], ["4", "Categorías"], ["48hs", "Entrega"]].map(([n, l]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "1.5rem", fontWeight: "800", color: "#1DBEB4" }}>{n}</div>
              <div style={{ fontSize: "12px", color: "#666", marginTop: "2px" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── CATEGORIES ────────────────────────────────────────────────────────────────
function CategoriesSection() {
  return (
    <section style={{ background: "#111213", padding: "5rem 2rem" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <p style={{ color: "#1DBEB4", fontSize: "12px", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "0.75rem" }}>Explorá por deporte</p>
          <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: "800", color: "#fff", margin: 0 }}>Categorías</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px" }}>
          {CATEGORIES.map(cat => (
            <div key={cat.id} style={{ borderRadius: "16px", overflow: "hidden", position: "relative", cursor: "pointer", aspectRatio: "3/4", transition: "transform 0.3s" }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-6px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
            >
              <img src={cat.img} alt={cat.label} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}/>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)" }}/>
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "1.5rem" }}>
                <div style={{ fontSize: "28px", marginBottom: "4px" }}>{cat.emoji}</div>
                <h3 style={{ color: "#fff", fontWeight: "800", fontSize: "1.4rem", margin: "0 0 4px" }}>{cat.label}</h3>
                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "13px", margin: 0 }}>{cat.desc}</p>
                <div style={{ display: "inline-block", marginTop: "12px", background: "#1DBEB4", color: "#0d1a19", fontSize: "11px", fontWeight: "700", padding: "4px 12px", borderRadius: "100px" }}>Ver equipos →</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── PRODUCT CARD ──────────────────────────────────────────────────────────────
function ProductCard({ p, onDetail }) {
  const catColors = { Nieve: "#7EC8E3", Montaña: "#A8D5A2", Escalada: "#F4A460", Agua: "#1DBEB4" };
  return (
    <div style={{ background: "#1e1e1f", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "14px", overflow: "hidden", transition: "all 0.25s", cursor: "pointer" }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(29,190,180,0.35)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      <div style={{ position: "relative", overflow: "hidden", height: "220px" }}>
        <img src={p.img} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.4s" }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
        />
        <div style={{ position: "absolute", top: "10px", left: "10px", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)", borderRadius: "100px", padding: "3px 10px", fontSize: "11px", fontWeight: "700", color: catColors[p.cat] || "#1DBEB4" }}>{p.cat}</div>
      </div>
      <div style={{ padding: "1rem" }}>
        <h4 style={{ color: "#fff", fontWeight: "700", fontSize: "14px", margin: "0 0 6px", lineHeight: "1.3" }}>{p.name}</h4>
        <p style={{ color: "#777", fontSize: "12px", margin: "0 0 12px", lineHeight: "1.5" }}>{p.desc}</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#1DBEB4", fontWeight: "800", fontSize: "16px" }}>${p.price.toLocaleString("es-AR")}<span style={{ color: "#555", fontSize: "11px", fontWeight: "400" }}>/día</span></span>
          <button onClick={() => onDetail && onDetail(p)} style={{ background: "rgba(29,190,180,0.12)", border: "1px solid rgba(29,190,180,0.3)", color: "#1DBEB4", fontSize: "12px", fontWeight: "600", padding: "5px 12px", borderRadius: "6px", cursor: "pointer", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#1DBEB4"; e.currentTarget.style.color = "#0d1a19"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(29,190,180,0.12)"; e.currentTarget.style.color = "#1DBEB4"; }}
          >Ver detalle</button>
        </div>
      </div>
    </div>
  );
}

// ── PRODUCTS SECTION ──────────────────────────────────────────────────────────
function ProductsSection({ onDetail }) {
  const [products] = useState(() => shuffle(PRODUCTS_RAW));
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(products.length / PAGE_SIZE);
  const start = (page - 1) * PAGE_SIZE;
  const slice = products.slice(start, start + PAGE_SIZE);
  const btnStyle = (active) => ({ background: active ? "#1DBEB4" : "rgba(255,255,255,0.05)", border: `1px solid ${active ? "#1DBEB4" : "rgba(255,255,255,0.1)"}`, color: active ? "#0d1a19" : "#aaa", fontWeight: active ? "700" : "400", fontSize: "13px", padding: "7px 14px", borderRadius: "8px", cursor: active ? "default" : "pointer", transition: "all 0.2s" });

  return (
    <section style={{ background: "#1A1A1B", padding: "5rem 2rem" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <p style={{ color: "#1DBEB4", fontSize: "12px", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "0.5rem" }}>Selección aleatoria</p>
            <h2 style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)", fontWeight: "800", color: "#fff", margin: 0 }}>Productos recomendados</h2>
          </div>
          <p style={{ color: "#555", fontSize: "13px" }}>Mostrando {start + 1}–{Math.min(start + PAGE_SIZE, products.length)} de {products.length}</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "3rem" }}>
          {slice.map(p => <ProductCard key={p.id} p={p} onDetail={onDetail} />)}
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: "8px", flexWrap: "wrap" }}>
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)} style={{ ...btnStyle(false), opacity: page === 1 ? 0.3 : 1, cursor: page === 1 ? "not-allowed" : "pointer" }}>← Anterior</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => <button key={n} onClick={() => setPage(n)} style={btnStyle(n === page)}>{n}</button>)}
          <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} style={{ ...btnStyle(false), opacity: page === totalPages ? 0.3 : 1, cursor: page === totalPages ? "not-allowed" : "pointer" }}>Siguiente →</button>
        </div>
      </div>
    </section>
  );
}

// ── PRODUCT DETAIL ────────────────────────────────────────────────────────────
function ProductDetail({ product, onBack, features }) {
  const catColors = { Nieve: "#7EC8E3", Montaña: "#A8D5A2", Escalada: "#F4A460", Agua: "#1DBEB4" };
  const color = catColors[product.cat] || "#1DBEB4";
  // Mostrar solo las características asociadas al producto
  const productFeatures = features.filter(f => (product.featureIds || []).includes(f.id));

  return (
    <div style={{ minHeight: "100vh", background: "#1A1A1B", paddingTop: "64px" }}>
      <div style={{ width: "100%", background: "#111213", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "1.25rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <span style={{ background: "rgba(0,0,0,0.4)", border: `1px solid ${color}40`, borderRadius: "100px", padding: "3px 12px", fontSize: "12px", fontWeight: "700", color }}>{product.cat}</span>
          <h1 style={{ color: "#fff", fontWeight: "800", fontSize: "clamp(1.1rem, 3vw, 1.6rem)", margin: 0 }}>{product.name}</h1>
        </div>
        <button onClick={onBack} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "10px", padding: "8px 18px", color: "#ccc", fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", transition: "all 0.2s", whiteSpace: "nowrap" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "#1DBEB4"; e.currentTarget.style.color = "#1DBEB4"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "#ccc"; }}
        >← Volver</button>
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "3rem 2rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "start" }}>
          <div>
            <div style={{ borderRadius: "20px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)", marginBottom: "16px" }}>
              <img src={product.img} alt={product.name} style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", display: "block" }}/>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
              {[product.img, product.img, product.img].map((src, i) => (
                <div key={i} style={{ borderRadius: "10px", overflow: "hidden", border: i === 0 ? `2px solid ${color}` : "1px solid rgba(255,255,255,0.08)", cursor: "pointer" }}>
                  <img src={src} alt="" style={{ width: "100%", aspectRatio: "1", objectFit: "cover", display: "block" }}/>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={{ background: "#1e1e1f", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "20px", padding: "2rem", marginBottom: "1.5rem" }}>
              <p style={{ color: "#1DBEB4", fontSize: "12px", fontWeight: "700", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "0.75rem" }}>Descripción del producto</p>
              <p style={{ color: "#ccc", fontSize: "16px", lineHeight: "1.8", marginBottom: "2rem" }}>{product.desc} Este equipo está diseñado para deportistas que exigen rendimiento en condiciones extremas. Certificado y revisado por nuestro equipo técnico antes de cada alquiler.</p>
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: "1.5rem", marginBottom: "1.5rem" }}>
                {[["Categoría", product.cat], ["Precio por día", `$${product.price.toLocaleString("es-AR")} ARS`], ["Estado", "Disponible"], ["Revisión técnica", "Al día"]].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <span style={{ color: "#666", fontSize: "14px" }}>{k}</span>
                    <span style={{ color: "#fff", fontSize: "14px", fontWeight: "600" }}>{v}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: `${color}15`, border: `1px solid ${color}40`, borderRadius: "12px", padding: "1.25rem", marginBottom: "1.5rem" }}>
                <div style={{ color, fontWeight: "800", fontSize: "2rem" }}>${product.price.toLocaleString("es-AR")}<span style={{ color: "#555", fontSize: "14px", fontWeight: "400" }}> / día</span></div>
                <p style={{ color: "#777", fontSize: "12px", marginTop: "4px" }}>Depósito reintegrable al devolver el equipo</p>
              </div>
              <button style={{ width: "100%", background: "#1DBEB4", border: "none", cursor: "pointer", color: "#0d1a19", fontWeight: "700", fontSize: "16px", padding: "14px", borderRadius: "12px", transition: "all 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.background = "#25d4ca"}
                onMouseLeave={e => e.currentTarget.style.background = "#1DBEB4"}
              >Reservar ahora</button>
            </div>

            {/* SPRINT 2 — Bloque Características */}
            <div style={{ background: "#1e1e1f", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "20px", padding: "2rem" }}>
              <h3 style={{ color: "#fff", fontWeight: "800", fontSize: "1.1rem", marginBottom: "1.25rem", paddingBottom: "0.75rem", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>Características</h3>
              {productFeatures.length > 0 ? (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  {productFeatures.map(f => (
                    <div key={f.id} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", background: "rgba(29,190,180,0.06)", border: "1px solid rgba(29,190,180,0.15)", borderRadius: "10px" }}>
                      <span style={{ fontSize: "20px" }}>{f.icon}</span>
                      <span style={{ color: "#ccc", fontSize: "13px", fontWeight: "500" }}>{f.name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: "#555", fontSize: "13px" }}>Este producto no tiene características asignadas.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── ADMIN PANEL ───────────────────────────────────────────────────────────────
function AdminPanel({ products, onAdd, onBack, users, onToggleAdmin, features, onAddFeature, onEditFeature, onDeleteFeature }) {
  const [tab, setTab] = useState("productos");
  const [form, setForm] = useState({ name: "", cat: "Nieve", desc: "", price: "" });
  const [selectedFeatIds, setSelectedFeatIds] = useState([]);
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [featForm, setFeatForm] = useState({ name: "", icon: "⭐" });
  const [featError, setFeatError] = useState("");
  const [editingFeat, setEditingFeat] = useState(null);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const handleFiles = (e) => setImages(prev => [...prev, ...Array.from(e.target.files).map(file => ({ url: URL.createObjectURL(file), file }))]);
  const removeImage = (idx) => setImages(prev => prev.filter((_, i) => i !== idx));

  const handleSubmit = () => {
    setError(""); setSuccess("");
    if (!form.name.trim()) { setError("El nombre es obligatorio."); return; }
    if (products.some(p => p.name.trim().toLowerCase() === form.name.trim().toLowerCase())) { setError(`Ya existe un producto llamado "${form.name}".`); return; }
    if (!form.desc.trim()) { setError("La descripción es obligatoria."); return; }
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) { setError("Ingresá un precio válido."); return; }
    const imgUrl = images.length > 0 ? images[0].url : "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80";
    onAdd({ name: form.name.trim(), cat: form.cat, desc: form.desc.trim(), price: Number(form.price), img: imgUrl, featureIds: selectedFeatIds });
    setSuccess(`"${form.name}" registrado correctamente.`);
    setForm({ name: "", cat: "Nieve", desc: "", price: "" }); setImages([]); setSelectedFeatIds([]);
  };

  const handleFeatSubmit = () => {
    setFeatError("");
    if (!featForm.name.trim()) { setFeatError("El nombre es obligatorio."); return; }
    if (editingFeat) { onEditFeature({ ...editingFeat, ...featForm }); setEditingFeat(null); }
    else { onAddFeature({ id: Date.now(), ...featForm }); }
    setFeatForm({ name: "", icon: "⭐" });
  };

  const inp = { width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "10px 14px", color: "#fff", fontSize: "14px", outline: "none", boxSizing: "border-box" };
  const tabBtn = (id, label) => (
    <button key={id} onClick={() => setTab(id)} style={{ background: tab === id ? "#1DBEB4" : "none", border: `1px solid ${tab === id ? "#1DBEB4" : "rgba(255,255,255,0.1)"}`, color: tab === id ? "#0d1a19" : "#aaa", fontWeight: tab === id ? "700" : "400", fontSize: "13px", padding: "8px 18px", borderRadius: "8px", cursor: "pointer" }}>{label}</button>
  );
  const ICONS = ["⭐","💧","🪶","✅","🔧","💪","📐","🎒","🏔️","❄️","🌊","🧗","🔒","⚡","🛡️","♻️"];

  return (
    <div style={{ minHeight: "100vh", paddingTop: "64px", background: "#111213" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "3rem 2rem" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "#1DBEB4", cursor: "pointer", fontSize: "14px", marginBottom: "2rem", display: "flex", alignItems: "center", gap: "6px" }}>← Volver al inicio</button>
        <div style={{ marginBottom: "2rem" }}>
          <p style={{ color: "#1DBEB4", fontSize: "12px", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "0.5rem" }}>Panel de administración</p>
          <h2 style={{ fontSize: "2rem", fontWeight: "800", color: "#fff", margin: 0 }}>DashBound Admin</h2>
        </div>
        <div style={{ display: "flex", gap: "10px", marginBottom: "2rem", flexWrap: "wrap" }}>
          {tabBtn("productos", "Registrar producto")}
          {tabBtn("caracteristicas", "Administrar características")}
          {tabBtn("usuarios", "Gestionar usuarios")}
        </div>

        {/* TAB PRODUCTOS */}
        {tab === "productos" && (
          <div style={{ background: "#1e1e1f", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "2rem" }}>
            <h3 style={{ color: "#fff", fontWeight: "700", fontSize: "1.1rem", marginBottom: "1.5rem" }}>Agregar producto</h3>
            {error && <div style={{ background: "rgba(231,76,60,0.12)", border: "1px solid rgba(231,76,60,0.4)", borderRadius: "10px", padding: "12px 16px", marginBottom: "1.5rem", color: "#e74c3c", fontSize: "13px", display: "flex", gap: "10px" }}><span>⚠</span><span>{error}</span></div>}
            {success && <div style={{ background: "rgba(29,190,180,0.12)", border: "1px solid rgba(29,190,180,0.4)", borderRadius: "10px", padding: "12px 16px", marginBottom: "1.5rem", color: "#1DBEB4", fontSize: "13px", display: "flex", gap: "10px" }}><span>✓</span><span>{success}</span></div>}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
              {[{ label: "Nombre del equipo *", key: "name", type: "text", placeholder: "Ej: Tabla de surf 8ft", full: true }, { label: "Descripción *", key: "desc", type: "text", placeholder: "Descripción breve", full: true }, { label: "Precio por día (ARS) *", key: "price", type: "number", placeholder: "Ej: 1500" }].map(f => (
                <div key={f.key} style={{ gridColumn: f.full ? "1 / -1" : "auto" }}>
                  <label style={{ display: "block", fontSize: "12px", color: "#888", marginBottom: "6px", fontWeight: "600" }}>{f.label}</label>
                  <input type={f.type} placeholder={f.placeholder} value={form[f.key]} onChange={e => set(f.key, e.target.value)} style={inp}
                    onFocus={e => e.currentTarget.style.borderColor = "rgba(29,190,180,0.5)"}
                    onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}
                  />
                </div>
              ))}
              <div>
                <label style={{ display: "block", fontSize: "12px", color: "#888", marginBottom: "6px", fontWeight: "600" }}>Categoría *</label>
                <select value={form.cat} onChange={e => set("cat", e.target.value)} style={{ ...inp, colorScheme: "dark" }}>{CATEGORIES.map(c => <option key={c.id} value={c.label}>{c.label}</option>)}</select>
              </div>

              {/* Selector de características */}
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ display: "block", fontSize: "12px", color: "#888", marginBottom: "8px", fontWeight: "600" }}>
                  Características del producto <span style={{ color: "#555", fontWeight: "400" }}>(seleccioná una o más)</span>
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "8px" }}>
                  {features.map(f => {
                    const selected = selectedFeatIds.includes(f.id);
                    return (
                      <button key={f.id} type="button"
                        onClick={() => setSelectedFeatIds(prev => selected ? prev.filter(id => id !== f.id) : [...prev, f.id])}
                        style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 12px", borderRadius: "8px", cursor: "pointer", transition: "all 0.2s", background: selected ? "rgba(29,190,180,0.15)" : "rgba(255,255,255,0.03)", border: `1px solid ${selected ? "#1DBEB4" : "rgba(255,255,255,0.1)"}`, color: selected ? "#1DBEB4" : "#888", fontSize: "13px", fontWeight: selected ? "600" : "400", textAlign: "left" }}
                      >
                        <span style={{ fontSize: "16px" }}>{f.icon}</span>
                        <span>{f.name}</span>
                        {selected && <span style={{ marginLeft: "auto", fontSize: "11px" }}>✓</span>}
                      </button>
                    );
                  })}
                </div>
                {selectedFeatIds.length > 0 && (
                  <p style={{ color: "#1DBEB4", fontSize: "12px", marginTop: "8px" }}>{selectedFeatIds.length} característica{selectedFeatIds.length > 1 ? "s" : ""} seleccionada{selectedFeatIds.length > 1 ? "s" : ""}.</p>
                )}
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ display: "block", fontSize: "12px", color: "#888", marginBottom: "8px", fontWeight: "600" }}>Imágenes del producto</label>
                <label htmlFor="img-upload" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", padding: "2rem", border: "2px dashed rgba(29,190,180,0.3)", borderRadius: "12px", cursor: "pointer", background: "rgba(29,190,180,0.04)", transition: "all 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(29,190,180,0.6)"; e.currentTarget.style.background = "rgba(29,190,180,0.08)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(29,190,180,0.3)"; e.currentTarget.style.background = "rgba(29,190,180,0.04)"; }}
                >
                  <div style={{ fontSize: "28px" }}>📷</div>
                  <div style={{ color: "#1DBEB4", fontWeight: "600", fontSize: "14px" }}>Hacé clic para subir imágenes</div>
                  <div style={{ color: "#555", fontSize: "12px" }}>PNG, JPG, WEBP — múltiples archivos</div>
                  <input id="img-upload" type="file" accept="image/*" multiple onChange={handleFiles} style={{ display: "none" }} />
                </label>
                {images.length > 0 && (
                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "14px" }}>
                    {images.map((img, idx) => (
                      <div key={idx} style={{ position: "relative" }}>
                        <img src={img.url} alt="" style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "8px", border: "2px solid rgba(29,190,180,0.4)" }}/>
                        <button onClick={() => removeImage(idx)} style={{ position: "absolute", top: "-6px", right: "-6px", width: "20px", height: "20px", borderRadius: "50%", background: "#e74c3c", border: "none", color: "#fff", fontSize: "11px", cursor: "pointer", fontWeight: "700" }}>✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div style={{ marginTop: "2rem", display: "flex", gap: "12px" }}>
              <button onClick={handleSubmit} style={{ background: "#1DBEB4", border: "none", cursor: "pointer", color: "#0d1a19", fontWeight: "700", fontSize: "15px", padding: "12px 28px", borderRadius: "10px" }}
                onMouseEnter={e => e.currentTarget.style.background = "#25d4ca"}
                onMouseLeave={e => e.currentTarget.style.background = "#1DBEB4"}
              >Registrar equipo</button>
              <button onClick={() => { setForm({ name: "", cat: "Nieve", desc: "", price: "" }); setImages([]); setSelectedFeatIds([]); setError(""); setSuccess(""); }} style={{ background: "none", border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer", color: "#aaa", fontSize: "14px", padding: "12px 20px", borderRadius: "10px" }}>Limpiar</button>
            </div>
            <div style={{ marginTop: "3rem" }}>
              <h3 style={{ color: "#fff", fontWeight: "700", fontSize: "1rem", marginBottom: "1rem" }}>Inventario ({products.length} productos)</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {products.slice(0, 8).map(p => (
                  <div key={p.id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", padding: "12px 16px", display: "flex", alignItems: "center", gap: "14px" }}>
                    <img src={p.img} alt={p.name} style={{ width: "44px", height: "44px", borderRadius: "8px", objectFit: "cover" }}/>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: "#fff", fontWeight: "600", fontSize: "14px" }}>{p.name}</div>
                      <div style={{ color: "#555", fontSize: "12px" }}>{p.cat} · ${p.price.toLocaleString("es-AR")}/día</div>
                    </div>
                  </div>
                ))}
                {products.length > 8 && <p style={{ color: "#555", fontSize: "13px", textAlign: "center" }}>+ {products.length - 8} más</p>}
              </div>
            </div>
          </div>
        )}

        {/* TAB CARACTERÍSTICAS */}
        {tab === "caracteristicas" && (
          <div>
            <div style={{ background: "#1e1e1f", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "2rem", marginBottom: "1.5rem" }}>
              <h3 style={{ color: "#fff", fontWeight: "700", fontSize: "1rem", marginBottom: "1.25rem" }}>{editingFeat ? "Editar característica" : "Añadir nueva característica"}</h3>
              {featError && <div style={{ background: "rgba(231,76,60,0.12)", border: "1px solid rgba(231,76,60,0.4)", borderRadius: "8px", padding: "10px 14px", marginBottom: "14px", color: "#e74c3c", fontSize: "13px" }}>⚠ {featError}</div>}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", color: "#888", marginBottom: "6px", fontWeight: "600" }}>Nombre *</label>
                  <input value={featForm.name} onChange={e => setFeatForm(f => ({ ...f, name: e.target.value }))} placeholder="Ej: Impermeable" style={inp}
                    onFocus={e => e.currentTarget.style.borderColor = "rgba(29,190,180,0.5)"}
                    onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", color: "#888", marginBottom: "6px", fontWeight: "600" }}>Ícono</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {ICONS.map(ic => (
                      <button key={ic} onClick={() => setFeatForm(f => ({ ...f, icon: ic }))} style={{ width: "34px", height: "34px", fontSize: "18px", border: `2px solid ${featForm.icon === ic ? "#1DBEB4" : "rgba(255,255,255,0.1)"}`, borderRadius: "8px", background: featForm.icon === ic ? "rgba(29,190,180,0.15)" : "rgba(255,255,255,0.04)", cursor: "pointer" }}>{ic}</button>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={handleFeatSubmit} style={{ background: "#1DBEB4", border: "none", cursor: "pointer", color: "#0d1a19", fontWeight: "700", fontSize: "14px", padding: "10px 22px", borderRadius: "8px" }}>{editingFeat ? "Guardar cambios" : "Añadir nueva"}</button>
                {editingFeat && <button onClick={() => { setEditingFeat(null); setFeatForm({ name: "", icon: "⭐" }); }} style={{ background: "none", border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer", color: "#aaa", fontSize: "14px", padding: "10px 18px", borderRadius: "8px" }}>Cancelar</button>}
              </div>
            </div>
            <div style={{ background: "#1e1e1f", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "2rem" }}>
              <h3 style={{ color: "#fff", fontWeight: "700", fontSize: "1rem", marginBottom: "1rem" }}>Características registradas ({features.length})</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {features.map(f => (
                  <div key={f.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span style={{ fontSize: "22px" }}>{f.icon}</span>
                      <span style={{ color: "#fff", fontSize: "14px", fontWeight: "500" }}>{f.name}</span>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button onClick={() => { setEditingFeat(f); setFeatForm({ name: f.name, icon: f.icon }); }} style={{ background: "rgba(29,190,180,0.1)", border: "1px solid rgba(29,190,180,0.3)", color: "#1DBEB4", fontSize: "12px", padding: "5px 12px", borderRadius: "6px", cursor: "pointer" }}>Editar</button>
                      <button onClick={() => onDeleteFeature(f.id)} style={{ background: "rgba(231,76,60,0.1)", border: "1px solid rgba(231,76,60,0.3)", color: "#e74c3c", fontSize: "12px", padding: "5px 12px", borderRadius: "6px", cursor: "pointer" }}>Eliminar</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB USUARIOS */}
        {tab === "usuarios" && (
          <div style={{ background: "#1e1e1f", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "2rem" }}>
            <h3 style={{ color: "#fff", fontWeight: "700", fontSize: "1rem", marginBottom: "1.25rem" }}>Usuarios registrados ({users.length})</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {users.map(u => (
                <div key={u.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: u.isAdmin ? "linear-gradient(135deg, #1DBEB4, #54547E)" : "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "800", fontSize: "13px", color: "#fff" }}>{u.nombre[0]}{u.apellido[0]}</div>
                    <div>
                      <div style={{ color: "#fff", fontWeight: "600", fontSize: "14px" }}>{u.nombre} {u.apellido}</div>
                      <div style={{ color: "#555", fontSize: "12px" }}>{u.email}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    {u.isAdmin && <span style={{ background: "rgba(29,190,180,0.15)", border: "1px solid rgba(29,190,180,0.3)", color: "#1DBEB4", fontSize: "11px", fontWeight: "700", padding: "3px 10px", borderRadius: "100px" }}>Admin</span>}
                    <button onClick={() => onToggleAdmin(u.id)} style={{ background: u.isAdmin ? "rgba(231,76,60,0.1)" : "rgba(29,190,180,0.1)", border: `1px solid ${u.isAdmin ? "rgba(231,76,60,0.3)" : "rgba(29,190,180,0.3)"}`, color: u.isAdmin ? "#e74c3c" : "#1DBEB4", fontSize: "12px", padding: "6px 14px", borderRadius: "8px", cursor: "pointer" }}>
                      {u.isAdmin ? "Quitar admin" : "Dar admin"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── FOOTER ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background: "#0f0f10", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "2.5rem 2rem" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "36px", height: "36px", background: "linear-gradient(135deg, #1DBEB4, #54547E)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Georgia', serif", fontWeight: "bold", fontSize: "15px", color: "#fff" }}>Db</div>
          <div>
            <div style={{ color: "#fff", fontWeight: "700", fontSize: "15px" }}>Dash<span style={{ color: "#1DBEB4" }}>Bound</span></div>
            <div style={{ color: "#444", fontSize: "12px" }}>© 2024 DashBound. Todos los derechos reservados.</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          {[IconFB, IconLI, IconTW, IconIG].map((Icon, i) => (
            <a key={i} href="#" style={{ color: "#555", transition: "color 0.2s", display: "flex" }}
              onMouseEnter={e => e.currentTarget.style.color = "#1DBEB4"}
              onMouseLeave={e => e.currentTarget.style.color = "#555"}
            ><Icon/></a>
          ))}
        </div>
      </div>
    </footer>
  );
}

// ── APP ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState("home");
  const [products, setProducts] = useState(PRODUCTS_RAW);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState(INITIAL_USERS);
  const [features, setFeatures] = useState(DEFAULT_FEATURES);
  const [modal, setModal] = useState(null);

  const handleAdd        = useCallback((item) => setProducts(prev => [...prev, { ...item, id: Date.now() }]), []);
  const handleDetail     = useCallback((product) => { setSelectedProduct(product); setView("detail"); window.scrollTo({ top: 0, behavior: "smooth" }); }, []);
  const handleLogin      = useCallback((user) => { setCurrentUser(user); setModal(null); }, []);
  const handleRegister   = useCallback((u) => { setUsers(prev => [...prev, u]); setCurrentUser(u); setModal(null); }, []);
  const handleLogout     = useCallback(() => { setCurrentUser(null); setView("home"); }, []);
  const handleToggleAdmin = useCallback((id) => setUsers(prev => prev.map(u => u.id === id ? { ...u, isAdmin: !u.isAdmin } : u)), []);
  const handleAddFeature  = useCallback((f) => setFeatures(prev => [...prev, f]), []);
  const handleEditFeature = useCallback((f) => setFeatures(prev => prev.map(x => x.id === f.id ? f : x)), []);
  const handleDeleteFeature = useCallback((id) => setFeatures(prev => prev.filter(f => f.id !== id)), []);

  return (
    <div style={{ fontFamily: "'Inter', 'Helvetica Neue', sans-serif", background: "#1A1A1B", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        input[type=number]::-webkit-inner-spin-button { opacity: 0; }
        ::-webkit-scrollbar { width: 6px; background: #111; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
      `}</style>

      <Header
        onHome={() => { setView("home"); setSelectedProduct(null); }}
        onLogin={() => setModal("login")}
        onRegister={() => setModal("register")}
        onAdmin={() => setView("admin")}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {view === "home" && (
        <main>
          <HeroSearch onSearch={() => {}} />
          <CategoriesSection />
          <ProductsSection onDetail={handleDetail} />
        </main>
      )}

      {view === "detail" && selectedProduct && (
        <ProductDetail product={selectedProduct} onBack={() => setView("home")} features={features} />
      )}

      {view === "admin" && currentUser?.isAdmin && (
        <AdminPanel
          products={products} onAdd={handleAdd} onBack={() => setView("home")}
          users={users} onToggleAdmin={handleToggleAdmin}
          features={features} onAddFeature={handleAddFeature}
          onEditFeature={handleEditFeature} onDeleteFeature={handleDeleteFeature}
        />
      )}

      <Footer />

      {modal === "login"    && <LoginModal    onClose={() => setModal(null)} onSuccess={handleLogin}    users={users} />}
      {modal === "register" && <RegisterModal onClose={() => setModal(null)} onSuccess={handleRegister} users={users} />}
    </div>
  );
}
