import React from 'react'

export default function Footer(){
  const year = new Date().getFullYear()
  return (
    <footer className="w-full mt-12 bg-white/60 backdrop-blur-md border-t border-slate-200/60">
      {/* Full-width content */}
      <div className="max-w-none px-6 sm:px-8 py-10">
        {/* Top: multi-column links */}
        <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-3">
              <div className="rounded-full p-2 shadow-md ring-1 ring-white/50 bg-gradient-to-br from-cyan-500 to-teal-500">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M12 2C8.1 2 5 5.1 5 9c0 5.3 7 13 7 13s7-7.7 7-13c0-3.9-3.1-7-7-7z" fill="#fff" />
                </svg>
              </div>
              <div>
                <div className="font-extrabold tracking-tight text-lg leading-tight">ReLeaf</div>
                <div className="text-xs text-slate-600">Smart Water Recovery &amp; Reuse</div>
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-600 max-w-sm">
              Industry-grade monitoring, analytics, and process optimization for freshwater recovery and
              reuse—built for municipalities, industry, and campuses.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-800">Product</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li><a className="hover:text-slate-900" href="#" onClick={(e)=>e.preventDefault()}>Features</a></li>
              <li><a className="hover:text-slate-900" href="#" onClick={(e)=>e.preventDefault()}>Pricing</a></li>
              <li><a className="hover:text-slate-900" href="#" onClick={(e)=>e.preventDefault()}>Roadmap</a></li>
              <li><a className="hover:text-slate-900" href="#" onClick={(e)=>e.preventDefault()}>Status</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-800">Resources</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li><a className="hover:text-slate-900" href="#" onClick={(e)=>e.preventDefault()}>Docs</a></li>
              <li><a className="hover:text-slate-900" href="#" onClick={(e)=>e.preventDefault()}>API</a></li>
              <li><a className="hover:text-slate-900" href="#" onClick={(e)=>e.preventDefault()}>Blog</a></li>
              <li><a className="hover:text-slate-900" href="#" onClick={(e)=>e.preventDefault()}>Community</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-800">Company</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li><a className="hover:text-slate-900" href="#" onClick={(e)=>e.preventDefault()}>About</a></li>
              <li><a className="hover:text-slate-900" href="#" onClick={(e)=>e.preventDefault()}>Careers</a></li>
              <li><a className="hover:text-slate-900" href="#" onClick={(e)=>e.preventDefault()}>Contact</a></li>
              <li><a className="hover:text-slate-900" href="#" onClick={(e)=>e.preventDefault()}>Legal</a></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="container mx-auto my-8 border-t border-slate-200" />

        {/* Bottom: newsletter + social + copyright */}
        <div className="container mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Newsletter */}
          <form className="flex items-center gap-3">
            <label htmlFor="newsletter" className="text-sm text-slate-700">Subscribe for updates</label>
            <input id="newsletter" type="email" placeholder="you@example.com"
                   className="px-3 py-2 rounded-xl border border-slate-300 bg-white/70 backdrop-blur-md text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/40" />
                <button type="submit"
                  className="px-4 py-2 rounded-xl text-white shadow hover:shadow-lg transition will-change-transform hover:-translate-y-[2px] hover:scale-[1.02]"
                    style={{ background: 'linear-gradient(135deg, var(--accent), var(--primary))' }}>
              Subscribe
            </button>
          </form>

          {/* Social */}
          <div className="flex items-center gap-3">
            {['twitter','linkedin','github'].map((key)=> (
              <a key={key} href="#" onClick={(e)=>e.preventDefault()} aria-label={key}
                 className="w-9 h-9 inline-flex items-center justify-center rounded-full border border-slate-300 bg-white/70 backdrop-blur-md hover:bg-white transition shadow-sm hover:scale-[1.05] hover:-translate-y-[1px]">
                <span className="sr-only">{key}</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.6" />
                </svg>
              </a>
            ))}
          </div>

          {/* Copyright */}
          <div className="text-sm text-slate-600">
            © {year} ReLeaf • Neilsoft Ltd. • All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}
