/**
 * Start Expo with the machine's LAN IP so physical iOS/Android devices can connect.
 * Windows often falls back to 127.0.0.1 without REACT_NATIVE_PACKAGER_HOSTNAME.
 */
const { spawn } = require("child_process");
const os = require("os");

function pickLanIp() {
  const nets = os.networkInterfaces();
  const candidates = [];

  for (const [name, addrs] of Object.entries(nets)) {
    for (const net of addrs || []) {
      const v4 = net.family === "IPv4" || net.family === 4;
      if (!v4 || net.internal) continue;
      // Prefer Wi-Fi / Ethernet over virtual adapters (Hyper-V, VPN, etc.)
      const lower = name.toLowerCase();
      const score =
        (lower.includes("wi-fi") || lower.includes("wifi") || lower.includes("ethernet") ? 10 : 0) -
        (lower.includes("virtual") || lower.includes("vethernet") || lower.includes("hyper-v") ? 5 : 0) -
        (lower.includes("bluetooth") ? 20 : 0);
      candidates.push({ address: net.address, score });
    }
  }

  candidates.sort((a, b) => b.score - a.score);
  return candidates[0]?.address || "127.0.0.1";
}

const mode = process.argv[2] || "lan"; // lan | tunnel
const extraArgs = process.argv.slice(3);
const host = process.env.REACT_NATIVE_PACKAGER_HOSTNAME || pickLanIp();

if (host === "127.0.0.1" && mode === "lan") {
  console.warn(
    "Warning: could not detect a LAN IP. Set REACT_NATIVE_PACKAGER_HOSTNAME in mobile/.env",
  );
}

const env = {
  ...process.env,
  REACT_NATIVE_PACKAGER_HOSTNAME: host,
};

const args = ["expo", "start", "--host", mode === "tunnel" ? "tunnel" : "lan", ...extraArgs];
console.log(`Packager host: ${host}`);
console.log(`Starting: npx ${args.join(" ")}\n`);

const child = spawn("npx", args, { stdio: "inherit", shell: true, env });
child.on("exit", (code) => process.exit(code ?? 0));
