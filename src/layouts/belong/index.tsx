const BelongLayout = (props: any) => {
  const { children } = props;

  return (
    <div className="bg-black min-h-screen">
      {children}
    </div>
  );
};

export default BelongLayout;
