import Head from 'next/head'
import { useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'
import { Chart, Line } from 'react-chartjs-2'
import { SegmentedControl, NativeSelect, TextInput, Slider, Space, Text, Divider, Drawer, Button, Radio } from '@mantine/core'
import { GoSettings } from 'react-icons/go'
import {calcProjectedNets, generateDates} from '../finance-planner'
import IncomeForm from '../components/income-form'
import SalaryIncomeForm from '../components/income-type-forms/salary-income-form'
import HourlyIncomeForm from '../components/income-type-forms/hourly-income-form'
import GraphConfigDrawer from '../components/graph-configuration-drawer'
import ExpenseForm from '../components/expense-form'

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
    }
  }
  }
}



const salaryDefault = 54000
const minSalaryChange = -10
const maxSalaryChange = 100
const mainWrapperWidth = 450


export default function Home() {

  const [graphData, graphDataSetter] = useState()
  const [incomeType, setIncomeType] = useState('hourly')
  const [expectedIncomeChange, setExpectedIncomeChange] = useState(3)
  const [graphConfigDrawerOpen, setGraphConfigDrawerOpen] = useState(false)
  const [numMonthsProjected, setNumMonthsProjected] = useState(12)
  const [numYearsProjected, setNumYearsProjected] = useState(1)
  const [graphIntervalTimeFrame, setGraphIntervalTimeFrame] = useState('months')
  const [salary, setSalary] = useState(salaryDefault.toString())
  const [currNetWorth, setCurrNetWorth] = useState(0)
  const [formGranularity, formGranularitySetter] = useState('combined')
  const [condensedExpenseInputGranularity, condensedExpenseInputGranularitySetter] = useState('month')
  // https://www.google.com/search?q=how+much+expenses+does+the+typical+person+have+percentage+wise&rlz=1C1ONGR_enUS977US977&oq=how+much+expenses+does+the+typical+person+have+percentage+wise&aqs=chrome..69i57j33i160.18844j1j7&sourceid=chrome&ie=UTF-8#:~:text=73%25%20of%20the%20average%20monthly%20income
  const [expensesPerPeriod, expensesPerPeriodSetter] = useState(73)

  const [showIncomeGraph, showIncomeGraphSetter] = useState(true)
  const [showExpensesGraph, showExpensesGraphSetter] = useState(false)
  const [combineIncomeAndExpenses, combineIncomeAndExpensesSetter] = useState(false)

  const generateIncomeDataset = () => {

    // https://dev.to/sanchithasr/7-ways-to-convert-a-string-to-number-in-javascript-4l
    const expectedNets = calcProjectedNets(parseInt(currNetWorth), parseInt(salary), expectedIncomeChange / 100, numMonthsProjected, graphIntervalTimeFrame)

    // console.log(expectedNets)

    return {
      label: 'Red',
      data: expectedNets.map(net => net.expected),
      borderColor: '#32a86f',
      // https://codesandbox.io/s/github/reactchartjs/react-chartjs-2/tree/master/sandboxes/line/area?from-embed=&file=/App.tsx
      fill: true,
      // https://www.digitalocean.com/community/tutorials/css-hex-code-colors-alpha-values
      backgroundColor: '#32a86f14'
    }
  }


  const generateExpensesDataset = () => {

    let expenses = [0]
    const iCap = graphIntervalTimeFrame == "months" ? numMonthsProjected : numYearsProjected

    for(let i = 0; i < iCap; i++) {
      expenses.push((graphIntervalTimeFrame == "months" ? expensesPerPeriod : expensesPerPeriod * 12) * (i + 1))
    }

    return {
      label: 'Red',
      data: expenses,
      borderColor: '#cf3a64',
      // https://codesandbox.io/s/github/reactchartjs/react-chartjs-2/tree/master/sandboxes/line/area?from-embed=&file=/App.tsx
      fill: true,
      // https://www.digitalocean.com/community/tutorials/css-hex-code-colors-alpha-values
      backgroundColor: '#cf3a6414'
    }
  }


  // initially build the graph
  useEffect(() => {
    triggerGraphChange()
  }, [])


  // update graph when the specified parameters change
  // https://bobbyhadz.com/blog/react-listen-to-state-change#:~:text=Use%20the%20useEffect%20hook%20to,time%20the%20state%20variables%20change.
  useEffect(() => {
    triggerGraphChange()
  }, [expectedIncomeChange, numMonthsProjected, numYearsProjected, graphIntervalTimeFrame, showIncomeGraph, showExpensesGraph, combineIncomeAndExpenses])


  const triggerGraphChange = () => {

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
        label: 'Red',
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

    const data = {
      // https://stackoverflow.com/a/1643468/17712310
      // https://stackoverflow.com/a/18648314/17712310
      // https://www.freecodecamp.org/news/how-to-format-dates-in-javascript/#:~:text=You%20can%20also%20decide%20not%20to%20use%20either
      labels: datesForXAxis.map(date => date.toLocaleDateString()),
      datasets: datasetsToShow
    }

    graphDataSetter(data)
  }
  
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
      />



      {/* https://youtu.be/Ge6PQkpa6pA */}
      <div className={styles.mainWrapper} style={{
        width: `${mainWrapperWidth}px`,
        // https://stackoverflow.com/a/30587944/17712310
        marginLeft: graphConfigDrawerOpen ? '5%' : `calc(50% - ${mainWrapperWidth/2}px)`,
        marginRight: 'auto'
      }}>

        {
          graphData && 

          <div className={styles.graphWrapper}>
            <Line data={graphData} options={lineChartOptions}/>
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
      </div>
    </div>
  )
}
