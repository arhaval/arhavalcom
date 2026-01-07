import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Target, CheckCircle, ArrowLeft, Zap, TrendingUp, Trophy, Users, LogIn } from 'lucide-react'
import { MatchWinnerTemplate, FirstKillTemplate, RoundCountTemplate, CustomTemplate } from '../components/PredictionTemplates.jsx'

function PredictionPage() {
  const [prediction, setPrediction] = useState(null)
  const [systemStatus, setSystemStatus] = useState({ isOpen: false, activePredictionId: null })
  const [hasVoted, setHasVoted] = useState(false)
  const [userVote, setUserVote] = useState(null)
  const [matchInfo, setMatchInfo] = useState('')
  const [matchData, setMatchData] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    // Load current user
    const userData = localStorage.getItem('arhaval_current_user')
    if (userData) {
      try {
        setCurrentUser(JSON.parse(userData))
      } catch (e) {
        console.error('Error loading user:', e)
      }
    }

    loadSystemData()

    // Auto-refresh every 3 seconds
    const interval = setInterval(() => {
      loadSystemData()
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const loadSystemData = () => {
    // Load system status
    const statusSaved = localStorage.getItem('arhaval_system_status')
    if (statusSaved) {
      try {
        const status = JSON.parse(statusSaved)
        setSystemStatus(status)

        // Load active prediction
        if (status.isOpen && status.activePredictionId) {
          const predictionsSaved = localStorage.getItem('arhaval_predictions')
          if (predictionsSaved) {
            try {
              const predictions = JSON.parse(predictionsSaved)
              const found = predictions.find(p => p.id === status.activePredictionId)
              if (found) {
                setPrediction(found)
                checkUserVote(found.id)
              } else {
                setPrediction(null)
              }
            } catch (e) {
              console.error('Error loading predictions:', e)
            }
          }
        } else {
          setPrediction(null)
        }
      } catch (e) {
        console.error('Error loading system status:', e)
      }
    }

    // Load match info
    const streamDataSaved = localStorage.getItem('arhaval_stream_data')
    if (streamDataSaved) {
      try {
        const streamData = JSON.parse(streamDataSaved)
        setMatchInfo(streamData.matchInfo || '')
        // Load new match data structure
        if (streamData.match && (streamData.match.team1.name || streamData.match.team2.name)) {
          setMatchData(streamData.match)
        }
      } catch (e) {
        console.error('Error loading stream data:', e)
      }
    }
  }

  const checkUserVote = (predictionId) => {
    if (!currentUser) {
      setHasVoted(false)
      setUserVote(null)
      return
    }

    const voteKey = `prediction_vote_${predictionId}_${currentUser.id}`
    const vote = localStorage.getItem(voteKey)
    if (vote) {
      setHasVoted(true)
      setUserVote(parseInt(vote))
    } else {
      // Also check if user voted in prediction votes object
      const saved = localStorage.getItem('arhaval_predictions')
      if (saved) {
        try {
          const predictions = JSON.parse(saved)
          const pred = predictions.find(p => p.id === predictionId)
          if (pred && pred.votes && pred.votes[currentUser.id] !== undefined) {
            setHasVoted(true)
            setUserVote(pred.votes[currentUser.id])
            return
          }
        } catch (e) {
          console.error('Error checking vote:', e)
        }
      }
      setHasVoted(false)
      setUserVote(null)
    }
  }

  const handleVote = (optionIndex) => {
    if (hasVoted || !prediction) return

    const voteKey = `prediction_vote_${prediction.id}`
    localStorage.setItem(voteKey, optionIndex.toString())

    // Update prediction votes
    const saved = localStorage.getItem('arhaval_predictions')
    if (saved) {
      try {
        const predictions = JSON.parse(saved)
        const updated = predictions.map(p => {
          if (p.id === prediction.id) {
            const userId = `user_${Date.now()}_${Math.random()}`
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
        setHasVoted(true)
        setUserVote(optionIndex)
        setPrediction(updated.find(p => p.id === prediction.id))
      } catch (e) {
        console.error('Error saving vote:', e)
      }
    }
  }

  // Demo mode for design preview (when system is closed)
  const isDemoMode = !systemStatus.isOpen || !prediction
  const demoPrediction = {
    question: 'Bu maçı hangi takım kazanacak?',
    options: ['Team A', 'Team B', 'Beraberlik'],
    template: 'match_winner',
    votes: {
      'user1': 0,
      'user2': 0,
      'user3': 1,
      'user4': 1,
      'user5': 2,
      'user6': 0,
      'user7': 1
    }
  }
  
  // Demo match data
  const demoMatchData = {
    team1: { name: 'Eternal Fire', logo: '' },
    team2: { name: 'Sangal Esports', logo: '' },
    score: { team1: null, team2: null },
    status: 'live'
  }
  
  const displayMatchData = matchData || (isDemoMode ? demoMatchData : null)

  const displayPrediction = prediction || (isDemoMode ? demoPrediction : null)

  if (!displayPrediction) {
    return (
      <div className="min-h-screen bg-bg-dark flex items-center justify-center p-4" style={{ backgroundColor: '#0a0b10' }}>
        <div className="glass-strong rounded-2xl p-8 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Aktif Soru Yok</h1>
          <p className="text-white/60 mb-6">Şu anda aktif bir tahmin sorusu bulunmuyor.</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-neon text-white font-bold rounded-lg hover:bg-primary-neon/90 transition-colors"
          >
            <ArrowLeft size={18} />
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    )
  }

  const totalVotes = Object.values(displayPrediction.votes || {}).length

  // In demo mode, disable voting. Also require login.
  const canVote = !isDemoMode && !hasVoted && currentUser !== null

  return (
    <div className="min-h-screen bg-bg-dark py-6 md:py-8 px-4 relative overflow-hidden" style={{ backgroundColor: '#0a0b10' }}>
      {/* Enhanced Background Glow Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary-neon/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary-cyan/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-neon/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto max-w-5xl relative z-10">
        {/* Minimal Header */}
        <div className="mb-6 md:mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-all mb-4 group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Ana Sayfa</span>
          </Link>
        </div>

        {/* Professional Match Card - Redesigned */}
        {displayMatchData && (displayMatchData.team1.name || displayMatchData.team2.name) && (
          <div className="glass-strong rounded-3xl p-6 md:p-10 mb-8 border-2 border-secondary-cyan/40 bg-gradient-to-br from-secondary-cyan/15 via-primary-neon/5 to-secondary-cyan/15 relative overflow-hidden"
          style={{
            boxShadow: '0 0 50px rgba(8, 217, 214, 0.4), inset 0 0 40px rgba(8, 217, 214, 0.15), 0 0 30px rgba(255, 46, 99, 0.2)'
          }}>
            {/* Animated Background */}
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-r from-secondary-cyan/10 via-primary-neon/5 to-secondary-cyan/10" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(8,217,214,0.1),transparent_70%)]" />
            </div>
            
            <div className="relative z-10">
              {/* Match Status Badge - Top */}
              <div className="flex justify-center mb-6">
                {displayMatchData.status === 'live' && (
                  <div className="px-5 py-2.5 rounded-full bg-red-500/30 border-2 border-red-500/60 backdrop-blur-sm"
                  style={{
                    boxShadow: '0 0 20px rgba(239, 68, 68, 0.5)'
                  }}>
                    <span className="text-red-300 font-bold text-sm flex items-center gap-2">
                      <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
                      <span className="tracking-wider">CANLI MAÇ</span>
                    </span>
                  </div>
                )}
                {displayMatchData.status === 'upcoming' && (
                  <div className="px-5 py-2.5 rounded-full bg-white/15 border-2 border-white/30 backdrop-blur-sm">
                    <span className="text-white font-bold text-sm tracking-wider">YAKINDA</span>
                  </div>
                )}
                {displayMatchData.status === 'finished' && (
                  <div className="px-5 py-2.5 rounded-full bg-white/15 border-2 border-white/30 backdrop-blur-sm">
                    <span className="text-white/90 font-bold text-sm tracking-wider">MAÇ BİTTİ</span>
                  </div>
                )}
              </div>

              {/* Teams - Enhanced Layout */}
              <div className="grid grid-cols-3 gap-6 md:gap-12 items-center">
                {/* Team 1 */}
                <div className="flex flex-col items-center group">
                  <div className="relative mb-4">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-gradient-to-br from-white/15 to-white/5 border-2 border-white/30 flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:scale-110 group-hover:border-secondary-cyan/50"
                    style={{
                      boxShadow: '0 0 30px rgba(255, 255, 255, 0.15), inset 0 0 20px rgba(255, 255, 255, 0.05)'
                    }}>
                      {displayMatchData.team1.logo ? (
                        <img 
                          src={displayMatchData.team1.logo} 
                          alt={displayMatchData.team1.name}
                          className="w-full h-full object-contain p-3"
                          onError={(e) => {
                            e.target.style.display = 'none'
                            e.target.nextSibling.style.display = 'flex'
                          }}
                        />
                      ) : null}
                      <div className={`w-full h-full flex items-center justify-center text-3xl md:text-4xl font-bold text-white ${displayMatchData.team1.logo ? 'hidden' : 'flex'}`}>
                        {displayMatchData.team1.name.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    {/* Glow effect */}
                    <div className="absolute inset-0 rounded-3xl bg-secondary-cyan/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
                  </div>
                  <h3 className="text-white font-bold text-xl md:text-2xl text-center mb-2">
                    {displayMatchData.team1.name || 'Takım 1'}
                  </h3>
                  {(displayMatchData.status === 'live' || displayMatchData.status === 'finished') && 
                   displayMatchData.score.team1 !== null && (
                    <div className="px-5 py-2 rounded-full bg-secondary-cyan/25 border-2 border-secondary-cyan/40"
                    style={{
                      boxShadow: '0 0 15px rgba(8, 217, 214, 0.4)'
                    }}>
                      <span className="text-secondary-cyan font-bold text-2xl">
                        {displayMatchData.score.team1}
                      </span>
                    </div>
                  )}
                </div>

                {/* VS / Score - Enhanced */}
                <div className="flex flex-col items-center">
                  <div className="text-white/30 font-bold text-3xl md:text-4xl mb-3 tracking-widest">VS</div>
                  {(displayMatchData.status === 'live' || displayMatchData.status === 'finished') && 
                   displayMatchData.score.team1 !== null && displayMatchData.score.team2 !== null && (
                    <div className="px-8 py-4 rounded-3xl bg-gradient-to-br from-primary-neon/30 to-secondary-cyan/30 border-2 border-primary-neon/40 backdrop-blur-sm"
                    style={{
                      boxShadow: '0 0 30px rgba(255, 46, 99, 0.5), 0 0 20px rgba(8, 217, 214, 0.4)'
                    }}>
                      <div className="text-white font-bold text-4xl md:text-5xl text-center tracking-wider">
                        {displayMatchData.score.team1} - {displayMatchData.score.team2}
                      </div>
                    </div>
                  )}
                </div>

                {/* Team 2 */}
                <div className="flex flex-col items-center group">
                  <div className="relative mb-4">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-gradient-to-br from-white/15 to-white/5 border-2 border-white/30 flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:scale-110 group-hover:border-secondary-cyan/50"
                    style={{
                      boxShadow: '0 0 30px rgba(255, 255, 255, 0.15), inset 0 0 20px rgba(255, 255, 255, 0.05)'
                    }}>
                      {displayMatchData.team2.logo ? (
                        <img 
                          src={displayMatchData.team2.logo} 
                          alt={displayMatchData.team2.name}
                          className="w-full h-full object-contain p-3"
                          onError={(e) => {
                            e.target.style.display = 'none'
                            e.target.nextSibling.style.display = 'flex'
                          }}
                        />
                      ) : null}
                      <div className={`w-full h-full flex items-center justify-center text-3xl md:text-4xl font-bold text-white ${displayMatchData.team2.logo ? 'hidden' : 'flex'}`}>
                        {displayMatchData.team2.name.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    {/* Glow effect */}
                    <div className="absolute inset-0 rounded-3xl bg-secondary-cyan/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
                  </div>
                  <h3 className="text-white font-bold text-xl md:text-2xl text-center mb-2">
                    {displayMatchData.team2.name || 'Takım 2'}
                  </h3>
                  {(displayMatchData.status === 'live' || displayMatchData.status === 'finished') && 
                   displayMatchData.score.team2 !== null && (
                    <div className="px-5 py-2 rounded-full bg-secondary-cyan/25 border-2 border-secondary-cyan/40"
                    style={{
                      boxShadow: '0 0 15px rgba(8, 217, 214, 0.4)'
                    }}>
                      <span className="text-secondary-cyan font-bold text-2xl">
                        {displayMatchData.score.team2}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Demo Mode Notice */}
        {isDemoMode && (
          <div className="glass rounded-xl p-3 mb-6 border border-yellow-500/30 bg-yellow-500/5 relative overflow-hidden">
            <p className="text-yellow-400 text-center text-xs font-bold relative z-10">
              🎨 DEMO MODU - Tasarım Önizlemesi
            </p>
          </div>
        )}

        {/* Question Card - Premium Design */}
        <div className={`glass-strong rounded-3xl p-8 md:p-12 mb-8 relative overflow-hidden group border-2 ${
          displayPrediction.template === 'match_winner' ? 'border-primary-neon/40 bg-gradient-to-br from-primary-neon/10 via-primary-neon/5 to-transparent' :
          displayPrediction.template === 'first_kill' ? 'border-secondary-cyan/40 bg-gradient-to-br from-secondary-cyan/10 via-secondary-cyan/5 to-transparent' :
          displayPrediction.template === 'round_count' ? 'border-primary-neon/40 bg-gradient-to-br from-primary-neon/10 via-secondary-cyan/5 to-primary-neon/10' :
          'border-white/30 bg-gradient-to-br from-white/10 via-white/5 to-transparent'
        }`}
        style={{
          boxShadow: displayPrediction.template === 'match_winner' 
            ? '0 0 50px rgba(255, 46, 99, 0.3), inset 0 0 50px rgba(255, 46, 99, 0.08)'
            : displayPrediction.template === 'first_kill'
            ? '0 0 50px rgba(8, 217, 214, 0.3), inset 0 0 50px rgba(8, 217, 214, 0.08)'
            : '0 0 40px rgba(255, 255, 255, 0.15)'
        }}>
          {/* Animated Background */}
          <div className="absolute inset-0">
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ${
              displayPrediction.template === 'match_winner' 
                ? 'bg-gradient-to-r from-primary-neon/0 via-primary-neon/12 to-primary-neon/0'
                : displayPrediction.template === 'first_kill'
                ? 'bg-gradient-to-r from-secondary-cyan/0 via-secondary-cyan/12 to-secondary-cyan/0'
                : 'bg-gradient-to-r from-primary-neon/0 via-secondary-cyan/12 to-primary-neon/0'
            }`} />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,46,99,0.1),transparent_60%)]" />
          </div>
          
          <div className="relative z-10">
            {/* Question Header */}
            <div className="flex items-start gap-5 mb-6">
              {/* Icon - Larger */}
              <div className={`p-5 rounded-3xl flex-shrink-0 ${
                displayPrediction.template === 'match_winner' 
                  ? 'bg-primary-neon/25 border-2 border-primary-neon/40'
                  : displayPrediction.template === 'first_kill'
                  ? 'bg-secondary-cyan/25 border-2 border-secondary-cyan/40'
                  : 'bg-primary-neon/25 border-2 border-primary-neon/40'
              }`}
              style={{
                boxShadow: displayPrediction.template === 'match_winner'
                  ? '0 0 30px rgba(255, 46, 99, 0.4)'
                  : displayPrediction.template === 'first_kill'
                  ? '0 0 30px rgba(8, 217, 214, 0.4)'
                  : '0 0 20px rgba(255, 46, 99, 0.3)'
              }}>
                {displayPrediction.template === 'match_winner' && (
                  <Trophy className="text-primary-neon" size={40} />
                )}
                {displayPrediction.template === 'first_kill' && (
                  <Target className="text-secondary-cyan" size={40} />
                )}
                {displayPrediction.template === 'round_count' && (
                  <TrendingUp className="text-primary-neon" size={40} />
                )}
                {(!displayPrediction.template || displayPrediction.template === 'custom') && (
                  <Target className="text-primary-neon" size={40} />
                )}
              </div>
              
              {/* Question Text */}
              <div className="flex-1 min-w-0">
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-5">
                  {displayPrediction.question}
                </h2>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/8 border border-white/15">
                    <TrendingUp size={16} className="text-secondary-cyan" />
                    <span className="text-white font-bold text-sm">
                      <span className="text-secondary-cyan text-lg">{totalVotes}</span> oy
                    </span>
                  </div>
                  {!isDemoMode && canVote && (
                    <div className={`px-4 py-2 rounded-full font-bold text-xs border-2 ${
                      displayPrediction.template === 'first_kill' 
                        ? 'bg-secondary-cyan/25 text-secondary-cyan border-secondary-cyan/60'
                        : 'bg-primary-neon/25 text-primary-neon border-primary-neon/60'
                    }`}
                    style={{
                      boxShadow: displayPrediction.template === 'first_kill'
                        ? '0 0 20px rgba(8, 217, 214, 0.5)'
                        : '0 0 20px rgba(255, 46, 99, 0.5)'
                    }}>
                      ✨ OY VER
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Options - Enhanced Template Based Rendering */}
        <div className="space-y-4 mb-8">
          {displayPrediction.options.map((option, index) => {
            const templateProps = {
              prediction: displayPrediction,
              totalVotes,
              isSelected: !isDemoMode && hasVoted,
              userVote: !isDemoMode ? userVote : null,
              canVote,
              onVote: handleVote,
              index
            }

            // Render based on template
            const template = displayPrediction.template || 'custom'
            switch (template) {
              case 'match_winner':
                return <MatchWinnerTemplate key={index} {...templateProps} />
              case 'first_kill':
                return <FirstKillTemplate key={index} {...templateProps} />
              case 'round_count':
                return <RoundCountTemplate key={index} {...templateProps} />
              default:
                return <CustomTemplate key={index} {...templateProps} />
            }
          })}
        </div>

        {/* Enhanced Vote Status */}
        {!isDemoMode && hasVoted && (
          <div className="glass-strong rounded-2xl p-6 md:p-8 text-center border-2 border-primary-neon/50 bg-gradient-to-br from-primary-neon/15 to-primary-neon/5 relative overflow-hidden mb-6"
          style={{
            boxShadow: '0 0 50px rgba(255, 46, 99, 0.4), inset 0 0 40px rgba(255, 46, 99, 0.15)'
          }}>
            <div className="absolute inset-0 bg-gradient-to-r from-primary-neon/0 via-primary-neon/20 to-primary-neon/0 animate-pulse" />
            <div className="relative z-10">
              <div className="inline-flex p-5 rounded-full bg-primary-neon/25 border-2 border-primary-neon/50 mb-4"
              style={{
                boxShadow: '0 0 40px rgba(255, 46, 99, 0.6)'
              }}>
                <CheckCircle className="text-primary-neon" size={36} style={{
                  filter: 'drop-shadow(0 0 20px rgba(255, 46, 99, 1))'
                }} />
              </div>
              <p className="text-white font-bold text-xl md:text-2xl mb-2">
                🎉 Oyunuz Kaydedildi!
              </p>
              <p className="text-white/80 text-sm md:text-base">
                Sonuçları canlı olarak takip edebilirsiniz
              </p>
              <div className="mt-4 flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-secondary-cyan rounded-full animate-pulse" />
                <span className="text-white/60 text-xs">Canlı güncelleniyor...</span>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Auto-refresh notice */}
        <div className="text-center mt-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full border border-white/10">
            <div className="relative">
              <div className="w-2 h-2 bg-secondary-cyan rounded-full animate-pulse" />
              <div className="absolute inset-0 w-2 h-2 bg-secondary-cyan rounded-full animate-ping opacity-75" />
            </div>
            <span className="text-white/50 text-xs font-medium">Sonuçlar otomatik güncellenir</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PredictionPage

