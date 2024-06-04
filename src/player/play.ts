import press_button_mp3 from "/press_button1.wav";

const play = () => {
  new Audio(press_button_mp3).play();
};

export {
    play
}