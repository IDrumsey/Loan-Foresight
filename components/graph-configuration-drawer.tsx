import {Drawer, Text, Divider, Radio, Slider, Group, Checkbox, SegmentedControl, TextInput, ScrollArea} from '@mantine/core'
import {useState} from 'react'

const GraphConfigDrawer = ({
    isOpen,
    isOpenSetter,
    intervalTimeFrame,
    intervalTimeFrameSetter,
    numMonthsProjected,
    numMonthsProjectedSetter,
    numYearsProjected,
    numYearsProjectedSetter,
    showingIncome,
    showingIncomeSetter,
    showingExpenses,
    showingExpensesSetter,
    combineIncomeAndExpenses,
    combineIncomeAndExpensesSetter,
    loanPeriod,
    loanPeriodSetter,
    loanAmount,
    loanAmountSetter,
    maxInterestPaid,
    maxInterestPaidSetter,
    percentToPutDown,
    percentToPutDownSetter,
    interestRate,
    interestRateSetter,
    triggerUpdateGraph,
    showInterestPaidPerYear,
    showInterestPaidPerYearSetter,
    useRelativeMaxInterest,
    // https://stackoverflow.com/a/59465373/17712310
    useRelativeMaxInterestSetter: usingRelativeMaxInterestSetter,
    relativeMaxInterest,
    relativeMaxInterestSetter
}) => {

    const [configTab, configTabSetter] = useState('graph')

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
                                checked={showingIncome}
                                onChange={e => showingIncomeSetter(e.target.checked)}
                                value="income"
                                label="Income"
                                color="blue"
                                labelPosition="right"
                            />
                            <Checkbox
                                checked={showingExpenses}
                                onChange={e => showingExpensesSetter(e.target.checked)}
                                value="expenses"
                                label="Expenses"
                                color="blue"
                                labelPosition="right"
                            />
                        </Group>


                        {
                            showingIncome && showingExpenses &&

                            <Checkbox
                                sx={{
                                    marginBottom: 50
                                }}
                                checked={combineIncomeAndExpenses}
                                onChange={e => combineIncomeAndExpensesSetter(e.target.checked)}
                                value="net worth"
                                label="Combine income and expenses"
                                color="blue"
                                labelPosition="right"
                            />
                        }

                        <h4 style={{marginBottom: 5}}>In</h4>

                        {/* https://mantine.dev/core/checkbox/#controlled-checkboxgroup */}
                        <Radio.Group
                        value={intervalTimeFrame}
                        onChange={intervalTimeFrameSetter}
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
                        value={numMonthsProjected}
                        onChange={(newNum) => {
                            numMonthsProjectedSetter(newNum)
                            numYearsProjectedSetter(newNum / 12)
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
                        value={numYearsProjected}
                        onChange={(newNum) => {
                            numYearsProjectedSetter(newNum)
                            numMonthsProjectedSetter(newNum * 12)
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
                            checked={showInterestPaidPerYear}
                            onChange={e => showInterestPaidPerYearSetter(e.target.checked)}
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
                            value={loanPeriod}
                            onChange={loanPeriodSetter}
                        >
                            <Radio value='10' label='10' />
                            <Radio value='15' label='15' />
                            <Radio value='30' label='30' />
                        </Radio.Group>

                        {/* loan amount */}
                        <h4>Loan Amount</h4>
                        <TextInput
                            type='number'
                            value={loanAmount}
                            onChange={(event) => loanAmountSetter(event.currentTarget.value)}
                            sx={{
                                width: '50%'
                            }}
                            styles={{ label: {marginBottom: 10}}}
                            style={{
                                marginBottom: 25
                            }}
                            onBlur={() => {
                                triggerUpdateGraph()
                            }}
                        />

                        {/* Max Interest Paid */}
                        <h4>Max Interest Paid</h4>

                        {
                            useRelativeMaxInterest ? 

                            <Slider
                                value={relativeMaxInterest}
                                onChange={relativeMaxInterestSetter}
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
                                value={maxInterestPaid}
                                onChange={(event) => maxInterestPaidSetter(event.currentTarget.value)}
                                sx={{
                                    width: '50%'
                                }}
                                styles={{ label: {marginBottom: 10}}}
                                style={{
                                    marginBottom: 25
                                }}
                                onBlur={() => {
                                    triggerUpdateGraph()
                                }}
                            />
                        }

                        {/* https://mantine.dev/core/checkbox/#controlled */}
                        <Checkbox
                            sx={{
                                marginBottom: 50
                            }}
                            checked={useRelativeMaxInterest}
                            onChange={e => usingRelativeMaxInterestSetter(e.target.checked)}
                            value="useRelativeInterestMax"
                            label="Relative to total loan amount?"
                            color="blue"
                            labelPosition="right"
                        />

                        <h4>Amount to put down from net worth (%)</h4>
                        {/* https://mantine.dev/core/slider/ */}
                        <Slider
                            value={percentToPutDown}
                            onChange={percentToPutDownSetter}
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
                            value={interestRate}
                            onChange={interestRateSetter}
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
