import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, IndianRupee, BookOpen, Award, GraduationCap, Building2, FileText, Clock, MapPin } from 'lucide-react';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function CareerDetail() {
  const { careerId } = useParams();
  const { token } = useAuth();
  const { isDark } = useTheme();
  const [career, setCareer] = useState(null);
  const [exams, setExams] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, [careerId]);

  const loadData = async () => {
    try {
      const [careerRes, examsRes, collegesRes, roadmapRes] = await Promise.all([
        axios.get(`${API}/careers/${careerId}`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/careers/${careerId}/exams`, { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: [] })),
        axios.get(`${API}/careers/${careerId}/colleges`, { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: [] })),
        axios.get(`${API}/careers/${careerId}/roadmap`, { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: null }))
      ]);
      setCareer(careerRes.data);
      setExams(examsRes.data);
      setColleges(collegesRes.data);
      setRoadmap(roadmapRes.data);
    } catch { toast.error('Failed to load career details'); }
    finally { setLoading(false); }
  };

  const cardBg = isDark ? 'bg-white/5 backdrop-blur-xl border-white/10' : 'bg-white/70 backdrop-blur-md border-slate-200/50';
  const textPrimary = isDark ? 'text-white' : 'text-slate-900';
  const textSecondary = isDark ? 'text-slate-300' : 'text-slate-600';

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div></div>;

  if (!career) return (
    <div className="min-h-screen"><Navbar /><div className={`max-w-4xl mx-auto px-4 py-12 text-center ${textSecondary}`}><p className="mb-6">Career not found</p><Link to="/careers"><Button className="rounded-full">Back to Careers</Button></Link></div></div>
  );

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 text-white p-8 md:p-12 mb-8 shadow-2xl" data-testid="career-header">
          <h1 className="text-4xl md:text-5xl font-bold font-outfit mb-4">{career.name}</h1>
          <p className="text-lg text-white/80 mb-6">{career.description}</p>
          <div className="flex flex-wrap gap-3">
            {career.streams?.map(s => (
              <span key={s} className="px-3 py-1 rounded-full bg-white/20 text-sm font-medium">{s}</span>
            ))}
            {career.academic_stages?.map(s => (
              <span key={s} className="px-3 py-1 rounded-full bg-white/10 text-sm">{s}</span>
            ))}
          </div>
        </motion.div>

        {/* Info Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className={`rounded-2xl border p-6 ${cardBg}`} data-testid="salary-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center"><IndianRupee className="h-5 w-5 text-emerald-400" /></div>
              <h3 className={`text-lg font-bold font-outfit ${textPrimary}`}>Salary Range</h3>
            </div>
            <p className="text-2xl font-bold text-emerald-400">{career.salary_range}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className={`rounded-2xl border p-6 ${cardBg}`} data-testid="education-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center"><BookOpen className="h-5 w-5 text-indigo-400" /></div>
              <h3 className={`text-lg font-bold font-outfit ${textPrimary}`}>Education Required</h3>
            </div>
            <p className={textSecondary}>{career.education_required || career.education || 'N/A'}</p>
          </motion.div>
        </div>

        {/* Skills */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className={`rounded-2xl border p-8 mb-8 ${cardBg}`} data-testid="skills-section">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center"><Award className="h-6 w-6 text-amber-400" /></div>
            <h2 className={`text-2xl font-bold font-outfit ${textPrimary}`}>Key Skills Required</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {(career.skills_required || career.skills || []).map((skill, i) => (
              <span key={i} className={`px-4 py-2 rounded-full font-medium text-sm ${isDark ? 'bg-indigo-500/20 text-indigo-300' : 'bg-indigo-100 text-indigo-700'}`} data-testid={`skill-${i}`}>{skill}</span>
            ))}
          </div>
        </motion.div>

        {/* Entrance Exams */}
        {exams.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className={`rounded-2xl border p-8 mb-8 ${cardBg}`} data-testid="exams-section">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center"><FileText className="h-6 w-6 text-blue-400" /></div>
              <h2 className={`text-2xl font-bold font-outfit ${textPrimary}`}>Entrance Exams</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {exams.map(exam => (
                <div key={exam.id} className={`rounded-xl border p-5 ${isDark ? 'bg-white/3 border-white/5' : 'bg-white/50 border-slate-100'}`} data-testid={`exam-${exam.id}`}>
                  <h4 className={`font-bold font-outfit mb-1 ${textPrimary}`}>{exam.name}</h4>
                  <p className={`text-sm mb-2 ${textSecondary}`}>{exam.full_name}</p>
                  <div className={`text-xs ${textSecondary}`}>
                    <span>Conducting Body: {exam.conducting_body}</span>
                    {exam.difficulty && <span className="ml-3">Difficulty: {exam.difficulty}</span>}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Top Colleges */}
        {colleges.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className={`rounded-2xl border p-8 mb-8 ${cardBg}`} data-testid="colleges-section">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center"><Building2 className="h-6 w-6 text-purple-400" /></div>
              <h2 className={`text-2xl font-bold font-outfit ${textPrimary}`}>Top Colleges</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {colleges.map(college => (
                <div key={college.id} className={`rounded-xl border p-5 ${isDark ? 'bg-white/3 border-white/5' : 'bg-white/50 border-slate-100'}`} data-testid={`college-${college.id}`}>
                  <h4 className={`font-bold font-outfit mb-1 ${textPrimary}`}>{college.name}</h4>
                  <div className={`flex items-center gap-1 text-sm ${textSecondary}`}>
                    <MapPin className="h-3 w-3" />
                    {college.location?.city}, {college.location?.state}
                  </div>
                  {college.fees_range && <p className="text-sm text-emerald-400 mt-1">{college.fees_range}</p>}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Roadmap */}
        {roadmap && roadmap.steps && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            className={`rounded-2xl border p-8 mb-8 ${cardBg}`} data-testid="roadmap-section">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center"><GraduationCap className="h-6 w-6 text-cyan-400" /></div>
              <h2 className={`text-2xl font-bold font-outfit ${textPrimary}`}>Career Roadmap</h2>
            </div>
            <div className="space-y-4">
              {roadmap.steps.map((step, i) => (
                <div key={i} className={`flex gap-4 p-4 rounded-xl ${isDark ? 'bg-white/3' : 'bg-white/50'}`} data-testid={`roadmap-step-${i}`}>
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">{i + 1}</div>
                  <div>
                    <h4 className={`font-bold font-outfit ${textPrimary}`}>{step.title}</h4>
                    <p className={`text-sm ${textSecondary}`}>{step.description}</p>
                    {step.duration && (
                      <div className={`flex items-center gap-1 mt-1 text-xs ${textSecondary}`}><Clock className="h-3 w-3" />{step.duration}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-center text-white" data-testid="cta-section">
          <h3 className="text-2xl font-bold font-outfit mb-4">Ready to Start This Career Path?</h3>
          <p className="text-white/70 mb-6">Follow our curated learning roadmap to become job-ready</p>
          <Link to={`/learning-path/${career.id}`}>
            <Button size="lg" className="rounded-full bg-white text-indigo-600 hover:bg-slate-100 font-bold" data-testid="view-learning-path-btn">
              View Learning Path <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
