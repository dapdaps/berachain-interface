import { Clouds } from './clouds';

export default function Mobile({ children }: any) {
  return (
    <div className='relative hidden md:block min-w-full	min-h-screen'>
      <Clouds />
      <div className='relative z-10'>{children}</div>
    </div>
  );
}
