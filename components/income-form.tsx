import {Text, Divider, SegmentedControl, TextInput} from '@mantine/core'

import { useState, useEffect } from 'react'

import useForesightState, {incomeTypeType} from '../data/foresight-graph-manager'

// https://www.typescriptlang.org/docs/handbook/2/functions.html
const IncomeForm = ({
    salaryForm,
    hourlyForm
}) => {

    const state = useForesightState()



    const [netWorth, netWorthSetter] = useState(state.config.income.netWorth.toString())


    useEffect(() => {
        state.updateNetWorth(netWorth == '' ? 0 : parseInt(netWorth))
    }, [netWorth])




    
    return (
        <>
            <Text size="xl" weight="bold" style={{marginBottom: 10, color: "#86ad9b"}}>Income</Text>
            <Divider size="sm" style={{marginBottom: 25}}/>


            {/* income type */}

            {/* https://mantine.dev/core/segmented-control/ */}
            <SegmentedControl
                value={state.config.income.incomeType}
                // https://stackoverflow.com/a/37978675/17712310
                onChange={newVal => state.updateIncomeType(newVal as incomeTypeType)}
                data={[
                  // https://mantine.dev/core/segmented-control/#disabled
                {label: 'Hourly', 'value': 'hourly', disabled: true},
                {label: 'Salary', 'value': 'salary'}
                ]}
                sx={{
                marginBottom: 10
                }}
            />

            {/* current net worth */}

            <TextInput
              type='number'
              value={netWorth}
              label='Current net worth'
              onChange={(event) => netWorthSetter(event.currentTarget.value)}
              sx={{
                width: '30%'
              }}
              styles={{ label: {marginBottom: 10}}}
              style={{
                marginBottom: 25
              }}
            />

            {/* income inputs based on income type */}

            {
                state.config.income.incomeType == 'hourly' && hourlyForm
            }

            {
                state.config.income.incomeType == 'salary' && salaryForm
            }
        </>
    )
}

// https://stackoverflow.com/a/52993237/17712310
IncomeForm.displayName = 'IncomeForm'

export default IncomeForm
