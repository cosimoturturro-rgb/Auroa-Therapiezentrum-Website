import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, Globe, ChevronDown, Menu, X, Calendar } from "lucide-react";

// Expert data from Aurora Therapiezentrum - alphabetisch nach Nachnamen sortiert
const expertsData = [
  // PSYCHOTHERAPIE - alphabetisch nach Nachnamen
  {
    id: "markus-bauer",
    name: "Markus Bauer",
    role: "Tiefenpsychologisch fundierter Kinder- und Jugendlichenpsychotherapeut",
    category: "Psychotherapie",
    image: "https://customer-assets.emergentagent.com/job_healing-portal-8/artifacts/r5mfgkon_Bauer%20Bild.jpeg",
    roomImage: "https://customer-assets.emergentagent.com/job_healing-portal-8/artifacts/s41ovhul_Bauer%20Raum.jpeg",
    description: "Als approbierter Kinder- und Jugendlichenpsychotherapeut begleite ich Säuglinge, Kinder, Jugendliche und junge Erwachsene sowie ihre Familien in herausfordernden Lebensphasen. Grundlage meiner Arbeit ist die tiefenpsychologisch-analytische Psychotherapie mit einer bindungsorientierten Haltung. Im Mittelpunkt stehen für mich nicht nur Symptome oder Schwierigkeiten, sondern der Mensch mit seiner individuellen Geschichte, seinen Beziehungen und seinem emotionalen Erleben. Viele seelische Belastungen zeigen sich im Alltag, in der Schule, im Verhalten oder in Beziehungen — häufig stehen sie im Zusammenhang mit inneren Konflikten, Unsicherheiten oder belastenden Erfahrungen. Der psychodynamische Ansatz hilft dabei, diese Zusammenhänge besser zu verstehen. Frühe Beziehungserfahrungen prägen, wie wir uns selbst erleben, wie wir anderen vertrauen und wie wir mit Nähe, Konflikten oder Belastungen umgehen. Solche inneren Beziehungsmuster können im therapeutischen Prozess sichtbar, verstehbar und veränderbar werden. Gemeinsam schauen wir darauf, wie Gefühle, Erfahrungen und Beziehungen das Erleben und Verhalten beeinflussen. Besonders wichtig ist mir dabei eine sichere und vertrauensvolle therapeutische Beziehung, denn Entwicklung entsteht dort, wo Menschen sich verstanden, angenommen und emotional gehalten fühlen."
  },
  {
    id: "sarah-bauer",
    name: "Sarah Bauer",
    role: "Analytisch und tiefenpsychologisch fundierte Kinder- und Jugendlichenpsychotherapeutin",
    category: "Psychotherapie",
    image: "https://customer-assets.emergentagent.com/job_healing-portal-8/artifacts/d2aplacm_Sarah%20Bild.jpeg",
    imageStyle: { objectPosition: "center 20%" },
    roomImage: "https://customer-assets.emergentagent.com/job_healing-portal-8/artifacts/s41ovhul_Bauer%20Raum.jpeg",
    description: "Der Weg des Heranwachsens ist voller Entwicklungsschritte, Entdeckungen, aber auch Herausforderungen. Manchmal fühlen sich diese Phasen überwältigend an - für das Kind selbst und für die ganze Familie. Als analytisch und tiefenpsychologisch fundiert ausgebildete Kinder- und Jugendlichenpsychotherapeutin liegt mein Fokus nicht nur darauf, Symptome zu lindern, sondern auch die tieferliegenden Ursachen zu verstehen. Wir schauen gemeinsam auf die frühen Erfahrungen, die aktuelle Lebenssituation und die unbewussten Muster, die das tägliche Handeln prägen."
  },
  {
    id: "alisha-berchtold",
    name: "Alisha Berchtold",
    role: "Praxis für systemische Einzel-, Paar und Familientherapie und systemische Beratung",
    category: "Psychotherapie",
    image: "https://customer-assets.emergentagent.com/job_healing-portal-8/artifacts/f97210dy_Alisha%20Bild.jpeg",
    imageStyle: { objectPosition: "70% 15%" },
    roomImage: "https://customer-assets.emergentagent.com/job_healing-portal-8/artifacts/v5soysdv_Berkus%20Raum.jpeg",
    description: "In Gesprächen ermögliche ich einen Rahmen, um neue Perspektiven zu eröffnen und eigene (Beziehungs-) Muster zu erkennen. Dabei ist meine Haltung und meine Arbeitsweise vom systemischen Denken geprägt. Dies bedeutet für mich Personen mit ihren Themen nicht isoliert, sondern im Zusammenhang und in Wechselwirkung im Kontext ihres sozialen System zu betrachten. Meine Arbeit ist außerdem von Wertschätzung, Offenheit und Neugier geprägt."
  },
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
    id: "veronika-hartl",
    name: "Veronika Hartl",
    role: "Psychologin (M.Sc.), Psychotherapeutin in Ausbildung",
    category: "Psychotherapie",
    image: "https://customer-assets.emergentagent.com/job_healing-portal-8/artifacts/6j2wt6jk_veronika%20bild.png",
    imageStyle: { objectPosition: "center 15%" },
    roomImage: null,
    description: "Ich konzentriere mich in der Psychotherapie auf eine klassisch tiefenpsychologisch fundierte Vorgehensweise. Die tiefenpsychologisch fundierte Psychotherapie geht davon aus, dass aktuelle Belastungen und wiederkehrende Schwierigkeiten oft mit unbewussten inneren Konflikten und früheren Erfahrungen zusammenhängen. Gemeinsam mit dem Therapeuten werden diese Zusammenhänge im Gespräch verständlich gemacht, um neue Wege im Umgang mit sich selbst und anderen zu entwickeln. Neben der tiefenpsychologisch fundierten Psychotherapie biete ich vor allem psychoonkologische Begleitung und Trauergespräche für Hinterbliebene an."
  },
  {
    id: "daniel-karg",
    name: "Daniel Karg",
    role: "Tiefenpsychologisch fundierter Kinder- und Jugendlichenpsychotherapeut",
    category: "Psychotherapie",
    image: "https://customer-assets.emergentagent.com/job_healing-portal-8/artifacts/hv49vpad_Dani%20bild.jpeg",
    imageStyle: { objectPosition: "center 25%" },
    roomImage: "https://customer-assets.emergentagent.com/job_healing-portal-8/artifacts/0s32f5np_Dani%20raum.jpeg",
    description: "Im Kontakt mit meinen Patienten ist es mir wichtig, Kinder und Jugendliche in ihrer emotionalen Entwicklung zu verstehen und gemeinsam mit ihnen sowie ihren Bezugspersonen Raum für Entwicklung, neue Perspektiven und Lösungswege zu finden. Ich arbeite beziehungsorientiert und mentalisierungsbasiert mit einem tiefen Verständnis für unbewusste seelische Prozesse. Eine vertrauensvolle therapeutische Beziehung ist dabei die Grundlage für jeden Veränderungsprozess.",
    email: "d.karg@aurora-therapiezentrum.de",
    doctolibUrl: "https://www.doctolib.de/kinder-und-jugendlichenpsychotherapeut/augsburg/daniel-karg?utm_campaign=website-button&utm_source=daniel-karg-website-button&utm_medium=referral&utm_content=option-8&utm_term=daniel-karg"
  },
  {
    id: "karin-kraus",
    name: "Karin Kraus",
    role: "Praxis für Traumatherapie",
    category: "Psychotherapie",
    image: "https://customer-assets.emergentagent.com/job_healing-portal-8/artifacts/tog6kz6y_Karin%20Kraus%20Bild.jpg",
    imageStyle: { objectPosition: "70% center" },
    roomImage: null,
    description: "Belastende Erlebnisse und traumatische Erfahrungen können tiefe Narben in der Seele des Menschen hinterlassen und das (Er)Leben und die eigene Entwicklung beeinflussen. In meiner Privatpraxis für Traumatherapie biete ich mit modernen therapeutischen Methoden wie z. B. EMDR einen geschützten Raum, das Erlebte im individuellen Prozess zu verarbeiten. Empathisch begleite ich Menschen in ihrer persönlichen Geschichte und nach ihren Bedürfnissen. Gemeinsam erarbeiten wir Wege zu innerer und äußerer Stärke in einem selbstbestimmten Leben."
  },
  {
    id: "juan-jose-lopez-lamas",
    name: "Juan Jose Lopez Lamas",
    role: "Praxis für systemische Einzel-, Paar und Familientherapie",
    category: "Psychotherapie",
    image: "https://customer-assets.emergentagent.com/job_healing-portal-8/artifacts/1usu5ty6_Juan%20Bild.jpeg",
    imageStyle: { objectPosition: "60% 20%" },
    roomImage: "https://customer-assets.emergentagent.com/job_healing-portal-8/artifacts/v5soysdv_Berkus%20Raum.jpeg",
    description: "In 15 Jahren habe ich in den unterschiedlichsten Kontexten mit Menschen gearbeitet und sie in Ihren Lebenswegen unterstützt. Während und nach meinem Studium habe ich besonders mit Jugendlichen und Familien gearbeitet. Nach meiner Ausbildung zum Systemischen Therapeuten arbeite ich nun auch viel mit Paaren und Eltern. Ich glaube manchmal ist ein neutraler, aber wertschätzender Blick von Außen notwendig um Muster aufzubrechen, Veränderung zu erzeugen oder einfach eine gelassenere Haltung zu entwickeln."
  },
  {
    id: "ulrich-passow",
    name: "Ulrich Passow",
    role: "Praxis für systemische Therapie und Hypnotherapie",
    category: "Psychotherapie",
    image: "https://static.wixstatic.com/media/6f6aae_ea1fa58b7d80438497f59ced07dad5e4~mv2.png/v1/fill/w_344,h_344,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Ulrich%20Passow.png",
    roomImage: "https://customer-assets.emergentagent.com/job_healing-portal-8/artifacts/7rbr0pki_Passow%20Raum.jpeg",
    description: "Private Psychotherapie, insbesondere Einzel-, Paar- und Familientherapie nach systemischem und hypnosystemischem Ansatz.",
    website: "www.psychotherapie-passow.de"
  },
  // COACHING
  {
    id: "elisabeth-berchtold",
    name: "Elisabeth Berchtold",
    role: "Systemisches Business Coaching, Logotherapie & Existenzanalyse",
    category: "Coaching",
    image: "https://customer-assets.emergentagent.com/job_healing-portal-8/artifacts/wy5cqxth_elisabeth.jpeg",
    imageStyle: { objectPosition: "60% 15%" },
    roomImage: null,
    description: "Als Diplompädagogin (Univ.) biete ich Ihnen professionelle Beratung, um berufliche und persönliche Ziele zu erreichen. Ob Sie sich neu orientieren, Ihre Karriere voranbringen oder Krisen bewältigen möchten – ich begleite Sie auf Ihrem Weg mit individuellem Coaching und einem praxistauglichen Entscheidungsmanagement. Meine Coaching-Arbeit basiert dabei auf langjähriger Erfahrung in der systemischen Beratung und einer fundierten Ausbildung in Logotherapie und Existenzanalyse nach V.E. Frankl. Das Herzstück meiner Arbeit ist die Sinnorientierung, die dem Coaching die tiefere Dimension verleiht: Es geht um Veränderungen, die das Handeln langfristig prägen, motivieren und tragen."
  },
  {
    id: "carina-roy",
    name: "Carina Roy",
    role: "Business Coach",
    category: "Coaching",
    image: "https://static.wixstatic.com/media/6f6aae_9344c1f8086d4cd88e53932e7ddf4d3c~mv2.png/v1/fill/w_344,h_344,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Carina_Roy.png",
    roomImage: null,
    description: "Ich begleite Menschen und Teams in ihrem individuellen Entwicklungsprozess. Mein Coaching bietet eine fundierte Analyse, aktiviert Ressourcen und unterstützt dabei, Strategien für nachhaltige Veränderungen zu entwickeln. Mit wirtschaftspsychologischen Methoden hinterfragen wir gewohnte Denkmuster, stärken die Selbstreflexion und eröffnen neue Perspektiven.",
    website: "www.carina-roy.de",
    phone: "+49 151 54809698"
  },
  // PHYSIOTHERAPIE UND OSTEOPATHIE
  {
    id: "michaela-stabenow",
    name: "Michaela Stabenow",
    role: "Heilpraktikerin Physiotherapie und Osteopathie",
    category: "Physiotherapie und Osteopathie",
    image: "https://static.wixstatic.com/media/372f5a_ecd4d8ec06e74ede88ef9eedfb3aaad4~mv2.jpg/v1/crop/x_0,y_44,w_2623,h_2913/fill/w_330,h_367,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Michaela%20Stabenow%20Portrait%20f%C3%BCr%20Internets.jpg",
    roomImage: "https://customer-assets.emergentagent.com/job_healing-portal-8/artifacts/zzgzyjbg_Stanenow%20Raum.png",
    description: "In meiner Privatpraxis für Physiotherapie und Osteopathie behandle ich Erwachsene, Kinder und Säuglinge ganzheitlich und individuell. Mit fundiertem Wissen als Heilpraktikerin und langjähriger Erfahrung verbinde ich klassische physiotherapeutische Ansätze mit osteopathischen Techniken, um die natürliche Balance des Körpers wiederherzustellen. Im Mittelpunkt steht stets der Mensch – mit seiner Geschichte, seinem Körper und seinem Wohlbefinden.",
    website: "www.osteo-stabenow.de",
    phone: "+49 163 7159861"
  },
  // TRADITIONELLE CHINESISCHE MEDIZIN UND AKUPUNKTUR
  {
    id: "lu-heiden",
    name: "Dr. med. Lu Heiden",
    role: "Fachärztin für Viszeralchirurgie, TCM und Akupunktur",
    category: "Traditionelle Chinesische Medizin und Akupunktur",
    image: "https://static.prod-images.emergentagent.com/jobs/f7f34fb4-9cbd-4a54-b020-b946c43fded6/images/f027f781d06aa14f94956d72c474e34ac689fcdd76f62f289176122a45d1d5d9.png",
    roomImage: "https://customer-assets.emergentagent.com/job_healing-portal-8/artifacts/c0c8fss8_Raum%20Lu%20Heiden.png",
    description: `Ich bin Fachärztin für Viszeralchirurgie mit der Zusatzbezeichnung Spezielle Viszeralchirurgie. Nach meinem Medizinstudium an der Ludwig-Maximilians-Universität München war ich von 2011 bis 2022 am Universitätsklinikum Augsburg in der Klinik für Allgemein-, Viszeral- und Transplantationsmedizin tätig.

Neben meiner chirurgischen Arbeit liegt mein zweiter Schwerpunkt in der Traditionellen Chinesischen Medizin und Akupunktur. Am Universitätsklinikum Augsburg habe ich die Akupunktur-Ambulanz der Klinik gegründet und bis 2022 geleitet.

In meiner Praxis begleite ich insbesondere Patientinnen und Patienten mit komplexeren medizinischen Vorgeschichten, bösartigen Vorerkrankungen sowie Polyneuropathie nach Chemotherapie. Seit 2023 bin ich zudem als Oberärztin für Schilddrüsen- und Nebenschilddrüsenchirurgie an der Stadtklinik im Diako tätig.

Mein Ziel ist es, schulmedizinische Erfahrung und Akupunktur sinnvoll miteinander zu verbinden und Beschwerden ganzheitlich zu betrachten.`
  },
  // TIERGESTÜTZTE THERAPIE
  {
    id: "sumi",
    name: "Sumi",
    role: "Therapiehund in Ausbildung",
    category: "Tiergestützte Therapie",
    image: "https://customer-assets.emergentagent.com/job_healing-portal-8/artifacts/91wpal9v_Sumi2.jpeg",
    roomImage: null,
    description: `Hallo, ich bin Sumi!

Ich bin ein kleiner Therapiehund in Ausbildung. Mein Name kommt aus dem Japanischen und bedeutet „Tintenklecks" — passend, oder?

Noch bin ich ein Welpe und lerne jeden Tag ein bisschen mehr über die Welt, über Menschen und darüber, wie ich später in der therapeutischen Arbeit unterstützen kann.

Im Moment besteht meine wichtigste Aufgabe darin, in Ruhe anzukommen, Vertrauen aufzubauen und viele neue Eindrücke kennenzulernen. Ich übe, freundlich zu bleiben, aufmerksam zu sein und zu spüren, wann Nähe guttut — und wann Abstand wichtig ist.

Ab und an seht ihr mich im Rahmen meiner Ausbildung schon in der Praxis. Wenn ihr vorher fragt, dürft ihr mich bestimmt auch schon einmal streicheln und kennenlernen.

Später möchte ich Menschen dabei begleiten, sich sicherer, ruhiger und wohler zu fühlen. Manchmal hilft schon meine Anwesenheit, ein vorsichtiges Schnuppern oder ein gemeinsamer stiller Moment.

Bis dahin wachse ich weiter, lerne fleißig und freue mich über alle Begegnungen, bei denen ich Schritt für Schritt mehr Erfahrung sammeln darf.`
  }
];

const categories = ["Psychotherapie", "Coaching", "Physiotherapie und Osteopathie", "Traditionelle Chinesische Medizin und Akupunktur", "Tiergestützte Therapie"];

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

// Expert Card Component - modernes Karten-Design mit Aufklapp-Funktion
const ExpertCard = ({ expert }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      layout
      data-testid={`expert-card-${expert.id}`}
      className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-shadow duration-300 p-6 sm:p-7 flex flex-col items-center text-center h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Profile Image - responsive, dezenter Ring */}
      <div className="w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 rounded-full overflow-hidden ring-4 ring-[#1a3a4a]/5 shadow-md bg-gray-50 mb-5">
        <img
          src={expert.image}
          alt={expert.name}
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          style={expert.imageStyle || {}}
          loading="lazy"
        />
      </div>

      {/* Name */}
      <h3 className="text-xl sm:text-2xl font-semibold text-[#1a3a4a] mb-1.5">
        {expert.name}
      </h3>

      {/* Role */}
      <p className="text-sm sm:text-base text-gray-500 leading-relaxed mb-5 px-1">
        {expert.role}
      </p>

      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium text-[#0e4a6a] bg-[#0e4a6a]/[0.07] hover:bg-[#0e4a6a]/[0.12] transition-colors cursor-pointer"
        data-testid={`expand-btn-${expert.id}`}
        aria-expanded={isExpanded}
      >
        {isExpanded ? "Weniger anzeigen" : "Mehr erfahren"}
        <motion.span
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="inline-flex"
        >
          <ChevronDown className="w-4 h-4" />
        </motion.span>
      </button>

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
            {expert.roomImage && (
              <div className="mt-6 rounded-2xl overflow-hidden shadow-sm">
                <img
                  src={expert.roomImage}
                  alt={`Praxisraum von ${expert.name}`}
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
              </div>
            )}

            {/* Description */}
            <div className="text-gray-600 text-sm sm:text-base leading-relaxed mt-5 text-left">
              {expert.description.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className={idx > 0 ? 'mt-3' : ''}>
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Contact Links als Pills */}
            <div className="flex flex-wrap justify-center gap-2 mt-5">
              {expert.email && (
                <a
                  href={`mailto:${expert.email}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm text-[#0e4a6a] bg-gray-50 hover:bg-gray-100 transition-colors break-all"
                  data-testid={`email-link-${expert.id}`}
                >
                  <Mail className="w-4 h-4 shrink-0" />
                  {expert.email}
                </a>
              )}
              {expert.website && (
                <a
                  href={`https://${expert.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm text-[#0e4a6a] bg-gray-50 hover:bg-gray-100 transition-colors"
                  data-testid={`website-link-${expert.id}`}
                >
                  <Globe className="w-4 h-4 shrink-0" />
                  {expert.website}
                </a>
              )}
              {expert.phone && (
                <a
                  href={`tel:${expert.phone}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm text-[#0e4a6a] bg-gray-50 hover:bg-gray-100 transition-colors"
                  data-testid={`phone-link-${expert.id}`}
                >
                  <Phone className="w-4 h-4 shrink-0" />
                  {expert.phone}
                </a>
              )}
            </div>

            {/* Doctolib Button */}
            {expert.doctolibUrl && (
              <a
                href={expert.doctolibUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 mt-5 w-full px-6 py-3.5 bg-[#107ACA] text-white font-medium rounded-xl hover:bg-[#0d6ab8] transition-all shadow-sm hover:shadow-md"
                data-testid={`doctolib-link-${expert.id}`}
              >
                <Calendar className="w-5 h-5" />
                <span>Terminbuchung bei Doctolib</span>
              </a>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Main Page Component - Aurora Therapiezentrum
export default function ExpertsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50/60 to-white">
      {/* Navigation/Hero entfernt für iframe-Einbettung */}

      {/* Experts by Category */}
      <section className="py-10 md:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {categories.map((category) => {
            const categoryExperts = expertsData.filter(e => e.category === category);
            if (categoryExperts.length === 0) return null;

            return (
              <div key={category} className="mb-14 md:mb-20">
                {/* Category Header mit Gold-Akzent */}
                <div className="text-center mb-8 md:mb-12">
                  <h2
                    className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1a3a4a]"
                    data-testid={`category-${category.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {category}
                  </h2>
                  <div className="mt-3 mx-auto h-1 w-16 rounded-full bg-[#d4a574]" />
                </div>

                {/* Experts Grid - responsiv, bis 3 Spalten */}
                <div className={`grid gap-6 sm:gap-8 items-stretch ${
                  categoryExperts.length === 1
                    ? 'grid-cols-1 max-w-md mx-auto'
                    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                }`}>
                  {categoryExperts.map((expert) => (
                    <ExpertCard key={expert.id} expert={expert} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
