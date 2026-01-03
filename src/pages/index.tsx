"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";

const subscribe = () => () => { };

export default function LoadingScreen() {
  const isClient = useSyncExternalStore(subscribe, () => true, () => false);
  const [percent, setPercent] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (!isClient) return;

    // ÉP THẺ BODY VÀ HTML PHẢI FULL MÀN HÌNH ĐỂ KHÔNG BỊ LỆCH
    document.documentElement.style.margin = '0';
    document.documentElement.style.padding = '0';
    document.documentElement.style.height = '100%';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.height = '100%';
    document.body.style.backgroundColor = '#020617';

    const interval = setInterval(() => {
      setPercent((prev) => (prev < 100 ? prev + 1 : 100));
    }, 25);

    const timer = setTimeout(() => {
      router.push("/login");
    }, 3200);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [isClient, router]);

  if (!isClient) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#020617',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        overflow: 'hidden',
        color: '#22d3ee',
        fontFamily: 'monospace',
        boxSizing: 'border-box'
      }}
    >
      {/* Background Grid Layer */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.2,
          pointerEvents: 'none',
          backgroundImage: 'linear-gradient(#0ea5e91a 1px, transparent 1px), linear-gradient(90deg, #0ea5e91a 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          transform: 'perspective(1000px) rotateX(60deg) translateY(-100px)',
          transformOrigin: 'top'
        }}
      />

      <div style={{ position: 'relative', textAlign: 'center', zIndex: 10 }}>
        {/* HUD Circular Loader */}
        <div style={{ position: 'relative', width: '300px', height: '300px', margin: '0 auto 50px auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

          {/* Animated Rings */}
          <div
            className="animate-spin"
            style={{ position: 'absolute', inset: 0, border: '1px dashed rgba(34,211,238,0.2)', borderRadius: '50%', animationDuration: '12s' }}
          />
          <div
            className="animate-spin"
            style={{ position: 'absolute', inset: '20px', border: '2px double rgba(34,211,238,0.4)', borderRadius: '50%', animationDuration: '8s', animationDirection: 'reverse' }}
          />

          {/* SVG Progress Circle */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
            <circle cx="150" cy="150" r="135" stroke="rgba(6,182,212,0.05)" strokeWidth="6" fill="transparent" />
            <motion.circle
              cx="150" cy="150" r="135"
              stroke="#22d3ee" strokeWidth="6" fill="transparent"
              strokeDasharray="848"
              animate={{ strokeDashoffset: 848 - (848 * percent) / 100 }}
              style={{ filter: 'drop-shadow(0 0 12px #22d3ee)' }}
            />
          </svg>

          {/* CRM TADA Text */}
          <div>
            <h1 style={{ fontSize: '36px', fontWeight: '900', letterSpacing: '8px', color: '#fff', margin: 0, textShadow: '0 0 20px rgba(34,211,238,0.8)' }}>
              CRM TADA
            </h1>
            <p style={{ fontSize: '12px', marginTop: '10px', opacity: 0.6, letterSpacing: '4px' }}>SYSTEM INITIALIZING</p>
          </div>
        </div>

        {/* Progress Bar & Status */}
        <div style={{ width: '350px', margin: '0 auto' }}>
          <p className="animate-pulse" style={{ fontSize: '12px', marginBottom: '15px', letterSpacing: '2px' }}>
            {percent < 100 ? "ESTABLISHING SECURE CONNECTION..." : "ACCESS GRANTED"}
          </p>

          <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(34,211,238,0.1)', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(34,211,238,0.2)', padding: '2px' }}>
            <motion.div
              style={{ height: '100%', background: 'linear-gradient(90deg, #0891b2, #22d3ee)', borderRadius: '10px', boxShadow: '0 0 10px #22d3ee' }}
              initial={{ width: "0%" }}
              animate={{ width: `${percent}%` }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '10px', fontWeight: 'bold' }}>
            <span style={{ opacity: 0.5 }}>[{new Date().toLocaleTimeString()}]</span>
            <span>{percent}%</span>
          </div>

          <button
            onClick={() => router.push("/login")}
            style={{ marginTop: '40px', background: 'none', border: 'none', color: '#0891b2', fontSize: '11px', textDecoration: 'underline', cursor: 'pointer', letterSpacing: '1px' }}
          >
            SKIP TO LOGIN
          </button>
        </div>
      </div>
    </div>
  );
}