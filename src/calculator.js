import moment from 'moment';
import {
	RATE,
	DURATION,
	DIVISION_HOUR
} from './constant';

/**
 * calculate the parking prices of given booking time slots in bulk
 * @param  {Array} periods, a collection of booking time periods
 * @return {Array} prices, the collection of parking prices corresponding to periods
 */
export default function calculate(periods){
	const prices = periods.map(period => priceOfPeriod(period));
	return prices;
}

/**
 * calculate the parking price of a given parking period
 * @param  {Array} period, an array of start and end time in Moment objects
 * @return {Int} price
 */
function priceOfPeriod(period){
	const sameDay = isSameDay(period);
	if (sameDay){
		const priceByHour = priceByHourOf(period);
		const actualPrice = Math.min(priceByHour, RATE.DAY);
		return actualPrice;
	}
	const count = countDaysOf(period);
	const priceByDay = priceByDayOf(count);
	const priceByWeek = priceByWeekOf(count);
	const priceByWeekAndDay = priceByWeekAndDayOf(count);
	const priceByMonth = priceByMonthOf(count);
	const price = Math.min(priceByDay, priceByWeek, priceByWeekAndDay, priceByMonth);
	return price;
}

/**
 * check if the start and end of the period is the same day
 * @param  {Array}  period ,an array of start and end time in Moment objects
 * @return {Boolean}        the same day or not
 */
function isSameDay(period){
	const [start, end] = period;
	const sameDay = start.isSame(end, 'day');
	return sameDay;
}

/**
 * calculate how many days the period count per business logic when period spanning multiple days
 * @param  {Array} period ,an array of start and end time in Moment objects
 * @return {Int}        the counted days of the period
 */
export function countDaysOf(period){
	const [start, end] = period;
	const endHour = end.hour();
	const startDate = start.clone().startOf('date');
	const endDate = end.clone().startOf('date');
	const days = endDate.diff(startDate, 'days');
	const counts = endHour < DIVISION_HOUR ? days: days + 1;
	return counts;
}

/**
 * calculate the price of a period by hours
 * @param  {Array} period ,an array of start and end time in Moment objects
 * @return {Int}          price
 */
function priceByHourOf(period){
	const [start, end] = period;
	const duration = moment.duration(end.diff(start));
	const hours = duration.asHours();
	const units = Math.ceil(hours);
	const price = RATE.HOUR * units;
	return price;
}

/**
 * calculate the price of a period by days
 * @param  {Int} count , number of counted days
 * @return {Int} 		price
 */
function priceByDayOf(count){
	const price = RATE.DAY * count;
	return price;
}

/**
 * calculate the price by weeks
 * @param  {Int} count , number of counted days
 * @return {Int}          price
 */
function priceByWeekOf(count){
	const weeks = Math.ceil(count/DURATION.WEEK);
	const price = RATE.WEEK * weeks;
	return price;
}

/**
 * calculate the price by weeks and days
 * @param  {Int} count , number of counted days
 * @return {Int}          price
 */
function priceByWeekAndDayOf(count){
	const weeks = Math.floor(count/DURATION.WEEK);
	const days = count % DURATION.WEEK;
	const price = RATE.WEEK * weeks + RATE.DAY * days;
	return price;
}

/**
 * calculate the price by months
 * @param  {Int} count , number of counted days
 * @return {Int}          price
 */
function priceByMonthOf(count){
	const months = Math.ceil(count/DURATION.MONTH);
	const price = RATE.MONTH * months;
	return price;
}