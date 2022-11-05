import {Radio, TextInput, NativeSelect} from '@mantine/core'
import {useState} from 'react'

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

const CondensedExpenseForm = ({
    condensedExpenseInputGranularity,
    condensedExpenseInputGranularitySetter,
    expensesPerPeriod,
    expensesPerPeriodSetter,
    triggerGraphChange
}) => {


    return (
        <>
        <Radio.Group
            value={condensedExpenseInputGranularity}
            onChange={condensedExpenseInputGranularitySetter}
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
        value={expensesPerPeriod}
        rightSection={expenseTypeSelector}
        rightSectionWidth={55}
        label={`Expenses per ${condensedExpenseInputGranularity}`}
        onChange={(event) => expensesPerPeriodSetter(event.currentTarget.value)}
        sx={{
            width: '40%'
        }}
        styles={{ label: {marginBottom: 10}}}
        style={{
            marginBottom: 25
        }}
        onBlur={() => {
            triggerGraphChange()
        }}
        />
        </>
    )
}

export default CondensedExpenseForm