import { useState, useEffect } from "react";

const COLORS = {
  bg: "#F5F0EB",
  dark: "#2C1810",
  terra: "#B85042",
  wine: "#8B2252",
  olive: "#6B7B3A",
  blue: "#4A6FA5",
  gold: "#C89B3C",
  slate: "#64748B",
  white: "#FFFFFF",
  cream: "#F9F6F2",
};

const STEPS = [
  {
    id: "welcome",
    scene: "🇪🇸 Madride, šiltas rytas...",
    waiter: "¡Buenos días! Sveiki atvykę į mūsų restoraną!",
    instruction: "Jūs ką tik įėjote į restoraną Madride. Padavėjas jus pasitiko. Atsakykite ispaniškai!",
    question: "Kaip atsakote padavėjui?",
    options: [
      { text: "¡Buenos días! Estoy bien.", correct: true, feedback: "¡Perfecto! Puikus atsakymas!" },
      { text: "Buenas noches, gracias.", correct: false, feedback: "Hmm... dabar rytas, ne naktis! Turėtų būti 'Buenos días'." },
      { text: "Hola, estoy malo.", correct: false, feedback: "Oi! 'Malo' reiškia blogai. Geriau sakykite 'bien'!" },
    ],
  },
  {
    id: "drink",
    scene: "☕ Padavėjas paduoda meniu...",
    waiter: "¿Quieres beber algo?",
    instruction: "Padavėjas klausia ar norite ko nors gerti. Ką atsakote?",
    question: "Jūs norite kavos. Kaip pasakysite?",
    options: [
      { text: "Necesito un café, por favor.", correct: true, feedback: "¡Muy bien! Kava jau pakeliui!" },
      { text: "Quiero comer un café.", correct: false, feedback: "Atsargiai! Kavos geriame (beber), ne valgome (comer)!" },
      { text: "No quiero agua.", correct: false, feedback: "Tai neiginys apie vandenį, bet padavėjas klausė ką norite gerti!" },
    ],
  },
  {
    id: "size",
    scene: "☕ Padavėjas klausia daugiau...",
    waiter: "¡Perfecto! ¿Grande o pequeño?",
    instruction: "Padavėjas nori žinoti kokio dydžio kavą norite.",
    question: "Norite didelę kavą. Ką sakote?",
    options: [
      { text: "Grande, por favor.", correct: true, feedback: "¡Genial! Didelė kava — geras pasirinkimas!" },
      { text: "Pequeño, gracias.", correct: false, feedback: "Pequeño = mažas. Bet jūs norėjote didelę!" },
      { text: "Bueno café.", correct: false, feedback: "Tai reiškia 'gera kava', bet padavėjas klausė apie dydį!" },
    ],
  },
  {
    id: "food",
    scene: "🍳 Padavėjas rodo pusryčių meniu...",
    waiter: "¿Quieres comer? Tenemos un desayuno muy bueno.",
    instruction: "Padavėjas siūlo pusryčius. Jūs alkanas/a!",
    question: "Norite valgyti pusryčius. Kaip pasakysite?",
    options: [
      { text: "Sí, quiero comer. Mi desayuno, por favor.", correct: true, feedback: "¡Perfecto! Pusryčiai jau ruošiami!" },
      { text: "No quiero comer ahora.", correct: false, feedback: "Bet jūs alkanas! 'No quiero comer' reiškia nenoriu valgyti." },
      { text: "Necesito beber comida.", correct: false, feedback: "Oi! Maisto valgome (comer), ne geriame (beber)!" },
    ],
  },
  {
    id: "opinion",
    scene: "😋 Maistas atkeliauja...",
    waiter: "¡Aquí está! ¿Es bueno?",
    instruction: "Padavėjas atnešė maistą ir klausia ar skanu!",
    question: "Maistas puikus! Ką sakote?",
    options: [
      { text: "¡Sí, es muy bueno! Me gusta mucho.", correct: true, feedback: "¡Increíble! Padavėjas labai patenkintas!" },
      { text: "Es malo, gracias.", correct: false, feedback: "Malo = blogai. Bet maistas buvo puikus!" },
      { text: "Mi casa es grande.", correct: false, feedback: "Ha! Tai tiesa, bet padavėjas klausė apie maistą, ne jūsų namus!" },
    ],
  },
  {
    id: "goodbye",
    scene: "👋 Laikas atsisveikinti...",
    waiter: "¡Gracias! ¿Estás contento?",
    instruction: "Padavėjas dėkoja ir klausia ar esate patenkintas/a.",
    question: "Esate labai patenkintas/a. Kaip atsisveikinate?",
    options: [
      { text: "¡Sí, estoy muy contento! ¡Hasta pronto!", correct: true, feedback: "¡Perfecto! Padavėjas kviečia sugrįžti!" },
      { text: "Estoy enfermo. Hasta luego.", correct: false, feedback: "Enfermo = sergantis. Tikimės, kad ne nuo maisto! 😄" },
      { text: "No estoy bien. Adiós.", correct: false, feedback: "Bet jums viskas patiko! 'No estoy bien' reiškia man negerai." },
    ],
  },
];

function shuffleOptions(options) {
  const arr = [...options];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function RestaurantGame() {
  const [step, setStep] = useState(-1);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState([]);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (step >= 0 && step < STEPS.length) {
      setShuffledOptions(shuffleOptions(STEPS[step].options));
    }
  }, [step]);

  useEffect(() => {
    if (step >= -1) {
      setAnimate(true);
      const t = setTimeout(() => setAnimate(false), 500);
      return () => clearTimeout(t);
    }
  }, [step]);

  const handleSelect = (idx) => {
    if (showFeedback) return;
    setSelected(idx);
    setShowFeedback(true);
    if (shuffledOptions[idx].correct) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    setSelected(null);
    setShowFeedback(false);
    setStep((s) => s + 1);
  };

  const handleRestart = () => {
    setStep(-1);
    setScore(0);
    setSelected(null);
    setShowFeedback(false);
  };

  // WELCOME SCREEN
  if (step === -1) {
    return (
      <div style={{ minHeight: "100vh", background: COLORS.bg, fontFamily: "Georgia, serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={{ background: COLORS.white, borderRadius: 16, padding: "40px 32px", maxWidth: 500, width: "100%", boxShadow: "0 4px 24px rgba(44,24,16,0.12)", textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🇪🇸</div>
          <h1 style={{ fontFamily: "Georgia, serif", color: COLORS.dark, fontSize: 28, margin: "0 0 4px" }}>SPANGOLITA</h1>
          <div style={{ color: COLORS.terra, fontSize: 14, fontFamily: "Calibri, sans-serif", letterSpacing: 3, marginBottom: 20 }}>I N T E R A K T Y V U S  Ž A I D I M A S</div>
          <div style={{ width: 60, height: 3, background: COLORS.terra, margin: "0 auto 20px", borderRadius: 2 }}></div>
          <h2 style={{ fontFamily: "Georgia, serif", color: COLORS.dark, fontSize: 22, margin: "0 0 12px" }}>Restorane Madride</h2>
          <p style={{ color: COLORS.slate, fontFamily: "Calibri, sans-serif", fontSize: 15, lineHeight: 1.6, margin: "0 0 24px" }}>
            Jūs ką tik atėjote į restoraną Madride! Padavėjas kalba ispaniškai, ir jūs turite užsakyti maistą ir gėrimus naudodami tik tai, ką jau išmokote.
            <br /><br />
            <strong>6 situacijos</strong> — kiekviena su 3 atsakymų variantais.<br />
            Pasirinkite teisingą frazę ispaniškai!
          </p>
          <button
            onClick={() => setStep(0)}
            style={{ background: COLORS.terra, color: COLORS.white, border: "none", borderRadius: 10, padding: "14px 40px", fontSize: 17, fontFamily: "Georgia, serif", cursor: "pointer", transition: "background 0.2s" }}
            onMouseOver={(e) => (e.target.style.background = COLORS.wine)}
            onMouseOut={(e) => (e.target.style.background = COLORS.terra)}
          >
            ¡Vamos! Pradėkime!
          </button>
        </div>
      </div>
    );
  }

  // RESULTS SCREEN
  if (step >= STEPS.length) {
    const pct = Math.round((score / STEPS.length) * 100);
    const stars = score >= 5 ? "⭐⭐⭐" : score >= 3 ? "⭐⭐" : "⭐";
    const msg =
      score === 6 ? "¡INCREÍBLE! Tobulas rezultatas! Jūs tikras ispanas!" :
      score >= 4 ? "¡Muy bien! Puikus rezultatas! Dar šiek tiek praktikos ir būsite tobuli!" :
      score >= 2 ? "¡Bien! Geras pradžia! Pakartokite L3 žodyną ir bandykite dar kartą." :
      "¡Ánimo! Nesijaudinkite — pakartokite žodyną ir grįžkite!";

    return (
      <div style={{ minHeight: "100vh", background: COLORS.bg, fontFamily: "Georgia, serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={{ background: COLORS.white, borderRadius: 16, padding: "40px 32px", maxWidth: 500, width: "100%", boxShadow: "0 4px 24px rgba(44,24,16,0.12)", textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>{stars}</div>
          <h2 style={{ color: COLORS.dark, fontSize: 26, margin: "0 0 8px" }}>Jūsų rezultatas</h2>
          <div style={{ width: 60, height: 3, background: COLORS.gold, margin: "0 auto 20px", borderRadius: 2 }}></div>
          <div style={{ fontSize: 64, fontWeight: "bold", color: COLORS.terra, margin: "0 0 8px" }}>{score}/{STEPS.length}</div>
          <div style={{ color: COLORS.slate, fontSize: 16, fontFamily: "Calibri, sans-serif", marginBottom: 8 }}>{pct}% teisingai</div>
          <div style={{
            background: COLORS.cream, borderRadius: 10, padding: 16, margin: "16px 0 24px",
            color: COLORS.dark, fontFamily: "Calibri, sans-serif", fontSize: 15, lineHeight: 1.5
          }}>
            {msg}
          </div>
          <button
            onClick={handleRestart}
            style={{ background: COLORS.olive, color: COLORS.white, border: "none", borderRadius: 10, padding: "12px 36px", fontSize: 16, fontFamily: "Georgia, serif", cursor: "pointer", transition: "background 0.2s" }}
            onMouseOver={(e) => (e.target.style.background = COLORS.blue)}
            onMouseOut={(e) => (e.target.style.background = COLORS.olive)}
          >
            Žaisti dar kartą
          </button>
        </div>
        <div style={{ marginTop: 16, color: COLORS.slate, fontFamily: "Calibri, sans-serif", fontSize: 12 }}>spangolita.com • 3 pamoka</div>
      </div>
    );
  }

  // GAME SCREEN
  const current = STEPS[step];
  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, fontFamily: "Calibri, sans-serif", display: "flex", flexDirection: "column", alignItems: "center", padding: "20px 16px" }}>
      {/* Progress bar */}
      <div style={{ maxWidth: 520, width: "100%", marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: COLORS.slate, marginBottom: 4 }}>
          <span>Situacija {step + 1} iš {STEPS.length}</span>
          <span>{score} ✓</span>
        </div>
        <div style={{ height: 6, background: COLORS.cream, borderRadius: 3, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${progress}%`, background: `linear-gradient(90deg, ${COLORS.terra}, ${COLORS.gold})`, borderRadius: 3, transition: "width 0.4s" }}></div>
        </div>
      </div>

      <div style={{
        background: COLORS.white, borderRadius: 16, maxWidth: 520, width: "100%",
        boxShadow: "0 4px 24px rgba(44,24,16,0.10)",
        opacity: animate ? 0.7 : 1, transform: animate ? "translateY(8px)" : "none",
        transition: "opacity 0.3s, transform 0.3s",
        overflow: "hidden"
      }}>
        {/* Scene */}
        <div style={{ background: COLORS.dark, padding: "14px 20px", color: COLORS.white, fontSize: 14, letterSpacing: 1 }}>
          {current.scene}
        </div>

        {/* Waiter speech bubble */}
        <div style={{ padding: "20px 24px 0" }}>
          <div style={{
            background: COLORS.cream, borderRadius: 12, padding: "14px 18px",
            borderLeft: `4px solid ${COLORS.olive}`, marginBottom: 12
          }}>
            <div style={{ fontSize: 11, color: COLORS.olive, fontWeight: "bold", marginBottom: 4 }}>🧑‍🍳 PADAVĖJAS</div>
            <div style={{ fontSize: 17, color: COLORS.dark, fontFamily: "Georgia, serif", fontStyle: "italic" }}>{current.waiter}</div>
          </div>
          <p style={{ color: COLORS.slate, fontSize: 13, margin: "0 0 6px", lineHeight: 1.4 }}>{current.instruction}</p>
          <p style={{ color: COLORS.dark, fontSize: 15, fontWeight: "bold", margin: "0 0 16px" }}>{current.question}</p>
        </div>

        {/* Options */}
        <div style={{ padding: "0 24px 24px" }}>
          {shuffledOptions.map((opt, idx) => {
            let bg = COLORS.white;
            let border = `2px solid #E8E2DA`;
            let color = COLORS.dark;

            if (showFeedback) {
              if (opt.correct) {
                bg = "#E8F5E9";
                border = `2px solid ${COLORS.olive}`;
              } else if (idx === selected && !opt.correct) {
                bg = "#FFEBEE";
                border = `2px solid ${COLORS.terra}`;
              }
            } else if (idx === selected) {
              border = `2px solid ${COLORS.blue}`;
              bg = "#F0F4FA";
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                style={{
                  display: "block", width: "100%", textAlign: "left",
                  background: bg, border, borderRadius: 10, padding: "12px 16px",
                  marginBottom: 10, cursor: showFeedback ? "default" : "pointer",
                  fontSize: 15, color, fontFamily: "Calibri, sans-serif",
                  transition: "all 0.2s", lineHeight: 1.4
                }}
              >
                <strong style={{ color: COLORS.terra }}>{opt.text}</strong>
              </button>
            );
          })}

          {/* Feedback */}
          {showFeedback && selected !== null && (
            <div style={{
              background: shuffledOptions[selected].correct ? "#E8F5E9" : "#FFF3E0",
              borderRadius: 10, padding: "12px 16px", marginBottom: 12,
              fontSize: 14, color: COLORS.dark, lineHeight: 1.4,
              borderLeft: `4px solid ${shuffledOptions[selected].correct ? COLORS.olive : COLORS.gold}`
            }}>
              {shuffledOptions[selected].correct ? "✅ " : "💡 "}{shuffledOptions[selected].feedback}
            </div>
          )}

          {showFeedback && (
            <button
              onClick={handleNext}
              style={{
                background: COLORS.terra, color: COLORS.white, border: "none",
                borderRadius: 10, padding: "12px 0", width: "100%",
                fontSize: 15, fontFamily: "Georgia, serif", cursor: "pointer",
                transition: "background 0.2s"
              }}
              onMouseOver={(e) => (e.target.style.background = COLORS.wine)}
              onMouseOut={(e) => (e.target.style.background = COLORS.terra)}
            >
              {step < STEPS.length - 1 ? "Toliau →" : "Žiūrėti rezultatus →"}
            </button>
          )}
        </div>
      </div>

      <div style={{ marginTop: 12, color: COLORS.slate, fontSize: 11 }}>spangolita.com • 3 pamoka — Restorane Madride</div>
    </div>
  );
}
