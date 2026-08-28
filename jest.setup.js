// jest.setup.js
require('@testing-library/jest-dom');

// Ensure Request and Response are available in the global scope for Node.js
// This is necessary for the Next.js server mock to work properly
if (!global.Request) {
  global.Request = class MockRequest {
    constructor(input, init) {
      this.input = input;
      this.init = init;
    }
  };
}

if (!global.Response) {
  global.Response = class MockResponse {
    constructor(body, init) {
      this.body = body;
      this.init = init;
      // Add status and headers for compatibility
      this.status = (init && init.status) || 200;
      this.headers = new Map();
      if (init && init.headers) {
        Object.entries(init.headers).forEach(([key, value]) => {
          this.headers.set(key.toLowerCase(), value);
        });
      }
    }

    static json(data, init) {
      const body = JSON.stringify(data);
      const response = new MockResponse(body, {
        ...init,
        headers: {
          'Content-Type': 'application/json',
          ...(init?.headers || {}),
        },
      });
      // Add json method to the response instance
      response.json = () => Promise.resolve(data);
      return response;
    }

    // Add json method to be able to parse response body
    async json() {
      if (this.body && typeof this.body === 'string') {
        try {
          return JSON.parse(this.body);
        } catch (e) {
          return {};
        }
      }
      return this.body || {};
    }
  };
}

// Mock the modules that are causing ES module issues
jest.mock('rehype-highlight', () => {
  return {
    __esModule: true,
    default: jest.fn()
  };
});

jest.mock('react-markdown', () => {
  return jest.fn(({ children, components, ...props }) => {
    const { children: nodeChildren, ...nodeProps } = props;
    return (
      <div data-testid="react-markdown" {...nodeProps}>
        {typeof children === 'function' ? children() : children}
        {components && components.code
          ? <code data-testid="mocked-code">{components.code({node: {}, inline: false, className: '', children: 'mocked code'})}</code>
          : null}
      </div>
    );
  });
});

jest.mock('remark-gfm', () => {
  return jest.fn();
});

// Mock the Icons component since it might be causing import issues
jest.mock('@/components/icons', () => {
  const React = require('react');
  return {
    Icons: {
      zap: ({ className } = {}) => React.createElement('span', { className: className, 'data-testid': 'zap-icon' }, 'zap-icon'),
      x: ({ className } = {}) => React.createElement('span', { className: className, 'data-testid': 'x-icon' }, 'x-icon'),
      maximize: ({ className } = {}) => React.createElement('span', { className: className, 'data-testid': 'maximize-icon' }, 'maximize-icon'),
      minimize: ({ className } = {}) => React.createElement('span', { className: className, 'data-testid': 'minimize-icon' }, 'minimize-icon'),
      chevronDown: ({ className } = {}) => React.createElement('span', { className: className, 'data-testid': 'chevronDown-icon' }, 'chevronDown-icon'),
      chevronUp: ({ className } = {}) => React.createElement('span', { className: className, 'data-testid': 'chevronUp-icon' }, 'chevronUp-icon'),
      copy: ({ className } = {}) => React.createElement('span', { className: className, 'data-testid': 'copy-icon' }, 'copy-icon'),
      check: ({ className } = {}) => React.createElement('span', { className: className, 'data-testid': 'check-icon' }, 'check-icon'),
      eye: ({ className } = {}) => React.createElement('span', { className: className, 'data-testid': 'eye-icon' }, 'eye-icon'),
      eyeOff: ({ className } = {}) => React.createElement('span', { className: className, 'data-testid': 'eyeOff-icon' }, 'eyeOff-icon'),
      clock: ({ className } = {}) => React.createElement('span', { className: className, 'data-testid': 'clock-icon' }, 'clock-icon'),
    }
  };
});

// Mock ReactMarkdown with React available
jest.mock('react-markdown', () => {
  const React = require('react');
  return jest.fn(({ children, components, ...props }) => {
    const { children: nodeChildren, ...nodeProps } = props;
    return React.createElement('div', { 'data-testid': 'react-markdown', ...nodeProps },
      typeof children === 'function' ? children() : children,
      components && components.code
        ? React.createElement('code', { 'data-testid': 'mocked-code' }, 'mocked code')
        : null
    );
  });
});

// Mock fetch API globally
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ content: 'Mocked AI response content' }),
  })
);

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn().mockResolvedValue(undefined),
  },
});

// Mock scrollIntoView method for DOM elements
Element.prototype.scrollIntoView = jest.fn();