import React, { useState } from 'react';
import VisualAudio from './VisualAudio/VisualAudio.component';
import bassBoosted from '../audio/infinity.mp3';
import rock from '../audio/rammstein.mp3';
import manea from '../audio/tzanca.mp3';

const AudioData = () => {
  const [frequencyArray] = useState([...Array(25).keys()]);
  const [audio, setAudio] = useState({});
  const [audioContextState, setAudioContextState] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState(new Audio());
  const [musicType, setMusicType] = useState('bassBoosted');

  let audioContext
  let source

  const initializeAudioAnalyser = () => {
    if (!!musicType) {
      if (musicType === 'rock') {
        audioElement.src = rock;
      } else if (musicType === 'bassBoosted') {
        audioElement.src = bassBoosted;
      } else {
        audioElement.src = manea;
      }
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      source = audioContext.createMediaElementSource(audioElement);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 64;
      source.connect(audioContext.destination);
      source.connect(analyser);
      audioElement.play();
      setIsPlaying(true);
      setAudioContextState(audioContext);
      setAudio((audio) => (audio.audioData = analyser));
    }
  };

  const pauseAudioPlayer = () => {
    audioElement.pause();
    audioContextState.suspend().then(() => {
      setIsPlaying(false);
    });
  };

  const resumeAudioPlayer = () => {
    audioElement.play();
    audioContextState.resume().then(() => {
      setIsPlaying(true);
    });
  };

  const stopAudioPlayer = () => {
    audioElement.load();
    audioContextState.close().then(() => {
      setAudioContextState(null);
      setIsPlaying(false);
      setAudioElement(new Audio())
    });
  };

  const getFrequencyData = (adjustFrequency) => {
    const bufferLength = audio.audioData.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    audio.audioData.getByteFrequencyData(dataArray);
    adjustFrequency(dataArray);
  };

  return (
    <VisualAudio
      initializeAudioAnalyser={initializeAudioAnalyser}
      frequencyArray={frequencyArray}
      getFrequencyData={getFrequencyData}
      audioContextState={audioContextState}
      pauseAudioPlayer={pauseAudioPlayer}
      resumeAudioPlayer={resumeAudioPlayer}
      stopAudioPlayer={stopAudioPlayer}
      setMusicType={setMusicType}
      isPlaying={isPlaying}
    />
  );
};

export default AudioData;
