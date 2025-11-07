'use client';

import React, { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import {
  Hammer,
  Ruler,
  Palette,
  Armchair,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Instagram,
  Facebook,
  Linkedin,
  CheckCircle,
} from "lucide-react";

// ------------------------------------------------------------
// Modern Light Theme – Foundry-inspired
// - Switch to airy, editorial light palette with warm neutrals & gold accent
// - Keep structure & micro-interactions; remove heavy dark overlays
// - Maintain built-in DevTests (toggle with ?test=1)
// ------------------------------------------------------------

// ---------- Motion Variants ----------
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.04 },
  },
};

const floatIn = (delay = 0) => ({
  hidden: { opacity: 0, scale: 0.98, y: 12 },
  show: { opacity: 1, scale: 1, y: 0, transition: { delay, duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
});

// ---------- Helper Components ----------
const Container = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>
);

const Section = ({ id, title, subtitle, children, className = "" }: { id?: string; title?: string; subtitle?: string; children: React.ReactNode; className?: string }) => (
  <section id={id} className={`py-16 md:py-24 ${className}`}>
    <Container>
      {(title || subtitle) && (
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="mb-10 text-center"
        >
          {subtitle && (
            <motion.p variants={fadeUp} className="mb-2 text-sm font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
              {subtitle}
            </motion.p>
          )}
          {title && (
            <motion.h2 variants={fadeUp} className="font-display text-3xl font-semibold tracking-tight text-[var(--fg)] md:text-4xl">
              {title}
            </motion.h2>
          )}
        </motion.div>
      )}
      {children}
    </Container>
  </section>
);

const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-1 text-xs text-[var(--fg-soft)]">
    {children}
  </span>
);

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition will-change-transform hover:-translate-y-0.5 hover:shadow-[0_10px_40px_rgba(0,0,0,0.09)] ${className}`}>{children}</div>
);

const Button = ({ children, href, variant = "solid", className = "" }: { children: React.ReactNode; href: string; variant?: string; className?: string }) => {
  // Responsif: kecilkan ukuran di HP
  const base = "relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs sm:px-5 sm:py-3 sm:text-sm font-semibold transition whitespace-nowrap";
  const styles =
    variant === "solid"
      ? "bg-[var(--fg)] text-[var(--bg)] hover:opacity-90"
      : "border border-[var(--line)] bg-transparent text-[var(--fg)] hover:bg-[var(--surface-strong)]";
  return (
    <motion.a href={href} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} className={`${base} ${styles} ${className}`}>
      {children}
    </motion.a>
  );
};

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 20, mass: 0.2 });
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed left-0 top-0 z-[60] h-[3px] w-full origin-left bg-[var(--accent)]"
    />
  );
};

// Light shimmer behind hero text (very subtle)
const SoftGlow = () => (
  <div className="pointer-events-none absolute -inset-x-10 top-1/4 -z-10 h-64 rounded-[56px] bg-[radial-gradient(50%_60%_at_50%_50%,rgba(210,164,86,0.14),rgba(210,164,86,0)_70%)] blur-2xl" />
);

const AnnouncementBar = () => (
  <div className="sticky top-0 z-[60] w-full border-b border-[var(--line)] bg-[var(--bg-soft)] text-[var(--fg)]">
    <div className="mx-auto flex h-9 w-full max-w-7xl items-center justify-center px-4 text-xs">
      <span className="truncate">Koleksi baru diunggah mingguan · Dapatkan penawaran eksklusif melalui newsletter</span>
    </div>
  </div>
);

// ---------- Dev Test Harness (toggle with ?test=1) ----------
function DevTests({ services, materials, gallery }) {
  const [results, setResults] = useState([]);
  useEffect(() => {
    const r = [];
    r.push({ name: "services length == 4", pass: Array.isArray(services) && services.length === 4 });
    r.push({ name: "materials length == 4", pass: Array.isArray(materials) && materials.length === 4 });
    r.push({ name: "gallery length == 6", pass: Array.isArray(gallery) && gallery.length === 6 });
    r.push({ name: "data-theme is light", pass: document.documentElement.getAttribute('data-theme') === 'light' });
    setResults(r);
  }, [services, materials, gallery]);

  return (
    <div className="fixed bottom-4 right-4 z-[70] w-[280px] rounded-xl border border-[var(--line)] bg-[var(--surface)] p-3 text-xs text-[var(--fg)] shadow-xl backdrop-blur">
      <div className="mb-2 font-semibold">Dev Tests</div>
      <ul className="space-y-1">
        {results.map((t, i) => (
          <li key={i} className="flex items-center justify-between gap-2">
            <span className="truncate">{t.name}</span>
            <span className={`ml-2 inline-flex h-5 min-w-[2.25rem] items-center justify-center rounded ${t.pass ? "bg-emerald-500/20 text-emerald-700" : "bg-rose-500/20 text-rose-700"}`}>
              {t.pass ? "PASS" : "FAIL"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ---------- Main Page ----------
export default function LandingPage() {
  const [activeMaterial, setActiveMaterial] = useState("Kayu Solid");
  const [showTests, setShowTests] = useState(false);

  useEffect(() => {
    // Apply light theme via data attribute (for tests & theming)
    const prev = document.documentElement.getAttribute('data-theme');
    document.documentElement.setAttribute('data-theme', 'light');

    // smooth scrolling for internal anchors
    const handler = (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const el = document.querySelector(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };
    document.addEventListener('click', handler);

    // enable dev tests if ?test=1
    try {
      const q = new URLSearchParams(window.location.search);
      setShowTests(q.get('test') === '1');
    } catch (_) {}

    return () => {
      document.removeEventListener('click', handler);
      // restore theme if previously set
      if (prev) document.documentElement.setAttribute('data-theme', prev);
    };
  }, []);

  const materials = [
    {
      name: "Kayu Solid",
      desc: "Oak & teak bersertifikasi, tahan lama, serat natural elegan.",
      img: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1974&auto=format&fit=crop",
    },
    {
      name: "Veneer & Plywood",
      desc: "Ringan, stabil, tampilan premium dengan biaya efisien.",
      img: "https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?q=80&w=1974&auto=format&fit=crop",
    },
    {
      name: "Metal & Powdercoat",
      desc: "Rangka kokoh, garis modern, finishing tahan gores.",
      img: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1974&auto=format&fit=crop",
    },
    {
      name: "Upholstery",
      desc: "Fabric & kulit microfibre, nyaman dan mudah dirawat.",
      img: "https://images.unsplash.com/photo-1501045661006-2f8a5f0c02f1?q=80&w=1974&auto=format&fit=crop",
    },
  ];

  const services = [
    {
      icon: <Ruler className="h-6 w-6" />,
      title: "Desain & Konsultasi",
      desc: "Diskusikan gaya, fungsi, dan ukuran. Kami terjemahkan kebutuhan Anda menjadi blueprint presisi.",
    },
    {
      icon: <Hammer className="h-6 w-6" />,
      title: "Produksi Kustom",
      desc: "Dikerjakan pengrajin berpengalaman dengan standar workshop industrial dan QC berlapis.",
    },
    {
      icon: <Palette className="h-6 w-6" />,
      title: "Finishing Premium",
      desc: "Pilihan finishing matte, satin, high-gloss, hingga tekstur natural yang tahan lama.",
    },
    {
      icon: <Armchair className="h-6 w-6" />,
      title: "Instalasi & Garansi",
      desc: "Tim onsite memastikan pemasangan rapi. Garansi material & pengerjaan untuk ketenangan Anda.",
    },
  ];

  const gallery = [
    "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1493666438817-866a91353ca9?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=2069&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=2080&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1484101403633-562f891dc89a?q=80&w=2070&auto=format&fit=crop",
  ];

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] selection:bg-[var(--accent)/15]">
      {/* CSS Variables for theme */}
      <style>{`
        :root {
          --bg: #faf7f3; /* warm paper */
          --bg-soft: #fffaf3; /* subtle cream */
          --surface: #ffffff; /* cards */
          --surface-strong: #f6f2ea; /* hovers */
          --fg: #0f0f0f; /* ink */
          --fg-soft: #3f3a34; /* muted text */
          --muted: #7d7468; /* captions */
          --line: rgba(15,15,15,0.12); /* hairline */
          --accent: #d2a456; /* gold accent */
        }
        .font-display{ font-family: ui-serif, "Georgia", "Times New Roman", serif; }
      `}</style>

      {/* <AnnouncementBar /> */}
      <ScrollProgress />

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--bg)/80] backdrop-blur">
        <Container className="flex h-16 items-center justify-between">
          <a href="#" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-[var(--fg)]" />
            <span className="text-lg font-semibold tracking-tight">ASKCRAFT FURNITURE</span>
          </a>
          <nav className="hidden items-center gap-8 md:flex">
            {[{ href: "#layanan", label: "Layanan" }, { href: "#proses", label: "Proses" }, { href: "#material", label: "Material" }, { href: "#showcase", label: "Showcase" }, { href: "#kontak", label: "Kontak" }].map((l) => (
              <a key={l.href} href={l.href} className="group relative text-sm text-[var(--fg-soft)] hover:text-[var(--fg)]">
                {l.label}
                <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-[var(--fg)] transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>
          <Button href="#kontak" className="group">
            <span className="sm:hidden">Konsultasi</span>
            <span className="hidden sm:inline">Konsultasi Gratis</span>
            <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition group-hover:translate-x-0.5" />
          </Button>
        </Container>
      </header>

      {/* HERO */}
      <section className="relative flex min-h-[88vh] items-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=2070&auto=format&fit=crop"
          alt="Hero background"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Fade to light instead of dark */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)/70] to-transparent" />
        <Container>
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="relative z-10 max-w-2xl py-24">
            <SoftGlow />
            <motion.div variants={fadeUp}>
              <Badge><CheckCircle className="h-4 w-4" /> Custom Furniture Premium</Badge>
            </motion.div>
            <motion.h1 variants={fadeUp} className="mt-4 font-display text-5xl font-semibold leading-tight tracking-tight md:text-7xl">
              Ruang Elegan, <span className="text-[var(--accent)]">Didesain</span> Khusus Anda
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-4 max-w-xl text-base text-[var(--fg-soft)] md:text-lg">
              Dari ide ke instalasi—built-in, loose furniture, hingga proyek interior dengan presisi dan estetika modern.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center gap-3">
              <Button href="#showcase">Lihat Showcase</Button>
              <Button href="#layanan" variant="outline">Pelajari Layanan</Button>
            </motion.div>
            <motion.div variants={fadeUp} className="mt-8 flex gap-4 text-xs text-[var(--muted)]">
              <Badge>10+ Tahun Pengalaman</Badge>
              <Badge>500+ Proyek Selesai</Badge>
              <Badge>Garansi Pengerjaan</Badge>
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* FEATURED COLLECTIONS */}
      <Section id="koleksi" subtitle="Koleksi Unggulan" title="Temukan Sesuai Ruang Anda">
        <div className="grid gap-4 md:grid-cols-2">
          {[
            {title: "Ruang Keluarga", cta: "Sofa & TV Cabinet", img: "https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=2070&auto=format&fit=crop"},
            {title: "Dapur & Pantry", cta: "Kitchen Set", img: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=2070&auto=format&fit=crop"},
            {title: "Kamar Tidur", cta: "Wardrobe & Bedframe", img: "https://images.unsplash.com/photo-1493666438817-866a91353ca9?q=80&w=2070&auto=format&fit=crop"},
            {title: "Ruang Kerja", cta: "Workstation", img: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=2070&auto=format&fit=crop"}
          ].map((it, i) => (
            <a key={i} href="#showcase" className="group relative overflow-hidden rounded-2xl border border-[var(--line)]">
              <img src={it.img} alt={it.title} className="h-60 w-full object-cover transition duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.35)] via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4">
                <div className="font-display text-lg font-semibold text-white drop-shadow">{it.title}</div>
                <div className="mt-1 inline-flex items-center gap-2 text-xs text-white/90 drop-shadow">
                  {it.cta} <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </Section>

      {/* SERVICES */}
      <Section id="layanan" subtitle="Apa yang Kami Kerjakan" title="Layanan Utama">
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {services.map((s, i) => (
            <motion.div key={i} variants={fadeUp} whileHover={{ y: -6 }}>
              <Card className="h-full group">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--surface-strong)] ring-1 ring-inset ring-[var(--line)] text-[var(--fg)]">
                  {s.icon}
                </div>
                <h3 className="text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-[var(--fg-soft)]">{s.desc}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* PROCESS */}
      <Section id="proses" subtitle="Bagaimana Kami Bekerja" title="Proses Kerja">
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid gap-6 md:grid-cols-4">
          {["Konsultasi", "Desain Teknis", "Produksi", "Instalasi"].map((step, i) => (
            <motion.div key={step} variants={fadeUp}>
              <Card className="h-full">
                <div className="mb-3 text-sm text-[var(--muted)]">Langkah {i + 1}</div>
                <h4 className="text-xl font-semibold">{step}</h4>
                <p className="mt-2 text-sm text-[var(--fg-soft)]">
                  {i === 0 && "Diskusi kebutuhan, gaya, material, & budget. Survei lapangan bila diperlukan."}
                  {i === 1 && "Gambar kerja, render 3D, dan revisi hingga disetujui."}
                  {i === 2 && "Pemotongan presisi CNC, perakitan, finishing, dan QC berlapis."}
                  {i === 3 && "Pengantaran, instalasi rapi, serah terima & garansi."}
                </p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* MATERIALS */}
      <Section id="material" subtitle="Kualitas Terpilih" title="Materials & Finishes">
        <div className="grid items-start gap-6 md:grid-cols-2">
          <Card>
            <div className="flex flex-wrap gap-2">
              {materials.map((m) => (
                <button
                  key={m.name}
                  onClick={() => setActiveMaterial(m.name)}
                  className={`rounded-full px-4 py-2 text-sm transition ${
                    activeMaterial === m.name
                      ? "bg-[var(--fg)] text-[var(--bg)]"
                      : "border border-[var(--line)] text-[var(--fg)] hover:bg-[var(--surface-strong)]"
                  }`}
                >
                  {m.name}
                </button>
              ))}
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {materials.map((m) => (
                <motion.div key={m.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: activeMaterial === m.name ? 1 : 0.5, y: 0 }} transition={{ duration: 0.4 }} className={`col-span-2 md:col-span-1 ${activeMaterial === m.name ? "block" : "hidden md:block"}`}>
                  <div className="overflow-hidden rounded-xl">
                    <motion.img whileHover={{ scale: 1.05 }} src={m.img} alt={m.name} className="h-40 w-full object-cover" />
                  </div>
                  <h5 className="mt-3 font-semibold">{m.name}</h5>
                  <p className="text-sm text-[var(--fg-soft)]">{m.desc}</p>
                </motion.div>
              ))}
            </div>
          </Card>
          <Card>
            <h4 className="text-xl font-semibold">Standar Finishing</h4>
            <ul className="mt-4 space-y-3 text-sm text-[var(--fg-soft)]">
              {["PU / NC Matte & Satin", "Water-based eco finish", "Stain natural & open pores", "Powdercoat anti-gores", "Upholstery tahan noda"].map((item, i) => (
                <motion.li key={item} variants={floatIn(i * 0.06)} initial="hidden" whileInView="show" viewport={{ once: true }} className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 h-5 w-5 text-[var(--accent)]" />
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
            <div className="mt-6 rounded-xl bg-[var(--surface-strong)] p-4 text-sm text-[var(--fg-soft)]">
              Kami membantu memilih kombinasi material & finishing terbaik agar selaras dengan konsep interior Anda.
            </div>
          </Card>
        </div>
      </Section>

      {/* SHOWCASE */}
      <Section id="showcase" subtitle="Kumpulan Karya" title="Showcase Terbaru">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {gallery.map((src, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.05 }}>
              <div className="group relative overflow-hidden rounded-2xl border border-[var(--line)]">
                <motion.img whileHover={{ scale: 1.06 }} src={src} alt={`Showcase ${i + 1}`} className="h-64 w-full object-cover" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.25)] via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Button href="#kontak" variant="outline">Minta Katalog PDF <ArrowRight className="h-4 w-4" /></Button>
        </div>
      </Section>

      {/* TESTIMONIALS */}
      <Section subtitle="Apa Kata Klien" title="Testimoni">
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid gap-6 md:grid-cols-3">
          {[{
            name: "Raka – Jakarta",
            text: "Built-in wardrobe sangat presisi. Finishing matte-nya rapi dan tidak berbau. Proses dari desain sampai instalasi mulus.",
          }, {
            name: "Cindy – Bandung",
            text: "Tim responsif dengan render 3D yang detail. Sofa custom terasa premium, dudukannya nyaman sekali.",
          }, {
            name: "Adit – Surabaya",
            text: "Rak display toko kami terlihat modern dan kokoh. Deadlinenya tepat waktu, recommended!",
          }].map((t, i) => (
            <motion.div key={i} variants={fadeUp}>
              <Card>
                <p className="text-sm leading-relaxed text-[var(--fg-soft)]">“{t.text}”</p>
                <div className="mt-4 text-sm font-semibold text-[var(--fg)]">{t.name}</div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* POPULAR PRODUCTS */}
      <Section id="produk" subtitle="Populer Saat Ini" title="Produk Kustom Favorit">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {[
            {name: "Wardrobe Sliding Minimalis", price: "Mulai 7,5 jt", img: gallery[1]},
            {name: "Kitchen Set Letter L", price: "Mulai 12 jt", img: gallery[2]},
            {name: "TV Cabinet Floating", price: "Mulai 3,5 jt", img: gallery[0]},
            {name: "Meja Kerja Industrial", price: "Mulai 2,9 jt", img: gallery[3]},
            {name: "Rak Display Retail", price: "Mulai 4,2 jt", img: gallery[4]},
            {name: "Bedframe Upholstery", price: "Mulai 6,8 jt", img: gallery[5]},
          ].map((p, i) => (
            <div key={i} className="rounded-2xl border border-[var(--line)] p-2">
              <div className="overflow-hidden rounded-xl">
                <img src={p.img} alt={p.name} className="h-56 w-full object-cover transition duration-500 hover:scale-105" />
              </div>
              <div className="mt-3 flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold">{p.name}</div>
                  <div className="text-xs text-[var(--muted)]">{p.price}</div>
                </div>
                <Button href="#kontak" className="px-3 py-2 text-xs">Ajukan Penawaran</Button>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section id="kontak" className="pt-0">
        <div className="relative overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-8 md:p-12">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[var(--surface-strong)] blur-3xl" />
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div>
              <h3 className="font-display text-3xl font-semibold md:text-4xl">Siap Memulai Proyek Anda?</h3>
              <p className="mt-2 max-w-md text-sm text-[var(--fg-soft)]">
                Kirim denah, ukuran, dan referensi gaya. Kami akan kembali dengan estimasi dan timeline eksekusi.
              </p>
              <div className="mt-6 flex flex-col gap-3 text-sm">
                <a className="inline-flex items-center gap-2" href="mailto:hello@askcraft.com"><Mail className="h-5 w-5" /> hello@askcraft.com</a>
                <a className="inline-flex items-center gap-2" href="tel:+6281234567890"><Phone className="h-5 w-5" /> +62 812-3456-7890</a>
                <span className="inline-flex items-center gap-2"><MapPin className="h-5 w-5" /> Jakarta, Indonesia</span>
              </div>
              <div className="mt-6 flex items-center gap-4">
                <a href="#" aria-label="Instagram" className="rounded-full border border-[var(--line)] p-2 hover:bg-[var(--surface-strong)]"><Instagram className="h-5 w-5" /></a>
                <a href="#" aria-label="Facebook" className="rounded-full border border-[var(--line)] p-2 hover:bg-[var(--surface-strong)]"><Facebook className="h-5 w-5" /></a>
                <a href="#" aria-label="LinkedIn" className="rounded-full border border-[var(--line)] p-2 hover:bg-[var(--surface-strong)]"><Linkedin className="h-5 w-5" /></a>
              </div>
            </div>
            <Card>
              <h4 className="text-lg font-semibold">Form Singkat</h4>
              <form className="mt-4 grid gap-4 md:grid-cols-2">
                <input className="col-span-2 rounded-xl border border-[var(--line)] bg-white px-4 py-3 text-sm outline-none placeholder:text-[var(--muted)]" placeholder="Nama" />
                <input className="col-span-2 md:col-span-1 rounded-xl border border-[var(--line)] bg-white px-4 py-3 text-sm outline-none placeholder:text-[var(--muted)]" placeholder="Email" />
                <input className="col-span-2 md:col-span-1 rounded-xl border border-[var(--line)] bg-white px-4 py-3 text-sm outline-none placeholder:text-[var(--muted)]" placeholder="Telepon" />
                <textarea rows={4} className="col-span-2 rounded-xl border border-[var(--line)] bg-white px-4 py-3 text-sm outline-none placeholder:text-[var(--muted)]" placeholder="Ceritakan kebutuhan Anda (ukuran, gaya, deadline)"></textarea>
                <Button href="#" className="col-span-2 justify-center">Kirim Brief <ArrowRight className="h-4 w-4" /></Button>
              </form>
            </Card>
          </div>
        </div>
      </Section>

      {/* FOOTER */}
      <footer className="border-t border-[var(--line)] py-10">
        <Container className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-xl bg-[var(--fg)]" />
            <span className="text-sm font-semibold tracking-tight">ASKCRAFT FURNITURE</span>
          </div>
          <p className="text-center text-xs text-[var(--muted)] md:text-left">© {new Date().getFullYear()} AskCraft Furniture. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs text-[var(--muted)]">
            <a href="#" className="hover:text-[var(--fg)]">Kebijakan Privasi</a>
            <a href="#" className="hover:text-[var(--fg)]">Syarat Layanan</a>
          </div>
        </Container>
      </footer>

      {showTests && <DevTests services={services} materials={materials} gallery={gallery} />}
    </div>
  );
}