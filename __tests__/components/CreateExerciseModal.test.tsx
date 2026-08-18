import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { CreateExerciseModal } from '@/features/exercises/components/CreateExerciseModal';

const initialMetrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
};

function renderWithSafeArea(ui: React.ReactElement) {
  return render(<SafeAreaProvider initialMetrics={initialMetrics}>{ui}</SafeAreaProvider>);
}

describe('CreateExerciseModal', () => {
  it('renders modal content when visible', async () => {
    const { getByText, getByPlaceholderText } = await renderWithSafeArea(
      <CreateExerciseModal onClose={jest.fn()} onSubmit={jest.fn()} visible={true} />,
    );
    expect(getByText('New Custom Exercise')).toBeTruthy();
    expect(getByPlaceholderText('e.g. Incline Cable Press')).toBeTruthy();
  });

  it('validates empty name on submission', async () => {
    const onSubmit = jest.fn();
    const { getByText } = await renderWithSafeArea(
      <CreateExerciseModal onClose={jest.fn()} onSubmit={onSubmit} visible={true} />,
    );

    await act(async () => {
      fireEvent.press(getByText('Save Exercise'));
    });

    expect(getByText('Exercise name cannot be empty.')).toBeTruthy();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits valid data when form is filled', async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined);
    const onClose = jest.fn();
    const { getByText, getByLabelText } = await renderWithSafeArea(
      <CreateExerciseModal onClose={onClose} onSubmit={onSubmit} visible={true} />,
    );

    await act(async () => {
      fireEvent.changeText(getByLabelText('Exercise name input'), 'Hammer Curl');
      fireEvent.press(getByText('Arms'));
      fireEvent.press(getByText('Dumbbell'));
    });

    await act(async () => {
      fireEvent.press(getByText('Save Exercise'));
    });

    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Hammer Curl',
      muscleGroup: 'Arms',
      category: 'Dumbbell',
    });
    expect(onClose).toHaveBeenCalled();
  });
});
