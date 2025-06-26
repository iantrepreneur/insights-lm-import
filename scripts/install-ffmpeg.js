import { exec } from 'child_process';
import os from 'os';
import fs from 'fs';
import path from 'path';

console.log('Checking operating system...');
const platform = os.platform();

// Fonction pour exécuter une commande et afficher la sortie en temps réel
function executeCommand(command) {
  return new Promise((resolve, reject) => {
    console.log(`Exécution de la commande: ${command}`);
    
    const process = exec(command);
    
    process.stdout.on('data', (data) => {
      console.log(data.toString());
    });
    
    process.stderr.on('data', (data) => {
      console.error(data.toString());
    });
    
    process.on('exit', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`La commande a échoué avec le code de sortie ${code}`));
      }
    });
  });
}

async function installFFmpeg() {
  try {
    // Vérifier si FFmpeg est déjà installé
    try {
      await executeCommand('ffmpeg -version');
      console.log('FFmpeg est déjà installé sur votre système.');
      return;
    } catch (error) {
      console.log('FFmpeg n\'est pas installé. Tentative d\'installation...');
    }

    // Installation selon le système d'exploitation
    if (platform === 'linux') {
      // Pour les systèmes basés sur Debian/Ubuntu
      try {
        await executeCommand('apt-get --version');
        await executeCommand('sudo apt-get update');
        await executeCommand('sudo apt-get install -y ffmpeg');
        console.log('FFmpeg a été installé avec succès via apt-get.');
        return;
      } catch (error) {
        console.log('apt-get n\'est pas disponible ou a échoué.');
      }

      // Pour les systèmes basés sur Red Hat/Fedora
      try {
        await executeCommand('dnf --version');
        await executeCommand('sudo dnf install -y ffmpeg');
        console.log('FFmpeg a été installé avec succès via dnf.');
        return;
      } catch (error) {
        console.log('dnf n\'est pas disponible ou a échoué.');
      }

      // Pour les systèmes basés sur Arch Linux
      try {
        await executeCommand('pacman --version');
        await executeCommand('sudo pacman -S --noconfirm ffmpeg');
        console.log('FFmpeg a été installé avec succès via pacman.');
        return;
      } catch (error) {
        console.log('pacman n\'est pas disponible ou a échoué.');
      }
    } else if (platform === 'darwin') {
      // macOS avec Homebrew
      try {
        await executeCommand('brew --version');
        await executeCommand('brew install ffmpeg');
        console.log('FFmpeg a été installé avec succès via Homebrew.');
        return;
      } catch (error) {
        console.log('Homebrew n\'est pas disponible ou a échoué.');
        console.log('Veuillez installer Homebrew d\'abord: https://brew.sh/');
      }
    } else if (platform === 'win32') {
      console.log('Pour Windows, veuillez télécharger et installer FFmpeg manuellement:');
      console.log('1. Téléchargez FFmpeg depuis https://ffmpeg.org/download.html');
      console.log('2. Extrayez le contenu dans un dossier, par exemple C:\\ffmpeg');
      console.log('3. Ajoutez le chemin du dossier bin (ex: C:\\ffmpeg\\bin) à votre variable d\'environnement PATH');
      return;
    }

    console.log('Impossible d\'installer FFmpeg automatiquement sur votre système.');
    console.log('Veuillez l\'installer manuellement en suivant les instructions pour votre système d\'exploitation:');
    console.log('https://ffmpeg.org/download.html');
  } catch (error) {
    console.error('Erreur lors de l\'installation de FFmpeg:', error);
  }
}

installFFmpeg();