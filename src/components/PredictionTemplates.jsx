import { Trophy, Target, BarChart3, Sparkles, CheckCircle, TrendingUp, Zap } from 'lucide-react'

// Match Winner Template
export const MatchWinnerTemplate = ({ prediction, totalVotes, isSelected, userVote, canVote, onVote, index }) => {
  const votes = Object.values(prediction.votes || {}).filter(v => v === index).length
  const percentage = totalVotes > 0 ? (votes / totalVotes * 100).toFixed(1) : 0
  const isSelectedOption = isSelected && userVote === index

  return (
    <button
      onClick={() => canVote && onVote(index)}
      disabled={!canVote}
      className={`w-full glass-strong rounded-3xl p-7 md:p-8 text-left transition-all duration-300 relative overflow-hidden group border-2 ${
        canVote
          ? 'hover:scale-[1.03] cursor-pointer hover:border-primary-neon/60 hover:shadow-2xl hover:shadow-primary-neon/30 active:scale-[0.98]'
          : 'cursor-default'
      } ${
        isSelectedOption
          ? 'border-primary-neon bg-gradient-to-br from-primary-neon/15 to-primary-neon/5 shadow-2xl shadow-primary-neon/40'
          : 'border-white/15 bg-white/5 hover:bg-white/8'
      }`}
      style={{
        boxShadow: isSelectedOption 
          ? '0 0 40px rgba(255, 46, 99, 0.4), inset 0 0 30px rgba(255, 46, 99, 0.1)'
          : '0 0 20px rgba(255, 255, 255, 0.05)'
      }}
    >
      {/* Animated Background */}
      {isSelectedOption && (
        <div className="absolute inset-0 bg-gradient-to-r from-primary-neon/15 via-primary-neon/8 to-primary-neon/15 animate-pulse" />
      )}
      {canVote && !isSelectedOption && (
        <div className="absolute inset-0 bg-gradient-to-r from-primary-neon/0 via-primary-neon/5 to-primary-neon/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      )}

      <div className="relative z-10">
        <div className="flex items-center gap-5 md:gap-6 mb-5">
          <div className={`w-20 h-20 md:w-24 md:h-24 rounded-3xl flex items-center justify-center transition-all ${
            isSelectedOption
              ? 'bg-primary-neon text-white shadow-2xl shadow-primary-neon/60 scale-110'
              : canVote
              ? 'bg-gradient-to-br from-primary-neon/25 to-primary-neon/15 text-white group-hover:from-primary-neon/35 group-hover:to-primary-neon/25 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary-neon/30'
              : 'bg-white/10 text-white'
          }`}
          style={{
            boxShadow: isSelectedOption 
              ? '0 0 30px rgba(255, 46, 99, 0.6)'
              : canVote
              ? '0 0 15px rgba(255, 46, 99, 0.2)'
              : 'none'
          }}>
            <Trophy size={36} />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-white font-bold text-xl md:text-2xl block mb-2">{prediction.options[index]}</span>
            {isSelectedOption && (
              <span className="text-primary-neon text-sm font-bold flex items-center gap-2 px-3 py-1 rounded-full bg-primary-neon/20 border border-primary-neon/30 inline-flex">
                <CheckCircle size={14} />
                Seçiminiz
              </span>
            )}
          </div>
          <div className="text-right">
            <div className="text-white font-bold text-3xl md:text-4xl mb-1">{votes}</div>
            <div className="text-white/70 text-base font-medium">{percentage}%</div>
          </div>
        </div>
        
        <div className="relative w-full bg-white/10 rounded-full h-5 overflow-hidden border border-white/20">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent animate-shimmer" />
          <div 
            className={`h-5 rounded-full transition-all duration-700 relative ${
              isSelectedOption 
                ? 'bg-gradient-to-r from-primary-neon via-primary-neon to-primary-neon/90' 
                : 'bg-gradient-to-r from-primary-neon/70 via-primary-neon/60 to-primary-neon/50'
            }`}
            style={{ 
              width: `${percentage}%`,
              boxShadow: isSelectedOption 
                ? '0 0 25px rgba(255, 46, 99, 0.8), inset 0 0 10px rgba(255, 255, 255, 0.2)' 
                : '0 0 15px rgba(255, 46, 99, 0.4)'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </div>
        </div>
      </div>
    </button>
  )
}

// First Kill Template
export const FirstKillTemplate = ({ prediction, totalVotes, isSelected, userVote, canVote, onVote, index }) => {
  const votes = Object.values(prediction.votes || {}).filter(v => v === index).length
  const percentage = totalVotes > 0 ? (votes / totalVotes * 100).toFixed(1) : 0
  const isSelectedOption = isSelected && userVote === index

  return (
    <button
      onClick={() => canVote && onVote(index)}
      disabled={!canVote}
      className={`w-full glass-strong rounded-3xl p-7 md:p-8 text-left transition-all duration-300 relative overflow-hidden group border-2 ${
        canVote
          ? 'hover:scale-[1.03] cursor-pointer hover:border-secondary-cyan/60 hover:shadow-2xl hover:shadow-secondary-cyan/30 active:scale-[0.98]'
          : 'cursor-default'
      } ${
        isSelectedOption
          ? 'border-secondary-cyan bg-gradient-to-br from-secondary-cyan/15 to-secondary-cyan/5 shadow-2xl shadow-secondary-cyan/40'
          : 'border-white/15 bg-white/5 hover:bg-white/8'
      }`}
      style={{
        boxShadow: isSelectedOption 
          ? '0 0 40px rgba(8, 217, 214, 0.4), inset 0 0 30px rgba(8, 217, 214, 0.1)'
          : '0 0 20px rgba(255, 255, 255, 0.05)'
      }}
    >
      {/* Animated Background */}
      {isSelectedOption && (
        <div className="absolute inset-0 bg-gradient-to-r from-secondary-cyan/15 via-secondary-cyan/8 to-secondary-cyan/15 animate-pulse" />
      )}
      {canVote && !isSelectedOption && (
        <div className="absolute inset-0 bg-gradient-to-r from-secondary-cyan/0 via-secondary-cyan/5 to-secondary-cyan/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      )}

      <div className="relative z-10">
        <div className="flex items-center gap-5 md:gap-6 mb-5">
          <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center transition-all ${
            isSelectedOption
              ? 'bg-secondary-cyan text-white shadow-2xl shadow-secondary-cyan/60 scale-110'
              : canVote
              ? 'bg-gradient-to-br from-secondary-cyan/25 to-secondary-cyan/15 text-white group-hover:from-secondary-cyan/35 group-hover:to-secondary-cyan/25 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-secondary-cyan/30'
              : 'bg-white/10 text-white'
          }`}
          style={{
            boxShadow: isSelectedOption 
              ? '0 0 30px rgba(8, 217, 214, 0.6)'
              : canVote
              ? '0 0 15px rgba(8, 217, 214, 0.2)'
              : 'none'
          }}>
            <Target size={36} />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-white font-bold text-xl md:text-2xl block mb-2">{prediction.options[index]}</span>
            {isSelectedOption && (
              <span className="text-secondary-cyan text-sm font-bold flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-cyan/20 border border-secondary-cyan/30 inline-flex">
                <Zap size={14} />
                Seçiminiz
              </span>
            )}
          </div>
          <div className="text-right">
            <div className="text-white font-bold text-3xl md:text-4xl mb-1">{votes}</div>
            <div className="text-white/70 text-base font-medium">{percentage}%</div>
          </div>
        </div>
        
        <div className="relative w-full bg-white/10 rounded-full h-5 overflow-hidden border border-white/20">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent animate-shimmer" />
          <div 
            className={`h-5 rounded-full transition-all duration-700 relative ${
              isSelectedOption 
                ? 'bg-gradient-to-r from-secondary-cyan via-secondary-cyan to-secondary-cyan/90' 
                : 'bg-gradient-to-r from-secondary-cyan/70 via-secondary-cyan/60 to-secondary-cyan/50'
            }`}
            style={{ 
              width: `${percentage}%`,
              boxShadow: isSelectedOption 
                ? '0 0 25px rgba(8, 217, 214, 0.8), inset 0 0 10px rgba(255, 255, 255, 0.2)' 
                : '0 0 15px rgba(8, 217, 214, 0.4)'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </div>
        </div>
      </div>
    </button>
  )
}

// Round Count Template - Enhanced
export const RoundCountTemplate = ({ prediction, totalVotes, isSelected, userVote, canVote, onVote, index }) => {
  const votes = Object.values(prediction.votes || {}).filter(v => v === index).length
  const percentage = totalVotes > 0 ? (votes / totalVotes * 100).toFixed(1) : 0
  const isSelectedOption = isSelected && userVote === index

  return (
    <button
      onClick={() => canVote && onVote(index)}
      disabled={!canVote}
      className={`w-full glass-strong rounded-3xl p-7 md:p-8 text-left transition-all duration-300 relative overflow-hidden group border-2 ${
        canVote
          ? 'hover:scale-[1.03] cursor-pointer hover:border-primary-neon/60 hover:shadow-2xl hover:shadow-primary-neon/30 active:scale-[0.98]'
          : 'cursor-default'
      } ${
        isSelectedOption
          ? 'border-primary-neon bg-gradient-to-br from-primary-neon/15 to-primary-neon/5 shadow-2xl shadow-primary-neon/40'
          : 'border-white/15 bg-white/5 hover:bg-white/8'
      }`}
      style={{
        boxShadow: isSelectedOption 
          ? '0 0 40px rgba(255, 46, 99, 0.4), inset 0 0 30px rgba(255, 46, 99, 0.1)'
          : '0 0 20px rgba(255, 255, 255, 0.05)'
      }}
    >
      {/* Animated Background */}
      {isSelectedOption && (
        <div className="absolute inset-0 bg-gradient-to-r from-primary-neon/15 via-primary-neon/8 to-primary-neon/15 animate-pulse" />
      )}
      {canVote && !isSelectedOption && (
        <div className="absolute inset-0 bg-gradient-to-r from-primary-neon/0 via-secondary-cyan/5 to-primary-neon/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      )}

      <div className="relative z-10">
        <div className="flex items-center gap-5 md:gap-6 mb-5">
          <div className={`w-20 h-20 md:w-24 md:h-24 rounded-3xl flex items-center justify-center transition-all ${
            isSelectedOption
              ? 'bg-gradient-to-br from-primary-neon to-secondary-cyan text-white shadow-2xl shadow-primary-neon/60 scale-110'
              : canVote
              ? 'bg-gradient-to-br from-primary-neon/25 via-secondary-cyan/25 to-primary-neon/25 text-white group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary-neon/30'
              : 'bg-white/10 text-white'
          }`}
          style={{
            boxShadow: isSelectedOption 
              ? '0 0 30px rgba(255, 46, 99, 0.6), 0 0 20px rgba(8, 217, 214, 0.4)'
              : canVote
              ? '0 0 15px rgba(255, 46, 99, 0.2)'
              : 'none'
          }}>
            <BarChart3 size={36} />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-white font-bold text-2xl md:text-3xl block mb-1">{prediction.options[index]}</span>
            <span className="text-white/60 text-sm md:text-base">Round</span>
            {isSelectedOption && (
              <span className="text-primary-neon text-sm font-bold flex items-center gap-2 px-3 py-1 rounded-full bg-primary-neon/20 border border-primary-neon/30 inline-flex mt-2">
                <CheckCircle size={14} />
                Seçiminiz
              </span>
            )}
          </div>
          <div className="text-right">
            <div className="text-white font-bold text-3xl md:text-4xl mb-1">{votes}</div>
            <div className="text-white/70 text-base font-medium">{percentage}%</div>
          </div>
        </div>
        
        <div className="relative w-full bg-white/10 rounded-full h-5 overflow-hidden border border-white/20">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent animate-shimmer" />
          <div 
            className="h-5 rounded-full transition-all duration-700 relative bg-gradient-to-r from-primary-neon/70 via-secondary-cyan/70 to-primary-neon/70"
            style={{ 
              width: `${percentage}%`,
              boxShadow: isSelectedOption 
                ? '0 0 25px rgba(255, 46, 99, 0.8), 0 0 15px rgba(8, 217, 214, 0.6), inset 0 0 10px rgba(255, 255, 255, 0.2)' 
                : '0 0 15px rgba(255, 46, 99, 0.4), 0 0 10px rgba(8, 217, 214, 0.3)'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </div>
        </div>
      </div>
    </button>
  )
}

// Custom Template (Default) - Enhanced
export const CustomTemplate = ({ prediction, totalVotes, isSelected, userVote, canVote, onVote, index }) => {
  const votes = Object.values(prediction.votes || {}).filter(v => v === index).length
  const percentage = totalVotes > 0 ? (votes / totalVotes * 100).toFixed(1) : 0
  const isSelectedOption = isSelected && userVote === index
  const allVoteCounts = prediction.options.map((_, i) => 
    Object.values(prediction.votes || {}).filter(v => v === i).length
  )
  const maxVotes = allVoteCounts.length > 0 ? Math.max(...allVoteCounts) : 0
  const isWinning = totalVotes > 0 && votes === maxVotes && votes > 0

  return (
    <button
      onClick={() => canVote && onVote(index)}
      disabled={!canVote}
      className={`w-full glass-strong rounded-3xl p-7 md:p-8 text-left transition-all duration-300 relative overflow-hidden group border-2 ${
        canVote
          ? 'hover:scale-[1.03] cursor-pointer hover:border-primary-neon/60 hover:shadow-2xl hover:shadow-primary-neon/30 active:scale-[0.98]'
          : 'cursor-default'
      } ${
        isSelectedOption
          ? 'border-primary-neon bg-gradient-to-br from-primary-neon/15 to-primary-neon/5 shadow-2xl shadow-primary-neon/40'
          : isWinning && totalVotes > 0
          ? 'border-secondary-cyan/60 bg-gradient-to-br from-secondary-cyan/10 to-secondary-cyan/5 shadow-xl shadow-secondary-cyan/30'
          : 'border-white/15 bg-white/5 hover:bg-white/8'
      }`}
      style={{
        boxShadow: isSelectedOption 
          ? '0 0 40px rgba(255, 46, 99, 0.4), inset 0 0 30px rgba(255, 46, 99, 0.1)'
          : isWinning && totalVotes > 0
          ? '0 0 30px rgba(8, 217, 214, 0.3)'
          : '0 0 20px rgba(255, 255, 255, 0.05)'
      }}
    >
      {/* Animated Background */}
      {isSelectedOption && (
        <div className="absolute inset-0 bg-gradient-to-r from-primary-neon/15 via-primary-neon/8 to-primary-neon/15 animate-pulse" />
      )}
      {isWinning && !isSelectedOption && totalVotes > 0 && (
        <div className="absolute inset-0 bg-gradient-to-r from-secondary-cyan/10 via-secondary-cyan/15 to-secondary-cyan/10 opacity-60" />
      )}
      {canVote && !isSelectedOption && !isWinning && (
        <div className="absolute inset-0 bg-gradient-to-r from-primary-neon/0 via-primary-neon/5 to-primary-neon/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      )}

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-5 md:gap-6 flex-1 min-w-0">
            <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center font-bold text-xl md:text-2xl transition-all ${
              isSelectedOption
                ? 'bg-primary-neon text-white shadow-2xl shadow-primary-neon/60 scale-110'
                : canVote
                ? 'bg-white/10 text-white group-hover:bg-primary-neon/20 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary-neon/30'
                : 'bg-white/10 text-white'
            }`}>
              {String.fromCharCode(65 + index)}
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-white font-bold text-xl md:text-2xl block mb-2">{prediction.options[index]}</span>
              {isWinning && totalVotes > 0 && !isSelectedOption && (
                <span className="text-secondary-cyan text-sm font-bold flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-cyan/20 border border-secondary-cyan/30 inline-flex">
                  <TrendingUp size={14} />
                  Önde
                </span>
              )}
              {isSelectedOption && (
                <span className="text-primary-neon text-sm font-bold flex items-center gap-2 px-3 py-1 rounded-full bg-primary-neon/20 border border-primary-neon/30 inline-flex mt-2">
                  <CheckCircle size={14} />
                  Seçiminiz
                </span>
              )}
            </div>
            {isSelectedOption && (
              <CheckCircle className="text-primary-neon flex-shrink-0" size={28} style={{
                filter: 'drop-shadow(0 0 12px rgba(255, 46, 99, 0.8))'
              }} />
            )}
          </div>
          <div className="text-right ml-4">
            <div className="text-white font-bold text-3xl md:text-4xl mb-1">{votes}</div>
            <div className="text-white/70 text-base font-medium">{percentage}%</div>
          </div>
        </div>
        
        <div className="relative w-full bg-white/10 rounded-full h-5 overflow-hidden border border-white/20">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent animate-shimmer" />
          <div 
            className={`h-5 rounded-full transition-all duration-700 relative ${
              isSelectedOption 
                ? 'bg-gradient-to-r from-primary-neon via-primary-neon to-primary-neon/90' 
                : 'bg-gradient-to-r from-secondary-cyan via-secondary-cyan to-secondary-cyan/80'
            }`}
            style={{ 
              width: `${percentage}%`,
              boxShadow: isSelectedOption 
                ? '0 0 25px rgba(255, 46, 99, 0.8), inset 0 0 10px rgba(255, 255, 255, 0.2)' 
                : '0 0 15px rgba(8, 217, 214, 0.4)'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </div>
        </div>
      </div>
    </button>
  )
}

