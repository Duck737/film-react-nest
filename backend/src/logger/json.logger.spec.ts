import { JsonLogger } from './json.logger';

describe('JsonLogger', () => {
  const logger = new JsonLogger();

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('formats a log message as JSON', () => {
    expect(logger.formatMessage('log', 'Server started', ['Bootstrap'])).toBe(
      '{"level":"log","message":"Server started","optionalParams":["Bootstrap"]}',
    );
  });

  it('writes an error through console.error', () => {
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);

    logger.error('Database unavailable', 'TypeOrmModule');

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      '{"level":"error","message":"Database unavailable","optionalParams":["TypeOrmModule"]}',
    );
  });
});
