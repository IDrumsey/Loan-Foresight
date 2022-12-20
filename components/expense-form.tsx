import {Text, Divider, Radio, TextInput} from '@mantine/core'
import CondensedExpenseForm from './expense-forms/condensed-expenses'

const ExpenseForm = ({
    formGranularity,
    formGranularitySetter,
    condensedExpenseInputGranularity,
    condensedExpenseInputGranularitySetter,
    expensesPerPeriod,
    expensesPerPeriodSetter,
    triggerGraphChange
}) => {

    return (
        <>
            <Text size="xl" weight="bold" style={{marginTop: 50, marginBottom: 10, color: "#b08991"}}>Expenses</Text>
            <Divider size="sm" style={{marginBottom: 25}}/>

            {/* Choose the granularity of how the client inputs expense parameters */}
            <Radio.Group
              value={formGranularity}
              onChange={formGranularitySetter}
              sx={{
                marginBottom: 10
              }}
              size="sm"
            >
              <Radio value="combined" label="Just one number is fine" styles={{radio: {cursor: 'pointer'}}} transitionDuration={250}/>
              <Radio value="granular" label="Give me more control" styles={{radio: {cursor: 'pointer'}}} transitionDuration={250} disabled={true} />
            </Radio.Group>
          
          {
            formGranularity == 'combined' ? 
            
            <CondensedExpenseForm
              // https://stackoverflow.com/a/51148917
              {
                ...{
                  condensedExpenseInputGranularity,
                  condensedExpenseInputGranularitySetter,
                  expensesPerPeriod,
                  expensesPerPeriodSetter,
                  triggerGraphChange
                }
              }
            />

            :

            <div className="expandedExpenseForm"></div>
          }
        </>
    )
}

export default ExpenseForm
