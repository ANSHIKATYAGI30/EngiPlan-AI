
import React, { useState, useEffect } from 'react';
import { Theme, StudentProfile, Subject, StudyAvailability, StudyPlan, CognitiveLoad } from './types';
import { ThemeToggle } from './components/ThemeToggle';
import { generateStudyPlan } from './services/geminiService';
import { ProgressCharts } from './components/ProgressCharts';

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>('light');
  const [step, setStep] = useState<'profile' | 'subjects' | 'availability' | 'loading' | 'dashboard'>('profile');
  const [loadingMsg, setLoadingMsg] = useState('Analyzing your curriculum...');
  
  // Form States
  const [profile, setProfile] = useState<StudentProfile>({
    name: '', college: '', branch: '', graduationYear: '2026', email: ''
  });
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [availability, setAvailability] = useState<StudyAvailability>({
    weekdayHours: 4, weekendHours: 6, preferredTime: 'morning'
  });
  const [targetDate, setTargetDate] = useState<string>('');
  const [plan, setPlan] = useState<StudyPlan | null>(null);

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  const addSubject = () => {
    const newSub: Subject = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      credits: 3,
      strongTopics: '',
      weakTopics: '',
      confidence: 3
    };
    setSubjects([...subjects, newSub]);
  };

  const updateSubject = (id: string, field: keyof Subject, value: any) => {
    setSubjects(subjects.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const removeSubject = (id: string) => {
    setSubjects(subjects.filter(s => s.id !== id));
  };

  const handleSubmit = async () => {
    setStep('loading');
    const msgs = [
      "Identifying high-credit bottlenecks...",
      "Mapping prerequisite dependencies...",
      "Optimizing cognitive load distribution...",
      "Integrating buffer for engineering burnout prevention...",
      "Almost there! Polishing your routine..."
    ];
    let msgIdx = 0;
    const interval = setInterval(() => {
      msgIdx = (msgIdx + 1) % msgs.length;
      setLoadingMsg(msgs[msgIdx]);
    }, 2500);

    try {
      const result = await generateStudyPlan(profile, subjects, availability, targetDate);
      setPlan(result);
      setStep('dashboard');
    } catch (err) {
      alert("Something went wrong. Please try again.");
      setStep('availability');
    } finally {
      clearInterval(interval);
    }
  };

  const getLoadColor = (load: string) => {
    switch (load) {
      case 'High': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      case 'Medium': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'Low': return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'Buffer': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      default: return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">E</span>
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
              EngiPlan AI
            </span>
          </div>
          <div className="flex items-center space-x-4">
            {step === 'dashboard' && (
              <button 
                onClick={() => setStep('profile')}
                className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600"
              >
                Reset
              </button>
            )}
            <ThemeToggle theme={theme} setTheme={setTheme} />
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {step === 'profile' && (
          <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Welcome, future engineer</h1>
              <p className="text-slate-600 dark:text-slate-400 text-lg">Let's build a study plan that actually works with your technical load.</p>
            </div>
            
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-1.5 opacity-80">Full Name</label>
                  <input 
                    type="text" 
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    placeholder="Enter your name" 
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 opacity-80">Email Address</label>
                  <input 
                    type="email" 
                    value={profile.email}
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                    placeholder="student@college.edu" 
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1.5 opacity-80">College Name</label>
                  <input 
                    type="text" 
                    value={profile.college}
                    onChange={(e) => setProfile({...profile, college: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 opacity-80">Engineering Branch</label>
                  <input 
                    type="text" 
                    value={profile.branch}
                    onChange={(e) => setProfile({...profile, branch: e.target.value})}
                    placeholder="e.g. Mechanical, CS"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 opacity-80">Graduation Year</label>
                  <select 
                    value={profile.graduationYear}
                    onChange={(e) => setProfile({...profile, graduationYear: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    {['2024', '2025', '2026', '2027', '2028'].map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>
              <button 
                disabled={!profile.name || !profile.branch}
                onClick={() => setStep('subjects')}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-500/20 active:scale-95"
              >
                Continue to Subjects
              </button>
            </div>
          </div>
        )}

        {step === 'subjects' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold">Your Subjects</h2>
                <p className="text-slate-500 dark:text-slate-400">Add the subjects you're tackling this semester.</p>
              </div>
              <button 
                onClick={addSubject}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-800 rounded-xl hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors flex items-center space-x-2"
              >
                <span>Add Subject</span>
                <span className="text-xl leading-none">+</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {subjects.map((sub) => (
                <div key={sub.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4 relative group">
                  <button 
                    onClick={() => removeSubject(sub.id)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Remove
                  </button>
                  <div>
                    <input 
                      type="text" 
                      placeholder="Subject Name (e.g. Thermodynamics)"
                      value={sub.name}
                      onChange={(e) => updateSubject(sub.id, 'name', e.target.value)}
                      className="w-full text-lg font-bold bg-transparent outline-none placeholder:text-slate-300 dark:placeholder:text-slate-600"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs uppercase font-bold text-slate-400">Credits</label>
                      <input 
                        type="number" 
                        min="1" max="10"
                        value={sub.credits}
                        onChange={(e) => updateSubject(sub.id, 'credits', parseInt(e.target.value))}
                        className="w-full bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg border border-slate-100 dark:border-slate-700"
                      />
                    </div>
                    <div>
                      <label className="text-xs uppercase font-bold text-slate-400">Confidence (1-5)</label>
                      <input 
                        type="range" 
                        min="1" max="5"
                        value={sub.confidence}
                        onChange={(e) => updateSubject(sub.id, 'confidence', parseInt(e.target.value))}
                        className="w-full mt-2 accent-blue-600"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs uppercase font-bold text-slate-400">Weak Areas (Prerequisites)</label>
                    <textarea 
                      placeholder="Topics you struggle with..."
                      value={sub.weakTopics}
                      onChange={(e) => updateSubject(sub.id, 'weakTopics', e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700 text-sm mt-1"
                    />
                  </div>
                </div>
              ))}
              {subjects.length === 0 && (
                <div 
                  onClick={addSubject}
                  className="md:col-span-2 border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-3xl p-12 text-center cursor-pointer hover:border-blue-400 transition-colors"
                >
                  <p className="text-slate-400 font-medium">Click to add your first subject</p>
                </div>
              )}
            </div>

            <div className="flex justify-between mt-12">
              <button onClick={() => setStep('profile')} className="px-6 py-3 text-slate-500 hover:text-slate-900 transition-colors">Back</button>
              <button 
                disabled={subjects.length === 0}
                onClick={() => setStep('availability')}
                className="px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg hover:bg-blue-700 transition-all active:scale-95 disabled:bg-blue-300"
              >
                Define Availability
              </button>
            </div>
          </div>
        )}

        {step === 'availability' && (
          <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold">When do you focus best?</h2>
              <p className="text-slate-500 dark:text-slate-400">EngiPlan allocates deep work during your peak hours.</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-8 shadow-sm">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-4">Target Completion Date</label>
                  <input 
                    type="date" 
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Weekday Hours</label>
                    <input 
                      type="number" 
                      value={availability.weekdayHours}
                      onChange={(e) => setAvailability({...availability, weekdayHours: parseInt(e.target.value)})}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Weekend Hours</label>
                    <input 
                      type="number" 
                      value={availability.weekendHours}
                      onChange={(e) => setAvailability({...availability, weekendHours: parseInt(e.target.value)})}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-4">Peak Performance Time</label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['morning', 'afternoon', 'night'] as const).map(time => (
                      <button
                        key={time}
                        onClick={() => setAvailability({...availability, preferredTime: time})}
                        className={`py-3 px-2 rounded-xl border text-sm font-semibold capitalize transition-all ${
                          availability.preferredTime === time 
                            ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button 
                onClick={handleSubmit}
                className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all active:scale-95"
              >
                Generate Study Strategy
              </button>
            </div>
          </div>
        )}

        {step === 'loading' && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-pulse">
            <div className="relative w-24 h-24">
               <div className="absolute inset-0 border-4 border-blue-600/20 rounded-full"></div>
               <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div className="text-center space-y-3">
              <h3 className="text-2xl font-bold">{loadingMsg}</h3>
              <p className="text-slate-500 max-w-xs mx-auto">Our AI is crunching the credits and cognitive load to find your perfect rhythm.</p>
            </div>
          </div>
        )}

        {step === 'dashboard' && plan && (
          <div className="space-y-12 animate-in fade-in zoom-in-95 duration-700 pb-20">
            {/* Header / Summary */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-blue-600 p-8 rounded-[2rem] text-white shadow-2xl shadow-blue-500/30 overflow-hidden relative">
              <div className="relative z-10">
                <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-widest mb-4">Active Plan</span>
                <h1 className="text-4xl font-black mb-2">Hello, {profile.name.split(' ')[0]}!</h1>
                <p className="text-blue-100 max-w-md">Your {profile.branch} journey is optimized. Focus on the high-impact targets identified below.</p>
              </div>
              <div className="flex space-x-4 relative z-10">
                <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20">
                  <div className="text-xs font-bold uppercase text-blue-200 mb-1">Target Completion</div>
                  <div className="text-2xl font-black">{plan.expectedOutcome.completionDate}</div>
                </div>
              </div>
              {/* Decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            </div>

            {/* Dashboard Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Schedule & Tasks */}
              <div className="lg:col-span-2 space-y-8">
                <section className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center text-sm">📅</span>
                      Next 7 Days
                    </h2>
                  </div>

                  {plan.dailySchedule.map((day, idx) => (
                    <div key={idx} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm transition-transform hover:scale-[1.01]">
                      <h3 className="text-lg font-bold mb-4 text-blue-600">{day.day}</h3>
                      <div className="space-y-3">
                        {day.tasks.map((task, tIdx) => (
                          <div key={tIdx} className={`flex items-center justify-between p-4 rounded-2xl border ${getLoadColor(task.load)}`}>
                            <div className="flex flex-col">
                              <span className="text-sm font-bold">{task.subjectName} — {task.topic}</span>
                              <span className="text-xs opacity-70 font-medium">{task.timeSlot} • {task.durationMinutes} mins • {task.taskType}</span>
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-white/50 dark:bg-black/20 px-2 py-1 rounded-md">
                              {task.load} Load
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </section>
              </div>

              {/* Right Column: Insights & Strategy */}
              <div className="space-y-8">
                 {/* Visual Analytics */}
                <ProgressCharts insights={plan.subjectInsights} theme={theme} />

                {/* Prioritization Insights */}
                <div className="bg-indigo-600 p-6 rounded-3xl text-white shadow-xl">
                  <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                    <span>⚡</span> Smart Prioritization
                  </h3>
                  <p className="text-sm text-indigo-100 leading-relaxed italic">
                    "{plan.prioritizationLogic}"
                  </p>
                </div>

                {/* Next Action Steps */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <h3 className="text-lg font-bold mb-4 text-slate-800 dark:text-slate-100">Next Steps</h3>
                  <div className="space-y-4">
                    {plan.nextSteps.map((step, sIdx) => (
                      <div key={sIdx} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                          {sIdx + 1}
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Expected Outcome */}
                <div className="bg-emerald-50 dark:bg-emerald-950/30 p-6 rounded-3xl border border-emerald-100 dark:border-emerald-900">
                   <h3 className="text-lg font-bold mb-2 text-emerald-800 dark:text-emerald-300">Expected Outcome</h3>
                   <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-emerald-700 dark:text-emerald-400">Improvement</span>
                        <span className="font-bold text-emerald-900 dark:text-emerald-200">{plan.expectedOutcome.confidenceImprovement}</span>
                      </div>
                      <p className="text-xs text-emerald-600 dark:text-emerald-500 leading-relaxed">
                        {plan.expectedOutcome.stressReductionNote}
                      </p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      
      {/* Footer Branding */}
      <footer className="py-12 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-400 text-sm">EngiPlan AI • Built for Modern Engineers • {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
