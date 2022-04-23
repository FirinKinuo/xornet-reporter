![Logo](https://cdn.discordapp.com/attachments/755597803102928966/931042317878587412/logo.svg)

# Xornet Reporter

This is the data collector that gets your system's state and sends it to the backend, it can also be used as a pure system stat inspector without needing to connect it to Xornet

# ⚡ Installation

1. Go on Xornet and click the + button and copy the generated token
2. Run the installation script for your platform as noted below

## 🐧 Linux

```bash
curl https://raw.githubusercontent.com/xornet-cloud/Reporter/main/scripts/install.sh | sudo bash
```

## 🏢 Windows

### Scoop

0. Set execution policies so you can install scoop
```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

1. Install scoop (if you haven't already)

```powershell
iwr -useb get.scoop.sh | iex
```

2. Install Xornet Reporter (with admin for no popups)

```powershell
scoop install "https://raw.githubusercontent.com/xornet-cloud/Reporter/main/scripts/xornet-reporter.json"
```

## 🌐 OpenWRT

This script updates an existing installation of Xornet Reporter. It will not work if you have not already installed Xornet Reporter.
```bash
wget https://raw.githubusercontent.com/xornet-cloud/Reporter/main/scripts/update-mipsel.sh -O /tmp/update-mipsel.sh && chmod +x /tmp/update-mipsel.sh && ./update-mipsel.sh && rm update-mipsel.sh
```