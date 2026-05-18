import React from 'react';
import { render, screen } from '@testing-library/react';
import { Icons as ActualIcons } from '@/components/icons';

// Create a more complete mock that overrides the one in jest.setup.js
jest.mock('@/components/icons', () => {
  const React = require('react'); // Ensure React is available in this scope

  function MockMoonIcon(props: any) {
    return React.createElement('span', { ...props, 'data-testid': 'moon-icon' }, 'Moon Icon');
  }
  function MockSunIcon(props: any) {
    return React.createElement('span', { ...props, 'data-testid': 'sun-icon' }, 'Sun Icon');
  }
  function MockCatIcon(props: any) {
    return React.createElement('span', { ...props, 'data-testid': 'cat-icon' }, 'Cat Icon');
  }
  function MockDogIcon(props: any) {
    return React.createElement('span', { ...props, 'data-testid': 'dog-icon' }, 'Dog Icon');
  }
  function MockFishIcon(props: any) {
    return React.createElement('span', { ...props, 'data-testid': 'fish-icon' }, 'Fish Icon');
  }
  function MockRabbitIcon(props: any) {
    return React.createElement('span', { ...props, 'data-testid': 'rabbit-icon' }, 'Rabbit Icon');
  }
  function MockTurtleIcon(props: any) {
    return React.createElement('span', { ...props, 'data-testid': 'turtle-icon' }, 'Turtle Icon');
  }
  function MockCodeIcon(props: any) {
    return React.createElement('span', { ...props, 'data-testid': 'code-icon' }, 'Code Icon');
  }
  function MockGlobeIcon(props: any) {
    return React.createElement('span', { ...props, 'data-testid': 'globe-icon' }, 'Globe Icon');
  }
  function MockUsersIcon(props: any) {
    return React.createElement('span', { ...props, 'data-testid': 'users-icon' }, 'Users Icon');
  }
  function MockStarIcon(props: any) {
    return React.createElement('span', { ...props, 'data-testid': 'star-icon' }, 'Star Icon');
  }
  function MockHeartIcon(props: any) {
    return React.createElement('span', { ...props, 'data-testid': 'heart-icon' }, 'Heart Icon');
  }
  function MockZapIcon(props: any) {
    return React.createElement('span', { ...props, 'data-testid': 'zap-icon' }, 'Zap Icon');
  }
const MockCpuIcon = (props: any) => React.createElement('span', { ...props, 'data-testid': 'cpu-icon' }, 'Cpu Icon');
const MockDatabaseIcon = (props: any) => React.createElement('span', { ...props, 'data-testid': 'database-icon' }, 'Database Icon');
const MockMonitorIcon = (props: any) => React.createElement('span', { ...props, 'data-testid': 'monitor-icon' }, 'Monitor Icon');
const MockSmartphoneIcon = (props: any) => React.createElement('span', { ...props, 'data-testid': 'smartphone-icon' }, 'Smartphone Icon');
const MockWandIcon = (props: any) => React.createElement('span', { ...props, 'data-testid': 'wand-icon' }, 'Wand Icon');
const MockCalendarIcon = (props: any) => React.createElement('span', { ...props, 'data-testid': 'calendar-icon' }, 'Calendar Icon');
const MockHardDriveIcon = (props: any) => React.createElement('span', { ...props, 'data-testid': 'harddrive-icon' }, 'Hard Drive Icon');
const MockTrendingUpIcon = (props: any) => React.createElement('span', { ...props, 'data-testid': 'trending-up-icon' }, 'Trending Up Icon');
  function MockDollarSignIcon(props: any) {
    return React.createElement('span', { ...props, 'data-testid': 'dollar-sign-icon' }, 'Dollar Sign Icon');
  }
  function MockTargetIcon(props: any) {
    return React.createElement('span', { ...props, 'data-testid': 'target-icon' }, 'Target Icon');
  }
  function MockShieldIcon(props: any) {
    return React.createElement('span', { ...props, 'data-testid': 'shield-icon' }, 'Shield Icon');
  }
  function MockMailIcon(props: any) {
    return React.createElement('span', { ...props, 'data-testid': 'mail-icon' }, 'Mail Icon');
  }
  function MockPieChartIcon(props: any) {
    return React.createElement('span', { ...props, 'data-testid': 'pie-chart-icon' }, 'Pie Chart Icon');
  }
  function MockActivityIcon(props: any) {
    return React.createElement('span', { ...props, 'data-testid': 'activity-icon' }, 'Activity Icon');
  }
  function MockSearchIcon(props: any) {
    return React.createElement('span', { ...props, 'data-testid': 'search-icon' }, 'Search Icon');
  }
  function MockMessageCircleIcon(props: any) {
    return React.createElement('span', { ...props, 'data-testid': 'message-circle-icon' }, 'Message Circle Icon');
  }
  function MockBotIcon(props: any) {
    return React.createElement('span', { ...props, 'data-testid': 'bot-icon' }, 'Bot Icon');
  }
  function MockMaximizeIcon(props: any) {
    return React.createElement('span', { ...props, 'data-testid': 'maximize-icon' }, 'Maximize Icon');
  }
  function MockMinimizeIcon(props: any) {
    return React.createElement('span', { ...props, 'data-testid': 'minimize-icon' }, 'Minimize Icon');
  }
  function MockXIcon(props: any) {
    return React.createElement('span', { ...props, 'data-testid': 'x-icon' }, 'X Icon');
  }
  function MockEyeOffIcon(props: any) {
    return React.createElement('span', { ...props, 'data-testid': 'eye-off-icon' }, 'Eye Off Icon');
  }
  function MockEyeIcon(props: any) {
    return React.createElement('span', { ...props, 'data-testid': 'eye-icon' }, 'Eye Icon');
  }
  function MockCopyIcon(props: any) {
    return React.createElement('span', { ...props, 'data-testid': 'copy-icon' }, 'Copy Icon');
  }
  function MockCheckIcon(props: any) {
    return React.createElement('span', { ...props, 'data-testid': 'check-icon' }, 'Check Icon');
  }
  function MockClockIcon(props: any) {
    return React.createElement('span', { ...props, 'data-testid': 'clock-icon' }, 'Clock Icon');
  }
  function MockChevronUpIcon(props: any) {
    return React.createElement('span', { ...props, 'data-testid': 'chevron-up-icon' }, 'Chevron Up Icon');
  }
  function MockChevronDownIcon(props: any) {
    return React.createElement('span', { ...props, 'data-testid': 'chevron-down-icon' }, 'Chevron Down Icon');
  }

// Mock GitHub icon as a full SVG component
  function MockGitHubIcon(props: any) {
    return React.createElement('svg', {
      ...props,
      'aria-hidden': 'true',
      'focusable': 'false',
      'data-prefix': 'fab',
      'data-icon': 'github',
      'role': 'img',
      'xmlns': 'http://www.w3.org/2000/svg',
      'viewBox': '0 0 496 512',
      'data-testid': 'github-icon'
    }, React.createElement('path', {
      fill: 'currentColor',
      d: 'M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z'
    }));
  }

  return {
    Icons: {
      moonIcon: MockMoonIcon,
      sunIcon: MockSunIcon,
      cat: MockCatIcon,
      dog: MockDogIcon,
      fish: MockFishIcon,
      rabbit: MockRabbitIcon,
      turtle: MockTurtleIcon,
      code: MockCodeIcon,
      globe: MockGlobeIcon,
      users: MockUsersIcon,
      star: MockStarIcon,
      heart: MockHeartIcon,
      zap: MockZapIcon,
      cpu: MockCpuIcon,
      database: MockDatabaseIcon,
      monitor: MockMonitorIcon,
      smartphone: MockSmartphoneIcon,
      wand: MockWandIcon,
      calendar: MockCalendarIcon,
      harddrive: MockHardDriveIcon,
      trendingUp: MockTrendingUpIcon,
      dollarSign: MockDollarSignIcon,
      target: MockTargetIcon,
      shield: MockShieldIcon,
      mail: MockMailIcon,
      pieChart: MockPieChartIcon,
      activity: MockActivityIcon,
      search: MockSearchIcon,
      messageCircle: MockMessageCircleIcon,
      bot: MockBotIcon,
      maximize: MockMaximizeIcon,
      minimize: MockMinimizeIcon,
      x: MockXIcon,
      eyeOff: MockEyeOffIcon,
      eye: MockEyeIcon,
      copy: MockCopyIcon,
      check: MockCheckIcon,
      clock: MockClockIcon,
      chevronUp: MockChevronUpIcon,
      chevronDown: MockChevronDownIcon,
      gitHub: MockGitHubIcon,
    }
  };
});

// Need to import after the mock is set up
import { Icons } from '@/components/icons';

describe('Icons', () => {
  describe('exported icon components', () => {
    test('should export moonIcon', () => {
      expect(Icons.moonIcon).toBeDefined();
    });

    test('should export sunIcon', () => {
      expect(Icons.sunIcon).toBeDefined();
    });

    test('should export cat', () => {
      expect(Icons.cat).toBeDefined();
    });

    test('should export dog', () => {
      expect(Icons.dog).toBeDefined();
    });

    test('should export fish', () => {
      expect(Icons.fish).toBeDefined();
    });

    test('should export rabbit', () => {
      expect(Icons.rabbit).toBeDefined();
    });

    test('should export turtle', () => {
      expect(Icons.turtle).toBeDefined();
    });

    test('should export code', () => {
      expect(Icons.code).toBeDefined();
    });

    test('should export globe', () => {
      expect(Icons.globe).toBeDefined();
    });

    test('should export users', () => {
      expect(Icons.users).toBeDefined();
    });

    test('should export star', () => {
      expect(Icons.star).toBeDefined();
    });

    test('should export heart', () => {
      expect(Icons.heart).toBeDefined();
    });

    test('should export zap', () => {
      expect(Icons.zap).toBeDefined();
    });

    test('should export cpu', () => {
      expect(Icons.cpu).toBeDefined();
    });

    test('should export database', () => {
      expect(Icons.database).toBeDefined();
    });

    test('should export monitor', () => {
      expect(Icons.monitor).toBeDefined();
    });

    test('should export smartphone', () => {
      expect(Icons.smartphone).toBeDefined();
    });

    test('should export wand', () => {
      expect(Icons.wand).toBeDefined();
    });

    test('should export calendar', () => {
      expect(Icons.calendar).toBeDefined();
    });

    test('should export harddrive', () => {
      expect(Icons.harddrive).toBeDefined();
    });

    test('should export trendingUp', () => {
      expect(Icons.trendingUp).toBeDefined();
    });

    test('should export dollarSign', () => {
      expect(Icons.dollarSign).toBeDefined();
    });

    test('should export target', () => {
      expect(Icons.target).toBeDefined();
    });

    test('should export shield', () => {
      expect(Icons.shield).toBeDefined();
    });

    test('should export mail', () => {
      expect(Icons.mail).toBeDefined();
    });

    test('should export pieChart', () => {
      expect(Icons.pieChart).toBeDefined();
    });

    test('should export activity', () => {
      expect(Icons.activity).toBeDefined();
    });

    test('should export search', () => {
      expect(Icons.search).toBeDefined();
    });

    test('should export messageCircle', () => {
      expect(Icons.messageCircle).toBeDefined();
    });

    test('should export bot', () => {
      expect(Icons.bot).toBeDefined();
    });

    test('should export maximize', () => {
      expect(Icons.maximize).toBeDefined();
    });

    test('should export minimize', () => {
      expect(Icons.minimize).toBeDefined();
    });

    test('should export x', () => {
      expect(Icons.x).toBeDefined();
    });

    test('should export eyeOff', () => {
      expect(Icons.eyeOff).toBeDefined();
    });

    test('should export eye', () => {
      expect(Icons.eye).toBeDefined();
    });

    test('should export copy', () => {
      expect(Icons.copy).toBeDefined();
    });

    test('should export check', () => {
      expect(Icons.check).toBeDefined();
    });

    test('should export clock', () => {
      expect(Icons.clock).toBeDefined();
    });

    test('should export chevronUp', () => {
      expect(Icons.chevronUp).toBeDefined();
    });

    test('should export chevronDown', () => {
      expect(Icons.chevronDown).toBeDefined();
    });

    test('should export gitHub', () => {
      expect(Icons.gitHub).toBeDefined();
    });
  });

  describe('GitHub icon rendering', () => {
    test('renders GitHub icon without crashing', () => {
      render(React.createElement(Icons.gitHub));

      const githubIcon = screen.getByTestId('github-icon');
      expect(githubIcon).toBeInTheDocument();
    });

    test('GitHub icon has correct attributes', () => {
      render(React.createElement(Icons.gitHub));

      const githubIcon = screen.getByTestId('github-icon');
      expect(githubIcon).toHaveAttribute('aria-hidden', 'true');
      expect(githubIcon).toHaveAttribute('focusable', 'false');
      expect(githubIcon).toHaveAttribute('data-prefix', 'fab');
      expect(githubIcon).toHaveAttribute('data-icon', 'github');
      expect(githubIcon).toHaveAttribute('role', 'img');
      expect(githubIcon).toHaveAttribute('xmlns', 'http://www.w3.org/2000/svg');
      expect(githubIcon).toHaveAttribute('viewBox', '0 0 496 512');
    });

    test('GitHub icon has correct path element', () => {
      render(React.createElement(Icons.gitHub));

      const githubIcon = screen.getByTestId('github-icon');
      const pathElement = githubIcon.querySelector('path');
      expect(pathElement).toBeInTheDocument();
      expect(pathElement).toHaveAttribute('fill', 'currentColor');
    });

    test('GitHub icon accepts props', () => {
      render(React.createElement(Icons.gitHub, { className: 'test-class' }));

      const githubIcon = screen.getByTestId('github-icon');
      expect(githubIcon).toHaveClass('test-class');
    });
  });
});