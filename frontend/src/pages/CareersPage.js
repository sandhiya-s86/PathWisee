import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/ui/button';
import { motion } from 'framer-motion';
import { Code, Stethoscope, Scale, Briefcase, Palette, Building2, Shield, BarChart3, Layers, TrendingUp, ArrowRight, Search, Filter } from 'lucide-react';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const iconMap = {
  Code, BarChart3, Layers, Palette, TrendingUp, Briefcase, Shield,
  Stethoscope, Scale, Building2
};

const streamFilters = ['All', 'Science', 'Commerce', 'Arts', 'Any'];
const stageFilters = ['All', '10th', '12th', 'Graduation', 'Post-Graduation'];

export default function CareersPage() {
  const { token } = useAuth();
  const { isDark } = useTheme();
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [streamFilter, setStreamFilter] = useState('All');
  const [stageFilter, setStageFilter] = useState('All');

  useEffect(() => { loadCareers(); }, []);

  const loadCareers = async () => {
    try {
      const response = await axios.get(`${API}/careers`, { headers: { Authorization: `Bearer ${token}` } });
      setCareers(response.data);
    } catch { toast.error('Failed to load careers'); }
    finally { setLoading(false); }
  };

  const filtered = careers.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase());
    const matchStream = streamFilter === 'All' || (c.streams && c.streams.includes(streamFilter));
    const matchStage = stageFilter === 'All' || (c.academic_stages && c.academic_stages.includes(stageFilter));
    return matchSearch && matchStream && matchStage;
  });

  const cardBg = isDark ? 'bg-white/5 backdrop-blur-xl border-white/10' : 'bg-white/70 backdrop-blur-md border-slate-200/50';
  const textPrimary = isDark ? 'text-white' : 'text-slate-900';
  const textSecondary = isDark ? 'text-slate-300' : 'text-slate-600';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10" data-testid="careers-header">
          <h1 className={`text-4xl md:text-5xl font-bold font-outfit mb-4 ${textPrimary}`}>
            Explore <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Career Paths</span>
          </h1>
          <p className={`text-lg max-w-2xl mx-auto ${textSecondary}`}>Browse India-focused careers with entrance exams, colleges, and roadmaps</p>
        </motion.div>

        {/* Filters */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className={`rounded-2xl border p-6 mb-8 ${cardBg}`} data-testid="careers-filters">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${textSecondary}`} />
              <input
                type="text" placeholder="Search careers..." value={search} onChange={e => setSearch(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm ${isDark ? 'bg-white/5 border-white/10 text-white placeholder:text-slate-500' : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400'} focus:outline-none focus:ring-2 focus:ring-indigo-500/50`}
                data-testid="careers-search"
              />
            </div>
            <div className="flex gap-2 items-center flex-wrap">
              <Filter className={`h-4 w-4 ${textSecondary}`} />
              <div className="flex gap-1.5 flex-wrap">
                {streamFilters.map(f => (
                  <button key={f} onClick={() => setStreamFilter(f)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${streamFilter === f ? 'bg-indigo-500 text-white' : isDark ? 'bg-white/10 text-slate-300 hover:bg-white/20' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    data-testid={`filter-stream-${f}`}>{f}</button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-1.5 mt-3 flex-wrap">
            {stageFilters.map(f => (
              <button key={f} onClick={() => setStageFilter(f)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${stageFilter === f ? 'bg-purple-500 text-white' : isDark ? 'bg-white/10 text-slate-300 hover:bg-white/20' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                data-testid={`filter-stage-${f}`}>{f}</button>
            ))}
          </div>
        </motion.div>

        {/* Careers Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((career, index) => {
            const IconComponent = iconMap[career.icon] || Code;
            return (
              <motion.div key={career.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }} whileHover={{ y: -4 }} className="group">
                <div className={`rounded-2xl border p-8 hover:shadow-xl transition-all duration-300 h-full ${cardBg}`} data-testid={`career-card-${career.id}`}>
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="h-7 w-7 text-white" />
                  </div>
                  <h3 className={`text-xl font-bold font-outfit mb-2 ${textPrimary}`}>{career.name}</h3>
                  <p className={`text-sm mb-4 leading-relaxed ${textSecondary}`}>{career.description}</p>
                  <div className="mb-4">
                    <div className={`text-xs ${textSecondary}`}>Salary Range</div>
                    <div className="text-base font-bold text-emerald-400">{career.salary_range}</div>
                  </div>
                  {career.streams && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {career.streams.map(s => (
                        <span key={s} className={`px-2 py-0.5 rounded-full text-xs ${isDark ? 'bg-indigo-500/20 text-indigo-300' : 'bg-indigo-100 text-indigo-700'}`}>{s}</span>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-3">
                    <Link to={`/career/${career.id}`} className="flex-1">
                      <Button variant="outline" className={`w-full rounded-full text-sm ${isDark ? 'border-white/20 text-white hover:bg-white/10' : ''}`} data-testid={`view-details-${career.id}`}>
                        Details
                      </Button>
                    </Link>
                    <Link to={`/learning-path/${career.id}`}>
                      <Button className="rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700" data-testid={`view-path-${career.id}`}>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className={`text-center py-16 ${textSecondary}`}>
            <p className="text-lg">No careers found matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
