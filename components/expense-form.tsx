import {Text, Divider, Radio, TextInput} from '@mantine/core'
import CondensedExpenseForm from './expense-forms/condensed-expenses'

import useForesightState from '../data/foresight-graph-manager'

const ExpenseForm = ({}) => {


    const state = useForesightState()

    return (
        <>
            <Text size="xl" weight="bold" style={{marginTop: 50, marginBottom: 10, color: "#b08991"}}>Expenses</Text>
            <Divider size="sm" style={{marginBottom: 25}}/>

            {/* Choose the granularity of how the client inputs expense parameters */}
            <Radio.Group
              value={state.config.expenses.breakdownExpensesByType ? 'granular' : 'combined'}
              onChange={newVal => state.updateBreakdownExpensesByType(newVal == 'granular')}
              sx={{
                marginBottom: 10
              }}
              size="sm"
            >
              <Radio value="combined" label="Just one number is fine" styles={{radio: {cursor: 'pointer'}}} transitionDuration={250}/>
              <Radio value="granular" label="Give me more control" styles={{radio: {cursor: 'pointer'}}} transitionDuration={250} disabled={true} />
            </Radio.Group>
          
          {
            !state.config.expenses.breakdownExpensesByType ? 
            
            <CondensedExpenseForm/>

            :

            <div className="expandedExpenseForm"></div>
          }
        </>
    )
}

export default ExpenseForm
