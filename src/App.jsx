import { useEffect, useState } from 'react'

function App() {
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState(null)
  const [projects, setProjects] = useState([])
  const [contact, setContact] = useState({ name: '', email: '', message: '' })
  const [contactStatus, setContactStatus] = useState(null)

  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  useEffect(() => {
    const load = async () => {
      try {
        const [pRes, projRes] = await Promise.all([
          fetch(`${baseUrl}/api/profile`),
          fetch(`${baseUrl}/api/projects`),
        ])
        const pData = pRes.ok ? await pRes.json() : []
        const projData = projRes.ok ? await projRes.json() : []
        setProfile(pData && pData.length > 0 ? pData[0] : null)
        setProjects(Array.isArray(projData) ? projData : [])
      } catch (e) {
        // fallback silently
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const displayProfile = profile || {
    name: 'Halimur Rasyid',
    title: 'Member of Parliament • Professional Programmer',
    bio: 'Public servant and software craftsman. Bridging policy and technology to deliver impact at scale.',
    location: 'Indonesia',
    socials: {
      linkedin: '#',
      github: '#',
      twitter: '#',
    },
  }

  const handleContactSubmit = async (e) => {
    e.preventDefault()
    setContactStatus('sending')
    try {
      const res = await fetch(`${baseUrl}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contact),
      })
      if (res.ok) {
        setContactStatus('sent')
        setContact({ name: '', email: '', message: '' })
      } else {
        setContactStatus('error')
      }
    } catch (e) {
      setContactStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 text-gray-900">
      {/* Hero */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-30 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.4),transparent_40%)]" />
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1">
              <span className="inline-block text-xs uppercase tracking-widest text-indigo-600 font-semibold bg-indigo-50 px-3 py-1 rounded-full">Public Service × Technology</span>
              <h1 className="mt-4 text-4xl md:text-6xl font-extrabold leading-tight">
                {displayProfile.name}
              </h1>
              <p className="mt-3 text-xl md:text-2xl text-gray-700">{displayProfile.title}</p>
              <p className="mt-6 text-gray-600 max-w-2xl">{displayProfile.bio}</p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                {displayProfile.location && (
                  <span className="text-sm text-gray-600 bg-white/70 backdrop-blur px-3 py-1 rounded-full border border-gray-200">{displayProfile.location}</span>
                )}
                {displayProfile.socials && Object.entries(displayProfile.socials).map(([k, v]) => (
                  <a key={k} href={v} target="_blank" className="text-sm text-indigo-700 hover:text-indigo-900 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 capitalize">
                    {k}
                  </a>
                ))}
              </div>
            </div>
            <div className="w-40 h-40 md:w-56 md:h-56 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-500 shadow-lg flex items-center justify-center text-white text-4xl md:text-6xl font-black">
              HR
            </div>
          </div>
        </div>
      </header>

      {/* Work */}
      <section className="max-w-6xl mx-auto px-6 py-14">
        <div className="flex items-end justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">Highlighted Work</h2>
          <a href="/test" className="text-sm text-indigo-700 hover:text-indigo-900">System check →</a>
        </div>
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : projects.length === 0 ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[1,2,3].map(i => (
              <div key={i} className="p-6 rounded-xl border bg-white shadow-sm">
                <h3 className="font-semibold">PolicyTech {i}</h3>
                <p className="text-sm text-gray-600 mt-2">Sample project bridging legislation analysis with modern software tooling.</p>
                <div className="mt-3 flex gap-2 text-xs">
                  <span className="px-2 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">govtech</span>
                  <span className="px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">ai</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {projects.map((p, idx) => (
              <div key={idx} className="p-6 rounded-xl border bg-white shadow-sm">
                <h3 className="font-semibold">{p.title}</h3>
                <p className="text-sm text-gray-600 mt-2">{p.description}</p>
                {p.tags && p.tags.length > 0 && (
                  <div className="mt-3 flex gap-2 text-xs flex-wrap">
                    {p.tags.map((t, i) => (
                      <span key={i} className="px-2 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">{t}</span>
                    ))}
                  </div>
                )}
                {p.link && (
                  <a href={p.link} target="_blank" className="inline-block mt-3 text-sm text-indigo-700 hover:text-indigo-900">Visit →</a>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Contact */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">Get in touch</h2>
            <p className="mt-2 text-gray-600">Invite for a meeting, request collaboration, or say hello.</p>
            <div className="mt-6 p-4 rounded-xl border bg-white shadow-sm text-sm">
              <p><span className="font-semibold">Backend:</span> <span className="font-mono">{baseUrl}</span></p>
            </div>
          </div>
          <form onSubmit={handleContactSubmit} className="p-6 rounded-xl border bg-white shadow-sm">
            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input value={contact.name} onChange={e=>setContact(c=>({...c, name: e.target.value}))} required className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input type="email" value={contact.email} onChange={e=>setContact(c=>({...c, email: e.target.value}))} required className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="you@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea value={contact.message} onChange={e=>setContact(c=>({...c, message: e.target.value}))} required rows={4} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="How can we collaborate?" />
              </div>
              <button type="submit" disabled={contactStatus==='sending'} className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold py-2 px-4 rounded-lg">
                {contactStatus==='sending' ? 'Sending…' : 'Send Message'}
              </button>
              {contactStatus==='sent' && <p className="text-green-600 text-sm">Message received. Thank you!</p>}
              {contactStatus==='error' && <p className="text-red-600 text-sm">Something went wrong. Please try again.</p>}
            </div>
          </form>
        </div>
      </section>

      <footer className="border-t bg-white/60 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 py-6 text-sm text-gray-600 flex items-center justify-between">
          <span>© {new Date().getFullYear()} Halimur Rasyid</span>
          <a className="text-indigo-700" href="/test">Check system</a>
        </div>
      </footer>
    </div>
  )
}

export default App
