import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

import { WorkoutSetRow } from '@/features/workouts/components/WorkoutSetRow';

const baseSet = { id: 'set-1', weight: '60', reps: '8', isCompleted: false };

describe('WorkoutSetRow', () => {
  it('renders weight and reps inputs', async () => {
    const { getByLabelText } = await render(<WorkoutSetRow index={0} set={baseSet} onChange={jest.fn()} onToggle={jest.fn()} />);
    expect(getByLabelText('Set 1 kilograms')).toHaveProp('value', '60');
    expect(getByLabelText('Set 1 reps')).toHaveProp('value', '8');
  });

  it('calls onChange when weight is edited', async () => {
    const onChange = jest.fn();
    const { getByLabelText } = await render(<WorkoutSetRow index={0} set={baseSet} onChange={onChange} onToggle={jest.fn()} />);
    fireEvent.changeText(getByLabelText('Set 1 kilograms'), '65');
    expect(onChange).toHaveBeenCalledWith('weight', '65');
  });

  it('calls onChange when reps is edited', async () => {
    const onChange = jest.fn();
    const { getByLabelText } = await render(<WorkoutSetRow index={0} set={baseSet} onChange={onChange} onToggle={jest.fn()} />);
    fireEvent.changeText(getByLabelText('Set 1 reps'), '10');
    expect(onChange).toHaveBeenCalledWith('reps', '10');
  });

  it('calls onToggle when check button is pressed', async () => {
    const onToggle = jest.fn();
    const { getByLabelText } = await render(<WorkoutSetRow index={0} set={baseSet} onChange={jest.fn()} onToggle={onToggle} />);
    fireEvent.press(getByLabelText('Complete set 1'));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('shows completed state accessibility info', async () => {
    const completedSet = { ...baseSet, isCompleted: true };
    const { getByLabelText } = await render(<WorkoutSetRow index={0} set={completedSet} onChange={jest.fn()} onToggle={jest.fn()} />);
    const toggle = getByLabelText('Mark incomplete set 1');
    expect(toggle).toHaveProp('accessibilityState', { checked: true });
  });
});
