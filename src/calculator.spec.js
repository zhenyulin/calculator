import moment from 'moment';
import calculate, {
	countDaysOf
} from './calculator';

describe('calculate', () => {

	describe('booking spanning multiple days', () => {
		it('use monthly rate where weekly rate and day rate is more expensive', () => {
			const periods = [
				[moment('2017-01-24 14:00'), moment('2017-02-18 15:00')]
			];
			const prices = calculate(periods);
			expect(prices[0]).toBe(70);
		});

		it('use weekly rate when it is cheaper than monthly rate or weekly and daily rate', () => {
			const periods = [
				[moment('2017-01-01 01:00'), moment('2017-02-04 03:00')]
			];
			const prices = calculate(periods);
			expect(prices[0]).toBe(100);
		});

		it('use weekly and daily rate when it is cheaper than monthly or weekly rate', () => {
			const periods = [
				[moment('2017-01-01 01:00'), moment('2017-01-23 03:00')]
			];
			const prices = calculate(periods);
			expect(prices[0]).toBe(65);
		});

		it('use weekly rate when the daily rate is more expensive', () => {
			const periods = [
				[moment('2017-01-21 02:00'), moment('2017-01-26 03:00')]
			];
			const prices = calculate(periods);
			expect(prices[0]).toBe(20);
		});

		it('use daily rate when weekly rate is more expensive', () => {
			const periods = [
				[moment('2017-01-21 02:00'), moment('2017-01-23 03:00')]
			];
			const prices = calculate(periods);
			expect(prices[0]).toBe(10);
		});

		it('includes final day if it ends after 5am', () => {
			const periods = [
				[moment('2017-01-24 14:00'), moment('2017-01-25 12:00')]
			];
			const prices = calculate(periods);
			expect(prices[0]).toBe(10);
		});

		it('excludes final day if it ends before 5am', () => {
			const periods = [
				[moment('2017-01-24 14:00'), moment('2017-01-25 03:00')]
			];
			const prices = calculate(periods);
			expect(prices[0]).toBe(5);
		});
	});

	describe('booking of same day', () => {
		it('same day booking: use daily rate when hourly rate is more expensive', () => {
			const periods = [
				[moment('2017-01-24 14:00'), moment('2017-01-24 18:00')]
			];
			const prices = calculate(periods);
			expect(prices[0]).toBe(5);
		});

		it('same day booking: use hourly rate when daily rate is more expensive', () => {
			const periods = [
				[moment('2017-01-24 14:00'), moment('2017-01-24 16:00')]
			];
			const prices = calculate(periods);
			expect(prices[0]).toBe(4);
		});
	});

	it('handles bulk calculation', () => {
		const periods = [
			[moment('2017-01-24 14:00'), moment('2017-01-24 16:00')],
			[moment('2017-01-01 01:00'), moment('2017-02-04 03:00')],
		];
		const prices = calculate(periods);
		expect(prices[0]).toBe(4);
		expect(prices[1]).toBe(100);
	});
});

describe('countDaysOf', () => {
	it('excludes final day if it ends before 5am', () => {
		const period = [moment('2017-01-24 14:00'), moment('2017-01-25 03:00')];
		const count = countDaysOf(period);
		expect(count).toBe(1);
	});

	it('includes final day if it ends after 5am', () => {
		const period = [moment('2017-01-24 14:00'), moment('2017-01-25 12:00')];
		const count = countDaysOf(period);
		expect(count).toBe(2);
	});
});