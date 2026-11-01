# explicatii-adulti

Filme explicative animate, în limba română, pentru adulți fără pregătire tehnică.

## Cum construiește un agent AI o aplicație de iPhone

Film animat (~12 minute), doar cu imagini și subtitrări, fără sunet.
Pornește singur la deschiderea paginii și merge până la capăt; la final rămâne pe
schema de recapitulare și, după ~15 secunde, reîncepe.

Vizionare: https://thenox84.github.io/explicatii-adulti/

Comenzi discrete (opționale):
- **Spațiu** sau o atingere pe ecran — pauză / reluare;
- **bara de jos** — clic pe un semn pentru a sări la un capitol;
- **săgeți stânga/dreapta** — înapoi/înainte 5 secunde.

Tehnic: un singur fișier `index.html` (HTML/CSS/JS + SVG), fără server și fără
biblioteci externe. Toate animațiile sunt calculate dintr-o singură cronologie,
deci sărirea la orice capitol arată corect scena respectivă.
