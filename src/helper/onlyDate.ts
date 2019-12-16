import moment from 'moment';

/**
 *
 * Remove time in the Date instance.
 * 2019-12-16T13:39:05.956Z => 2019-12-16T00:00:00.000Z
 *
 * @param date Date to convert
 */
export const onlyDate = (date: Date) => {
    return moment(moment(date).format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
};
