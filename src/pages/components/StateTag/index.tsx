import React from 'react';
import styles from './index.less';

interface StateTagProps {
  text: string;
  state: number;
}

const stateColorArray: string[] = [
  '#FF7069',
  '#FF9447',
  '#FFDE52',
  '#696CFF',
  '#72A5FF',
  '#7ECAFF',
  '#A4EDFF',
];

const StateTag: React.FC<StateTagProps> = (props) => {
  const { text, state } = props;
  const colorState = state > 7 || state < 1 ? 6 : state - 1;

  return (
    <div
      className={styles.tag}
      style={{ background: stateColorArray[colorState] }}
    >
      {text}
    </div>
  );
};

export default React.memo(StateTag);
