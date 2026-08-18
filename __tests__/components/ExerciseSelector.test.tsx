import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

import { ExerciseSearchBar } from '@/features/exercises/components/ExerciseSearchBar';
import { MuscleGroupFilters } from '@/features/exercises/components/MuscleGroupFilters';
import { ExercisePickerRow } from '@/features/exercises/components/ExercisePickerRow';

describe('ExerciseSearchBar', () => {
  it('calls onChangeText when typing', async () => {
    const onChangeText = jest.fn();
    const { getByLabelText } = await render(<ExerciseSearchBar value="" onChangeText={onChangeText} />);
    fireEvent.changeText(getByLabelText('Egzersiz ara'), 'bench');
    expect(onChangeText).toHaveBeenCalledWith('bench');
  });
});

describe('MuscleGroupFilters', () => {
  it('renders all filter options', async () => {
    const { getByText } = await render(<MuscleGroupFilters selected="All" onSelect={jest.fn()} />);
    expect(getByText('Tümü')).toBeTruthy();
    expect(getByText('Chest')).toBeTruthy();
    expect(getByText('Back')).toBeTruthy();
    expect(getByText('Legs')).toBeTruthy();
    expect(getByText('Shoulders')).toBeTruthy();
    expect(getByText('Arms')).toBeTruthy();
    expect(getByText('Core')).toBeTruthy();
  });

  it('calls onSelect when filter is pressed', async () => {
    const onSelect = jest.fn();
    const { getByText } = await render(<MuscleGroupFilters selected="All" onSelect={onSelect} />);
    fireEvent.press(getByText('Chest'));
    expect(onSelect).toHaveBeenCalledWith('Chest');
  });

  it('marks selected filter with accessibility state', async () => {
    const { getByText } = await render(<MuscleGroupFilters selected="Chest" onSelect={jest.fn()} />);
    const chestButton = getByText('Chest').parent;
    expect(chestButton).toHaveProp('accessibilityState', { selected: true });
  });
});

describe('ExercisePickerRow', () => {
  const exercise = { id: 'bench-press', name: 'Bench Press', muscleGroup: 'Chest' as const, category: 'Barbell' as const, isCustom: false, createdAt: 0, updatedAt: 0 };

  it('renders exercise name and meta', async () => {
    const { getByText } = await render(<ExercisePickerRow exercise={exercise} selected={false} onPress={jest.fn()} />);
    expect(getByText('Bench Press')).toBeTruthy();
    expect(getByText('Chest · Barbell')).toBeTruthy();
  });

  it('shows checked accessibility state when selected', async () => {
    const { getByRole } = await render(<ExercisePickerRow exercise={exercise} selected={true} onPress={jest.fn()} />);
    expect(getByRole('checkbox')).toHaveProp('accessibilityState', { checked: true });
  });

  it('calls onPress when pressed', async () => {
    const onPress = jest.fn();
    const { getByText } = await render(<ExercisePickerRow exercise={exercise} selected={false} onPress={onPress} />);
    fireEvent.press(getByText('Bench Press'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
