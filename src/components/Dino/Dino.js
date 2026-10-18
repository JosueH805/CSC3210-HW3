import React, { useEffect, useRef, useState } from "react";
import "./Dino.css";

function Dino() {
  const dinoRef = useRef(null);
  const cactusRef = useRef(null);
  const birdRef = useRef(null);
  const jumpTimeoutRef = useRef(null);
  const scoreRef = useRef(0);
  const [score, setScore] = useState(0);

  const [highScore, setHighScore] = useState(() => {
    const savedHighScore = localStorage.getItem("dinoHighScore");
    return savedHighScore ? parseInt(savedHighScore, 10) : 0;
  });

  const [isDucking, setIsDucking] = useState(false);

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  const jump = () => {
    const dino = dinoRef.current;

    if (!dino || dino.classList.contains("jump")) {
      return;
    }

    dino.classList.add("jump");

    if (jumpTimeoutRef.current) {
      clearTimeout(jumpTimeoutRef.current);
    }

    jumpTimeoutRef.current = setTimeout(() => {
      dino.classList.remove("jump");
    }, 300);
  };

  useEffect(() => {
    const isAlive = setInterval(() => {
      const dino = dinoRef.current;
      const cactus = cactusRef.current;
      const bird = birdRef.current;

      if (!dino || !cactus || !bird) {
        return;
      }

      const dinoTop = parseInt(
        getComputedStyle(dino).getPropertyValue("top"),
        10
      );
      const cactusLeft = parseInt(
        getComputedStyle(cactus).getPropertyValue("left"),
        10
      );
      const birdLeft = parseInt(
        getComputedStyle(bird).getPropertyValue("left"),
        10
      );

      // Check collision with Cactus
      if (cactusLeft < 50 && cactusLeft > 0 && dinoTop >= 140) {
        handleGameOver();
        return;
      }

      // Check collision with Bird
      if (birdLeft < 50 && birdLeft > 0 && dinoTop <= 150) {
        handleGameOver();
        return;
      }

      setScore((previousScore) => previousScore + 1);
    }, 10);

    return () => clearInterval(isAlive);
  }, [highScore]);

  const handleGameOver = () => {
    const finalScore = scoreRef.current;

    if (finalScore > highScore) {
      setHighScore(finalScore);
      localStorage.setItem("dinoHighScore", finalScore);
      alert(`🎉 New High Score! ${finalScore}`);
    } else {
      alert(`Game Over! Your Score : ${finalScore} | High Score : ${highScore}`);
    }

    setScore(0);
    scoreRef.current = 0;
  };

  // Keyboard Event Listeners for Jump and Duck
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Space" || e.key === "ArrowUp") {
        jump();
      }
      if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") {
        setIsDucking(true);
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") {
        setIsDucking(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const isNight = Math.floor(score / 500) % 2 === 1;

  // Calculate dynamic speeds: decreases animation duration as score increases
  // Minimum duration caps at 0.5s for cactus and 1.2s for bird so it doesn't become impossible
 const cactusSpeed = Math.max(0.5, 1 - score / 5000);
  const birdSpeed = Math.max(1.2, 2.5 - score / 5000);

  return (
    <div className={`game ${isNight ? "night" : ""}`}>
      <div className="score-board">
        <div>Score : {score}</div>
        <div>High Score : {highScore}</div>
      </div>
      <div 
        id="dino" 
        ref={dinoRef} 
        className={isDucking ? "duck" : ""}
      ></div>
      {/* Pass dynamic animation speed via inline style */}
      <div 
        id="cactus" 
        ref={cactusRef} 
        style={{ animationDuration: `${cactusSpeed}s` }}
      ></div>
      <div 
        id="bird" 
        ref={birdRef} 
        style={{ animationDuration: `${birdSpeed}s` }}
      ></div>
    </div>
  );
}

export default Dino;