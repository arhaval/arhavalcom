const SectionTitle = ({ title, subtitle }) => {
  return (
    <div className="mb-8 md:mb-12">
      {/* Title with Prefix */}
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold italic tracking-wider mb-3">
        <span 
          className="text-primary-neon mr-2"
          style={{
            textShadow: '0 0 10px rgba(255, 46, 99, 0.8), 0 0 20px rgba(255, 46, 99, 0.6)'
          }}
        >
          //
        </span>
        <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent uppercase">
          {title}
        </span>
      </h2>
      
      {/* Subtitle (if provided) */}
      {subtitle && (
        <p className="text-lg md:text-xl text-white/70 font-light mb-4 max-w-3xl mx-auto">
          {subtitle}
        </p>
      )}
      
      {/* Decorative Underline */}
      <div className="relative">
        <div 
          className="h-[2px] w-16 md:w-24 bg-secondary-cyan"
          style={{
            boxShadow: '0 0 10px rgba(8, 217, 214, 0.6), 0 0 20px rgba(8, 217, 214, 0.3)'
          }}
        />
      </div>
    </div>
  )
}

export default SectionTitle

