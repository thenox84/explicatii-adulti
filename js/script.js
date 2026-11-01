/* Narațiunea filmului (engleză).
   who: N = narator, T = Tudor, A = agentul (șeful de șantier), R = Cercetătorul,
        K = Verificatorul (Checker), B = chatbotul.
   say: textul rostit, dacă diferă de subtitrare (pentru pronunție).
   pause: secunde de liniște înaintea replicii (pentru acțiune). */
window.SCRIPT = {
"voices": {
  "N": {"voice": "bm_george", "lang": "en-gb", "speed": 0.94, "name": ""},
  "T": {"voice": "am_michael", "lang": "en-us", "speed": 1.0, "name": "Tudor"},
  "A": {"voice": "af_heart", "lang": "en-us", "speed": 1.0, "name": "Agent"},
  "R": {"voice": "bf_emma", "lang": "en-gb", "speed": 1.0, "name": "Researcher"},
  "K": {"voice": "af_bella", "lang": "en-us", "speed": 1.0, "name": "Checker"},
  "B": {"voice": "bf_emma", "lang": "en-gb", "speed": 1.0, "name": "Chatbot"}
},
"scenes": [
{"title": "", "lead": 4.5, "tail": 2.0, "lines": [
  {"who": "N", "text": "This is Tudor.", "say": "This is Toodor."},
  {"who": "N", "text": "Tudor has an idea for an app. Something useful for the whole family.", "say": "Toodor has an idea for an app. Something useful for the whole family."},
  {"who": "N", "text": "He opens his laptop, and types a message in plain, everyday words."},
  {"who": "T", "text": "Make me an iPhone app with our family recipes: a list of recipes, search, favourites, a photo for every recipe, and a shopping list.", "pause": 0.6},
  {"who": "N", "text": "He presses Send. The message travels to an AI agent. Let's follow it, step by step.", "pause": 0.8}
]},
{"title": "What AI really is", "lead": 2.6, "tail": 1.8, "lines": [
  {"who": "N", "text": "First: what is the AI inside the agent, really?"},
  {"who": "N", "text": "At its heart is a language model: a program that has read an enormous amount of text. Books, articles, websites, and code."},
  {"who": "N", "text": "From all that reading, it learned the patterns of language: which words tend to follow which."},
  {"who": "N", "text": "When Tudor's message arrives, it is first cut into small pieces. Experts call them tokens.", "say": "When Toodor's message arrives, it is first cut into small pieces. Experts call them tokens.", "pause": 0.6},
  {"who": "N", "text": "Each piece becomes a number, because numbers are what a computer can calculate with."},
  {"who": "N", "text": "Then the model writes its answer one piece at a time. At every step, it picks a likely next piece. Then the next. And the next.", "pause": 0.6},
  {"who": "N", "text": "It repeats this thousands of times, very fast, until a whole answer appears."},
  {"who": "N", "text": "One honest warning: the model doesn't know things the way a person does. It can be wrong, even when it sounds sure.", "pause": 0.8},
  {"who": "N", "text": "That's why, in everything that follows, checking the work matters so much."}
]},
{"title": "From chatbot to agent", "lead": 2.6, "tail": 1.8, "lines": [
  {"who": "N", "text": "A simple chatbot can only talk."},
  {"who": "B", "text": "You should create a new project in Xcode, and then write the first screen.", "say": "You should create a new project in Ex code, and then write the first screen."},
  {"who": "N", "text": "It tells you what you could do. But you still have to do it yourself."},
  {"who": "N", "text": "An agent can also do the work. An agent is a model, plus tools, plus a loop.", "pause": 0.5},
  {"who": "N", "text": "The loop goes like this. First, it thinks: it works out the next step.", "pause": 0.6},
  {"who": "N", "text": "Then it acts: it uses a tool. It writes a file, or runs a command."},
  {"who": "N", "text": "Then it looks at the result, and thinks again. Round and round, until the job is done."},
  {"who": "N", "text": "Think of a good craftsman. He doesn't just give advice. He picks up the tools, does the job, and checks how it turned out.", "pause": 0.6},
  {"who": "N", "text": "The agent's toolbox: reading and writing files, running commands, building the app, a test iPhone inside the computer, screenshots, and searching the documentation."}
]},
{"title": "Understanding the message", "lead": 2.6, "tail": 1.8, "lines": [
  {"who": "N", "text": "The agent works like a foreman on a building site. And every foreman needs a desk."},
  {"who": "N", "text": "Experts call this desk the context. Whatever is on it, the agent can see. Whatever isn't, simply doesn't exist for it."},
  {"who": "N", "text": "First come its basic rules, and Tudor's message.", "say": "First come its basic rules, and Toodor's message."},
  {"who": "N", "text": "Then the project's files, if there are any, and notes saved in memory from earlier work."},
  {"who": "N", "text": "The desk is big, but it has an edge. It can fill up."},
  {"who": "N", "text": "From the message, the agent makes a checklist of requirements. For now, every box is empty.", "pause": 0.6},
  {"who": "N", "text": "Some things are unclear. Where do the recipes come from? Which iPhones should it support?"},
  {"who": "N", "text": "The agent can ask a short question, or pick a sensible option, and say so openly."},
  {"who": "A", "text": "I'll assume you'll type the recipes in yourself, and that the app runs on iOS 17 or newer. Tell me if you'd like it different.", "pause": 0.3},
  {"who": "T", "text": "Sounds good. Go ahead!", "pause": 0.4}
]},
{"title": "The plan", "lead": 2.6, "tail": 1.8, "lines": [
  {"who": "N", "text": "Next, the requirements become a plan: a list of tasks, in order."},
  {"who": "N", "text": "First, the project itself, in Xcode, Apple's program for making apps.", "say": "First, the project itself, in Ex code, Apple's program for making apps."},
  {"who": "N", "text": "Then a box for the data. Every recipe has a title, ingredients, steps, and a photo."},
  {"who": "N", "text": "Then the screens, search, favourites, photos, and the shopping list."},
  {"who": "N", "text": "And finally: tests, building the app, and trying it on a test iPhone."},
  {"who": "N", "text": "The plan isn't set in stone. It changes along the way, whenever something new turns up.", "pause": 0.5}
]},
{"title": "Helpers: the subagents", "lead": 2.6, "tail": 1.8, "lines": [
  {"who": "N", "text": "The project is big, and the foreman doesn't do everything alone."},
  {"who": "N", "text": "It calls in helpers: smaller agents, each with one job. Experts call them subagents."},
  {"who": "N", "text": "Each helper gets a written ticket: what to do, what to know, and what to bring back."},
  {"who": "A", "text": "Researcher: find out how Apple handles search and photos. Bring me a short summary."},
  {"who": "R", "text": "On it!"},
  {"who": "N", "text": "Each helper also gets its own desk, clean and empty. It can't see the foreman's desk.", "pause": 0.4},
  {"who": "N", "text": "They all work at the same time. The Researcher reads Apple's documentation."},
  {"who": "N", "text": "The Builder writes the screens. The Checker prepares the tests."},
  {"who": "N", "text": "When they finish, each one brings back a short report, not the whole pile of work.", "pause": 1.0},
  {"who": "N", "text": "So the foreman's desk stays tidy, and it keeps the big picture."},
  {"who": "N", "text": "But careful: a helper only knows what's written on its ticket.", "pause": 1.0},
  {"who": "N", "text": "A vague ticket, like 'Do the search', gets a poor result."},
  {"who": "N", "text": "A clear ticket, with the details and the reason behind the job, gets a good one.", "pause": 0.8}
]},
{"title": "Tools in action", "lead": 2.6, "tail": 1.8, "lines": [
  {"who": "N", "text": "Now, to work. The agent uses a tool that creates the project."},
  {"who": "N", "text": "Files appear, and code is written into them: instructions for the iPhone, in a language called Swift."},
  {"who": "N", "text": "You don't need to understand the code. What matters is what the agent does with it."},
  {"who": "N", "text": "Then it builds the app, turning the code into a program that can run.", "pause": 0.4},
  {"who": "N", "text": "A red error! That's normal, for human programmers too.", "pause": 1.2},
  {"who": "A", "text": "Hmm. 'Cannot find results.' I used a name I never defined. Easy to fix."},
  {"who": "N", "text": "It fixes the code, and builds again. Green, this time.", "pause": 0.4},
  {"who": "N", "text": "The loop keeps turning: think, act, look at the result.", "pause": 0.8},
  {"who": "N", "text": "A new error, a new fix. Every round brings it closer to an app that works."},
  {"who": "N", "text": "In real life, all this takes anywhere from a few minutes to a few hours, depending on the project.", "pause": 0.6}
]},
{"title": "Checking the work", "lead": 2.6, "tail": 1.8, "lines": [
  {"who": "N", "text": "The app builds. But that doesn't mean it looks right, or works right."},
  {"who": "N", "text": "The agent starts it on a test iPhone that runs inside the computer. Experts call it a simulator."},
  {"who": "N", "text": "It takes a screenshot, and puts it on its desk to look at.", "pause": 0.3},
  {"who": "A", "text": "That button is cut off at the edge. And the title is far too small.", "pause": 0.6},
  {"who": "N", "text": "It fixes them, and takes a new screenshot. Now it looks right."},
  {"who": "N", "text": "Then it runs the tests: small automatic checks. One by one, the boxes turn green.", "pause": 0.4},
  {"who": "N", "text": "Next, the Checker, with its own clean desk, looks over everything independently.", "pause": 0.6},
  {"who": "K", "text": "Found one! The favourites disappear when you close the app.", "pause": 0.8},
  {"who": "N", "text": "The bug is fixed, and checked again. Two pairs of eyes see more than one."}
]},
{"title": "Safety and control", "lead": 2.6, "tail": 1.8, "lines": [
  {"who": "N", "text": "Before any important or irreversible step, the agent stops and asks for permission."},
  {"who": "A", "text": "May I delete the old test folder? This can't be undone."},
  {"who": "T", "text": "Yes, go ahead.", "pause": 0.5},
  {"who": "N", "text": "The same goes for publishing, sending the app to the App Store, or paying for anything.", "pause": 0.6},
  {"who": "N", "text": "The human reads the request and decides: allow, or refuse. Tudor has the last word.", "say": "The human reads the request and decides: allow, or refuse. Toodor has the last word."},
  {"who": "N", "text": "Some things only the human does: signing in to his Apple account, and installing the app on his own phone."},
  {"who": "N", "text": "The agent is a powerful helper, but it works under human supervision."}
]},
{"title": "When the desk fills up", "lead": 2.6, "tail": 1.8, "lines": [
  {"who": "N", "text": "A long job piles up a lot of paper: code, errors, screenshots, reports."},
  {"who": "N", "text": "The desk has an edge. Sooner or later, it fills up."},
  {"who": "N", "text": "So the agent gathers the old pages into a short summary, like a slim folder.", "pause": 0.4},
  {"who": "N", "text": "The important things go into memory: decisions, preferences, and what's left to do.", "pause": 0.4},
  {"who": "N", "text": "That way it can carry on without losing the thread. Though a summary always leaves out a few details."}
]},
{"title": "The finished app", "lead": 2.6, "tail": 2.0, "lines": [
  {"who": "N", "text": "And here it is: the family recipe app."},
  {"who": "N", "text": "Every recipe, with its photo."},
  {"who": "N", "text": "Search filters as you type. Type 'sar', and up come the sarmale.", "say": "Search filters as you type. Type sar, and up come the sarmahleh."},
  {"who": "N", "text": "One tap on the heart, and a recipe joins the favourites.", "pause": 0.4},
  {"who": "N", "text": "And the shopping list: tick off the ingredients one by one, right there in the shop.", "pause": 0.4},
  {"who": "N", "text": "At the end, the agent sends Tudor a summary: what it did, and what it checked.", "say": "At the end, the agent sends Toodor a summary: what it did, and what it checked.", "pause": 0.6},
  {"who": "N", "text": "It's honest about what it couldn't check. For example, on a real iPhone."},
  {"who": "N", "text": "And it tells Tudor what he needs to do: sign in with his Apple account, connect his iPhone, and press Run.", "say": "And it tells Toodor what he needs to do: sign in with his Apple account, connect his iPhone, and press Run."},
  {"who": "T", "text": "Sarmale, just like Grandma's!", "say": "Sarmahleh, just like Grandma's!", "pause": 0.8}
]},
{"title": "The whole journey", "lead": 2.6, "tail": 8.0, "lines": [
  {"who": "N", "text": "So, the whole journey: from Tudor's message...", "say": "So, the whole journey: from Toodor's message..."},
  {"who": "N", "text": "...to understanding, a plan, helpers, and tools...", "pause": 0.2},
  {"who": "N", "text": "...through errors and fixes, to checking, and a finished app.", "pause": 0.2},
  {"who": "N", "text": "At the important points, the human approves and decides.", "pause": 0.6},
  {"who": "N", "text": "An agent is not magic. It's a model that works in loops, uses tools, and checks its own work.", "pause": 0.8}
]}
]};
