import {
  getBankAccount,
  InsufficientFundsError,
  SynchronizationFailedError,
  TransferFailedError,
} from '.';

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    const account = getBankAccount(1000);
    expect(account.getBalance()).toEqual(1000);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const account = getBankAccount(1000);
    expect(() => account.withdraw(2000)).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring more than balance', () => {
    const accountFrom = getBankAccount(1000);
    const accountTo = getBankAccount(1000);
    expect(() => accountFrom.transfer(2000, accountTo)).toThrow(
      InsufficientFundsError,
    );
  });

  test('should throw error when transferring to the same account', () => {
    const accountFrom = getBankAccount(1000);
    expect(() => accountFrom.transfer(2000, accountFrom)).toThrow(
      TransferFailedError,
    );
  });

  test('should deposit money', () => {
    const account = getBankAccount(1000);

    account.deposit(500);

    expect(account.getBalance()).toEqual(1500);
  });

  test('should withdraw money', () => {
    const account = getBankAccount(1000);

    account.withdraw(400);

    expect(account.getBalance()).toEqual(600);
  });

  test('should transfer money', () => {
    const accountFrom = getBankAccount(1000);
    const accountTo = getBankAccount(1000);

    accountFrom.transfer(200, accountTo);

    expect(accountFrom.getBalance()).toEqual(800);
    expect(accountTo.getBalance()).toEqual(1200);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const account = getBankAccount(1000);

    jest.spyOn(account, 'fetchBalance').mockResolvedValue(50);

    const result = await account.fetchBalance();

    expect(result).toBe(50);
    expect(typeof result).toBe('number');
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const account = getBankAccount(1000);

    jest.spyOn(account, 'fetchBalance').mockResolvedValue(50);

    await account.synchronizeBalance();

    expect(account.getBalance()).toEqual(50);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const account = getBankAccount(1000);

    jest.spyOn(account, 'fetchBalance').mockResolvedValue(null);

    await expect(account.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );
  });
});
