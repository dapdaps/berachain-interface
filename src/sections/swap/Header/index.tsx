import Setting from './Setting';

export default function Header({ showSetting }: any) {
  return (
    <div className='h-[50px] flex justify-end items-center mt-[-20px]'>
      {showSetting && <Setting />}
    </div>
  );
}
