export interface ReleaseSpecs {
    major: number
    minor: number
    batch: number
    beta: boolean

    releaseDate: Date
    features: ReleaseFeature[]
    bugFixes: ReleaseBugFix[]
}



export interface ReleaseFeature {
    title: string
    desc?: string
}

export interface ReleaseBugFix {
    title: string
}


// semantic versioning - https://youtu.be/MdzJuQdjKOE

const releases: ReleaseSpecs[] = [
    {
        major: 1,
        minor: 0,
        batch: 0,
        beta: false,
        releaseDate: new Date("12/19/2022"),
        features: [
            {
                title: "Visualize data with line graphs",
                desc: "The user can visualize things such as income, expenses, and interest paid (on a loan) over time based on the data they provide. The user can also see the range in which they can get a loan based on the filters they have in place (See 'Configure loan options feature below)."
            },

            {
                title: "Forms for income and expenses",
                desc: "The user can input information for their current net worth, current salary, and expected salary changes. The user can also input their current monthly expenses."
            },

            {
                title: "Configure graph options",
                desc: "The user can configure the graph in several different ways. The user can toggle whether they see income and/or expenses on the graph as well as if they want to combine those amounts into a net worth line. The user can select whether the graph forecasts in months or years and can change the range of the forecast either in months or years independently of what the graph is configured to display in (months/years). The user can toggle whether they see interest paid per year. Idk if this option is working for when the graph displays in months. I would have to check that."
            },

            {
                title: "Configure loan options",
                desc: "The user can change the configuration of a loan including the loan amount, payment period, interest rate, and down payment amount. The user can also filter the graph to show applicable time ranges using filters. There is only one filter right now - filter by max interest paid. This may not be working rn, I have to check."
            }
        ],
        bugFixes: []
    },

    {
        major: 1,
        minor: 0,
        batch: 1,
        beta: false,
        releaseDate: new Date("12/20/2022"),
        features: [],
        bugFixes: [
            {
                title: "Align release page feature bullet points to left."
            }
        ]
    },

    {
        major: 1,
        minor: 1,
        batch: 0,
        beta: false,
        releaseDate: new Date("12/20/2022"),
        features: [
            {
                title: "Hotkey shortcut for opening and closing the configuration panel."
            }
        ],
        bugFixes: []
    }
]


export default releases
