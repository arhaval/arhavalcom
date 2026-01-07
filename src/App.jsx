import { useState, useEffect } from 'react'
import { Link, Routes, Route } from 'react-router-dom'
import { Menu, X, Trophy, Video, Users, TrendingUp, Play, Twitch, Instagram, Twitter, Youtube, ExternalLink, Settings } from 'lucide-react'
import SectionTitle from './SectionTitle.jsx'
import PortfolioAdmin from './pages/PortfolioAdmin.jsx'

// ============================================
// 🔗 LİNKLERİ BURADAN DÜZENLEYİN
// ============================================

// Logo Ayarları
const LOGO_CONFIG = {
  // Logo URL'si (public klasörüne koyarsanız: '/logo.png' veya tam URL: 'https://...')
  url: '/images/arhaval.png', // Logo dosyanızın yolu
  // Logo yoksa metin gösterilsin mi?
  showTextFallback: true,
  // Logo boyutları
  navbar: { width: 300, height: 100 }, // Navbar için
  hero: { width: 800, height: 300 }, // Hero section için
  footer: { width: 300, height: 120 } // Footer için
}

// Navbar Menü Linkleri
const NAVBAR_LINKS = [
  { href: '#hero', label: 'Ana Sayfa' },
  { href: '#about', label: 'Hakkımızda' },
  { href: '#services', label: 'Hizmetler' },
  { href: '#stats', label: 'İstatistikler' },
  { href: '#trcs', label: 'TRCS Belgeselleri' }
]

// Sosyal Medya Linkleri
const SOCIAL_LINKS = [
  { icon: Twitch, href: '#', label: 'Twitch' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Youtube, href: '#', label: 'Youtube' }
]

// Partner Linkleri
const PARTNERS = [
  {
    name: 'Sangal Esports',
    logo: 'https://via.placeholder.com/200x80/ffffff/000000?text=SANGAL',
    url: '#'
  },
  {
    name: 'Eternal Fire',
    logo: 'https://via.placeholder.com/200x80/ffffff/000000?text=ETERNAL+FIRE',
    url: '#'
  }
]

// ============================================

// Navbar Component
const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [navbarLinks, setNavbarLinks] = useState(() => getInitialData('navbarLinks', NAVBAR_LINKS))
  const [logoConfig, setLogoConfig] = useState(() => getInitialData('logo', LOGO_CONFIG))

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const loadNavbarData = () => {
    const saved = localStorage.getItem('arhaval_portfolio_data')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        if (data.navbarLinks) setNavbarLinks(data.navbarLinks)
        if (data.logo) setLogoConfig(data.logo)
      } catch (e) {
        console.error('Error loading navbar data:', e)
      }
    }
  }

  useEffect(() => {
    loadNavbarData()
    
    // Storage event listener (başka tab'den güncelleme için)
    const handleStorageChange = () => {
      loadNavbarData()
    }
    
    // Custom event listener (aynı tab'den güncelleme için)
    const handlePortfolioUpdate = () => {
      loadNavbarData()
    }
    
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('portfolioDataUpdated', handlePortfolioUpdate)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('portfolioDataUpdated', handlePortfolioUpdate)
    }
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'blur-background py-3' : 'py-6'
    }`}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        {logoConfig.url ? (
          <img 
            src={logoConfig.url} 
            alt="Arhaval Esports Logo"
            className="object-contain"
            style={{ 
              width: logoConfig.navbar?.width || 120, 
              height: logoConfig.navbar?.height || 40,
              maxWidth: '100%'
            }}
            onError={(e) => {
              e.target.style.display = 'none'
              if (logoConfig.showTextFallback) {
                e.target.nextSibling.style.display = 'block'
              }
            }}
          />
        ) : null}
        {logoConfig.showTextFallback && (
          <div 
            className="text-2xl font-bold tracking-wide text-primary-neon text-neon"
            style={{ display: logoConfig.url ? 'none' : 'block' }}
          >
            ARHAVAL
          </div>
        )}
        <div className="hidden md:flex items-center space-x-8">
          {navbarLinks.map((link, index) => (
            <a 
              key={index}
              href={link.href} 
              className="text-white hover:text-primary-neon transition-colors font-medium"
            >
              {link.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <Link
            to="/admin/content"
            className="text-white/60 hover:text-primary-neon transition-colors"
            title="Admin Panel"
          >
            <Settings size={20} />
          </Link>
          <button
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden glass-strong mt-4 mx-6 rounded-lg p-4 space-y-3">
          {navbarLinks.map((link, index) => (
            <a 
              key={index}
              href={link.href} 
              className="block text-white hover:text-primary-neon transition-colors font-medium"
            >
              {link.label}
            </a>
          ))}
          <Link
            to="/admin/content"
            className="block text-white/60 hover:text-primary-neon transition-colors font-medium flex items-center gap-2"
          >
            <Settings size={18} />
            Admin Panel
          </Link>
        </div>
      )}
    </nav>
  )
}

// Helper function to get initial data from localStorage
const getInitialData = (key, defaultValue) => {
  if (typeof window === 'undefined') return defaultValue
  try {
    const saved = localStorage.getItem('arhaval_portfolio_data')
    if (saved) {
      const data = JSON.parse(saved)
      return data[key] || defaultValue
    }
  } catch (e) {
    console.error('Error loading initial data:', e)
  }
  return defaultValue
}

// Hero Section Component
const Hero = () => {
  const [heroBanner, setHeroBanner] = useState(() => 
    getInitialData('heroBanner', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1920&q=80')
  )
  const [logoConfig, setLogoConfig] = useState(() => 
    getInitialData('logo', LOGO_CONFIG)
  )

  useEffect(() => {
    const loadHeroData = () => {
      const saved = localStorage.getItem('arhaval_portfolio_data')
      if (saved) {
        try {
          const data = JSON.parse(saved)
          if (data.heroBanner) setHeroBanner(data.heroBanner)
          if (data.logo) setLogoConfig(data.logo)
        } catch (e) {
          console.error('Error loading hero data:', e)
        }
      }
    }

    loadHeroData()
    const handleUpdate = () => loadHeroData()
    window.addEventListener('storage', handleUpdate)
    window.addEventListener('portfolioDataUpdated', handleUpdate)
    
    // Her 500ms'de bir kontrol et (güvenlik için)
    const interval = setInterval(loadHeroData, 500)
    
    return () => {
      window.removeEventListener('storage', handleUpdate)
      window.removeEventListener('portfolioDataUpdated', handleUpdate)
      clearInterval(interval)
    }
  }, [])

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${heroBanner})`,
            filter: 'brightness(0.15) blur(2px)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg-dark/70 to-bg-dark" />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6">
        <div className="mb-6 flex justify-center items-center">
          {logoConfig.url ? (
            <img 
              src={logoConfig.url} 
              alt="Arhaval Esports Logo"
              className="object-contain"
              style={{ 
                width: logoConfig.hero?.width || 300, 
                height: logoConfig.hero?.height || 100,
                maxWidth: '100%'
              }}
              onError={(e) => {
                e.target.style.display = 'none'
                if (logoConfig.showTextFallback) {
                  e.target.nextSibling.style.display = 'block'
                }
              }}
            />
          ) : null}
          {logoConfig.showTextFallback && (
            <h1 
              className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-widest text-white text-neon"
              style={{ display: logoConfig.url ? 'none' : 'block' }}
            >
              ARHAVAL
            </h1>
          )}
        </div>
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-widest mb-8">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-cyan to-primary-neon text-cyan-glow">
            ESPORTS
          </span>
        </h2>
        <p className="text-xl md:text-2xl text-white max-w-2xl mx-auto font-medium">
          Profesyonel Esports Organizasyonu
        </p>
      </div>

      {/* Fade-out Bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 gradient-fade-bottom z-10" />
    </section>
  )
}

// Strategic Partners Section
const StrategicPartners = () => {
  const [partners, setPartners] = useState(() => getInitialData('partners', PARTNERS))

  useEffect(() => {
    const saved = localStorage.getItem('arhaval_portfolio_data')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        if (data.partners) setPartners(data.partners)
      } catch (e) {
        console.error('Error loading partners data:', e)
      }
    }
  }, [])

  return (
    <section className="relative py-16 px-6">
      {/* Glass Strip Background */}
      <div className="absolute inset-0 backdrop-blur-sm bg-bg-dark/30" />
      
      {/* Top Fade Line - Turkuaz */}
      <div className="absolute top-0 left-0 right-0 h-px">
        <div className="h-full bg-gradient-to-r from-transparent via-secondary-cyan to-transparent opacity-60" 
             style={{
               boxShadow: '0 0 10px rgba(8, 217, 214, 0.5), 0 0 20px rgba(8, 217, 214, 0.3)'
             }}
        />
      </div>
      
      {/* Bottom Fade Line - Turkuaz */}
      <div className="absolute bottom-0 left-0 right-0 h-px">
        <div className="h-full bg-gradient-to-r from-transparent via-secondary-cyan to-transparent opacity-60"
             style={{
               boxShadow: '0 0 10px rgba(8, 217, 214, 0.5), 0 0 20px rgba(8, 217, 214, 0.3)'
             }}
        />
      </div>

      <div className="container mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <SectionTitle 
            title="PARTNERS" 
          />
        </div>

        {/* Partner Logos */}
        <div className="flex flex-wrap items-center justify-center gap-12 md:gap-16 lg:gap-20">
          {partners.map((partner, index) => (
            <a
              key={index}
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative"
            >
              <div className="w-32 md:w-40 lg:w-48 h-auto transition-all duration-500 grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100">
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="w-full h-auto object-contain filter transition-all duration-500"
                />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

// About & Services Section
const AboutServices = () => {
  const [aboutText, setAboutText] = useState(() => 
    getInitialData('aboutText', `Arhaval, e-spor ekosisteminde içerik üretimi, canlı yayınlar ve turnuva organizasyonlarını tek bir çatı altında buluşturan bağımsız bir platformdur.

Merkezinde Counter-Strike 2 olmak üzere, rekabetçi oyun kültürünü sadece izlenen değil, etkileşime girilen bir deneyime dönüştürmeyi hedefler.

Bizim için e-spor; yalnızca maçlardan ibaret değildir.

Oyuncular, takımlar, hikâyeler, anlar ve bu anları yaşayan topluluklar vardır. Arhaval, bu kültürü anlatan, üreten ve büyüten bir yapı olarak konumlanır.`)
  )

  const loadAboutData = () => {
    const saved = localStorage.getItem('arhaval_portfolio_data')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        if (data.aboutText) setAboutText(data.aboutText)
      } catch (e) {
        console.error('Error loading about text:', e)
      }
    }
  }

  useEffect(() => {
    loadAboutData()
    const handleUpdate = () => loadAboutData()
    window.addEventListener('storage', handleUpdate)
    window.addEventListener('portfolioDataUpdated', handleUpdate)
    return () => {
      window.removeEventListener('storage', handleUpdate)
      window.removeEventListener('portfolioDataUpdated', handleUpdate)
    }
  }, [])

  const services = [
    {
      icon: Trophy,
      title: 'Turnuva Organizasyonu',
      description: 'Profesyonel ekibimiz ve turnuva sistemimiz ile espor, community ve şirketler arası turnuvalar yapmaktayız. Her detayı sizler için mükemmelleştiriyoruz.',
      glowColor: 'primary-neon'
    },
    {
      icon: Video,
      title: 'Canlı Yayınlar',
      description: 'Kendi turnuvalarımız ve Türk takımlarımızın maçlarını sizlere en güzel şekilde yayınlamaya çalışıyoruz. Tahmin sistemimiz ile yayınlara renk katıyoruz.',
      glowColor: 'secondary-cyan'
    },
    {
      icon: Play,
      title: 'İçerikler',
      description: 'Kendi ekibimiz ile sizlere haftanın 5 günü özel ve niş içerikler çıkartıyoruz. Tamamı sizlerin sevdiği ve takip ettiği özel içerikler olmasına özen gösteriyoruz.',
      glowColor: 'primary-neon'
    }
  ]

  const paragraphs = aboutText.split('\n\n').filter(p => p.trim())

  return (
    <section id="about" className="relative py-32 px-6">
      {/* Background Glow Effects - Reduced */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-neon/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary-cyan/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto relative z-10">
        <div className="text-center mb-20">
          <SectionTitle 
            title="Hakkımızda" 
          />
        </div>

        {/* About Content */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="space-y-6 text-white/90 leading-relaxed text-center">
            {paragraphs.map((para, index) => {
              const isItalic = para.includes('Bizim için e-spor')
              let processedPara = para
                .replace(/Counter-Strike 2/g, '<span class="text-secondary-cyan font-bold">Counter-Strike 2</span>')
                .replace(/etkileşime girilen bir deneyime/g, '<span class="text-primary-neon font-bold">etkileşime girilen bir deneyime</span>')
                .replace(/anlatan/g, '<span class="text-secondary-cyan font-bold">anlatan</span>')
                .replace(/üreten/g, '<span class="text-primary-neon font-bold">üreten</span>')
                .replace(/büyüten/g, '<span class="text-secondary-cyan font-bold">büyüten</span>')
              
              return (
                <p 
                  key={index} 
                  className={`text-lg md:text-xl font-medium ${isItalic ? 'italic text-white/80' : ''}`}
                  dangerouslySetInnerHTML={{ __html: processedPara }}
                />
              )
            })}
          </div>
        </div>

        <div id="services" className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <div
                key={index}
                className="glass-strong rounded-2xl p-8 relative overflow-hidden group hover:scale-105 transition-transform duration-300 border border-secondary-cyan/30 hover:border-secondary-cyan/60 transition-colors"
              >
                {/* Background Glow */}
                <div 
                  className="absolute -inset-4 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ backgroundColor: '#08d9d630' }}
                />
                
                <div className="relative z-10">
                  <div 
                    className="inline-flex p-4 rounded-xl mb-6"
                    style={{ backgroundColor: '#08d9d620' }}
                  >
                    <Icon 
                      size={32} 
                      className="text-secondary-cyan"
                    />
                  </div>
                  <h3 className="text-2xl font-bold tracking-wide text-white mb-4">
                    {service.title}
                  </h3>
                  <p className="text-white leading-relaxed font-medium">
                    {service.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// Animated Counter Component
const AnimatedCounter = ({ target, suffix = '', prefix = '', duration = 2000 }) => {
  const [count, setCount] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    // Intersection Observer ile bölüm görünür olduğunda animasyonu başlat
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true)
            animateCounter()
          }
        })
      },
      { threshold: 0.3 }
    )

    const element = document.getElementById('stats')
    if (element) {
      observer.observe(element)
    }

    return () => {
      if (element) {
        observer.unobserve(element)
      }
    }
  }, [hasAnimated])

  const animateCounter = () => {
    const startTime = Date.now()
    const startValue = 0
    const endValue = target

    const animate = () => {
      const now = Date.now()
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const currentValue = Math.floor(startValue + (endValue - startValue) * easeOut)
      
      setCount(currentValue)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setCount(endValue)
      }
    }

    requestAnimationFrame(animate)
  }

  const formatNumber = (num) => {
    if (num >= 1000) {
      return num.toLocaleString('tr-TR', { maximumFractionDigits: 0 })
    }
    return num.toString()
  }

  return (
    <span>
      {prefix}{formatNumber(count)}{suffix}
    </span>
  )
}

// Stats Section
const Stats = () => {
  const [stats, setStats] = useState(() => 
    getInitialData('stats', [
      { target: 2, suffix: ' MİLYON', label: 'Canlı İzlenme' },
      { target: 600, suffix: ' SAAT', label: 'Canlı Yayın' },
      { target: 150, suffix: '', label: 'Niş İçerik' },
      { target: 30, suffix: ' K', label: 'Takipçi' }
    ])
  )

  useEffect(() => {
    const saved = localStorage.getItem('arhaval_portfolio_data')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        if (data.stats) setStats(data.stats)
      } catch (e) {
        console.error('Error loading stats data:', e)
      }
    }
  }, [])

  return (
    <section id="stats" className="relative py-32 px-6">
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-20">
          <SectionTitle title="2025' de ARHAVAL" />
        </div>
        
        {/* Stats Grid - Eşit genişlikte, aynı hizada */}
        <div className="flex flex-col md:flex-row items-stretch justify-center gap-12 md:gap-16 lg:gap-20 max-w-7xl mx-auto">
          {stats.map((stat, index) => (
            <div key={index} className="flex-1 flex flex-col items-center justify-center text-center min-w-0">
              {/* Stat Number - Sabit yükseklik, tek hizada */}
              <div className="w-full mb-1 h-24 md:h-28 flex items-center justify-center">
                <div className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-wide text-secondary-cyan text-center leading-tight whitespace-nowrap">
                  +<AnimatedCounter 
                    target={stat.target} 
                    prefix="" 
                    suffix={stat.suffix} 
                  />
                </div>
              </div>
              {/* Stat Label - İnce, grimsi alt başlık - Sayıların hemen altında */}
              <div className="w-full h-10 flex items-start justify-center">
                <div className="text-xs md:text-sm text-white/60 font-light text-center tracking-normal">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// TRCS Documentaries Section - Polygon Cards
const TRCSDocumentaries = () => {
  const [documentaries, setDocumentaries] = useState(() => 
    getInitialData('documentaries', [
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
    ])
  )

  const loadDocumentariesData = () => {
    const saved = localStorage.getItem('arhaval_portfolio_data')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        if (data.documentaries) setDocumentaries(data.documentaries)
      } catch (e) {
        console.error('Error loading documentaries data:', e)
      }
    }
  }

  useEffect(() => {
    loadDocumentariesData()
    const handleUpdate = () => loadDocumentariesData()
    window.addEventListener('storage', handleUpdate)
    window.addEventListener('portfolioDataUpdated', handleUpdate)
    return () => {
      window.removeEventListener('storage', handleUpdate)
      window.removeEventListener('portfolioDataUpdated', handleUpdate)
    }
  }, [])

  const handleCardClick = (videoUrl) => {
    if (videoUrl) {
      window.open(videoUrl, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <section id="trcs" className="relative py-32 px-6">
      {/* Background Glow Effects - Turkuaz */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[700px] bg-secondary-cyan/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto relative z-10 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <SectionTitle 
            title="İÇERİKLERİMİZ"
            subtitle="Türk Counter Strike efsanesi oyuncularımızın belgeselleri ve çok daha fazlası için içeriklerimize göz atın !"
          />
        </div>

        {/* Polygon Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 lg:gap-16">
          {documentaries.map((doc, index) => (
            <div
              key={index}
              className="group cursor-pointer transition-all duration-500"
            >
              {/* Outer Container - Neon Turkuaz Border */}
              <div 
                className="relative transition-all duration-500 group-hover:scale-105"
                style={{
                  clipPath: 'polygon(0 0, 100% 0, 100% 85%, 50% 100%, 0 85%)',
                  backgroundColor: '#08d9d6',
                  padding: '2px',
                  boxShadow: '0 0 20px rgba(8, 217, 214, 0.3)',
                  filter: 'drop-shadow(0 0 10px rgba(8, 217, 214, 0.5))'
                }}
              >
                {/* Hover Glow Enhancement */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    clipPath: 'polygon(0 0, 100% 0, 100% 85%, 50% 100%, 0 85%)',
                    boxShadow: '0 0 40px rgba(8, 217, 214, 0.8), 0 0 80px rgba(8, 217, 214, 0.4)',
                    zIndex: 1
                  }}
                />

                {/* Inner Container - Image (2px smaller) */}
                <div 
                  className="relative overflow-hidden bg-bg-dark"
                  style={{
                    clipPath: 'polygon(0 0, 100% 0, 100% 85%, 50% 100%, 0 85%)',
                    aspectRatio: '2/3',
                    margin: '2px'
                  }}
                >
                  {/* Cover Image */}
                  <img
                    src={doc.coverImage}
                    alt={doc.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Gradient Overlay (Bottom) */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                  {/* Content Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 pb-8 z-10">
                    {/* Title */}
                    <h3 className="text-xl md:text-2xl font-bold tracking-wide text-white mb-4 text-center">
                      {doc.title}
                    </h3>

                    {/* Watch Button */}
                    <div className="flex items-center justify-center">
                      <button 
                        className="px-6 py-2 bg-primary-neon text-white font-bold tracking-wide uppercase transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg group-hover:shadow-primary-neon/50"
                        style={{
                          textShadow: '0 0 10px rgba(255, 46, 99, 0.8)',
                          boxShadow: '0 0 20px rgba(255, 46, 99, 0.5)'
                        }}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleCardClick(doc.videoUrl)
                        }}
                      >
                        ŞİMDİ İZLE
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Social Media Hub Component
const SocialMediaHub = () => {
  const [socialLinks, setSocialLinks] = useState(() => {
    const saved = getInitialData('socialLinks', SOCIAL_LINKS)
    if (Array.isArray(saved) && saved.length > 0) {
      const iconMap = {
        'Twitch': Twitch,
        'Instagram': Instagram,
        'Twitter': Twitter,
        'Youtube': Youtube
      }
      return saved.map(link => ({
        ...link,
        icon: iconMap[link.icon] || Twitch,
        name: link.platform?.toUpperCase() || link.label?.toUpperCase() || 'SOCIAL',
        label: link.platform || link.label || 'Social',
        hoverColor: link.color || '#ff2e63',
        color: link.color || '#ffffff',
        url: link.href || '#'
      }))
    }
    return SOCIAL_LINKS
  })

  const loadSocialLinksData = () => {
    const saved = localStorage.getItem('arhaval_portfolio_data')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        if (data.socialLinks) {
          // Icon mapping
          const iconMap = {
            'Twitch': Twitch,
            'Instagram': Instagram,
            'Twitter': Twitter,
            'Youtube': Youtube
          }
          const mapped = data.socialLinks.map(link => ({
            ...link,
            icon: iconMap[link.icon] || Twitch,
            name: link.platform?.toUpperCase() || link.label?.toUpperCase() || 'SOCIAL',
            label: link.platform || link.label || 'Social',
            hoverColor: link.color || '#ff2e63',
            color: link.color || '#ffffff',
            url: link.href || '#'
          }))
          setSocialLinks(mapped)
        }
      } catch (e) {
        console.error('Error loading social links:', e)
      }
    }
  }

  useEffect(() => {
    loadSocialLinksData()
    const handleUpdate = () => loadSocialLinksData()
    window.addEventListener('storage', handleUpdate)
    window.addEventListener('portfolioDataUpdated', handleUpdate)
    return () => {
      window.removeEventListener('storage', handleUpdate)
      window.removeEventListener('portfolioDataUpdated', handleUpdate)
    }
  }, [])

  const platforms = socialLinks.map(link => ({
    name: link.name || link.label?.toUpperCase() || 'SOCIAL',
    icon: link.icon,
    color: link.color || '#ffffff',
    hoverColor: link.hoverColor || link.color || '#ff2e63',
    url: link.href || link.url || '#',
    label: link.label || link.platform || 'Social'
  }))

  return (
    <section className="relative py-24 px-6">
      <div className="container mx-auto relative z-10 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <SectionTitle 
            title="BİZİ TAKİP EDİN"
            subtitle="Sosyal medya hesaplarımızdan güncel haberleri, turnuva duyurularını ve özel içerikleri kaçırma."
          />
        </div>

        {/* Social Media Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {platforms.map((platform, index) => {
            const Icon = platform.icon
            return (
              <a
                key={index}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square"
              >
                {/* Card Container */}
                <div 
                  className="h-full w-full glass rounded-lg border border-white/10 p-6 flex flex-col items-center justify-center transition-all duration-300 group-hover:-translate-y-2 relative overflow-hidden"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)'
                  }}
                >
                  {/* Hover Glow Background */}
                  <div 
                    className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                    style={{
                      backgroundColor: platform.hoverColor,
                      boxShadow: `0 0 40px ${platform.hoverColor}40`
                    }}
                  />

                  {/* Icon */}
                  <div 
                    className="relative z-10 mb-4 transition-all duration-300"
                    style={{
                      color: 'white'
                    }}
                  >
                    <Icon 
                      size={48}
                      className="transition-all duration-300"
                      style={{
                        filter: 'drop-shadow(0 0 0px transparent)'
                      }}
                    />
                    <style dangerouslySetInnerHTML={{
                      __html: `
                        .group:hover .relative.z-10 svg {
                          color: ${platform.hoverColor} !important;
                          filter: drop-shadow(0 0 10px ${platform.hoverColor}80) !important;
                        }
                      `
                    }} />
                  </div>

                  {/* Platform Name */}
                  <h3 
                    className="text-sm md:text-base font-bold tracking-wide text-white text-center mb-1 transition-colors duration-300 relative z-10"
                    style={{
                      fontFamily: "'Rajdhani', sans-serif"
                    }}
                  >
                    {platform.name}
                  </h3>

                  {/* Follow Text */}
                  <p 
                    className="text-xs text-white/60 text-center transition-colors duration-300 relative z-10"
                    style={{
                      fontFamily: "'Rajdhani', sans-serif"
                    }}
                  >
                    Takip Et
                  </p>

                  {/* Hover Border Glow */}
                  <div 
                    className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{
                      boxShadow: `inset 0 0 20px ${platform.hoverColor}40, 0 0 30px ${platform.hoverColor}60`,
                      borderColor: platform.hoverColor
                    }}
                  />
                </div>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// Footer Component
const Footer = () => {
  const [socialLinks, setSocialLinks] = useState(SOCIAL_LINKS)
  const [logoConfig, setLogoConfig] = useState(() => getInitialData('logo', LOGO_CONFIG))

  useEffect(() => {
    const loadFooterData = () => {
      const saved = localStorage.getItem('arhaval_portfolio_data')
      if (saved) {
        try {
          const data = JSON.parse(saved)
          if (data.logo) setLogoConfig(data.logo)
          if (data.socialLinks) {
            const iconMap = {
              'Twitch': Twitch,
              'Instagram': Instagram,
              'Twitter': Twitter,
              'Youtube': Youtube
            }
            const mapped = data.socialLinks.map(link => ({
              ...link,
              icon: iconMap[link.icon] || Twitch,
              href: link.href || '#'
            }))
            setSocialLinks(mapped)
          }
        } catch (e) {
          console.error('Error loading footer data:', e)
        }
      }
    }

    loadFooterData()
    const handleUpdate = () => loadFooterData()
    window.addEventListener('storage', handleUpdate)
    window.addEventListener('portfolioDataUpdated', handleUpdate)
    return () => {
      window.removeEventListener('storage', handleUpdate)
      window.removeEventListener('portfolioDataUpdated', handleUpdate)
    }
  }, [])

  return (
    <footer className="relative py-16 px-6 border-t border-white/10">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            {logoConfig.url ? (
              <img 
                src={logoConfig.url} 
                alt="Arhaval Esports Logo"
                className="object-contain"
                style={{ 
                  width: logoConfig.footer?.width || 150, 
                  height: logoConfig.footer?.height || 50,
                  maxHeight: '50px'
                }}
                onError={(e) => {
                  e.target.style.display = 'none'
                  if (logoConfig.showTextFallback) {
                    e.target.nextSibling.style.display = 'block'
                  }
                }}
              />
            ) : null}
            {logoConfig.showTextFallback && (
              <div 
                className="text-2xl font-bold tracking-wide text-primary-neon text-neon"
                style={{ display: logoConfig.url ? 'none' : 'block' }}
              >
                ARHAVAL ESPORTS
              </div>
            )}
          </div>
          <div className="flex items-center gap-6">
            {socialLinks.map((social, index) => {
              const Icon = social.icon
              return (
                <a
                  key={index}
                  href={social.href}
                  className="text-white hover:text-primary-neon transition-colors"
                  aria-label={social.label}
                >
                  <Icon size={24} />
                </a>
              )
            })}
          </div>
        </div>
        <div className="mt-8 text-center text-white/60 text-sm font-medium">
          <p>&copy; 2024 Arhaval Esports. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  )
}

// Portfolio Home Page Component
const PortfolioHome = () => {
  return (
    <div className="min-h-screen bg-bg-dark" style={{ backgroundColor: '#0a0b10' }}>
      <Navbar />
      <Hero />
      <StrategicPartners />
      <AboutServices />
      <Stats />
      <TRCSDocumentaries />
      <SocialMediaHub />
      <Footer />
    </div>
  )
}

// Main App Component
function App() {
  return (
    <Routes>
      <Route path="/admin/content" element={<PortfolioAdmin />} />
      <Route path="*" element={<PortfolioHome />} />
    </Routes>
  )
}

export default App

