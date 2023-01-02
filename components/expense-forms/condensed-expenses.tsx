import {Radio, TextInput, NativeSelect} from '@mantine/core'

import { useState, useEffect } from 'react'

import useForesightState, {expenseIntervalLength} from '../../data/foresight-graph-manager'

// https://ui.mantine.dev/category/inputs#currency-input
const expenseTypeSelector = (
<NativeSelect
    data={[
    {value: 'absolute', label: '$'},
    {value: 'relative', label: '%', disabled: true}
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

const CondensedExpenseForm = ({}) => {


    const state = useForesightState()


    const [expensePerMonthTextInputValue, expensePerMonthTextInputValueSetter] = useState(state.config.expenses.expensesPerPeriod.toString())


    useEffect(() => {
        state.updateCondensedExpensesPerPeriod(expensePerMonthTextInputValue == '' ? 0 : parseInt(expensePerMonthTextInputValue))
    }, [expensePerMonthTextInputValue])


    return (
        <>
        <Radio.Group
            value={state.config.expenses.intervalLength}
            onChange={newVal => state.updateCondensedExpensesIntervalLength(newVal as expenseIntervalLength)}
            sx={{
                marginBottom: 10
            }}
            size="sm"
            >
            <Radio value="week" label="week" styles={{radio: {cursor: 'pointer'}}} transitionDuration={250} disabled={true} />
            <Radio value="month" label="month" styles={{radio: {cursor: 'pointer'}}} transitionDuration={250}/>
            <Radio value="year" label="year" styles={{radio: {cursor: 'pointer'}}} transitionDuration={250} disabled={true} />
        </Radio.Group>

        <TextInput
        type='number'
        value={expensePerMonthTextInputValue}
        rightSection={expenseTypeSelector}
        rightSectionWidth={55}
        label={`Expenses per ${state.config.expenses.intervalLength}`}
        onChange={(event) => expensePerMonthTextInputValueSetter(event.currentTarget.value)}
        sx={{
            width: '40%'
        }}
        styles={{ label: {marginBottom: 10}}}
        style={{
            marginBottom: 25
        }}
        />
        </>
    )
}

export default CondensedExpenseForm
