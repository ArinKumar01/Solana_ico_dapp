#!/usr/bin/env bash
set -euo pipefail

SRC="/mnt/c/Users/arin/solana ico"
DEST="${HOME}/solana-ico"
SKIP_RSYNC="${SKIP_RSYNC:-0}"

if [[ "${SKIP_RSYNC}" != "1" ]]; then
  if [[ ! -d "${SRC}" ]]; then
    echo "FAIL: source directory not found: ${SRC}"
    exit 1
  fi

  echo "==> Sync ${SRC} -> ${DEST} (exclude .git, node_modules, target, .next)"
  rm -rf "${DEST}"
  mkdir -p "${DEST}"

  if command -v rsync >/dev/null 2>&1; then
    rsync -a --chmod=Du=rwx,Dgo=rx,Fu=rw,Fgo=r \
      --exclude=.git --exclude=node_modules --exclude=target --exclude=.next \
      "${SRC}/" "${DEST}/"
  else
    (cd "${SRC}" && tar cf - \
      --exclude=.git --exclude=node_modules --exclude=target --exclude=.next .) \
      | (cd "${DEST}" && tar xf -)
  fi

  chmod -R u+rwX "${DEST}" 2>/dev/null || true
fi

mkdir -p "${DEST}"
cd "${DEST}"

if [[ "${SKIP_RSYNC}" != "1" ]]; then
  echo "==> Preserve program id: copy deploy keypair from Windows tree"
  mkdir -p target/deploy
  if [[ -f "${SRC}/target/deploy/solana_ico-keypair.json" ]]; then
    cp -a "${SRC}/target/deploy/solana_ico-keypair.json" target/deploy/
  else
    echo "FAIL: missing ${SRC}/target/deploy/solana_ico-keypair.json (needed to keep program id stable)"
    exit 1
  fi
fi

echo "==> Rust / Anchor / Solana PATH (Solana platform tools must precede cargo for build-sbf)"
if [[ -f "${HOME}/.cargo/env" ]]; then
  # shellcheck disable=SC1090
  source "${HOME}/.cargo/env"
fi
export PATH="${HOME}/solana-release/bin:${HOME}/.local/share/solana/install/active_release/bin:${HOME}/.cargo/bin:/usr/local/bin:/usr/bin:/bin:${PATH}"

echo "==> Solana CLI keypair (WSL): use Linux path, not Windows C:/..."
mkdir -p "${HOME}/.config/solana"
WIN_USER="${WIN_USER:-$(whoami)}"
WIN_KP="/mnt/c/Users/${WIN_USER}/.config/solana/id.json"
if [[ ! -f "${HOME}/.config/solana/id.json" ]] && [[ -f "${WIN_KP}" ]]; then
  cp -a "${WIN_KP}" "${HOME}/.config/solana/id.json"
  chmod 600 "${HOME}/.config/solana/id.json" || true
fi
if [[ ! -f "${HOME}/.config/solana/id.json" ]]; then
  echo "FAIL: missing ${HOME}/.config/solana/id.json (copy from Windows or run solana-keygen new)"
  exit 1
fi
solana config set --keypair "${HOME}/.config/solana/id.json" --url devnet

if [[ "${SKIP_RSYNC}" != "1" ]]; then
  echo "==> Clean npm artifacts"
  rm -rf node_modules package-lock.json

  echo "==> Node via nvm (>=20)"
  export NVM_DIR="${HOME}/.nvm"
  if [[ ! -s "${NVM_DIR}/nvm.sh" ]]; then
    curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
  fi
  # shellcheck disable=SC1090
  source "${NVM_DIR}/nvm.sh"
  nvm install 20
  nvm use 20
  node -v

  echo "==> npm install"
  npm install

  echo "==> Tool versions"
  anchor --version
  solana --version
  rustc --version
  command -v cargo-build-sbf >/dev/null && cargo-build-sbf --version || true

  echo "==> anchor clean && anchor build"
  anchor clean
  anchor build

  if [[ ! -f target/deploy/solana_ico.so ]]; then
    echo "FAIL: target/deploy/solana_ico.so missing after build"
    exit 1
  fi
else
  echo "==> SKIP_RSYNC=1: skipping npm reinstall and anchor build (deploy-only)"
  export NVM_DIR="${HOME}/.nvm"
  if [[ -s "${NVM_DIR}/nvm.sh" ]]; then
    # shellcheck disable=SC1090
    source "${NVM_DIR}/nvm.sh"
    nvm use 20 >/dev/null 2>&1 || true
  fi
  echo "==> Tool versions"
  anchor --version
  solana --version
  if [[ ! -f target/deploy/solana_ico.so ]]; then
    echo "FAIL: target/deploy/solana_ico.so missing; run once without SKIP_RSYNC=1"
    exit 1
  fi
fi

echo "==> Ensure devnet SOL for upgrade + IDL (auto airdrop)"
if solana config get 2>/dev/null | grep -q "devnet"; then
  echo "Devnet wallet pubkey (fund via https://faucet.solana.com if RPC airdrop is rate-limited):"
  solana address
  for _ in 1 2 3 4 5 6 7 8 9 10; do
    solana airdrop 0.5 --url devnet || true
    sleep 5
    LAM="$(solana balance --url devnet --lamports 2>/dev/null | head -1 | awk '{print $1}' || echo 0)"
    if [[ "${LAM:-0}" =~ ^[0-9]+$ ]] && [[ "${LAM}" -ge 1800000000 ]]; then
      break
    fi
  done
  solana balance --url devnet
fi

echo "==> anchor program deploy"
anchor program deploy

PID="$(python3 - <<'PY'
import re
from pathlib import Path
text = Path("Anchor.toml").read_text(encoding="utf-8")
m = re.search(r'^\s*solana_ico\s*=\s*"([^"]+)"', text, re.M)
if not m:
    raise SystemExit("Could not parse program id from Anchor.toml")
print(m.group(1))
PY
)"

echo "==> solana program show ${PID} (devnet)"
solana program show "${PID}" --url devnet

echo "DONE Program ID: ${PID}"
echo "Project root in WSL: ${DEST}"
