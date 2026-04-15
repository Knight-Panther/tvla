import { useEffect, useState } from 'react'

export default function InstallPrompt() {
  const [prompt, setPrompt] = useState(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Skip if already dismissed or installed
    if (localStorage.getItem('pwa-dismissed')) return

    function handler(e) {
      e.preventDefault()
      setPrompt(e)
      setVisible(true)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  function handleYes() {
    if (!prompt) return
    prompt.prompt()
    prompt.userChoice.then(() => {
      setVisible(false)
      setPrompt(null)
    })
  }

  function handleNo() {
    localStorage.setItem('pwa-dismissed', '1')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center pb-8 px-4"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
    >
      <div
        className="w-full rounded-3xl p-6 flex flex-col gap-5"
        style={{
          maxWidth: 380,
          background: 'linear-gradient(160deg, #1e1b4b, #4c1d95)',
          border: '1.5px solid rgba(255,255,255,0.2)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
        }}
      >
        {/* Icon + title */}
        <div className="flex items-center gap-4">
          <img src="/tvla/pwa-192x192.png" alt="TVALE icon"
            className="rounded-2xl shadow-lg" style={{ width: 64, height: 64 }} />
          <div>
            <p className="text-white font-black text-xl leading-tight">TVALE</p>
            <p className="text-purple-200 text-sm font-bold"
              style={{ fontFamily: '"Noto Sans Georgian", sans-serif' }}>
              დაამატე მთავარ ეკრანზე
            </p>
          </div>
        </div>

        {/* Message */}
        <p className="text-white text-base font-bold text-center"
          style={{ fontFamily: '"Noto Sans Georgian", sans-serif' }}>
          გინდა, რომ TVALE ტელეფონზე დაიინსტალირო, როგორც აპი? 📱
        </p>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onTouchEnd={(e) => { e.preventDefault(); handleNo() }}
            onClick={handleNo}
            className="flex-1 py-3 rounded-2xl font-black text-white text-lg active:scale-95 transition-transform"
            style={{ background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.2)' }}
          >
            არა
          </button>
          <button
            onTouchEnd={(e) => { e.preventDefault(); handleYes() }}
            onClick={handleYes}
            className="flex-2 py-3 px-6 rounded-2xl font-black text-white text-lg active:scale-95 transition-transform"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)', flex: 2 }}
          >
            დიახ! 🎉
          </button>
        </div>
      </div>
    </div>
  )
}
