import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { GraduationCap, Mail, Lock, User, Award } from 'lucide-react';
import { toast } from 'sonner';

export default function Signup() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', academic_stage: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(formData.name, formData.email, formData.password, formData.academic_stage);
      toast.success('Welcome to PATHWISE!');
      navigate('/dashboard');
    } catch (error) { toast.error(error.response?.data?.detail || 'Registration failed'); }
    finally { setLoading(false); }
  };

  const cardBg = isDark
    ? 'bg-white/5 backdrop-blur-xl border border-white/10'
    : 'bg-white/60 backdrop-blur-xl border border-slate-200/50 shadow-xl';
  const textPrimary = isDark ? 'text-white' : 'text-slate-900';
  const textSecondary = isDark ? 'text-white/60' : 'text-slate-500';
  const inputClass = isDark ? 'auth-input' : 'bg-white border-slate-200 text-slate-900 h-12 rounded-xl focus:ring-2 focus:ring-indigo-500/50';
  const labelClass = isDark ? 'text-white/80' : 'text-slate-700';

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
            <GraduationCap className={`h-10 w-10 ${isDark ? 'text-indigo-400' : 'text-indigo-600'} group-hover:scale-110 transition-transform duration-300`} />
            <span className={`text-3xl font-outfit font-bold ${isDark ? 'text-white' : 'bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent'}`}>PATHWISE</span>
          </Link>
          <h1 className={`text-4xl font-bold font-outfit mb-3 ${textPrimary}`}>Create Your Account</h1>
          <p className={`text-lg ${textSecondary}`}>Start your journey to the perfect career</p>
        </div>
        <div className={`rounded-2xl p-8 ${cardBg}`} data-testid="signup-form">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="name" className={`flex items-center gap-2 mb-2 ${labelClass}`}><User className="h-4 w-4" />Full Name</Label>
              <Input id="name" type="text" placeholder="Your Name" required value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={inputClass} data-testid="signup-name-input" />
            </div>
            <div>
              <Label htmlFor="email" className={`flex items-center gap-2 mb-2 ${labelClass}`}><Mail className="h-4 w-4" />Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" required value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={inputClass} data-testid="signup-email-input" />
            </div>
            <div>
              <Label htmlFor="password" className={`flex items-center gap-2 mb-2 ${labelClass}`}><Lock className="h-4 w-4" />Password</Label>
              <Input id="password" type="password" placeholder="Password" required value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })} className={inputClass} data-testid="signup-password-input" />
            </div>
            <div>
              <Label htmlFor="academic_stage" className={`flex items-center gap-2 mb-2 ${labelClass}`}><Award className="h-4 w-4" />Current Grade/Year (Optional)</Label>
              <Input id="academic_stage" type="text" placeholder="e.g., 12th Grade, 2nd Year College" value={formData.academic_stage}
                onChange={(e) => setFormData({ ...formData, academic_stage: e.target.value })} className={inputClass} data-testid="signup-grade-input" />
            </div>
            <Button type="submit" disabled={loading}
              className="w-full rounded-full h-12 text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-xl"
              data-testid="signup-submit-btn">
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <p className={textSecondary}>
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors" data-testid="signup-login-link">Log In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
