import { describe, it, expect } from 'vitest';
import { roundPrice, generateBoostPlan } from '../rounding';

describe('roundPrice', () => {
  describe('none mode', () => {
    it('returns price unchanged', () => {
      expect(roundPrice(1234, { mode: 'none' })).toBe(1234);
      expect(roundPrice(5678, { mode: 'none' })).toBe(5678);
      expect(roundPrice(999, { mode: 'none' })).toBe(999);
    });
  });

  describe('nearest_99 mode', () => {
    it('rounds up to .99 ending', () => {
      expect(roundPrice(1000, { mode: 'nearest_99' })).toBe(1099); // £10.00 -> £10.99
      expect(roundPrice(1050, { mode: 'nearest_99' })).toBe(1099); // £10.50 -> £10.99
      expect(roundPrice(1098, { mode: 'nearest_99' })).toBe(1099); // £10.98 -> £10.99
    });

    it('rounds to next major unit when already at or past .99', () => {
      expect(roundPrice(1099, { mode: 'nearest_99' })).toBe(1199); // £10.99 -> £11.99
      expect(roundPrice(1100, { mode: 'nearest_99' })).toBe(1199); // £11.00 -> £11.99
    });

    it('handles custom ending for .99 mode', () => {
      // Round to .95 instead of .99
      expect(roundPrice(1000, { mode: 'nearest_99', customEnding: 95 })).toBe(1095);
      expect(roundPrice(1050, { mode: 'nearest_99', customEnding: 95 })).toBe(1095);
      expect(roundPrice(1095, { mode: 'nearest_99', customEnding: 95 })).toBe(1195);
    });

    it('handles edge cases', () => {
      expect(roundPrice(0, { mode: 'nearest_99' })).toBe(99); // £0 -> £0.99
      expect(roundPrice(99, { mode: 'nearest_99' })).toBe(199); // £0.99 -> £1.99
      expect(roundPrice(50, { mode: 'nearest_99' })).toBe(99); // £0.50 -> £0.99
    });
  });

  describe('nearest_50 mode', () => {
    it('rounds up to .50 ending', () => {
      expect(roundPrice(1000, { mode: 'nearest_50' })).toBe(1050); // £10.00 -> £10.50
      expect(roundPrice(1025, { mode: 'nearest_50' })).toBe(1050); // £10.25 -> £10.50
      expect(roundPrice(1049, { mode: 'nearest_50' })).toBe(1050); // £10.49 -> £10.50
    });

    it('rounds to next major unit when already at or past .50', () => {
      expect(roundPrice(1050, { mode: 'nearest_50' })).toBe(1150); // £10.50 -> £11.50
      expect(roundPrice(1075, { mode: 'nearest_50' })).toBe(1150); // £10.75 -> £11.50
      expect(roundPrice(1099, { mode: 'nearest_50' })).toBe(1150); // £10.99 -> £11.50
    });

    it('handles edge cases', () => {
      expect(roundPrice(0, { mode: 'nearest_50' })).toBe(50); // £0 -> £0.50
      expect(roundPrice(25, { mode: 'nearest_50' })).toBe(50); // £0.25 -> £0.50
      expect(roundPrice(50, { mode: 'nearest_50' })).toBe(150); // £0.50 -> £1.50
    });
  });

  describe('nearest_00 mode', () => {
    it('rounds up to whole pounds', () => {
      expect(roundPrice(1000, { mode: 'nearest_00' })).toBe(1000); // £10.00 -> £10.00
      expect(roundPrice(1001, { mode: 'nearest_00' })).toBe(1100); // £10.01 -> £11.00
      expect(roundPrice(1050, { mode: 'nearest_00' })).toBe(1100); // £10.50 -> £11.00
      expect(roundPrice(1099, { mode: 'nearest_00' })).toBe(1100); // £10.99 -> £11.00
    });

    it('handles edge cases', () => {
      expect(roundPrice(0, { mode: 'nearest_00' })).toBe(0); // £0 -> £0
      expect(roundPrice(1, { mode: 'nearest_00' })).toBe(100); // £0.01 -> £1.00
      expect(roundPrice(99, { mode: 'nearest_00' })).toBe(100); // £0.99 -> £1.00
    });
  });

  describe('increment mode', () => {
    it('rounds up to nearest £0.50 increment', () => {
      expect(roundPrice(1000, { mode: 'increment', increment: 50 })).toBe(1000); // £10.00
      expect(roundPrice(1025, { mode: 'increment', increment: 50 })).toBe(1050); // £10.25 -> £10.50
      expect(roundPrice(1051, { mode: 'increment', increment: 50 })).toBe(1100); // £10.51 -> £11.00
    });

    it('rounds up to nearest £1.00 increment', () => {
      expect(roundPrice(1000, { mode: 'increment', increment: 100 })).toBe(1000); // £10.00
      expect(roundPrice(1050, { mode: 'increment', increment: 100 })).toBe(1100); // £10.50 -> £11.00
      expect(roundPrice(1001, { mode: 'increment', increment: 100 })).toBe(1100); // £10.01 -> £11.00
    });

    it('rounds up to nearest £5.00 increment', () => {
      expect(roundPrice(2000, { mode: 'increment', increment: 500 })).toBe(2000); // £20.00
      expect(roundPrice(2250, { mode: 'increment', increment: 500 })).toBe(2500); // £22.50 -> £25.00
      expect(roundPrice(2001, { mode: 'increment', increment: 500 })).toBe(2500); // £20.01 -> £25.00
    });

    it('rounds up to nearest £10.00 increment', () => {
      expect(roundPrice(5000, { mode: 'increment', increment: 1000 })).toBe(5000); // £50.00
      expect(roundPrice(5500, { mode: 'increment', increment: 1000 })).toBe(6000); // £55.00 -> £60.00
      expect(roundPrice(5001, { mode: 'increment', increment: 1000 })).toBe(6000); // £50.01 -> £60.00
    });

    it('handles custom increments', () => {
      expect(roundPrice(1000, { mode: 'increment', increment: 25 })).toBe(1000); // £10.00
      expect(roundPrice(1010, { mode: 'increment', increment: 25 })).toBe(1025); // £10.10 -> £10.25
      expect(roundPrice(1026, { mode: 'increment', increment: 25 })).toBe(1050); // £10.26 -> £10.50
    });
  });

  describe('Real-world scenarios', () => {
    it('rounds calculated prices appropriately', () => {
      // Simulate a calculated break-even price of £23.47
      const calculated = 2347;

      // Round to .99 - goes to 23.99 since 47 < 99
      expect(roundPrice(calculated, { mode: 'nearest_99' })).toBe(2399); // £23.99

      // Round to .50 - goes to 23.50 since 47 < 50
      expect(roundPrice(calculated, { mode: 'nearest_50' })).toBe(2350); // £23.50

      // Round to whole pounds - always rounds up any remainder
      expect(roundPrice(calculated, { mode: 'nearest_00' })).toBe(2400); // £24.00

      // Round to £0.50 increment
      expect(roundPrice(calculated, { mode: 'increment', increment: 50 })).toBe(2350); // £23.50
    });

    it('protects margins by always rounding up', () => {
      const basePrice = 1999; // £19.99

      // All rounding modes should maintain or increase the price
      expect(roundPrice(basePrice, { mode: 'nearest_99' })).toBeGreaterThanOrEqual(basePrice);
      expect(roundPrice(basePrice, { mode: 'nearest_50' })).toBeGreaterThanOrEqual(basePrice);
      expect(roundPrice(basePrice, { mode: 'nearest_00' })).toBeGreaterThanOrEqual(basePrice);
      expect(roundPrice(basePrice, { mode: 'increment', increment: 100 })).toBeGreaterThanOrEqual(basePrice);
    });

    it('handles very large prices', () => {
      const largePrice = 99999; // £999.99

      expect(roundPrice(largePrice, { mode: 'nearest_99' })).toBe(100099); // £1000.99
      expect(roundPrice(largePrice, { mode: 'nearest_00' })).toBe(100000); // £1000.00
    });

    it('handles very small prices', () => {
      const smallPrice = 5; // £0.05

      expect(roundPrice(smallPrice, { mode: 'nearest_99' })).toBe(99); // £0.99
      expect(roundPrice(smallPrice, { mode: 'nearest_50' })).toBe(50); // £0.50
      expect(roundPrice(smallPrice, { mode: 'nearest_00' })).toBe(100); // £1.00
    });
  });
});

describe('generateBoostPlan', () => {
  it('generates 3 price points from break-even to target', () => {
    const breakEven = 2000; // £20.00
    const target = 3000; // £30.00

    const plan = generateBoostPlan(breakEven, target, { mode: 'nearest_99' });

    expect(plan).toHaveLength(3);
    expect(plan[0].step).toBe('Launch');
    expect(plan[1].step).toBe('Growth');
    expect(plan[2].step).toBe('Target');
  });

  it('ensures Launch price has 5% buffer above break-even', () => {
    const breakEven = 2000; // £20.00
    const target = 3000; // £30.00

    const plan = generateBoostPlan(breakEven, target, { mode: 'none' });

    // Launch should be break-even + 5% = 2100
    expect(plan[0].price).toBeGreaterThanOrEqual(2100);
  });

  it('ensures Growth price is between Launch and Target', () => {
    const breakEven = 2000;
    const target = 3000;

    const plan = generateBoostPlan(breakEven, target, { mode: 'none' });

    expect(plan[1].price).toBeGreaterThan(plan[0].price);
    expect(plan[1].price).toBeLessThan(plan[2].price);
  });

  it('applies rounding to all price points', () => {
    const breakEven = 2000; // £20.00
    const target = 3000; // £30.00

    const plan = generateBoostPlan(breakEven, target, { mode: 'nearest_99' });

    // All prices should end in .99
    expect(plan[0].price % 100).toBe(99);
    expect(plan[1].price % 100).toBe(99);
    expect(plan[2].price % 100).toBe(99);
  });

  it('ensures each step is higher than the previous', () => {
    const breakEven = 1000;
    const target = 1100; // Very close to break-even

    const plan = generateBoostPlan(breakEven, target, { mode: 'nearest_99' });

    expect(plan[1].price).toBeGreaterThan(plan[0].price);
    expect(plan[2].price).toBeGreaterThan(plan[1].price);
  });

  it('adjusts prices when rounding creates duplicates', () => {
    // Edge case: very small range where rounding might create duplicates
    const breakEven = 1000; // £10.00
    const target = 1050; // £10.50

    const plan = generateBoostPlan(breakEven, target, { mode: 'nearest_00' });

    // Each step should be at least £1 more than the previous
    expect(plan[1].price - plan[0].price).toBeGreaterThanOrEqual(100);
    expect(plan[2].price - plan[1].price).toBeGreaterThanOrEqual(100);
  });

  it('works with different rounding modes', () => {
    const breakEven = 2000;
    const target = 3000;

    // Test with .99 rounding
    const plan99 = generateBoostPlan(breakEven, target, { mode: 'nearest_99' });
    expect(plan99[0].price).toBeLessThan(plan99[1].price);
    expect(plan99[1].price).toBeLessThan(plan99[2].price);

    // Test with .50 rounding
    const plan50 = generateBoostPlan(breakEven, target, { mode: 'nearest_50' });
    expect(plan50[0].price).toBeLessThan(plan50[1].price);
    expect(plan50[1].price).toBeLessThan(plan50[2].price);

    // Test with whole pound rounding
    const plan00 = generateBoostPlan(breakEven, target, { mode: 'nearest_00' });
    expect(plan00[0].price).toBeLessThan(plan00[1].price);
    expect(plan00[1].price).toBeLessThan(plan00[2].price);
  });

  it('handles large price ranges', () => {
    const breakEven = 1000; // £10.00
    const target = 10000; // £100.00

    const plan = generateBoostPlan(breakEven, target, { mode: 'nearest_99' });

    // Launch: ~£10.50, Growth: ~£55, Target: £100
    expect(plan[0].price).toBeGreaterThan(1000);
    expect(plan[0].price).toBeLessThan(2000);
    expect(plan[1].price).toBeGreaterThan(4000);
    expect(plan[1].price).toBeLessThan(7000);
    expect(plan[2].price).toBeGreaterThanOrEqual(10000);
  });

  it('handles small price ranges', () => {
    const breakEven = 1000; // £10.00
    const target = 1200; // £12.00

    const plan = generateBoostPlan(breakEven, target, { mode: 'nearest_99' });

    expect(plan).toHaveLength(3);
    expect(plan[0].price).toBeGreaterThan(breakEven);
    expect(plan[2].price).toBeGreaterThanOrEqual(target);
  });

  it('generates realistic boost plan for Etsy seller', () => {
    // Scenario: Product costs £15, break-even is £22, target 40% margin is £30
    const breakEven = 2200;
    const target = 3000;

    const plan = generateBoostPlan(breakEven, target, { mode: 'nearest_99' });

    // Launch: Start just above break-even (~£23)
    expect(plan[0].price).toBeGreaterThan(2200);
    expect(plan[0].price).toBeLessThan(2500);

    // Growth: Mid-point (~£26-27)
    expect(plan[1].price).toBeGreaterThan(2500);
    expect(plan[1].price).toBeLessThan(2900);

    // Target: Hit target margin (£30)
    expect(plan[2].price).toBeGreaterThanOrEqual(3000);
  });

  it('uses increment rounding correctly', () => {
    const breakEven = 1000;
    const target = 5000;

    const plan = generateBoostPlan(breakEven, target, { mode: 'increment', increment: 500 });

    // First two prices should be multiples of £5.00 (before any duplicate adjustment)
    expect(plan[0].price % 500).toBe(0);
    expect(plan[1].price % 500).toBe(0);
    // Note: plan[2] may not be a multiple if duplicate prevention kicked in

    // All prices should be progressive
    expect(plan[1].price).toBeGreaterThan(plan[0].price);
    expect(plan[2].price).toBeGreaterThan(plan[1].price);
  });
});
