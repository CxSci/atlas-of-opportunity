import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'

import MetricsContainer from 'components/MetricsContainer'
import SectionNavbar from 'components/SectionNavbar'
import SectionLine from 'components/SectionLine'
import SectionText from 'components/SectionText'
import SectionSimpleBar from 'components/SectionSimpleBar'
import SectionSimpleRange from 'components/SectionSimpleRange'
import SectionStackedArea from 'components/SectionStackedArea'
import { slugify } from 'utils/helpers'

import sectionsData from 'mocked_api_responses/detail_data_example_small_business_support_adelaide.json'
import sectionsLayout from 'mocked_api_responses/detail_layout_example_small_business_support.json'

const componentMappings = {
  text: SectionText,
  simple_bar: SectionSimpleBar,
  simple_range: SectionSimpleRange,
  line: SectionLine,
  stacked_area: SectionStackedArea,
}

const SmallBusinessSupport = () => {
  const { sections } = sectionsLayout
  return (
    <Container sx={{ mt: 3 }}>
      <SectionNavbar sections={sections} />
      {sections.map((section, index) => (
        <Box key={index} sx={{ pt: 5 }} id={slugify(section.title)} data-scrollspy>
          <Typography variant="h4" gutterBottom>
            <strong>{section.title}</strong>
          </Typography>
          <MetricsContainer metrics={section.metrics}>
            {metric => {
              const SectionComponent = componentMappings[metric.type]
              return (
                <Box sx={{ mb: 3 }}>
                  {metric.title && <Typography variant="sectionTitle">{metric.title}</Typography>}
                  {SectionComponent && <SectionComponent layout={metric} data={sectionsData[metric.key]} />}
                </Box>
              )
            }}
          </MetricsContainer>
        </Box>
      ))}
    </Container>
  )
}

export default SmallBusinessSupport
