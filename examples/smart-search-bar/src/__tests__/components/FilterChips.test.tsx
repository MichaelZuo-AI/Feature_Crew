import React from 'react';
import '@testing-library/jest-dom/jest-globals';
import { render, screen, fireEvent, act } from '@testing-library/react';
import FilterChips from '@/components/SmartSearchBar/FilterChips';
import type { FilterChip } from '@/lib/types';

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const mockChips: FilterChip[] = [
  { key: 'priceMax', value: 50, label: 'Under $50' },
  { key: 'color', value: 'blue', label: 'Blue' },
  { key: 'category', value: 'shoes', label: 'Shoes' },
];

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('FilterChips', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders nothing when chips array is empty', () => {
    const { container } = render(
      <FilterChips chips={[]} onRemoveChip={jest.fn()} isSmallMobile={false} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders all chips from the array', () => {
    render(
      <FilterChips
        chips={mockChips}
        onRemoveChip={jest.fn()}
        isSmallMobile={false}
      />,
    );

    expect(screen.getByText('Under $50')).toBeInTheDocument();
    expect(screen.getByText('Blue')).toBeInTheDocument();
    expect(screen.getByText('Shoes')).toBeInTheDocument();
  });

  it('calls onRemoveChip with correct key when remove button is clicked', () => {
    const onRemoveChip = jest.fn();
    render(
      <FilterChips
        chips={mockChips}
        onRemoveChip={onRemoveChip}
        isSmallMobile={false}
      />,
    );

    // Click the remove button for "Blue" chip
    const removeBtn = screen.getByRole('button', {
      name: /remove filter: blue/i,
    });
    fireEvent.click(removeBtn);

    // The Chip component has a 150ms delay before calling onRemove
    act(() => {
      jest.advanceTimersByTime(150);
    });

    expect(onRemoveChip).toHaveBeenCalledWith('color');
  });

  it('each chip has correct aria-label on its remove button', () => {
    render(
      <FilterChips
        chips={mockChips}
        onRemoveChip={jest.fn()}
        isSmallMobile={false}
      />,
    );

    expect(
      screen.getByRole('button', { name: 'Remove filter: Under $50' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Remove filter: Blue' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Remove filter: Shoes' }),
    ).toBeInTheDocument();
  });

  it('renders in flex-wrap mode when isSmallMobile is false', () => {
    const { container } = render(
      <FilterChips
        chips={mockChips}
        onRemoveChip={jest.fn()}
        isSmallMobile={false}
      />,
    );

    // In non-mobile mode, it renders a simple div with flex-wrap
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('flex-wrap');
  });
});
