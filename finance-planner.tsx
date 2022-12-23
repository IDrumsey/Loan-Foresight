

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
        let dateInstance = new Date(prevDate)

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


export const calcInterestRange = (interestPaidMax: number, interestPaidDataPoints: number[], dates: Date[], totalLoanAmountsWithoutInterest: number[] = null, relative = false) => {
    /**
     * Calculates the date range in which the loan fits the provided filters
     */

    if(relative) {
        // make sure it's in between 0 and 1

        // I'm an idiot - https://stackoverflow.com/a/6454237/17712310
        if(!(interestPaidMax >= 0 && interestPaidMax <= 1)){
            throw Error('interest max needs to be between 0 and 1 if using relative')
        }

        // check that totalLoanAmountWithoutInterest is defined
        if(!totalLoanAmountsWithoutInterest){
            throw Error('totalLoanAmountWithoutInterest needs to be defined')
        }
    }


    let validRanges = []

    let currStart = null
    for(let i = 0; i < dates.length; i++) {
        // check if valid or invalid interest
        let validInterestPaid = interestPaidDataPoints[i] < (relative ? totalLoanAmountsWithoutInterest[i] * interestPaidMax : interestPaidMax)


        // if valid -> check if currStart is set, if not -> set : otherwise continue to next data point
        if(validInterestPaid){
            if(!currStart){
                currStart = dates[i]

                // if currstart is not valid and at end
                if(i == dates.length - 1) {
                    validRanges.push([dates[i], dates[i]])
                }
            }
            else {
                if(i == dates.length - 1) {
                    validRanges.push([currStart, dates[i]])
                }
                continue
            }
        }

        // if not valid -> if currStart set end the range otherwise continue
        else {
            if(currStart){
                // end the range
                validRanges.push([currStart, dates[i]])
                currStart = null
            }

            else continue
        }
    }


    // if all data points are valid -> catch this by checking end value validity

    return validRanges
}



const highlightMatchBgColor = 'rgba(11, 186, 119, 0.25)'

export const generateCriteriaMatchBackgroundConfigs = (matchingDateRanges: [Date, Date][], xAxisData: Date[]) => {
    /**
     * Generate the configs for the plugin annotations to create the background rectangles that show the client the time ranges that match their criteria
     * 
     * 
     * as per - https://www.chartjs.org/chartjs-plugin-annotation/latest/guide/types/box.html
     * 
     * returns {
     *  criteriaBgHighlight1: {
     *      type: 'box',
     *      xMin: #,
     *      xMax: #
     *  },
     * 
     *  ...
     * }
     */

    // for each matching range - find the start index and end index in the xAxisData and create the box config from that

    const bgHighlightConfigs = []

    matchingDateRanges.forEach(validRange => {
        const validRangeXAxisStartIndex = xAxisData.findIndex(date => date == validRange[0])
        if(validRangeXAxisStartIndex == -1) throw Error('Could not find start date on x axis')
        const validRangeXAxisEndIndex = xAxisData.findIndex(date => date == validRange[1])
        if(validRangeXAxisEndIndex == -1) throw Error('Could not find end date on x axis')

        // https://stackoverflow.com/a/47108487/17712310
        // possible cite - https://stackoverflow.com/questions/36685745/acceptable-range-highlighting-of-background-in-chart-js-2-0
        // https://www.chartjs.org/chartjs-plugin-annotation/latest/guide/types/box.html
        bgHighlightConfigs.push({
            type: 'box',
            xMin: validRangeXAxisStartIndex,
            xMax: validRangeXAxisEndIndex,
            backgroundColor: highlightMatchBgColor,
            borderWidth: 0
        })
    })

    return bgHighlightConfigs

}


// https://bobbyhadz.com/blog/typescript-type-number-cannot-be-used-as-index-type
export const generateRangeHighlightData = (xAxisDataPoints: any[], validRanges: number[][], chartYMax: Number) => {
    /**
     * Build the background element on the graph to indicate valid range based on provided filters - see calcInterestRange
     */

    // https://www.youtube.com/watch?v=uCda6nOuhxo

    let data = validRanges.map(validRange => {
        let datapoints = []
        for(let i = validRange[0]; i < validRange[1]; i++){
            datapoints.push({x: xAxisDataPoints[i], y: chartYMax})
        }
        return datapoints
    })

    data = data.flat()

    return {
        data: data,
        borderColor: '#5476ff',
        // https://codesandbox.io/s/github/reactchartjs/react-chartjs-2/tree/master/sandboxes/line/area?from-embed=&file=/App.tsx
        fill: true,
        // https://www.digitalocean.com/community/tutorials/css-hex-code-colors-alpha-values
        backgroundColor: '#5476ff96',
        borderWidth: 0,
        radius: 0,
        // https://stackoverflow.com/a/65454681
        order: 1
    }
}



export const calcAvgSavedPerTimeFrame = (interestsPaid: number[]) => {
    /**
     * Calculate the average amount of interest paid
     */
    // calc differences
    let diffs = []
    for(let i = 1; i < interestsPaid.length; i++) {
        diffs.push(interestsPaid[i] - interestsPaid[i-1])
    }
    // https://stackoverflow.com/a/41452260
    let avgDiff = diffs.reduce((prevDiff, currDiff) => prevDiff - currDiff) / diffs.length


    avgDiff = Math.abs(avgDiff)

    avgDiff = Math.round(avgDiff)

    return avgDiff
}
