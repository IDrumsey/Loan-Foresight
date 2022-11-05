import {Drawer, Text, Divider, Radio, Slider, Group, Checkbox} from '@mantine/core'

export default ({
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
    combineIncomeAndExpensesSetter
}) => {

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
                    marginBottom: 35
                }}
                />
            </Drawer>
        </>
    )
}