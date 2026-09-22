import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PaginationControls } from './PaginationControls';

describe('PaginationControls', () => {
  it('renders Previous and Next buttons', () => {
    render(
      <PaginationControls page={1} pageSize={25} totalCount={100} onPageChange={vi.fn()} onPageSizeChange={vi.fn()} />
    );
    expect(screen.getByRole('button', { name: 'Previous' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
  });

  it('renders page size selector with options 10, 25, 50', () => {
    render(
      <PaginationControls page={0} pageSize={25} totalCount={100} onPageChange={vi.fn()} onPageSizeChange={vi.fn()} />
    );
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '10' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '25' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '50' })).toBeInTheDocument();
  });

  it('Previous button is disabled on first page (page=0)', () => {
    render(
      <PaginationControls page={0} pageSize={25} totalCount={100} onPageChange={vi.fn()} onPageSizeChange={vi.fn()} />
    );
    expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled();
  });

  it('Previous button is enabled when not on first page', () => {
    render(
      <PaginationControls page={1} pageSize={25} totalCount={100} onPageChange={vi.fn()} onPageSizeChange={vi.fn()} />
    );
    expect(screen.getByRole('button', { name: 'Previous' })).not.toBeDisabled();
  });

  it('Next button is disabled on last page', () => {
    // page=3, pageSize=25, totalCount=100 → (3+1)*25=100 >= 100
    render(
      <PaginationControls page={3} pageSize={25} totalCount={100} onPageChange={vi.fn()} onPageSizeChange={vi.fn()} />
    );
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
  });

  it('Next button is enabled when not on last page', () => {
    render(
      <PaginationControls page={0} pageSize={25} totalCount={100} onPageChange={vi.fn()} onPageSizeChange={vi.fn()} />
    );
    expect(screen.getByRole('button', { name: 'Next' })).not.toBeDisabled();
  });

  it('both buttons are disabled when totalCount is 0', () => {
    render(
      <PaginationControls page={0} pageSize={25} totalCount={0} onPageChange={vi.fn()} onPageSizeChange={vi.fn()} />
    );
    expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
  });

  it('displays "0 of 0 pages" when totalCount is 0', () => {
    render(
      <PaginationControls page={0} pageSize={25} totalCount={0} onPageChange={vi.fn()} onPageSizeChange={vi.fn()} />
    );
    expect(screen.getByText('0 of 0 pages')).toBeInTheDocument();
  });

  it('displays correct page info when totalCount > 0', () => {
    render(
      <PaginationControls page={1} pageSize={25} totalCount={100} onPageChange={vi.fn()} onPageSizeChange={vi.fn()} />
    );
    expect(screen.getByText('Page 2 of 4')).toBeInTheDocument();
  });
});
