"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useClerk, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { SERVICES, PROS, TESTIS } from "@/lib/data";
import { 
  Search, 
  MapPin, 
  ChevronDown, 
  User, 
  ClipboardList, 
  CheckCircle2, 
  ShieldCheck, 
  Award, 
  RefreshCcw, 
  PhoneCall, 
  CreditCard,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Home as HomeIcon,
  Star,
  Quote,
  Instagram,
  Facebook,
  Twitter,
  LayoutDashboard,
  LogOut,
  Wallet,
  Zap,
  Droplet,
  Paintbrush,
  Sparkles,
  Snowflake,
  Wind,
  Bug,
  Lamp,
  Scissors
} from "lucide-react";

export default function Home() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedCat, setSelectedCat] = useState("all");
  const [toast, setToast] = useState<string | null>(null);
  const [view, setView] = useState("main"); // main or dash
  const [dashPanel, setDashPanel] = useState("overview");
  const [orders, setOrders] = useState<any[]>([]);

  // Booking states
  const [selSvc, setSelSvc] = useState<any>(null);
  const [bStep, setBStep] = useState(1);
  const [bData, setBData] = useState<any>({
    sub: null,
    date: null,
    time: null,
    pro: null,
    addr: { name: "", phone: "", pin: "", flat: "", city: "Ranchi" },
    pay: "upi"
  });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % 5);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    console.log("[user-auth-debug]", {
      isLoaded,
      isSignedIn: !!user,
      userId: user?.id ?? null,
      email: user?.primaryEmailAddress?.emailAddress ?? null,
      path: typeof window !== "undefined" ? window.location.pathname : null,
      hash: typeof window !== "undefined" ? window.location.hash : null,
    });
  }, [isLoaded, user]);

  const initialsFromName = (name: string) =>
    name
      .split(" ")
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  const fullName =
    user?.fullName?.trim() ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim() ||
    user?.primaryEmailAddress?.emailAddress?.split("@")[0] ||
    "User";
  const userEmail = user?.primaryEmailAddress?.emailAddress || "";
  const currentUser = user
    ? { name: fullName, email: userEmail, init: initialsFromName(fullName) }
    : null;
  const activeView = currentUser ? view : "main";
  const authModalOpen = isAuthModalOpen && !currentUser;

  const openAuth = () => {
    if (currentUser) {
      setView("dash");
      setDashPanel("overview");
    } else {
      console.log("[user-auth-debug] redirecting to /sign-in from openAuth");
      router.push("/sign-in");
    }
  };

  const openBooking = (id: string) => {
    if (!currentUser) {
      console.log("[user-auth-debug] booking blocked: redirecting to /sign-in");
      router.push("/sign-in");
      showToast("Sign in to book");
      return;
    }
    const s = SERVICES.find(x => x.id === id);
    if (!s) return;
    setSelSvc(s);
    setBStep(1);
    setBData({
        ...bData,
        sub: s.subs[0],
        pro: PROS[0].name,
        date: new Date(Date.now() + 86400000).toLocaleDateString('en-IN'),
        time: "10:00 AM"
    });
    setIsBookModalOpen(true);
  };

  const placeOrder = () => {
    const newOrder = {
      id: `#SH${1000 + orders.length + 1}`,
      service: selSvc.name,
      sub: bData.sub.n,
      date: bData.date,
      time: bData.time,
      pro: bData.pro,
      price: bData.sub.p + Math.round(bData.sub.p * 0.05),
      status: "confirmed",
      img: selSvc.img,
      createdAt: new Date().toLocaleDateString('en-IN')
    };
    setOrders([newOrder, ...orders]);
    setBStep(6);
    showToast("Order placed successfully!");
  };

  const handleLogout = async () => {
    await signOut();
    setView("main");
    setDashPanel("overview");
    showToast("Signed out");
  };

  const filteredServices = selectedCat === "all" ? SERVICES : SERVICES.filter(s => s.cat === selectedCat);

  return (
    <div className="min-h-screen font-sans">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] bg-slate2-900 text-white px-5 py-3 rounded-full text-sm font-semibold flex items-center gap-2.5 shadow-2xl transition-all scale-100">
          <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse-dot"></span>
          <span>{toast}</span>
        </div>
      )}

      {/* Auth Modal */}
      <div className={`modal-wrap ${authModalOpen ? 'open' : ''}`} onClick={closeAuthModal}>
        <div className="modal-box bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative" onClick={e => e.stopPropagation()}>
          <div className="h-40 relative overflow-hidden">
            <Image src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=700&q=80" fill className="object-cover" alt="service"/>
            <div className="absolute inset-0 bg-gradient-to-br from-brand-700/90 to-slate2-900/80 flex flex-col items-center justify-center gap-1 text-center">
              <div className="font-display text-3xl font-bold text-white">Service<span className="text-accent-400">Hub</span></div>
              <div className="text-xs text-white/70 font-semibold tracking-widest uppercase px-4">Home Services at Your Doorstep</div>
            </div>
          </div>
          <button onClick={closeAuthModal} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 text-white hover:bg-white/40 flex items-center justify-center text-lg transition-all z-10">✕</button>
          <div className="p-7">
            <p className="mb-4 text-sm font-semibold text-slate2-700">Continue with secure user login/signup.</p>
            <div className="space-y-3">
              <button
                onClick={() => router.push("/sign-in")}
                className="w-full bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 text-white font-bold py-3.5 rounded-xl transition-all hover:shadow-brand text-sm"
              >
                Go to Sign In
              </button>
              <button
                onClick={() => router.push("/sign-up")}
                className="w-full border-2 border-slate2-200 text-slate2-700 font-bold py-3.5 rounded-xl transition-all hover:border-brand-500 hover:text-brand-600 text-sm"
              >
                Go to Create Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <div className={`modal-wrap ${isBookModalOpen ? 'open' : ''}`} onClick={() => setIsBookModalOpen(false)}>
        <div className="modal-box bg-white rounded-2xl w-full max-w-2xl shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-brand-700 to-brand-500 px-7 py-5 relative">
                <button onClick={() => setIsBookModalOpen(false)} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 text-white hover:bg-white/40 flex items-center justify-center text-lg z-10 font-bold">✕</button>
                <h2 className="font-display text-xl font-bold text-white">{selSvc?.name}</h2>
                <p className="text-brand-100 text-sm mt-0.5">Fill details to confirm booking</p>
            </div>
            
            <div className="p-7">
                {bStep === 1 && (
                    <div>
                        <p className="text-xs font-bold text-slate2-500 uppercase tracking-widest mb-4">Choose Service Type</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {selSvc?.subs.map((s: any, i: number) => (
                                <div key={i} onClick={() => setBData({...bData, sub: s})} className={`flex items-center gap-3 p-3.5 border-2 ${bData.sub?.n === s.n ? 'border-brand-500 bg-brand-50' : 'border-slate2-200'} rounded-xl cursor-pointer transition-all`}>
                                    <div>
                                        <div className="text-sm font-bold text-slate2-800">{s.n}</div>
                                        <div className="text-xs text-slate2-400 mt-0.5">₹{s.p}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => setBStep(2)} className="w-full mt-6 bg-brand-600 text-white font-bold py-3 rounded-xl">Continue →</button>
                    </div>
                )}
                {bStep === 2 && (
                    <div>
                        <p className="text-xs font-bold text-slate2-500 uppercase tracking-widest mb-4 text-slate-500">Date & Time</p>
                        <div className="grid grid-cols-4 gap-2 mb-6 text-slate-800">
                            {[1,2,3,4,5,6,7,8].map(i => {
                                const d = new Date(); d.setDate(d.getDate() + i);
                                const ds = d.toLocaleDateString('en-IN');
                                return (
                                    <div key={i} onClick={() => setBData({...bData, date: ds})} className={`text-center py-2 border-2 ${bData.date === ds ? 'border-brand-500 bg-brand-50' : 'border-slate2-200'} rounded-xl cursor-pointer`}>
                                        <div className="text-[10px] font-bold text-slate2-400 uppercase">{d.toLocaleDateString('en-IN', {weekday: 'short'})}</div>
                                        <div className="font-display text-lg font-bold text-slate2-900">{d.getDate()}</div>
                                    </div>
                                )
                            })}
                        </div>
                        <button onClick={() => setBStep(5)} className="w-full bg-brand-600 text-white font-bold py-3 rounded-xl">Continue →</button>
                        <button onClick={() => setBStep(1)} className="w-full mt-2 text-slate2-400 text-sm">← Back</button>
                    </div>
                )}
                {bStep === 5 && (
                    <div>
                        <p className="text-xs font-bold text-slate2-500 uppercase tracking-widest mb-4 text-slate-500">Summary</p>
                        <div className="bg-slate2-50 p-4 rounded-xl mb-6">
                            <div className="flex justify-between font-bold mb-2 text-slate-800"><span>{selSvc?.name}</span><span>₹{bData.sub?.p}</span></div>
                            <div className="text-sm text-slate2-500">Scheduled for {bData.date} at {bData.time}</div>
                        </div>
                        <button onClick={placeOrder} className="w-full bg-brand-600 text-white font-bold py-3 rounded-xl">Place Order</button>
                        <button onClick={() => setBStep(2)} className="w-full mt-2 text-slate2-400 text-sm">← Back</button>
                    </div>
                )}
                {bStep === 6 && (
                    <div className="text-center py-6">
                        <div className="w-20 h-20 rounded-full bg-brand-500 flex items-center justify-center text-4xl mx-auto mb-4 text-white">✓</div>
                        <h3 className="text-2xl font-bold mb-2 text-slate-900">Confirmed!</h3>
                        <button onClick={() => {setIsBookModalOpen(false); setView('dash'); setDashPanel('orders')}} className="bg-brand-600 text-white px-8 py-3 rounded-xl font-bold">View Orders</button>
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white sticky top-0 z-[200] border-b border-slate2-200 shadow-sm" id="mainHeader">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-4 py-2.5">
          <div className="flex items-center gap-6">
            <button onClick={() => setView('main')} className="font-display text-2xl font-bold text-slate2-900 shrink-0 outline-none">
              Service<span className="text-brand-600">Hub</span>
            </button>
            
            {/* Location Selector */}
            <div className="hidden lg:flex items-center gap-3 px-4 py-2 border border-slate2-200 rounded-xl bg-slate2-50 cursor-pointer hover:border-brand-500 transition-all group">
              <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-rose-500 fill-rose-500/20" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate2-400 uppercase tracking-widest leading-none mb-0.5">Deliver To</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[13px] font-bold text-slate2-900 leading-none">Ranchi, Jharkhand</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate2-400 group-hover:text-brand-500 transition-colors" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 max-w-2xl flex items-center bg-slate2-50 border border-slate2-200 rounded-xl overflow-hidden group focus-within:border-brand-500 transition-all">
            <div className="pl-4 pr-2">
              <Search className="w-4 h-4 text-slate2-400 group-focus-within:text-brand-500" />
            </div>
            <input 
              placeholder='Search "AC repair", "cleaning", "plumber"...' 
              className="flex-1 bg-transparent py-2.5 text-sm outline-none text-slate-800 placeholder:text-slate2-400 font-medium"
            />
            <button className="bg-brand-600 hover:bg-brand-700 text-white font-bold px-6 py-2.5 text-sm transition-all mr-1 rounded-lg my-1">
              Search
            </button>
          </div>

          <div className="flex items-center gap-5">
            <div className="flex items-center gap-4">
              {!isLoaded ? (
                <div className="h-10 w-40 animate-pulse rounded-xl bg-slate2-100" />
              ) : currentUser ? (
                <div className="flex items-center gap-2 rounded-xl border border-slate2-200 bg-white px-3 py-2">
                  <span className="max-w-28 truncate text-[11px] font-bold text-slate2-700 sm:max-w-44 sm:text-xs">
                    {currentUser.email}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="rounded-lg bg-slate2-900 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white hover:bg-slate2-700 sm:px-2.5"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button onClick={openAuth} className="flex flex-col items-center gap-1 text-slate2-600 hover:text-brand-600 transition-all group">
                  <div className="p-1.5 rounded-lg group-hover:bg-brand-50 transition-colors">
                    <User className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-slate2-500 group-hover:text-brand-600">Account</span>
                </button>
              )}
              <button 
                onClick={() => {
                  if(!currentUser) { setIsAuthModalOpen(true); showToast("Sign in to view orders"); }
                  else { setView('dash'); setDashPanel('orders'); }
                }} 
                className="flex flex-col items-center gap-1 text-slate2-600 hover:text-brand-600 transition-all group"
              >
                <div className="p-1.5 rounded-lg group-hover:bg-brand-50 transition-colors">
                  <ClipboardList className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-slate2-500 group-hover:text-brand-600">Orders</span>
              </button>
            </div>
            <Link
              href="/admin/dashboard"
              className="hidden xl:inline-flex rounded-xl border border-slate2-200 px-4 py-2.5 text-sm font-bold text-slate2-700 transition hover:border-brand-500 hover:text-brand-600"
            >
              Admin
            </Link>
            <button onClick={() => openBooking(SERVICES[0].id)} className="bg-brand-600 hover:bg-brand-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all shadow-sm hover:shadow-brand whitespace-nowrap">
              Book Service
            </button>
          </div>
        </div>
      </header>

      {activeView === 'main' ? (
        <main>
          {/* Hero */}
          <section className="relative h-[480px] overflow-hidden bg-slate-900 group">
            {SERVICES.slice(0, 5).map((s, i) => (
              <div key={i} className={`hero-slide ${activeSlide === i ? 'active' : ''}`}>
                <Image src={s.img} fill className="object-cover opacity-60 transition-transform duration-[10000ms] group-hover:scale-110" alt={s.name} priority={i === 0}/>
                <div className="absolute inset-0 bg-gradient-to-r from-slate2-900/90 via-slate2-900/40 to-transparent"></div>
                <div className="absolute inset-0 flex items-center max-w-7xl mx-auto px-5">
                  <div className="slide-content max-w-2xl">
                    <div className="inline-flex items-center gap-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 text-white/90 text-xs font-bold tracking-widest uppercase mb-5">
                      <span className="w-2 h-2 bg-brand-400 rounded-full animate-pulse"></span>
                      50,000+ Happy Customers
                    </div>
                    <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-6 leading-[1.15]">
                      {i === 0 ? <>Professional <span className="text-brand-400">Home Services</span><br/>at Your Doorstep</> : s.name}
                    </h1>
                    <p className="text-white/70 text-xl mb-8 max-w-lg leading-relaxed font-medium">{s.desc}</p>
                    <div className="flex flex-wrap gap-4">
                      <button onClick={() => openBooking(s.id)} className="bg-brand-500 hover:bg-brand-400 text-white font-bold px-10 py-4 rounded-2xl transition-all hover:-translate-y-1 shadow-brand text-lg">Book Now</button>
                      <button className="bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold px-10 py-4 rounded-2xl text-lg transition-all hover:bg-white/20">Explore All</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {/* Slider Controls */}
            <div className="absolute bottom-10 right-10 flex gap-3 z-10">
              <button onClick={() => setActiveSlide((activeSlide - 1 + 5) % 5)} className="w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all group/btn">
                <ChevronLeft className="w-6 h-6 group-hover/btn:-translate-x-0.5 transition-transform" />
              </button>
              <button onClick={() => setActiveSlide((activeSlide + 1) % 5)} className="w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all group/btn">
                <ChevronRight className="w-6 h-6 group-hover/btn:translate-x-0.5 transition-transform" />
              </button>
            </div>
            {/* Slide Indicators */}
            <div className="absolute left-10 bottom-10 flex gap-2 z-10">
              {[0,1,2,3,4].map(idx => (
                <div key={idx} className={`h-1.5 rounded-full transition-all duration-500 ${activeSlide === idx ? 'w-10 bg-brand-500' : 'w-2 bg-white/30'}`} />
              ))}
            </div>
          </section>

          {/* Trust Bar */}
          <div className="bg-white border-b border-slate2-100 py-3.5 px-4">
            <div className="max-w-7xl mx-auto flex items-center justify-center gap-10 flex-wrap">
              <div className="flex items-center gap-2.5 text-sm font-bold text-slate2-700 tracking-tight">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Background Verified</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm font-bold text-slate2-700 tracking-tight">
                <ShieldCheck className="w-4 h-4 text-brand-500" />
                <span>Fully Insured Professionals</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm font-bold text-slate2-700 tracking-tight">
                <Award className="w-4 h-4 text-amber-500" />
                <span>100% Satisfaction Guarantee</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm font-bold text-slate2-700 tracking-tight">
                <RefreshCcw className="w-4 h-4 text-blue-500" />
                <span>Free Re-service Promise</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm font-bold text-slate2-700 tracking-tight">
                <CreditCard className="w-4 h-4 text-purple-500" />
                <span>Secure Payments</span>
              </div>
            </div>
          </div>

          {/* Services Grid */}
          <div className="max-w-7xl mx-auto px-5 py-12">
            <div className="flex gap-2.5 overflow-x-auto pb-5 mb-8 no-scrollbar scroll-smooth">
              {[
                { id: "all", label: "All Services", icon: <HomeIcon className="w-4 h-4" /> },
                { id: "cleaning", label: "Cleaning", icon: <Sparkles className="w-4 h-4" /> },
                { id: "ac", label: "AC & Appliances", icon: <Snowflake className="w-4 h-4" /> },
                { id: "plumbing", label: "Plumbing", icon: <Droplet className="w-4 h-4" /> },
                { id: "electrical", label: "Electrical", icon: <Zap className="w-4 h-4" /> },
                { id: "painting", label: "Painting", icon: <Paintbrush className="w-4 h-4" /> },
                { id: "salon", label: "Salon & Spa", icon: <Scissors className="w-4 h-4" /> },
                { id: "pest", label: "Pest Control", icon: <Bug className="w-4 h-4" /> },
                { id: "furniture", label: "Carpentry", icon: <Lamp className="w-4 h-4" /> },
              ].map(c => (
                <button 
                  key={c.id} 
                  onClick={() => setSelectedCat(c.id)} 
                  className={`shrink-0 flex items-center gap-2.5 px-6 py-3 rounded-full text-sm font-bold border transition-all duration-300 whitespace-nowrap ${
                    selectedCat === c.id 
                    ? 'bg-brand-600 border-brand-600 text-white shadow-brand scale-105' 
                    : 'bg-white border-slate2-200 text-slate2-700 hover:border-brand-400 hover:bg-slate2-50'
                  }`}
                >
                  <span className={selectedCat === c.id ? 'text-white' : 'text-slate2-400 group-hover:text-brand-500'}>
                    {c.icon}
                  </span>
                  {c.label}
                </button>
              ))}
            </div>

            {/* Section Header */}
            <div className="flex items-end justify-between mb-7">
              <div>
                <p className="text-xs font-bold text-brand-600 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                  <span className="inline-block w-4 h-0.5 bg-brand-500"></span>Popular Services
                </p>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-slate2-900">
                  Top <em className="not-italic text-brand-600">Home Services</em>
                </h2>
              </div>
              <button className="hidden md:flex items-center gap-1.5 border-2 border-slate2-200 hover:border-brand-500 hover:text-brand-600 rounded-xl px-4 py-2.5 text-sm font-bold text-slate2-600 transition-all">View All →</button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredServices.map(s => (
                <div key={s.id} className="srv-card bg-white rounded-2xl overflow-hidden shadow-card border-2 border-transparent hover:border-brand-100 p-4 flex flex-col group">
                  <div className="relative h-48 rounded-xl overflow-hidden mb-4 shrink-0 img-zoom">
                    <Image src={s.img} fill className="object-cover" alt={s.name}/>
                    {s.tag && (
                      <div className={`absolute top-3 left-3 ${s.tag === 'HOT' ? 'bg-gradient-to-r from-accent-500 to-accent-400' : 'bg-gradient-to-r from-brand-500 to-brand-400'} text-white text-[10px] font-black px-2.5 py-1 rounded-full tracking-wider`}>
                        {s.tag}
                      </div>
                    )}
                    <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full">⏱ {s.time}</div>
                  </div>
                  <h3 className="font-bold text-slate2-900 mb-1 group-hover:text-brand-600 transition-colors">{s.name}</h3>
                  <p className="text-xs text-slate2-400 mb-4 h-8 line-clamp-2 leading-relaxed">{s.desc}</p>
                  <div className="flex items-center justify-between mb-4 mt-auto">
                    <span className="font-bold text-brand-700">Starting {s.price}</span>
                    <span className="flex items-center gap-1 text-xs font-bold text-slate2-600">
                      <span className="text-yellow-400">★</span>{s.rating} <span className="text-slate2-300">({s.rev})</span>
                    </span>
                  </div>
                  <button onClick={() => openBooking(s.id)} className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-2.5 rounded-xl text-xs transition-all hover:shadow-brand">Book Now →</button>
                </div>
              ))}
            </div>
          </div>

          {/* How It Works */}
          <div className="bg-gradient-to-br from-brand-700 to-brand-500 py-16 px-5">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <p className="text-xs font-bold text-brand-200 uppercase tracking-widest mb-2 flex items-center justify-center gap-2">
                  <span className="inline-block w-4 h-0.5 bg-brand-300"></span>Simple Process<span className="inline-block w-4 h-0.5 bg-brand-300"></span>
                </p>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
                  How <em className="not-italic text-accent-300">ServiceHub</em> Works
                </h2>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 relative">
                <div className="hidden lg:block absolute top-8 left-[18%] right-[18%] h-0.5 bg-white/15"></div>
                <div className="text-center relative z-10 group">
                  <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 group-hover:bg-white/25 transition-all duration-500 shadow-lg">
                    <Search className="w-7 h-7 text-white" />
                  </div>
                  <div className="font-display text-lg font-bold text-white mb-2">1. Browse</div>
                  <div className="text-sm text-brand-100/70 leading-relaxed font-medium">Choose from 100+ home services with clear pricing</div>
                </div>
                <div className="text-center relative z-10 group">
                  <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 group-hover:bg-white/25 transition-all duration-500 shadow-lg">
                    <Calendar className="w-7 h-7 text-white" />
                  </div>
                  <div className="font-display text-lg font-bold text-white mb-2">2. Schedule</div>
                  <div className="text-sm text-brand-100/70 leading-relaxed font-medium">Pick date, time & preferred professional</div>
                </div>
                <div className="text-center relative z-10 group">
                  <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 group-hover:bg-white/25 transition-all duration-500 shadow-lg">
                    <HomeIcon className="w-7 h-7 text-white" />
                  </div>
                  <div className="font-display text-lg font-bold text-white mb-2">3. We Arrive</div>
                  <div className="text-sm text-brand-100/70 leading-relaxed font-medium">Verified expert arrives on time at your door</div>
                </div>
                <div className="text-center relative z-10 group">
                  <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 group-hover:bg-white/25 transition-all duration-500 shadow-lg">
                    <Star className="w-7 h-7 text-white fill-current" />
                  </div>
                  <div className="font-display text-lg font-bold text-white mb-2">4. Quality Job</div>
                  <div className="text-sm text-brand-100/70 leading-relaxed font-medium">Pay securely after you're happy with the work</div>
                </div>
              </div>
            </div>
          </div>

          {/* Testimonials */}
          <div className="bg-slate2-50 py-16 px-5">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-10">
                <p className="text-xs font-bold text-brand-600 uppercase tracking-widest mb-2 flex items-center justify-center gap-2">
                  <span className="inline-block w-4 h-0.5 bg-brand-500"></span>Reviews<span className="inline-block w-4 h-0.5 bg-brand-500"></span>
                </p>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-slate2-900">
                  What Customers <em className="not-italic text-brand-600">Say</em>
                </h2>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                {TESTIS.map((t, i) => (
                  <div key={i} className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-500 relative border border-slate2-100 group">
                    <Quote className="absolute top-6 right-8 w-10 h-10 text-slate2-100 group-hover:text-brand-50 transition-colors" />
                    <div className="flex gap-1 mb-6">
                      {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 text-amber-400 fill-current" />)}
                    </div>
                    <p className="text-slate2-600 font-medium leading-relaxed mb-8 italic">"{t.text}"</p>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold text-white shadow-lg shrink-0" style={{background: t.color}}>{t.av}</div>
                      <div>
                        <div className="text-base font-bold text-slate2-900 leading-tight">{t.name}</div>
                        <div className="text-xs text-slate2-400 font-bold uppercase tracking-wider mt-1">{t.loc}</div>
                        <div className="text-xs text-brand-600 font-black mt-1 uppercase tracking-tighter">{t.svc}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      ) : (
        <div className="flex max-w-7xl mx-auto w-full flex-1">
            <aside className="w-64 bg-slate2-900 min-h-full p-6 hidden md:block">
                <div className="text-white mb-8">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-xl font-bold mb-3">{currentUser?.init}</div>
                    <div className="font-bold truncate">{currentUser?.name}</div>
                    <div className="text-xs text-slate2-400 truncate">{currentUser?.email}</div>
                </div>
                <nav className="space-y-2">
                    {['overview', 'orders', 'profile'].map(p => (
                        <button key={p} onClick={() => setDashPanel(p)} className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${dashPanel === p ? 'bg-white/10 text-white' : 'text-slate2-400 hover:text-white'}`}>
                            {p.toUpperCase()}
                        </button>
                    ))}
                    <button onClick={handleLogout} className="w-full text-left px-4 py-3 rounded-xl text-sm font-bold text-red-400 mt-8">LOGOUT</button>
                </nav>
            </aside>
            <main className="flex-1 p-8 bg-slate2-50 min-h-full">
                {dashPanel === 'overview' && (
                    <div>
                        <h2 className="text-2xl font-bold text-slate2-900 mb-6">Overview</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                            <div className="bg-white p-6 rounded-2xl shadow-card border-l-4 border-brand-500">
                                <div className="text-3xl font-bold text-slate-900">{orders.length}</div>
                                <div className="text-xs text-slate2-400 font-bold uppercase mt-1">Total Orders</div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-card border-l-4 border-accent-500">
                                <div className="text-3xl font-bold text-slate-900">₹{orders.reduce((acc, o) => acc + o.price, 0).toLocaleString()}</div>
                                <div className="text-xs text-slate2-400 font-bold uppercase mt-1">Total Spent</div>
                            </div>
                        </div>
                    </div>
                )}
                {dashPanel === 'orders' && (
                    <div>
                        <h2 className="text-2xl font-bold text-slate2-900 mb-6 font-display">Your Orders</h2>
                        <div className="space-y-4">
                            {orders.map(o => (
                                <div key={o.id} className="bg-white p-4 rounded-xl shadow-card flex items-center gap-4 border border-slate2-100">
                                     <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
                                         <Image src={o.img} fill className="object-cover" alt={o.service}/>
                                     </div>
                                     <div className="flex-1">
                                         <div className="font-bold text-slate2-900">{o.service}</div>
                                         <div className="text-xs text-slate2-400">{o.date} · {o.time}</div>
                                     </div>
                                     <div className="text-right">
                                         <div className="font-bold text-slate-900">₹{o.price}</div>
                                         <div className="text-[10px] bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full inline-block uppercase mt-1">{o.status}</div>
                                     </div>
                                </div>
                            ))}
                            {orders.length === 0 && <div className="text-center py-20 text-slate2-400">No orders yet.</div>}
                        </div>
                    </div>
                )}
                {dashPanel === 'profile' && (
                    <div>
                         <h2 className="text-2xl font-bold text-slate2-900 mb-6 font-display">My Profile</h2>
                         <div className="bg-white p-8 rounded-2xl shadow-card max-w-2xl">
                             <div className="flex items-center gap-6 mb-8">
                                 <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-3xl font-bold text-white shadow-brand">{currentUser?.init}</div>
                                 <div className="text-slate-800">
                                     <div className="text-xl font-bold">{currentUser?.name}</div>
                                     <div className="text-sm text-slate2-400">{currentUser?.email}</div>
                                 </div>
                             </div>
                             <button className="bg-brand-600 text-white font-bold px-6 py-2.5 rounded-xl text-sm" onClick={() => showToast("Profile editing coming soon!")}>Save Changes</button>
                         </div>
                    </div>
                )}
            </main>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-slate2-900 pt-14 pb-8 px-5 mt-auto">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2 lg:col-span-1">
              <div className="font-display text-3xl font-bold text-white mb-6 tracking-tight">Service<span className="text-brand-400">Hub</span></div>
              <p className="text-sm text-slate2-400 leading-relaxed mb-8 max-w-sm font-medium">Professional home services delivered to your door. Trusted by 50,000+ households for quality and reliability.</p>
              <div className="flex gap-3">
                <button className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-brand-500 hover:border-brand-500 transition-all duration-300">
                  <Instagram className="w-5 h-5" />
                </button>
                <button className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-brand-500 hover:border-brand-500 transition-all duration-300">
                  <Facebook className="w-5 h-5 fill-current" />
                </button>
                <button className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-brand-500 hover:border-brand-500 transition-all duration-300">
                  <Twitter className="w-5 h-5 fill-current" />
                </button>
              </div>
            </div>
            <div>
              <h4 className="text-[11px] font-black text-white uppercase tracking-[0.2em] mb-7">Popular Services</h4>
              <ul className="space-y-4 text-sm font-medium text-slate2-400">
                {SERVICES.slice(0, 5).map(s => (
                  <li key={s.id} onClick={() => openBooking(s.id)} className="hover:text-brand-400 cursor-pointer transition-all flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate2-700 group-hover:bg-brand-500 transition-colors"></span>
                    {s.name}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[11px] font-black text-white uppercase tracking-[0.2em] mb-7">Our Company</h4>
              <ul className="space-y-4 text-sm font-medium text-slate2-400">
                <li className="hover:text-brand-400 cursor-pointer transition-all">About Our Story</li>
                <li className="hover:text-brand-400 cursor-pointer transition-all">Career Opportunities</li>
                <li className="hover:text-brand-400 cursor-pointer transition-all">Service Quality Blog</li>
                <li className="hover:text-brand-400 cursor-pointer transition-all">Become a Partner</li>
              </ul>
            </div>
            <div>
              <h4 className="text-[11px] font-black text-white uppercase tracking-[0.2em] mb-7">Contact & Support</h4>
              <ul className="space-y-4 text-sm font-medium text-slate2-400">
                <li className="flex items-center gap-3"><PhoneCall className="w-4 h-4 text-brand-500" /> +91 1800-SERVICE</li>
                <li className="hover:text-brand-400 cursor-pointer transition-all">Help Center</li>
                <li className="hover:text-brand-400 cursor-pointer transition-all">Privacy Policy</li>
                <li className="hover:text-brand-400 cursor-pointer transition-all">Terms & Conditions</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-[10px] sm:text-xs text-slate2-500 uppercase tracking-[0.1em] font-bold">© 2025 ServiceHub Technologies Pvt. Ltd. All rights reserved.</p>
            <div className="flex gap-2">
              <span className="bg-white/5 border border-white/10 rounded px-2 py-0.5 text-[10px] text-slate2-500 font-bold">VISA</span>
              <span className="bg-white/5 border border-white/10 rounded px-2 py-0.5 text-[10px] text-slate2-500 font-bold">MC</span>
              <span className="bg-white/5 border border-white/10 rounded px-2 py-0.5 text-[10px] text-slate2-500 font-bold">UPI</span>
              <span className="bg-white/5 border border-white/10 rounded px-2 py-0.5 text-[10px] text-slate2-500 font-bold">GPAY</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
