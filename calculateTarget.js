function calculateTotalTarget(startDate, endDate, totalAnnualTarget, excludeDays = []) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const monthsData = {};

    // Function to check if a date is excluded
    const isExcluded = (date) => {
        const day = date.getDay(); // 0 (Sun) to 6 (Sat)
        return excludeDays.includes(day);
    };

    // Initialize monthsData for each month in the date range
    let current = new Date(start);
    while (current <= end) {
        const monthKey = `${current.getFullYear()}-${current.getMonth() + 1}`;
        if (!monthsData[monthKey]) {
            monthsData[monthKey] = { totalDays: 0, workedDays: 0 };
        }
        if (!isExcluded(current)) {
            monthsData[monthKey].totalDays++;
            if (current >= start && current <= end) {
                monthsData[monthKey].workedDays++;
            }
        }
        current.setDate(current.getDate() + 1);
    }

    // Preparing the output data
    const daysExcludingFridays = [];
    const daysWorkedExcludingFridays = [];
    const monthlyTargets = [];
    let totalWorkedDays = 0;

    for (const month in monthsData) {
        const { totalDays, workedDays } = monthsData[month];
        daysExcludingFridays.push(totalDays);
        daysWorkedExcludingFridays.push(workedDays);
        totalWorkedDays += workedDays;

        const monthlyTarget = (workedDays / totalWorkedDays) * totalAnnualTarget;
        monthlyTargets.push(monthlyTarget);
    }

    const totalTarget = monthlyTargets.reduce((acc, target) => acc + target, 0);

    return {
        daysExcludingFridays,
        daysWorkedExcludingFridays,
        monthlyTargets,
        totalTarget
    };
}

// Example usage
const result = calculateTotalTarget('2024-01-01', '2024-03-31', 5220, [5]); // Excluding Fridays (5)
console.log(result);
