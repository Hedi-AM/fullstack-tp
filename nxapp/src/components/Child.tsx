type ChildProps = {
  states: string[];
  onSelect: (state: string) => void;
};

export default function Child({ states, onSelect }: ChildProps) {
  return (
    <ul>
      {states.map((state) => (
        <li key={state}>
          <button onClick={() => onSelect(state)}>{state}</button>
        </li>
      ))}
    </ul>
  );
}
