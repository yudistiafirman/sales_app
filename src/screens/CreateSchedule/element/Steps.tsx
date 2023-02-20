type StepsType = {
  currentPosition: number;
  stepsToRender: JSX.Element[];
};

export default function Steps({ currentPosition, stepsToRender }: StepsType) {
  return stepsToRender[currentPosition];
}
