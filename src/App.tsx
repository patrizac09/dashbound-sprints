import { useState, useEffect, useCallback } from "react";

// ── DATA ──────────────────────────────────────────────────────────────────────
const CATEGORIES = [
  {
    id: "nieve",
    label: "Nieve",
    emoji: "❄️",
    desc: "Snowboards · Esquís · Bastones",
    // Bioma: tundra alpina / glaciar — pistas nevadas con cielo azul y cordillera
    img: "https://images.unsplash.com/photo-1548777123-e216912df7d8?w=800&q=85",
  },
  {
    id: "montana",
    label: "Montaña",
    emoji: "⛰️",
    desc: "Carpas técnicas · Mochilas de expedición",
    // Bioma: bosque montano / subalpino — valles verdes y cumbres imponentes
    img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=85",
  },
  {
    id: "escalada",
    label: "Escalada",
    emoji: "🧗",
    desc: "Arneses · Cuerdas · Pies de gato",
    // Bioma: pared de granito / acantilado — roca vertical expuesta
    img: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=85",
  },
  {
    id: "agua",
    label: "Agua",
    emoji: "🌊",
    desc: "Kitesurf · Kayaks · Neoprene",
    // Bioma: marino / litoral — océano turquesa con olas abiertas
    img: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&q=85",
  },
];

const PRODUCTS_RAW = [
  { id: 1, cat: "Nieve", name: "Snowboard Freeride Pro", desc: "Tabla directional con flex medio, ideal para nieve virgen y fuera de pista.", price: 4200, img: "https://images.unsplash.com/photo-1605540436563-5bca919ae766?w=400&q=70" },
  { id: 2, cat: "Nieve", name: "Esquís Carving Twin", desc: "Esquís de carving clásico, torsión alta y rebote rápido en pistas duras.", price: 3800, img: "https://images.unsplash.com/photo-1548430395-ec39eaf2aa1a?w=400&q=70" },
  { id: 3, cat: "Nieve", name: "Bastones Carbono K2", desc: "Bastones ultraligeros con empuñadura ergonómica y anillo para powder.", price: 650, img: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&q=70" },
  { id: 4, cat: "Montaña", name: "Carpa Técnica 3 Estaciones", desc: "Doble capa, 1.8 kg, soporta vientos de hasta 80 km/h en campamentos de altura.", price: 5500, img: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&q=70" },
  { id: 5, cat: "Montaña", name: "Mochila Expedición 75 L", desc: "Sistema de soporte adaptable, bolsillos de acceso rápido y cubierta lluvia incluida.", price: 3200, img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=70" },
  { id: 6, cat: "Montaña", name: "Saco de Dormir -15°C", desc: "Relleno de plumón 800fp, compresión extrema, peso 980 g.", price: 2800, img: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=400&q=70" },
  { id: 7, cat: "Escalada", name: "Arnés Climbing Evo", desc: "Arnés deportivo con ajuste en piernas y cadera, certificación UIAA.", price: 1200, img: "https://images.unsplash.com/photo-1522163182402-834f871fd851?w=400&q=70" },
  { id: 8, cat: "Escalada", name: "Cuerda Dinámica 60 m", desc: "10.2 mm, dry-treatment, aprobada UIAA para escalada deportiva y aventura.", price: 1800, img: "https://images.unsplash.com/photo-1564415315949-7a0c4c73aab4?w=400&q=70" },
  { id: 9, cat: "Escalada", name: "Pies de Gato Performance", desc: "Puntera asimétrica, suela Vibram XS Grip2, cierre velcro doble.", price: 1500, img: "https://images.unsplash.com/photo-1601142634808-38923eb7c560?w=400&q=70" },
  { id: 10, cat: "Agua", name: "Tabla Kitesurf Twintip", desc: "137×41 cm, construcción sandwich, ideal para freeride y trucos básicos.", price: 4800, img: "https://images.unsplash.com/photo-1530053969600-caed2596d242?w=400&q=70" },
  { id: 11, cat: "Agua", name: "Kayak de Mar Touring", desc: "Fibra de vidrio, 5.2 m, timón retráctil, compartimentos estancos proa/popa.", price: 6200, img: "https://images.unsplash.com/photo-1474732132769-c3fb7d8d3a7e?w=400&q=70" },
  { id: 12, cat: "Agua", name: "Neoprene 3/2 mm Full", desc: "Cierre chest-zip, costuras reforzadas, termoforro en pecho y espalda.", price: 2100, img: "https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=400&q=70" },
  { id: 13, cat: "Nieve", name: "Casco Ski All-Mountain", desc: "EPS certificado EN1077, ventilación ajustable, compatible con goggle.", price: 900, img: "https://images.unsplash.com/photo-1607462109225-6b64ae2dd3cb?w=400&q=70" },
  { id: 14, cat: "Montaña", name: "Bastones Trekking Telescópicos", desc: "Aluminio 7075, puntas intercambiables, empuñadura corcho natural.", price: 780, img: "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=400&q=70" },
  { id: 15, cat: "Escalada", name: "Set Fisureros + Excentricas", desc: "10 piezas aluminio anodizado, includes bag de transporte.", price: 2200, img: "https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=400&q=70" },
  { id: 16, cat: "Agua", name: "Paddle Surf 10'6\" Inflable", desc: "Drop-stitch de doble cámara, 15 PSI, kit bomba y correa incluidos.", price: 3500, img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=70" },
  { id: 17, cat: "Montaña", name: "Gaiters Impermeables Alta Montaña", desc: "Gore-Tex, velcro + hebilla frontal, compatible con crampones.", price: 560, img: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=400&q=70" },
  { id: 18, cat: "Escalada", name: "Magnesera + 300 g Magnesio", desc: "Bolsa de tela con cierre elástico, incluye bloque 300 g.", price: 320, img: "https://images.unsplash.com/photo-1600966150528-cbf2b3c3c16d?w=400&q=70" },
  { id: 19, cat: "Agua", name: "Licra UV 50+ Manga Larga", desc: "Poliéster reciclado, secado ultra-rápido, protección UPF 50+.", price: 480, img: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=400&q=70" },
  { id: 20, cat: "Nieve", name: "Gafas Ski Espejo Revo", desc: "Lente cilíndrica doble, ventilación anti-vaho, correa elástica 45 mm.", price: 720, img: "https://images.unsplash.com/photo-1548430395-ec39eaf2aa1a?w=400&q=70" },
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

// ── ICONS ────────────────────────────────────────────────────────────────────
const IconFB = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
  </svg>
);
const IconLI = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);
const IconTW = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
  </svg>
);
const IconIG = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

// ── COMPONENTS ───────────────────────────────────────────────────────────────

function Header({ onHome, onLogin, onRegister, onAdmin }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <header style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? "rgba(20,20,21,0.97)" : "#1A1A1B",
      borderBottom: scrolled ? "1px solid rgba(29,190,180,0.2)" : "1px solid rgba(255,255,255,0.06)",
      backdropFilter: scrolled ? "blur(12px)" : "none",
      transition: "all 0.3s",
      padding: "0 2rem",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      height: "64px",
    }}>
      {/* Logo */}
      <button onClick={onHome} style={{
        background: "none", border: "none", cursor: "pointer",
        display: "flex", alignItems: "center", gap: "12px"
      }}>
        <div style={{
          width: "40px", height: "40px",
          background: "linear-gradient(135deg, #1DBEB4, #54547E)",
          borderRadius: "10px",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'Georgia', serif", fontWeight: "bold",
          fontSize: "18px", color: "#fff", letterSpacing: "-1px",
          position: "relative", overflow: "hidden"
        }}>
          <span style={{ position: "relative", zIndex: 1 }}>Db</span>
          <div style={{
            position: "absolute", top: "2px", left: "6px",
            width: "60%", height: "2px", background: "rgba(255,255,255,0.4)",
            transform: "rotate(-15deg)"
          }}/>
        </div>
        <div style={{ textAlign: "left" }}>
          <div style={{ fontWeight: "700", fontSize: "18px", color: "#fff", letterSpacing: "-0.3px" }}>
            Dash<span style={{ color: "#1DBEB4" }}>Bound</span>
          </div>
          <div style={{ fontSize: "11px", color: "#888", letterSpacing: "0.3px" }}>
            Tu equipo para el próximo desafío
          </div>
        </div>
      </button>

      {/* Nav */}
      <nav style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        <button onClick={onAdmin} style={{
          background: "none", border: "none", cursor: "pointer",
          color: "#1DBEB4", fontSize: "13px", padding: "6px 12px",
          borderRadius: "6px", transition: "background 0.2s",
        }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(29,190,180,0.1)"}
          onMouseLeave={e => e.currentTarget.style.background = "none"}
        >
          Panel Admin
        </button>
        <button onClick={onRegister} style={{
          background: "none",
          border: "1px solid rgba(84,84,126,0.6)",
          cursor: "pointer", color: "#bbb", fontSize: "13px",
          padding: "7px 16px", borderRadius: "8px",
          transition: "all 0.2s",
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "#54547E"; e.currentTarget.style.color = "#fff"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(84,84,126,0.6)"; e.currentTarget.style.color = "#bbb"; }}
        >
          Crear cuenta
        </button>
        <button onClick={onLogin} style={{
          background: "#1DBEB4", border: "none",
          cursor: "pointer", color: "#0d1a19", fontSize: "13px", fontWeight: "600",
          padding: "8px 18px", borderRadius: "8px",
          transition: "all 0.2s",
        }}
          onMouseEnter={e => e.currentTarget.style.background = "#25d4ca"}
          onMouseLeave={e => e.currentTarget.style.background = "#1DBEB4"}
        >
          Iniciar sesión
        </button>
      </nav>
    </header>
  );
}

function HeroSearch({ onSearch }) {
  const [sport, setSport] = useState("");
  const [dateOut, setDateOut] = useState("");
  const [dateBack, setDateBack] = useState("");

  return (
    <section style={{
      minHeight: "100vh", paddingTop: "64px",
      background: "#1A1A1B",
      position: "relative", overflow: "hidden",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      {/* Background texture */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `url("https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1400&q=60")`,
        backgroundSize: "cover", backgroundPosition: "center",
        opacity: 0.18,
      }}/>
      {/* Gradient overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at 50% 60%, rgba(29,190,180,0.08) 0%, transparent 70%)"
      }}/>
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "200px",
        background: "linear-gradient(to bottom, transparent, #1A1A1B)"
      }}/>

      <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "2rem", maxWidth: "860px", width: "100%" }}>
        {/* Badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "6px",
          background: "rgba(29,190,180,0.12)", border: "1px solid rgba(29,190,180,0.3)",
          borderRadius: "100px", padding: "5px 14px", marginBottom: "1.5rem",
          fontSize: "12px", color: "#1DBEB4", fontWeight: "600", letterSpacing: "1px",
          textTransform: "uppercase"
        }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#1DBEB4", display: "inline-block" }}/>
          Equipamiento técnico certificado
        </div>

        <h1 style={{
          fontSize: "clamp(2.4rem, 6vw, 4.2rem)",
          fontWeight: "800", color: "#fff", lineHeight: "1.1",
          marginBottom: "1rem", letterSpacing: "-1px",
        }}>
          Equipate para<br/>
          <span style={{ color: "#1DBEB4" }}>la aventura</span>
        </h1>
        <p style={{ color: "#999", fontSize: "1.1rem", marginBottom: "2.5rem", lineHeight: "1.6" }}>
          Alquilá el mejor equipamiento deportivo sin complicaciones.<br/>
          Retirás, usás, devolvés.
        </p>

        {/* Search box */}
        <div style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "16px", padding: "1.5rem",
          backdropFilter: "blur(20px)",
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr auto",
          gap: "12px", alignItems: "end",
        }}>
          {[
            { label: "Deporte / Equipo", placeholder: "Ej: Kayak, Snowboard…", val: sport, set: setSport, type: "text" },
            { label: "Fecha de salida", placeholder: "", val: dateOut, set: setDateOut, type: "date" },
            { label: "Fecha de regreso", placeholder: "", val: dateBack, set: setDateBack, type: "date" },
          ].map(f => (
            <div key={f.label}>
              <label style={{ display: "block", fontSize: "11px", color: "#1DBEB4", fontWeight: "600", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.8px" }}>
                {f.label}
              </label>
              <input
                type={f.type}
                placeholder={f.placeholder}
                value={f.val}
                onChange={e => f.set(e.target.value)}
                style={{
                  width: "100%", background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "8px", padding: "10px 12px",
                  color: "#fff", fontSize: "14px", outline: "none",
                  boxSizing: "border-box",
                  colorScheme: "dark",
                }}
              />
            </div>
          ))}
          <button
            onClick={() => onSearch({ sport, dateOut, dateBack })}
            style={{
              background: "#1DBEB4", border: "none", cursor: "pointer",
              color: "#0d1a19", fontWeight: "700", fontSize: "15px",
              padding: "11px 28px", borderRadius: "8px",
              whiteSpace: "nowrap", transition: "all 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#25d4ca"}
            onMouseLeave={e => e.currentTarget.style.background = "#1DBEB4"}
          >
            Explorar
          </button>
        </div>

        {/* Stats */}
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

function CategoriesSection() {
  return (
    <section style={{ background: "#111213", padding: "5rem 2rem" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <p style={{ color: "#1DBEB4", fontSize: "12px", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "0.75rem" }}>
            Explorá por deporte
          </p>
          <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: "800", color: "#fff", margin: 0 }}>
            Categorías
          </h2>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "20px",
        }}>
          {CATEGORIES.map(cat => (
            <div key={cat.id}
              style={{
                borderRadius: "16px", overflow: "hidden",
                position: "relative", cursor: "pointer",
                aspectRatio: "3/4",
                transition: "transform 0.3s",
              }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-6px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
            >
              <img src={cat.img} alt={cat.label} style={{
                width: "100%", height: "100%", objectFit: "cover",
                display: "block",
              }}/>
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)"
              }}/>
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                padding: "1.5rem",
              }}>
                <div style={{ fontSize: "28px", marginBottom: "4px" }}>{cat.emoji}</div>
                <h3 style={{ color: "#fff", fontWeight: "800", fontSize: "1.4rem", margin: "0 0 4px" }}>
                  {cat.label}
                </h3>
                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "13px", margin: 0 }}>{cat.desc}</p>
                <div style={{
                  display: "inline-block", marginTop: "12px",
                  background: "#1DBEB4", color: "#0d1a19",
                  fontSize: "11px", fontWeight: "700", letterSpacing: "0.5px",
                  padding: "4px 12px", borderRadius: "100px",
                }}>
                  Ver equipos →
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCard({ p, onDetail }) {
  const catColors = { Nieve: "#7EC8E3", Montaña: "#A8D5A2", Escalada: "#F4A460", Agua: "#1DBEB4" };
  return (
    <div style={{
      background: "#1e1e1f",
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: "14px", overflow: "hidden",
      transition: "all 0.25s", cursor: "pointer",
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(29,190,180,0.35)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      <div style={{ position: "relative", overflow: "hidden", height: "220px" }}>
        <img src={p.img} alt={p.name}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.4s" }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
        />
        <div style={{
          position: "absolute", top: "10px", left: "10px",
          background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)",
          borderRadius: "100px", padding: "3px 10px",
          fontSize: "11px", fontWeight: "700",
          color: catColors[p.cat] || "#1DBEB4",
        }}>
          {p.cat}
        </div>
      </div>
      <div style={{ padding: "1rem" }}>
        <h4 style={{ color: "#fff", fontWeight: "700", fontSize: "14px", margin: "0 0 6px", lineHeight: "1.3" }}>{p.name}</h4>
        <p style={{ color: "#777", fontSize: "12px", margin: "0 0 12px", lineHeight: "1.5" }}>{p.desc}</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#1DBEB4", fontWeight: "800", fontSize: "16px" }}>
            ${p.price.toLocaleString("es-AR")}<span style={{ color: "#555", fontSize: "11px", fontWeight: "400" }}>/día</span>
          </span>
          <button onClick={() => onDetail && onDetail(p)} style={{
            background: "rgba(29,190,180,0.12)", border: "1px solid rgba(29,190,180,0.3)",
            color: "#1DBEB4", fontSize: "12px", fontWeight: "600",
            padding: "5px 12px", borderRadius: "6px", cursor: "pointer",
            transition: "all 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = "#1DBEB4"; e.currentTarget.style.color = "#0d1a19"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(29,190,180,0.12)"; e.currentTarget.style.color = "#1DBEB4"; }}
          >
            Ver detalle
          </button>
        </div>
      </div>
    </div>
  );
}

function ProductsSection({ onDetail }) {
  const [products] = useState(() => shuffle(PRODUCTS_RAW));
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(products.length / PAGE_SIZE);
  const start = (page - 1) * PAGE_SIZE;
  const slice = products.slice(start, start + PAGE_SIZE);

  const btnStyle = (active) => ({
    background: active ? "#1DBEB4" : "rgba(255,255,255,0.05)",
    border: `1px solid ${active ? "#1DBEB4" : "rgba(255,255,255,0.1)"}`,
    color: active ? "#0d1a19" : "#aaa",
    fontWeight: active ? "700" : "400",
    fontSize: "13px", padding: "7px 14px",
    borderRadius: "8px", cursor: active ? "default" : "pointer",
    transition: "all 0.2s",
  });

  return (
    <section style={{ background: "#1A1A1B", padding: "5rem 2rem" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <p style={{ color: "#1DBEB4", fontSize: "12px", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "0.5rem" }}>
              Selección aleatoria
            </p>
            <h2 style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)", fontWeight: "800", color: "#fff", margin: 0 }}>
              Productos recomendados
            </h2>
          </div>
          <p style={{ color: "#555", fontSize: "13px" }}>
            Mostrando {start + 1}–{Math.min(start + PAGE_SIZE, products.length)} de {products.length}
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px", marginBottom: "3rem",
        }}>
          {slice.map(p => <ProductCard key={p.id} p={p} onDetail={onDetail} />)}
        </div>

        {/* Pagination */}
        <div style={{ display: "flex", justifyContent: "center", gap: "8px", flexWrap: "wrap" }}>
          <button
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            style={{
              ...btnStyle(false),
              opacity: page === 1 ? 0.3 : 1,
              cursor: page === 1 ? "not-allowed" : "pointer",
            }}
          >
            ← Anterior
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
            <button key={n} onClick={() => setPage(n)} style={btnStyle(n === page)}>
              {n}
            </button>
          ))}

          <button
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
            style={{
              ...btnStyle(false),
              opacity: page === totalPages ? 0.3 : 1,
              cursor: page === totalPages ? "not-allowed" : "pointer",
            }}
          >
            Siguiente →
          </button>
        </div>
      </div>
    </section>
  );
}

// ── PRODUCT DETAIL ────────────────────────────────────────────────────────────
function ProductDetail({ product, onBack }) {
  const catColors = { Nieve: "#7EC8E3", Montaña: "#A8D5A2", Escalada: "#F4A460", Agua: "#1DBEB4" };
  const color = catColors[product.cat] || "#1DBEB4";

  return (
    <div style={{ minHeight: "100vh", background: "#1A1A1B", paddingTop: "64px" }}>
      {/* Detail Header — 100% ancho, título izquierda, flecha derecha */}
      <div style={{
        width: "100%", background: "#111213",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        padding: "1.25rem 2rem",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        {/* Título alineado a la izquierda */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <span style={{
            background: "rgba(0,0,0,0.4)", border: `1px solid ${color}40`,
            borderRadius: "100px", padding: "3px 12px",
            fontSize: "12px", fontWeight: "700", color,
          }}>
            {product.cat}
          </span>
          <h1 style={{ color: "#fff", fontWeight: "800", fontSize: "clamp(1.1rem, 3vw, 1.6rem)", margin: 0 }}>
            {product.name}
          </h1>
        </div>
        {/* Flecha volver alineada a la derecha */}
        <button onClick={onBack} style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: "10px", padding: "8px 18px",
          color: "#ccc", fontSize: "14px", cursor: "pointer",
          display: "flex", alignItems: "center", gap: "8px",
          transition: "all 0.2s", whiteSpace: "nowrap",
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "#1DBEB4"; e.currentTarget.style.color = "#1DBEB4"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "#ccc"; }}
        >
          ← Volver
        </button>
      </div>

      {/* Body — imagen + descripción */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "3rem 2rem" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "3rem", alignItems: "start",
        }}>
          {/* Imágenes del producto */}
          <div>
            <div style={{
              borderRadius: "20px", overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.08)",
              marginBottom: "16px",
            }}>
              <img
                src={product.img}
                alt={product.name}
                style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", display: "block" }}
              />
            </div>
            {/* Miniaturas (misma imagen simulando galería) */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
              {[product.img, product.img, product.img].map((src, i) => (
                <div key={i} style={{
                  borderRadius: "10px", overflow: "hidden",
                  border: i === 0 ? `2px solid ${color}` : "1px solid rgba(255,255,255,0.08)",
                  cursor: "pointer",
                }}>
                  <img src={src} alt="" style={{ width: "100%", aspectRatio: "1", objectFit: "cover", display: "block" }}/>
                </div>
              ))}
            </div>
          </div>

          {/* Texto descriptivo */}
          <div>
            <div style={{
              background: "#1e1e1f",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "20px", padding: "2rem",
            }}>
              <p style={{ color: "#1DBEB4", fontSize: "12px", fontWeight: "700", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "0.75rem" }}>
                Descripción del producto
              </p>
              <p style={{ color: "#ccc", fontSize: "16px", lineHeight: "1.8", marginBottom: "2rem" }}>
                {product.desc} Este equipo está diseñado para deportistas que exigen rendimiento en condiciones extremas. Certificado y revisado por nuestro equipo técnico antes de cada alquiler.
              </p>

              <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: "1.5rem", marginBottom: "1.5rem" }}>
                {[
                  ["Categoría", product.cat],
                  ["Precio por día", `$${product.price.toLocaleString("es-AR")} ARS`],
                  ["Estado", "Disponible"],
                  ["Revisión técnica", "Al día"],
                ].map(([k, v]) => (
                  <div key={k} style={{
                    display: "flex", justifyContent: "space-between",
                    padding: "10px 0",
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                  }}>
                    <span style={{ color: "#666", fontSize: "14px" }}>{k}</span>
                    <span style={{ color: "#fff", fontSize: "14px", fontWeight: "600" }}>{v}</span>
                  </div>
                ))}
              </div>

              <div style={{
                background: `${color}15`, border: `1px solid ${color}40`,
                borderRadius: "12px", padding: "1.25rem",
                marginBottom: "1.5rem",
              }}>
                <div style={{ color, fontWeight: "800", fontSize: "2rem" }}>
                  ${product.price.toLocaleString("es-AR")}
                  <span style={{ color: "#555", fontSize: "14px", fontWeight: "400" }}> / día</span>
                </div>
                <p style={{ color: "#777", fontSize: "12px", marginTop: "4px" }}>
                  Depósito reintegrable al devolver el equipo
                </p>
              </div>

              <button style={{
                width: "100%", background: "#1DBEB4", border: "none",
                cursor: "pointer", color: "#0d1a19", fontWeight: "700",
                fontSize: "16px", padding: "14px", borderRadius: "12px",
                transition: "all 0.2s",
              }}
                onMouseEnter={e => e.currentTarget.style.background = "#25d4ca"}
                onMouseLeave={e => e.currentTarget.style.background = "#1DBEB4"}
              >
                Reservar ahora
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── ADMIN PANEL ───────────────────────────────────────────────────────────────
function AdminPanel({ products, onAdd, onBack }) {
  const [form, setForm] = useState({ name: "", cat: "Nieve", desc: "", price: "" });
  const [images, setImages] = useState([]); // array of { url, file }
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleFiles = (e) => {
    const files = Array.from(e.target.files);
    const newImgs = files.map(file => ({ url: URL.createObjectURL(file), file }));
    setImages(prev => [...prev, ...newImgs]);
  };

  const removeImage = (idx) => setImages(prev => prev.filter((_, i) => i !== idx));

  const handleSubmit = () => {
    setError(""); setSuccess("");
    if (!form.name.trim()) { setError("El nombre del equipo es obligatorio."); return; }
    const exists = products.some(p => p.name.trim().toLowerCase() === form.name.trim().toLowerCase());
    if (exists) { setError(`Ya existe un producto llamado "${form.name}". Ingresá un nombre diferente.`); return; }
    if (!form.desc.trim()) { setError("La descripción es obligatoria."); return; }
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) { setError("Ingresá un precio diario válido."); return; }
    const imgUrl = images.length > 0 ? images[0].url : "https://images.unsplash.com/photo-1607462109225-6b64ae2dd3cb?w=400&q=70";
    onAdd({ name: form.name.trim(), cat: form.cat, desc: form.desc.trim(), price: Number(form.price), img: imgUrl });
    setSuccess(`"${form.name}" registrado correctamente.`);
    setForm({ name: "", cat: "Nieve", desc: "", price: "" });
    setImages([]);
  };

  const inputStyle = {
    width: "100%", background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "8px", padding: "10px 14px",
    color: "#fff", fontSize: "14px", outline: "none",
    boxSizing: "border-box", transition: "border-color 0.2s",
  };

  return (
    <div style={{ minHeight: "100vh", paddingTop: "64px", background: "#111213" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "3rem 2rem" }}>
        <button onClick={onBack} style={{
          background: "none", border: "none", color: "#1DBEB4",
          cursor: "pointer", fontSize: "14px", marginBottom: "2rem",
          display: "flex", alignItems: "center", gap: "6px",
        }}>
          ← Volver al inicio
        </button>

        <div style={{ marginBottom: "2.5rem" }}>
          <p style={{ color: "#1DBEB4", fontSize: "12px", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "0.5rem" }}>
            Panel de administración
          </p>
          <h2 style={{ fontSize: "2rem", fontWeight: "800", color: "#fff", margin: 0 }}>
            Registrar nuevo equipo
          </h2>
        </div>

        <div style={{
          background: "#1e1e1f", border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "16px", padding: "2rem",
        }}>
          {error && (
            <div style={{
              background: "rgba(231,76,60,0.12)", border: "1px solid rgba(231,76,60,0.4)",
              borderRadius: "10px", padding: "12px 16px", marginBottom: "1.5rem",
              color: "#e74c3c", fontSize: "13px", display: "flex", gap: "10px", alignItems: "flex-start"
            }}>
              <span style={{ fontSize: "16px" }}>⚠</span>
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div style={{
              background: "rgba(29,190,180,0.12)", border: "1px solid rgba(29,190,180,0.4)",
              borderRadius: "10px", padding: "12px 16px", marginBottom: "1.5rem",
              color: "#1DBEB4", fontSize: "13px", display: "flex", gap: "10px", alignItems: "center"
            }}>
              <span style={{ fontSize: "16px" }}>✓</span>
              <span>{success}</span>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
            {[
              { label: "Nombre del equipo *", key: "name", type: "text", placeholder: "Ej: Tabla de surf 8ft", full: true },
              { label: "Descripción corta *", key: "desc", type: "text", placeholder: "Descripción breve del producto", full: true },
              { label: "Precio por día (ARS) *", key: "price", type: "number", placeholder: "Ej: 1500" },
            ].map(f => (
              <div key={f.key} style={{ gridColumn: f.full ? "1 / -1" : "auto" }}>
                <label style={{ display: "block", fontSize: "12px", color: "#888", marginBottom: "6px", fontWeight: "600" }}>
                  {f.label}
                </label>
                <input
                  type={f.type}
                  placeholder={f.placeholder}
                  value={form[f.key]}
                  onChange={e => set(f.key, e.target.value)}
                  style={inputStyle}
                  onFocus={e => e.currentTarget.style.borderColor = "rgba(29,190,180,0.5)"}
                  onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}
                />
              </div>
            ))}
            <div>
              <label style={{ display: "block", fontSize: "12px", color: "#888", marginBottom: "6px", fontWeight: "600" }}>
                Categoría *
              </label>
              <select
                value={form.cat}
                onChange={e => set("cat", e.target.value)}
                style={{ ...inputStyle, colorScheme: "dark" }}
              >
                {CATEGORIES.map(c => <option key={c.id} value={c.label}>{c.label}</option>)}
              </select>
            </div>

            {/* FILE UPLOAD — criterio: subir una o más imágenes */}
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ display: "block", fontSize: "12px", color: "#888", marginBottom: "8px", fontWeight: "600" }}>
                Imágenes del producto (podés subir más de una)
              </label>
              <label htmlFor="img-upload" style={{
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                gap: "8px", padding: "2rem",
                border: "2px dashed rgba(29,190,180,0.3)",
                borderRadius: "12px", cursor: "pointer",
                background: "rgba(29,190,180,0.04)",
                transition: "all 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(29,190,180,0.6)"; e.currentTarget.style.background = "rgba(29,190,180,0.08)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(29,190,180,0.3)"; e.currentTarget.style.background = "rgba(29,190,180,0.04)"; }}
              >
                <div style={{ fontSize: "28px" }}>📷</div>
                <div style={{ color: "#1DBEB4", fontWeight: "600", fontSize: "14px" }}>Hacé clic para subir imágenes</div>
                <div style={{ color: "#555", fontSize: "12px" }}>PNG, JPG, WEBP — podés seleccionar múltiples archivos</div>
                <input
                  id="img-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFiles}
                  style={{ display: "none" }}
                />
              </label>

              {/* Preview de imágenes subidas */}
              {images.length > 0 && (
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "14px" }}>
                  {images.map((img, idx) => (
                    <div key={idx} style={{ position: "relative" }}>
                      <img src={img.url} alt="" style={{
                        width: "80px", height: "80px", objectFit: "cover",
                        borderRadius: "8px", border: "2px solid rgba(29,190,180,0.4)",
                      }}/>
                      <button onClick={() => removeImage(idx)} style={{
                        position: "absolute", top: "-6px", right: "-6px",
                        width: "20px", height: "20px", borderRadius: "50%",
                        background: "#e74c3c", border: "none",
                        color: "#fff", fontSize: "11px", cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontWeight: "700",
                      }}>✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div style={{ marginTop: "2rem", display: "flex", gap: "12px" }}>
            <button onClick={handleSubmit} style={{
              background: "#1DBEB4", border: "none", cursor: "pointer",
              color: "#0d1a19", fontWeight: "700", fontSize: "15px",
              padding: "12px 28px", borderRadius: "10px",
              transition: "all 0.2s",
            }}
              onMouseEnter={e => e.currentTarget.style.background = "#25d4ca"}
              onMouseLeave={e => e.currentTarget.style.background = "#1DBEB4"}
            >
              Registrar equipo
            </button>
            <button onClick={() => { setForm({ name: "", cat: "Nieve", desc: "", price: "" }); setImages([]); setError(""); setSuccess(""); }}
              style={{
                background: "none", border: "1px solid rgba(255,255,255,0.1)",
                cursor: "pointer", color: "#aaa", fontSize: "14px",
                padding: "12px 20px", borderRadius: "10px",
              }}
            >
              Limpiar
            </button>
          </div>
        </div>

        {/* Products list */}
        <div style={{ marginTop: "3rem" }}>
          <h3 style={{ color: "#fff", fontWeight: "700", fontSize: "1.1rem", marginBottom: "1rem" }}>
            Inventario actual ({products.length} productos)
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {products.slice(0, 8).map(p => (
              <div key={p.id} style={{
                background: "#1e1e1f", border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "10px", padding: "12px 16px",
                display: "flex", alignItems: "center", gap: "14px"
              }}>
                <img src={p.img} alt={p.name} style={{ width: "44px", height: "44px", borderRadius: "8px", objectFit: "cover" }}/>
                <div style={{ flex: 1 }}>
                  <div style={{ color: "#fff", fontWeight: "600", fontSize: "14px" }}>{p.name}</div>
                  <div style={{ color: "#555", fontSize: "12px" }}>{p.cat} · ${p.price.toLocaleString("es-AR")}/día</div>
                </div>
              </div>
            ))}
            {products.length > 8 && (
              <p style={{ color: "#555", fontSize: "13px", textAlign: "center" }}>
                + {products.length - 8} productos más en el inventario
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer style={{
      background: "#0f0f10",
      borderTop: "1px solid rgba(255,255,255,0.06)",
      padding: "2.5rem 2rem",
    }}>
      <div style={{
        maxWidth: "1200px", margin: "0 auto",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: "1.5rem"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "36px", height: "36px",
            background: "linear-gradient(135deg, #1DBEB4, #54547E)",
            borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Georgia', serif", fontWeight: "bold", fontSize: "15px", color: "#fff",
          }}>Db</div>
          <div>
            <div style={{ color: "#fff", fontWeight: "700", fontSize: "15px" }}>
              Dash<span style={{ color: "#1DBEB4" }}>Bound</span>
            </div>
            <div style={{ color: "#444", fontSize: "12px" }}>© 2024 DashBound. Todos los derechos reservados.</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          {[IconFB, IconLI, IconTW, IconIG].map((Icon, i) => (
            <a key={i} href="#" style={{
              color: "#555", transition: "color 0.2s", display: "flex",
            }}
              onMouseEnter={e => e.currentTarget.style.color = "#1DBEB4"}
              onMouseLeave={e => e.currentTarget.style.color = "#555"}
            >
              <Icon/>
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

// ── MODAL ─────────────────────────────────────────────────────────────────────
function Modal({ title, onClose }) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "1rem",
    }} onClick={onClose}>
      <div style={{
        background: "#1e1e1f", border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "20px", padding: "2.5rem", maxWidth: "400px", width: "100%",
        position: "relative",
      }} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} style={{
          position: "absolute", top: "16px", right: "16px",
          background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: "20px"
        }}>✕</button>
        <div style={{
          width: "56px", height: "56px", borderRadius: "14px",
          background: "linear-gradient(135deg, #1DBEB4, #54547E)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'Georgia', serif", fontWeight: "bold", fontSize: "22px", color: "#fff",
          marginBottom: "1.5rem",
        }}>Db</div>
        <h3 style={{ color: "#fff", fontWeight: "800", fontSize: "1.4rem", marginBottom: "0.5rem" }}>{title}</h3>
        <p style={{ color: "#666", fontSize: "14px", marginBottom: "1.5rem" }}>
          Esta funcionalidad estará disponible en el Sprint 2. ¡Seguí explorando el catálogo!
        </p>
        <button onClick={onClose} style={{
          background: "#1DBEB4", border: "none", cursor: "pointer",
          color: "#0d1a19", fontWeight: "700", fontSize: "14px",
          padding: "10px 24px", borderRadius: "8px", width: "100%",
        }}>
          Entendido
        </button>
      </div>
    </div>
  );
}

// ── APP ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState("home"); // "home" | "admin" | "detail"
  const [modal, setModal] = useState(null);
  const [products, setProducts] = useState(PRODUCTS_RAW);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleAdd = useCallback((item) => {
    setProducts(prev => [...prev, { ...item, id: Date.now() }]);
  }, []);

  const handleDetail = useCallback((product) => {
    setSelectedProduct(product);
    setView("detail");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div style={{ fontFamily: "'Inter', 'Helvetica Neue', sans-serif", background: "#1A1A1B", minHeight: "100vh" }}>
      {/* Import Google Font */}
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
        onLogin={() => setModal("Iniciar sesión")}
        onRegister={() => setModal("Crear cuenta")}
        onAdmin={() => setView("admin")}
      />

      {view === "home" && (
        <main>
          <HeroSearch onSearch={() => {}} />
          <CategoriesSection />
          <ProductsSection onDetail={handleDetail} />
        </main>
      )}

      {view === "detail" && selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onBack={() => setView("home")}
        />
      )}

      {view === "admin" && (
        <AdminPanel
          products={products}
          onAdd={handleAdd}
          onBack={() => setView("home")}
        />
      )}

      <Footer />

      {modal && <Modal title={modal} onClose={() => setModal(null)} />}
    </div>
  );
}