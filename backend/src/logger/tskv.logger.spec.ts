import { TskvLogger } from './tskv.logger';

describe('TskvLogger', () => {
  const logger = new TskvLogger();

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('formats a log message as a TSKV string', () => {
    expect(logger.formatMessage('log', 'Server started', ['Bootstrap'])).toBe(
      'level=log\tmessage=Server started\toptionalParams=["Bootstrap"]',
    );
  });

  it('escapes tabulation and line-break characters in a message', () => {
    expect(logger.formatMessage('warn', 'First line\nSecond\tline', [])).toBe(
      'level=warn\tmessage=First line\\nSecond\\tline\toptionalParams=[]',
    );
  });

  it('writes a warning through console.warn', () => {
    const consoleWarnSpy = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => undefined);

    logger.warn('No available tickets', 'OrderService');

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'level=warn\tmessage=No available tickets\toptionalParams=["OrderService"]',
    );
  });
});
