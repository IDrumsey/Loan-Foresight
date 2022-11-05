import {Text, Divider, SegmentedControl, TextInput} from '@mantine/core'

// https://www.typescriptlang.org/docs/handbook/2/functions.html
export default ({
    triggerUpdateGraph,
    incomeTypeControl, 
    incomeTypeControlSetter,
    currentNetWorthControl,
    currentNetWorthControlSetter,

    salaryForm,
    hourlyForm
}) => {
    
    return (
        <>
            <Text size="xl" weight="bold" style={{marginBottom: 10, color: "#86ad9b"}}>Income</Text>
            <Divider size="sm" style={{marginBottom: 25}}/>


            {/* income type */}

            {/* https://mantine.dev/core/segmented-control/ */}
            <SegmentedControl
                value={incomeTypeControl}
                onChange={incomeTypeControlSetter}
                data={[
                {label: 'Hourly', 'value': 'hourly'},
                {label: 'Salary', 'value': 'salary'}
                ]}
                sx={{
                marginBottom: 10
                }}
            />

            {/* current net worth */}

            <TextInput
              type='number'
              value={currentNetWorthControl}
              label='Current net worth'
              onChange={(event) => currentNetWorthControlSetter(event.currentTarget.value)}
              sx={{
                width: '30%'
              }}
              styles={{ label: {marginBottom: 10}}}
              style={{
                marginBottom: 25
              }}
              onBlur={() => {
                triggerUpdateGraph()
              }}
            />

            {/* income inputs based on income type */}

            {
                incomeTypeControl == 'hourly' && hourlyForm
            }

            {
                incomeTypeControl == 'salary' && salaryForm
            }
        </>
    )
}