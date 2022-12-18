import Head from 'next/head'
import { useEffect, useState, useRef, useCallback } from 'react'
import styles from '../styles/Home.module.css'
import { Chart, Line } from 'react-chartjs-2'
import { SegmentedControl, NativeSelect, TextInput, Slider, Space, Text, Divider, Drawer, Button, Radio } from '@mantine/core'
import { GoSettings } from 'react-icons/go'
import {calcProjectedNets, generateDates, calcInterestRange, generateRangeHighlightData, calcAvgSavedPerTimeFrame} from '../finance-planner'
import IncomeForm from '../components/income-form'
import SalaryIncomeForm from '../components/income-type-forms/salary-income-form'
import HourlyIncomeForm from '../components/income-type-forms/hourly-income-form'
import GraphConfigDrawer from '../components/graph-configuration-drawer'
import ExpenseForm from '../components/expense-form'
import {getBreakdown} from '../mortgage'
import Link from 'next/link'

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
  Filler
)

const lineChartOptions = {
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
}



const salaryDefault = 48000
const minSalaryChange = -10
const maxSalaryChange = 100
const mainWrapperWidth = 450


export default function Home() {

  const [graphOptions, graphOptionsSetter] = useState(lineChartOptions)

  const graphOptionsRef = useRef(graphOptions)

  // keep graph options ref up to date
  useEffect(() => {
    graphOptionsRef.current = graphOptions
  }, [graphOptions])

  const [graphData, graphDataSetter] = useState()
  const [incomeType, setIncomeType] = useState('salary')
  const [expectedIncomeChange, setExpectedIncomeChange] = useState(3)
  const [graphConfigDrawerOpen, setGraphConfigDrawerOpen] = useState(false)
  const [numMonthsProjected, setNumMonthsProjected] = useState(24)
  const [numYearsProjected, setNumYearsProjected] = useState(1)
  const [graphIntervalTimeFrame, setGraphIntervalTimeFrame] = useState('months')
  const [salary, setSalary] = useState(salaryDefault.toString())
  const [currNetWorth, setCurrNetWorth] = useState(50000)
  const [formGranularity, formGranularitySetter] = useState('combined')
  const [condensedExpenseInputGranularity, condensedExpenseInputGranularitySetter] = useState('month')
  // https://www.google.com/search?q=how+much+expenses+does+the+typical+person+have+percentage+wise&rlz=1C1ONGR_enUS977US977&oq=how+much+expenses+does+the+typical+person+have+percentage+wise&aqs=chrome..69i57j33i160.18844j1j7&sourceid=chrome&ie=UTF-8#:~:text=73%25%20of%20the%20average%20monthly%20income
  const [expensesPerPeriod, expensesPerPeriodSetter] = useState(250)

  const [showIncomeGraph, showIncomeGraphSetter] = useState(true)
  const [showExpensesGraph, showExpensesGraphSetter] = useState(true)
  const [combineIncomeAndExpenses, combineIncomeAndExpensesSetter] = useState(true)
  const [loanAmount, loanAmountSetter] = useState(150000)
  const [maxInterestPaid, maxInterestPaidSetter] = useState(0)
  const [percentToPutDown, percentToPutDownSetter] = useState(0.8)
  const [interestRate, interestRateSetter] = useState(7)

  const [avgSavedPerTimeInterval, avgSavedPerTimeIntervalSetter] = useState(null)
  const [showInterestPaidPerYear, showInterestPaidPerYearSetter] = useState(false)

  // https://stackoverflow.com/a/59465373/17712310
  const [useRelativeMaxInterest, usingRelativeMaxInterestSetter] = useState(true)
  const [relativeMaxInterest, relativeMaxInterestSetter] = useState(0.8)


  useEffect(() => {
    console.log(`Graph options changed`)
    console.log(graphOptions.scales.y)
  }, [graphOptions])


  useEffect(() => {
    const interval = setInterval(() => {
      // console.log('asfd')

      let test = graphOptionsRef.current
      test.scales.y.ticks.max += 1000
      // graphOptions.scales.y.ticks.max += 1000
      graphOptionsSetter(test)
    }, .5)

    return () => {clearInterval(interval)}
  }, [])


  const [loanPeriod, loanPeriodSetter] = useState('15')

  const generateIncomeDataset = useCallback(() => {

    // https://dev.to/sanchithasr/7-ways-to-convert-a-string-to-number-in-javascript-4l
    const expectedNets = calcProjectedNets(parseInt(currNetWorth), parseInt(salary), expectedIncomeChange / 100, numMonthsProjected, graphIntervalTimeFrame)

    // console.log(expectedNets)

    return {
      label: 'Income',
      data: expectedNets.map(net => net.expected),
      borderColor: '#32a86f',
      // https://codesandbox.io/s/github/reactchartjs/react-chartjs-2/tree/master/sandboxes/line/area?from-embed=&file=/App.tsx
      fill: true,
      // https://www.digitalocean.com/community/tutorials/css-hex-code-colors-alpha-values
      backgroundColor: '#32a86f14'
    }
  }, [
    currNetWorth,
    expectedIncomeChange,
    graphIntervalTimeFrame,
    numMonthsProjected,
    salary
  ])



  // https://stackoverflow.com/a/70033156/17712310
  const generateExpensesDataset = useCallback(() => {

    let expenses = [0]
    const iCap = graphIntervalTimeFrame == "months" ? numMonthsProjected : numYearsProjected

    for(let i = 0; i < iCap; i++) {
      expenses.push((graphIntervalTimeFrame == "months" ? expensesPerPeriod : expensesPerPeriod * 12) * (i + 1))
    }

    return {
      label: 'Expenses',
      data: expenses,
      borderColor: '#cf3a64',
      // https://codesandbox.io/s/github/reactchartjs/react-chartjs-2/tree/master/sandboxes/line/area?from-embed=&file=/App.tsx
      fill: true,
      // https://www.digitalocean.com/community/tutorials/css-hex-code-colors-alpha-values
      backgroundColor: '#cf3a6414'
    }
  }, [
    expensesPerPeriod,
    graphIntervalTimeFrame,
    numMonthsProjected,
    numYearsProjected
  ])



  // https://stackoverflow.com/a/64896990/17712310
  // https://stackoverflow.com/a/62601621/17712310
  const triggerGraphChange = useCallback(() => {

    const datesForXAxis = generateDates(graphIntervalTimeFrame, graphIntervalTimeFrame == "months" ? numMonthsProjected : numYearsProjected)

    let datasetsToShow = []

    // XOR - https://stackoverflow.com/a/4540443
    let ignoreCombine = (!showIncomeGraph != !showExpensesGraph) || (!showIncomeGraph && !showExpensesGraph)

    if(showIncomeGraph && (ignoreCombine || !combineIncomeAndExpenses)) {
      const incomeDataset = generateIncomeDataset()
      datasetsToShow.push(incomeDataset)
    }

    if(showExpensesGraph && (ignoreCombine || !combineIncomeAndExpenses)) {
      const expenseDataset = generateExpensesDataset()
      datasetsToShow.push(expenseDataset)
    }

    if(combineIncomeAndExpenses && !ignoreCombine) {
      const incomeDataset = generateIncomeDataset()
      const expenseDataset = generateExpensesDataset()

      let combinedDataset = {
        label: 'Net worth',
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
        data: incomeDataset.data.map((income, i) => income - expenseDataset.data[i]),
        borderColor: '#eb8c34',
        // https://codesandbox.io/s/github/reactchartjs/react-chartjs-2/tree/master/sandboxes/line/area?from-embed=&file=/App.tsx
        fill: true,
        // https://www.digitalocean.com/community/tutorials/css-hex-code-colors-alpha-values
        backgroundColor: '#eb8c3414'
      }

      datasetsToShow = [combinedDataset]
    }


    // calc mortgage data

    const incomeDataset = generateIncomeDataset()
    const expenseDataset = generateExpensesDataset()

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
    let netDataset = incomeDataset.data.map((income, i) => income - expenseDataset.data[i])

    const loanPayPeriod = parseInt(loanPeriod)

    let mortgageData = netDataset.map(net => getBreakdown(loanAmount - (net * percentToPutDown), interestRate / 100, loanPayPeriod))
    console.log(mortgageData)
    const interestPaidLine = {
      label: 'Interest Paid',
      data: mortgageData.map(data => data.interestPaid < 0 ? 0 : data.interestPaid),
      borderColor: '#e0db34',
      // https://codesandbox.io/s/github/reactchartjs/react-chartjs-2/tree/master/sandboxes/line/area?from-embed=&file=/App.tsx
      fill: true,
      // https://www.digitalocean.com/community/tutorials/css-hex-code-colors-alpha-values
      backgroundColor: '#e0db3414'
    }

    datasetsToShow.push(interestPaidLine)


    // https://stackoverflow.com/a/10865042
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/max
    // possible cite - https://stackoverflow.com/a/66625012
    let newYMax = Math.max(...(datasetsToShow.map(dataset => dataset.data)).flat(1))

    // add extra for padding
    newYMax *= 1.5

    // console.log(`new max : ${newYMax}`)

    // console.log(`current max : ${graphOptions.scales.y.max}`)
    // if((newYMax > graphOptions.scales.y.ticks.max) || graphOptions.scales.y.ticks.max == undefined) {
    //   console.log('setting')
    //   // https://stackoverflow.com/a/35553748/17712310
    //   // graphOptions.scales.y.ticks.suggestedMax = newYMax
    //   graphOptions.scales.y.ticks.max = newYMax
    // }


    // calc acceptable interest paid date range
    let acceptableInterestRanges = calcInterestRange(useRelativeMaxInterest ? relativeMaxInterest : maxInterestPaid, interestPaidLine.data, datesForXAxis, mortgageData.map(data => data.total), useRelativeMaxInterest)

    console.log('test')
    console.log(acceptableInterestRanges)

    let acceptableRangesIndexes = acceptableInterestRanges.map(dateRange => {
      return [datesForXAxis.findIndex(date => date == dateRange[0]), datesForXAxis.findIndex(date => date == dateRange[1])]
    })

    let rangeHighlightPlots = generateRangeHighlightData(datesForXAxis.map(date => date.toLocaleDateString()), acceptableRangesIndexes, newYMax)
    datasetsToShow.push(rangeHighlightPlots)



    if(showInterestPaidPerYear){
      // calculate avg interest paid per year

      const interestPaidPerYearLine = {
        label: 'Interest Paid Per Year',
        data: interestPaidLine.data.map(interestPaidTotal => interestPaidTotal / loanPayPeriod),
        borderColor: '#ebf0b9',
        // https://codesandbox.io/s/github/reactchartjs/react-chartjs-2/tree/master/sandboxes/line/area?from-embed=&file=/App.tsx
        fill: true,
        // https://www.digitalocean.com/community/tutorials/css-hex-code-colors-alpha-values
        backgroundColor: '#ebf0b914'
      }

      datasetsToShow.push(interestPaidPerYearLine)
    }

    const data = {
      // https://stackoverflow.com/a/1643468/17712310
      // https://stackoverflow.com/a/18648314/17712310
      // https://www.freecodecamp.org/news/how-to-format-dates-in-javascript/#:~:text=You%20can%20also%20decide%20not%20to%20use%20either
      labels: datesForXAxis.map(date => date.toLocaleDateString()),
      datasets: datasetsToShow
    }

    graphDataSetter(data)

    // update savings per time interval
    avgSavedPerTimeIntervalSetter(calcAvgSavedPerTimeFrame(interestPaidLine.data))
  }, [combineIncomeAndExpenses,
    generateExpensesDataset,
    generateIncomeDataset,
    graphIntervalTimeFrame,
    interestRate,
    loanAmount,
    loanPeriod,
    maxInterestPaid,
    numMonthsProjected,
    numYearsProjected,
    percentToPutDown,
    relativeMaxInterest,
    showExpensesGraph,
    showIncomeGraph,
    showInterestPaidPerYear,
    useRelativeMaxInterest
  ])


  // initially build the graph
  useEffect(() => {
    triggerGraphChange()
  }, [triggerGraphChange])


  // update graph when the specified parameters change
  // https://bobbyhadz.com/blog/react-listen-to-state-change#:~:text=Use%20the%20useEffect%20hook%20to,time%20the%20state%20variables%20change.
  useEffect(() => {
    triggerGraphChange()
  }, [
    expectedIncomeChange,
    numMonthsProjected,
    numYearsProjected,
    graphIntervalTimeFrame,
    showIncomeGraph,
    showExpensesGraph,
    combineIncomeAndExpenses,
    loanPeriod,
    percentToPutDown,
    interestRate,
    showInterestPaidPerYear,
    useRelativeMaxInterest,
    relativeMaxInterest,
    triggerGraphChange
  ])

  
  return (
    <div className={styles.container}>
      <Head>
        <title>Loan Foresight</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* button to open the graph configuration drawer */}
      <Button style={{position: 'absolute', top: 25, right: 25}} variant="transparent" size="xl" color="gray"
        // https://stackoverflow.com/a/59304431/17712310
        onClick={() => setGraphConfigDrawerOpen(!graphConfigDrawerOpen)}
      >
        <GoSettings/>
      </Button>

      {/* graph configuration drawer */}
      <GraphConfigDrawer
        isOpen={graphConfigDrawerOpen}
        isOpenSetter={setGraphConfigDrawerOpen}
        intervalTimeFrame={graphIntervalTimeFrame}
        intervalTimeFrameSetter={setGraphIntervalTimeFrame}
        numMonthsProjected={numMonthsProjected}
        numMonthsProjectedSetter={setNumMonthsProjected}
        numYearsProjected={numYearsProjected}
        numYearsProjectedSetter={setNumYearsProjected}
        showingIncome={showIncomeGraph}
        showingIncomeSetter={showIncomeGraphSetter}
        showingExpenses={showExpensesGraph}
        showingExpensesSetter={showExpensesGraphSetter}
        combineIncomeAndExpenses={combineIncomeAndExpenses}
        combineIncomeAndExpensesSetter={combineIncomeAndExpensesSetter}
        loanPeriod={loanPeriod}
        loanPeriodSetter={loanPeriodSetter}
        loanAmount={loanAmount}
        loanAmountSetter={loanAmountSetter}
        triggerUpdateGraph={triggerGraphChange}
        maxInterestPaid={maxInterestPaid}
        maxInterestPaidSetter={maxInterestPaidSetter}
        percentToPutDown={percentToPutDown}
        percentToPutDownSetter={percentToPutDownSetter}
        interestRate={interestRate}
        interestRateSetter={interestRateSetter}
        showInterestPaidPerYear={showInterestPaidPerYear}
        showInterestPaidPerYearSetter={showInterestPaidPerYearSetter}
        useRelativeMaxInterest={useRelativeMaxInterest}
        useRelativeMaxInterestSetter={usingRelativeMaxInterestSetter}
        relativeMaxInterest={relativeMaxInterest}
        relativeMaxInterestSetter={relativeMaxInterestSetter}
      />



      {/* https://youtu.be/Ge6PQkpa6pA */}
      <div className={styles.mainWrapper} style={{
        width: `${mainWrapperWidth}px`,
        // https://stackoverflow.com/a/30587944/17712310
        marginLeft: graphConfigDrawerOpen ? '5%' : `calc(50% - ${mainWrapperWidth/2}px)`,
        marginRight: 'auto'
      }}>

        <div className="graphInsights"
          style={{
            marginBottom: 25
          }}
        >
          {/* average amount of money saved based on conditions */}
          {/* {
            avgSavedPerTimeInterval &&

            // https://stackoverflow.com/a/16233919
            <Text>Avg saved per {graphIntervalTimeFrame == 'months' ? 'month' : 'year'} : {Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'}).format(avgSavedPerTimeInterval)}</Text>
          } */}
        </div>

        {
          graphData && 

          <div className={styles.graphWrapper}>
            <Line data={graphData} options={graphOptions}/>
          </div>
        }

        <div className="chartParamsInputForm">

          {/* https://blog.logrocket.com/solving-prop-drilling-react-apps/ */}
          <IncomeForm 
            triggerUpdateGraph={triggerGraphChange}
            incomeTypeControl={incomeType} 
            incomeTypeControlSetter={setIncomeType}
            currentNetWorthControl={currNetWorth}
            currentNetWorthControlSetter={setCurrNetWorth}

            salaryForm={<SalaryIncomeForm
              triggerUpdateGraph={triggerGraphChange}
              salaryControl={salary}
              salaryControlSetter={setSalary}
              expectedSalaryChange={expectedIncomeChange}
              expectedSalaryChangeSetter={setExpectedIncomeChange}
              minSalaryChange={minSalaryChange}
              maxSalaryChange={maxSalaryChange}
            />}
            hourlyForm={<HourlyIncomeForm/>}
            />

          {/* https://stackoverflow.com/a/51148917 */}
          <ExpenseForm 
            {...{
              formGranularity,
              formGranularitySetter,
              condensedExpenseInputGranularity,
              condensedExpenseInputGranularitySetter,
              expensesPerPeriod,
              expensesPerPeriodSetter,
              triggerGraphChange
            }}
          />
        </div>

        <div id="footer" style={{
          padding: '25px 0',
          display: 'flex',
          columnGap: '5px'
        }}>
          {/* https://nextjs.org/docs/api-reference/next/link#if-the-child-is-a-tag */}
          <Link href="/releases" legacyBehavior>
            <a id="releases-link">Releases</a>
          </Link>
        </div>
      </div>
    </div>
  )
}
