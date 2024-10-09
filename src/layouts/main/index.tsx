import MainLayoutHeader from '@/layouts/main/header';
import MapModal from '@/sections/home/map-modal';

const MainLayout = (props: Props) => {
  const {
    children,
    className,
    style,
  } = props;

  return (
    <div
      className={`min-h-screen relative flex flex-col items-stretch justify-start ${className}`}
      style={style}
    >
      <MainLayoutHeader />
      <div className='grow'>{children}</div>
      <MapModal />
    </div>
  );
};

export default MainLayout;

interface Props {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}
