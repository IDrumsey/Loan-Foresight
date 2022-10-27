import Head from 'next/head'
import { useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'
import { Chart, Line } from 'react-chartjs-2'
import { SegmentedControl, NativeSelect, TextInput, Slider, Space, Text } from '@mantine/core'

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
const maxSalaryChange = 30


export default function Home() {

  const [incomeType, setIncomeType] = useState('hourly')
  const [expectedIncomeChange, setExpectedIncomeChange] = useState(3)

  // https://ui.mantine.dev/category/inputs#currency-input
  const incomeCurrencySelector = (
    <NativeSelect
      data={[
        {value: 'usd', label: '($) USD'}
      ]}
      styles={{
        input: {
          fontWeight: 500,
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0
        }
      }}
    />
  )

  const getData = () => {
    return {
      labels: ['November', 'December', 'January'],
      datasets: [
        {
          label: 'Red',
          data: [1, 2, 5],
          borderColor: '#32a86f',
          // https://codesandbox.io/s/github/reactchartjs/react-chartjs-2/tree/master/sandboxes/line/area?from-embed=&file=/App.tsx
          fill: true,
          // https://www.digitalocean.com/community/tutorials/css-hex-code-colors-alpha-values
          backgroundColor: '#32a86f14'
        }
      ]
    }
  }

  const [data, setData] = useState()



  useEffect(() => {
    setData(getData())
  }, [])
  
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>



      {/* https://youtu.be/Ge6PQkpa6pA */}
      <div className={styles.mainWrapper}>
        {
          data && 
          <Line data={data} options={lineChartOptions} width={'100%'} style={{marginTop: '50px', marginBottom: '25px'}}/>
        }

        <div className="chartParamsInputForm">
          {/* https://mantine.dev/core/segmented-control/ */}
          <SegmentedControl
            value={incomeType}
            onChange={setIncomeType}
            data={[
              {label: 'Hourly', 'value': 'hourly'},
              {label: 'Salary', 'value': 'salary'}
            ]}
            sx={{
              marginBottom: 25
            }}
          />

          {
            incomeType == 'hourly' ?
            
            <div className="hourlyForm">
              hourly
            </div>

            :

            <div className="salaryForm">
              {/* https://ui.mantine.dev/category/inputs#currency-input */}
              <TextInput
                type='number'
                placeholder={salaryDefault}
                label='Current Salary'
                rightSection={incomeCurrencySelector}
                rightSectionWidth={92}
                sx={{
                  width: '60%'
                }}
                styles={{ label: {marginBottom: 10}}}
              />
              
              <Space h="xl"/>
              
              <Text size="sm" weight={500} style={{marginBottom: 10}}>Expected Average Annual Salary Change</Text>
              <Slider
                value={expectedIncomeChange}
                onChange={setExpectedIncomeChange}
                styles={{
                  track: {
                    bar: "#fff"
                  }
                }}
                min={-10}
                max={25}
                marks={[
                  {value: minSalaryChange, label: `${minSalaryChange.toString()}%`},
                  {value: 0, label: '0%'},
                  {value: maxSalaryChange, label: `${maxSalaryChange.toString()}%`}
                ]}
                label={value => `${value}%`}
              />
            </div>
          }
        </div>
      </div>
      
    </div>
  )
}
