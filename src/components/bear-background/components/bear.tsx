function Bear(props: any) {
  const { isChristmas, className, ...restProps } = props;

  return (
    <div {...restProps} className={`${className}`}>
      {
        !isChristmas && (
          <img src="/images/background/bear.gif" alt="" />
        )
      }
      {
        isChristmas && (
          <img src="/images/background/bear.gif" alt="" />
        )
      }
    </div>
  );
}

export default Bear;
