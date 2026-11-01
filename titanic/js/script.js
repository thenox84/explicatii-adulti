/* Titanic: Practically Unsinkable — scenariul (engleză).
   who = cod personaj (vezi voices); say = textul rostit, dacă diferă; pause = liniște înainte (s);
   gag = ce arată animația în timpul replicii; visual = decorul și gagul principal al scenei. */
window.SCRIPT = {
 "title": "Titanic: Practically Unsinkable",
 "voices": {
  "N": {
   "voice": "bm_george",
   "lang": "en-gb",
   "speed": 1.0,
   "name": ""
  },
  "C": {
   "voice": "bm_lewis",
   "lang": "en-gb",
   "speed": 0.97,
   "name": "Captain",
   "color": "#FFE08A"
  },
  "O": {
   "voice": "bm_daniel",
   "lang": "en-gb",
   "speed": 1.0,
   "name": "Owner",
   "color": "#FFB199"
  },
  "S": {
   "voice": "bm_fable",
   "lang": "en-gb",
   "speed": 1.0,
   "name": "Shipbuilder",
   "color": "#9FD8FF"
  },
  "L": {
   "voice": "am_michael",
   "lang": "en-us",
   "speed": 1.0,
   "name": "Lookout",
   "color": "#A8F0C6"
  },
  "W": {
   "voice": "am_puck",
   "lang": "en-us",
   "speed": 1.04,
   "name": "Wireless operator",
   "color": "#D0B0FF"
  },
  "P": {
   "voice": "bf_emma",
   "lang": "en-gb",
   "speed": 1.0,
   "name": "Lady",
   "color": "#FFA8D0"
  },
  "I": {
   "voice": "am_onyx",
   "lang": "en-us",
   "speed": 0.92,
   "name": "Iceberg",
   "color": "#B8F3FF"
  },
  "F": {
   "voice": "am_eric",
   "lang": "en-us",
   "speed": 1.0,
   "name": "Officer",
   "color": "#C9D3FF"
  },
  "R": {
   "voice": "am_echo",
   "lang": "en-us",
   "speed": 0.98,
   "name": "Rescue captain",
   "color": "#FFD3A0"
  }
 },
 "scenes": [
  {
   "title": "",
   "visual": "Southampton quay on a bright spring morning, 10 April 1912: bunting, a brass band, cheering crowds, cranes, seagulls and the colossal four-funnelled hull filling the frame. Running gags begin: the Owner tears PRACTICALLY off the PRACTICALLY UNSINKABLE banner and pockets it in his waistcoat; the Posh lady's swaying tower of twelve suitcases with Mitzi the dog on top; the Captain's teacup balanced perfectly still on the rail (it returns in scenes 4 and 6).",
   "lead": 3.5,
   "tail": 1.6,
   "lines": [
    {
     "who": "N",
     "text": "Southampton, 10 April 1912. The Titanic, the largest ship afloat, sets off for New York.",
     "say": "Southampton, the tenth of April, nineteen twelve. The Titanic, the largest ship afloat, sets off for New York.",
     "gag": "The camera tilts up and up the black hull until it runs out of sky and sheepishly pans back down, past a seagull resting on a rivet."
    },
    {
     "who": "O",
     "text": "Behold! The finest ship ever built. Unsinkable!",
     "gag": "The Owner flings his arms wide on the gangway, his top hat springing off his head, as a giant banner unrolls behind him reading PRACTICALLY UNSINKABLE."
    },
    {
     "who": "N",
     "text": "The papers called her 'practically unsinkable'. 'Practically' was about to work very hard.",
     "gag": "Newsboys wave papers with the headline PRACTICALLY UNSINKABLE, then the camera zooms in on the small word PRACTICALLY on the banner, which nervously rolls up its sleeves and starts to sweat."
    },
    {
     "who": "S",
     "text": "The magazine said 'practically'. It's in the small print.",
     "gag": "The Shipbuilder holds up a shipbuilding magazine and points to the word PRACTICALLY, printed so tiny he needs a magnifying glass, then a bigger magnifying glass behind the first."
    },
    {
     "who": "O",
     "text": "Nobody reads small print. It doesn't sell tickets.",
     "gag": "The Owner rips PRACTICALLY off the banner, crumples it and stuffs it into his waistcoat pocket, leaving UNSINKABLE gleaming alone in gold."
    },
    {
     "who": "P",
     "text": "Careful! Eleven are hats. The twelfth is also hats.",
     "gag": "Porters wobble up the gangway under a swaying tower of twelve suitcases, with the Posh lady's little dog Mitzi riding on top like a figurehead."
    },
    {
     "who": "C",
     "text": "So steady, madam, you could balance a teacup on the rail.",
     "gag": "The white-bearded Captain sets a teacup on the ship's rail; the tea doesn't so much as ripple, and he gives a proud little wink."
    },
    {
     "who": "N",
     "text": "Leaving port, she nearly hit another ship.",
     "gag": "The giant hull's suction drags a smaller moored ship towards her, its mooring ropes snapping with a cartoon twang, until a tugboat yanks it back a whisker away."
    },
    {
     "who": "O",
     "text": "Not an omen! Nobody write that down!",
     "pause": 0.3,
     "gag": "The Owner snatches a reporter's notebook and flings it into the harbour, where a seagull lands on it and starts reading."
    }
   ]
  },
  {
   "title": "Life on board",
   "visual": "A giant cake knife slices the ship into a cutaway cross-section like a layer cake, and the camera descends deck by deck like a lift: gilded first class on top, tidy second class beneath it, a rowdy third-class party on the lower decks, and roaring furnaces with sooty stokers at the bottom. Running gag: the lower you go, the hotter and livelier it gets, and Mitzi keeps slipping downstairs to the better party.",
   "lead": 2.0,
   "tail": 1.6,
   "lines": [
    {
     "who": "N",
     "text": "After stops in France and Ireland, life aboard was a layer cake. The higher you lived, the more icing.",
     "gag": "Two postcards marked CHERBOURG, FRANCE and QUEENSTOWN, IRELAND flutter past the hull, then a giant cake knife slices it open into tiers and a glacé cherry plops onto the gold-iced top deck."
    },
    {
     "who": "O",
     "text": "A pool! A Turkish bath! A gym! A squash court! Lifeboats? Plenty!",
     "gag": "The Owner flings doors open like an advent calendar: a splash, a puff of steam, a gentleman bouncing on a mechanical camel, a squash ball that ricochets off his top hat, and last a small cupboard of lifeboats stacked like teacups, which he pats proudly and shuts."
    },
    {
     "who": "P",
     "text": "Lovely. And where does one do nothing, expensively?",
     "gag": "She sinks onto a velvet chaise while one steward fans her and a second steward fans the dog."
    },
    {
     "who": "N",
     "text": "Third class had fewer chandeliers and considerably better parties.",
     "gag": "The camera drops to the lower decks: fiddles, an accordion and a jig so lively the soup bowls hop in time, as Mitzi slides down a banister and is handed a tiny flat cap."
    },
    {
     "who": "O",
     "text": "What's that noise? Are they... enjoying themselves?",
     "gag": "The Owner lifts a corner of the first-class carpet, gets a faceful of confetti and accordion music, and slams it shut, appalled."
    },
    {
     "who": "N",
     "text": "Below, stokers shovelled about 600 tons of coal a day, in fierce heat.",
     "say": "Below, stokers shovelled about six hundred tons of coal a day, in fierce heat.",
     "gag": "Coal-blackened stokers swing their shovels in perfect rhythm while a giant meter on the wall clicks up the tons like a petrol pump."
    },
    {
     "who": "N",
     "text": "Upstairs, people paid extra for that. It was called a Turkish bath.",
     "pause": 0.3,
     "gag": "Split screen: a stoker drips with sweat beside his furnace while, directly above him, a gentleman in a towel sighs blissfully in the steam room, and both mop their brows in perfect sync."
    },
    {
     "who": "C",
     "text": "She practically drives herself.",
     "gag": "On the bridge the Captain leans back with folded arms, as a floor hatch beside him creaks open, a soot-black hand silently raises a shovel, and the hatch clangs shut."
    }
   ]
  },
  {
   "title": "Too busy to listen",
   "visual": "A queue at the purser's desk feeds a pneumatic tube up to the cramped radio room, its door labelled WIRELESS TELEGRAPH, crackling with blue sparks, where a snowdrift of fat pink passenger telegrams buries the frazzled young operator while thin icy-blue ice warnings get shoved to the back; outside, the ship ploughs on at speed through a darkening sea, and a small ship sits stopped in the ice far off. Running gag: the ignored ice warnings.",
   "lead": 2.0,
   "tail": 1.6,
   "lines": [
    {
     "who": "N",
     "text": "Passengers used the new radio mainly to tell people about the new radio.",
     "gag": "At the purser's desk a queue of first-class passengers hands in telegram forms, each one popped into a pneumatic tube that whooshes it up to the room marked WIRELESS TELEGRAPH and spits it out onto the operator, nonstop."
    },
    {
     "who": "W",
     "text": "'Wonderful time.' 'Wonderful time.' 'Dog has joined third class. Don't tell Mother.'",
     "gag": "The young Wireless operator taps at blurring speed, hair on end, as the tube spits out a perfumed pink telegram from the Posh lady with a tiny paw print beside her signature."
    },
    {
     "who": "N",
     "text": "Several ice warnings came too. They queued behind the dinner menus.",
     "gag": "Shivering icy-blue telegrams try to squeeze to the front of the pile and are elbowed back by fat pink ones about soup."
    },
    {
     "who": "W",
     "text": "Ice... ice... 'Happy birthday, Reginald!' Ooh, urgent!",
     "gag": "He tosses two blue warnings over his shoulder onto a swaying heap and clutches the birthday telegram to his chest with both hands."
    },
    {
     "who": "C",
     "text": "Thank you.",
     "gag": "The Captain reads one warning, nods gravely and hands it to the Owner, who tucks it into his waistcoat beside the crumpled PRACTICALLY."
    },
    {
     "who": "O",
     "text": "Slow down? In clear weather? Nobody does that!",
     "gag": "The Owner holds up a dummy newspaper reading RIGHT ON SCHEDULE, while a thought bubble shows every other liner racing along at full steam too, and three funnels puff harder as the fourth, a dummy, just puffs out its cheeks and pretends."
    },
    {
     "who": "N",
     "text": "She kept her speed. That evening, a nearby ship radioed: stopped, surrounded by ice.",
     "gag": "Far off on the dark sea, a small steamer sits ringed by ice floes, its own operator leaning helpfully into his key."
    },
    {
     "who": "W",
     "text": "Shut up, shut up, I'm busy!",
     "gag": "Buried up to his nose in telegrams, the operator jabs the key so hard a spark singes his eyebrows into two little question marks."
    },
    {
     "who": "N",
     "text": "His shift over, the other operator switched off and went to bed. Told to shut up, he shut up.",
     "pause": 0.4,
     "gag": "On the distant steamer, the operator flicks his wireless set's switch to OFF and its glowing valve fades, then he switches off his electric lamp, pulls on a nightcap, and his little window goes dark."
    }
   ]
  },
  {
   "title": "Iceberg, right ahead!",
   "visual": "The crow's nest high on the foremast under a moonless sky blazing with stars, above a black sea so flat it mirrors every one of them; the bridge with its telephone and wheel; the smug Iceberg, a small peak with eyebrows above water and a vast grinning bulk below. Running gags: the missing binoculars and the polite 'Thank you.'",
   "lead": 2.0,
   "tail": 1.6,
   "lines": [
    {
     "who": "N",
     "text": "No moon, and a sea flat as glass. Perfect for stargazing. Hopeless for spotting ice.",
     "gag": "Stars reflect so perfectly in the mirror-flat sea that the ship seems to glide through outer space, with not a single wave breaking anywhere."
    },
    {
     "who": "L",
     "text": "Binoculars would help. If anyone had the key.",
     "gag": "High in the crow's nest, two frosty lookouts squint into the dark while one rattles a cupboard marked BINOCULARS, held shut by a padlock that seems to smirk back."
    },
    {
     "who": "N",
     "text": "By a well-known account, the key went ashore with an officer dropped from the crew.",
     "gag": "Flashback bubble: on the Southampton quay an officer with his kitbag waves a cheerful goodbye from dry land, a little key glinting on his watch chain."
    },
    {
     "who": "I",
     "text": "Evening. Don't mind me. Ninety per cent of me is downstairs.",
     "gag": "The Iceberg's small tip winks, and the camera dips underwater to reveal its enormous smug body lounging below, arms folded, grinning."
    },
    {
     "who": "L",
     "text": "Iceberg, right ahead!",
     "gag": "The Lookout rings the bell three times so hard his frost flies off, then grabs the telephone."
    },
    {
     "who": "F",
     "text": "Thank you.",
     "pause": 0.6,
     "gag": "On the bridge the Officer politely says thank you, neatly hangs up, straightens his cap, and then his eyes go enormous."
    },
    {
     "who": "N",
     "text": "A ship this big turns at roughly the speed of a committee.",
     "gag": "The Officer dives for the wheel beside a quartermaster, who spins it like a roulette wheel, but the bow creeps round so slowly that a snail on the railing overtakes it."
    },
    {
     "who": "N",
     "text": "At 11:40 pm on 14 April, she missed the iceberg. Mostly.",
     "say": "At eleven forty p.m. on the fourteenth of April, she missed the iceberg. Mostly.",
     "gag": "The bow slides past the Iceberg's nose, then the side scrapes along it with a long cheese-grater screech, popping rivets like champagne corks and spraying ice across the forward deck."
    },
    {
     "who": "I",
     "text": "Ooh. Not a scratch on me.",
     "pause": 0.5,
     "gag": "Underwater, the Iceberg checks itself over, finds a long stripe of the ship's paint on its side, and smugly polishes it off with one fingertip."
    }
   ]
  },
  {
   "title": "A little bump",
   "visual": "The first-class smoking room, where card players barely look up, and the icy forward well deck, where third-class passengers play with the fallen ice, just before midnight; then below, where the Shipbuilder wades through ankle-deep water and draws the watertight compartments as an ice-cube tray on his blueprint. Running gags: the unbothered passengers, the sums that will not change, the Captain's teacup, and the crumpled word PRACTICALLY returning.",
   "lead": 2.0,
   "tail": 1.6,
   "lines": [
    {
     "who": "N",
     "text": "Most passengers barely felt it: like a waiter dropping a spoon far away.",
     "gag": "In the first-class smoking room there is the faintest tinkle, as if a steward far off had dropped a spoon; the whisky in one glass gives a tiny ripple, the card players glance up, then go straight back to their game."
    },
    {
     "who": "N",
     "text": "Ice tumbled onto the deck. Some played football with it.",
     "gag": "On the forward well deck, third-class passengers in caps and everyday coats kick a chunk of ice between two bollards for goalposts, and Mitzi, in her flat cap, heads it in."
    },
    {
     "who": "N",
     "text": "Below the waterline, the scrape had opened the first five or six watertight compartments.",
     "gag": "Cross-section: a dotted line of small splits and popped rivets runs along the bow below the waterline, with water spurting through each one into the front compartments, one after another."
    },
    {
     "who": "S",
     "text": "She can float with four flooded. Not five. Certainly not six.",
     "gag": "On the blueprint the compartments become an ice-cube tray, and as its front tips down, water spills over from each cube into the next."
    },
    {
     "who": "O",
     "text": "Can't we just round down?",
     "gag": "The Owner snatches the pencil and frantically rubs out the fifth compartment with the eraser."
    },
    {
     "who": "S",
     "text": "Water doesn't round down. She will sink. Within hours.",
     "gag": "The Shipbuilder gently takes the pencil back as the rubbed-out compartment quietly fills itself with blue again."
    },
    {
     "who": "C",
     "text": "Thank you.",
     "pause": 1.2,
     "gag": "The Captain removes his cap, nods once and puts it back on without a flicker, as a single small ripple crosses the tea in his Southampton teacup."
    },
    {
     "who": "O",
     "text": "Is it too late to put 'practically' back?",
     "gag": "The Owner pulls the crumpled PRACTICALLY from his waistcoat, licks it like a stamp and slaps it on the blueprint, where it slowly peels off and droops, and he sheepishly tucks it back into his waistcoat."
    },
    {
     "who": "N",
     "text": "Arithmetic, unlike advertising, does not change its mind.",
     "gag": "The Shipbuilder rubs out his sum, but the same answer reappears in bigger, bolder letters, finally with an underline he did not draw."
    }
   ]
  },
  {
   "title": "Lifeboats, anyone?",
   "visual": "The cold boat deck at night under a huge blackboard of lifeboat maths; sixteen white wooden lifeboats hang from their davits and four flat, canvas-sided collapsible boats lie folded on the deck, while officers coax reluctant passengers in evening dress; white rockets burst overhead, and an officer flashes a Morse lamp at a small ship on the horizon whose lights are clearly on, with no reply. Running gags: the sum that refuses to balance, the Owner's gold star, and the half-empty boats (empty benches only, never luggage).",
   "lead": 2.0,
   "tail": 1.6,
   "lines": [
    {
     "who": "N",
     "text": "The lifeboat maths: about 2,200 people. Twenty lifeboats. Room for about 1,178.",
     "say": "The lifeboat maths: about two thousand two hundred people. Twenty lifeboats. Room for about eleven hundred and seventy-eight.",
     "gag": "The Shipbuilder chalks the sum on a blackboard, and the chalk snaps in half right at the answer."
    },
    {
     "who": "O",
     "text": "Twenty boats! The rules only asked for sixteen!",
     "gag": "The Owner proudly sticks a big gold star beside the number 20, pointing from the sixteen wooden boats in their davits to the four flat collapsibles on deck."
    },
    {
     "who": "S",
     "text": "That's roughly half a seat each.",
     "gag": "The Shipbuilder sketches two stick figures sharing one chair, each perched on a single buttock."
    },
    {
     "who": "O",
     "text": "Splendid. Which half is mine?",
     "gag": "The Owner measures a deckchair with a tape measure and chalks an X on the end with the cushion."
    },
    {
     "who": "N",
     "text": "Perfectly legal. The rules were simply older than the ship.",
     "gag": "A dusty rulebook with a long white beard creaks open and coughs out a moth, and the Owner quietly hides his gold star behind his back."
    },
    {
     "who": "P",
     "text": "Into that little thing? I'll stay on the big one.",
     "gag": "As an Officer waves her towards a small lifeboat, she looks from it up to the enormous glowing ship and back, and Mitzi nods firmly in agreement."
    },
    {
     "who": "N",
     "text": "Many agreed. One early boat, built for 65, left with about 28.",
     "say": "Many agreed. One early boat, built for sixty-five, left with about twenty-eight.",
     "gag": "A lifeboat stencilled CAPACITY 65 creaks down the side with a handful of people spread out across rows of empty benches, like a very sparse picnic."
    },
    {
     "who": "W",
     "text": "Distress call answered! A ship's coming. But she's hours away.",
     "gag": "The Wireless operator, suddenly calm and focused, taps steadily at his key as a single reply crackles back across the dark sea."
    },
    {
     "who": "O",
     "text": "Someone should test the boats. I volunteer. For the brochure.",
     "gag": "Later, on a quiet stretch of deck with nobody else waiting, the Owner steps into a visibly half-empty boat and pins a big TESTED rosette to his lapel, as an Officer shrugs and waves him in."
    },
    {
     "who": "N",
     "text": "Rockets went up. A nearby ship saw them, wondered what they meant, and stayed put.",
     "gag": "White rockets burst overhead and an officer flashes a Morse lamp at the distant ship, whose lights are clearly on; aboard her, two sailors in mufflers watch, a thought bubble showing a party cake and then a big question mark, while below them their wireless operator snores in his nightcap beside his switched-off set."
    }
   ]
  },
  {
   "title": "The band plays on",
   "visual": "The grand saloon tilting steeper and steeper as armchairs, a potted palm and a grand piano slide out in a stately conga line; then the open, sloping boat deck under the stars, where the band plays on with calm dignity as the last boats are lowered; finally a wide, quiet shot from the lifeboats as the lit ship breaks in two and slips beneath the starry, glassy sea. No deaths are depicted: the lifeboat shot shows only the boats' occupants (the Posh lady with Mitzi, the Owner, the Lookout and the Wireless operator), each one a survivor; the Captain and the band are not shown again after their last moments aboard, with no shot of their fate, and no people are visible on the distant ship. No slapstick on the band. Running gags pay off: the teacup, the suitcases and the word PRACTICALLY.",
   "lead": 2.0,
   "tail": 1.6,
   "lines": [
    {
     "who": "N",
     "text": "By 2 am, the bow was going under. The furniture began leaving without permission.",
     "say": "By two a.m., the bow was going under. The furniture began leaving without permission.",
     "gag": "Armchairs, a potted palm and a grand piano glide across the tilting saloon in a stately conga line and out through the double doors."
    },
    {
     "who": "C",
     "text": "Steady, everyone. You could still balance a teacup on—",
     "say": "Steady, everyone. You could still balance a teacup on...",
     "gag": "The Captain sets his Southampton teacup on a sloping table; it glides away after the grand piano to join the conga line, and he follows it with his eyes without moving his head, then straightens his cap and turns to help with the boats; he is not shown again after this shot."
    },
    {
     "who": "N",
     "text": "Out on deck, the band kept playing, to keep everyone calm.",
     "gag": "On the open, sloping boat deck under the stars, the musicians play with quiet dignity; their sheet music lifts away on the cold air and they carry on from memory, as the camera slowly drifts away from them while they are still playing."
    },
    {
     "who": "P",
     "text": "On reflection, the little boat looks charming.",
     "gag": "The Posh lady scoops up Mitzi and hurries to a lifeboat, her twelve-suitcase tower hopping after her."
    },
    {
     "who": "F",
     "text": "One bag only, madam.",
     "gag": "The Officer holds up a single finger in front of the swaying tower of suitcases."
    },
    {
     "who": "P",
     "text": "Then I choose Mitzi.",
     "gag": "She holds up Mitzi in her flat cap, and the Officer helps them both in while the suitcases slump behind on the deck in a sulky heap."
    },
    {
     "who": "N",
     "text": "'Practically', it turned out, was the most important word on the banner.",
     "pause": 0.8,
     "gag": "In a lifeboat a little way off, the Owner quietly takes the crumpled PRACTICALLY from his waistcoat and smooths it flat on his knee as the boats pull away from the ship."
    },
    {
     "who": "N",
     "text": "At 2:20 am on 15 April, the ship broke in two and sank.",
     "say": "At two twenty a.m. on the fifteenth of April, the ship broke in two and sank.",
     "pause": 1,
     "gag": "Wide, quiet shot from the lifeboats, the Posh lady with Mitzi, the Owner, the Lookout and the Wireless operator wrapped in blankets in the foreground: far off, the ship's lights go out and her silhouette breaks and slips beneath the starry sea as the music fades into a long, held silence."
    }
   ]
  },
  {
   "title": "Rescue, and the rules",
   "visual": "A dark sea before dawn as the rescue ship weaves between icebergs with every lamp lit and extra lookouts posted; then a cold pink dawn over a sea dotted with ice and lifeboats as blankets and cocoa are passed up; then a wood-panelled committee room where an enormous rulebook is stamped page by page, and a patrol ship shadows the sulking Iceberg; finally, for the sincere coda, a calm sea at sunrise with no gags at all. Running gag: every new rule answers a blunder from earlier.",
   "lead": 2.0,
   "tail": 4.5,
   "lines": [
    {
     "who": "N",
     "text": "Around 4 am, the rescue ship Carpathia arrived and picked up about 700 survivors.",
     "say": "Around four a.m., the rescue ship Carpathia arrived and picked up about seven hundred survivors.",
     "pause": 1,
     "gag": "In the dark, the rescue ship weaves between icebergs like a slalom skier, lookouts doubled and every lamp lit; then cut to a cold pink dawn as lifeboats pull alongside and blankets and mugs of cocoa pass down a long, kind human chain."
    },
    {
     "who": "R",
     "text": "Welcome aboard. This morning, everyone gets the best blanket.",
     "gag": "The rescue captain wraps the Posh lady and a third-class family in one big blanket, and Mitzi licks a little boy's nose."
    },
    {
     "who": "R",
     "text": "Binoculars, son. No key required.",
     "gag": "He hands the Lookout an enormous pair of binoculars with a bow on top."
    },
    {
     "who": "L",
     "text": "Thank you.",
     "gag": "The Lookout hugs the binoculars, then raises them to the horizon, where the tiny tip of the Iceberg notices it is being watched and ducks guiltily underwater with a glug."
    },
    {
     "who": "N",
     "text": "Then nations met and, unusually, agreed: the 1914 Safety of Life at Sea treaty. Lifeboat seats for everyone.",
     "say": "Then nations met and, unusually, agreed: the nineteen fourteen Safety of Life at Sea treaty. Lifeboat seats for everyone.",
     "gag": "An enormous rulebook thuds onto a committee table and stamps LIFEBOATS FOR EVERYONE, and the old blackboard sum from the boat deck finally balances with a cheerful ding."
    },
    {
     "who": "W",
     "text": "Radio watch, around the clock. Birthdays can wait.",
     "gag": "The Wireless operator, wide awake beside a rota marked DAY AND NIGHT, firmly files a birthday telegram in a tray labelled LATER."
    },
    {
     "who": "N",
     "text": "And an International Ice Patrol.",
     "gag": "A smart patrol ship circles an iceberg with a spotlight, a clipboard and a very long measuring tape."
    },
    {
     "who": "I",
     "text": "A patrol? Just for me? I'm ninety per cent offended.",
     "gag": "The Iceberg sulks with arms folded in the spotlight and tries to hide behind a much smaller iceberg, which edges away from it."
    },
    {
     "who": "N",
     "text": "About 1,500 people lost their lives that night. Each had a name, a family and a story.",
     "say": "About fifteen hundred people lost their lives that night. Each had a name, a family and a story.",
     "pause": 1.5,
     "gag": "The music stops; a still, grey sea at first light, empty but for a single gull gliding low over the water."
    },
    {
     "who": "N",
     "text": "The safety rules that followed still protect ships, and everyone aboard them, today.",
     "pause": 0.6,
     "gag": "The sun rises over a modern ship sailing calmly past, its decks lined with bright orange lifeboats and its radio mast blinking steadily, before a slow fade to black."
    }
   ]
  }
 ]
};
