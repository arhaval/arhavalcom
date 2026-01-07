import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Settings, Save, Lock, LogOut, Video, Instagram, Twitter, Youtube, Twitch, 
  Image, Link as LinkIcon, FileText, BarChart3, Plus, Trash2, Edit2, Eye, 
  Upload, Download, X, Check
} from 'lucide-react'

function PortfolioAdmin() {
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [activeTab, setActiveTab] = useState('videos')
  const [saveStatus, setSaveStatus] = useState('')

  // Portfolio Data State
  const [portfolioData, setPortfolioData] = useState({
    logo: {
      url: '/images/arhaval.png',
      showTextFallback: true,
      navbar: { width: 300, height: 100 },
      hero: { width: 800, height: 300 },
      footer: { width: 300, height: 120 }
    },
    navbarLinks: [
      { href: '#hero', label: 'Ana Sayfa' },
      { href: '#about', label: 'Hakkımızda' },
      { href: '#services', label: 'Hizmetler' },
      { href: '#stats', label: 'İstatistikler' },
      { href: '#trcs', label: 'TRCS Belgeselleri' }
    ],
    socialLinks: [
      { platform: 'Twitch', icon: 'Twitch', href: '#', color: '#9146FF' },
      { platform: 'Instagram', icon: 'Instagram', href: '#', color: '#E4405F' },
      { platform: 'Twitter', icon: 'Twitter', href: '#', color: '#1DA1F2' },
      { platform: 'Youtube', icon: 'Youtube', href: '#', color: '#FF0000' }
    ],
    partners: [
      {
        name: 'Sangal Esports',
        logo: '/images/sangal.svg',
        url: '#'
      },
      {
        name: 'Eternal Fire',
        logo: '/images/ef.svg',
        url: '#'
      }
    ],
    heroBanner: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1920&q=80',
    heroButtons: [
      { text: 'KEŞFET', link: '#about', style: 'primary' },
      { text: 'İÇERİKLER', link: '#trcs', style: 'secondary' }
    ],
    aboutText: `Arhaval, e-spor ekosisteminde içerik üretimi, canlı yayınlar ve turnuva organizasyonlarını tek bir çatı altında buluşturan bağımsız bir platformdur.

Merkezinde Counter-Strike 2 olmak üzere, rekabetçi oyun kültürünü sadece izlenen değil, etkileşime girilen bir deneyime dönüştürmeyi hedefler.

Bizim için e-spor; yalnızca maçlardan ibaret değildir.

Oyuncular, takımlar, hikâyeler, anlar ve bu anları yaşayan topluluklar vardır. Arhaval, bu kültürü anlatan, üreten ve büyüten bir yapı olarak konumlanır.`,
    documentaries: [
      {
        id: 'xantares',
        title: 'XANTARES: GÖZÜ KARA',
        coverImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=600&fit=crop',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
      },
      {
        id: 'eternal-fire',
        title: 'ETERNAL FIRE: MAJOR YOLU',
        coverImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=600&fit=crop',
        videoUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw'
      },
      {
        id: 'sangal',
        title: 'SANGAL: AVRUPA RÜYASI',
        coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=600&fit=crop',
        videoUrl: 'https://www.youtube.com/watch?v=9bZkp7q19f0'
      }
    ],
    stats: [
      { target: 2, suffix: ' MİLYON', label: 'Canlı İzlenme' },
      { target: 600, suffix: ' SAAT', label: 'Canlı Yayın' },
      { target: 150, suffix: '', label: 'Niş İçerik' },
      { target: 30, suffix: ' K', label: 'Takipçi' }
    ]
  })

  // Check authentication
  useEffect(() => {
    const adminPassword = localStorage.getItem('arhaval_admin_password')
    const adminAuth = localStorage.getItem('arhaval_admin_authenticated')
    
    // Şifre doğruysa veya daha önce giriş yapıldıysa otomatik giriş
    if (adminPassword === 'arhaval2024' || adminAuth === 'true') {
      setIsAuthenticated(true)
      loadPortfolioData()
      // Auth durumunu kaydet
      localStorage.setItem('arhaval_admin_authenticated', 'true')
      localStorage.setItem('arhaval_admin_password', 'arhaval2024')
    }
  }, [])

  const loadPortfolioData = () => {
    const saved = localStorage.getItem('arhaval_portfolio_data')
    if (saved) {
      try {
        setPortfolioData(JSON.parse(saved))
      } catch (e) {
        console.error('Error loading portfolio data:', e)
      }
    }
  }

  const savePortfolioData = () => {
    try {
      const dataToSave = JSON.stringify(portfolioData)
      localStorage.setItem('arhaval_portfolio_data', dataToSave)
      setSaveStatus('saved')
      
      // Custom event gönder (tüm tab'ler için)
      window.dispatchEvent(new CustomEvent('portfolioDataUpdated', { detail: portfolioData }))
      
      // 1.5 saniye sonra ana sayfaya yönlendir (sayfa yenilenecek)
      setTimeout(() => {
        window.location.href = '/'
      }, 1500)
    } catch (e) {
      setSaveStatus('error')
      console.error('Error saving portfolio data:', e)
      alert('Kaydetme hatası: ' + e.message)
    }
  }

  const handleLogin = (e) => {
    e.preventDefault()
    if (password === 'arhaval2024') {
      // Kalıcı giriş için hem şifreyi hem auth durumunu kaydet
      localStorage.setItem('arhaval_admin_password', password)
      localStorage.setItem('arhaval_admin_authenticated', 'true')
      setIsAuthenticated(true)
      loadPortfolioData()
    } else {
      alert('Yanlış şifre!')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('arhaval_admin_password')
    localStorage.removeItem('arhaval_admin_authenticated')
    setIsAuthenticated(false)
    setPassword('')
  }

  // Video Management
  const addDocumentary = () => {
    const newDoc = {
      id: `doc-${Date.now()}`,
      title: 'Yeni Belgesel',
      coverImage: 'https://via.placeholder.com/400x600',
      videoUrl: ''
    }
    setPortfolioData({
      ...portfolioData,
      documentaries: [...portfolioData.documentaries, newDoc]
    })
  }

  const removeDocumentary = (index) => {
    const updated = portfolioData.documentaries.filter((_, i) => i !== index)
    setPortfolioData({ ...portfolioData, documentaries: updated })
  }

  const updateDocumentary = (index, field, value) => {
    const updated = [...portfolioData.documentaries]
    updated[index] = { ...updated[index], [field]: value }
    setPortfolioData({ ...portfolioData, documentaries: updated })
  }

  // Social Links Management
  const updateSocialLink = (index, field, value) => {
    const updated = [...portfolioData.socialLinks]
    updated[index] = { ...updated[index], [field]: value }
    setPortfolioData({ ...portfolioData, socialLinks: updated })
  }

  // Partners Management
  const addPartner = () => {
    const newPartner = {
      name: 'Yeni Partner',
      logo: 'https://via.placeholder.com/200x80',
      url: '#'
    }
    setPortfolioData({
      ...portfolioData,
      partners: [...portfolioData.partners, newPartner]
    })
  }

  const removePartner = (index) => {
    const updated = portfolioData.partners.filter((_, i) => i !== index)
    setPortfolioData({ ...portfolioData, partners: updated })
  }

  const updatePartner = (index, field, value) => {
    const updated = [...portfolioData.partners]
    updated[index] = { ...updated[index], [field]: value }
    setPortfolioData({ ...portfolioData, partners: updated })
  }

  // Stats Management
  const updateStat = (index, field, value) => {
    const updated = [...portfolioData.stats]
    updated[index] = { ...updated[index], [field]: field === 'target' ? parseInt(value) || 0 : value }
    setPortfolioData({ ...portfolioData, stats: updated })
  }

  // Export/Import
  const exportData = () => {
    const dataStr = JSON.stringify(portfolioData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'arhaval-portfolio-data.json'
    link.click()
  }

  const importData = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target.result)
          setPortfolioData(imported)
          alert('Veri başarıyla yüklendi!')
        } catch (e) {
          alert('Dosya formatı hatalı!')
        }
      }
      reader.readAsText(file)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-bg-dark flex items-center justify-center p-6">
        <div className="glass-strong rounded-2xl p-8 max-w-md w-full border border-white/20">
          <div className="text-center mb-6">
            <Lock className="mx-auto mb-4 text-primary-neon" size={48} />
            <h2 className="text-2xl font-bold text-white mb-2">Portfolio Admin</h2>
            <p className="text-white/60">Şifrenizi girin</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Şifre"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-primary-neon focus:ring-2 focus:ring-primary-neon/20"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-primary-neon text-white font-bold rounded-lg hover:bg-primary-neon/80 transition-colors"
            >
              Giriş Yap
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-dark p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="glass-strong rounded-2xl p-6 mb-6 border border-white/20 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Portfolio Yönetimi</h1>
            <p className="text-white/60">Ana sayfa içeriğini düzenleyin</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={savePortfolioData}
              className="px-6 py-2 bg-secondary-cyan text-white font-bold rounded-lg hover:bg-secondary-cyan/80 transition-colors flex items-center gap-2"
            >
              <Save size={20} />
              {saveStatus === 'saved' ? 'Kaydedildi!' : saveStatus === 'error' ? 'Hata!' : 'Kaydet'}
            </button>
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 transition-colors flex items-center gap-2"
            >
              <LogOut size={20} />
              Çıkış
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="glass-strong rounded-2xl p-6 mb-6 border border-white/20">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'videos', label: 'TRCS Belgeselleri', icon: Video },
              { id: 'social', label: 'Sosyal Medya', icon: Instagram },
              { id: 'partners', label: 'Partnerler', icon: LinkIcon },
              { id: 'hero', label: 'Hero Banner', icon: Image },
              { id: 'logo', label: 'Logo', icon: Image },
              { id: 'about', label: 'Hakkımızda', icon: FileText },
              { id: 'stats', label: 'İstatistikler', icon: BarChart3 },
              { id: 'navbar', label: 'Menü Linkleri', icon: LinkIcon }
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'bg-primary-neon text-white'
                      : 'bg-white/5 text-white/60 hover:bg-white/10'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Content */}
        <div className="glass-strong rounded-2xl p-6 border border-white/20">
          {/* Videos Tab */}
          {activeTab === 'videos' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">TRCS Belgeselleri</h2>
                <button
                  onClick={addDocumentary}
                  className="px-4 py-2 bg-primary-neon text-white font-bold rounded-lg hover:bg-primary-neon/80 transition-colors flex items-center gap-2"
                >
                  <Plus size={20} />
                  Yeni Ekle
                </button>
              </div>
              <div className="space-y-4">
                {portfolioData.documentaries.map((doc, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-white/60 text-sm mb-2">Başlık</label>
                        <input
                          type="text"
                          value={doc.title}
                          onChange={(e) => updateDocumentary(index, 'title', e.target.value)}
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-white/60 text-sm mb-2">Kapak Resmi URL</label>
                        <input
                          type="text"
                          value={doc.coverImage}
                          onChange={(e) => updateDocumentary(index, 'coverImage', e.target.value)}
                          placeholder="/images/cover.jpg veya https://..."
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white"
                        />
                        <p className="text-xs text-white/40 mt-1">
                          Kendi görseliniz için: <code className="bg-white/10 px-1 rounded">public/images/</code> klasörüne koyup <code className="bg-white/10 px-1 rounded">/images/dosya.jpg</code> yazın
                        </p>
                        {doc.coverImage && (
                          <img src={doc.coverImage} alt="Cover Preview" className="mt-2 rounded max-w-xs max-h-40 object-cover" onError={(e) => e.target.style.display = 'none'} />
                        )}
                      </div>
                      <div>
                        <label className="block text-white/60 text-sm mb-2">YouTube Video Link</label>
                        <input
                          type="text"
                          value={doc.videoUrl || ''}
                          onChange={(e) => updateDocumentary(index, 'videoUrl', e.target.value)}
                          placeholder="https://www.youtube.com/watch?v=..."
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white"
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => removeDocumentary(index)}
                      className="mt-4 px-4 py-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors flex items-center gap-2"
                    >
                      <Trash2 size={18} />
                      Sil
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Social Links Tab */}
          {activeTab === 'social' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">Sosyal Medya Linkleri</h2>
              <div className="space-y-4">
                {portfolioData.socialLinks.map((link, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-white/60 text-sm mb-2">Platform</label>
                        <input
                          type="text"
                          value={link.platform}
                          onChange={(e) => updateSocialLink(index, 'platform', e.target.value)}
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-white/60 text-sm mb-2">Link</label>
                        <input
                          type="text"
                          value={link.href}
                          onChange={(e) => updateSocialLink(index, 'href', e.target.value)}
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Partners Tab */}
          {activeTab === 'partners' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Partnerler</h2>
                <button
                  onClick={addPartner}
                  className="px-4 py-2 bg-primary-neon text-white font-bold rounded-lg hover:bg-primary-neon/80 transition-colors flex items-center gap-2"
                >
                  <Plus size={20} />
                  Yeni Ekle
                </button>
              </div>
              <div className="space-y-4">
                {portfolioData.partners.map((partner, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-white/60 text-sm mb-2">İsim</label>
                        <input
                          type="text"
                          value={partner.name}
                          onChange={(e) => updatePartner(index, 'name', e.target.value)}
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-white/60 text-sm mb-2">Logo URL</label>
                        <input
                          type="text"
                          value={partner.logo}
                          onChange={(e) => updatePartner(index, 'logo', e.target.value)}
                          placeholder="/images/partner-logo.png"
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white"
                        />
                        <p className="text-xs text-white/40 mt-1">
                          Partner logosunu <code className="bg-white/10 px-1 rounded">public/images/</code> klasörüne koyun
                        </p>
                        <p className="text-xs text-white/40 mt-1">
                          Örnek: <code className="bg-white/10 px-1 rounded">public/images/sangal.png</code> → URL: <code className="bg-white/10 px-1 rounded">/images/sangal.png</code>
                        </p>
                        {partner.logo && (
                          <div className="mt-2 p-2 bg-white/5 rounded border border-white/10">
                            <img src={partner.logo} alt="Preview" className="max-w-xs max-h-20 object-contain" onError={(e) => e.target.style.display = 'none'} />
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-white/60 text-sm mb-2">Link</label>
                        <input
                          type="text"
                          value={partner.url}
                          onChange={(e) => updatePartner(index, 'url', e.target.value)}
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white"
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => removePartner(index)}
                      className="mt-4 px-4 py-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors flex items-center gap-2"
                    >
                      <Trash2 size={18} />
                      Sil
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hero Banner Tab */}
          {activeTab === 'hero' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">Hero Banner Ayarları</h2>
              
              {/* Background Image */}
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
                <p className="text-sm text-white/80 mb-2">
                  <strong>Kendi görselinizi kullanmak için:</strong>
                </p>
                <ol className="text-sm text-white/60 space-y-1 list-decimal list-inside">
                  <li>Görseli <code className="bg-white/10 px-1 rounded">public/images/</code> klasörüne koyun</li>
                  <li>URL olarak <code className="bg-white/10 px-1 rounded">/images/banner.jpg</code> yazın</li>
                </ol>
              </div>
              <div>
                <label className="block text-white/60 text-sm mb-2">Arka Plan Resmi URL</label>
                <input
                  type="text"
                  value={portfolioData.heroBanner}
                  onChange={(e) => setPortfolioData({ ...portfolioData, heroBanner: e.target.value })}
                  placeholder="/images/banner.jpg veya https://..."
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white"
                />
                {portfolioData.heroBanner && (
                  <img src={portfolioData.heroBanner} alt="Hero Banner" className="mt-4 rounded-lg max-w-md" onError={(e) => e.target.style.display = 'none'} />
                )}
              </div>

              {/* Hero Buttons */}
              <div className="mt-8 pt-8 border-t border-white/10">
                <h3 className="text-xl font-bold text-white mb-4">Hero Banner Butonları</h3>
                <div className="space-y-4">
                  {(portfolioData.heroButtons || []).map((button, index) => (
                    <div key={index} className="glass rounded-lg p-4 border border-white/10">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-white/60 text-sm mb-2">Buton Metni</label>
                          <input
                            type="text"
                            value={button.text}
                            onChange={(e) => {
                              const newButtons = [...(portfolioData.heroButtons || [])]
                              newButtons[index] = { ...newButtons[index], text: e.target.value }
                              setPortfolioData({ ...portfolioData, heroButtons: newButtons })
                            }}
                            placeholder="KEŞFET"
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-white/60 text-sm mb-2">Link</label>
                          <input
                            type="text"
                            value={button.link}
                            onChange={(e) => {
                              const newButtons = [...(portfolioData.heroButtons || [])]
                              newButtons[index] = { ...newButtons[index], link: e.target.value }
                              setPortfolioData({ ...portfolioData, heroButtons: newButtons })
                            }}
                            placeholder="#about veya https://..."
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-white/60 text-sm mb-2">Stil</label>
                          <select
                            value={button.style}
                            onChange={(e) => {
                              const newButtons = [...(portfolioData.heroButtons || [])]
                              newButtons[index] = { ...newButtons[index], style: e.target.value }
                              setPortfolioData({ ...portfolioData, heroButtons: newButtons })
                            }}
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white"
                          >
                            <option value="primary">Primary (Pembe)</option>
                            <option value="secondary">Secondary (Transparan)</option>
                          </select>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          const newButtons = (portfolioData.heroButtons || []).filter((_, i) => i !== index)
                          setPortfolioData({ ...portfolioData, heroButtons: newButtons })
                        }}
                        className="mt-4 px-4 py-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors flex items-center gap-2"
                      >
                        <Trash2 size={18} />
                        Sil
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const newButtons = [...(portfolioData.heroButtons || []), { text: 'YENİ BUTON', link: '#', style: 'primary' }]
                      setPortfolioData({ ...portfolioData, heroButtons: newButtons })
                    }}
                    className="px-4 py-2 bg-white/10 text-white rounded hover:bg-white/20 transition-colors flex items-center gap-2"
                  >
                    <Plus size={18} />
                    Yeni Buton Ekle
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Logo Tab */}
          {activeTab === 'logo' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">Logo Ayarları</h2>
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
                <p className="text-sm text-white/80 mb-2">
                  <strong>Kendi logonuzu kullanmak için:</strong>
                </p>
                <ol className="text-sm text-white/60 space-y-1 list-decimal list-inside">
                  <li>Logo dosyanızı <code className="bg-white/10 px-1 rounded">public/</code> klasörüne koyun (örn: <code className="bg-white/10 px-1 rounded">public/logo.png</code>)</li>
                  <li>URL olarak <code className="bg-white/10 px-1 rounded">/logo.png</code> yazın</li>
                  <li>Veya tam URL kullanın: <code className="bg-white/10 px-1 rounded">https://yourdomain.com/logo.png</code></li>
                </ol>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-white/60 text-sm mb-2">Logo URL</label>
                  <input
                    type="text"
                    value={portfolioData.logo.url}
                    onChange={(e) => setPortfolioData({
                      ...portfolioData,
                      logo: { ...portfolioData.logo, url: e.target.value }
                    })}
                    placeholder="/images/logo.png veya https://..."
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white"
                  />
                  {portfolioData.logo.url && (
                    <div className="mt-2">
                      <img src={portfolioData.logo.url} alt="Logo Preview" className="max-w-xs max-h-40 object-contain border border-white/10 rounded p-2" onError={(e) => e.target.style.display = 'none'} />
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-white/60 text-sm mb-2">Navbar Genişlik</label>
                    <input
                      type="number"
                      value={portfolioData.logo.navbar?.width || 120}
                      onChange={(e) => setPortfolioData({
                        ...portfolioData,
                        logo: { 
                          ...portfolioData.logo, 
                          navbar: { ...portfolioData.logo.navbar, width: parseInt(e.target.value) || 120 }
                        }
                      })}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-white/60 text-sm mb-2">Navbar Yükseklik</label>
                    <input
                      type="number"
                      value={portfolioData.logo.navbar?.height || 40}
                      onChange={(e) => setPortfolioData({
                        ...portfolioData,
                        logo: { 
                          ...portfolioData.logo, 
                          navbar: { ...portfolioData.logo.navbar, height: parseInt(e.target.value) || 40 }
                        }
                      })}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-white/60 text-sm mb-2">Hero Genişlik</label>
                    <input
                      type="number"
                      value={portfolioData.logo.hero?.width || 300}
                      onChange={(e) => setPortfolioData({
                        ...portfolioData,
                        logo: { 
                          ...portfolioData.logo, 
                          hero: { ...portfolioData.logo.hero, width: parseInt(e.target.value) || 300 }
                        }
                      })}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-white/60 text-sm mb-2">Hero Yükseklik</label>
                    <input
                      type="number"
                      value={portfolioData.logo.hero?.height || 100}
                      onChange={(e) => setPortfolioData({
                        ...portfolioData,
                        logo: { 
                          ...portfolioData.logo, 
                          hero: { ...portfolioData.logo.hero, height: parseInt(e.target.value) || 100 }
                        }
                      })}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-white/60 text-sm mb-2">Footer Genişlik</label>
                    <input
                      type="number"
                      value={portfolioData.logo.footer?.width || 150}
                      onChange={(e) => setPortfolioData({
                        ...portfolioData,
                        logo: { 
                          ...portfolioData.logo, 
                          footer: { ...portfolioData.logo.footer, width: parseInt(e.target.value) || 150 }
                        }
                      })}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-white/60 text-sm mb-2">Footer Yükseklik</label>
                    <input
                      type="number"
                      value={portfolioData.logo.footer?.height || 50}
                      onChange={(e) => setPortfolioData({
                        ...portfolioData,
                        logo: { 
                          ...portfolioData.logo, 
                          footer: { ...portfolioData.logo.footer, height: parseInt(e.target.value) || 50 }
                        }
                      })}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-white/60 text-sm mb-2">Metin Fallback Göster</label>
                  <input
                    type="checkbox"
                    checked={portfolioData.logo.showTextFallback}
                    onChange={(e) => setPortfolioData({
                      ...portfolioData,
                      logo: { ...portfolioData.logo, showTextFallback: e.target.checked }
                    })}
                    className="w-5 h-5"
                  />
                  <p className="text-xs text-white/40 mt-1">Logo yüklenemezse "ARHAVAL" metni gösterilsin</p>
                </div>
              </div>
            </div>
          )}

          {/* About Tab */}
          {activeTab === 'about' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">Hakkımızda Metni</h2>
              <textarea
                value={portfolioData.aboutText}
                onChange={(e) => setPortfolioData({ ...portfolioData, aboutText: e.target.value })}
                rows={10}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white"
              />
            </div>
          )}

          {/* Stats Tab */}
          {activeTab === 'stats' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">İstatistikler</h2>
              <div className="space-y-4">
                {portfolioData.stats.map((stat, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-white/60 text-sm mb-2">Sayı</label>
                        <input
                          type="number"
                          value={stat.target}
                          onChange={(e) => updateStat(index, 'target', e.target.value)}
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-white/60 text-sm mb-2">Suffix (örn: MİLYON, SAAT, K)</label>
                        <input
                          type="text"
                          value={stat.suffix}
                          onChange={(e) => updateStat(index, 'suffix', e.target.value)}
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-white/60 text-sm mb-2">Etiket</label>
                        <input
                          type="text"
                          value={stat.label}
                          onChange={(e) => updateStat(index, 'label', e.target.value)}
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navbar Links Tab */}
          {activeTab === 'navbar' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">Menü Linkleri</h2>
              <div className="space-y-4">
                {portfolioData.navbarLinks.map((link, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-white/60 text-sm mb-2">Link (href)</label>
                        <input
                          type="text"
                          value={link.href}
                          onChange={(e) => {
                            const updated = [...portfolioData.navbarLinks]
                            updated[index] = { ...updated[index], href: e.target.value }
                            setPortfolioData({ ...portfolioData, navbarLinks: updated })
                          }}
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-white/60 text-sm mb-2">Etiket</label>
                        <input
                          type="text"
                          value={link.label}
                          onChange={(e) => {
                            const updated = [...portfolioData.navbarLinks]
                            updated[index] = { ...updated[index], label: e.target.value }
                            setPortfolioData({ ...portfolioData, navbarLinks: updated })
                          }}
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Export/Import */}
        <div className="mt-6 glass-strong rounded-2xl p-6 border border-white/20 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white mb-2">Veri Yönetimi</h3>
            <p className="text-white/60 text-sm">Tüm verileri dışa aktar veya içe aktar</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={exportData}
              className="px-4 py-2 bg-secondary-cyan text-white font-bold rounded-lg hover:bg-secondary-cyan/80 transition-colors flex items-center gap-2"
            >
              <Download size={18} />
              Dışa Aktar
            </button>
            <label className="px-4 py-2 bg-primary-neon text-white font-bold rounded-lg hover:bg-primary-neon/80 transition-colors flex items-center gap-2 cursor-pointer">
              <Upload size={18} />
              İçe Aktar
              <input type="file" accept=".json" onChange={importData} className="hidden" />
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PortfolioAdmin

