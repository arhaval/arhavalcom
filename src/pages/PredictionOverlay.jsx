import { useState, useEffect } from 'react'
import { Target, CheckCircle, TrendingUp, Trophy, Users } from 'lucide-react'
import { MatchWinnerTemplate, FirstKillTemplate, RoundCountTemplate, CustomTemplate } from '../components/PredictionTemplates.jsx'

function PredictionOverlay() {
  const [prediction, setPrediction] = useState(null)
  const [systemStatus, setSystemStatus] = useState({ isOpen: false, activePredictionId: null })
  const [hasVoted, setHasVoted] = useState(false)
  const [userVote, setUserVote] = useState(null)
  const [matchInfo, setMatchInfo] = useState('')
  const [matchData, setMatchData] = useState(null)

  useEffect(() => {
    loadSystemData()

    // Auto-refresh every 2 seconds for overlay
    const interval = setInterval(() => {
      loadSystemData()
    }, 2000)

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
    const voteKey = `prediction_vote_${predictionId}`
    const vote = localStorage.getItem(voteKey)
    if (vote) {
      setHasVoted(true)
      setUserVote(parseInt(vote))
    } else {
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

  if (!systemStatus.isOpen || !prediction) {
    return null // Don't show anything if system is closed or no active prediction
  }

  const totalVotes = Object.values(prediction.votes || {}).length
  const canVote = !hasVoted

  return (
    <div className="fixed bottom-6 right-6 max-w-sm w-full z-50" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
      {/* Match Info - Professional Compact Card */}
      {matchData && (matchData.team1.name || matchData.team2.name) && (
        <div className="glass-strong rounded-xl p-4 mb-3 border-2 border-secondary-cyan/30 bg-gradient-to-br from-secondary-cyan/10 to-transparent relative overflow-hidden"
        style={{
          boxShadow: '0 0 25px rgba(8, 217, 214, 0.4)'
        }}>
          {/* Status Badge */}
          {matchData.status === 'live' && (
            <div className="absolute top-2 right-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            </div>
          )}
          
          <div className="flex items-center justify-between gap-3">
            {/* Team 1 */}
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {matchData.team1.logo ? (
                  <img 
                    src={matchData.team1.logo} 
                    alt={matchData.team1.name}
                    className="w-full h-full object-contain p-1"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'flex'
                    }}
                  />
                ) : null}
                <div className={`w-full h-full flex items-center justify-center text-sm font-bold text-white ${matchData.team1.logo ? 'hidden' : 'flex'}`}>
                  {matchData.team1.name.charAt(0).toUpperCase()}
                </div>
              </div>
              <span className="text-white font-bold text-xs truncate">{matchData.team1.name || 'Takım 1'}</span>
              {(matchData.status === 'live' || matchData.status === 'finished') && 
               matchData.score.team1 !== null && (
                <span className="text-secondary-cyan font-bold text-sm">{matchData.score.team1}</span>
              )}
            </div>

            {/* VS */}
            <span className="text-white/40 font-bold text-sm">VS</span>

            {/* Team 2 */}
            <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
              {(matchData.status === 'live' || matchData.status === 'finished') && 
               matchData.score.team2 !== null && (
                <span className="text-secondary-cyan font-bold text-sm">{matchData.score.team2}</span>
              )}
              <span className="text-white font-bold text-xs truncate text-right">{matchData.team2.name || 'Takım 2'}</span>
              <div className="w-10 h-10 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {matchData.team2.logo ? (
                  <img 
                    src={matchData.team2.logo} 
                    alt={matchData.team2.name}
                    className="w-full h-full object-contain p-1"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'flex'
                    }}
                  />
                ) : null}
                <div className={`w-full h-full flex items-center justify-center text-sm font-bold text-white ${matchData.team2.logo ? 'hidden' : 'flex'}`}>
                  {matchData.team2.name.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="glass-strong rounded-2xl p-5 shadow-2xl border-2 border-primary-neon/40 relative overflow-hidden" style={{
        background: 'linear-gradient(135deg, rgba(10, 11, 16, 0.98) 0%, rgba(10, 11, 16, 0.95) 100%)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 0 40px rgba(255, 46, 99, 0.4), inset 0 0 30px rgba(255, 46, 99, 0.1)'
      }}>
        {/* Animated Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-neon/5 via-transparent to-secondary-cyan/5 animate-pulse" />
        
        {/* Question */}
        <div className="mb-4 relative z-10">
          <div className="flex items-start gap-3 mb-3">
            <div className={`p-2 rounded-lg ${
              prediction.template === 'match_winner' 
                ? 'bg-primary-neon/20 border border-primary-neon/30'
                : prediction.template === 'first_kill'
                ? 'bg-secondary-cyan/20 border border-secondary-cyan/30'
                : 'bg-primary-neon/20 border border-primary-neon/30'
            }`}>
              {prediction.template === 'match_winner' && (
                <Trophy className="text-primary-neon" size={18} />
              )}
              {prediction.template === 'first_kill' && (
                <Target className="text-secondary-cyan" size={18} />
              )}
              {(!prediction.template || prediction.template === 'custom') && (
                <Target className="text-primary-neon" size={18} />
              )}
            </div>
            <h2 className="text-lg font-bold text-white leading-tight flex-1">
              {prediction.question}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
              <span className="text-white text-xs font-bold">
                <span className="text-secondary-cyan">{totalVotes}</span> oy
              </span>
            </div>
            {canVote && (
              <div className="px-3 py-1 rounded-full bg-primary-neon/20 border border-primary-neon/50">
                <span className="text-primary-neon text-xs font-bold">OY VER</span>
              </div>
            )}
          </div>
        </div>

        {/* Options - Enhanced Compact Version */}
        <div className="space-y-2.5 relative z-10">
          {prediction.options.map((option, index) => {
            const votes = Object.values(prediction.votes || {}).filter(v => v === index).length
            const percentage = totalVotes > 0 ? (votes / totalVotes * 100).toFixed(0) : 0
            const isSelected = hasVoted && userVote === index

            return (
              <button
                key={index}
                onClick={() => canVote && handleVote(index)}
                disabled={!canVote}
                className={`w-full glass rounded-xl p-3 text-left transition-all duration-300 relative overflow-hidden group ${
                  canVote
                    ? 'hover:scale-[1.03] cursor-pointer hover:border-primary-neon/60'
                    : 'cursor-default'
                } ${
                  isSelected
                    ? 'border-2 border-primary-neon bg-primary-neon/15 shadow-lg shadow-primary-neon/30'
                    : 'border border-white/15 bg-white/5'
                }`}
                style={{
                  background: isSelected 
                    ? 'linear-gradient(135deg, rgba(255, 46, 99, 0.15) 0%, rgba(255, 46, 99, 0.05) 100%)'
                    : 'rgba(255, 255, 255, 0.05)'
                }}
              >
                {/* Hover Glow */}
                {canVote && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-neon/0 via-primary-neon/5 to-primary-neon/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
                
                <div className="flex items-center justify-between mb-2 relative z-10">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-primary-neon text-white shadow-lg shadow-primary-neon/50'
                        : 'bg-white/10 text-white group-hover:bg-primary-neon/20'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="text-white font-bold text-sm">{option}</span>
                    {isSelected && (
                      <CheckCircle className="text-primary-neon" size={16} style={{
                        filter: 'drop-shadow(0 0 6px rgba(255, 46, 99, 0.8))'
                      }} />
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold text-sm">{votes}</div>
                    <div className="text-white/60 text-xs">{percentage}%</div>
                  </div>
                </div>
                <div className="relative w-full bg-white/10 rounded-full h-2.5 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  <div 
                    className={`h-2.5 rounded-full transition-all duration-500 ${
                      isSelected ? 'bg-primary-neon' : 'bg-secondary-cyan'
                    }`}
                    style={{ 
                      width: `${percentage}%`,
                      boxShadow: isSelected 
                        ? '0 0 12px rgba(255, 46, 99, 0.7)' 
                        : '0 0 8px rgba(8, 217, 214, 0.5)'
                    }}
                  />
                </div>
              </button>
            )
          })}
        </div>

        {/* Vote Status - Enhanced */}
        {hasVoted && (
          <div className="mt-4 text-center relative z-10">
            <div className="px-4 py-2 rounded-xl bg-primary-neon/10 border border-primary-neon/30">
              <p className="text-primary-neon text-xs font-bold flex items-center justify-center gap-2">
                <CheckCircle size={14} style={{
                  filter: 'drop-shadow(0 0 4px rgba(255, 46, 99, 0.8))'
                }} />
                Oyunuz kaydedildi!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PredictionOverlay

