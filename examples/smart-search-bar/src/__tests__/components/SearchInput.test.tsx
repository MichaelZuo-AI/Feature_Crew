import React from 'react';
import '@testing-library/jest-dom/jest-globals';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchInput from '@/components/SmartSearchBar/SearchInput';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

jest.mock('@/components/icons', () => ({
  SearchIcon: (props: React.HTMLAttributes<HTMLSpanElement>) => (
    <span data-testid="search-icon" {...props} />
  ),
  CameraIcon: (props: React.HTMLAttributes<HTMLSpanElement>) => (
    <span data-testid="camera-icon" {...props} />
  ),
  MicrophoneIcon: (props: React.HTMLAttributes<HTMLSpanElement>) => (
    <span data-testid="microphone-icon" {...props} />
  ),
  CloseIcon: (props: React.HTMLAttributes<HTMLSpanElement>) => (
    <span data-testid="close-icon" {...props} />
  ),
}));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function renderSearchInput(overrides: Partial<React.ComponentProps<typeof SearchInput>> = {}) {
  const defaultProps: React.ComponentProps<typeof SearchInput> = {
    query: '',
    onQueryChange: jest.fn(),
    onFocus: jest.fn(),
    onSubmit: jest.fn(),
    onClear: jest.fn(),
    onKeyDown: jest.fn(),
    inputRef: React.createRef<HTMLInputElement>(),
    isMobile: false,
    ...overrides,
  };

  return { ...render(<SearchInput {...defaultProps} />), props: defaultProps };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('SearchInput', () => {
  it('renders with the placeholder text', () => {
    renderSearchInput();
    expect(
      screen.getByPlaceholderText('Search for anything...'),
    ).toBeInTheDocument();
  });

  it('shows clear button when query is non-empty', () => {
    renderSearchInput({ query: 'shoes' });
    expect(
      screen.getByRole('button', { name: /clear search/i }),
    ).toBeInTheDocument();
  });

  it('hides clear button when query is empty', () => {
    renderSearchInput({ query: '' });
    expect(
      screen.queryByRole('button', { name: /clear search/i }),
    ).not.toBeInTheDocument();
  });

  it('calls onQueryChange when user types', async () => {
    const onQueryChange = jest.fn();
    renderSearchInput({ onQueryChange });

    const input = screen.getByRole('combobox');
    fireEvent.change(input, { target: { value: 'shoes' } });

    expect(onQueryChange).toHaveBeenCalledWith('shoes');
  });

  it('calls onSubmit when Enter is pressed with a non-empty query', () => {
    const onSubmit = jest.fn();
    renderSearchInput({ query: 'shoes', onSubmit });

    const form = screen.getByRole('combobox').closest('form')!;
    fireEvent.submit(form);

    expect(onSubmit).toHaveBeenCalledWith('shoes');
  });

  it('does not call onSubmit when query is whitespace-only', () => {
    const onSubmit = jest.fn();
    renderSearchInput({ query: '   ', onSubmit });

    const form = screen.getByRole('combobox').closest('form')!;
    fireEvent.submit(form);

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('calls onClear when clear button is clicked', async () => {
    const user = userEvent.setup();
    const onClear = jest.fn();
    renderSearchInput({ query: 'shoes', onClear });

    const clearBtn = screen.getByRole('button', { name: /clear search/i });
    await user.click(clearBtn);

    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('shows voice button only when isMobile is true', () => {
    const { unmount } = renderSearchInput({ isMobile: false }).props
      ? render(
          <SearchInput
            query=""
            onQueryChange={jest.fn()}
            onFocus={jest.fn()}
            onSubmit={jest.fn()}
            onClear={jest.fn()}
            onKeyDown={jest.fn()}
            inputRef={React.createRef<HTMLInputElement>()}
            isMobile={false}
          />,
        )
      : { unmount: () => {} };

    expect(
      screen.queryByRole('button', { name: /voice search/i }),
    ).not.toBeInTheDocument();
    unmount();

    render(
      <SearchInput
        query=""
        onQueryChange={jest.fn()}
        onFocus={jest.fn()}
        onSubmit={jest.fn()}
        onClear={jest.fn()}
        onKeyDown={jest.fn()}
        inputRef={React.createRef<HTMLInputElement>()}
        isMobile={true}
      />,
    );

    expect(
      screen.getByRole('button', { name: /voice search/i }),
    ).toBeInTheDocument();
  });

  it('shows camera button (disabled)', () => {
    renderSearchInput();
    const cameraBtn = screen.getByRole('button', { name: /camera search/i });
    expect(cameraBtn).toBeDisabled();
  });

  it('has correct ARIA attributes when ariaExpanded and ariaControls are set', () => {
    renderSearchInput({
      ariaExpanded: true,
      ariaControls: 'suggestions-list',
    });

    const input = screen.getByRole('combobox');
    expect(input).toHaveAttribute('aria-expanded', 'true');
    expect(input).toHaveAttribute('aria-controls', 'suggestions-list');
    expect(input).toHaveAttribute('aria-autocomplete', 'list');
  });

  it('has aria-expanded=false by default when prop is false', () => {
    renderSearchInput({ ariaExpanded: false });
    const input = screen.getByRole('combobox');
    expect(input).toHaveAttribute('aria-expanded', 'false');
  });
});
