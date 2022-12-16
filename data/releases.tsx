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
}

export interface ReleaseBugFix {
    title: string
}




const releases: ReleaseSpecs[] = [
    {
        major: 1,
        minor: 0,
        batch: 0,
        beta: false,
        releaseDate: new Date("12/15/2022"),
        features: [
            {
                title: "feature 1"
            }
        ],
        bugFixes: [
            {
                title: "bug fix 1"
            }
        ]
    },

    {
        major: 1,
        minor: 0,
        batch: 1,
        beta: false,
        releaseDate: new Date("12/17/2022"),
        features: [
            {
                title: "feature 1"
            },
            
            {
                title: "feature 2"
            }
        ],
        bugFixes: [
            {
                title: "bug fix 1"
            }
        ]
    }
]


export default releases
