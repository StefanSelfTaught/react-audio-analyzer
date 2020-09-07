import React from 'react';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Snackbar from '@material-ui/core/Snackbar';
import Chip from '@material-ui/core/Chip';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import ViewAgendaIcon from '@material-ui/icons/ViewAgenda';
import StopIcon from '@material-ui/icons/Stop';

import classes from './VisualAudio.module.css';

const VisualAudio = ({
  frequencyArray,
  getFrequencyData,
  initializeAudioAnalyser,
  pauseAudioPlayer,
  resumeAudioPlayer,
  stopAudioPlayer,
  isPlaying,
  audioContextState,
  setMusicType,
}) => {
  const [snackBar, setSnackBar] = React.useState({
    show: false,
    message: '',
  });

  const dataValues = React.useRef(null);

  const adjustFrequency = (newFrequencyValue) => {
    dataValues.current = newFrequencyValue;
    let domElements = frequencyArray.map((num) => document.getElementById(num));
    frequencyArray.forEach((num) => {
      domElements[
        num
      ].style.backgroundColor = `rgb(0, 255, ${dataValues.current[num]})`;

      domElements[num].style.height = `${dataValues.current[num]}px`;
    });
  };

  const runSpectrum = () => {
    getFrequencyData(adjustFrequency);
    window.requestAnimationFrame(runSpectrum);
  };

  const handleStartBottonClick = () => {
    initializeAudioAnalyser();
    window.requestAnimationFrame(runSpectrum);
  };

  const handleStartStopButtonClick = () => {
    if (isPlaying) {
      return pauseAudioPlayer();
    } else if (!isPlaying && audioContextState) {
      return resumeAudioPlayer();
    } else {
      return handleStartBottonClick();
    }
  };

  return (
    <>
      <Snackbar
        autoHideDuration={2500}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={snackBar.show}
        onClose={() => {
          setSnackBar({ ...snackBar, show: false });
        }}
        message={snackBar.message}
      />
      <div className={classes.buttonsWrapper}>
        <Tooltip
          title="Play / Pause"
          aria-label="Play / Pause"
          placement="bottom"
        >
          <IconButton
            className={classes.button}
            onClick={() => handleStartStopButtonClick()}
          >
            {isPlaying ? (
              <ViewAgendaIcon style={{ transform: 'rotate(90deg)' }} />
            ) : (
              <PlayArrowIcon />
            )}
          </IconButton>
        </Tooltip>
        <Tooltip title="Stop" aria-label="Stop" placement="bottom">
          <IconButton
            disabled={isPlaying && audioContextState ? false : true}
            className={classes.button}
            onClick={() => stopAudioPlayer()}
          >
            <StopIcon />
          </IconButton>
        </Tooltip>
      </div>
      <div className={classes.chipsWrapper}>
        <Chip
          className={classes.chip}
          onClick={() => {
            setSnackBar({
              show: true,
              message: 'Rock music has been chosen!',
            });
            setMusicType('rock');
          }}
          label="Rock"
          color="secondary"
        />
        <Chip
          className={classes.chip}
          onClick={() => {
            setSnackBar({
              show: true,
              message: 'Manea music has been chosen!',
            });
            setMusicType('manea');
          }}
          label="Manea"
          color="primary"
        />
        <Chip
          className={classes.chip}
          onClick={() => {
            setSnackBar({
              show: true,
              message: 'Bass Boosted has been chosen!',
            });
            setMusicType('bassBoosted');
          }}
          label="Bass Boosted"
          color="secondary"
        />
      </div>
      <div className={classes.frequencyBandsWrapper}>
        {frequencyArray.map((num) => (
          <Paper
            className={classes.frequencyBands}
            elevation={24}
            id={num}
            key={num}
          />
        ))}
      </div>
    </>
  );
};

export default VisualAudio;
