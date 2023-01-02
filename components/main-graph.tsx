import { Line } from 'react-chartjs-2'

import { useState, useEffect } from 'react'

import { calcInterestRange, generateCriteriaMatchBackgroundConfigs } from '../finance-planner'
import { ForesightDataPoint } from '../data/foresight-graph-manager'

import useForesightState from '../data/foresight-graph-manager'
import ChartJSPluginAnnotations from 'chartjs-plugin-annotation'

// https://codesandbox.io/s/github/reactchartjs/react-chartjs-2/tree/master/sandboxes/line/default?from-embed=&file=/App.tsx

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

ChartJS.register(CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  // possible cite for registering something ... can't remember what - https://react-chartjs-2.js.org/faq/registered-scale
  // another possible cite for registering stuff and showing faker package (might use in future) - https://codesandbox.io/s/github/reactchartjs/react-chartjs-2/tree/master/sandboxes/bar/vertical?from-embed=&file=/App.tsx
  // https://stackoverflow.com/a/67727684/17712310
  ChartJSPluginAnnotations
)





interface Props {}

const ForesightGraph = ({}: Props) => {

    const state = useForesightState()



    const [graphData, graphDataSetter] = useState<any>()

    const [rangeCriteriaMatchBoxAnnotations, rangeCriteriaMatchBoxAnnotationsSetter] = useState([])






    // -------------------------- functionality --------------------------



    const generateIncomeDataset = () => {
  
      return {
        label: 'Income',

        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
        data: state.incomeForecastDatapoints.map(datapoint => datapoint.data),

        borderColor: state.config.graph.colors.incomeLine,

        // https://codesandbox.io/s/github/reactchartjs/react-chartjs-2/tree/master/sandboxes/line/area?from-embed=&file=/App.tsx
        fill: true,

        // https://www.digitalocean.com/community/tutorials/css-hex-code-colors-alpha-values
        backgroundColor: state.config.graph.colors.incomeLine + '14'
      }
    }



    const generateExpensesDataset = () => {
  
      return {
        label: 'Expenses',
        data: state.expenseForecastDatapoints.map(datapoint => datapoint.data),
        borderColor: state.config.graph.colors.expenseLine,
        // https://codesandbox.io/s/github/reactchartjs/react-chartjs-2/tree/master/sandboxes/line/area?from-embed=&file=/App.tsx
        fill: true,
        // https://www.digitalocean.com/community/tutorials/css-hex-code-colors-alpha-values
        backgroundColor: state.config.graph.colors.expenseLine + '14'
      }
    }



    const generateNetDataset = () => {
      const netDatapoints = state.incomeForecastDatapoints.map((incomeDatapoint, i) => new ForesightDataPoint<number>(incomeDatapoint.date, incomeDatapoint.data - state.expenseForecastDatapoints[i].data))

      return {
        label: 'Net worth',
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
        data: netDatapoints.map(netDatapoint => netDatapoint.data),
        borderColor: '#eb8c34',
        // https://codesandbox.io/s/github/reactchartjs/react-chartjs-2/tree/master/sandboxes/line/area?from-embed=&file=/App.tsx
        fill: true,
        // https://www.digitalocean.com/community/tutorials/css-hex-code-colors-alpha-values
        backgroundColor: '#eb8c3414'
      }
    }


    const generateLoanTotalDataset = () => {

      return {
        label: 'Total Loan Cost',
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
        data: state.loanForecastDatapoints.map(loanDatapoint => loanDatapoint.data.total > 0 ? loanDatapoint.data.total : 0),
        borderColor: state.config.graph.colors.totalLoanCostLine,
        // https://codesandbox.io/s/github/reactchartjs/react-chartjs-2/tree/master/sandboxes/line/area?from-embed=&file=/App.tsx
        fill: true,
        // https://www.digitalocean.com/community/tutorials/css-hex-code-colors-alpha-values
        backgroundColor: state.config.graph.colors.totalLoanCostLine + '14'
      }
    }



    const generateTotalInterestPaidDataset = () => {
      return {
        label: 'Interest Paid',
        data: state.loanForecastDatapoints.map(datapoint => datapoint.data.interest < 0 ? 0 : datapoint.data.interest),
        borderColor: '#e0db34',
        // https://codesandbox.io/s/github/reactchartjs/react-chartjs-2/tree/master/sandboxes/line/area?from-embed=&file=/App.tsx
        fill: true,
        // https://www.digitalocean.com/community/tutorials/css-hex-code-colors-alpha-values
        backgroundColor: '#e0db3414'
      }
    }







    const generateInterestPaidPerYearDataset = () => {
      // calculate avg interest paid per year

      return {
        label: 'Interest Paid Per Year',
        data: state.loanForecastDatapoints.map(datapoint => datapoint.data.interest / state.config.loan.period),
        borderColor: '#ebf0b9',
        // https://codesandbox.io/s/github/reactchartjs/react-chartjs-2/tree/master/sandboxes/line/area?from-embed=&file=/App.tsx
        fill: true,
        // https://www.digitalocean.com/community/tutorials/css-hex-code-colors-alpha-values
        backgroundColor: '#ebf0b914'
      }
    }




    const genDatasets = () => {
      let datasets = []

      // XOR - https://stackoverflow.com/a/4540443
      let ignoreCombine = (!state.config.graph.showIncomeLine != !state.config.graph.showExpensesLine) || (!state.config.graph.showIncomeLine && !state.config.graph.showExpensesLine)

      if(state.config.graph.showIncomeLine && (ignoreCombine || !state.config.graph.combineIncomeAndExpenses)) {
        datasets.push(generateIncomeDataset())
      }

      if(state.config.graph.showExpensesLine && (ignoreCombine || !state.config.graph.combineIncomeAndExpenses)) {
        datasets.push(generateExpensesDataset())
      }

      if(state.config.graph.combineIncomeAndExpenses && !ignoreCombine) {
        datasets = [generateNetDataset()]
      }


      datasets.push(generateLoanTotalDataset())


      // interest paid dataset
      if(state.config.graph.showInterestPaidPerInterval) {
        datasets.push(generateInterestPaidPerYearDataset())
      }


      const data = {
        // https://stackoverflow.com/a/1643468/17712310
        // https://stackoverflow.com/a/18648314/17712310
        // https://www.freecodecamp.org/news/how-to-format-dates-in-javascript/#:~:text=You%20can%20also%20decide%20not%20to%20use%20either
        labels: state.datapointDates.map(date => date.toLocaleDateString()),
        datasets: datasets
      }

      return data
    }




    const generateValidRanges = () => {
      // // calc acceptable interest paid date range

      if(state.datapointDates.length == 0) {
        return []
      }
      
      let acceptableInterestRanges = calcInterestRange(
        state.config.loan.useRelativeDownPayment ? state.filters.relativeMaxTotalInterestPaid : state.filters.absoluteMaxTotalInterestPaid,
        state.loanForecastDatapoints.map(datapoint => datapoint.data.interest),
        state.datapointDates,
        state.loanForecastDatapoints.map(datapoint => datapoint.data.total - datapoint.data.interest),
        state.filters.useRelativeMaxTotalInterestPaid
      )

      // console.log(`valid ranges : ${acceptableInterestRanges}`)

      // criteria match background highlight
      return generateCriteriaMatchBackgroundConfigs(acceptableInterestRanges, state.datapointDates)


      // console.log('generating valid ranges')

      // console.log(state)
    }




    const updateGraph = () => {
      console.log('updating main graph...')
      const datasetsToShow = genDatasets()
      graphDataSetter(datasetsToShow)

      // const filteredRanges = generateValidRanges()
      // rangeCriteriaMatchBoxAnnotationsSetter(filteredRanges)
    }




    // initially build the graph
    useEffect(() => {
      updateGraph()
    }, [])



    useEffect(() => {
      updateGraph()
    }, [
      state.incomeForecastDatapoints,
      state.expenseForecastDatapoints,
      state.loanForecastDatapoints,
      state.config.graph.showIncomeLine,
      state.config.graph.showExpensesLine,
      state.config.graph.combineIncomeAndExpenses,
      state.config.graph.intervalLength,
      state.config.graph.numMonthsInFutureToProject,
      state.config.graph.showInterestPaidPerInterval,
      state.config.graph.colors.incomeLine,
      state.config.graph.colors.expenseLine,
      state.config.graph.colors.totalLoanCostLine,
    ])




    return (
        <>
        {
          graphData &&

          <Line 
          data={graphData} 
          options={{
            responsive: true,
            plugins: {
              legend: {
                // https://stackoverflow.com/a/38212833/17712310
                display: false,
                position: 'top'
              },
              title: {
                display: false
              },
          
              // https://stackoverflow.com/a/47108487/17712310
              // possible cite - https://stackoverflow.com/questions/36685745/acceptable-range-highlighting-of-background-in-chart-js-2-0
              // https://www.chartjs.org/chartjs-plugin-annotation/latest/guide/types/box.html
              annotation: {
                annotations: rangeCriteriaMatchBoxAnnotations
              }
            },
            // https://github.com/reactchartjs/react-chartjs-2/issues/61#issuecomment-633633803
            maintainAspectRatio: false,
            layout: {
              padding: 0
            },
            elements: {
              point: {
                pointStyle: 'circle',
                radius: 3,
                backgroundColor: "#fff",
                borderColor: "#fff"
              },
          
              line: {
                tension: 0,
                borderWidth: 3
              }
            },
          
            scales: {
              x: {
                  ticks: {
                  padding: 10
                }
              },
              y: {
                ticks: {
                  padding: 10
                },
                // maybe cite - https://stackoverflow.com/questions/41216308/chartjs-how-to-set-fixed-y-axis-max-and-min
                // maybe cite - https://stackoverflow.com/questions/28990708/how-to-set-max-and-min-value-for-y-axis
                // max: 500000
            }
            }
          }}
        />
        }
        </>
    )
}

export default ForesightGraph
