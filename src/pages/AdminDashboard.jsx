import { useState, useEffect } from 'react'
import { Settings, Save, Eye, EyeOff, Lock, LogOut, Home, BarChart3, Video, Users, Calendar, Plus, Trash2, Copy, Target, CheckCircle, XCircle, Edit2, Download, Upload, FileText, Database, MessageSquare, Zap, TrendingUp, Trophy } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function AdminDashboard() {
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [activeTab, setActiveTab] = useState('stream') // 'stream', 'predictions', 'stats', 'content', 'quick-entry'
  const [quickEntryText, setQuickEntryText] = useState('')
  const [predictions, setPredictions] = useState([])
  const [systemStatus, setSystemStatus] = useState({ isOpen: false, activePredictionId: null })
  const [saveStatus, setSaveStatus] = useState('') // 'saving', 'saved', 'error'
  
  const [streamData, setStreamData] = useState({
    isLive: false,
    streamPlatform: 'twitch',
    twitchChannel: '',
    youtubeVideoId: '',
    streamTitle: '',
    streamDescription: '',
    streamUrl: '',
    matchInfo: '', // Eski format için geriye dönük uyumluluk
    match: {
      team1: {
        name: '',
        logo: ''
      },
      team2: {
        name: '',
        logo: ''
      },
      score: {
        team1: null,
        team2: null
      },
      status: 'upcoming' // 'upcoming', 'live', 'finished'
    }
  })

  // Check authentication on mount
  useEffect(() => {
    const adminPassword = localStorage.getItem('arhaval_admin_password')
    if (adminPassword === 'arhaval2024') {
      setIsAuthenticated(true)
      loadStreamData()
      loadPredictions()
      loadSystemStatus()
    }
  }, [])

  const loadSystemStatus = () => {
    const saved = localStorage.getItem('arhaval_system_status')
    if (saved) {
      try {
        setSystemStatus(JSON.parse(saved))
      } catch (e) {
        console.error('Error loading system status:', e)
      }
    }
  }

  const saveSystemStatus = (status) => {
    localStorage.setItem('arhaval_system_status', JSON.stringify(status))
    setSystemStatus(status)
  }

  const loadPredictions = () => {
    const saved = localStorage.getItem('arhaval_predictions')
    if (saved) {
      try {
        setPredictions(JSON.parse(saved))
      } catch (e) {
        console.error('Error loading predictions:', e)
      }
    }
  }

  const handleSetActivePrediction = (id) => {
    saveSystemStatus({
      ...systemStatus,
      activePredictionId: id
    })
    alert('Aktif soru güncellendi!')
    loadPredictions() // Reload to show updated status
  }

  const handleToggleSystem = () => {
    const newStatus = {
      ...systemStatus,
      isOpen: !systemStatus.isOpen
    }
    saveSystemStatus(newStatus)
  }

  const copyLink = () => {
    const url = `${window.location.origin}/eflive`
    navigator.clipboard.writeText(url)
    alert('Link kopyalandı: ' + url)
  }

  // Export Functions
  const handleExportAll = () => {
    const allData = {
      predictions: predictions,
      streamData: streamData,
      systemStatus: systemStatus,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    }
    
    const dataStr = JSON.stringify(allData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `arhaval_backup_${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleExportPredictions = () => {
    if (predictions.length === 0) {
      alert('Dışa aktarılacak tahmin bulunamadı!')
      return
    }

    // CSV Header
    let csv = 'Soru,Seçenekler,Oy Sayısı,Yüzde,Kazanılan,Olusturulma Tarihi\n'
    
    predictions.forEach(pred => {
      const totalVotes = Object.keys(pred.votes || {}).length
      const voteDistribution = pred.options.map((option, index) => {
        const votes = Object.values(pred.votes || {}).filter(v => v === index).length
        const percentage = totalVotes > 0 ? (votes / totalVotes * 100).toFixed(2) : 0
        const isWinner = votes === Math.max(...pred.options.map((_, i) => 
          Object.values(pred.votes || {}).filter(v => v === i).length
        ))
        return {
          option,
          votes,
          percentage,
          isWinner
        }
      })

      pred.options.forEach((option, index) => {
        const dist = voteDistribution[index]
        csv += `"${pred.question}","${option}",${dist.votes},${dist.percentage}%,${dist.isWinner ? 'Evet' : 'Hayır'},"${new Date(pred.createdAt).toLocaleString('tr-TR')}"\n`
      })
    })

    const dataBlob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `arhaval_predictions_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleImportData = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target.result)
        
        if (confirm('Mevcut verilerin üzerine yazılacak. Emin misiniz?')) {
          if (importedData.predictions) {
            localStorage.setItem('arhaval_predictions', JSON.stringify(importedData.predictions))
            setPredictions(importedData.predictions)
          }
          if (importedData.streamData) {
            localStorage.setItem('arhaval_stream_data', JSON.stringify(importedData.streamData))
            setStreamData(importedData.streamData)
          }
          if (importedData.systemStatus) {
            localStorage.setItem('arhaval_system_status', JSON.stringify(importedData.systemStatus))
            setSystemStatus(importedData.systemStatus)
          }
          alert('Veriler başarıyla içe aktarıldı!')
        }
      } catch (error) {
        alert('Dosya okunamadı! Geçerli bir JSON dosyası seçin.')
        console.error('Import error:', error)
      }
    }
    reader.readAsText(file)
    e.target.value = '' // Reset input
  }

  // Quick Entry Functions - Yayın sırasında hızlı tahmin girişi
  const handleQuickVote = (optionIndex) => {
    if (!systemStatus.activePredictionId) {
      alert('Önce aktif bir soru seçin!')
      return
    }

    const saved = localStorage.getItem('arhaval_predictions')
    if (saved) {
      try {
        const predictionsList = JSON.parse(saved)
        const updated = predictionsList.map(p => {
          if (p.id === systemStatus.activePredictionId) {
            const userId = `stream_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
            return {
              ...p,
              votes: {
                ...(p.votes || {}),
                [userId]: optionIndex
              }
            }
          }
          return p
        })
        localStorage.setItem('arhaval_predictions', JSON.stringify(updated))
        setPredictions(updated)
        
        // Visual feedback
        const activePrediction = predictionsList.find(p => p.id === systemStatus.activePredictionId)
        const optionName = activePrediction?.options[optionIndex]
        if (optionName) {
          alert(`✅ "${optionName}" için oy eklendi!`)
        }
      } catch (e) {
        console.error('Error adding vote:', e)
        alert('Hata! Oy eklenemedi.')
      }
    }
  }

  const handleBulkEntry = () => {
    if (!quickEntryText.trim()) {
      alert('Lütfen chat mesajlarını yapıştırın!')
      return
    }

    if (!systemStatus.activePredictionId) {
      alert('Önce aktif bir soru seçin!')
      return
    }

    const activePrediction = predictions.find(p => p.id === systemStatus.activePredictionId)
    if (!activePrediction) {
      alert('Aktif soru bulunamadı!')
      return
    }

    // Parse text - her satır bir tahmin
    const lines = quickEntryText.split('\n').filter(line => line.trim())
    let addedCount = 0

    const saved = localStorage.getItem('arhaval_predictions')
    if (saved) {
      try {
        const predictionsList = JSON.parse(saved)
        const updated = predictionsList.map(p => {
          if (p.id === systemStatus.activePredictionId) {
            const newVotes = { ...(p.votes || {}) }
            
            lines.forEach((line, index) => {
              // Her satırı kontrol et, seçeneklerden birini içeriyor mu?
              const lineLower = line.toLowerCase().trim()
              
              activePrediction.options.forEach((option, optionIndex) => {
                const optionLower = option.toLowerCase()
                // Eğer satır seçeneği içeriyorsa veya tam eşleşiyorsa
                if (lineLower.includes(optionLower) || lineLower === optionLower) {
                  const userId = `stream_bulk_${Date.now()}_${index}_${Math.random().toString(36).substr(2, 9)}`
                  newVotes[userId] = optionIndex
                  addedCount++
                }
              })
            })
            
            return {
              ...p,
              votes: newVotes
            }
          }
          return p
        })
        
        localStorage.setItem('arhaval_predictions', JSON.stringify(updated))
        setPredictions(updated)
        setQuickEntryText('')
        alert(`✅ ${addedCount} tahmin eklendi!`)
      } catch (e) {
        console.error('Error bulk entry:', e)
        alert('Hata! Tahminler eklenemedi.')
      }
    }
  }

  const loadStreamData = () => {
    const savedData = localStorage.getItem('arhaval_stream_data')
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData)
        setStreamData(parsed)
      } catch (e) {
        console.error('Error loading stream data:', e)
      }
    }
  }

  const handleLogin = (e) => {
    e.preventDefault()
    if (password === 'arhaval2024') {
      setIsAuthenticated(true)
      localStorage.setItem('arhaval_admin_password', password)
      setPassword('')
      loadStreamData()
    } else {
      alert('Yanlış şifre!')
    }
  }

  const handleSave = () => {
    setSaveStatus('saving')
    try {
      localStorage.setItem('arhaval_stream_data', JSON.stringify(streamData))
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus(''), 2000)
    } catch (e) {
      setSaveStatus('error')
      setTimeout(() => setSaveStatus(''), 3000)
    }
  }

  // Auto-save on change (with debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (streamData.streamTitle || streamData.streamDescription) {
        localStorage.setItem('arhaval_stream_data', JSON.stringify(streamData))
      }
    }, 1000)
    return () => clearTimeout(timer)
  }, [streamData])

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('arhaval_admin_password')
    navigate('/')
  }

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-bg-dark flex items-center justify-center p-4" style={{ backgroundColor: '#0a0b10' }}>
        <div className="glass-strong rounded-2xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="inline-flex p-4 rounded-full bg-primary-neon/20 mb-4">
              <Lock className="text-primary-neon" size={48} />
            </div>
            <h1 className="text-3xl font-bold tracking-wide text-white mb-2">
              ADMIN PANEL
            </h1>
            <p className="text-white/60">
              Arhaval Esports Yönetim Sistemi
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-white mb-2 font-medium">
                Admin Şifresi
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-primary-neon focus:ring-2 focus:ring-primary-neon/50"
                  placeholder="Şifrenizi girin"
                  required
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="w-full px-6 py-3 bg-primary-neon text-white font-bold tracking-wide uppercase rounded-lg hover:bg-primary-neon/90 transition-colors"
            >
              GİRİŞ YAP
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-white/60 hover:text-white text-sm transition-colors flex items-center justify-center gap-2"
            >
              <Home size={16} />
              Ana Sayfaya Dön
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Dashboard Screen
  return (
    <div className="min-h-screen bg-bg-dark" style={{ backgroundColor: '#0a0b10' }}>
      {/* Header */}
      <header className="glass-strong border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Settings className="text-primary-neon" size={28} />
              <div>
                <h1 className="text-2xl font-bold tracking-wide text-white">
                  ADMIN DASHBOARD
                </h1>
                <p className="text-white/60 text-sm">Arhaval Esports Yönetim</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 glass rounded-lg text-white hover:text-primary-neon transition-colors flex items-center gap-2"
              >
                <Home size={18} />
                Ana Sayfa
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 glass rounded-lg text-white hover:text-primary-neon transition-colors flex items-center gap-2"
              >
                <LogOut size={18} />
                Çıkış
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-white/10">
          <button
            onClick={() => setActiveTab('stream')}
            className={`px-6 py-3 font-bold tracking-wide transition-colors flex items-center gap-2 ${
              activeTab === 'stream'
                ? 'text-primary-neon border-b-2 border-primary-neon'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Video size={20} />
            Canlı Yayın
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-6 py-3 font-bold tracking-wide transition-colors flex items-center gap-2 ${
              activeTab === 'stats'
                ? 'text-primary-neon border-b-2 border-primary-neon'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <BarChart3 size={20} />
            İstatistikler
          </button>
          <button
            onClick={() => setActiveTab('quick-entry')}
            className={`px-6 py-3 font-bold tracking-wide transition-colors flex items-center gap-2 ${
              activeTab === 'quick-entry'
                ? 'text-primary-neon border-b-2 border-primary-neon'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Zap size={20} />
            Hızlı Giriş
          </button>
          <button
            onClick={() => navigate('/admin/predictions')}
            className="px-6 py-3 font-bold tracking-wide transition-colors flex items-center gap-2 text-white/60 hover:text-white"
          >
            <Target size={20} />
            Tahmin Soruları
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className={`px-6 py-3 font-bold tracking-wide transition-colors flex items-center gap-2 ${
              activeTab === 'content'
                ? 'text-primary-neon border-b-2 border-primary-neon'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Users size={20} />
            İçerik Yönetimi
          </button>
        </div>

        {/* Stream Management Tab */}
        {activeTab === 'stream' && (
          <div className="space-y-6">
            <div className="glass-strong rounded-xl p-6">
              <h2 className="text-2xl font-bold tracking-wide text-white mb-6">
                Canlı Yayın Ayarları
              </h2>

              {/* Live Status Toggle */}
              <div className="glass rounded-lg p-4 mb-6">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="text-white font-bold block mb-1 text-lg">Yayın Durumu</span>
                    <span className="text-white/60 text-sm">
                      {streamData.isLive ? '🟢 Yayında' : '⚫ Yayında Değil'}
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={streamData.isLive}
                      onChange={(e) => setStreamData({ ...streamData, isLive: e.target.checked })}
                      className="sr-only"
                    />
                    <div
                      className={`w-16 h-8 rounded-full transition-colors ${
                        streamData.isLive ? 'bg-primary-neon' : 'bg-white/20'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 bg-white rounded-full transition-transform mt-1 ${
                          streamData.isLive ? 'translate-x-9' : 'translate-x-1'
                        }`}
                      />
                    </div>
                  </div>
                </label>
              </div>


              {/* Stream Title */}
              <div className="mb-6">
                <label className="block text-white font-bold mb-3 text-lg flex items-center gap-2">
                  <Edit2 size={18} className="text-primary-neon" />
                  Yayın Başlığı
                </label>
                <input
                  type="text"
                  value={streamData.streamTitle}
                  onChange={(e) => setStreamData({ ...streamData, streamTitle: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-primary-neon focus:ring-2 focus:ring-primary-neon/50 transition-all"
                  placeholder="örnek: Arhaval Esports - Canlı Turnuva"
                />
                {streamData.streamTitle && (
                  <p className="text-white/40 text-xs mt-1">
                    {streamData.streamTitle.length} karakter
                  </p>
                )}
              </div>

              {/* Match Info - Professional Card */}
              <div className="mb-6">
                <label className="block text-white font-bold mb-4 text-lg flex items-center gap-2">
                  <Edit2 size={18} className="text-secondary-cyan" />
                  Maç Bilgisi
                </label>
                
                <div className="glass-strong rounded-xl p-6 border border-white/10">
                  {/* Team 1 */}
                  <div className="mb-4">
                    <label className="block text-white/80 text-sm mb-2 font-medium">Takım 1</label>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={streamData.match.team1.name}
                        onChange={(e) => setStreamData({ 
                          ...streamData, 
                          match: { ...streamData.match, team1: { ...streamData.match.team1, name: e.target.value } }
                        })}
                        className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-secondary-cyan focus:ring-2 focus:ring-secondary-cyan/50 transition-all"
                        placeholder="Takım adı"
                      />
                      <input
                        type="text"
                        value={streamData.match.team1.logo}
                        onChange={(e) => setStreamData({ 
                          ...streamData, 
                          match: { ...streamData.match, team1: { ...streamData.match.team1, logo: e.target.value } }
                        })}
                        className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-secondary-cyan focus:ring-2 focus:ring-secondary-cyan/50 transition-all text-sm"
                        placeholder="Logo URL"
                      />
                    </div>
                  </div>

                  {/* VS Divider */}
                  <div className="flex items-center justify-center my-4">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    <span className="px-4 text-white/60 font-bold text-lg">VS</span>
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  </div>

                  {/* Team 2 */}
                  <div className="mb-4">
                    <label className="block text-white/80 text-sm mb-2 font-medium">Takım 2</label>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={streamData.match.team2.name}
                        onChange={(e) => setStreamData({ 
                          ...streamData, 
                          match: { ...streamData.match, team2: { ...streamData.match.team2, name: e.target.value } }
                        })}
                        className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-secondary-cyan focus:ring-2 focus:ring-secondary-cyan/50 transition-all"
                        placeholder="Takım adı"
                      />
                      <input
                        type="text"
                        value={streamData.match.team2.logo}
                        onChange={(e) => setStreamData({ 
                          ...streamData, 
                          match: { ...streamData.match, team2: { ...streamData.match.team2, logo: e.target.value } }
                        })}
                        className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-secondary-cyan focus:ring-2 focus:ring-secondary-cyan/50 transition-all text-sm"
                        placeholder="Logo URL"
                      />
                    </div>
                  </div>

                  {/* Match Status */}
                  <div className="mb-4">
                    <label className="block text-white/80 text-sm mb-2 font-medium">Maç Durumu</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'upcoming', label: 'Başlamadı', icon: '⏰' },
                        { id: 'live', label: 'Canlı', icon: '🔴' },
                        { id: 'finished', label: 'Bitti', icon: '✅' }
                      ].map((status) => (
                        <button
                          key={status.id}
                          type="button"
                          onClick={() => setStreamData({ 
                            ...streamData, 
                            match: { ...streamData.match, status: status.id }
                          })}
                          className={`px-4 py-2 rounded-lg border-2 transition-all text-center ${
                            streamData.match.status === status.id
                              ? 'border-secondary-cyan bg-secondary-cyan/20'
                              : 'border-white/20 bg-white/5 hover:border-white/40'
                          }`}
                        >
                          <div className="text-lg mb-1">{status.icon}</div>
                          <div className="text-white text-xs font-bold">{status.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Score (if live or finished) */}
                  {(streamData.match.status === 'live' || streamData.match.status === 'finished') && (
                    <div>
                      <label className="block text-white/80 text-sm mb-2 font-medium">Skor</label>
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="number"
                          min="0"
                          value={streamData.match.score.team1 ?? ''}
                          onChange={(e) => setStreamData({ 
                            ...streamData, 
                            match: { 
                              ...streamData.match, 
                              score: { 
                                ...streamData.match.score, 
                                team1: e.target.value ? parseInt(e.target.value) : null 
                              }
                            }
                          })}
                          className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-secondary-cyan focus:ring-2 focus:ring-secondary-cyan/50 transition-all text-center text-xl font-bold"
                          placeholder="0"
                        />
                        <input
                          type="number"
                          min="0"
                          value={streamData.match.score.team2 ?? ''}
                          onChange={(e) => setStreamData({ 
                            ...streamData, 
                            match: { 
                              ...streamData.match, 
                              score: { 
                                ...streamData.match.score, 
                                team2: e.target.value ? parseInt(e.target.value) : null 
                              }
                            }
                          })}
                          className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-secondary-cyan focus:ring-2 focus:ring-secondary-cyan/50 transition-all text-center text-xl font-bold"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Stream Description */}
              <div className="mb-6">
                <label className="block text-white font-bold mb-3 text-lg flex items-center gap-2">
                  <Edit2 size={18} className="text-primary-neon" />
                  Yayın Açıklaması
                </label>
                <textarea
                  value={streamData.streamDescription}
                  onChange={(e) => setStreamData({ ...streamData, streamDescription: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-primary-neon focus:ring-2 focus:ring-primary-neon/50 resize-none transition-all"
                  placeholder="Yayın hakkında kısa bir açıklama..."
                />
                {streamData.streamDescription && (
                  <p className="text-white/40 text-xs mt-1">
                    {streamData.streamDescription.length} karakter
                  </p>
                )}
              </div>

              {/* Save Button with Status */}
              <div className="space-y-2">
                <button
                  onClick={handleSave}
                  disabled={saveStatus === 'saving'}
                  className={`w-full px-6 py-4 font-bold tracking-wide uppercase rounded-lg transition-all flex items-center justify-center gap-2 text-lg ${
                    saveStatus === 'saved'
                      ? 'bg-green-500 text-white'
                      : saveStatus === 'error'
                      ? 'bg-red-500 text-white'
                      : 'bg-primary-neon text-white hover:bg-primary-neon/90'
                  }`}
                >
                  {saveStatus === 'saving' ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      KAYDEDİLİYOR...
                    </>
                  ) : saveStatus === 'saved' ? (
                    <>
                      <CheckCircle size={24} />
                      KAYDEDİLDİ!
                    </>
                  ) : saveStatus === 'error' ? (
                    <>
                      <XCircle size={24} />
                      HATA!
                    </>
                  ) : (
                    <>
                      <Save size={24} />
                      AYARLARI KAYDET
                    </>
                  )}
                </button>
                {saveStatus === '' && (
                  <p className="text-white/40 text-xs text-center">
                    Değişiklikler otomatik olarak kaydedilir
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Predictions Tab - Only System Status and Active Question Selection */}
        {activeTab === 'predictions' && (
          <div className="space-y-6">
            {/* System Status */}
            <div className="glass-strong rounded-xl p-6">
              <h2 className="text-2xl font-bold tracking-wide text-white mb-6">
                Tahmin Sistemi Durumu
              </h2>
              
              <div className="space-y-4">
                <div className="glass rounded-lg p-4">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <span className="text-white font-bold block mb-1 text-lg">Tahmin Sistemi</span>
                      <span className="text-white/60 text-sm">
                        {systemStatus.isOpen ? '🟢 Sistem Açık' : '⚫ Sistem Kapalı'}
                      </span>
                      {systemStatus.isOpen && (
                        <p className="text-white/60 text-sm mt-2">
                          Link: <span className="font-mono text-primary-neon">{window.location.origin}/eflive</span>
                        </p>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={systemStatus.isOpen}
                        onChange={handleToggleSystem}
                        className="sr-only"
                      />
                      <div
                        className={`w-16 h-8 rounded-full transition-colors ${
                          systemStatus.isOpen ? 'bg-primary-neon' : 'bg-white/20'
                        }`}
                      >
                        <div
                          className={`w-6 h-6 bg-white rounded-full transition-transform mt-1 ${
                            systemStatus.isOpen ? 'translate-x-9' : 'translate-x-1'
                          }`}
                        />
                      </div>
                    </div>
                  </label>
                </div>

                {systemStatus.isOpen && (
                  <div className="flex gap-4">
                    <button
                      onClick={copyLink}
                      className="flex-1 px-4 py-3 bg-secondary-cyan/20 border border-secondary-cyan/50 text-secondary-cyan rounded-lg hover:bg-secondary-cyan/30 transition-colors flex items-center justify-center gap-2 font-bold"
                    >
                      <Copy size={18} />
                      Linki Kopyala
                    </button>
                    <button
                      onClick={() => navigate('/admin/predictions')}
                      className="px-4 py-3 bg-primary-neon/20 border border-primary-neon/50 text-primary-neon rounded-lg hover:bg-primary-neon/30 transition-colors flex items-center justify-center gap-2 font-bold"
                    >
                      <Target size={18} />
                      Soruları Yönet
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Active Question Selection */}
            <div className="glass-strong rounded-xl p-6">
              <h2 className="text-2xl font-bold tracking-wide text-white mb-6">
                Aktif Soru Seçimi
              </h2>

              {predictions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-white/60 mb-4">Henüz tahmin sorusu oluşturulmamış.</p>
                  <button
                    onClick={() => navigate('/admin/predictions')}
                    className="px-6 py-3 bg-primary-neon text-white font-bold rounded-lg hover:bg-primary-neon/90 transition-colors"
                  >
                    İlk Soruyu Oluştur
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {predictions.map((prediction) => {
                    const isActive = systemStatus.activePredictionId === prediction.id
                    return (
                      <div
                        key={prediction.id}
                        className={`glass rounded-lg p-4 cursor-pointer transition-all ${
                          isActive
                            ? 'border-2 border-primary-neon bg-primary-neon/10'
                            : 'border border-white/10 hover:border-white/20'
                        }`}
                        onClick={() => handleSetActivePrediction(prediction.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="text-white font-bold mb-1">{prediction.question}</h3>
                            <p className="text-white/60 text-sm">
                              {prediction.options.length} seçenek
                            </p>
                          </div>
                          {isActive && (
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-500/20 text-green-400">
                              AKTİF
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Stats Tab - Kayıt Yönetimi ve İstatistikler */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            {/* Export/Import Section */}
            <div className="glass-strong rounded-xl p-6">
              <h2 className="text-2xl font-bold tracking-wide text-white mb-6 flex items-center gap-3">
                <Database className="text-secondary-cyan" size={28} />
                Kayıt Yönetimi
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Export All Data */}
                <button
                  onClick={handleExportAll}
                  className="glass rounded-xl p-6 hover:bg-white/10 transition-all border-2 border-white/20 hover:border-secondary-cyan/50 group"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="p-3 rounded-xl bg-secondary-cyan/20 border-2 border-secondary-cyan/30 group-hover:scale-110 transition-transform">
                      <Download className="text-secondary-cyan" size={24} />
                    </div>
                    <div className="text-left">
                      <h3 className="text-white font-bold text-lg">Tüm Verileri Dışa Aktar</h3>
                      <p className="text-white/60 text-sm">JSON formatında indir</p>
                    </div>
                  </div>
                  <p className="text-white/40 text-xs">
                    Tahminler, oylar ve ayarlar dahil
                  </p>
                </button>

                {/* Export Predictions Only */}
                <button
                  onClick={handleExportPredictions}
                  className="glass rounded-xl p-6 hover:bg-white/10 transition-all border-2 border-white/20 hover:border-primary-neon/50 group"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="p-3 rounded-xl bg-primary-neon/20 border-2 border-primary-neon/30 group-hover:scale-110 transition-transform">
                      <FileText className="text-primary-neon" size={24} />
                    </div>
                    <div className="text-left">
                      <h3 className="text-white font-bold text-lg">Tahminleri Dışa Aktar</h3>
                      <p className="text-white/60 text-sm">CSV formatında indir</p>
                    </div>
                  </div>
                  <p className="text-white/40 text-xs">
                    Sorular ve oy sonuçları
                  </p>
                </button>
              </div>

              {/* Import Section */}
              <div className="glass rounded-xl p-6 border-2 border-dashed border-white/20">
                <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                  <Upload className="text-primary-neon" size={20} />
                  Veri İçe Aktar
                </h3>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                  className="hidden"
                  id="import-file"
                />
                <label
                  htmlFor="import-file"
                  className="block w-full px-6 py-4 bg-primary-neon/20 border-2 border-primary-neon/50 text-primary-neon rounded-lg hover:bg-primary-neon/30 transition-colors cursor-pointer text-center font-bold"
                >
                  JSON Dosyası Seç
                </label>
                <p className="text-white/40 text-xs mt-3 text-center">
                  Daha önce dışa aktardığınız JSON dosyasını yükleyin
                </p>
              </div>
            </div>

            {/* Statistics */}
            <div className="glass-strong rounded-xl p-6">
              <h2 className="text-2xl font-bold tracking-wide text-white mb-6 flex items-center gap-3">
                <BarChart3 className="text-secondary-cyan" size={28} />
                İstatistikler
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Total Predictions */}
                <div className="glass rounded-xl p-6 text-center border-2 border-white/20">
                  <div className="text-4xl font-bold text-secondary-cyan mb-2">
                    {predictions.length}
                  </div>
                  <div className="text-white/80 font-medium">Toplam Soru</div>
                  <div className="text-white/40 text-xs mt-1">
                    {predictions.filter(p => systemStatus.activePredictionId === p.id).length} aktif
                  </div>
                </div>

                {/* Total Votes */}
                <div className="glass rounded-xl p-6 text-center border-2 border-white/20">
                  <div className="text-4xl font-bold text-primary-neon mb-2">
                    {predictions.reduce((total, p) => {
                      return total + Object.keys(p.votes || {}).length
                    }, 0)}
                  </div>
                  <div className="text-white/80 font-medium">Toplam Oy</div>
                  <div className="text-white/40 text-xs mt-1">
                    Tüm sorularda
                  </div>
                </div>

                {/* Active Votes */}
                <div className="glass rounded-xl p-6 text-center border-2 border-white/20">
                  <div className="text-4xl font-bold text-secondary-cyan mb-2">
                    {systemStatus.isOpen && systemStatus.activePredictionId
                      ? Object.keys(
                          predictions.find(p => p.id === systemStatus.activePredictionId)?.votes || {}
                        ).length
                      : 0}
                  </div>
                  <div className="text-white/80 font-medium">Aktif Soru Oyları</div>
                  <div className="text-white/40 text-xs mt-1">
                    {systemStatus.isOpen ? 'Canlı' : 'Kapalı'}
                  </div>
                </div>
              </div>
            </div>

            {/* Prediction History */}
            <div className="glass-strong rounded-xl p-6">
              <h2 className="text-2xl font-bold tracking-wide text-white mb-6 flex items-center gap-3">
                <Calendar className="text-secondary-cyan" size={28} />
                Geçmiş Tahminler
              </h2>
              
              {predictions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-white/60">Henüz tahmin kaydı yok.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {predictions
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .map((prediction) => {
                      const totalVotes = Object.keys(prediction.votes || {}).length
                      const voteDistribution = prediction.options.map((_, index) => {
                        const votes = Object.values(prediction.votes || {}).filter(v => v === index).length
                        return { option: prediction.options[index], votes, percentage: totalVotes > 0 ? (votes / totalVotes * 100).toFixed(1) : 0 }
                      })
                      const winner = voteDistribution.reduce((max, item) => item.votes > max.votes ? item : max, voteDistribution[0])

                      return (
                        <div key={prediction.id} className="glass rounded-xl p-5 border-2 border-white/10 hover:border-white/20 transition-all">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="text-white font-bold text-lg mb-1">{prediction.question}</h3>
                              <p className="text-white/60 text-sm">
                                {new Date(prediction.createdAt).toLocaleString('tr-TR')}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-secondary-cyan">{totalVotes}</div>
                              <div className="text-white/60 text-xs">oy</div>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            {voteDistribution.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-3">
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-white font-medium text-sm">{item.option}</span>
                                    <span className="text-white/80 text-sm font-bold">
                                      {item.votes} ({item.percentage}%)
                                    </span>
                                  </div>
                                  <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                                    <div
                                      className={`h-2 rounded-full transition-all ${
                                        item.option === winner.option
                                          ? 'bg-gradient-to-r from-primary-neon to-secondary-cyan'
                                          : 'bg-white/20'
                                      }`}
                                      style={{ width: `${item.percentage}%` }}
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          {winner && (
                            <div className="mt-3 pt-3 border-t border-white/10">
                              <div className="flex items-center gap-2 text-primary-neon">
                                <Trophy size={16} />
                                <span className="text-sm font-bold">
                                  Kazanan: {winner.option} ({winner.percentage}%)
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Content Management Tab */}
        {activeTab === 'content' && (
          <div className="glass-strong rounded-xl p-6">
            <h2 className="text-2xl font-bold tracking-wide text-white mb-6">
              İçerik Yönetimi
            </h2>
            <p className="text-white/60">
              İçerik yönetimi yakında eklenecek...
            </p>
          </div>
        )}

        {/* Quick Entry Tab - Yayın Sırasında Hızlı Tahmin Girişi */}
        {activeTab === 'quick-entry' && (
          <div className="space-y-6">
            {/* Active Question Display */}
            <div className="glass-strong rounded-xl p-6">
              <h2 className="text-2xl font-bold tracking-wide text-white mb-6 flex items-center gap-3">
                <MessageSquare className="text-secondary-cyan" size={28} />
                Aktif Soru
              </h2>
              
              {!systemStatus.activePredictionId ? (
                <div className="text-center py-8">
                  <p className="text-white/60 mb-4">Aktif soru yok. Önce bir soru seçin.</p>
                  <button
                    onClick={() => setActiveTab('predictions')}
                    className="px-6 py-3 bg-primary-neon text-white font-bold rounded-lg hover:bg-primary-neon/90 transition-colors"
                  >
                    Soru Seç
                  </button>
                </div>
              ) : (() => {
                const activePrediction = predictions.find(p => p.id === systemStatus.activePredictionId)
                if (!activePrediction) {
                  return (
                    <div className="text-center py-8">
                      <p className="text-white/60">Aktif soru bulunamadı.</p>
                    </div>
                  )
                }

                const totalVotes = Object.keys(activePrediction.votes || {}).length
                const voteDistribution = activePrediction.options.map((_, index) => {
                  const votes = Object.values(activePrediction.votes || {}).filter(v => v === index).length
                  return { votes, percentage: totalVotes > 0 ? (votes / totalVotes * 100).toFixed(1) : 0 }
                })

                return (
                  <div className="space-y-4">
                    <div className="glass rounded-xl p-5 border-2 border-primary-neon/30">
                      <h3 className="text-white font-bold text-xl mb-2">{activePrediction.question}</h3>
                      <div className="flex items-center gap-2 text-white/60 text-sm">
                        <TrendingUp size={16} />
                        <span>Toplam: <span className="text-secondary-cyan font-bold">{totalVotes}</span> oy</span>
                      </div>
                    </div>

                    {/* Quick Vote Buttons */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {activePrediction.options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleQuickVote(index)}
                          className="glass rounded-xl p-6 hover:bg-white/10 transition-all border-2 border-white/20 hover:border-primary-neon/50 group text-left"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-xl bg-primary-neon/20 border-2 border-primary-neon/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <span className="text-primary-neon font-bold text-lg">{index + 1}</span>
                              </div>
                              <span className="text-white font-bold text-lg">{option}</span>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-secondary-cyan">{voteDistribution[index].votes}</div>
                              <div className="text-white/60 text-xs">{voteDistribution[index].percentage}%</div>
                            </div>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                            <div
                              className="h-2 rounded-full bg-gradient-to-r from-primary-neon to-secondary-cyan transition-all"
                              style={{ width: `${voteDistribution[index].percentage}%` }}
                            />
                          </div>
                          <div className="mt-3 text-center">
                            <span className="text-primary-neon text-sm font-bold">+1 Oy Ekle</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })()}
            </div>

            {/* Bulk Entry - Chat'ten Toplu Giriş */}
            <div className="glass-strong rounded-xl p-6">
              <h2 className="text-2xl font-bold tracking-wide text-white mb-6 flex items-center gap-3">
                <MessageSquare className="text-primary-neon" size={28} />
                Toplu Giriş (Chat'ten Kopyala-Yapıştır)
              </h2>
              
              {!systemStatus.activePredictionId ? (
                <div className="text-center py-8">
                  <p className="text-white/60">Önce aktif bir soru seçin.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-white font-bold mb-3">
                      Chat Mesajlarını Yapıştırın
                    </label>
                    <textarea
                      value={quickEntryText}
                      onChange={(e) => setQuickEntryText(e.target.value)}
                      rows={8}
                      className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-primary-neon focus:ring-2 focus:ring-primary-neon/50 resize-none transition-all font-mono text-sm"
                      placeholder={`Örnek:\nTeam A\nTeam B\nTeam A\nTeam A\nTeam B\n\nHer satır bir tahmin olarak algılanır. Seçenek isimlerini içeren satırlar otomatik olarak eşleştirilir.`}
                    />
                    <p className="text-white/40 text-xs mt-2">
                      Her satır bir tahmin olarak algılanır. Seçenek isimlerini içeren satırlar otomatik eşleştirilir.
                    </p>
                  </div>
                  
                  <button
                    onClick={handleBulkEntry}
                    disabled={!quickEntryText.trim()}
                    className="w-full px-6 py-4 bg-primary-neon text-white font-bold rounded-xl hover:bg-primary-neon/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Zap size={20} />
                    Tahminleri Ekle
                  </button>
                </div>
              )}
            </div>

            {/* Live Stats */}
            {systemStatus.activePredictionId && (() => {
              const activePrediction = predictions.find(p => p.id === systemStatus.activePredictionId)
              if (!activePrediction) return null

              const totalVotes = Object.keys(activePrediction.votes || {}).length
              const voteDistribution = activePrediction.options.map((_, index) => {
                const votes = Object.values(activePrediction.votes || {}).filter(v => v === index).length
                return { 
                  option: activePrediction.options[index], 
                  votes, 
                  percentage: totalVotes > 0 ? (votes / totalVotes * 100).toFixed(1) : 0 
                }
              })
              const winner = voteDistribution.reduce((max, item) => item.votes > max.votes ? item : max, voteDistribution[0])

              return (
                <div className="glass-strong rounded-xl p-6">
                  <h2 className="text-2xl font-bold tracking-wide text-white mb-6 flex items-center gap-3">
                    <TrendingUp className="text-secondary-cyan" size={28} />
                    Canlı Sonuçlar
                  </h2>
                  
                  <div className="space-y-4">
                    {voteDistribution.map((item, index) => (
                      <div key={index} className="glass rounded-xl p-5 border-2 border-white/10">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            {item.option === winner.option && (
                              <Trophy className="text-primary-neon" size={20} />
                            )}
                            <span className="text-white font-bold text-lg">{item.option}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-secondary-cyan">{item.votes}</div>
                            <div className="text-white/60 text-sm">{item.percentage}%</div>
                          </div>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                          <div
                            className={`h-3 rounded-full transition-all ${
                              item.option === winner.option
                                ? 'bg-gradient-to-r from-primary-neon to-secondary-cyan'
                                : 'bg-white/20'
                            }`}
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })()}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard

