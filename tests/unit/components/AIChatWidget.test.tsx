import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AIChatWidget from '../../../src/components/Chat/AIChatWidget';

describe('AIChatWidget', () => {
  it('renders the closed widget by default', () => {
    render(<AIChatWidget />);
    expect(screen.getByRole('button', { name: /open ai chat/i })).toBeInTheDocument();
  });

  it('opens the chat window when the button is clicked', () => {
    render(<AIChatWidget />);
    const openButton = screen.getByRole('button', { name: /open ai chat/i });
    fireEvent.click(openButton);

    expect(screen.getByText('AI Assistant')).toBeInTheDocument();
    expect(screen.getByText('How can I help you qualify this lead today?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /start a new conversation/i })).toBeInTheDocument();
  });

  it('closes the chat window when the close button is clicked', () => {
    render(<AIChatWidget />);

    // Open it first
    const openButton = screen.getByRole('button', { name: /open ai chat/i });
    fireEvent.click(openButton);
    expect(screen.getByText('AI Assistant')).toBeInTheDocument();

    // Now close it
    const closeButton = screen.getByRole('button', { name: /close chat/i });
    fireEvent.click(closeButton);

    expect(screen.queryByText('AI Assistant')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /open ai chat/i })).toBeInTheDocument();
  });
});
