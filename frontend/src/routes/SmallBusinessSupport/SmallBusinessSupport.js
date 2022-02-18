import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'

import SectionText from 'components/SectionText'
import SectionSimpleBar from 'components/SectionSimpleBar'

import sectionsData from 'mocked_api_responses/detail_data_example_small_business_support_adelaide.json'
import sectionsLayout from 'mocked_api_responses/detail_layout_example_small_business_support.json'

const componentMappings = {
  text: SectionText,
  simple_bar: SectionSimpleBar,
  line: null
}

const SmallBusinessSupport = () => {
  const { sections } = sectionsLayout
  return (
    <Container sx={{ mt: 3 }}>
      {sections.map((section, index) => (
        <Box key={index} sx={{ mb: 2 }}>
          <Typography variant="h4" gutterBottom>
            <strong>{section.title}</strong>
          </Typography>
          <Box sx={{ columns: { md: 2 }, mb: 2 }}>
            {section.metrics.map((metric, mIndex) => {
              const SectionComponent = componentMappings[metric.type]
              return (
                <Box key={mIndex} sx={{ breakInside: 'avoid', mb: 3 }}>
                  {metric.title && <Typography variant="sectionTitle">{metric.title}</Typography>}
                  {SectionComponent && <SectionComponent layout={metric} data={sectionsData[metric.key]} />}
                </Box>
              )
            })}
          </Box>
        </Box>
      ))}
    </Container>
  )
}

export default SmallBusinessSupport
