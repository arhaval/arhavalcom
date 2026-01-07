import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Trophy, TrendingUp, User, ArrowLeft, Medal, Award } from 'lucide-react'

function Leaderboard() {
  const [currentUser, setCurrentUser] = useState(null)
  const [users, setUsers] = useState([])
  const [userRank, setUserRank] = useState(0)

  useEffect(() => {
    loadData()
    
    // Auto-refresh every 5 seconds
    const interval = setInterval(() => {
      loadData()
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const loadData = () => {
    // Load current user
    const currentUserData = localStorage.getItem('arhaval_current_user')
    if (currentUserData) {
      try {
        setCurrentUser(JSON.parse(currentUserData))
      } catch (e) {
        console.error('Error loading current user:', e)
      }
    }

    // Load all users and calculate leaderboard
    const usersData = JSON.parse(localStorage.getItem('arhaval_users') || '[]')
    
    // Calculate total points for each user
    const usersWithPoints = usersData.map(user => {
      // Calculate points from predictions
      const predictions = JSON.parse(localStorage.getItem('arhaval_predictions') || '[]')
      let totalPoints = 0

      predictions.forEach(pred => {
        if (pred.isAnswered && pred.correctAnswer !== null) {
          const userVote = Object.entries(pred.votes || {}).find(([userId]) => userId.startsWith(user.id))
          if (userVote) {
            const voteIndex = userVote[1]
            if (voteIndex === pred.correctAnswer) {
              totalPoints += pred.points || 10
            }
          }
        }
      })

      return {
        ...user,
        totalPoints
      }
    })

    // Sort by points (descending)
    const sorted = usersWithPoints.sort((a, b) => b.totalPoints - a.totalPoints)
    
    // Add rank
    const ranked = sorted.map((user, index) => ({
      ...user,
      rank: index + 1
    }))

    setUsers(ranked)

    // Find current user rank
    if (currentUser) {
      const currentUserRanked = ranked.find(u => u.id === currentUser.id)
      if (currentUserRanked) {
        setUserRank(currentUserRanked.rank)
      }
    }
  }

  const getRankIcon = (rank) => {
    if (rank === 1) return <Trophy className="text-yellow-400" size={24} />
    if (rank === 2) return <Medal className="text-gray-300" size={24} />
    if (rank === 3) return <Award className="text-orange-400" size={24} />
    return <span className="text-white/60 font-bold text-lg">#{rank}</span>
  }

  const getRankColor = (rank) => {
    if (rank === 1) return 'from-yellow-500/20 to-yellow-600/10 border-yellow-500/40'
    if (rank === 2) return 'from-gray-400/20 to-gray-500/10 border-gray-400/40'
    if (rank === 3) return 'from-orange-500/20 to-orange-600/10 border-orange-500/40'
    return 'from-white/10 to-white/5 border-white/20'
  }

  return (
    <div className="min-h-screen bg-bg-dark py-8 px-4 relative overflow-hidden" style={{ backgroundColor: '#0a0b10' }}>
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary-neon/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary-cyan/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container mx-auto max-w-4xl relative z-10">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-all mb-6"
          >
            <ArrowLeft size={18} />
            <span className="font-medium">Ana Sayfa</span>
          </Link>

          <div className="flex items-center gap-4 mb-6">
            <div className="p-5 rounded-3xl bg-gradient-to-br from-primary-neon/30 to-secondary-cyan/30 border-2 border-primary-neon/40">
              <Trophy className="text-white" size={48} style={{
                filter: 'drop-shadow(0 0 10px rgba(255, 46, 99, 0.8))'
              }} />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-widest text-white mb-2">
                LİDERLİK TABLOSU
              </h1>
              <p className="text-white/60">En yüksek puanları toplayan oyuncular</p>
            </div>
          </div>
        </div>

        {/* Current User Rank */}
        {currentUser && userRank > 0 && (
          <div className="glass-strong rounded-2xl p-6 mb-8 border-2 border-primary-neon/40 bg-gradient-to-br from-primary-neon/10 to-primary-neon/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm mb-2">Sıralamanız</p>
                <div className="flex items-center gap-3">
                  {getRankIcon(userRank)}
                  <div>
                    <h2 className="text-2xl font-bold text-white">{currentUser.username}</h2>
                    <p className="text-white/60 text-sm">
                      {users.find(u => u.id === currentUser.id)?.totalPoints || 0} puan
                    </p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-primary-neon">#{userRank}</div>
                <p className="text-white/60 text-sm">Sıralama</p>
              </div>
            </div>
          </div>
        )}

        {/* Login Prompt */}
        {!currentUser && (
          <div className="glass-strong rounded-2xl p-8 mb-8 text-center border-2 border-secondary-cyan/40">
            <p className="text-white/60 mb-4">Liderlik tablosunu görmek için giriş yapın</p>
            <div className="flex gap-4 justify-center">
              <Link
                to="/login"
                className="px-6 py-3 bg-secondary-cyan text-white font-bold rounded-lg hover:bg-secondary-cyan/90 transition-colors"
              >
                Giriş Yap
              </Link>
              <Link
                to="/register"
                className="px-6 py-3 bg-primary-neon text-white font-bold rounded-lg hover:bg-primary-neon/90 transition-colors"
              >
                Kayıt Ol
              </Link>
            </div>
          </div>
        )}

        {/* Leaderboard List */}
        <div className="space-y-4">
          {users.length === 0 ? (
            <div className="glass-strong rounded-2xl p-12 text-center">
              <Trophy className="text-white/40 mx-auto mb-4" size={64} />
              <p className="text-white/60 text-lg">Henüz sıralama yok</p>
              <p className="text-white/40 text-sm mt-2">İlk tahminleri yapın ve liderlik tablosuna girin!</p>
            </div>
          ) : (
            users.slice(0, 50).map((user, index) => (
              <div
                key={user.id}
                className={`glass-strong rounded-2xl p-6 border-2 transition-all ${
                  user.id === currentUser?.id
                    ? 'border-primary-neon/60 bg-gradient-to-br from-primary-neon/15 to-primary-neon/5 scale-105'
                    : `border-white/20 bg-gradient-to-br ${getRankColor(user.rank)}`
                }`}
                style={{
                  boxShadow: user.id === currentUser?.id
                    ? '0 0 30px rgba(255, 46, 99, 0.3)'
                    : user.rank <= 3
                    ? '0 0 20px rgba(255, 255, 255, 0.1)'
                    : 'none'
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-white/10 border-2 border-white/20 flex items-center justify-center flex-shrink-0">
                      {getRankIcon(user.rank)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">
                        {user.username}
                        {user.id === currentUser?.id && (
                          <span className="ml-2 text-primary-neon text-sm">(Siz)</span>
                        )}
                      </h3>
                      <p className="text-white/60 text-sm">
                        {new Date(user.createdAt).toLocaleDateString('tr-TR')} tarihinde katıldı
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-secondary-cyan mb-1">
                      {user.totalPoints}
                    </div>
                    <p className="text-white/60 text-sm">puan</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Auto-refresh notice */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full border border-white/10">
            <div className="w-2 h-2 bg-secondary-cyan rounded-full animate-pulse" />
            <span className="text-white/60 text-xs">Otomatik güncelleniyor</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Leaderboard



