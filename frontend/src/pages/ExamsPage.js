import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
import { Navbar } from '../components/Navbar';
import { motion } from 'framer-motion';
import { FileText, Search, Calendar, Users, BarChart3, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL || ''}/api`;

const categoryFilters = ['All', 'Engineering', 'Medical', 'Management', 'Law', 'Government'];

export default function ExamsPage() {
  const { token } = useAuth();
  const { isDark } = useTheme();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  useEffect(() => { loadExams(); }, []);

  const loadExams = async () => {
    try {
      const res = await axios.get(`${API}/exams`, { headers: { Authorization: `Bearer ${token}` } });
      setExams(res.data);
    } catch { toast.error('Failed to load exams'); }
    finally { setLoading(false); }
  };

  const filtered = exams.filter(e => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) || (e.full_name || '').toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === 'All' || (e.category || '').toLowerCase() === categoryFilter.toLowerCase();
    return matchSearch && matchCat;
  });

  const cardBg = isDark ? 'bg-white/5 backdrop-blur-xl border-white/10' : 'bg-white/70 backdrop-blur-md border-slate-200/50';
  const textPrimary = isDark ? 'text-white' : 'text-slate-900';
  const textSecondary = isDark ? 'text-slate-300' : 'text-slate-600';

  const getDifficultyColor = (d) => {
    if (!d) return isDark ? 'text-slate-400' : 'text-slate-500';
    const dl = d.toLowerCase();
    if (dl.includes('very hard') || dl.includes('extreme')) return 'text-red-400';
    if (dl.includes('hard')) return 'text-orange-400';
    if (dl.includes('moderate')) return 'text-amber-400';
    return 'text-green-400';
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div></div>;

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10" data-testid="exams-header">
          <h1 className={`text-4xl md:text-5xl font-bold font-outfit mb-4 ${textPrimary}`}>
            Indian <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Entrance Exams</span>
          </h1>
          <p className={`text-lg max-w-2xl mx-auto ${textSecondary}`}>Explore all major entrance exams for Indian students - JEE, NEET, CAT, CLAT & more</p>
        </motion.div>

        {/* Filters */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className={`rounded-2xl border p-6 mb-8 ${cardBg}`} data-testid="exams-filters">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${textSecondary}`} />
              <input type="text" placeholder="Search exams..." value={search} onChange={e => setSearch(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm ${isDark ? 'bg-white/5 border-white/10 text-white placeholder:text-slate-500' : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400'} focus:outline-none focus:ring-2 focus:ring-indigo-500/50`}
                data-testid="exams-search" />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {categoryFilters.map(f => (
                <button key={f} onClick={() => setCategoryFilter(f)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${categoryFilter === f ? 'bg-blue-500 text-white' : isDark ? 'bg-white/10 text-slate-300 hover:bg-white/20' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                  data-testid={`filter-cat-${f}`}>{f}</button>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {filtered.map((exam, index) => (
            <motion.div key={exam.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
              <div className={`rounded-2xl border p-6 hover:shadow-xl transition-all duration-300 h-full ${cardBg}`} data-testid={`exam-card-${exam.id}`}>
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-xl font-bold font-outfit ${textPrimary}`}>{exam.name}</h3>
                    <p className={`text-sm ${textSecondary}`}>{exam.full_name}</p>
                  </div>
                </div>

                {exam.category && (
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 ${isDark ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>{exam.category}</span>
                )}

                <div className="space-y-2 mb-4">
                  {exam.conducting_body && (
                    <div className={`flex items-center gap-2 text-sm ${textSecondary}`}>
                      <Users className="h-3.5 w-3.5 flex-shrink-0" /><span>Conducted by: {exam.conducting_body}</span>
                    </div>
                  )}
                  {exam.eligibility && (
                    <div className={`flex items-start gap-2 text-sm ${textSecondary}`}>
                      <BookOpen className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" /><span>Eligibility: {exam.eligibility}</span>
                    </div>
                  )}
                  {exam.difficulty && (
                    <div className="flex items-center gap-2 text-sm">
                      <BarChart3 className={`h-3.5 w-3.5 ${getDifficultyColor(exam.difficulty)}`} />
                      <span className={getDifficultyColor(exam.difficulty)}>Difficulty: {exam.difficulty}</span>
                    </div>
                  )}
                </div>

                {exam.subjects && exam.subjects.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {exam.subjects.map((s, i) => (
                      <span key={i} className={`px-2 py-0.5 rounded-full text-xs ${isDark ? 'bg-white/10 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>{s}</span>
                    ))}
                  </div>
                )}

                {exam.top_colleges && exam.top_colleges.length > 0 && (
                  <div className={`mt-4 pt-4 border-t ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
                    <p className={`text-xs font-medium mb-1 ${textSecondary}`}>Top Colleges:</p>
                    <p className={`text-sm ${textPrimary}`}>{exam.top_colleges.slice(0, 3).join(', ')}</p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && <div className={`text-center py-16 ${textSecondary}`}><p className="text-lg">No exams found matching your search.</p></div>}
      </div>
    </div>
  );
}
