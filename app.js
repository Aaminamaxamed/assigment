import moment from 'moment';
import 'moment-business-days';

function calculateTotalTarget(startDate, endDate, totalAnnualTarget) {
    const start = moment(startDate);
    const end = moment(endDate);

    // Set Friday as a non-business day
    updateLocale('us', {
        workingWeekdays: [1, 2, 3, 4, 6, 7] // Monday to Thursday, Saturday, Sunday (0 for Sunday, 5 for Friday)
    });

    const totalMonths = [];
    const totalDaysExcludingFridays = [];
    const daysWorkedExcludingFridays = [];
    const monthlyTargets = [];

    let current = start.clone().startOf('month');
    while (current.isBefore(end) || current.isSame(end, 'month')) {
        // Define the range for the current month
        const monthStart = max(current, start);
        const monthEnd = min(current.clone().endOf('month'), end);

        // Calculate total working days excluding Fridays for the entire month
        const daysInMonthExcludingFridays = current.businessDiff(current.clone().endOf('month'));
        totalDaysExcludingFridays.push(daysInMonthExcludingFridays);

        // Calculate actual working days between the range (startDate - endDate) in the current month
        const daysWorkedInMonthExcludingFridays = monthStart.businessDiff(monthEnd.add(1, 'days'));
        daysWorkedExcludingFridays.push(daysWorkedInMonthExcludingFridays);

        totalMonths.push(current.format('MMMM YYYY'));

        current.add(1, 'month');
    }

    // Calculate total working days in the range
    const totalDaysWorked = daysWorkedExcludingFridays.reduce((acc, val) => acc + val, 0);

    // Proportionally distribute the annual target
    daysWorkedExcludingFridays.forEach((daysWorked) => {
        const proportion = daysWorked / totalDaysWorked;
        const monthlyTarget = proportion * totalAnnualTarget;
        monthlyTargets.push(monthlyTarget);
    });

    return {
        totalMonths,
        daysExcludingFridays: totalDaysExcludingFridays,
        daysWorkedExcludingFridays,
        monthlyTargets,
        totalTarget: totalAnnualTarget
    };
}

// Example usage:
const result = calculateTotalTarget('2024-01-10', '2024-05-15', 120000);
console.log(result);