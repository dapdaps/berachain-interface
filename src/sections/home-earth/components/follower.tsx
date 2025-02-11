import clsx from 'clsx';

const Follower = (props: any) => {
  const { className } = props;

  return (
    <div className={clsx('absolute left-0 bottom-0 z-[5] w-[236px] h-[174px] overflow-hidden pointer-events-none', className)}>
      <img
        src="/images/home-earth/follower-1.svg"
        alt=""
        className="animate-shake2 w-[159px] h-[174px] absolute left-0 bottom-0"
        style={{
          animationDuration: '10s',
          transformOrigin: 'center bottom',
          animationTimingFunction: 'ease-in-out',
        }}
      />
      <img
        src="/images/home-earth/follower-2.svg"
        alt=""
        className="animate-shake2 w-[169px] h-[83px] absolute right-0 bottom-0"
        style={{
          animationDuration: '10s',
          transformOrigin: 'center bottom',
          animationTimingFunction: 'ease-in-out',
        }}
      />
    </div>
  );
};

export default Follower;
