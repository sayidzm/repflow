import React from 'react';
import { Text, Pressable } from 'react-native';
import { render, fireEvent, act } from '@testing-library/react-native';

import { WorkoutDraftProvider, useWorkoutDraft } from '@/providers/WorkoutDraftProvider';

function TestComponent() {
  const { exercises, addExercise, addSet, updateSet, toggleSet } = useWorkoutDraft();
  return (
    <>
      <Text testID="count">{exercises.length}</Text>
      {exercises.map((exercise) =>
        exercise.sets.map((set: { id: string; weight: string; reps: string; isCompleted: boolean }) => (
          <Text key={set.id} testID={`set-${set.id}`}>
            {`${set.weight}|${set.reps}|${set.isCompleted ? '1' : '0'}`}
          </Text>
        )),
      )}
      <Pressable testID="add-exercise" onPress={() => addExercise({ id: 'new-ex', name: 'New', muscleGroup: 'Core', category: 'Bodyweight', isCustom: false, createdAt: 0, updatedAt: 0 })} />
      <Pressable testID="add-set" onPress={() => addSet(exercises[0]?.id ?? '')} />
      <Pressable testID="update-weight" onPress={() => { const set = exercises[0]?.sets[0]; if (set) updateSet(exercises[0].id, set.id, 'weight', '100'); }} />
      <Pressable testID="toggle" onPress={() => { const set = exercises[0]?.sets[0]; if (set) toggleSet(exercises[0].id, set.id); }} />
    </>
  );
}

describe('WorkoutDraftProvider', () => {
  it('starts with reference exercises', async () => {
    const { getByTestId } = await render(<WorkoutDraftProvider><TestComponent /></WorkoutDraftProvider>);
    expect(getByTestId('count').props.children).toBe(2);
  });

  it('adds exercise without duplicate', async () => {
    const { getByTestId } = await render(<WorkoutDraftProvider><TestComponent /></WorkoutDraftProvider>);
    await act(async () => {
      fireEvent.press(getByTestId('add-exercise'));
    });
    expect(getByTestId('count').props.children).toBe(3);
    await act(async () => {
      fireEvent.press(getByTestId('add-exercise'));
    });
    expect(getByTestId('count').props.children).toBe(3);
  });

  it('adds a new set to first exercise', async () => {
    const { getByTestId, getAllByTestId } = await render(<WorkoutDraftProvider><TestComponent /></WorkoutDraftProvider>);
    const beforeSets = getAllByTestId(/^set-bench/);
    await act(async () => {
      fireEvent.press(getByTestId('add-set'));
    });
    const afterSets = getAllByTestId(/^set-bench/);
    expect(afterSets.length).toBe(beforeSets.length + 1);
  });

  it('updates set weight', async () => {
    const { getByTestId } = await render(<WorkoutDraftProvider><TestComponent /></WorkoutDraftProvider>);
    await act(async () => {
      fireEvent.press(getByTestId('update-weight'));
    });
    expect(getByTestId('set-bench-1').props.children).toContain('100');
  });

  it('toggles set completed', async () => {
    const { getByTestId } = await render(<WorkoutDraftProvider><TestComponent /></WorkoutDraftProvider>);
    const before = getByTestId('set-bench-1').props.children;
    await act(async () => {
      fireEvent.press(getByTestId('toggle'));
    });
    const after = getByTestId('set-bench-1').props.children;
    expect(before).not.toEqual(after);
  });
});
