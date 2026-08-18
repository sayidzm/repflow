import React from 'react';
import { Text, Pressable } from 'react-native';
import { render, fireEvent, act } from '@testing-library/react-native';

import { WorkoutDraftProvider, useWorkoutDraft } from '@/providers/WorkoutDraftProvider';

function TestComponent() {
  const { exercises, addExercise, removeExercise, addSet, removeSet, updateSet, toggleSet, clearDraft } = useWorkoutDraft();
  return (
    <>
      <Text testID="count">{exercises.length}</Text>
      {exercises.map((exercise) =>
        exercise.sets.map((set: { id: string; weight: string; reps: string; isCompleted: boolean }) => (
          <Text key={set.id} testID="set-item">
            {`${set.weight}|${set.reps}|${set.isCompleted ? '1' : '0'}`}
          </Text>
        )),
      )}
      <Pressable
        testID="add-exercise"
        onPress={() =>
          addExercise({
            id: 'ex-1',
            name: 'Bench Press',
            muscleGroup: 'Chest',
            category: 'Barbell',
            isCustom: false,
            createdAt: 0,
            updatedAt: 0,
          })
        }
      />
      <Pressable
        testID="remove-exercise"
        onPress={() => {
          if (exercises[0]) removeExercise(exercises[0].id);
        }}
      />
      <Pressable
        testID="add-set"
        onPress={() => {
          if (exercises[0]) addSet(exercises[0].id);
        }}
      />
      <Pressable
        testID="remove-set"
        onPress={() => {
          if (exercises[0]?.sets[0]) removeSet(exercises[0].id, exercises[0].sets[0].id);
        }}
      />
      <Pressable
        testID="update-weight"
        onPress={() => {
          const set = exercises[0]?.sets[0];
          if (set) updateSet(exercises[0].id, set.id, 'weight', '100');
        }}
      />
      <Pressable
        testID="toggle"
        onPress={() => {
          const set = exercises[0]?.sets[0];
          if (set) toggleSet(exercises[0].id, set.id);
        }}
      />
      <Pressable testID="clear" onPress={clearDraft} />
    </>
  );
}

describe('WorkoutDraftProvider', () => {
  it('starts with an empty exercise list', async () => {
    const { getByTestId } = await render(
      <WorkoutDraftProvider>
        <TestComponent />
      </WorkoutDraftProvider>,
    );
    expect(getByTestId('count').props.children).toBe(0);
  });

  it('adds exercise without duplicate', async () => {
    const { getByTestId } = await render(
      <WorkoutDraftProvider>
        <TestComponent />
      </WorkoutDraftProvider>,
    );

    await act(async () => {
      fireEvent.press(getByTestId('add-exercise'));
    });
    expect(getByTestId('count').props.children).toBe(1);

    await act(async () => {
      fireEvent.press(getByTestId('add-exercise'));
    });
    expect(getByTestId('count').props.children).toBe(1);
  });

  it('removes exercise', async () => {
    const { getByTestId } = await render(
      <WorkoutDraftProvider>
        <TestComponent />
      </WorkoutDraftProvider>,
    );

    await act(async () => {
      fireEvent.press(getByTestId('add-exercise'));
    });
    expect(getByTestId('count').props.children).toBe(1);

    await act(async () => {
      fireEvent.press(getByTestId('remove-exercise'));
    });
    expect(getByTestId('count').props.children).toBe(0);
  });

  it('adds and updates set', async () => {
    const { getByTestId, getAllByTestId } = await render(
      <WorkoutDraftProvider>
        <TestComponent />
      </WorkoutDraftProvider>,
    );

    await act(async () => {
      fireEvent.press(getByTestId('add-exercise'));
    });
    const beforeSets = getAllByTestId('set-item');

    await act(async () => {
      fireEvent.press(getByTestId('add-set'));
    });
    const afterSets = getAllByTestId('set-item');
    expect(afterSets.length).toBe(beforeSets.length + 1);

    await act(async () => {
      fireEvent.press(getByTestId('update-weight'));
    });
    const updatedSets = getAllByTestId('set-item');
    expect(updatedSets[0].props.children).toContain('100');
  });

  it('clears draft', async () => {
    const { getByTestId } = await render(
      <WorkoutDraftProvider>
        <TestComponent />
      </WorkoutDraftProvider>,
    );

    await act(async () => {
      fireEvent.press(getByTestId('add-exercise'));
    });
    expect(getByTestId('count').props.children).toBe(1);

    await act(async () => {
      fireEvent.press(getByTestId('clear'));
    });
    expect(getByTestId('count').props.children).toBe(0);
  });
});
