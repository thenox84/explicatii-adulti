# explicatii-adulti

Filme explicative animate pentru adulți fără pregătire tehnică.

## How an AI Agent Builds an iPhone App

Film animat în stil desen animat (~10 minute), narat în engleză, cu subtitrări.
Urmărește drumul unui mesaj — „fă-mi o aplicație de iPhone cu rețetele familiei” —
până la aplicația gata: ce este modelul de limbaj, bucla agentului, masa de lucru
(contextul), planul, ajutoarele (subagenții), uneltele, erorile și reparațiile,
verificarea, siguranța și controlul omului.

Vizionare: https://thenox84.github.io/explicatii-adulti/

- La deschidere: butonul ▶ pornește filmul cu sunet. Fără niciun clic, după câteva
  secunde filmul pornește singur, fără sunet (butonul „Sound” din dreapta-jos îl activează).
- Spațiu sau o atingere pe ecran — pauză / reluare; bara de jos — sărire la capitole;
  săgețile stânga/dreapta — 5 secunde înapoi/înainte.
- La final rămâne pe recapitulare și reîncepe după ~15 secunde.

Prima versiune (doar imagini și subtitrări în română) este în `v1.html`.

### Structură

- `index.html` — pagina; `js/core.js`, `js/rigs.js` (personaje articulate),
  `js/props.js` (recuzită), `js/backgrounds.js` (decoruri), `js/scenes/sNN.js` (scenele),
  `js/player.js` (cronologie, sunet, subtitrări, controale).
- `js/script.js` — textul narațiunii; `audio/narration.mp3` și `js/timing.js` se
  generează cu `tools/make_narration.py`.

### Vocile

Narațiunea este generată cu modelul de voce liber **Kokoro-82M** (licență Apache-2.0):
naratorul — vocea `bm_george`; personajele — `am_michael` (Tudor), `af_heart` (agentul),
`bf_emma`, `af_bella` (ajutoarele, chatbotul).
