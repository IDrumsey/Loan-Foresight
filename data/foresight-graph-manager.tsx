import {calcProjectedNets, generateDates} from '../finance-planner'
import { getBreakdown } from '../mortgage'


// using zustand - https://youtu.be/MpdFj8MEuJA?t=1038
// using zustand with ts - https://github.com/pmndrs/zustand#typescript-usage
// https://github.com/pmndrs/zustand/blob/main/docs/guides/typescript.md#basic-usage
// possible cite for using zustand - https://youtu.be/sqTPGMipjHk
// and another possible cite for using zustand and debugging with redux devtools - https://youtu.be/jLcF0Az1nx8

import create from 'zustand'
// import { devtools } from 'zustand/middleware'




// https://stackoverflow.com/a/37978675/17712310
export type incomeTypeType = 'salary' | 'hourly'
export type graphIntervalLength = 'month' | 'year'
export type expenseIntervalLength = 'month'
export type loanPeriodType = 10 | 15 | 30





export class ForesightDataPoint<T> {
    date: Date
    data: T


    
    constructor(
        date: Date,
        data: T
    ) {
        this.date = date
        this.data = data
    }

}


interface IForesightLoanConfig {
    period: loanPeriodType
    
    useRelativeDownPayment: boolean
    absoluteDownPayment: number
    relativeDownPayment: number

    interestRate: number
    loanAmount: number
}



interface IUserIncomeConfig {
    salary: number
    netWorth: number
    incomeType: incomeTypeType
    expectedSalaryChangePerYear: number
}




interface IUserExpensesConfig {
    expensesPerPeriod: number
    intervalLength: expenseIntervalLength,
    breakdownExpensesByType: boolean
}




interface IForesightGraphColorsConfig {
    incomeLine: string,
    expenseLine: string,
    totalLoanCostLine: string
}



interface IForesightGraphConfig {
    showIncomeLine: boolean
    showExpensesLine: boolean
    combineIncomeAndExpenses: boolean
    intervalLength: graphIntervalLength
    numMonthsInFutureToProject: number
    showInterestPaidPerInterval: boolean,
    colors: IForesightGraphColorsConfig
}



interface IForesightConfiguration {
    income: IUserIncomeConfig
    expenses: IUserExpensesConfig

    loan: IForesightLoanConfig
    graph: IForesightGraphConfig
}



interface IForesightConstraints {
    name: string
    useRelativeMaxTotalInterestPaid: boolean
    relativeMaxTotalInterestPaid: number
    absoluteMaxTotalInterestPaid: number
}

export interface IForesightState {

    datapointDates: Date[]

    incomeForecastDatapoints: ForesightDataPoint<number>[]
    expenseForecastDatapoints: ForesightDataPoint<number>[]
    loanForecastDatapoints: ForesightDataPoint<{total: number, interest: number}>[]

    config: IForesightConfiguration

    filters: IForesightConstraints

    genDates: (intervalType: graphIntervalLength, maxNumDates: number) => Date[]
    genIncomeDatapoints: (dates: Date[]) => number[]
    genExpenseDatapoints: (dates: Date[]) => number[]


    updateDates: () => void
    updateIncomeDatapoints: () => void
    updateExpenseDatapoints: () => void
    updateLoanDatapoints: () => void



    updateSalary: (newSalary: number) => void
    updateNetWorth: (newSalary: number) => void
    updateExpectedSalaryChangePerYear: (newSalary: number) => void
    updateIncomeType: (newIncomeType: incomeTypeType) => void

    updateShowIncomeLine: (showIncomeLine: boolean) => void
    updateShowExpensesLine: (showExpensesLine: boolean) => void
    updateCombineIncomeAndExpenses: (combineIncomeAndExpensesLine: boolean) => void
    updateIntervalLength: (newIntervalLength: graphIntervalLength) => void
    updateNumMonthsInFutureToProject: (monthsToProjectInFuture: number) => void
    updateShowInterestPaidPerInterval: (showInterestPaidPerInterval: boolean) => void

    updatePeriod: (newPeriod: loanPeriodType) => void
    updateUseRelativeDownPayment: (useRelativeDownPayment: boolean) => void
    updateAbsoluteDownPayment: (newAbsoluteDownPayment: number) => void
    updateRelativeDownPayment: (newRelativeDownPayment: number) => void
    updateInterestRate: (newInterestRate: number) => void
    updateLoanAmount: (newLoanAmount: number) => void

    

    updateUseRelativeMaxTotalInterestPaid: (useRelativeMaxTotalInterestPaid: boolean) => void
    updateRelativeMaxTotalInterestPaid: (newAbsMaxInterestPaid: number) => void
    updateAbsoluteMaxTotalInterestPaid: (newRelativeMaxInterestPaid: number) => void


    updateBreakdownExpensesByType: (breakdownExpensesByType: boolean) => void
    updateCondensedExpensesIntervalLength: (newIntervalLength: expenseIntervalLength) => void
    updateCondensedExpensesPerPeriod: (newExpensesPerPeriod: number) => void

    updateIncomeLineColor: (newIncomeLineColor: string) => void
    updateExpenseLineColor: (newExpenseLineColor: string) => void
    updateTotalLoanCostLineColor: (newTotalLoanCostLineColor: string) => void
}



const useForesightState = create<IForesightState>()((set) => ({

    datapointDates: [],
    
    incomeForecastDatapoints: [],

    expenseForecastDatapoints: [],

    loanForecastDatapoints: [],

    config: {
        income: {
            salary: 50000,
            netWorth: 0,
            incomeType: 'salary',
            expectedSalaryChangePerYear: 0
        },
        
        expenses: {
            intervalLength: 'month',
            // https://www.google.com/search?q=how+much+expenses+does+the+typical+person+have+percentage+wise&rlz=1C1ONGR_enUS977US977&oq=how+much+expenses+does+the+typical+person+have+percentage+wise&aqs=chrome..69i57j33i160.18844j1j7&sourceid=chrome&ie=UTF-8#:~:text=73%25%20of%20the%20average%20monthly%20income
            expensesPerPeriod: 250,
            breakdownExpensesByType: false
        },

        loan: {
            loanAmount: 150000,
            period: 15,
            interestRate: 7,

            useRelativeDownPayment: true,
            absoluteDownPayment: 0,
            relativeDownPayment: .8
        },

        graph: {
            intervalLength: 'month',
            numMonthsInFutureToProject: 12,
            showIncomeLine: true,
            showExpensesLine: true,
            combineIncomeAndExpenses: false,
            showInterestPaidPerInterval: false,
            colors: {
                incomeLine: '#32a86f',
                expenseLine: '#cf3a64',
                totalLoanCostLine: '#2f51ad'
            }
        }
    },

    filters: {
        name: 'default',
        useRelativeMaxTotalInterestPaid: false,
        absoluteMaxTotalInterestPaid: 0,
        relativeMaxTotalInterestPaid: 0
    },




    // functionality

    genDates(intervalType: graphIntervalLength, maxNumDates: number) {
        // https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html#param-and-returns

        /**
         * Generate a list of dates based on the interval
         * @param {graphIntervalLength} intervalType - Whether to generate the dates with intervals of months or years
         * @param {number} maxNumDates - The maximum amount of dates to generate
         */

        return generateDates(intervalType, maxNumDates)
    },


    genIncomeDatapoints(dates: Date[]) {
        /**
         * Generates the income data based on the dates array
         */

        let numMonthsToProject = this.config.graph.numMonthsInFutureToProject

        // if projecting in years -> convert to months
        if(this.config.graph.intervalLength == 'year') {
            numMonthsToProject *= 12
        }

        const expectedNets = calcProjectedNets(this.config.income.netWorth, this.config.income.salary, this.config.income.expectedSalaryChangePerYear / 100, numMonthsToProject, this.config.graph.intervalLength)

        return expectedNets.map(expectedNet => expectedNet.expected)
    },



    genExpenseDatapoints(dates: Date[]) {
        /**
         * Generates the expense data based on the dates array
         */


        let expenses = [0]
  
        for(let i = 0; i < this.config.graph.numMonthsInFutureToProject; i++) {
            expenses.push(this.config.expenses.expensesPerPeriod * (i + 1))
        }


        return expenses
    },




    // additional usage info for updating the state - https://github.com/pmndrs/zustand/blob/main/docs/guides/updating-state.md


    updateDates: () => set(state => {
        const dates = state.genDates(state.config.graph.intervalLength, state.config.graph.numMonthsInFutureToProject)


        return {
            ...state,
            datapointDates: dates
        }
    }),





    

    updateIncomeDatapoints: () => set(state => {
        const income = state.genIncomeDatapoints(state.datapointDates)

        const incomeDatapoints = state.datapointDates.map((date, i) => new ForesightDataPoint<number>(date, income[i]))

        return {
            ...state,
            incomeForecastDatapoints: incomeDatapoints
        }
    }),





    updateExpenseDatapoints: () => set(state => {
        const expense = state.genExpenseDatapoints(state.datapointDates)

        const expenseDatapoints = state.datapointDates.map((date, i) => new ForesightDataPoint<number>(date, expense[i]))

        return {
            ...state,
            expenseForecastDatapoints: expenseDatapoints
        }
    }),





    updateLoanDatapoints: () => set(state => {
        const loanData = state.datapointDates.map((date, i) => {
            const downpayment = state.config.loan.useRelativeDownPayment ? state.config.loan.relativeDownPayment * state.incomeForecastDatapoints[i].data : state.config.loan.absoluteDownPayment
            const loanAmountMinusDownpayment = state.config.loan.loanAmount - downpayment
            return getBreakdown(loanAmountMinusDownpayment, state.config.loan.interestRate / 100, state.config.loan.period)
        })

        const loanDatapoints = state.datapointDates.map((date, i) => new ForesightDataPoint<{total: number, interest: number}>(date, {total: loanData[i].total, interest: loanData[i].interestPaid}))

        return {
            ...state,
            loanForecastDatapoints: loanDatapoints
        }
    }),



    updateSalary: (newSalary: number) => {
        set(state => ({
            ...state,
            config: {
                ...state.config,
                income: {
                    ...state.config.income,
                    salary: newSalary
                }
            }
        }))
    },


    updateNetWorth: (newNetWorth: number) => {
        set(state => ({
            ...state,
            config: {
                ...state.config,
                income: {
                    ...state.config.income,
                    netWorth: newNetWorth
                }
            }
        }))
    },


    updateExpectedSalaryChangePerYear: (newExpectedSalaryChangePerYear: number) => {
        set(state => ({
            ...state,
            config: {
                ...state.config,
                income: {
                    ...state.config.income,
                    expectedSalaryChangePerYear: newExpectedSalaryChangePerYear
                }
            }
        }))
    },


    updateIncomeType: (newIncomeType: incomeTypeType) => {
        set(state => ({
            ...state,
            config: {
                ...state.config,
                income: {
                    ...state.config.income,
                    incomeType: newIncomeType
                }
            }
        }))
    },


    updateShowIncomeLine: (showIncomeLine: boolean) => {
        set(state => ({
            ...state,
            config: {
                ...state.config,
                graph: {
                    ...state.config.graph,
                    showIncomeLine: showIncomeLine
                }
            }
        }))
    },



    updateShowExpensesLine: (showExpensesLine: boolean) => {
        set(state => ({
            ...state,
            config: {
                ...state.config,
                graph: {
                    ...state.config.graph,
                    showExpensesLine: showExpensesLine
                }
            }
        }))
    },



    updateCombineIncomeAndExpenses: (combineIncomeAndExpensesLine: boolean) => {
        set(state => ({
            ...state,
            config: {
                ...state.config,
                graph: {
                    ...state.config.graph,
                    combineIncomeAndExpenses: combineIncomeAndExpensesLine
                }
            }
        }))
    },



    updateIntervalLength: (newIntervalLength: graphIntervalLength) => {
        set(state => ({
            ...state,
            config: {
                ...state.config,
                graph: {
                    ...state.config.graph,
                    intervalLength: newIntervalLength
                }
            }
        }))
    },



    updateNumMonthsInFutureToProject: (intervalsToProjectInFuture: number) => {
        set(state => ({
            ...state,
            config: {
                ...state.config,
                graph: {
                    ...state.config.graph,
                    numMonthsInFutureToProject: intervalsToProjectInFuture
                }
            }
        }))
    },



    updateShowInterestPaidPerInterval: (showInterestPaidPerInterval: boolean) => {
        set(state => ({
            ...state,
            config: {
                ...state.config,
                graph: {
                    ...state.config.graph,
                    showInterestPaidPerInterval: showInterestPaidPerInterval
                }
            }
        }))
    },




    updatePeriod: (newPeriod: loanPeriodType) => {
        set(state => ({
            ...state,
            config: {
                ...state.config,
                loan: {
                    ...state.config.loan,
                    period: newPeriod
                }
            }
        }))
    },
    



    updateUseRelativeDownPayment: (useRelativeDownPayment: boolean) => {
        set(state => ({
            ...state,
            config: {
                ...state.config,
                loan: {
                    ...state.config.loan,
                    useRelativeDownPayment: useRelativeDownPayment
                }
            }
        }))
    },




    updateAbsoluteDownPayment: (newAbsoluteDownPayment: number) => {
        set(state => ({
            ...state,
            config: {
                ...state.config,
                loan: {
                    ...state.config.loan,
                    absoluteDownPayment: newAbsoluteDownPayment
                }
            }
        }))
    },




    updateRelativeDownPayment: (newRelativeDownPayment: number) => {
        set(state => ({
            ...state,
            config: {
                ...state.config,
                loan: {
                    ...state.config.loan,
                    relativeDownPayment: newRelativeDownPayment
                }
            }
        }))
    },




    updateInterestRate: (newInterestRate: number) => {
        set(state => ({
            ...state,
            config: {
                ...state.config,
                loan: {
                    ...state.config.loan,
                    interestRate: newInterestRate
                }
            }
        }))
    },




    updateLoanAmount: (newLoanAmount: number) => {
        set(state => ({
            ...state,
            config: {
                ...state.config,
                loan: {
                    ...state.config.loan,
                    loanAmount: newLoanAmount
                }
            }
        }))
    },




    updateUseRelativeMaxTotalInterestPaid: (useRelativeMaxTotalInterestPaid: boolean) => {
        set(state => ({
            ...state,
            filters: {
                ...state.filters,
                useRelativeMaxTotalInterestPaid: useRelativeMaxTotalInterestPaid
            }
        }))
    },



    updateAbsoluteMaxTotalInterestPaid: (newAbsMaxInterestPaid: number) => {
        set(state => ({
            ...state,
            filters: {
                ...state.filters,
                absoluteMaxTotalInterestPaid: newAbsMaxInterestPaid
            }
        }))
    },





    updateRelativeMaxTotalInterestPaid: (newRelativeMaxInterestPaid: number) => {
        set(state => ({
            ...state,
            filters: {
                ...state.filters,
                relativeMaxTotalInterestPaid: newRelativeMaxInterestPaid
            }
        }))
    },





    updateBreakdownExpensesByType: (breakdownExpensesByType: boolean) => {
        set(state => ({
            ...state,
            config: {
                ...state.config,
                expenses: {
                    ...state.config.expenses,
                    breakdownExpensesByType: breakdownExpensesByType
                }
            }
        }))
    },




    updateCondensedExpensesIntervalLength: (newIntervalLength: expenseIntervalLength) => {
        set(state => ({
            ...state,
            config: {
                ...state.config,
                expenses: {
                    ...state.config.expenses,
                    intervalLength: newIntervalLength
                }
            }
        }))
    },




    updateCondensedExpensesPerPeriod: (newExpensesPerPeriod: number) => {
        set(state => ({
            ...state,
            config: {
                ...state.config,
                expenses: {
                    ...state.config.expenses,
                    expensesPerPeriod: newExpensesPerPeriod
                }
            }
        }))
    },



    
    updateIncomeLineColor: (newIncomeLineColor: string) => {
        set(state => ({
            ...state,
            config: {
                ...state.config,
                graph: {
                    ...state.config.graph,
                    colors: {
                        ...state.config.graph.colors,
                        incomeLine: newIncomeLineColor
                    }
                }
            }
        }))
    },


    updateExpenseLineColor: (newExpenseLineColor: string) => {
        set(state => ({
            ...state,
            config: {
                ...state.config,
                graph: {
                    ...state.config.graph,
                    colors: {
                        ...state.config.graph.colors,
                        expenseLine: newExpenseLineColor
                    }
                }
            }
        }))
    },





    updateTotalLoanCostLineColor: (newTotalLoanCostLineColor: string) => {
        set(state => ({
            ...state,
            config: {
                ...state.config,
                graph: {
                    ...state.config.graph,
                    colors: {
                        ...state.config.graph.colors,
                        totalLoanCostLine: newTotalLoanCostLineColor
                    }
                }
            }
        }))
    }
}))



export default useForesightState
