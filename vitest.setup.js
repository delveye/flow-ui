import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

afterEach(() => {
  cleanup();
});

// vi.mock('*.css', () => {
//   return {
//     default: {
//       test: 'test_flow_mock'
//     }
//   };
// });

vi.mock('*.svg', () => 'svg-mock');

vi.mock('*.png', () => 'png-mock');

vi.mock('*.md', () => 'md-mock');
vi.mock('*.txt', () => 'txt-mock');

global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
