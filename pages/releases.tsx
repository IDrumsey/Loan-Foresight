import styles from '../styles/page-styles/_releases.module.scss'

import {Select} from '@mantine/core'

import {format} from 'date-fns'

import releases, {ReleaseSpecs} from '../data/releases'


const ReleasesPage = () => {

    return (
        <>
        <div id={`${styles['releases-wrapper']}`}>
            <div id={`${styles['header']}`}>
                <h1 id={`${styles['page-title']}`}>Releases</h1>

                {/* https://mantine.dev/core/select/#usage */}
                <Select
                    id={`${styles['release-selector']}`}
                    data={releases.map(release => {
                        return {
                            value: buildReleaseTitle(release),
                            label: buildReleaseTitle(release)
                        }
                    })}
                    defaultValue='1.0.0'
                    sx={{
                        marginLeft: 'auto',
                        display: 'flex',
                        alignItems: 'center',
                        width: '120px'
                    }}
                />
            </div>
            <div className={`${styles['horizontal-line']}`}></div>
            <div id={`${styles['releases-list']}`}>
                {
                    releases.map((release, i) => {
                        return <div className={`${styles['release-details']}`} key={i}>
                            
                            <div className={`${styles['release-title']}`}>{buildReleaseTitle(release)}</div>

                            {/* https://date-fns.org/v2.29.3/docs/format */}
                            <div className={`${styles['release-date']}`}>{format(release.releaseDate, "MMMM d, y")}</div>

                            {
                                release.features.length > 0 && <>
                                <h5 className={`${styles['features-title']}`}>Features</h5>
                                <ul className={`${styles['release-features']}`}>
                                    {
                                        release.features.map((feature, j) => {
                                            return <>
                                                <li key={`feature-title-${j}`} className={`${styles['feature-wrapper']}`}>{feature.title}</li>
                                                {
                                                    feature.desc && <p key={`feature-desc-${j}`} className={`${styles['feature-desc']}`}>{feature.desc}</p>
                                                }
                                            </>
                                        })
                                    }
                                </ul>
                                </>
                            }


                            {
                                release.bugFixes.length > 0 && <>
                                <h5 className={`${styles['bug-fixes-title']}`}>Bug Fixes</h5>
                                <ul className={`${styles['release-bug-fixes']}`}>
                                    {
                                        release.bugFixes.map((bugFix, w) => {
                                            return <li key={w} className={`${styles['bug-fix-wrapper']}`}>{bugFix.title}</li>
                                        })
                                    }
                                </ul>
                                </>
                            }

                        </div>
                    })
                }
            </div>
        </div>
        </>
    )
}


export default ReleasesPage


const buildReleaseTitle = (release: ReleaseSpecs) => {
    return `${release.major}.${release.minor}.${release.batch}`
}
