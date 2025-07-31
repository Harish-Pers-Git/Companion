import React from "react";
import { useNavigate } from "react-router-dom";
import { useElectron } from "@/hooks/useElectron";
import ElectronTitleBar from "@/components/ElectronTitleBar";

export default function Index() {
  const navigate = useNavigate();
  const { isElectron } = useElectron();

  const handleClick = () => {
    navigate("/room");
  };

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        width: "100vw",
        overflow: "hidden",
        fontFamily: "'Quicksand', 'Nunito', Arial, sans-serif",
        background: "radial-gradient(circle at 20% 30%, #a259c6 0%, #e66465 100%)",
        paddingTop: isElectron ? "32px" : "0", // Add padding for title bar in Electron
      }}
    >
      <ElectronTitleBar />
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          zIndex: 0,
          opacity: 0.45,
          pointerEvents: 'none',
        }}
      >
        <source src="/Sunset.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video> 
      {/* Ribbons background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          width: "100%",
          height: "100%",
        }}
      >
        {/* Ribbons removed */}
      </div>

      {/* Centered content */}
      <div
        className="flex flex-col items-center justify-center text-center"
        style={{
          position: "relative",
          zIndex: 2,
          minHeight: "100vh",
          width: "100vw",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h1
          style={{
            color: "#fff",
            fontSize: "4rem",
            lineHeight: 1.1,
            fontWeight: 700,
            textShadow: "0 8px 32px rgba(80,0,120,0.25), 0 1.5px 0 #fff",
            fontFamily: "'Quicksand', 'Nunito', Arial, sans-serif",
          }}
        >
          The AI companion<br />who cares
        </h1>
        <p
          style={{
            color: "#fff",
            fontSize: "1.5rem",
            fontWeight: 700,
            textShadow: "0 4px 16px rgba(80,0,120,0.15)",
            fontFamily: "'Quicksand', 'Nunito', Arial, sans-serif",
            marginTop: "1rem",
          }}
        >
          Always here to listen and talk.<br />
          Always on your side
        </p>
        <button
          className="bg-white text-purple-700 font-semibold px-8 py-4 rounded-full text-lg shadow-lg hover:bg-purple-100 transition mt-8"
          style={{
            boxShadow: "0 8px 32px rgba(80,0,120,0.15)",
            fontFamily: "'Quicksand', 'Nunito', Arial, sans-serif",
            marginTop: "2rem",
          }}
          onClick={handleClick}
        >
          Start the companion
        </button>
      </div>
      {/* Google Fonts link in your index.html head:
      <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@700&family=Nunito:wght@700&display=swap" rel="stylesheet">
      */}
    </div>
  );
}
