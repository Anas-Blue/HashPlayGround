const input = document.getElementById("input");
const hashOutput = document.getElementById("hash");
const buttons = document.querySelectorAll(".buttons button");
const resetBtn = document.getElementById("reset");
const chainDisplay = document.getElementById("chain");

let activeHashes = [];

// Convert buffer to hex
function bufferToHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

// Generate hash
async function generateHash(text, algorithm) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);

  const hash = await crypto.subtle.digest(algorithm, data);

  return bufferToHex(hash);
}

// Update chain UI
function updateChainUI() {
  if (activeHashes.length === 0) {
    chainDisplay.textContent = "None";
  } else {
    chainDisplay.textContent = activeHashes.join(" → ");
  }
}

// Apply all selected hashes
async function applyHashes(text) {

  if (!text || activeHashes.length === 0) {
    hashOutput.textContent = "---";
    return;
  }

  let result = text;

  for (const algo of activeHashes) {
    result = await generateHash(result, algo);
  }

  hashOutput.textContent = result;
}

// Input handler
input.addEventListener("input", () => {
  applyHashes(input.value);
});

// Button handler
buttons.forEach(button => {
  button.addEventListener("click", () => {

    const algo = button.dataset.algo;

    if (activeHashes.includes(algo)) {
      // Remove
      activeHashes = activeHashes.filter(a => a !== algo);
      button.classList.remove("active");
    } else {
      // Add (keep order)
      activeHashes.push(algo);
      button.classList.add("active");
    }

    updateChainUI();
    applyHashes(input.value);
  });
});

// Reset
resetBtn.addEventListener("click", () => {

  activeHashes = [];

  hashOutput.textContent = "---";
  chainDisplay.textContent = "None";

  buttons.forEach(btn => btn.classList.remove("active"));
});
