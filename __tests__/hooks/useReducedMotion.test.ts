import { renderHook } from '@testing-library/react-native';
import { AccessibilityInfo } from 'react-native';

import { useReducedMotion } from '@/hooks/useReducedMotion';

describe('useReducedMotion', () => {
  it('returns reduced motion status from AccessibilityInfo', async () => {
    jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(true);
    jest.spyOn(AccessibilityInfo, 'addEventListener').mockReturnValue({ remove: jest.fn() } as any);

    const { result } = await renderHook(() => useReducedMotion());
    expect(result.current).toBeDefined();
  });
});
