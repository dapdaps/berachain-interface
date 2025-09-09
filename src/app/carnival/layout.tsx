import PlaygroundLayout from "@/sections/playground/layout";

const Playground = (props: any) => {
  const { children } = props;

  return (
    <PlaygroundLayout>
      {children}
    </PlaygroundLayout>
  );
};

export default Playground;
