import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSupabase } from '../contexts/SupabaseContext';
import { 
  ArrowLeft, 
  Play, 
  CheckCircle, 
  Brain, 
  Lightbulb, 
  Target,
  Clock,
  TrendingUp,
  Zap,
  BookOpen,
  FileText
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
}

interface Challenge {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const StudySession: React.FC = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { supabase, user } = useSupabase();
  
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPhase, setCurrentPhase] = useState<'warmup' | 'curiosity' | 'study'>('warmup');
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);

  // Mock challenges - in real app, generate with AI based on content
  const mockChallenges: Challenge[] = [
    {
      id: 1,
      question: "What is the primary purpose of an operating system?",
      options: [
        "To provide a user interface",
        "To manage hardware and software resources",
        "To run applications",
        "To store data"
      ],
      correct: 1,
      explanation: "The primary purpose of an OS is to manage hardware and software resources, acting as an intermediary between applications and hardware."
    },
    {
      id: 2,
      question: "Which scheduling algorithm gives priority to shorter processes?",
      options: [
        "First Come First Serve (FCFS)",
        "Round Robin",
        "Shortest Job First (SJF)",
        "Priority Scheduling"
      ],
      correct: 2,
      explanation: "Shortest Job First (SJF) scheduling algorithm prioritizes processes with shorter execution times to minimize average waiting time."
    },
    {
      id: 3,
      question: "What is a deadlock in operating systems?",
      options: [
        "When a process runs too slowly",
        "When processes wait indefinitely for resources",
        "When memory is full",
        "When CPU usage is 100%"
      ],
      correct: 1,
      explanation: "A deadlock occurs when two or more processes are blocked forever, waiting for each other to release resources."
    }
  ];

  const curiosityFacts = [
    "Did you know? The first operating system was created in the 1950s and could only run one program at a time!",
    "Fun fact: Modern smartphones have more computing power than the computers that sent humans to the moon!",
    "Interesting: The Linux kernel has over 28 million lines of code and is one of the largest collaborative projects in history!",
    "Amazing: Your computer's operating system makes millions of decisions every second to keep everything running smoothly!"
  ];

  useEffect(() => {
    if (taskId && user) {
      fetchTask();
    }
  }, [taskId, user]);

  useEffect(() => {
    setChallenges(mockChallenges);
  }, []);

  const fetchTask = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', taskId)
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      setTask(data);
    } catch (error) {
      console.error('Error fetching task:', error);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleAnswerSubmit = () => {
    if (selectedAnswer === null) return;
    
    setShowExplanation(true);
    if (selectedAnswer === challenges[currentChallenge].correct) {
      setScore(score + 1);
    }
  };

  const handleNextChallenge = () => {
    if (currentChallenge < challenges.length - 1) {
      setCurrentChallenge(currentChallenge + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setCurrentPhase('curiosity');
    }
  };

  const handleStartStudying = () => {
    setCurrentPhase('study');
  };

  const getMotivationalMessage = () => {
    const messages = [
      "You're building momentum! Every question brings you closer to mastery.",
      "Great progress! Your consistency is paying off.",
      "Keep going! You're developing the habit of success.",
      "Excellent work! Each step forward matters."
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Task not found</h2>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-full"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-indigo-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-semibold text-gray-900">{task.title}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Phase: <span className="font-medium capitalize">{currentPhase}</span>
              </div>
              {currentPhase === 'warmup' && (
                <div className="text-sm text-indigo-600 font-medium">
                  Score: {score}/{challenges.length}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentPhase === 'warmup' && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Warm-up Challenges</h2>
                <p className="text-gray-600">Get your brain ready with these quick questions</p>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">
                  Question {currentChallenge + 1} of {challenges.length}
                </span>
                <span className="text-sm text-indigo-600 font-medium">
                  Score: {score}/{challenges.length}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentChallenge + 1) / challenges.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {challenges[currentChallenge] && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  {challenges[currentChallenge].question}
                </h3>

                <div className="space-y-3 mb-6">
                  {challenges[currentChallenge].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={showExplanation}
                      className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                        selectedAnswer === index
                          ? showExplanation
                            ? index === challenges[currentChallenge].correct
                              ? 'border-green-500 bg-green-50 text-green-800'
                              : 'border-red-500 bg-red-50 text-red-800'
                            : 'border-indigo-500 bg-indigo-50 text-indigo-800'
                          : showExplanation && index === challenges[currentChallenge].correct
                            ? 'border-green-500 bg-green-50 text-green-800'
                            : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <span className="font-medium">{String.fromCharCode(65 + index)}.</span> {option}
                    </button>
                  ))}
                </div>

                {showExplanation && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <h4 className="font-semibold text-blue-900 mb-2">Explanation:</h4>
                    <p className="text-blue-800">{challenges[currentChallenge].explanation}</p>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    {getMotivationalMessage()}
                  </div>
                  
                  {!showExplanation ? (
                    <button
                      onClick={handleAnswerSubmit}
                      disabled={selectedAnswer === null}
                      className={`px-6 py-3 rounded-full font-semibold transition-all duration-200 ${
                        selectedAnswer !== null
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-lg transform hover:scale-105'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      Submit Answer
                    </button>
                  ) : (
                    <button
                      onClick={handleNextChallenge}
                      className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                    >
                      {currentChallenge < challenges.length - 1 ? 'Next Question' : 'Continue'}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {currentPhase === 'curiosity' && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lightbulb className="w-8 h-8 text-white" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Curiosity Spark! 💡</h2>
            
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-6 mb-8">
              <p className="text-lg text-gray-800">
                {curiosityFacts[Math.floor(Math.random() * curiosityFacts.length)]}
              </p>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Great job on the warm-up!</h3>
              <p className="text-gray-600 mb-4">
                You scored {score} out of {challenges.length} questions. Your brain is now primed and ready for focused study time.
              </p>
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Warm-up Complete</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Brain className="w-4 h-4 text-blue-500" />
                  <span>Brain Activated</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Target className="w-4 h-4 text-purple-500" />
                  <span>Ready to Focus</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleStartStudying}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2 mx-auto"
            >
              <Play className="w-5 h-5" />
              <span>Start Studying</span>
            </button>
          </div>
        )}

        {currentPhase === 'study' && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Study Time</h2>
                <p className="text-gray-600">Focus on today's topic with full concentration</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-teal-50 border border-green-200 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Today's Topic: Process Scheduling</h3>
              <p className="text-gray-700 mb-4">
                Learn about different CPU scheduling algorithms and how the operating system decides which process to run next.
              </p>
              
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>Estimated time: 25 minutes</span>
                </div>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="w-4 h-4" />
                  <span>Difficulty: Intermediate</span>
                </div>
              </div>
            </div>

            {task.content_url && (
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Study Material</h4>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-600 mb-3">Your uploaded content is ready for study:</p>
                  <a
                    href={task.content_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Open Study Material</span>
                  </a>
                </div>
              </div>
            )}

            <div className="text-center">
              <p className="text-gray-600 mb-6">
                Remember why you started: <em>"{task.intent_transcription || 'Your personal motivation drives you forward'}"</em>
              </p>
              
              <button
                onClick={() => {
                  // In real app, mark topic as completed and update progress
                  navigate('/dashboard');
                }}
                className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2 mx-auto"
              >
                <CheckCircle className="w-5 h-5" />
                <span>Mark as Complete</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudySession;