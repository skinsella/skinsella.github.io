(() => {
  const expected = "76f9b3ae2413bf3b563fb38235c4bd2a365fa52e089f9333e10fd7dcbcd39f6a";
  const key = "priceOfUnityAccess";

  if (sessionStorage.getItem(key) === "granted") {
    document.documentElement.classList.add("access-granted");
    return;
  }

  document.documentElement.classList.add("access-locked");

  const digest = async (value) => {
    const bytes = new TextEncoder().encode(value);
    const hash = await crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(hash), (byte) => byte.toString(16).padStart(2, "0")).join("");
  };

  window.addEventListener("DOMContentLoaded", () => {
    const gate = document.createElement("div");
    gate.id = "access-gate";
    gate.innerHTML = `
      <form id="access-form" autocomplete="off">
        <div class="access-eyebrow">Restricted preview</div>
        <h1>The Price of Unity</h1>
        <p>Enter the password to view the fiscal simulator.</p>
        <label for="access-password">Password</label>
        <input id="access-password" type="password" autocomplete="current-password" autofocus required>
        <button type="submit">Enter</button>
        <div id="access-error" role="alert" aria-live="polite"></div>
      </form>`;
    document.body.appendChild(gate);

    const form = document.getElementById("access-form");
    const input = document.getElementById("access-password");
    const error = document.getElementById("access-error");

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (await digest(input.value) === expected) {
        sessionStorage.setItem(key, "granted");
        document.documentElement.classList.remove("access-locked");
        document.documentElement.classList.add("access-granted");
        gate.remove();
      } else {
        error.textContent = "Incorrect password";
        input.value = "";
        input.focus();
      }
    });
  });
})();

