import React, { useState, useEffect } from "react";
import "../../SynthPad.css";
import Audio from "./audioContext";

const AudioMain = () => {
  const [keyEntry, setKeyEntry] = useState("");
  const [freqSubmit, setFreqSubmit] = useState("");

  // initialize state for OscillatorNodes

  const handleKeyboardInput = (e) => {
    if (e.key === "Enter") {
      setFreqSubmit(keyEntry);
      const freq = parseInt(freqSubmit);
      createOscillator(freq);
      setKeyEntry("");
      document.getElementById("inputField").value = "";
    } else if (e.key === "Backspace") {
      setKeyEntry(keyEntry.slice(0, -1));
    } else if (isFinite(e.key)) {
      setKeyEntry(keyEntry.concat(e.key));
    }
  };

  // set state to represent initial value of masterGainNode
  const [masterGainValue, setMasterGainValue] = useState(1);

  // initialize state for OscillatorNodes
  const [oscillatorNodes, setOscillatorNodes] = useState([]);

  // initialize state for selected oscillator index
  const [selectedOscillatorNodeIndex, setSelectedOscillatorNodeIndex] =
    useState(-1);

  const initializeMasterGain = () => {
    // Connect the masterGainNode to the audio context to allow it to output sound.
    Audio.masterGainNode.connect(Audio.context.destination);

    // Set masterGain Value to 0
    Audio.masterGainNode.gain.setValueAtTime(0, Audio.context.currentTime);
  };

  // initialize masterGainNode on first render
  useEffect(initializeMasterGain, []);

  const changeMasterVolume = (e) => {
    setMasterGainValue(e.target.value / 100);
  };

  //   const handleUsernameSubmission = (e) => {
  //     if (e) e.preventDefault();
  //     const freq = parseInt(this.refs.usernameItem.value);

  //     createOscillator(freq);
  //   };

  const addOscillatorNode = () => {
    // Create a GainNode for the oscillator, set it to 0 volume and connect it to masterGainNode
    const oscillatorGainNode = Audio.context.createGain();
    oscillatorGainNode.gain.setValueAtTime(0, Audio.context.currentTime);
    oscillatorGainNode.connect(Audio.masterGainNode);

    // Create OscillatorNode, connect it to its GainNode, and make it start playing.
    const oscillatorNode = Audio.context.createOscillator();
    oscillatorNode.connect(oscillatorGainNode);
    oscillatorNode.start();

    // Store the nodes along with their values in state.
    // Note: When an oscillator is created, frequency is set to 440,
    // and type is set to 'sine' by default.
    const oscillatorNodeValues = {
      oscillatorNode: oscillatorNode,
      oscillatorGainNode: oscillatorGainNode,
      frequency: oscillatorNode.frequency.value,
      type: oscillatorNode.type,
      gain: 0,
    };

    setOscillatorNodes([...oscillatorNodes, oscillatorNodeValues]);

    // Set selectedOscillatorNode to the new oscillator index.
    setSelectedOscillatorNodeIndex(oscillatorNodes.length);
  };

  const createOscillator = () => {
    // Create a GainNode for the oscillator, set it to 0 volume and connect it to masterGainNode
    const inputFrequency = 200;
    const oscillatorGainNode = Audio.context.createGain();
    oscillatorGainNode.gain.setValueAtTime(1, Audio.context.currentTime);
    oscillatorGainNode.connect(Audio.masterGainNode);

    // Create OscillatorNode, connect it to its GainNode, and make it start playing.
    const oscillatorNode = Audio.context.createOscillator();
    oscillatorNode.type = "saw";
    oscillatorNode.frequency = inputFrequency;

    // oscillatorNode.frequency.setValueAtTime(
    //   inputFrequency,
    //   Audio.context.currentTime
    // );
    oscillatorNode.gain = 0.5;
    oscillatorNode.connect(oscillatorGainNode);
    oscillatorNode.start();

    // Store the nodes along with their values in state.
    // Note: When an oscillator is created, frequency is set to 440,
    // and type is set to 'sine' by default.
    const oscillatorNodeValues = {
      oscillatorNode: oscillatorNode,
      oscillatorGainNode: oscillatorGainNode,
      frequency: oscillatorNode.frequency.value,
      type: oscillatorNode.type,
      gain: 0.5,
    };

    setOscillatorNodes([...oscillatorNodes, oscillatorNodeValues]);

    // Set selectedOscillatorNode to the new oscillator index.
    setSelectedOscillatorNodeIndex(oscillatorNodes.length);
  };

  const changeSelectedOscillatorNode = (e) => {
    setSelectedOscillatorNodeIndex(e.target.value);
  };

  const updateSelectedOscillatorFrequency = (e) => {
    //update selected OscillatorNode to the selected frequency
    if (selectedOscillatorNodeIndex >= 0) {
      const oscillatorNodesCopy = [...oscillatorNodes];
      const selectedOscillatorNode =
        oscillatorNodesCopy[selectedOscillatorNodeIndex];

      // set the frequency of the OscillatorNode
      selectedOscillatorNode.oscillatorNode.frequency.setValueAtTime(
        e.target.value,
        Audio.context.currentTime
      );

      // set the value stored in state for the frequency
      selectedOscillatorNode.frequency = e.target.value;
      setOscillatorNodes(oscillatorNodesCopy);
    }
  };

  const updateSelectedOscillatorType = (e) => {
    //update selected OscillatorNode to the selected type
    if (selectedOscillatorNodeIndex >= 0) {
      const oscillatorNodesCopy = [...oscillatorNodes];
      const selectedOscillatorNode =
        oscillatorNodesCopy[selectedOscillatorNodeIndex];

      // set the type of the OscillatorNode
      selectedOscillatorNode.oscillatorNode.type = e.target.value;

      // set the value stored in state for the type
      selectedOscillatorNode.type = e.target.value;
      setOscillatorNodes(oscillatorNodesCopy);
    }
  };

  const updateSelectedOscillatorVolume = (e) => {
    //update selected OscillatorNode's GainNode to the selected value
    if (selectedOscillatorNodeIndex >= 0) {
      const oscillatorNodesCopy = [...oscillatorNodes];
      const selectedOscillatorNode =
        oscillatorNodesCopy[selectedOscillatorNodeIndex];

      // set the gain of the OscillatorNode's GainNode
      selectedOscillatorNode.oscillatorGainNode.gain.setValueAtTime(
        e.target.value / 100,
        Audio.context.currentTime
      );

      // set the value stored in state for the gain
      selectedOscillatorNode.gain = e.target.value;
      setOscillatorNodes(oscillatorNodesCopy);
    }
  };

  const play = () => {
    // Fade in by .001 seconds to avoid click
    Audio.masterGainNode.gain.setTargetAtTime(
      masterGainValue,
      Audio.context.currentTime,
      0.001
    );
    console.log({ oscillatorNodes });
  };

  // Fade out by .001 seconds to avoid click
  const pause = () => {
    Audio.masterGainNode.gain.setTargetAtTime(
      0,
      Audio.context.currentTime,
      0.001
    );
  };

  const oscillatorSelectOptions = oscillatorNodes.map((oscillatorNode, i) => (
    <option key={`oscillator-${i}`} value={i}>
      Oscillator {i}
    </option>
  ));

  return (
    <div className="AudioMain">
      <div>63</div>
      {/* <div>{oscillatorNodes}</div> */}
      <div>
        <div className="Keyboard">
          <div>{keyEntry}</div>
          <input
            type="text"
            id="inputField"
            // onKeyDown={(e) => setKeyEntry(keyEntry.concat(e.key))}
            onKeyDown={handleKeyboardInput}
          />
        </div>
        <button onClick={createOscillator}>Add New Oscillator</button>
      </div>
      <div>
        <button onClick={addOscillatorNode}>Add New Oscillator</button>
        {/* Add onChange handler in order to setSelectedOscillatorNode, render selection options,
                and set value to the index of the selectedOscillatorNode */}
        <select
          onChange={changeSelectedOscillatorNode}
          value={selectedOscillatorNodeIndex}
          className="select-oscillator"
        >
          {oscillatorSelectOptions}
        </select>
        {/* Set the value of .frequency element to be the frequency of the selected oscillator
                and add onChange handler to change the frequency of selectedOscillatorNode */}
        <input
          type="number"
          value={
            selectedOscillatorNodeIndex >= 0
              ? oscillatorNodes[selectedOscillatorNodeIndex].frequency
              : ""
          }
          onChange={updateSelectedOscillatorFrequency}
          className="frequency"
        />
        {/* Set the value of .wave-type element to be the type of the selected oscillator
                and add onChange handler to change the type of selectedOscillatorNode */}
        <select
          value={
            selectedOscillatorNodeIndex >= 0
              ? oscillatorNodes[selectedOscillatorNodeIndex].type
              : ""
          }
          onChange={updateSelectedOscillatorType}
          className="wave-type"
        >
          <option value="sine">sine</option>
          <option value="sawtooth">sawtooth</option>
          <option value="square">square</option>
          <option value="triangle">triangle</option>
        </select>
      </div>
      <div>
        <p>Oscillator Volume: </p>
        {/* Set the value of .oscillator-volume element to be the gain value of the selected oscillator's GainNode
                and add onChange handler to change the gain of selectedOscillatorNode */}
        <input
          type="range"
          min="0"
          max="100"
          value={
            selectedOscillatorNodeIndex >= 0
              ? oscillatorNodes[selectedOscillatorNodeIndex].gain
              : 0
          }
          onChange={updateSelectedOscillatorVolume}
          className="oscillator-volume"
        />
      </div>
      {/* <div>
        <p>Master Volume: </p>
        <input
          type="range"
          min="0"
          max="100"
          value={masterGainValue * 100}
          onChange={changeMasterVolume}
          className="pad-volume"
        />
      </div> */}
      <button
        // onClick={play}
        onMouseDown={play}
        // onMouseUp={pause}
        className="play"
      >
        Play
      </button>
    </div>
  );
};

export default AudioMain;
