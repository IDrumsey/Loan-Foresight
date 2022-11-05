

export const calcProjectedNets = (baseNet: number, annualSalary: number, expectedAnnualSalaryIncrease: number, numMonthsToProject = 12, granularity: 'months' | 'years') => {
    // https://stackoverflow.com/a/23072573/17712310
    // https://tsdoc.org/
    /**
     * @param granularity - Over what time period to split calculations
     * @param annualSalary - The expected annual salary
     * @param expectedAnnualSalaryIncrease - The expected annual salary increase
     * 
     * @returns - array of dates and the expected salary
     */

    let maxTimeIncrementNum = numMonthsToProject

    if(granularity == 'years'){
        maxTimeIncrementNum = numMonthsToProject / 12
    }


    let expectedNetWorth = []

    // push current data as a node
    expectedNetWorth.push({
        expected: baseNet
    })

    let currWorth = baseNet || 0
    let expectedSalary = annualSalary

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Loops_and_iteration
    for(let i = 1; i <= maxTimeIncrementNum; i++) {
        
        currWorth = currWorth += granularity == 'years' ? expectedSalary : expectedSalary / 12

        expectedNetWorth.push({
            expected: currWorth
        })

        if(granularity == 'years' || (granularity == 'months' && i % 12 == 0)){
            let amountToIncreaseSalaryBy = expectedSalary * expectedAnnualSalaryIncrease
            expectedSalary += amountToIncreaseSalaryBy
        }
    }

    return expectedNetWorth
}





export const generateDates = (xAxisGranularity: 'months' | 'years', xAxisMax: Number) => {
    let prevDate = new Date()

    let dates: Date[] = [prevDate]

    for(let i = 0; i < xAxisMax; i++) {
        let dateInstance = new Date()

        // add time
        switch(xAxisGranularity) {
            case 'years': {
                // https://codingbeautydev.com/blog/javascript-add-years-to-date/
                dateInstance.setFullYear(prevDate.getFullYear() + 1)
                break
            }
            case 'months': {
                dateInstance.setMonth(prevDate.getMonth() + 1)
                break
            }
        }

        dates.push(dateInstance)
        prevDate = dateInstance
    }

    return dates
}