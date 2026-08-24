import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/ui/button';
import { motion } from 'framer-motion';
import { CheckCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL || ''}/api`;

export default function LearningPath() {
  const { careerId } = useParams();
  const { user, token } = useAuth();
  const { isDark } = useTheme();
  const [roadmap, setRoadmap] = useState(null);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, [careerId]);

  const loadData = async () => {
    try {
      const [roadmapRes, progressRes] = await Promise.all([
        axios.get(`${API}/careers/${careerId}/roadmap`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/progress/${user.id}`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setRoadmap(roadmapRes.data);
      const cp = progressRes.data.find(p => p.career_id === careerId);
      setProgress(cp?.completed_milestones || []);
    } catch { toast.error('Failed to load learning path'); }
    finally { setLoading(false); }
  };

  const handleComplete = async (milestoneId) => {
    try {
      await axios.post(`${API}/progress/update`, { user_id: user.id, career_id: careerId, milestone_id: milestoneId }, { headers: { Authorization: `Bearer ${token}` } });
      setProgress([...progress, milestoneId]);
      toast.success('Milestone completed!');
    } catch { toast.error('Failed to update progress'); }
  };

  const cardBg = isDark ? 'bg-white/5 backdrop-blur-xl border-white/10' : 'bg-white/70 backdrop-blur-md border-slate-200/50';
  const textPrimary = isDark ? 'text-white' : 'text-slate-900';
  const textSecondary = isDark ? 'text-slate-300' : 'text-slate-600';

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div></div>;

  if (!roadmap || !roadmap.steps) return (
    <div className="min-h-screen"><Navbar /><div className={`max-w-4xl mx-auto px-4 py-12 text-center ${textSecondary}`}><p>Learning path not found for this career. Roadmap data may not be available yet.</p></div></div>
  );

  const steps = roadmap.steps;
  const completedCount = progress.length;
  const totalCount = steps.length;
  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl border p-8 mb-8 ${cardBg}`} data-testid="learning-path-header">
          <h1 className={`text-3xl md:text-4xl font-bold font-outfit mb-4 ${textPrimary}`}>
            Learning Path: <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">{roadmap.title || careerId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
          </h1>
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className={textSecondary}>{completedCount} of {totalCount} steps completed</span>
              <span className="font-bold text-indigo-400">{pct}%</span>
            </div>
            <div className={`h-3 rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-slate-200'}`}>
              <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000" style={{ width: `${pct}%` }} data-testid="progress-bar"></div>
            </div>
          </div>
        </motion.div>

        <div className="space-y-4" data-testid="milestones-list">
          {steps.map((step, index) => {
            const stepId = step.id || `step-${index}`;
            const isCompleted = progress.includes(stepId);
            return (
              <motion.div key={stepId} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
                className={`rounded-2xl border hover:shadow-xl transition-all duration-300 overflow-hidden ${cardBg}`} data-testid={`milestone-${stepId}`}>
                <div className="p-6 md:p-8">
                  <div className="flex items-start gap-5">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${isCompleted ? 'bg-emerald-500 text-white' : 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white'}`}>
                      {isCompleted ? <CheckCircle className="h-6 w-6" /> : <span>{index + 1}</span>}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className={`text-xl font-bold font-outfit ${textPrimary}`}>{step.title}</h3>
                        {isCompleted && <span className={`px-3 py-1 rounded-full text-xs font-medium ${isDark ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-100 text-emerald-700'}`}>Completed</span>}
                      </div>
                      <p className={`text-sm ${textSecondary}`}>{step.description}</p>
                      {step.duration && <div className={`flex items-center gap-1 text-xs mt-2 ${textSecondary}`}><Clock className="h-3 w-3" />{step.duration}</div>}
                    </div>
                    <div className="flex-shrink-0">
                      {isCompleted ? (
                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center"><CheckCircle className="h-5 w-5 text-emerald-400" /></div>
                      ) : (
                        <Button onClick={() => handleComplete(stepId)} size="sm" className="rounded-full bg-gradient-to-r from-indigo-600 to-purple-600" data-testid={`complete-btn-${stepId}`}>
                          Complete
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
