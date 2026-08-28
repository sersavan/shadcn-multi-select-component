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
jest.mock('../icons', () => ({
  Icons: {
    zap: ({ className }: { className?: string }) => <span className={className}>zap-icon</span>,
    x: ({ className }: { className?: string }) => <span className={className}>x-icon</span>,
    maximize: ({ className }: { className?: string }) => <span className={className}>maximize-icon</span>,
    minimize: ({ className }: { className?: string }) => <span className={className}>minimize-icon</span>,
    chevronDown: ({ className }: { className?: string }) => <span className={className}>chevronDown-icon</span>,
    chevronUp: ({ className }: { className?: string }) => <span className={className}>chevronUp-icon</span>,
    copy: ({ className }: { className?: string }) => <span className={className}>copy-icon</span>,
    check: ({ className }: { className?: string }) => <span className={className}>check-icon</span>,
    eye: ({ className }: { className?: string }) => <span className={className}>eye-icon</span>,
    eyeOff: ({ className }: { className?: string }) => <span className={className}>eyeOff-icon</span>,
    clock: ({ className }: { className?: string }) => <span className={className}>clock-icon</span>,
  }
}));

// Mock fetch API globally
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ content: 'Mocked AI response content' }),
  })
) as jest.MockedFunction<typeof fetch>;

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn().mockResolvedValue(undefined),
  },
});