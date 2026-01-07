import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Trash2, ArrowLeft, Target, Settings, Eye, EyeOff, Lock, LogOut, Copy, Edit2, CheckCircle, XCircle } from 'lucide-react'

function PredictionsAdmin() {
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [predictions, setPredictions] = useState([])
  const [systemStatus, setSystemStatus] = useState({ isOpen: false, activePredictionId: null })
  const [newPrediction, setNewPrediction] = useState({
    question: '',
    options: ['', ''],
    template: 'custom', // 'match_winner', 'first_kill', 'round_count', 'custom'
    points: 10, // Soru puanı
    matchId: '', // Hangi maça ait (boş = genel)
    isRequired: false // Zorunlu soru mu? (Her maç için "Bu maçı kim kazanır?")
  })

  // Check authentication on mount
  useEffect(() => {
    const adminPassword = localStorage.getItem('arhaval_admin_password')
    if (adminPassword === 'arhaval2024') {
      setIsAuthenticated(true)
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

  const savePredictions = (preds) => {
    localStorage.setItem('arhaval_predictions', JSON.stringify(preds))
    setPredictions(preds)
  }

  const handleLogin = (e) => {
    e.preventDefault()
    if (password === 'arhaval2024') {
      localStorage.setItem('arhaval_admin_password', password)
      setIsAuthenticated(true)
      loadPredictions()
      loadSystemStatus()
    } else {
      alert('Yanlış şifre!')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('arhaval_admin_password')
    setIsAuthenticated(false)
    setPassword('')
  }

  const handleCreatePrediction = () => {
    const validOptions = newPrediction.options.filter(o => o.trim())
    
    if (!newPrediction.question.trim()) {
      setCreateStatus('error')
      setTimeout(() => setCreateStatus(''), 2000)
      return
    }
    
    if (validOptions.length < 2) {
      setCreateStatus('error')
      setTimeout(() => setCreateStatus(''), 2000)
      return
    }

    setCreateStatus('creating')
    
    setTimeout(() => {
      const prediction = {
        id: Date.now().toString(),
        question: newPrediction.question.trim(),
        options: validOptions,
        template: newPrediction.template,
        points: parseInt(newPrediction.points) || 10,
        matchId: newPrediction.matchId || null,
        isRequired: newPrediction.isRequired || false,
        correctAnswer: null, // Yayın bitiminde girilecek
        isAnswered: false, // Doğru cevap girildi mi?
        closedAt: null, // Ne zaman kapandı
        createdAt: new Date().toISOString(),
        votes: {}
      }

      const updated = [...predictions, prediction]
      savePredictions(updated)
      setNewPrediction({ question: '', options: ['', ''], template: 'custom', points: 10, matchId: '', isRequired: false })
      setCreateStatus('success')
      setTimeout(() => setCreateStatus(''), 2000)
    }, 500)
  }

  const handleDeletePrediction = (id) => {
    if (confirm('Bu tahmin sorusunu silmek istediğinize emin misiniz?')) {
      const updated = predictions.filter(p => p.id !== id)
      savePredictions(updated)
      
      // If deleted prediction was active, clear active status
      if (systemStatus.activePredictionId === id) {
        saveSystemStatus({ ...systemStatus, activePredictionId: null })
      }
    }
  }

  const handleSetActive = (id) => {
    saveSystemStatus({ ...systemStatus, activePredictionId: id })
    alert('Aktif soru güncellendi!')
  }

  const toggleSystemStatus = () => {
    const newStatus = { ...systemStatus, isOpen: !systemStatus.isOpen }
    saveSystemStatus(newStatus)
  }

  const copyLink = () => {
    const link = `${window.location.origin}/eflive`
    navigator.clipboard.writeText(link)
    alert('Link kopyalandı!')
  }

  const copyOverlayLink = () => {
    const link = `${window.location.origin}/overlay`
    navigator.clipboard.writeText(link)
    alert('Overlay linki kopyalandı! OBS Browser Source olarak ekleyebilirsiniz.')
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-bg-dark flex items-center justify-center p-4" style={{ backgroundColor: '#0a0b10' }}>
        <div className="glass-strong rounded-2xl p-8 max-w-md w-full">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-full bg-primary-neon/20">
              <Lock className="text-primary-neon" size={32} />
            </div>
            <h1 className="text-3xl font-bold tracking-wide text-white">Admin Girişi</h1>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-white font-bold mb-2">Şifre</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-primary-neon focus:ring-2 focus:ring-primary-neon/50"
                  placeholder="Şifrenizi girin"
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
              Giriş Yap
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-dark py-8 px-4" style={{ backgroundColor: '#0a0b10' }}>
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/admin')}
                className="p-2 rounded-lg glass hover:bg-white/10 transition-colors"
              >
                <ArrowLeft className="text-white" size={24} />
              </button>
              <div>
                <h1 className="text-4xl font-bold tracking-wide text-white mb-2">Tahmin Soruları Yönetimi</h1>
                <p className="text-white/60">Tahmin sorularını oluşturun ve yönetin</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 glass rounded-lg text-white hover:text-primary-neon transition-colors flex items-center gap-2"
            >
              <LogOut size={18} />
              Çıkış
            </button>
          </div>
        </div>

        {/* System Status Toggle */}
        <div className="glass-strong rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-wide text-white mb-2">Tahmin Sistemi</h2>
              <p className="text-white/60">Sistemi açıp kapatabilirsiniz</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-white font-bold mb-1">
                  {systemStatus.isOpen ? 'Sistem Açık' : 'Sistem Kapalı'}
                </div>
                {systemStatus.isOpen && (
                  <div className="text-white/60 text-sm">
                    Link: <span className="font-mono text-primary-neon">{window.location.origin}/eflive</span>
                  </div>
                )}
              </div>
              <button
                onClick={toggleSystemStatus}
                className={`px-6 py-3 rounded-lg font-bold transition-colors ${
                  systemStatus.isOpen
                    ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                    : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                }`}
              >
                {systemStatus.isOpen ? 'Kapat' : 'Aç'}
              </button>
              {systemStatus.isOpen && (
                <div className="flex gap-3">
                  <button
                    onClick={copyOverlayLink}
                    className="flex-1 px-4 py-3 bg-primary-neon/20 border border-primary-neon/50 text-primary-neon rounded-lg hover:bg-primary-neon/30 transition-colors flex items-center justify-center gap-2 font-bold"
                  >
                    <Copy size={18} />
                    Overlay (OBS)
                  </button>
                  <button
                    onClick={copyLink}
                    className="flex-1 px-4 py-3 bg-secondary-cyan/20 border border-secondary-cyan/50 text-secondary-cyan rounded-lg hover:bg-secondary-cyan/30 transition-colors flex items-center justify-center gap-2 font-bold"
                  >
                    <Copy size={18} />
                    Web Linki
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Create New Prediction */}
          <div className="glass-strong rounded-xl p-6">
            <h2 className="text-2xl font-bold tracking-wide text-white mb-6">
              Yeni Tahmin Sorusu Oluştur
            </h2>

            <div className="space-y-6">
              {/* Template Selection - Enhanced */}
              <div>
                <label className="block text-white font-bold mb-4 text-lg flex items-center gap-2">
                  <Target size={18} className="text-secondary-cyan" />
                  Şablon Tipi Seçin
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'match_winner', label: 'Maç Kazananı', icon: '🏆', color: 'primary-neon' },
                    { id: 'first_kill', label: 'İlk Kill', icon: '🎯', color: 'secondary-cyan' },
                    { id: 'round_count', label: 'Round Sayısı', icon: '📊', color: 'primary-neon' },
                    { id: 'custom', label: 'Özel', icon: '✨', color: 'primary-neon' }
                  ].map((template) => (
                    <button
                      key={template.id}
                      type="button"
                      onClick={() => setNewPrediction({ ...newPrediction, template: template.id })}
                      className={`p-5 rounded-xl border-2 transition-all text-center relative overflow-hidden group ${
                        newPrediction.template === template.id
                          ? 'border-secondary-cyan bg-secondary-cyan/20 shadow-lg shadow-secondary-cyan/30 scale-105'
                          : 'border-white/20 bg-white/5 hover:border-white/40 hover:scale-102'
                      }`}
                    >
                      {newPrediction.template === template.id && (
                        <div className="absolute inset-0 bg-gradient-to-br from-secondary-cyan/10 to-transparent" />
                      )}
                      <div className="text-3xl mb-2 relative z-10">{template.icon}</div>
                      <div className={`text-white text-sm font-bold relative z-10 ${
                        newPrediction.template === template.id ? 'text-secondary-cyan' : ''
                      }`}>
                        {template.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Question Input - Enhanced */}
              <div className="relative">
                <label className="block text-white font-bold mb-3 text-lg flex items-center gap-2">
                  <Edit2 size={18} className="text-primary-neon" />
                  Soru Metni
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-neon/50 text-xl font-bold">
                    ?
                  </div>
                  <input
                    type="text"
                    value={newPrediction.question}
                    onChange={(e) => setNewPrediction({ ...newPrediction, question: e.target.value })}
                    className="w-full pl-12 pr-4 py-4 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-primary-neon focus:ring-2 focus:ring-primary-neon/50 transition-all text-lg"
                    placeholder={
                      newPrediction.template === 'match_winner' ? 'Bu maçı hangi takım kazanacak?' :
                      newPrediction.template === 'first_kill' ? 'Maçın ilk killini kim alacak?' :
                      newPrediction.template === 'round_count' ? 'Toplam kaç round oynanacak?' :
                      'Soru metninizi buraya yazın...'
                    }
                  />
                </div>
                {newPrediction.question && (
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-white/40 text-xs">
                      {newPrediction.question.length} karakter
                    </p>
                    {newPrediction.question.length > 0 && (
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    )}
                  </div>
                )}
              </div>

              {/* Options - Enhanced */}
              <div>
                <label className="block text-white font-bold mb-4 text-lg flex items-center gap-2">
                  <Edit2 size={18} className="text-primary-neon" />
                  Seçenekler
                  <span className="text-white/60 text-sm font-normal">(En az 2)</span>
                </label>
                <div className="space-y-3">
                  {newPrediction.options.map((option, index) => (
                    <div key={index} className="flex gap-3 items-center group">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg transition-all ${
                        option.trim()
                          ? 'bg-primary-neon/20 text-primary-neon border-2 border-primary-neon/30'
                          : 'bg-white/5 text-white/40 border-2 border-white/10'
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </div>
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...newPrediction.options]
                          newOptions[index] = e.target.value
                          setNewPrediction({ ...newPrediction, options: newOptions })
                        }}
                        className="flex-1 px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-primary-neon focus:ring-2 focus:ring-primary-neon/50 transition-all"
                        placeholder={`Seçenek ${index + 1} - Örn: Team A`}
                      />
                      {newPrediction.options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => {
                            const newOptions = newPrediction.options.filter((_, i) => i !== index)
                            setNewPrediction({ ...newPrediction, options: newOptions })
                          }}
                          className="px-4 py-3 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-all border-2 border-red-500/30 hover:border-red-500/50"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setNewPrediction({ ...newPrediction, options: [...newPrediction.options, ''] })}
                    className="w-full px-4 py-3 glass rounded-xl text-white hover:text-primary-neon transition-all flex items-center justify-center gap-2 border-2 border-dashed border-white/20 hover:border-primary-neon/50"
                  >
                    <Plus size={20} />
                    <span className="font-bold">Yeni Seçenek Ekle</span>
                  </button>
                </div>
              </div>

              <button
                onClick={handleCreatePrediction}
                disabled={createStatus === 'creating'}
                className={`w-full px-6 py-3 font-bold tracking-wide uppercase rounded-lg transition-all flex items-center justify-center gap-2 ${
                  createStatus === 'success'
                    ? 'bg-green-500 text-white'
                    : createStatus === 'error'
                    ? 'bg-red-500 text-white'
                    : 'bg-primary-neon text-white hover:bg-primary-neon/90'
                }`}
              >
                {createStatus === 'creating' ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    OLUŞTURULUYOR...
                  </>
                ) : createStatus === 'success' ? (
                  <>
                    <CheckCircle size={20} />
                    OLUŞTURULDU!
                  </>
                ) : createStatus === 'error' ? (
                  <>
                    <XCircle size={20} />
                    HATA! LÜTFEN KONTROL EDİN
                  </>
                ) : (
                  <>
                    <Plus size={20} />
                    TAHMİN SORUSU OLUŞTUR
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Existing Predictions */}
          <div className="glass-strong rounded-xl p-6">
            <h2 className="text-2xl font-bold tracking-wide text-white mb-6">
              Mevcut Tahmin Soruları ({predictions.length})
            </h2>

            {predictions.length === 0 ? (
              <p className="text-white/60 text-center py-8">Henüz tahmin sorusu oluşturulmamış.</p>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {predictions.map((prediction) => {
                  const totalVotes = Object.values(prediction.votes || {}).length
                  const isActive = systemStatus.activePredictionId === prediction.id
                  
                  return (
                    <div key={prediction.id} className="glass rounded-lg p-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-white">{prediction.question}</h3>
                            {isActive && systemStatus.isOpen && (
                              <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-500/20 text-green-400">
                                ŞU AN AKTİF
                              </span>
                            )}
                          </div>
                          
                          <div className="space-y-2 mb-4">
                            {prediction.options.map((option, idx) => {
                              const votes = Object.values(prediction.votes || {}).filter(v => v === idx).length
                              const percentage = totalVotes > 0 ? (votes / totalVotes * 100).toFixed(1) : 0
                              return (
                                <div key={idx} className="flex items-center gap-3">
                                  <div className="flex-1 bg-white/5 rounded-lg p-2">
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="text-white font-medium">{option}</span>
                                      <span className="text-white/60 text-sm">{votes} oy ({percentage}%)</span>
                                    </div>
                                    <div className="w-full bg-white/10 rounded-full h-2">
                                      <div 
                                        className="bg-secondary-cyan h-2 rounded-full transition-all"
                                        style={{ width: `${percentage}%` }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        {!isActive && (
                          <button
                            onClick={() => handleSetActive(prediction.id)}
                            className="flex-1 px-4 py-2 bg-primary-neon/20 text-primary-neon rounded-lg hover:bg-primary-neon/30 transition-colors font-bold text-sm"
                          >
                            Aktif Soru Yap
                          </button>
                        )}
                        <button
                          onClick={() => handleDeletePrediction(prediction.id)}
                          className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PredictionsAdmin

