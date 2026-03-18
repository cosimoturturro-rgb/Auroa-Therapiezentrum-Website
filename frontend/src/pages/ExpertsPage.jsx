import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, Globe, ChevronDown, ChevronUp, Menu, X } from "lucide-react";

// Expert data from Aurora Therapiezentrum
const expertsData = [
  {
    id: "daniel-karg",
    name: "Daniel Karg",
    role: "Tiefenpsychologisch fundierter Kinder- und Jugendlichenpsychotherapeut",
    category: "Psychotherapie",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face",
    roomImage: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=500&fit=crop",
    description: "Im Kontakt mit meinen Patienten ist es mir wichtig, Kinder und Jugendliche in ihrer emotionalen Entwicklung zu verstehen und gemeinsam mit ihnen sowie ihren Bezugspersonen Raum für Entwicklung, neue Perspektiven und Lösungswege zu finden. Ich arbeite beziehungsorientiert und mentalisierungsbasiert mit einem tiefen Verständnis für unbewusste seelische Prozesse. Eine vertrauensvolle therapeutische Beziehung ist dabei die Grundlage für jeden Veränderungsprozess.",
    email: "d.karg@aurora-therapiezentrum.de"
  },
  {
    id: "ulrich-passow",
    name: "Ulrich Passow",
    role: "Praxis für systemische Therapie und Hypnotherapie",
    category: "Psychotherapie",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face",
    roomImage: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&h=500&fit=crop",
    description: "Private Psychotherapie, insbesondere Einzel-, Paar- und Familientherapie nach systemischem und hypnosystemischem Ansatz.",
    website: "www.psychotherapie-passow.de"
  },
  {
    id: "carina-roy",
    name: "Carina Roy",
    role: "Business Coach",
    category: "Coaching",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face",
    roomImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=500&fit=crop",
    description: "Ich begleite Menschen und Teams in ihrem individuellen Entwicklungsprozess. Mein Coaching bietet eine fundierte Analyse, aktiviert Ressourcen und unterstützt dabei, Strategien für nachhaltige Veränderungen zu entwickeln. Mit wirtschaftspsychologischen Methoden hinterfragen wir gewohnte Denkmuster, stärken die Selbstreflexion und eröffnen neue Perspektiven.",
    website: "www.carina-roy.de",
    phone: "+49 151 54809698"
  },
  {
    id: "michaela-stabenow",
    name: "Michaela Stabenow",
    role: "Heilpraktikerin Physiotherapie und Osteopathie",
    category: "Physiotherapie und Osteopathie",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&crop=face",
    roomImage: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=500&fit=crop",
    description: "In meiner Privatpraxis für Physiotherapie und Osteopathie behandle ich Erwachsene, Kinder und Säuglinge ganzheitlich und individuell. Mit fundiertem Wissen als Heilpraktikerin und langjähriger Erfahrung verbinde ich klassische physiotherapeutische Ansätze mit osteopathischen Techniken, um die natürliche Balance des Körpers wiederherzustellen. Im Mittelpunkt steht stets der Mensch – mit seiner Geschichte, seinem Körper und seinem Wohlbefinden.",
    website: "www.osteo-stabenow.de",
    phone: "+49 163 7159861"
  }
];

const categories = ["Psychotherapie", "Coaching", "Physiotherapie und Osteopathie"];

// Expert Card Component
const ExpertCard = ({ expert }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      layout
      data-testid={`expert-card-${expert.id}`}
      className="bg-white rounded-2xl overflow-hidden cursor-pointer group"
      style={{
        boxShadow: isExpanded 
          ? "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
          : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
      }}
      onClick={() => setIsExpanded(!isExpanded)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -4 }}
    >
      {/* Collapsed State - Image & Name */}
      <div className="relative">
        <div className="aspect-square overflow-hidden">
          <motion.img
            src={expert.image}
            alt={expert.name}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />
        </div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e4a6a]/80 via-transparent to-transparent" />
        
        {/* Name & Role */}
        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
          <h3 className="text-xl font-bold mb-1" style={{ fontFamily: "'Libre Baskerville', serif" }}>
            {expert.name}
          </h3>
          <p className="text-sm opacity-90 line-clamp-2">{expert.role}</p>
        </div>

        {/* Expand Indicator */}
        <motion.div 
          className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-2"
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-5 h-5 text-white" />
        </motion.div>
      </div>

      {/* Expanded State - Room Image & Description */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            {/* Room Image */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={expert.roomImage}
                alt={`Praxisraum von ${expert.name}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
            </div>

            {/* Description & Contact */}
            <div className="p-6 pt-0 -mt-8 relative z-10">
              <p className="text-[#64748b] text-sm leading-relaxed mb-5">
                {expert.description}
              </p>

              {/* Contact Info */}
              <div className="flex flex-wrap gap-3">
                {expert.email && (
                  <a
                    href={`mailto:${expert.email}`}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#0e4a6a] text-white text-sm rounded-full hover:bg-[#1a6b94] transition-colors duration-200"
                    data-testid={`email-btn-${expert.id}`}
                  >
                    <Mail className="w-4 h-4" />
                    E-Mail
                  </a>
                )}
                {expert.phone && (
                  <a
                    href={`tel:${expert.phone}`}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#14b8a6] text-white text-sm rounded-full hover:bg-[#2dd4bf] transition-colors duration-200"
                    data-testid={`phone-btn-${expert.id}`}
                  >
                    <Phone className="w-4 h-4" />
                    Anrufen
                  </a>
                )}
                {expert.website && (
                  <a
                    href={`https://${expert.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-2 px-4 py-2 border-2 border-[#0e4a6a] text-[#0e4a6a] text-sm rounded-full hover:bg-[#0e4a6a] hover:text-white transition-colors duration-200"
                    data-testid={`website-btn-${expert.id}`}
                  >
                    <Globe className="w-4 h-4" />
                    Website
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click Hint */}
      {!isExpanded && (
        <div className="p-4 pt-0">
          <div className="flex items-center justify-center gap-2 text-[#14b8a6] text-sm font-medium group-hover:text-[#0e4a6a] transition-colors duration-200">
            <span>Mehr erfahren</span>
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      )}
    </motion.div>
  );
};

// Header Component
const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#e2e8f0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="https://www.aurora-therapiezentrum.de" className="flex items-center gap-3" data-testid="logo-link">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0e4a6a] to-[#14b8a6] flex items-center justify-center">
              <span className="text-white font-bold text-xl" style={{ fontFamily: "'Libre Baskerville', serif" }}>A</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-[#0e4a6a] font-bold text-lg" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                Aurora
              </span>
              <span className="block text-[#64748b] text-xs">Therapie- und Gesundheitszentrum</span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="https://www.aurora-therapiezentrum.de" className="text-[#64748b] hover:text-[#0e4a6a] transition-colors duration-200">
              Startseite
            </a>
            <a href="#experten" className="text-[#0e4a6a] font-medium">
              Unsere Experten
            </a>
            <a href="https://www.aurora-therapiezentrum.de/copy-of-about-us-1" className="text-[#64748b] hover:text-[#0e4a6a] transition-colors duration-200">
              Das Angebot
            </a>
            <a 
              href="https://www.aurora-therapiezentrum.de/contact" 
              className="px-6 py-2.5 bg-[#0e4a6a] text-white rounded-full hover:bg-[#1a6b94] transition-colors duration-200"
              data-testid="contact-nav-btn"
            >
              Kontakt
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-[#0e4a6a]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="mobile-menu-btn"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden pb-4"
            >
              <div className="flex flex-col gap-3">
                <a href="https://www.aurora-therapiezentrum.de" className="px-4 py-2 text-[#64748b] hover:bg-[#f1f5f9] rounded-lg">
                  Startseite
                </a>
                <a href="#experten" className="px-4 py-2 text-[#0e4a6a] font-medium bg-[#f1f5f9] rounded-lg">
                  Unsere Experten
                </a>
                <a href="https://www.aurora-therapiezentrum.de/copy-of-about-us-1" className="px-4 py-2 text-[#64748b] hover:bg-[#f1f5f9] rounded-lg">
                  Das Angebot
                </a>
                <a 
                  href="https://www.aurora-therapiezentrum.de/contact" 
                  className="mx-4 py-2.5 bg-[#0e4a6a] text-white text-center rounded-full hover:bg-[#1a6b94]"
                >
                  Kontakt
                </a>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

// Hero Section
const Hero = () => (
  <section className="relative pt-20">
    {/* Background Image */}
    <div 
      className="h-[50vh] min-h-[400px] bg-cover bg-center relative"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&h=800&fit=crop')"
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-[#0e4a6a]/90 to-[#0e4a6a]/70" />
      
      <div className="absolute inset-0 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <p className="text-[#14b8a6] font-medium mb-4 tracking-wide uppercase text-sm">
              vielfältig · erfahren · engagiert
            </p>
            <h1 
              className="text-4xl md:text-5xl lg:text-6xl text-white mb-6 leading-tight"
              style={{ fontFamily: "'Libre Baskerville', serif" }}
              data-testid="hero-title"
            >
              Unsere Expertinnen und Experten
            </h1>
            <p className="text-white/90 text-lg md:text-xl leading-relaxed">
              Erfahrene Therapeuten, Coaches und Heilpraktiker – individuell, professionell und ganzheitlich.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  </section>
);

// Intro Section
const IntroSection = () => (
  <section className="py-16 md:py-20 bg-white">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-[#64748b] text-lg leading-relaxed mb-6">
          Im Aurora Therapie- und Gesundheitszentrum finden Sie erfahrene Therapeutinnen und Therapeuten, 
          Coaches, Heilpraktikerinnen und Heilpraktiker, die voneinander unabhängig und selbstständig tätig sind – 
          mit unterschiedlichen Schwerpunkten, fundierter Ausbildung und einem gemeinsamen Ziel: 
          Menschen individuell auf ihrem Weg zu mehr Gesundheit und innerer Balance zu begleiten.
        </p>
        <p className="text-[#64748b] leading-relaxed">
          Jede und jeder bringt eine eigene Perspektive und besondere Kompetenzen mit. 
          So entsteht ein vielfältiges Angebot – persönlich, professionell und ganzheitlich gedacht.
        </p>
      </motion.div>
    </div>
  </section>
);

// Experts Grid Section
const ExpertsSection = () => (
  <section id="experten" className="py-16 md:py-24 bg-[#f8fafc]">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {categories.map((category, categoryIndex) => {
        const categoryExperts = expertsData.filter(e => e.category === category);
        if (categoryExperts.length === 0) return null;

        return (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
            className="mb-16 last:mb-0"
          >
            {/* Category Header */}
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px flex-1 bg-gradient-to-r from-[#14b8a6] to-transparent" />
              <h2 
                className="text-2xl md:text-3xl text-[#0e4a6a] px-4"
                style={{ fontFamily: "'Libre Baskerville', serif" }}
                data-testid={`category-${category.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {category}
              </h2>
              <div className="h-px flex-1 bg-gradient-to-l from-[#14b8a6] to-transparent" />
            </div>

            {/* Experts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categoryExperts.map((expert) => (
                <ExpertCard key={expert.id} expert={expert} />
              ))}
            </div>
          </motion.div>
        );
      })}

      {/* Additional Note */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-16 p-6 bg-white rounded-2xl border border-[#e2e8f0] text-center"
      >
        <p className="text-[#64748b] text-sm">
          Neben den hier angezeigten praktizieren in unseren Räumlichkeiten auch weitere Expertinnen und Experten 
          aus verschiedenen Fachbereichen auf selbstständiger Basis. Diese Kolleginnen und Kollegen nutzen einzelne 
          Praxisräume im Rahmen von Untermietverträgen und arbeiten rechtlich und fachlich unabhängig voneinander.
        </p>
      </motion.div>
    </div>
  </section>
);

// Contact Section
const ContactSection = () => (
  <section className="py-16 md:py-24 bg-[#0e4a6a]">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 
          className="text-3xl md:text-4xl text-white mb-6"
          style={{ fontFamily: "'Libre Baskerville', serif" }}
        >
          Fragen? Schreiben Sie uns gerne.
        </h2>
        <p className="text-white/80 text-lg mb-4">
          Sie möchten mehr über das Aurora Therapie- und Gesundheitszentrum erfahren 
          oder haben eine allgemeine Anfrage? Nutzen Sie einfach das Kontaktformular.
        </p>
        <p className="text-white/60 text-sm mb-8">
          Bitte beachten Sie: Termine können ausschließlich direkt mit den jeweiligen 
          Therapeut:innen, Heilpraktiker:innen oder Coaches vereinbart oder abgesagt werden.
        </p>
        <a
          href="https://www.aurora-therapiezentrum.de/contact"
          className="inline-flex items-center gap-2 px-8 py-4 bg-[#14b8a6] text-white font-medium rounded-full hover:bg-[#2dd4bf] transition-colors duration-200 shadow-lg hover:shadow-xl"
          data-testid="contact-section-btn"
        >
          <Mail className="w-5 h-5" />
          Zum Kontaktformular
        </a>
      </motion.div>
    </div>
  </section>
);

// Footer Component
const Footer = () => (
  <footer className="bg-[#0f172a] py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0e4a6a] to-[#14b8a6] flex items-center justify-center">
            <span className="text-white font-bold" style={{ fontFamily: "'Libre Baskerville', serif" }}>A</span>
          </div>
          <span className="text-white font-medium">Aurora Therapiezentrum</span>
        </div>

        {/* Links */}
        <nav className="flex flex-wrap justify-center gap-6 text-sm">
          <a href="https://www.aurora-therapiezentrum.de" className="text-[#94a3b8] hover:text-white transition-colors duration-200">
            Startseite
          </a>
          <a href="https://www.aurora-therapiezentrum.de/kopie-von-unsere-experten" className="text-[#94a3b8] hover:text-white transition-colors duration-200">
            Experten
          </a>
          <a href="https://www.aurora-therapiezentrum.de/contact" className="text-[#94a3b8] hover:text-white transition-colors duration-200">
            Kontakt
          </a>
        </nav>

        {/* Copyright */}
        <p className="text-[#64748b] text-sm">
          © {new Date().getFullYear()} Aurora Therapiezentrum
        </p>
      </div>
    </div>
  </footer>
);

// Main Page Component
export default function ExpertsPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Header />
      <main>
        <Hero />
        <IntroSection />
        <ExpertsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
