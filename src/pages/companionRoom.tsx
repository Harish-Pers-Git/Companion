import React, { useState, useRef, useEffect } from "react";
import { FaComments, FaBrain, FaBook, FaUser, FaThumbtack, FaBars, FaUserFriends, FaRunning, FaHeartbeat } from "react-icons/fa";
import { GiArtificialIntelligence, GiDuration } from "react-icons/gi"; // For Activities
import { useNavigate } from "react-router-dom";
import ReactPlayer from "react-player";
import PianoGame from "../components/PianoGame";
import { useElectron } from "@/hooks/useElectron";
import ElectronTitleBar from "@/components/ElectronTitleBar";

// Global speech reference to track current utterance
let currentUtterance: SpeechSynthesisUtterance | null = null;

const conversationalQuestions = [
  { q: "How are you feeling today?", a: ["Fine", "Good"] },
  { q: "Did you have a good day?", a: ["Yes", "Could be better"] },
  { q: "Ready for a quick chat?", a: ["Always", "Sure"] },
  { q: "What's on your mind?", a: ["Not much", "Thinking"] },
  { q: "Shall we do something fun?", a: ["Yes!", "Okay"] },
];

type Exercise = {
  name: string;
  duration?: number;
  reps?: number;
  gif: string;
  type: "time" | "reps";
  focus?: string;
};

const tabs = [
  { name: "Companion", icon: <FaUserFriends /> },
  { name: "Activity", icon: <FaRunning /> },
  { name: "Physical", icon: <FaHeartbeat /> },
];

const exercises: Exercise[] = [
  {
    name: "March in Place",
    duration: 10, // seconds
    gif: "/march.gif",
    type: "time",
  },
  {
    name: "Arm Circles",
    duration: 30, // seconds each direction
    gif: "/arm-circles.gif",
    type: "time",
  },
  {
    name: "Toe Touch + Reach Up",
    reps: 10,
    gif: "/toe-touch.gif",
    type: "reps",
  },
  {
    name: "Neck Rolls",
    duration: 30, // seconds each side
    gif: "/neck-rolls.gif",
    type: "time",
  },
  {
    name: "Side Stepping",
    duration: 60, // seconds
    gif: "/side-stepping.gif",
    type: "time",
  },
];

const coreStrengthExercises: Exercise[] = [
  {
    name: "Wall Push-Ups",
    duration: 15,
    reps: 10,
    gif: "/wall-pushups.gif",
    type: "reps",
    focus: "Upper body control",
  },
  {
    name: "Sit-to-Stand (Chair)",
    duration: 10,
    reps: 10,
    gif: "/sit-to-stand.gif",
    type: "reps",
    focus: "Leg strength, coordination",
  },
  {
    name: "Animal Walks",
    duration: 30,
    reps: 10,
    gif: "/animal-walks.gif",
    type: "time",
    focus: "Full-body sensory integration",
  },
  {
    name: "Ball Pass",
    duration: 10,
    reps: 10,
    gif: "/ball-pass.gif",
    type: "reps",
    focus: "Eye-hand coordination",
  },
  {
    name: "Dead Bug (on mat)",
    duration: 10,
    reps: 10,
    gif: "/dead-bug.gif",
    type: "reps",
    focus: "Core stability",
  },
];

const yogaExercises: Exercise[] = [
  {
    name: "Tree Pose (Vrikshasana)",
    duration: 30,
    gif: "/tree pose.jpg",
    type: "time",
    focus: "Balance and concentration",
  },
  {
    name: "Cat–Cow Pose (Marjaryasana–Bitilasana)",
    duration: 60,
    gif: "/cat-cow.jpg",
    type: "time",
    focus: "Spinal flexibility and warm-up",
  },
  {
    name: "Child's Pose (Balasana)",
    duration: 45,
    gif: "/Balasana.gif", // placeholder
    type: "time",
    focus: "Relaxation and gentle stretch",
  },
  {
    name: "Cobra Pose (Bhujangasana)",
    duration: 30,
    gif: "/Cobra Pose.gif", // placeholder
    type: "time",
    focus: "Spinal extension and chest opening",
  },
  {
    name: "Log Roll Pose (Reclining Twist)",
    duration: 40,
    gif: "/side-stepping.gif", // placeholder
    type: "time",
    focus: "Spinal mobility and relaxation",
  },
  {
    name: "Mountain Pose (Tadasana)",
    duration: 30,
    gif: "/Mountain Pose.gif", // placeholder
    type: "time",
    focus: "Posture and grounding",
  },
  {
    name: "Butterfly Pose (Baddha Konasana)",
    duration: 40,
    gif: "/Butterfly Pose.gif", // placeholder
    type: "time",
    focus: "Hip opening and relaxation",
  },
  {
    name: "Bridge Pose (Setu Bandhasana)",
    duration: 40,
    gif: "/Bridge Pose.gif", // placeholder
    type: "time",
    focus: "Back strength and chest opening",
  },
  {
    name: "Lotus or Easy Sitting Pose (Sukhasana)",
    duration: 60,
    gif: "/Lotus.jpg", // placeholder
    type: "time",
    focus: "Calm and meditation",
  },
  {
    name: "Bee Breath (Bhramari Pranayama)",
    duration: 60,
    gif: "/Bhramari Pranayama.jpg", // placeholder
    type: "time",
    focus: "Breath control and relaxation",
  },
];

const appreciationWords = ["Fantastic!", "Wow!", "Super!", "Good!", "Great job!", "Awesome!"];

function speakCount(type: string, count: number, onDone: () => void, shouldContinue: () => boolean) {
  let i = 1;
  const synth = window.speechSynthesis;
  function speakNext() {
    if (i > count) {
      onDone();
      return;
    }
    const utter = new window.SpeechSynthesisUtterance(i.toString());
    synth.speak(utter);
    utter.onend = () => {
      if (!shouldContinue()) return; // Only check here
      i++;
      setTimeout(speakNext, 1000);
    };
  }
  speakNext();
}

function ExerciseCard({ imageSrc, name, duration }) {
  const [count, setCount] = useState(1);

  useEffect(() => {
    if (count > duration) return;
    const timer = setTimeout(() => setCount(count + 1), 1000);
    return () => clearTimeout(timer);
  }, [count, duration]);

  return (
    <div style={{ textAlign: "center" }}>
      <img src={imageSrc} alt={name} style={{ height: 200 }} />
      <h2>{name}</h2>
      <div>{duration} sec</div>
      <div style={{ fontSize: 32, marginTop: 16 }}>
        {count <= duration ? count : "Done!"}
      </div>
    </div>
  );
}

function startSynchronizedCountdown(countTo, setModalCount, onDone) {
  let current = 1;
  const synth = window.speechSynthesis;

  function speakNext() {
    setModalCount(current);
    const utter = new window.SpeechSynthesisUtterance(current.toString());
    synth.speak(utter);
    utter.onend = () => {
      if (current < countTo) {
        current++;
        speakNext();
      } else {
        onDone();
      }
    };
  }
  speakNext();
}

export default function CompanionRoom() {
  const navigate = useNavigate();
  const { isElectron } = useElectron();
  const [activeTab, setActiveTab] = useState("Companion");
  const [currentExercise, setCurrentExercise] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showAppreciation, setShowAppreciation] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [physicalSubTab, setPhysicalSubTab] = useState('Warm-Up');
  const [yogaSubTab, setYogaSubTab] = useState('YOGA');
  const [activitySubTab, setActivitySubTab] = useState('YOGA');
  const [isAsking, setIsAsking] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<{ q: string; a: string[] } | null>(null);
  const [questionVisible, setQuestionVisible] = useState(false);
  const [questionIntervalId, setQuestionIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [usedQuestions, setUsedQuestions] = useState<number[]>([]);
  const [modalCount, setModalCount] = useState<number | undefined>(undefined);

  // Ref to always have the latest showModal value
  const showModalRef = useRef(showModal);
  useEffect(() => {
    showModalRef.current = showModal;
  }, [showModal]);

  // Add sample music tracks (you can replace these with your actual music files)
  const musicTracks = [
    {
      title: "Calm Meditation",
      url: "/Calm Meditation.mp3",
      duration: "5:30"
    },
    {
      title: "Peaceful Yoga Flow",
      url: "/peaceful.mp3",
      duration: "6:15"
    },
    {
      title: "Mindful Breathing",
      url: "https://www.youtube.com/watch?v=YOUR_VIDEO_ID_3",
      duration: "4:45"
    }
  ];

  const startExercise = (idx: number) => {
    setCurrentExercise(idx);
    setIsPlaying(true);
    setShowAppreciation(null);
    setShowModal(true);
    // Only use speakCount for rep-based exercises
    const allExercises = [...exercises, ...coreStrengthExercises, ...yogaExercises];
    const ex = allExercises[idx];
    const count = ex.type === "reps" ? ex.reps! : ex.duration!;
    if (ex.type === "reps") {
    speakCount(
      ex.type,
      count,
      () => {
        setIsPlaying(false);
        setShowAppreciation(appreciationWords[Math.floor(Math.random() * appreciationWords.length)]);
        setTimeout(() => {
          setShowAppreciation(null);
          setShowModal(false);
          setCurrentExercise(null);
        }, 2000);
      },
      () => showModalRef.current // always gets the latest value
    );
    }
  };

  const closeModal = () => {
    window.speechSynthesis.cancel(); // Stop any ongoing speech
    setShowModal(false);
    setCurrentExercise(null);
    setIsPlaying(false);
    setShowAppreciation(null);
  };

  const speakText = (text: string) => {
    const synth = window.speechSynthesis;
    synth.cancel(); // Cancel previous speech to avoid overlap
    
    // Stop current utterance if it exists
    if (currentUtterance) {
      currentUtterance.onend = null;
      currentUtterance.onerror = null;
    }
    
    currentUtterance = new SpeechSynthesisUtterance(text);
    synth.speak(currentUtterance);
    
    // Clean up reference when speech ends
    currentUtterance.onend = () => {
      currentUtterance = null;
    };
    currentUtterance.onerror = () => {
      currentUtterance = null;
    };
  };

  const stopAllSpeech = () => {
    const synth = window.speechSynthesis;
    
    // Stop current utterance
    if (currentUtterance) {
      currentUtterance.onend = null;
      currentUtterance.onerror = null;
      currentUtterance = null;
    }
    
    // Multiple cancellation attempts
    synth.cancel();
    synth.pause();
    synth.resume();
    synth.cancel();
    
    // Force stop with timeout
    setTimeout(() => {
      synth.cancel();
      if (synth.speaking) {
        synth.pause();
        synth.cancel();
      }
    }, 100);
    
    // Additional cleanup
    setTimeout(() => {
      synth.cancel();
      currentUtterance = null;
    }, 200);
  };

  const askRandomQuestion = () => {
    setQuestionVisible(false); // Fade out old question
    setTimeout(() => {
      let availableQuestions = conversationalQuestions.map((_, index) => index).filter(index => !usedQuestions.includes(index));
      
      // If all questions have been used, reset the used questions
      if (availableQuestions.length === 0) {
        setUsedQuestions([]);
        availableQuestions = conversationalQuestions.map((_, index) => index);
      }
      
      const randomIndex = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
      const nextQuestion = conversationalQuestions[randomIndex];
      
      setUsedQuestions(prev => [...prev, randomIndex]);
      setCurrentQuestion(nextQuestion);
      setQuestionVisible(true); // Fade in new one
      
      // Speak both question and answers
      const fullText = `${nextQuestion.q} ${nextQuestion.a[0]} or ${nextQuestion.a[1]}`;
      speakText(fullText);
    }, 300);
  };

  const toggleAsking = () => {
    const currentlyAsking = !isAsking;
    setIsAsking(currentlyAsking);

    if (currentlyAsking) {
      setUsedQuestions([]); // Reset used questions when starting
      askRandomQuestion(); // Ask first question immediately
      const intervalId = setInterval(askRandomQuestion, 3300); // Ask every 3.3 seconds
      setQuestionIntervalId(intervalId);
    } else {
      if (questionIntervalId) {
        clearInterval(questionIntervalId);
        setQuestionIntervalId(null);
      }
      // Stop all speech synthesis immediately
      stopAllSpeech();
      setQuestionVisible(false);
      setTimeout(() => setCurrentQuestion(null), 300); // Clear after fade out
    }
  };

  // Cleanup effect to stop speech when component unmounts or when stopping
  useEffect(() => {
    return () => {
      if (questionIntervalId) {
        clearInterval(questionIntervalId);
      }
      stopAllSpeech();
    };
  }, [questionIntervalId]);

  const handleAnswerClick = () => {
    // Hide the current question UI, the timer will show the next one
    setQuestionVisible(false);
  };

  // Add effect to handle modalCount countdown
  useEffect(() => {
    if (showModal && isPlaying && currentExercise !== null) {
      const allExercises = [...exercises, ...coreStrengthExercises, ...yogaExercises];
      const ex = allExercises[currentExercise];
      const count = ex.type === "reps" ? ex.reps : ex.duration;
      if (ex.type === "time") {
        startSynchronizedCountdown(count, setModalCount, () => {
          setIsPlaying(false);
          setShowAppreciation(appreciationWords[Math.floor(Math.random() * appreciationWords.length)]);
          setTimeout(() => {
            setShowAppreciation(null);
            setShowModal(false);
            setCurrentExercise(null);
          }, 2000);
        });
      }
      // For reps, you may want to increment modalCount elsewhere (e.g., on user action)
    } else {
      setModalCount(undefined);
    }
  }, [showModal, isPlaying, currentExercise]);

  return (
    <div
      style={{
        minHeight: "100vh",
        color: "#fff",
        fontFamily: "Quicksand, Nunito, Arial, sans-serif",
        position: "relative",
        paddingTop: isElectron ? "32px" : "0", // Add padding for title bar in Electron
      }}
    >
      <ElectronTitleBar />
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: -2,
          filter: "blur(4px)",
        }}
      >
        <source src="/Sunset.mp4" type="video/mp4" />
      </video>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0, 0, 0, 0.5)",
          zIndex: -1,
        }}
      />
      {/* Top Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1.5rem 2rem 0.5rem 2rem",
        }}
      >
        {/* Left Logo */}
        <div
          onClick={() => navigate("/")}
          style={{
            background: "rgba(0,0,0,0.3)",
            borderRadius: "50%",
            width: 48,
            height: 48,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            fontSize: 32,
            letterSpacing: 2,
            cursor: "pointer",
          }}
        >
          R 
          
        </div>

        {/* Center Tabs */}
        <div
          style={{
            display: "flex",
            background: "rgba(0,0,0,0.3)",
            borderRadius: 32,
            padding: "0.5rem 2rem",
            gap: "1.5rem",
            alignItems: "center",
            boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => {
                setActiveTab(tab.name);
                setCurrentExercise(null);
                setIsPlaying(false);
                setShowAppreciation(null);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: activeTab === tab.name ? "#ff8c00" : "transparent",
                color: activeTab === tab.name ? "#fff" : "#e0e6ff",
                border: "none",
                borderRadius: 24,
                padding: "0.5rem 1.2rem",
                fontWeight: 600,
                fontSize: "1.1rem",
                cursor: "pointer",
                transition: "background 0.2s",
              }}
            >
              <span style={{ fontSize: 20 }}>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Right Hamburger */}
        <div
          style={{
            background: "rgba(0,0,0,0.3)",
            borderRadius: "50%",
            width: 48,
            height: 48,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 28,
            cursor: "pointer",
          }}
        >
          <FaBars />
        </div>
      </div>

      {/* Main Content */}
      <div style={{ display: "flex", justifyContent: "left", width: "100%", alignItems: 'center' }}>
        {activeTab === "Companion" && (
          <div style={{ marginLeft: 60, marginBottom: 0, position: 'relative' }}>
            <img
              src="/3d.png"
              alt="Avatar"
              onClick={toggleAsking}
              style={{ 
                width: 220, 
                borderRadius: "50%",
                cursor: 'pointer',
                transition: 'transform 0.2s ease',
                transform: isAsking ? 'scale(1.05)' : 'scale(1)',
              }}
            />
            {isAsking && currentQuestion && (
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '110%',
                transform: 'translateY(-50%)',
                width: '300px',
                textAlign: 'center',
                opacity: questionVisible ? 1 : 0,
                transition: 'opacity 0.3s ease-in-out',
              }}>
                <div style={{
                  background: 'rgba(0,0,0,0.3)',
                  padding: '16px',
                  borderRadius: '12px',
                  marginBottom: '12px',
                  fontSize: '18px',
                  fontWeight: 600,
                  color: '#fff',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                }}>
                  {currentQuestion.q}
                </div>
              </div>
            )}
          </div>
        )}
        {activeTab === "Physical" && (
          <div style={{ margin: "32px auto 0 auto", width: 650, background: "rgba(0,0,0,0.2)", borderRadius: 24, padding: 24 }}>
            {/* Sub-tabs for Physical */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 24 }}>
              <button
                onClick={() => setPhysicalSubTab('Warm-Up')}
                style={{
                  padding: '8px 24px',
                  borderRadius: 16,
                  border: 'none',
                  background: physicalSubTab === 'Warm-Up' ? '#ff8c00' : 'rgba(255,255,255,0.08)',
                  color: physicalSubTab === 'Warm-Up' ? '#fff' : '#e0e6ff',
                  fontWeight: 700,
                  fontSize: 18,
                  cursor: 'pointer',
                  boxShadow: physicalSubTab === 'Warm-Up' ? '0 2px 12px rgba(80,0,120,0.10)' : 'none',
                  transition: 'background 0.2s',
                }}
              >
                Warm-Up
              </button>
              <button
                onClick={() => setPhysicalSubTab('Core Functional Strength')}
                style={{
                  padding: '8px 24px',
                  borderRadius: 16,
                  border: 'none',
                  background: physicalSubTab === 'Core Functional Strength' ? '#ff8c00' : 'rgba(255,255,255,0.08)',
                  color: physicalSubTab === 'Core Functional Strength' ? '#fff' : '#e0e6ff',
                  fontWeight: 700,
                  fontSize: 18,
                  cursor: 'pointer',
                  boxShadow: physicalSubTab === 'Core Functional Strength' ? '0 2px 12px rgba(80,0,120,0.10)' : 'none',
                  transition: 'background 0.2s',
                }}
              >
                Core Functional Strength
              </button>
            </div>
            {physicalSubTab === 'Warm-Up' && (
              <>
                <h2 style={{ textAlign: "center", marginBottom: 16 }}>Full-Body Warm-Up (5–7 mins)</h2>
                {exercises.map((ex, idx) => (
                  <div key={ex.name} style={{ marginBottom: 24, padding: 12, borderRadius: 12, background: "rgba(255,255,255,0.08)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                      <img src={ex.gif} alt={ex.name} style={{ width: 80, height: 80, borderRadius: 12, background: "#fff" }} />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 18 }}>{ex.name}</div>
                        <div style={{ fontSize: 14, color: "#e0e6ff" }}>
                          {ex.type === "reps" ? `${ex.reps} reps` : `${ex.duration} sec`}
                        </div>
                      </div>
                      <button
                        onClick={() => startExercise(idx)}
                        disabled={isPlaying || showModal}
                        style={{ marginLeft: "auto", padding: "8px 18px", borderRadius: 8, border: "none", background: "#ff8c00", color: "#fff", fontWeight: 600, cursor: isPlaying ? "not-allowed" : "pointer" }}
                      >
                        {isPlaying && currentExercise === idx && showModal ? "In Progress..." : "Start"}
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}
            {physicalSubTab === 'Core Functional Strength' && (
              <>
                <h2 style={{ textAlign: "center", marginBottom: 16 }}>Core Functional Strength</h2>
                {coreStrengthExercises.map((ex, idx) => (
                  <div key={ex.name} style={{ marginBottom: 24, padding: 12, borderRadius: 12, background: "rgba(255,255,255,0.08)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                      <img src={ex.gif} alt={ex.name} style={{ width: 80, height: 80, borderRadius: 12, background: "#fff" }} />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 18 }}>{ex.name}</div>
                        <div style={{ fontSize: 14, color: "#e0e6ff" }}>
                          {ex.type === "reps" ? `${ex.reps} reps` : `${ex.duration} sec`}
                          {('focus' in ex) && ex.focus && <><br /><span style={{ color: '#ffe066', fontSize: 13 }}>{ex.focus}</span></>}
                        </div>
                      </div>
                      <button
                        onClick={() => startExercise(idx + exercises.length)}
                        disabled={isPlaying || showModal}
                        style={{ marginLeft: "auto", padding: "8px 18px", borderRadius: 8, border: "none", background: "#ff8c00", color: "#fff", fontWeight: 600, cursor: isPlaying ? "not-allowed" : "pointer" }}
                      >
                        {isPlaying && currentExercise === idx + exercises.length && showModal ? "In Progress..." : "Start"}
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
        {activeTab === "Activity" && (
          <div style={{
            margin: "32px auto 0 auto",
            width: activitySubTab === 'GAMES' ? 940 : 650,
            background: "rgba(0,0,0,0.2)",
            borderRadius: 24,
            padding: 24,
            transition: 'width 0.3s ease-in-out'
          }}>
            {/* Sub-tabs for Activity */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 24 }}>
              <button
                onClick={() => setActivitySubTab('YOGA')}
                style={{
                  padding: '8px 24px',
                  borderRadius: 16,
                  border: 'none',
                  background: activitySubTab === 'YOGA' ? '#ff8c00' : 'rgba(255,255,255,0.08)',
                  color: activitySubTab === 'YOGA' ? '#fff' : '#e0e6ff',
                  fontWeight: 700,
                  fontSize: 18,
                  cursor: 'pointer',
                  boxShadow: activitySubTab === 'YOGA' ? '0 2px 12px rgba(80,0,120,0.10)' : 'none',
                  transition: 'background 0.2s',
                }}
              >
                YOGA
              </button>
              <button
                onClick={() => setActivitySubTab('MUSIC')}
                style={{
                  padding: '8px 24px',
                  borderRadius: 16,
                  border: 'none',
                  background: activitySubTab === 'MUSIC' ? '#ff8c00' : 'rgba(255,255,255,0.08)',
                  color: activitySubTab === 'MUSIC' ? '#fff' : '#e0e6ff',
                  fontWeight: 700,
                  fontSize: 18,
                  cursor: 'pointer',
                  boxShadow: activitySubTab === 'MUSIC' ? '0 2px 12px rgba(80,0,120,0.10)' : 'none',
                  transition: 'background 0.2s',
                }}
              >
                MUSIC
              </button>
              <button
                onClick={() => setActivitySubTab('GAMES')}
                style={{
                  padding: '8px 24px',
                  borderRadius: 16,
                  border: 'none',
                  background: activitySubTab === 'GAMES' ? '#ff8c00' : 'rgba(255,255,255,0.08)',
                  color: activitySubTab === 'GAMES' ? '#fff' : '#e0e6ff',
                  fontWeight: 700,
                  fontSize: 18,
                  cursor: 'pointer',
                  boxShadow: activitySubTab === 'GAMES' ? '0 2px 12px rgba(80,0,120,0.10)' : 'none',
                  transition: 'background 0.2s',
                }}
              >
                GAMES
              </button>
            </div>
            {activitySubTab === 'YOGA' && (
              <>
                <h2 style={{ textAlign: "center", marginBottom: 16 }}>Yoga</h2>
                {yogaExercises.map((ex, idx) => (
                  <div key={ex.name} style={{ marginBottom: 24, padding: 12, borderRadius: 12, background: "rgba(255,255,255,0.08)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                      <img src={ex.gif} alt={ex.name} style={{ width: 80, height: 80, borderRadius: 12, background: "#fff" }} />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 18 }}>{ex.name}</div>
                        <div style={{ fontSize: 14, color: "#e0e6ff" }}>
                          {ex.type === "reps" ? `${ex.reps} reps` : `${ex.duration} sec`}
                          {('focus' in ex) && ex.focus && <><br /><span style={{ color: '#ffe066', fontSize: 13 }}>{ex.focus}</span></>}
                        </div>
                      </div>
                      <button
                        onClick={() => startExercise(idx + exercises.length + coreStrengthExercises.length)}
                        disabled={isPlaying || showModal}
                        style={{ marginLeft: "auto", padding: "8px 18px", borderRadius: 8, border: "none", background: "#ff8c00", color: "#fff", fontWeight: 600, cursor: isPlaying ? "not-allowed" : "pointer" }}
                      >
                        {isPlaying && currentExercise === idx + exercises.length + coreStrengthExercises.length && showModal ? "In Progress..." : "Start"}
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}
            {activitySubTab === 'MUSIC' && (
              <>
                <h2 style={{ textAlign: "center", marginBottom: 16 }}>Music Player</h2>
                <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 16, padding: 24 }}>
                  {musicTracks.map((track, idx) => (
                    <div 
                      key={track.title}
                      style={{ 
                        marginBottom: 16, 
                        padding: 16, 
                        background: "rgba(255,255,255,0.05)",
                        borderRadius: 12,
                        display: "flex",
                        alignItems: "center",
                        gap: 16
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 4 }}>{track.title}</div>
                        <div style={{ fontSize: 14, color: "#e0e6ff" }}>{track.duration}</div>
                      </div>
                      {track.url.endsWith('.mp3') ? (
                        <audio controls style={{ width: 300, height: 50 }}>
                          <source src={track.url} type="audio/mp3" />
                          Your browser does not support the audio element.
                        </audio>
                      ) : (
                        <ReactPlayer
                          url={track.url}
                          controls
                          width="300px"
                          height="50px"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
            {activitySubTab === 'GAMES' && (
              <PianoGame />
            )}
          </div>
        )}
      </div>
      {/* Modal Overlay for Exercise - moved outside tab blocks */}
      {showModal && currentExercise !== null && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "rgba(0,0,0,0.6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }}>
          <div style={{
            background: "#fff",
            borderRadius: 24,
            padding: 40,
            minWidth: 400,
            minHeight: 400,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
            position: "relative"
          }}>
            {(() => {
              const allExercises = [...exercises, ...coreStrengthExercises, ...yogaExercises];
              const ex = allExercises[currentExercise];
              return (
                <>
                  <img src={ex.gif} alt={ex.name} style={{ width: 250, height: 220, borderRadius: 16, marginBottom: 24, objectFit: "contain" }} />
                  <div style={{ fontWeight: 700, fontSize: 24, color: "#333", marginBottom: 8 }}>{ex.name}</div>
                  <div style={{ fontSize: 18, color: "#555", marginBottom: 16 }}>
                    {ex.type === "reps"
                      ? `${ex.reps} reps`
                      : `${ex.duration} sec`}
                    {('focus' in ex) && ex.focus && <><br /><span style={{ color: '#ffe066', fontSize: 15 }}>{ex.focus}</span></>}
                  </div>
                </>
              );
            })()}
            {isPlaying && (
              <div style={{ color: "#333", fontWeight: 600, fontSize: 20 }}>
                Counting: {(() => {
                  // Find the current count for the exercise
                  // For time-based exercises, count up to duration
                  // For rep-based exercises, count up to reps
                  if (currentExercise !== null) {
                    const allExercises = [...exercises, ...coreStrengthExercises, ...yogaExercises];
                    const ex = allExercises[currentExercise];
                    const count = ex.type === "reps" ? ex.reps : ex.duration;
                    // Use a stateful counter for the modal
                    // We'll use a React state for modalCount
                    if (typeof modalCount !== 'undefined') {
                      return modalCount <= count ? modalCount : "Done!";
                    }
                  }
                  return null;
                })()}
              </div>
            )}
            {showAppreciation && (
              <div style={{ marginTop: 18, color: "#ffe066", fontWeight: 700, fontSize: 28, background: "#222", borderRadius: 8, padding: 12, textAlign: "center" }}>{showAppreciation}</div>
            )}
            <button onClick={closeModal} style={{ position: "absolute", top: 16, right: 16, background: "#eee", border: "none", borderRadius: "50%", width: 36, height: 36, fontSize: 20, cursor: "pointer" }}>×</button>
          </div>
        </div>
      )}
    </div>
  );
}
