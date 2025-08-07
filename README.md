# Asgore Boss Fight Game

Un gioco di combattimento contro Asgore ispirato a Undertale, sviluppato in React. Rivivi l'epico scontro finale contro il Re dei Mostri nelle profondità del Monte Ebott.

![Start Screen](../assets/game/start.png)

## 📖 Storia

Asgore Dreemurr, Re dei Mostri, deve raccogliere sette anime umane per spezzare la barriera che imprigiona il suo popolo nel Regno Sotterraneo. Tu sei l'ultimo umano caduto, e la tua anima è quella che manca. Lo scontro avviene nel Giardino dei Fiori Dorati, dove riposano i resti dei suoi figli Asriel e Chara.

## 🎮 Gameplay

![Asgore Normal](./assets/game/asgore.gif) ![Asgore Angry](./assets/game/asgore-angry.gif)

Sopravvivi agli attacchi di Asgore controllando il tuo cuore rosso:

![Heart](./assets/game/heart.png) **Cuore del Giocatore** - Muoviti con WASD

### Tipi di Attacco

![Flames](./assets/game/flames.png) **Fiamme Arancioni**
- 4 pattern: orizzontale, verticale, diagonale, circolare
- Le iconiche fiamme magiche di Asgore

![Star](./assets/game/star.png) **Stelle Magiche** 
- 3 formazioni: lineare, verticale, diagonale
- Magia antica dei Boss Monsters

![Mid Attack](./assets/game/mid.png) **Attacchi Medi**
- Proiettili rapidi che attraversano lo schermo
- Rappresentano l'esitazione di Asgore

**Zone Rosse** - Aree mortali che si alternano tra destra e sinistra

## 🎵 Audio

- `ost.mp3` - "ASGORE" battaglia finale
- `death.mp3` - Suono di game over  
- `danger.mp3` - Avviso zone pericolose
- `attack.mp3` - Attacchi del Re

## 🎬 Video Intro

- `start.mp4` - Sequenza narrativa introduttiva con le frasi:
  - *"Una strana luce riempie la stanza."*
  - *"Sei pieno di DETERMINAZIONE."*

## 🎯 Meccaniche

- **Difficoltà progressiva**: Gli attacchi diventano più frequenti e complessi
- **Sistema di Determinazione**: Continua anche dopo la sconfitta
- **Collision detection** pixel-perfect
- **Audio management** con loop della colonna sonora originale

## 🎮 Controlli

- **W, A, S, D** - Movimento del cuore
- **Click** - Interazione menu
- **Qualsiasi tasto** - Salta video intro

## 🚀 Installazione

\`\`\`bash
git clone [repository-url]
cd asgore-boss-fight
npm install
npm start
\`\`\`

## 📁 Struttura Assets

\`\`\`
./assets/game/
├── 🎵 Audio
│   ├── ost.mp3
│   ├── death.mp3
│   ├── danger.mp3
│   └── attack.mp3
├── 🎬 Video
│   └── start.mp4
└── 🖼️ Images
    ├── start.png
    ├── heart.png
    ├── asgore.gif
    ├── asgore-angry.gif
    ├── flames.png
    ├── star.png
    └── mid.png
\`\`\`

## 🏆 Obiettivo

Sopravvivi il più a lungo possibile! La difficoltà aumenta progressivamente riflettendo la crescente disperazione di Asgore nella sua lotta interiore tra dovere e compassione.

---

*"Non puoi arrenderti proprio ora... Sei pieno di **DETERMINAZIONE**!"* ❤️

**Un tributo a Toby Fox e al mondo di Undertale**
