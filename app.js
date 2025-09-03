
const wordCategories = {
  "All": [], // Will be filled with all words
  "Fruits": [
    { word: "apple", hint: "orchard" },
    { word: "banana", hint: "yellow" },
    { word: "orange", hint: "peel" },
    { word: "grape", hint: "vine" },
    { word: "watermelon", hint: "summer" },
    { word: "kiwi", hint: "fuzzy" },
    { word: "pineapple", hint: "tropical" }
  ],
  "Vehicles": [
    { word: "car", hint: "drive" },
    { word: "bicycle", hint: "pedal" },
    { word: "bus", hint: "route" },
    { word: "train", hint: "tracks" },
    { word: "airplane", hint: "flight" },
    { word: "boat", hint: "water" }
  ],
  "Nature": [
    { word: "mountain", hint: "peak" },
    { word: "river", hint: "flow" },
    { word: "beach", hint: "sand" },
    { word: "forest", hint: "trees" },
    { word: "desert", hint: "dry" },
    { word: "island", hint: "coconut" }
  ],
  "Food": [
    { word: "pizza", hint: "slice" },
    { word: "burger", hint: "patty" },
    { word: "sushi", hint: "rice" },
    { word: "pasta", hint: "sauce" },
    { word: "salad", hint: "leaf" },
    { word: "taco", hint: "shell" }
  ],
  "Music": [
    { word: "guitar", hint: "strings" },
    { word: "piano", hint: "keys" },
    { word: "drums", hint: "beat" },
    { word: "violin", hint: "bow" },
    { word: "flute", hint: "wind" }
  ],
  "Entertainment": [
    { word: "movie", hint: "screen" },
    { word: "theater", hint: "stage" },
    { word: "concert", hint: "live" },
    { word: "circus", hint: "tent" },
    { word: "museum", hint: "exhibit" }
  ],
  "Technology": [
    { word: "robot", hint: "metal" },
    { word: "iPhone", hint: "touch" },
    { word: "PlayStation", hint: "controller" },
    { word: "Tesla", hint: "electric" },
    { word: "laptop", hint: "portable" },
    { word: "printer", hint: "paper" },
    { word: "router", hint: "wifi" }
  ],
  "Brands": [
    { word: "Nike", hint: "shoes" },
    { word: "Coca-Cola", hint: "polar bear" },
    { word: "McDonald's", hint: "burger" },
    { word: "Samsung", hint: "electronics" },
    { word: "Google", hint: "search" },
    { word: "Amazon", hint: "shop" },
    { word: "Adidas", hint: "sports" }
  ],
  "School": [
    { word: "homework", hint: "assign" },
    { word: "teacher", hint: "classroom" },
    { word: "backpack", hint: "carry" },
    { word: "exam", hint: "school" },
    { word: "desk", hint: "seat" },
    { word: "notebook", hint: "pages" },
    { word: "chalk", hint: "messy" }
  ],
  "Work": [
    { word: "meeting", hint: "agenda" },
    { word: "email", hint: "inbox" },
    { word: "deadline", hint: "urgent" },
    { word: "office", hint: "job" },
    { word: "boss", hint: "manager" },
    { word: "resume", hint: "type" },
    { word: "water", hint: "clear" }
  ]
};

// Fill 'All' with all words from all categories except 'All'
wordCategories["All"] = Object.keys(wordCategories)
  .filter(cat => cat !== "All")
  .flatMap(cat => wordCategories[cat]);

const app = document.getElementById('app');

let state = {
  step: 'setup',
  numPlayers: 0,
  assignments: [],
  currentPlayer: 0,
  hintsOn: false,
  hint: '',
  customWord: '',
  customHint: ''
};

function render() {
  if (state.step === 'setup') {
    app.innerHTML = `
      <h1>The Imposter Game</h1>
      <label>How many players?</label><br />
      <input type="number" id="numPlayers" min="3" max="12" value="4" /><br />
      <label style="display:block;margin-top:16px;">
        <span style="margin-right:8px;">Hints</span>
        <input type="checkbox" id="hintsSwitch" ${state.hintsOn ? 'checked' : ''} />
        <span style="font-size:0.95em;">(Imposter gets a vague hint)</span>
      </label>
      <div id="customWordSection" style="margin-top:24px;">
        <button id="showCustomWord" type="button" style="background:#444;">Submit your own word</button>
        <div id="customInputs" style="display:none;margin-top:12px;">
          <input id="customWordInput" type="text" maxlength="32" placeholder="Enter your word" style="width:70%;margin-bottom:8px;" /><br />
          <input id="customHintInput" type="text" maxlength="32" placeholder="Add a hint (one word)" style="width:70%;" /><br />
        </div>
      </div>
      <button id="startBtn">Start Game</button>
    `;
    document.getElementById('hintsSwitch').onchange = (e) => {
      state.hintsOn = e.target.checked;
    };
    document.getElementById('showCustomWord').onclick = () => {
      const customInputs = document.getElementById('customInputs');
      customInputs.style.display = customInputs.style.display === 'none' ? 'block' : 'none';
    };
    document.getElementById('customWordInput').oninput = (e) => {
      state.customWord = e.target.value;
    };
    document.getElementById('customHintInput').oninput = (e) => {
      state.customHint = e.target.value;
      if (e.target.value.trim().length > 0) {
        state.hintsOn = true;
        document.getElementById('hintsSwitch').checked = true;
      }
    };
    document.getElementById('startBtn').onclick = () => {
      const num = parseInt(document.getElementById('numPlayers').value);
      if (num >= 3 && num <= 12) {
        startGame(num);
      } else {
        alert('Choose between 3 and 12 players.');
      }
    };
  } else if (state.step === 'reveal') {
    app.innerHTML = `
      <h2>Player ${state.currentPlayer + 1}</h2>
      <button id="revealBtn">Reveal your word</button>
    `;
    document.getElementById('revealBtn').onclick = () => {
      state.step = 'showWord';
      render();
    };
  } else if (state.step === 'showWord') {
    const assignment = state.assignments[state.currentPlayer];
    let display = assignment;
    if (assignment === 'IMPOSTER' && state.hintsOn) {
      display = `<span style='color:#ffb84b;'>IMPOSTER</span><br><span style='font-size:1.1rem;opacity:0.8;'>Hint: ${state.hint}</span>`;
    }
    app.innerHTML = `
      <h2>Player ${state.currentPlayer + 1}</h2>
      <div style="font-size:1.5rem;margin:24px 0;">
        <strong>${display}</strong>
      </div>
      <button id="nextBtn">Next Player</button>
    `;
    document.getElementById('nextBtn').onclick = () => {
      if (state.currentPlayer < state.numPlayers - 1) {
        state.currentPlayer++;
        state.step = 'reveal';
        render();
      } else {
        state.step = 'done';
        render();
      }
    };
  } else if (state.step === 'done') {
    app.innerHTML = `
      <h2>All players have seen their word!</h2>
      <p>Discuss and try to find the imposter!</p>
      <button id="restartBtn">Play Again</button>
    `;
    document.getElementById('restartBtn').onclick = () => {
      state = { step: 'setup', numPlayers: 0, assignments: [], currentPlayer: 0 };
      render();
    };
  }
}

function startGame(numPlayers) {
  state.numPlayers = numPlayers;
  let word, hint;
  if (state.customWord.trim()) {
    word = state.customWord.trim();
    hint = state.customHint.trim() || 'custom';
  } else {
    const pool = wordCategories["All"];
    ({ word, hint } = pool[Math.floor(Math.random() * pool.length)]);
  }
  // Pick imposter
  const imposterIndex = Math.floor(Math.random() * numPlayers);
  // Assignments
  state.assignments = Array(numPlayers).fill(word);
  state.assignments[imposterIndex] = 'IMPOSTER';
  state.currentPlayer = 0;
  state.hint = hint;
  state.step = 'reveal';
  render();
}

render();

