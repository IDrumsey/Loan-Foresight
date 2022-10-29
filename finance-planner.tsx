

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

    let currWorth = baseNet || 0
    let expectedSalary = annualSalary

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Loops_and_iteration
    for(let i = 1; i <= maxTimeIncrementNum; i++) {
        let nodeDate = new Date()

        // add time
        switch(granularity) {
            case 'years': {
                // https://codingbeautydev.com/blog/javascript-add-years-to-date/
                nodeDate.setFullYear(nodeDate.getFullYear() + i)
                break
            }
            case 'months': {
                nodeDate.setMonth(nodeDate.getMonth() + i)
                break
            }
        }
        
        currWorth = currWorth += granularity == 'years' ? expectedSalary : expectedSalary / 12

        expectedNetWorth.push({
            date: nodeDate,
            expected: currWorth
        })

        if(granularity == 'years' || (granularity == 'months' && i % 12 == 0)){
            let amountToIncreaseSalaryBy = expectedSalary * expectedAnnualSalaryIncrease
            expectedSalary += amountToIncreaseSalaryBy
        }
    }

    return expectedNetWorth
}