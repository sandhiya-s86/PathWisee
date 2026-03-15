import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, GraduationCap, Sparkles, BookOpen, Target, CheckCircle, Code, Stethoscope, Scale, Briefcase, Palette, Building2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Navbar } from '../components/Navbar';

const careerCategories = [
  { icon: Code, title: "Engineering & Tech", description: "Software, Data Science, AI/ML", color: "from-blue-500 to-cyan-500" },
  { icon: Stethoscope, title: "Medical & Healthcare", description: "Doctor, Surgeon, Researcher", color: "from-red-500 to-pink-500" },
  { icon: Briefcase, title: "Business & Management", description: "MBA, CA, Finance", color: "from-purple-500 to-indigo-500" },
  { icon: Scale, title: "Law & Legal", description: "Lawyer, Judge, Legal Advisor", color: "from-amber-500 to-orange-500" },
  { icon: Palette, title: "Design & Creative", description: "Architecture, UI/UX, Graphics", color: "from-pink-500 to-rose-500" },
  { icon: Building2, title: "Government Services", description: "IAS, IPS, Civil Services", color: "from-green-500 to-emerald-500" }
];

const roadmapSteps = [
  { number: 1, title: "Take Assessment", description: "Discover your interests and strengths through our personalized assessment" },
  { number: 2, title: "Get Recommendations", description: "Receive career suggestions tailored to Indian education system" },
  { number: 3, title: "Explore Roadmaps", description: "View detailed step-by-step paths with exams, colleges, and timelines" },
  { number: 4, title: "Track Progress", description: "Monitor your journey and achieve career readiness milestones" }
];

export default function Landing() {
  const { user } = useAuth();
  const { isDark } = useTheme();

  const cardBg = isDark ? 'bg-white/5 backdrop-blur-xl border-white/10' : 'bg-white/70 backdrop-blur-md border-slate-200/50';
  const textPrimary = isDark ? 'text-white' : 'text-slate-900';
  const textSecondary = isDark ? 'text-slate-300' : 'text-slate-600';

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-32" data-testid="hero-section">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-8">
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${isDark ? 'bg-indigo-500/20 text-indigo-300' : 'bg-blue-100 text-blue-700'}`}>
                <Sparkles className="h-4 w-4" />
                India's #1 Career Guidance Platform
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className={`text-5xl md:text-7xl font-bold font-outfit leading-tight ${textPrimary}`}>
                Your Career,
                <span className="block mt-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
                  Your Future
                </span>
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className={`text-lg md:text-xl leading-relaxed max-w-2xl ${textSecondary}`}>
                Navigate your career journey with personalized guidance, entrance exam insights,
                and roadmaps designed for Indian students from 10th to graduation.
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex flex-wrap gap-4">
                <Link to={user ? "/dashboard" : "/signup"}>
                  <Button size="lg" className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-8 py-6 text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105" data-testid="hero-cta-btn">
                    {user ? "Go to Dashboard" : "Start Your Journey"}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to={user ? "/careers" : "/login"}>
                  <Button size="lg" variant="outline"
                    className={`rounded-full border-2 px-8 py-6 text-lg font-bold transition-all duration-300 ${isDark ? 'border-white/20 text-white hover:bg-white/10 hover:border-white/40' : 'border-slate-300 hover:border-blue-500 hover:bg-blue-50'}`}
                    data-testid="explore-careers-btn">
                    Explore Careers
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6, duration: 0.8 }} className="relative hidden lg:block">
              <div className="relative">
                <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop" alt="Students studying" className="rounded-3xl shadow-2xl" />
                <div className={`absolute -bottom-6 -left-6 rounded-2xl shadow-xl p-6 max-w-xs ${isDark ? 'bg-slate-800/90 backdrop-blur-xl border border-white/10' : 'bg-white'}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-green-400" />
                    </div>
                    <div>
                      <p className={`font-bold ${textPrimary}`}>50,000+ Students</p>
                      <p className={`text-sm ${textSecondary}`}>Found their dream career</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Career Categories */}
      <section className="py-24" data-testid="career-categories">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold font-outfit mb-4 ${textPrimary}`}>Explore Career Fields</h2>
            <p className={`text-lg max-w-2xl mx-auto ${textSecondary}`}>Choose from diverse career paths aligned with Indian education streams</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {careerCategories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <motion.div key={category.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }} whileHover={{ y: -8, transition: { duration: 0.2 } }} className="group">
                  <Link to={user ? "/careers" : "/login"}>
                    <div className={`relative rounded-2xl border p-8 hover:shadow-2xl transition-all duration-300 h-full ${cardBg}`}>
                      <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
                      <div className={`relative w-14 h-14 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="h-7 w-7 text-white" />
                      </div>
                      <h3 className={`text-xl font-bold font-outfit mb-3 ${textPrimary}`}>{category.title}</h3>
                      <p className={`leading-relaxed mb-4 ${textSecondary}`}>{category.description}</p>
                      <div className={`flex items-center font-medium group-hover:gap-2 transition-all ${isDark ? 'text-indigo-400' : 'text-blue-600'}`}>
                        Explore <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="py-24" data-testid="roadmap-preview">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold font-outfit mb-4 ${textPrimary}`}>Your Journey to Success</h2>
            <p className={`text-lg max-w-2xl mx-auto ${textSecondary}`}>Follow our proven 4-step process designed for Indian students</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {roadmapSteps.map((step, index) => (
              <motion.div key={step.number} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: index * 0.15 }} className="relative">
                <div className={`rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 h-full border ${cardBg}`}>
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center mb-6 shadow-lg">
                    <span className="text-2xl font-bold text-white">{step.number}</span>
                  </div>
                  <h3 className={`text-xl font-bold font-outfit mb-3 ${textPrimary}`}>{step.title}</h3>
                  <p className={`leading-relaxed ${textSecondary}`}>{step.description}</p>
                </div>
                {index < roadmapSteps.length - 1 && (
                  <div className={`hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 ${isDark ? 'bg-indigo-500/40' : 'bg-blue-400/40'}`}></div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20" data-testid="cta-section">
        <div className="max-w-4xl mx-auto px-4 md:px-8 lg:px-12">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center rounded-3xl p-12 md:p-16 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-2xl">
            <h2 className="text-4xl md:text-5xl font-bold font-outfit text-white mb-6">Ready to Find Your Perfect Career?</h2>
            <p className="text-lg md:text-xl text-blue-100 mb-10">Join thousands of Indian students making informed career decisions</p>
            <Link to={user ? "/dashboard" : "/signup"}>
              <Button size="lg" className="rounded-full bg-white text-blue-600 hover:bg-slate-50 px-10 py-7 text-xl font-bold shadow-2xl hover:scale-105 transition-all duration-300" data-testid="cta-bottom-btn">
                Get Started Free <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-12 border-t ${isDark ? 'border-white/5' : 'border-slate-200/50'}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GraduationCap className={`h-8 w-8 ${isDark ? 'text-indigo-400' : 'text-blue-600'}`} />
              <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>PATHWISE</span>
            </div>
            <p className={`text-sm ${textSecondary}`}>&copy; 2025 PATHWISE. Empowering Indian students.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
