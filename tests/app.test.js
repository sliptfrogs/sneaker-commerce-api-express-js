describe('Basic Tests', () => {
  it('should pass basic test', () => {
    expect(1 + 1).toBe(2);
  });

  it('should verify environment', () => {
    expect(typeof process.env).toBe('object');
  });
});
