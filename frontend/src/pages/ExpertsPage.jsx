import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, Globe, ChevronDown, Menu, X } from "lucide-react";

// Expert data from Aurora Therapiezentrum - using original images from Wix
const expertsData = [
  {
    id: "elena-berkus",
    name: "Elena Berkus",
    role: "Tiefenpsychologisch fundierte Kinder- und Jugendlichenpsychotherapeutin",
    category: "Psychotherapie",
    image: "https://customer-assets.emergentagent.com/job_healing-portal-8/artifacts/ul805lna_Berkus%20Bild.jpeg",
    roomImage: "https://customer-assets.emergentagent.com/job_healing-portal-8/artifacts/v5soysdv_Berkus%20Raum.jpeg",
    description: "In meiner Praxis biete ich tiefenpsychologisch fundierte Psychotherapie für Kinder und Jugendliche in einem geschützten und wertschätzenden Rahmen an. Dabei verbinde ich fachliche Professionalität mit einer empathischen, zugewandten Haltung und einem sicheren therapeutischen Beziehungsangebot. Durch meine langjährige Tätigkeit in der Begleitung und Zusammenarbeit mit Pflegefamilien verfüge ich über einen umfangreichen Erfahrungsschatz im Umgang mit komplexen Entwicklungsbedingungen, Bindungsstörungen, Traumafolgen und familiären Belastungssituationen. Mein therapeutischer Ansatz orientiert sich an den individuellen Bedürfnissen des Kindes oder Jugendlichen und unterstützt emotionale Stabilisierung, Entwicklungsschritte sowie die Stärkung persönlicher Ressourcen und Beziehungskompetenzen."
  },
  {
    id: "daniel-karg",
    name: "Daniel Karg",
    role: "Tiefenpsychologisch fundierter Kinder- und Jugendlichenpsychotherapeut",
    category: "Psychotherapie",
    image: "https://static.wixstatic.com/media/6f6aae_25385e9a7cf04f5ba50d08fcaa5ada10~mv2.png/v1/fill/w_344,h_344,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Daniel%20Karg.png",
    roomImage: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=400&fit=crop",
    description: "Im Kontakt mit meinen Patienten ist es mir wichtig, Kinder und Jugendliche in ihrer emotionalen Entwicklung zu verstehen und gemeinsam mit ihnen sowie ihren Bezugspersonen Raum für Entwicklung, neue Perspektiven und Lösungswege zu finden. Ich arbeite beziehungsorientiert und mentalisierungsbasiert mit einem tiefen Verständnis für unbewusste seelische Prozesse. Eine vertrauensvolle therapeutische Beziehung ist dabei die Grundlage für jeden Veränderungsprozess.",
    email: "d.karg@aurora-therapiezentrum.de"
  },
  {
    id: "ulrich-passow",
    name: "Ulrich Passow",
    role: "Praxis für systemische Therapie und Hypnotherapie",
    category: "Psychotherapie",
    image: "https://static.wixstatic.com/media/6f6aae_ea1fa58b7d80438497f59ced07dad5e4~mv2.png/v1/fill/w_344,h_344,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Ulrich%20Passow.png",
    roomImage: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&h=400&fit=crop",
    description: "Private Psychotherapie, insbesondere Einzel-, Paar- und Familientherapie nach systemischem und hypnosystemischem Ansatz.",
    website: "www.psychotherapie-passow.de"
  },
  {
    id: "carina-roy",
    name: "Carina Roy",
    role: "Business Coach",
    category: "Coaching",
    image: "https://static.wixstatic.com/media/6f6aae_9344c1f8086d4cd88e53932e7ddf4d3c~mv2.png/v1/fill/w_344,h_344,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Carina_Roy.png",
    roomImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop",
    description: "Ich begleite Menschen und Teams in ihrem individuellen Entwicklungsprozess. Mein Coaching bietet eine fundierte Analyse, aktiviert Ressourcen und unterstützt dabei, Strategien für nachhaltige Veränderungen zu entwickeln. Mit wirtschaftspsychologischen Methoden hinterfragen wir gewohnte Denkmuster, stärken die Selbstreflexion und eröffnen neue Perspektiven.",
    website: "www.carina-roy.de",
    phone: "+49 151 54809698"
  },
  {
    id: "michaela-stabenow",
    name: "Michaela Stabenow",
    role: "Heilpraktikerin Physiotherapie und Osteopathie",
    category: "Physiotherapie und Osteopathie",
    image: "https://static.wixstatic.com/media/372f5a_ecd4d8ec06e74ede88ef9eedfb3aaad4~mv2.jpg/v1/crop/x_0,y_44,w_2623,h_2913/fill/w_330,h_367,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Michaela%20Stabenow%20Portrait%20f%C3%BCr%20Internets.jpg",
    roomImage: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&h=400&fit=crop",
    description: "In meiner Privatpraxis für Physiotherapie und Osteopathie behandle ich Erwachsene, Kinder und Säuglinge ganzheitlich und individuell. Mit fundiertem Wissen als Heilpraktikerin und langjähriger Erfahrung verbinde ich klassische physiotherapeutische Ansätze mit osteopathischen Techniken, um die natürliche Balance des Körpers wiederherzustellen. Im Mittelpunkt steht stets der Mensch – mit seiner Geschichte, seinem Körper und seinem Wohlbefinden.",
    website: "www.osteo-stabenow.de",
    phone: "+49 163 7159861"
  }
];

const categories = ["Psychotherapie", "Coaching", "Physiotherapie und Osteopathie"];

// Navigation Component - Matching Original Aurora Wix Style
const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Aurora", href: "https://www.aurora-therapiezentrum.de" },
    { name: "Angebot", href: "https://www.aurora-therapiezentrum.de/copy-of-about-us-1" },
    { name: "Experten", href: "/", active: true },
    { name: "Raumvermietung", href: "/raumvermietung" },
    { name: "Kontakt und Anreise", href: "https://www.aurora-therapiezentrum.de/contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1a3a4a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-end h-12">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`text-sm transition-colors duration-200 ${
                  link.active 
                    ? "text-[#d4a574]" 
                    : "text-gray-300 hover:text-white"
                }`}
                data-testid={`nav-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="mobile-menu-btn"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden pb-4"
            >
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className={`px-4 py-2 text-sm ${
                      link.active 
                        ? "text-[#d4a574]" 
                        : "text-gray-300 hover:text-white"
                    }`}
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

// Expert Card Component - Original Aurora Style with expand functionality
const ExpertCard = ({ expert }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      layout
      data-testid={`expert-card-${expert.id}`}
      className="bg-white cursor-pointer flex flex-col items-center text-center"
      onClick={() => setIsExpanded(!isExpanded)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Profile Image - Circular like original */}
      <div className="relative mb-4">
        <div className="w-[200px] h-[200px] rounded-full overflow-hidden border-4 border-gray-100 shadow-md">
          <img
            src={expert.image}
            alt={expert.name}
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Expand Indicator */}
        <motion.div 
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#0e4a6a] rounded-full p-1.5 shadow-md"
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-4 h-4 text-white" />
        </motion.div>
      </div>

      {/* Role */}
      <p className="text-gray-600 text-sm mb-1 px-4 leading-relaxed">
        {expert.role}
      </p>

      {/* Name */}
      <h3 className="text-xl font-semibold text-gray-800 mb-3">
        {expert.name}
      </h3>

      {/* Hint to click */}
      {!isExpanded && (
        <p className="text-[#14b8a6] text-sm font-medium">
          Klicken für mehr Infos
        </p>
      )}

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="overflow-hidden w-full"
          >
            {/* Room Image */}
            <div className="my-4 rounded-lg overflow-hidden shadow-md mx-4">
              <img
                src={expert.roomImage}
                alt={`Praxisraum von ${expert.name}`}
                className="w-full h-48 object-cover"
              />
            </div>

            {/* Description */}
            <p className="text-gray-600 text-sm leading-relaxed mb-4 px-4 text-left">
              {expert.description}
            </p>

            {/* Contact Links */}
            <div className="flex flex-wrap justify-center gap-3 px-4 pb-2">
              {expert.email && (
                <a
                  href={`mailto:${expert.email}`}
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-2 px-4 py-2 text-[#0e4a6a] text-sm hover:underline"
                  data-testid={`email-link-${expert.id}`}
                >
                  <Mail className="w-4 h-4" />
                  {expert.email}
                </a>
              )}
              {expert.website && (
                <a
                  href={`https://${expert.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-2 px-4 py-2 text-[#0e4a6a] text-sm hover:underline"
                  data-testid={`website-link-${expert.id}`}
                >
                  <Globe className="w-4 h-4" />
                  {expert.website}
                </a>
              )}
              {expert.phone && (
                <a
                  href={`tel:${expert.phone}`}
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-2 px-4 py-2 text-[#0e4a6a] text-sm hover:underline"
                  data-testid={`phone-link-${expert.id}`}
                >
                  <Phone className="w-4 h-4" />
                  {expert.phone}
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Main Page Component - Matching Aurora Wix Style
export default function ExpertsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section - Like Original */}
      <section className="relative pt-12">
        <div 
          className="h-[420px] bg-cover bg-center"
          style={{
            backgroundImage: "url('https://static.wixstatic.com/media/11062b_096a16ed4fae4a58b83f413906c4278df000.jpg/v1/fill/w_1904,h_420,al_c,q_85,usm_0.33_1.00_0.00,enc_avif,quality_auto/11062b_096a16ed4fae4a58b83f413906c4278df000.jpg')"
          }}
        >
          <div className="absolute inset-0 bg-black/30" />
        </div>
      </section>

      {/* Title Section */}
      <section className="py-12 px-4 text-center max-w-4xl mx-auto">
        <h3 className="text-lg text-gray-600 mb-2">
          Das Angebot der unabhängig arbeitenden Expertinnen und Experten
        </h3>
        <p className="text-[#14b8a6] font-medium tracking-wide mb-8" data-testid="hero-subtitle">
          vielfältig. erfahren. engagiert.
        </p>
        
        <p className="text-gray-600 leading-relaxed mb-6">
          Im Aurora Therapie- und Gesundheitszentrum finden Sie erfahrene Therapeutinnen und Therapeuten, 
          Coaches, Heilpraktikerinnen und Heilpraktiker, die voneinander unabhängig und selbstständig tätig sind – 
          mit unterschiedlichen Schwerpunkten, fundierter Ausbildung und einem gemeinsamen Ziel: 
          Menschen individuell auf ihrem Weg zu mehr Gesundheit und innerer Balance zu begleiten.
        </p>
        
        <p className="text-gray-600 leading-relaxed mb-6">
          Jede und jeder bringt eine eigene Perspektive und besondere Kompetenzen mit. 
          So entsteht ein vielfältiges Angebot – persönlich, professionell und ganzheitlich gedacht.
        </p>

        <p className="text-gray-500 text-sm leading-relaxed">
          Neben den hier angezeigten praktizieren in unseren Räumlichkeiten auch weitere Expertinnen und Experten 
          aus verschiedenen Fachbereichen auf selbstständiger Basis. Diese Kolleginnen nutzen einzelne 
          Praxisräume im Rahmen von Untermietverträgen und arbeiten rechtlich und fachlich unabhängig voneinander.
        </p>
      </section>

      {/* Experts by Category */}
      <section className="pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          {categories.map((category) => {
            const categoryExperts = expertsData.filter(e => e.category === category);
            if (categoryExperts.length === 0) return null;

            return (
              <div key={category} className="mb-16">
                {/* Category Header - Simple like original */}
                <h2 
                  className="text-2xl font-semibold text-gray-800 text-center mb-12"
                  data-testid={`category-${category.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {category}
                </h2>

                {/* Experts Grid */}
                <div className={`grid gap-12 ${categoryExperts.length === 1 ? 'grid-cols-1 max-w-sm mx-auto' : 'grid-cols-1 md:grid-cols-2'}`}>
                  {categoryExperts.map((expert) => (
                    <ExpertCard key={expert.id} expert={expert} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Contact Section - Like Original */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">
            Fragen? Schreiben Sie uns gerne.
          </h2>
          
          <p className="text-gray-600 leading-relaxed mb-4">
            Sie möchten mehr über das Aurora Therapie- und Gesundheitszentrum erfahren 
            oder haben eine allgemeine Anfrage? Nutzen Sie einfach das Kontaktformular.
          </p>
          
          <p className="text-gray-500 text-sm mb-8">
            Bitte beachten Sie: Termine können ausschließlich direkt mit den jeweiligen 
            Therapeut:innen, Heilpraktiker:innen oder Coaches vereinbart oder abgesagt werden.
          </p>

          <a
            href="https://www.aurora-therapiezentrum.de/contact"
            className="inline-block px-8 py-3 bg-[#0e4a6a] text-white font-medium rounded hover:bg-[#1a6b94] transition-colors duration-200"
            data-testid="contact-btn"
          >
            Kontakt
          </a>
        </div>
      </section>
    </div>
  );
}
