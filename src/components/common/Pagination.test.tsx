import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Pagination } from './Pagination';

describe('Pagination', () => {
  it('renders nothing when totalPages is 0', () => {
    const { container } = render(
      <Pagination currentPage={0} totalPages={0} onPageChange={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when totalPages is 1', () => {
    const { container } = render(
      <Pagination currentPage={0} totalPages={1} onPageChange={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders page numbers', () => {
    render(<Pagination currentPage={0} totalPages={5} onPageChange={vi.fn()} />);

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('highlights current page', () => {
    render(<Pagination currentPage={2} totalPages={5} onPageChange={vi.fn()} />);

    const page3Button = screen.getByText('3');
    expect(page3Button).toHaveClass('bg-ink');
    expect(page3Button).toHaveClass('text-paper-light');
  });

  it('calls onPageChange when page is clicked', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    render(<Pagination currentPage={0} totalPages={5} onPageChange={onPageChange} />);

    await user.click(screen.getByText('3'));

    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('disables previous button on first page', () => {
    render(<Pagination currentPage={0} totalPages={5} onPageChange={vi.fn()} />);

    const prevButton = screen.getByLabelText('Previous page');
    expect(prevButton).toBeDisabled();
  });

  it('enables previous button when not on first page', () => {
    render(<Pagination currentPage={2} totalPages={5} onPageChange={vi.fn()} />);

    const prevButton = screen.getByLabelText('Previous page');
    expect(prevButton).not.toBeDisabled();
  });

  it('calls onPageChange with previous page when prev clicked', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    render(<Pagination currentPage={2} totalPages={5} onPageChange={onPageChange} />);

    await user.click(screen.getByLabelText('Previous page'));

    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it('disables next button on last page', () => {
    render(<Pagination currentPage={4} totalPages={5} onPageChange={vi.fn()} />);

    const nextButton = screen.getByLabelText('Next page');
    expect(nextButton).toBeDisabled();
  });

  it('enables next button when not on last page', () => {
    render(<Pagination currentPage={2} totalPages={5} onPageChange={vi.fn()} />);

    const nextButton = screen.getByLabelText('Next page');
    expect(nextButton).not.toBeDisabled();
  });

  it('calls onPageChange with next page when next clicked', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    render(<Pagination currentPage={2} totalPages={5} onPageChange={onPageChange} />);

    await user.click(screen.getByLabelText('Next page'));

    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('shows first 5 pages when many pages and current is early', () => {
    render(<Pagination currentPage={1} totalPages={10} onPageChange={vi.fn()} />);

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.queryByText('6')).not.toBeInTheDocument();
  });

  it('shows last 5 pages when many pages and current is late', () => {
    render(<Pagination currentPage={8} totalPages={10} onPageChange={vi.fn()} />);

    expect(screen.getByText('6')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('9')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.queryByText('5')).not.toBeInTheDocument();
  });

  it('shows centered pages when many pages and current is middle', () => {
    render(<Pagination currentPage={5} totalPages={10} onPageChange={vi.fn()} />);

    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
  });

  it('has proper aria labels', () => {
    render(<Pagination currentPage={2} totalPages={5} onPageChange={vi.fn()} />);

    expect(screen.getByLabelText('Previous page')).toBeInTheDocument();
    expect(screen.getByLabelText('Next page')).toBeInTheDocument();
    expect(screen.getByLabelText('Page 3')).toBeInTheDocument();
  });

  it('sets aria-current on current page', () => {
    render(<Pagination currentPage={2} totalPages={5} onPageChange={vi.fn()} />);

    const page3Button = screen.getByLabelText('Page 3');
    expect(page3Button).toHaveAttribute('aria-current', 'page');
  });
});
