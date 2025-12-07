// src/components/PageSection.jsx
import React from "react";

export default function PageSection({ kicker, title, subtitle, actions, children, className = "" }){
  return (
    <section className={`glass-card p-7 rounded-2xl ${className}`}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          {kicker && <div className="text-xs font-semibold tracking-wider uppercase" style={{color:"var(--primary)"}}>{kicker}</div>}
          {title && <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>}
          {subtitle && <p className="text-sm text-muted mt-1">{subtitle}</p>}
        </div>
        {actions && <div className="flex gap-2">{actions}</div>}
      </div>
      {children && <div className="mt-6">{children}</div>}
    </section>
  );
}
