import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { UserPlus, Lock, User, ArrowLeft, CheckCircle } from 'lucide-react'

function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!formData.username.trim()) {
      setError('Kullanıcı adı gerekli!')
      return
    }

    if (formData.username.length < 3) {
      setError('Kullanıcı adı en az 3 karakter olmalı!')
      return
    }

    if (!formData.password) {
      setError('Şifre gerekli!')
      return
    }

    if (formData.password.length < 4) {
      setError('Şifre en az 4 karakter olmalı!')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Şifreler eşleşmiyor!')
      return
    }

    // Check if username already exists
    const users = JSON.parse(localStorage.getItem('arhaval_users') || '[]')
    const existingUser = users.find(u => u.username.toLowerCase() === formData.username.toLowerCase())
    
    if (existingUser) {
      setError('Bu kullanıcı adı zaten kullanılıyor!')
      return
    }

    // Create user
    const newUser = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      username: formData.username.trim(),
      email: formData.email.trim() || null,
      password: formData.password, // In production, hash this!
      totalPoints: 0,
      rank: 0,
      createdAt: new Date().toISOString()
    }

    // Save user
    users.push(newUser)
    localStorage.setItem('arhaval_users', JSON.stringify(users))

    // Auto login
    localStorage.setItem('arhaval_current_user', JSON.stringify({
      id: newUser.id,
      username: newUser.username
    }))

    setSuccess(true)
    setTimeout(() => {
      navigate('/leaderboard')
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-bg-dark flex items-center justify-center p-4" style={{ backgroundColor: '#0a0b10' }}>
      <div className="glass-strong rounded-2xl p-8 max-w-md w-full">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-all mb-6"
        >
          <ArrowLeft size={18} />
          <span className="text-sm">Ana Sayfa</span>
        </Link>

        <div className="text-center mb-8">
          <div className="inline-flex p-4 rounded-full bg-primary-neon/20 mb-4">
            <UserPlus className="text-primary-neon" size={48} />
          </div>
          <h1 className="text-3xl font-bold tracking-wide text-white mb-2">
            KAYIT OL
          </h1>
          <p className="text-white/60">
            Tahmin yapmak için hesap oluşturun
          </p>
        </div>

        {success ? (
          <div className="text-center py-8">
            <div className="inline-flex p-4 rounded-full bg-green-500/20 mb-4">
              <CheckCircle className="text-green-400" size={48} />
            </div>
            <p className="text-white font-bold text-xl mb-2">Kayıt Başarılı!</p>
            <p className="text-white/60">Yönlendiriliyorsunuz...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="glass rounded-lg p-4 border-2 border-red-500/50 bg-red-500/10">
                <p className="text-red-400 text-sm font-bold">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-white mb-2 font-medium flex items-center gap-2">
                <User size={16} />
                Kullanıcı Adı *
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-primary-neon focus:ring-2 focus:ring-primary-neon/50"
                placeholder="Kullanıcı adınız"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="block text-white mb-2 font-medium">
                E-posta (Opsiyonel)
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-primary-neon focus:ring-2 focus:ring-primary-neon/50"
                placeholder="email@example.com"
              />
            </div>

            <div>
              <label className="block text-white mb-2 font-medium flex items-center gap-2">
                <Lock size={16} />
                Şifre *
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-primary-neon focus:ring-2 focus:ring-primary-neon/50"
                placeholder="Şifreniz"
                required
              />
            </div>

            <div>
              <label className="block text-white mb-2 font-medium">
                Şifre Tekrar *
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-primary-neon focus:ring-2 focus:ring-primary-neon/50"
                placeholder="Şifrenizi tekrar girin"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 bg-primary-neon text-white font-bold tracking-wide uppercase rounded-lg hover:bg-primary-neon/90 transition-colors"
            >
              KAYIT OL
            </button>

            <div className="text-center">
              <p className="text-white/60 text-sm">
                Zaten hesabınız var mı?{' '}
                <Link to="/login" className="text-primary-neon hover:text-primary-neon/80 font-bold">
                  Giriş Yap
                </Link>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default Register




