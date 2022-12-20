




export const calcMonthlyPayments = (loanAmount, interestRate, loanPayPeriod = 15) => {
    // https://www.youtube.com/watch?v=6bLg_Ex0A-4

    const numMonths = loanPayPeriod * 12
    const ratePerMonth = interestRate / 12

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/pow
    return (loanAmount * ratePerMonth * (Math.pow((1 + ratePerMonth), numMonths))) / ((Math.pow((1 + ratePerMonth), numMonths)) - 1)
}


export const calcTotalMortgage = (loanAmount, interestRate, loanPayPeriod = 15) => {

    const perMonth = calcMonthlyPayments(loanAmount, interestRate, loanPayPeriod)

    return perMonth * loanPayPeriod * 12
}

export const getBreakdown = (loanAmount, interestRate, loanPayPeriod = 15) => {
    const total = calcTotalMortgage(loanAmount, interestRate, loanPayPeriod)

    return {
        total: total,
        interestPaid: total - loanAmount,
        term: loanPayPeriod
    }
}

const principle = 300000
const rate = 0.05
const loanYears = 30


console.log(getBreakdown(principle, rate, loanYears))
