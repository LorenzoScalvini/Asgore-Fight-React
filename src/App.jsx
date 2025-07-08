import { useEffect, useRef, useState } from "react";
import styles from "./App.module.css";

const FLAME_SIZE = 20;
const HEART_SIZE = 20;
const BOX_SIZE = 300;

const initialFlames = [
  { id: 1, x: -80, y: 30, dx: 2.2, dy: 0 },
  { id: 2, x: BOX_SIZE + 80, y: 90, dx: -2.5, dy: 0 },
  { id: 3, x: 60, y: -70, dx: 0, dy: 2.0 },
  { id: 4, x: 130, y: BOX_SIZE + 90, dx: 0, dy: -2.3 },
  { id: 5, x: -100, y: 60, dx: 2.4, dy: 0.2 },
  { id: 6, x: BOX_SIZE + 100, y: 120, dx: -2.7, dy: -0.1 },
  { id: 7, x: 90, y: -90, dx: -0.1, dy: 2.1 },
  { id: 8, x: 160, y: BOX_SIZE + 110, dx: 0.1, dy: -2.4 },
  { id: 9, x: -60, y: 150, dx: 2.0, dy: -0.2 },
  { id: 10, x: BOX_SIZE + 60, y: 30, dx: -2.2, dy: 0.3 },
  { id: 11, x: 10, y: -100, dx: 0.2, dy: 2.3 },
  { id: 12, x: 200, y: BOX_SIZE + 60, dx: -0.2, dy: -2.0 },
  { id: 13, x: -120, y: 10, dx: 2.6, dy: 0.1 },
  { id: 14, x: BOX_SIZE + 120, y: 160, dx: -2.8, dy: -0.3 },
  { id: 15, x: 180, y: -110, dx: -0.3, dy: 2.2 },
  { id: 16, x: 100, y: BOX_SIZE + 130, dx: 0.3, dy: -2.5 },
];

const phrases = [
  "It seems your journey is finally over",
  "Do not be afraid. I will not harm you.",
  "I am sure you have questions. I will do my best to answer them.",
  "You... you are trying to talk to me, aren't you?",
  "I... I see. You are trying to make this easier for me, aren't you?",
  "I... I understand. You wish to be free. I will give you my soul.",
];

export default function App() {
  const [position, setPosition] = useState({ x: 90, y: 90 });
  const keys = useRef({ w: false, a: false, s: false, d: false });
  const [flames, setFlames] = useState(initialFlames);
  const [gameState, setGameState] = useState("loading");
  const [countdown, setCountdown] = useState(3);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [zoneActive, setZoneActive] = useState(false);
  const [zoneCountdown, setZoneCountdown] = useState(3);
  const [redZoneOnRight, setRedZoneOnRight] = useState(true);
  const [redZoneDeadly, setRedZoneDeadly] = useState(false);
  const intervalRef = useRef(null);
  const phraseIntervalRef = useRef(null);
  const zoneIntervalRef = useRef(null);
  const zoneTimerRef = useRef(null);

  const ostRef = useRef(null);
  const deathRef = useRef(null);
  const dangerRef = useRef(null);

  useEffect(() => {
    if (!ostRef.current || !deathRef.current || !dangerRef.current) return;

    if (gameState === "fight" || gameState === "countdown") {
      ostRef.current.volume = 0.1;
      ostRef.current.loop = true;
      ostRef.current.play().catch(() => {});
      deathRef.current.pause();
      deathRef.current.currentTime = 0;
      dangerRef.current.pause();
      dangerRef.current.currentTime = 0;
    }

    if (gameState === "gameover") {
      ostRef.current.pause();
      deathRef.current.currentTime = 0;
      deathRef.current.play().catch(() => {});
      dangerRef.current.pause();
      dangerRef.current.currentTime = 0;
    }

    if (gameState === "menu" || gameState === "loading") {
      ostRef.current.pause();
      ostRef.current.currentTime = 0;
      deathRef.current.pause();
      deathRef.current.currentTime = 0;
      dangerRef.current.pause();
      dangerRef.current.currentTime = 0;
    }
  }, [gameState]);

  // Initial loading
  useEffect(() => {
    if (gameState === "loading") {
      const timer = setTimeout(() => setGameState("menu"), 1500);
      return () => clearTimeout(timer);
    }
  }, [gameState]);

  // Movement
  useEffect(() => {
    if (gameState !== "fight") return;

    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      if (["w", "a", "s", "d"].includes(key)) keys.current[key] = true;
    };
    const handleKeyUp = (e) => {
      const key = e.key.toLowerCase();
      if (["w", "a", "s", "d"].includes(key)) keys.current[key] = false;
    };

    const move = () => {
      setPosition((prev) => {
        const speed = 2.2;
        let { x, y } = prev;

        if (keys.current.w) y -= speed;
        if (keys.current.s) y += speed;
        if (keys.current.a) x -= speed;
        if (keys.current.d) x += speed;

        x = Math.max(0, Math.min(BOX_SIZE - HEART_SIZE, x));
        y = Math.max(0, Math.min(BOX_SIZE - HEART_SIZE, y));

        return { x, y };
      });

      setFlames((prevFlames) => {
        const newFlames = prevFlames.map((flame) => {
          let newX = flame.x + flame.dx;
          let newY = flame.y + flame.dy;

          if (flame.dx > 0 && newX > BOX_SIZE + 100) newX = -100 - FLAME_SIZE;
          if (flame.dx < 0 && newX < -100 - FLAME_SIZE) newX = BOX_SIZE + 100;
          if (flame.dy > 0 && newY > BOX_SIZE + 100) newY = -100 - FLAME_SIZE;
          if (flame.dy < 0 && newY < -100 - FLAME_SIZE) newY = BOX_SIZE + 100;

          return { ...flame, x: newX, y: newY };
        });

        for (let flame of newFlames) {
          if (
            flame.x < position.x + HEART_SIZE &&
            flame.x + FLAME_SIZE > position.x &&
            flame.y < position.y + HEART_SIZE &&
            flame.y + FLAME_SIZE > position.y
          ) {
            setGameState("gameover");
            break;
          }
        }

        if (redZoneDeadly) {
          const inRedZone = redZoneOnRight 
            ? position.x > BOX_SIZE / 2 
            : position.x < BOX_SIZE / 2;
            
          if (inRedZone) {
            setGameState("gameover");
          }
        }

        return newFlames;
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    intervalRef.current = setInterval(move, 16);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      clearInterval(intervalRef.current);
    };
  }, [gameState, position, redZoneDeadly, redZoneOnRight]);

  // Countdown
  const startCountdown = () => {
    setCountdown(3);
    setGameState("countdown");
  };

  useEffect(() => {
    if (gameState !== "countdown") return;

    if (countdown === 0) {
      setGameState("fight");
      return;
    }

    const timeout = setTimeout(() => {
      setCountdown((c) => c - 1);
    }, 500);

    return () => clearTimeout(timeout);
  }, [countdown, gameState]);

  useEffect(() => {
    if (gameState !== "fight") {
      clearInterval(zoneIntervalRef.current);
      clearTimeout(zoneTimerRef.current);
      setZoneActive(false);
      setRedZoneDeadly(false);
      if (dangerRef.current) {
        dangerRef.current.pause();
        dangerRef.current.currentTime = 0;
      }
      return;
    }

    const activateZone = () => {
      setRedZoneOnRight(prev => !prev);
      setZoneActive(true);
      setRedZoneDeadly(false);
      setZoneCountdown(3);
      
      if (dangerRef.current) {
        dangerRef.current.currentTime = 0;
        dangerRef.current.play().catch(e => console.log("Audio play error:", e));
      }

      setTimeout(() => {
        setRedZoneDeadly(true);
      }, 3000);

      zoneTimerRef.current = setTimeout(() => {
        setZoneActive(false);
        setRedZoneDeadly(false);
      }, 3500);

      const countdownInterval = setInterval(() => {
        setZoneCountdown((prev) => {
          if (prev <= 0) {
            clearInterval(countdownInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    };

    const initialDelay = setTimeout(() => {
      activateZone();
      zoneIntervalRef.current = setInterval(activateZone, 5000);
    }, 5000);

    return () => {
      clearInterval(zoneIntervalRef.current);
      clearTimeout(zoneTimerRef.current);
      clearTimeout(initialDelay);
    };
  }, [gameState]);

  useEffect(() => {
    if (gameState !== "fight" && gameState !== "countdown") {
      clearInterval(phraseIntervalRef.current);
      return;
    }

    phraseIntervalRef.current = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
    }, 7000);

    return () => clearInterval(phraseIntervalRef.current);
  }, [gameState]);

  const startFight = () => {
    setPosition({ x: 90, y: 90 });
    keys.current = { w: false, a: false, s: false, d: false };
    setFlames(initialFlames);
    setPhraseIndex(0);
    setZoneActive(false);
    setRedZoneDeadly(false);
    setRedZoneOnRight(true);
    if (ostRef.current) {
      ostRef.current.currentTime = 0;
    }
    if (dangerRef.current) {
      dangerRef.current.pause();
      dangerRef.current.currentTime = 0;
    }
    startCountdown();
  };

  return (
    <div className={styles.container}>
      <audio ref={ostRef} src="ost.mp3" />
      <audio ref={deathRef} src="death.mp3" />
      <audio ref={dangerRef} src="danger.mp3" />

      {gameState === "loading" && (
        <div className={styles.countdownText} style={{ userSelect: "none" }}></div>
      )}

      {(gameState === "menu" || gameState === "gameover") && (
        <div className={gameState === "menu" ? styles.menu : styles.retryMenu}>
         {gameState === "gameover" && <div className={styles.retryText}>You cannot give up just yet...</div>}

          <img src="start.png" alt="Start Image" className={styles.startImage} />

          <button onClick={startFight} className={styles.menuButton}>
            <img src="heart.png" alt="Heart" className={styles.menuHeart} />
            Start
          </button>
        </div>
      )}

      {(gameState === "fight" || gameState === "countdown") && (
        <div className={styles.gameWrapper}>
          <img src="asgore.gif" alt="Asgore" className={styles.asgore} />
          <div className={styles.phraseBox}>
            <p className={styles.phrase}>{phrases[phraseIndex]}</p>
          </div>
          <div className={styles.box}>
            {zoneActive && (
              <>
                <div 
                  className={styles.greenZone} 
                  style={{
                    left: redZoneOnRight ? 0 : '50%',
                    right: redZoneOnRight ? '50%' : 0
                  }}
                ></div>
                <div 
                  className={`${styles.redZone} ${redZoneDeadly ? styles.deadly : ''}`}
                  style={{
                    left: redZoneOnRight ? '50%' : 0,
                    right: redZoneOnRight ? 0 : '50%'
                  }}
                >
                  {zoneCountdown > 0 && (
                    <div className={styles.zoneCountdown}>{zoneCountdown}</div>
                  )}
                </div>
              </>
            )}
            <img
              src="heart.png"
              alt="Heart"
              className={styles.heart}
              style={{ top: position.y, left: position.x }}
            />
            {flames.map((flame) => (
              <img
                key={flame.id}
                src="flames.png"
                alt="Flame"
                className={styles.flame}
                style={{ top: flame.y, left: flame.x }}
                draggable={false}
              />
            ))}
            {gameState === "countdown" && (
              <div className={styles.countdownText}>
                {countdown === 0 ? "" : countdown}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};