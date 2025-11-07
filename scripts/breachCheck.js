// scripts/breachCheck.js
async function checkPasswordBreach(password) {
  if (!password) return 0;

  try {
    // hash with SHA-1
    const enc = new TextEncoder();
    const data = enc.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-1", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("").toUpperCase();

    const prefix = hashHex.slice(0, 5);
    const suffix = hashHex.slice(5);

    const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
    if (!res.ok) throw new Error("Network error");

    const text = await res.text();
    const lines = text.split("\n");

    for (const line of lines) {
      const [suf, count] = line.trim().split(":");
      if (suf.toUpperCase() === suffix) {
        return parseInt(count, 10);
      }
    }

    return 0; // not found
  } catch (err) {
    console.error("Breach check failed:", err);
    return 0;
  }
}
