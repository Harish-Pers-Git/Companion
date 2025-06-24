import React, { useState, useRef, useEffect } from "react";
import { FaComments, FaBrain, FaBook, FaUser, FaThumbtack, FaBars, FaUserFriends, FaRunning, FaHeartbeat } from "react-icons/fa";
import { GiArtificialIntelligence, GiDuration } from "react-icons/gi"; // For Activities
import { useNavigate } from "react-router-dom";

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

export default function CompanionRoom() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Companion");
  const [currentExercise, setCurrentExercise] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showAppreciation, setShowAppreciation] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [physicalSubTab, setPhysicalSubTab] = useState('Warm-Up');
  const [yogaSubTab, setYogaSubTab] = useState('YOGA');
  const [activitySubTab, setActivitySubTab] = useState('YOGA');

  // Ref to always have the latest showModal value
  const showModalRef = useRef(showModal);
  useEffect(() => {
    showModalRef.current = showModal;
  }, [showModal]);

  // Add sample music tracks (you can replace these with your actual music files)
  const musicTracks = [
    {
      title: "Calm Meditation",
      file: "/music/meditation.mp3",
      duration: "5:30"
    },
    {
      title: "Peaceful Yoga Flow",
      file: "/music/yoga-flow.mp3",
      duration: "6:15"
    },
    {
      title: "Mindful Breathing",
      file: "/music/breathing.mp3",
      duration: "4:45"
    }
  ];

  const startExercise = (idx: number) => {
    setCurrentExercise(idx);
    setIsPlaying(true);
    setShowAppreciation(null);
    setShowModal(true);
    const allExercises = [...exercises, ...coreStrengthExercises, ...yogaExercises];
    const ex = allExercises[idx];
    const count = ex.type === "reps" ? ex.reps! : ex.duration!;
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
  };

  const closeModal = () => {
    window.speechSynthesis.cancel(); // Stop any ongoing speech
    setShowModal(false);
    setCurrentExercise(null);
    setIsPlaying(false);
    setShowAppreciation(null);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #5a7be7 0%, #3b4cb1 100%)",
        color: "#fff",
        fontFamily: "Quicksand, Nunito, Arial, sans-serif",
        position: "relative",
      }}
    >
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
            background: "rgba(60,70,150,0.4)",
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
            background: "rgba(60,70,150,0.4)",
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
                background: activeTab === tab.name ? "#6c7ee1" : "transparent",
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
            background: "rgba(60,70,150,0.4)",
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
      <div style={{ display: "flex", justifyContent: "left", width: "100%" }}>
        {activeTab === "Companion" && (
          <div style={{ marginLeft: 60, marginBottom: 0 }}>
            <img
              src="/3d.png"
              alt="Avatar"
              style={{ width: 220, borderRadius: "50%" }}
              
            />
          </div>
        )}
        {activeTab === "Physical" && (
          <div style={{ margin: "32px auto 0 auto", width: 650, background: "rgba(60,70,150,0.2)", borderRadius: 24, padding: 24 }}>
            {/* Sub-tabs for Physical */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 24 }}>
              <button
                onClick={() => setPhysicalSubTab('Warm-Up')}
                style={{
                  padding: '8px 24px',
                  borderRadius: 16,
                  border: 'none',
                  background: physicalSubTab === 'Warm-Up' ? '#6c7ee1' : 'rgba(255,255,255,0.08)',
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
                  background: physicalSubTab === 'Core Functional Strength' ? '#6c7ee1' : 'rgba(255,255,255,0.08)',
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
                        style={{ marginLeft: "auto", padding: "8px 18px", borderRadius: 8, border: "none", background: "#6c7ee1", color: "#fff", fontWeight: 600, cursor: isPlaying ? "not-allowed" : "pointer" }}
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
                        style={{ marginLeft: "auto", padding: "8px 18px", borderRadius: 8, border: "none", background: "#6c7ee1", color: "#fff", fontWeight: 600, cursor: isPlaying ? "not-allowed" : "pointer" }}
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
          <div style={{ margin: "32px auto 0 auto", width: 650, background: "rgba(60,70,150,0.2)", borderRadius: 24, padding: 24 }}>
            {/* Sub-tabs for Activity */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 24 }}>
              <button
                onClick={() => setActivitySubTab('YOGA')}
                style={{
                  padding: '8px 24px',
                  borderRadius: 16,
                  border: 'none',
                  background: activitySubTab === 'YOGA' ? '#6c7ee1' : 'rgba(255,255,255,0.08)',
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
                  background: activitySubTab === 'MUSIC' ? '#6c7ee1' : 'rgba(255,255,255,0.08)',
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
                        style={{ marginLeft: "auto", padding: "8px 18px", borderRadius: 8, border: "none", background: "#6c7ee1", color: "#fff", fontWeight: 600, cursor: isPlaying ? "not-allowed" : "pointer" }}
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
                      <audio
                        controls
                        style={{
                          backgroundColor: "transparent",
                          borderRadius: 20,
                        }}
                      >
                        <source src={track.file} type="audio/mp3" />
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  ))}
                </div>
              </>
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
            minWidth: 350,
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
                  <img src={ex.gif} alt={ex.name} style={{ width: 220, height: 220, borderRadius: 16, marginBottom: 24, objectFit: "contain" }} />
                  <div style={{ fontWeight: 700, fontSize: 24, color: "#3b4cb1", marginBottom: 8 }}>{ex.name}</div>
                  <div style={{ fontSize: 18, color: "#5a7be7", marginBottom: 16 }}>
                    {ex.type === "reps"
                      ? `${ex.reps} reps`
                      : `${ex.duration} sec`}
                    {('focus' in ex) && ex.focus && <><br /><span style={{ color: '#ffe066', fontSize: 15 }}>{ex.focus}</span></>}
                  </div>
                </>
              );
            })()}
            {isPlaying && <div style={{ color: "#3b4cb1", fontWeight: 600, fontSize: 20 }}>Counting...</div>}
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
