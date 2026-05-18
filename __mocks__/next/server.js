// Mock the Next.js server module
// Import from global to ensure we have the same instances
const { Headers } = global;

// Create proper NextRequest and NextResponse mocks
class NextRequest extends global.Request {
  constructor(input, init) {
    super(input, init);
    // Add Next.js specific properties if needed
  }
}

class NextResponse extends global.Response {
  constructor(body, init) {
    super(body, init);
  }

  static json(data, init) {
    const body = JSON.stringify(data);
    return new NextResponse(body, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(init?.headers || {}),
      },
    });
  }

  static redirect(url, init) {
    return new NextResponse(null, {
      status: 302,
      headers: {
        Location: url,
        ...(init?.headers || {}),
      },
    });
  }

  static next(init) {
    return new NextResponse(null, {
      status: 200,
      ...init,
    });
  }
}

module.exports = {
  NextRequest,
  NextResponse,
};