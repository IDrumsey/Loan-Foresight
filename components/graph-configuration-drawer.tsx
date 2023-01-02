import {Drawer, Text, Divider, Radio, Slider, Group, Checkbox, SegmentedControl, TextInput, ScrollArea} from '@mantine/core'
import {useState, useEffect} from 'react'
import useForesightState, { loanPeriodType } from '../data/foresight-graph-manager'

const GraphConfigDrawer = ({
    isOpen,
    isOpenSetter
}) => {

    const [configTab, configTabSetter] = useState('graph')


    const state = useForesightState()




    const [loanAmountTextInputValue, loanAmountTextInputValueSetter] = useState(state.config.income.netWorth.toString())


    useEffect(() => {
        state.updateLoanAmount(loanAmountTextInputValue == '' ? 0 : parseInt(loanAmountTextInputValue))
    }, [loanAmountTextInputValue])




    return (
        <>
            <Drawer
                opened={isOpen}
                onClose={() => isOpenSetter(false)}
                title={
                <Text size="lg" weight="bold">Graph Configuration</Text>
                }
                position="right"
                transitionDuration={225}
                padding={25}
                overlayBlur={0}
                overlayOpacity={.5}
            >
                <Divider size="xs" style={{marginBottom: 40}}/>

                {/* https://mantine.dev/core/segmented-control/#controlled */}
                <SegmentedControl
                    value={configTab}
                    onChange={configTabSetter}
                    fullWidth={true}
                    data={[
                        {value: 'graph', label: 'Graph'},
                        {value: 'loan', label: 'Loan'}
                    ]}
                />



                <ScrollArea sx={{height: "100%"}} scrollbarSize={0}>

                    {
                        configTab == 'graph' && 

                        <>
                        <h4 style={{marginBottom: 15}}>Show</h4>

                        <Group
                            sx={{
                                marginBottom: 25
                            }}
                        >
                            {/* https://mantine.dev/core/checkbox/#controlled */}
                            <Checkbox
                                checked={state.config.graph.showIncomeLine}
                                onChange={e => state.updateShowIncomeLine(e.target.checked)}
                                value="income"
                                label="Income"
                                color="blue"
                                labelPosition="right"
                            />
                            <Checkbox
                                checked={state.config.graph.showExpensesLine}
                                onChange={e => state.updateShowExpensesLine(e.target.checked)}
                                value="expenses"
                                label="Expenses"
                                color="blue"
                                labelPosition="right"
                            />
                        </Group>


                        {
                            state.config.graph.showIncomeLine && state.config.graph.showExpensesLine &&

                            <Checkbox
                                sx={{
                                    marginBottom: 50
                                }}
                                checked={state.config.graph.combineIncomeAndExpenses}
                                onChange={e => state.updateCombineIncomeAndExpenses(e.target.checked)}
                                value="net worth"
                                label="Combine income and expenses"
                                color="blue"
                                labelPosition="right"
                            />
                        }

                        <h4 style={{marginBottom: 5}}>In</h4>

                        {/* https://mantine.dev/core/checkbox/#controlled-checkboxgroup */}
                        <Radio.Group
                        value={state.config.graph.intervalLength == 'month' ? 'months' : 'years'}
                        onChange={(newVal) => state.updateIntervalLength(newVal == 'months' ? 'month' : 'year')}
                        sx={{
                            marginBottom: 10
                        }}
                        size="sm"
                        >
                        <Radio value="months" label="months" styles={{radio: {cursor: 'pointer'}}} transitionDuration={250}/>
                        <Radio value="years" label="years" styles={{radio: {cursor: 'pointer'}}} transitionDuration={250}/>
                        </Radio.Group>

                        <h4 style={{marginBottom: 5}}>For</h4>

                        {/* https://mantine.dev/core/slider/ */}
                        <Text size="sm" weight={500} style={{marginBottom: 10}}>Months in the future</Text>
                        <Slider
                        value={state.config.graph.numMonthsInFutureToProject}
                        onChange={(newNum) => {
                            state.updateNumMonthsInFutureToProject(newNum)
                        }}
                        marks={[
                            {value: 0, label: '0'},
                            {value: 100, label: '100'}
                        ]}
                        min={0}
                        max={100}
                        sx={{
                            marginBottom: 35
                        }}
                        />

                        <Text size="sm" weight={500} style={{marginBottom: 10}}>Years in the future</Text>
                        <Slider
                        // https://stackoverflow.com/a/15762794/17712310
                        value={(state.config.graph.numMonthsInFutureToProject / 12).toFixed(2)}
                        onChange={(newNum) => {
                            state.updateNumMonthsInFutureToProject(newNum * 12)
                        }}
                        marks={[
                            {value: 0, label: '0'},
                            {value: 75, label: '75'}
                        ]}
                        min={0}
                        max={75}
                        sx={{
                            marginBottom: 50
                        }}
                        />

                        <Checkbox
                            sx={{
                                marginBottom: 200
                            }}
                            checked={state.config.graph.showInterestPaidPerInterval}
                            onChange={e => state.updateShowInterestPaidPerInterval(e.target.checked)}
                            value="show interest paid per year"
                            label="Show interest paid per year"
                            color="blue"
                            labelPosition="right"
                        />
                        </>
                    }

                    {
                        configTab == 'loan' && 

                        <>
                        <h4>Loan Period</h4>

                        {/* https://mantine.dev/core/radio/#controlled-radiogroup */}
                        <Radio.Group
                            orientation='horizontal'
                            value={state.config.loan.period.toString()}
                            onChange={newVal => {
                                const newNum = parseInt(newVal)
                                state.updatePeriod(newNum as loanPeriodType)
                            }}
                        >
                            <Radio value='10' label='10' />
                            <Radio value='15' label='15' />
                            <Radio value='30' label='30' />
                        </Radio.Group>

                        {/* loan amount */}
                        <h4>Loan Amount</h4>
                        <TextInput
                            type='number'
                            value={loanAmountTextInputValue}
                            onChange={(event) => loanAmountTextInputValueSetter(event.currentTarget.value)}
                            sx={{
                                width: '50%'
                            }}
                            styles={{ label: {marginBottom: 10}}}
                            style={{
                                marginBottom: 25
                            }}
                        />

                        {/* Max Interest Paid */}
                        <h4>Max Interest Paid</h4>

                        {
                            state.filters.useRelativeMaxTotalInterestPaid ? 

                            <Slider
                                value={state.filters.relativeMaxTotalInterestPaid}
                                onChange={newVal => state.updateRelativeMaxTotalInterestPaid(newVal)}
                                marks={[
                                    {value: 0, label: '0'},
                                    {value: 1, label: '1'}
                                ]}
                                step={0.01}
                                min={0}
                                max={1}
                                sx={{
                                    marginBottom: 35
                                }}
                            />

                            :

                            <TextInput
                                type='number'
                                value={state.filters.absoluteMaxTotalInterestPaid}
                                onChange={(event) => state.updateAbsoluteMaxTotalInterestPaid(parseInt(event.currentTarget.value))}
                                sx={{
                                    width: '50%'
                                }}
                                styles={{ label: {marginBottom: 10}}}
                                style={{
                                    marginBottom: 25
                                }}
                            />
                        }

                        {/* https://mantine.dev/core/checkbox/#controlled */}
                        <Checkbox
                            sx={{
                                marginBottom: 50
                            }}
                            checked={state.filters.useRelativeMaxTotalInterestPaid}
                            onChange={e => state.updateUseRelativeMaxTotalInterestPaid(e.target.checked)}
                            value="useRelativeInterestMax"
                            label="Relative to total loan amount?"
                            color="blue"
                            labelPosition="right"
                        />

                        <h4>Amount to put down from net worth (%)</h4>
                        {/* https://mantine.dev/core/slider/ */}
                        <Slider
                            value={state.config.loan.relativeDownPayment}
                            onChange={newVal => state.updateRelativeDownPayment(newVal)}
                            marks={[
                                {value: 0, label: '0'},
                                {value: 1, label: '1'}
                            ]}
                            step={0.01}
                            min={0}
                            max={1}
                            sx={{
                                marginBottom: 35
                            }}
                        />

                        <h4>Interest Rate (%)</h4>
                        {/* https://mantine.dev/core/slider/ */}
                        <Slider
                            value={state.config.loan.interestRate}
                            onChange={newVal => state.updateInterestRate(newVal)}
                            marks={[
                                {value: 0, label: '0'},
                                {value: 100, label: '100'}
                            ]}
                            step={0.1}
                            min={0}
                            max={100}
                            sx={{
                                marginBottom: 200
                            }}
                        />
                        </>
                    }
                </ScrollArea>
            </Drawer>
        </>
    )
}

// https://stackoverflow.com/a/52993237/17712310
GraphConfigDrawer.displayName = 'GraphConfigDrawer'

export default GraphConfigDrawer
