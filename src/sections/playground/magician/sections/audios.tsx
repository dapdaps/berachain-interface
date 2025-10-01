const Audios = (props: any) => {
  const {
    audioRefs,
  } = props;

  return (
    <div className="w-0 h-0 absolute z-[-100] opacity-0 left-0 bottom-0 overflow-hidden">
      {
        AudioList.map((audio) => (
          <audio
            key={audio.type}
            ref={(node) => {
              const map = audioRefs.current;
              map.set(audio.type, node);
              return () => {
                map.delete(audio.type);
              };
            }}
            controls={false}
            autoPlay={false}
            loop={audio.loop}
            preload="auto"
          >
            <source src={audio.src} type={audio.audioType} />
          </audio>
        ))
      }
    </div>
  );
};

export default Audios;

const AudioList = [
  {
    type: "choose",
    src: "/audios/playground/magician/choose.mp3",
    loop: false,
    audioType: "audio/mp3",
  },
  {
    type: "click",
    src: "/audios/playground/magician/click.mp3",
    loop: false,
    audioType: "audio/mp3",
  },
  {
    type: "error",
    src: "/audios/playground/magician/error.mp3",
    loop: false,
    audioType: "audio/mp3",
  },
  {
    type: "failed",
    src: "/audios/playground/magician/failed.mp3",
    loop: false,
    audioType: "audio/mp3",
  },
  {
    type: "magician",
    src: "/audios/playground/magician/magician.mp3",
    loop: false,
    audioType: "audio/mp3",
  },
  {
    type: "notification",
    src: "/audios/playground/magician/notification.mp3",
    loop: false,
    audioType: "audio/mp3",
  },
  {
    type: "success",
    src: "/audios/playground/magician/success.mp3",
    loop: false,
    audioType: "audio/mp3",
  },
  {
    type: "win",
    src: "/audios/playground/magician/win.mp3",
    loop: false,
    audioType: "audio/mp3",
  },
];
