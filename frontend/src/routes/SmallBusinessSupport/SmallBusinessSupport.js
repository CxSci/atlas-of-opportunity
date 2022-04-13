import React from 'react'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Skeleton from '@mui/material/Skeleton'
import PropTypes from 'prop-types'

import Anchor from 'components/Anchor'
import MetricsContainer from 'components/MetricsContainer'
import SectionLine from 'components/SectionLine'
import SectionNavbar from 'components/SectionNavbar'
import SectionSimpleBar from 'components/SectionSimpleBar'
import SectionSimpleRange from 'components/SectionSimpleRange'
import SectionStackedArea from 'components/SectionStackedArea'
import SectionText from 'components/SectionText'
import Spinner from 'components/Spinner'
import StaticMap from 'components/StaticMap'
import { slugify } from 'utils/helpers'

const componentMappings = {
  text: SectionText,
  simple_bar: SectionSimpleBar,
  simple_range: SectionSimpleRange,
  line: SectionLine,
  stacked_area: SectionStackedArea,
}

const SmallBusinessSupport = ({ sectionsData, sectionsLayout, entryId, geoJSON }) => {
  if (!sectionsLayout) {
    return <Spinner />
  }
  const { sections } = sectionsLayout
  return (
    <Box sx={{ mt: 3 }}>
      <Container>
        <Typography variant="h1" gutterBottom>
          {sectionsData ? sectionsData._atlas_title : <Skeleton />}
        </Typography>
        {geoJSON ? (
          <StaticMap height={400} square={false} geoJSON={geoJSON} areaId={entryId} />
        ) : (
          <Skeleton height={400} />
        )}
      </Container>
      <SectionNavbar sections={sections} />
      <Container>
        {sections.map((section, index) => {
          const sectionId = slugify(section.title)
          return (
            <Box key={index} sx={{ my: 4 }} data-scrollspy={sectionId}>
              <Anchor htmlId={sectionId} />
              <Typography variant="h4" gutterBottom>
                <strong>{section.title}</strong>
              </Typography>
              <MetricsContainer metrics={section.metrics}>
                {metric => {
                  const SectionComponent = componentMappings[metric.type]
                  return (
                    <Box sx={{ mb: 3 }}>
                      {metric.title && <Typography variant="sectionTitle">{metric.title}</Typography>}
                      {SectionComponent && (
                        <SectionComponent layout={metric} data={sectionsData ? sectionsData[metric.key] : null} />
                      )}
                    </Box>
                  )
                }}
              </MetricsContainer>
            </Box>
          )
        })}
      </Container>
    </Box>
  )
}

SmallBusinessSupport.propTypes = {
  sectionsData: PropTypes.object,
  sectionsLayout: PropTypes.object,
}

export default SmallBusinessSupport
