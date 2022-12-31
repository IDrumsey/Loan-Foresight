import {TextInput, Space, Text, Slider, NativeSelect} from '@mantine/core'
import {useEffect} from 'react'

import useForesightState from '../../data/foresight-graph-manager'

const SalaryIncomeForm = ({
    minSalaryChange,
    maxSalaryChange
}) => {

    const state = useForesightState()
    
    
    return (
        <>
            {/* https://ui.mantine.dev/category/inputs#currency-input */}
            {/* https://mantine.dev/core/text-input/#controlled */}
            <TextInput
            type='number'
            value={state.config.income.salary == 0 ? '' : state.config.income.salary}
            label='Current Salary'
            onChange={(event) => state.updateSalary(event.currentTarget.value == '' ? 0 : parseInt(event.currentTarget.value))}
            rightSection={incomeCurrencySelector}
            rightSectionWidth={92}
            sx={{
                width: '60%'
            }}
            styles={{ label: {marginBottom: 10}}}
            />
            
            <Space h="xl"/>
            
            <Text size="sm" weight={500} style={{marginBottom: 10}}>Expected Average Annual Salary Change</Text>
            {/* https://mantine.dev/core/slider/ */}
            <Slider
                value={state.config.income.expectedSalaryChangePerYear}
                onChange={state.updateExpectedSalaryChangePerYear}
                styles={{
                    track: {
                    bar: "#fff"
                    }
                }}
                sx={{
                    marginBottom: 50
                }}
                min={-10}
                max={maxSalaryChange}
                marks={[
                    {value: minSalaryChange, label: `${minSalaryChange.toString()}%`},
                    {value: 0, label: '0%'},
                    {value: maxSalaryChange, label: `${maxSalaryChange.toString()}%`}
                ]}
                label={value => `${value}%`}
            />
        </>
    )
}

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

// https://stackoverflow.com/a/52993237/17712310
SalaryIncomeForm.displayName = 'SalaryIncomeForm'

export default SalaryIncomeForm
