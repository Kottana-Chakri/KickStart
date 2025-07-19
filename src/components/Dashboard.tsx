import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabase } from '../contexts/SupabaseContext';
import { 
  Plus, 
  BookOpen, 
  TrendingUp, 
  Calendar, 
  Play,
  Clock,
  Target,
  Zap,
  User,
  LogOut,
  Settings
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  intent_audio_url?: string;
  intent_transcription?: string;
  content_url?: string;
  total_topics: number;
  completed_topics: number;
  created_at: string;
  next_study_date: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { supabase, user, loading } = useSupabase();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      // Redirect to landing page if not authenticated
      navigate('/');
      return;
    }

    if (user) {
      fetchTasks();
    }
  }, [user, loading, navigate]);

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoadingTasks(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleCreateTask = () => {
    navigate('/create-task');
  };

  const handleStartStudy = (taskId: string) => {
    navigate(`/study/${taskId}`);
  };

  const getProgressPercentage = (completed: number, total: number) => {
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  const getStreakDays = () => {
    // Mock streak calculation - in real app, calculate from study sessions
    return Math.floor(Math.random() * 15) + 1;
  };

  if (loading || loadingTasks) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                KickStartX
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-600">
                <User className="w-5 h-5" />
                <span className="hidden sm:block">{user?.email}</span>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:block">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back! 👋
          </h1>
          <p className="text-gray-600">
            Ready to build some study momentum today?
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-indigo-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Study Streak</p>
                <p className="text-2xl font-bold text-indigo-600">{getStreakDays()} days</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active Tasks</p>
                <p className="text-2xl font-bold text-green-600">{tasks.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-orange-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Today's Focus</p>
                <p className="text-2xl font-bold text-orange-600">
                  {tasks.filter(task => new Date(task.next_study_date) <= new Date()).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tasks List */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Your Study Tasks</h2>
              <button
                onClick={handleCreateTask}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>New Task</span>
              </button>
            </div>

            {tasks.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl shadow-lg border border-gray-100 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No tasks yet</h3>
                <p className="text-gray-600 mb-6">
                  Create your first study task to start building momentum!
                </p>
                <button
                  onClick={handleCreateTask}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  Create Your First Task
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div key={task.id} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{task.title}</h3>
                        <p className="text-gray-600 mb-3">{task.description}</p>
                        
                        {/* Progress Bar */}
                        <div className="mb-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-600">Progress</span>
                            <span className="text-sm font-medium text-indigo-600">
                              {getProgressPercentage(task.completed_topics, task.total_topics)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${getProgressPercentage(task.completed_topics, task.total_topics)}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {task.completed_topics} of {task.total_topics} topics completed
                          </p>
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>Next: {new Date(task.next_study_date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>Created {new Date(task.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleStartStudy(task.id)}
                        className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-4 py-2 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2 ml-4"
                      >
                        <Play className="w-4 h-4" />
                        <span>Study</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Today's Motivation */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-2xl border border-indigo-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Today's Motivation</h3>
              <p className="text-gray-700 italic mb-4">
                "Every expert was once a beginner. Every pro was once an amateur. Every icon was once an unknown."
              </p>
              <p className="text-sm text-indigo-600 font-medium">— Robin Sharma</p>
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={handleCreateTask}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Plus className="w-5 h-5 text-indigo-600" />
                  <span>Create New Task</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <Settings className="w-5 h-5 text-gray-600" />
                  <span>Settings</span>
                </button>
              </div>
            </div>

            {/* Study Tips */}
            <div className="bg-gradient-to-br from-green-50 to-teal-50 p-6 rounded-2xl border border-green-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">💡 Study Tip</h3>
              <p className="text-gray-700 text-sm">
                Start with just 5 minutes of study time. Building the habit is more important than the duration.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;