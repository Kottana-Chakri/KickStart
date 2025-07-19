import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabase } from '../contexts/SupabaseContext';
import { 
  ArrowLeft, 
  Mic, 
  MicOff, 
  Upload, 
  FileText, 
  Link as LinkIcon,
  Play,
  Pause,
  Trash2,
  Zap,
  Loader
} from 'lucide-react';

const TaskCreator: React.FC = () => {
  const navigate = useNavigate();
  const { supabase, user } = useSupabase();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Form data
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [intentRecording, setIntentRecording] = useState<Blob | null>(null);
  const [intentTranscription, setIntentTranscription] = useState('');
  const [contentType, setContentType] = useState<'pdf' | 'link'>('pdf');
  const [contentFile, setContentFile] = useState<File | null>(null);
  const [contentUrl, setContentUrl] = useState('');
  
  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setIntentRecording(blob);
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingDuration(0);
      
      intervalRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  };

  const playRecording = () => {
    if (intentRecording && !isPlaying) {
      const url = URL.createObjectURL(intentRecording);
      audioRef.current = new Audio(url);
      audioRef.current.play();
      setIsPlaying(true);
      
      audioRef.current.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(url);
      };
    }
  };

  const pauseRecording = () => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const deleteRecording = () => {
    setIntentRecording(null);
    setRecordingDuration(0);
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setContentFile(file);
    }
  };

  const uploadAudioToSupabase = async (audioBlob: Blob): Promise<string> => {
    const fileName = `intent_${user?.id}_${Date.now()}.wav`;
    const { data, error } = await supabase.storage
      .from('audio-recordings')
      .upload(fileName, audioBlob);

    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from('audio-recordings')
      .getPublicUrl(fileName);
    
    return publicUrl;
  };

  const uploadContentToSupabase = async (file: File): Promise<string> => {
    const fileName = `content_${user?.id}_${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage
      .from('content-files')
      .upload(fileName, file);

    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from('content-files')
      .getPublicUrl(fileName);
    
    return publicUrl;
  };

  const createTask = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      let audioUrl = '';
      let contentFileUrl = '';

      // Upload audio recording
      if (intentRecording) {
        audioUrl = await uploadAudioToSupabase(intentRecording);
      }

      // Upload content file if provided
      if (contentFile) {
        contentFileUrl = await uploadContentToSupabase(contentFile);
      }

      // Create task in database
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          user_id: user.id,
          title: taskTitle,
          description: taskDescription,
          intent_audio_url: audioUrl,
          intent_transcription: intentTranscription,
          content_url: contentType === 'pdf' ? contentFileUrl : contentUrl,
          content_type: contentType,
          total_topics: 10, // Mock value - in real app, analyze content
          completed_topics: 0,
          next_study_date: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Failed to create task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const canProceedToStep2 = taskTitle.trim() && taskDescription.trim();
  const canProceedToStep3 = intentRecording || intentTranscription.trim();
  const canCreateTask = (contentType === 'pdf' && contentFile) || (contentType === 'link' && contentUrl.trim());

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-indigo-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </button>
            <div className="flex items-center space-x-2 ml-8">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Create New Task
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step >= stepNumber 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step > stepNumber ? 'bg-gradient-to-r from-indigo-500 to-purple-600' : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <p className="text-gray-600">
              {step === 1 && "Define your study goal"}
              {step === 2 && "Record your motivation"}
              {step === 3 && "Add your content"}
            </p>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">What do you want to study?</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Task Title
                  </label>
                  <input
                    type="text"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    placeholder="e.g., Study Operating Systems for GATE"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    placeholder="Describe what you want to achieve with this study goal..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-8">
                <button
                  onClick={() => setStep(2)}
                  disabled={!canProceedToStep2}
                  className={`px-6 py-3 rounded-full font-semibold transition-all duration-200 ${
                    canProceedToStep2
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-lg transform hover:scale-105'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Next: Record Intent
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Why does this matter to you?</h2>
              <p className="text-gray-600 mb-8">
                Record a voice message explaining why this study goal is important to you. This will be used to create personalized motivational reminders.
              </p>

              <div className="space-y-6">
                {/* Recording Section */}
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Voice Recording</h3>
                  
                  {!intentRecording ? (
                    <div className="text-center">
                      <button
                        onClick={isRecording ? stopRecording : startRecording}
                        className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-200 ${
                          isRecording 
                            ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                            : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:shadow-lg transform hover:scale-105'
                        }`}
                      >
                        {isRecording ? (
                          <MicOff className="w-8 h-8 text-white" />
                        ) : (
                          <Mic className="w-8 h-8 text-white" />
                        )}
                      </button>
                      <p className="mt-4 text-gray-600">
                        {isRecording ? `Recording... ${formatDuration(recordingDuration)}` : 'Tap to start recording'}
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between bg-white p-4 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={isPlaying ? pauseRecording : playRecording}
                          className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center"
                        >
                          {isPlaying ? (
                            <Pause className="w-5 h-5 text-white" />
                          ) : (
                            <Play className="w-5 h-5 text-white" />
                          )}
                        </button>
                        <div>
                          <p className="font-medium text-gray-900">Recording complete</p>
                          <p className="text-sm text-gray-600">{formatDuration(recordingDuration)}</p>
                        </div>
                      </div>
                      <button
                        onClick={deleteRecording}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Alternative Text Input */}
                <div className="text-center text-gray-500">
                  <span>or</span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Write your motivation (optional)
                  </label>
                  <textarea
                    value={intentTranscription}
                    onChange={(e) => setIntentTranscription(e.target.value)}
                    placeholder="Type why this study goal is important to you..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-full font-semibold hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!canProceedToStep3}
                  className={`px-6 py-3 rounded-full font-semibold transition-all duration-200 ${
                    canProceedToStep3
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-lg transform hover:scale-105'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Next: Add Content
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Add your study content</h2>
              <p className="text-gray-600 mb-8">
                Upload a PDF or provide a link to the content you want to study. We'll analyze it and create a personalized study plan.
              </p>

              <div className="space-y-6">
                {/* Content Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Content Type
                  </label>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setContentType('pdf')}
                      className={`flex items-center space-x-2 px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
                        contentType === 'pdf'
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      <FileText className="w-5 h-5" />
                      <span>PDF File</span>
                    </button>
                    <button
                      onClick={() => setContentType('link')}
                      className={`flex items-center space-x-2 px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
                        contentType === 'link'
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      <LinkIcon className="w-5 h-5" />
                      <span>Web Link</span>
                    </button>
                  </div>
                </div>

                {/* Content Input */}
                {contentType === 'pdf' ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload PDF
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-400 transition-colors">
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="pdf-upload"
                      />
                      <label htmlFor="pdf-upload" className="cursor-pointer">
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">
                          {contentFile ? contentFile.name : 'Click to upload PDF or drag and drop'}
                        </p>
                      </label>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Content URL
                    </label>
                    <input
                      type="url"
                      value={contentUrl}
                      onChange={(e) => setContentUrl(e.target.value)}
                      placeholder="https://example.com/course-content"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-full font-semibold hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={createTask}
                  disabled={!canCreateTask || loading}
                  className={`px-6 py-3 rounded-full font-semibold transition-all duration-200 flex items-center space-x-2 ${
                    canCreateTask && !loading
                      ? 'bg-gradient-to-r from-green-500 to-teal-600 text-white hover:shadow-lg transform hover:scale-105'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      <span>Create Task</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCreator;