import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './button';

describe('Button', () => {
  it('renders children with type=button by default', () => {
    render(<Button>Save</Button>);

    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toHaveAttribute('type', 'button');
  });

  it('honors an explicit submit type', () => {
    render(<Button type="submit">Send</Button>);

    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });

  it('applies variant and size classes', () => {
    const { rerender } = render(<Button variant="primary" size="sm">A</Button>);
    expect(screen.getByRole('button').className).toContain('bg-primary-500');
    expect(screen.getByRole('button').className).toContain('h-8');

    rerender(<Button variant="destructive" size="lg">A</Button>);
    expect(screen.getByRole('button').className).toContain('bg-error');
    expect(screen.getByRole('button').className).toContain('h-11');
  });

  it('applies block width and custom className', () => {
    render(<Button block className="mt-2">A</Button>);

    const button = screen.getByRole('button');
    expect(button.className).toContain('w-full');
    expect(button.className).toContain('mt-2');
  });

  it('shows a spinner and disables the button while loading', () => {
    const { container } = render(<Button loading>Saving</Button>);

    expect(container.querySelector('svg.animate-spin')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('fires onClick when enabled and not when disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    const { rerender } = render(<Button onClick={onClick}>Go</Button>);
    await user.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);

    rerender(<Button onClick={onClick} disabled>Go</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
