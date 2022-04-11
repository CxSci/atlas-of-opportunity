import { useCallback, useEffect, useMemo, useState } from 'react'

export const useVictoryTheme = theme => {
  return useMemo(
    () => ({
      line: {
        style: {
          data: {
            stroke: theme.components.Chart.lineColor,
            strokeWidth: 5,
          },
        },
      },
      scatter: {
        style: {
          data: {
            fill: theme.palette.secondary.main,
            stroke: theme.components.Chart.pointBorderColor,
            strokeWidth: 1,
          },
        },
        size: 6,
      },
      chart: {
        width: 500,
        height: 350,
        fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
        padding: {
          left: 50,
          bottom: 50,
        },
      },
      axis: {
        padding: 50,
        style: {
          axis: {
            stroke: theme.components.Chart.axisColor,
          },
          axisLabel: {
            color: theme.components.Chart.axisLabelColor,
            fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
            fontSize: theme.components.Chart.axisFontSize,
          },
          grid: {
            stroke: theme.components.Chart.gridColor,
            strokeDasharray: '10, 5',
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
          },
          ticks: {
            stroke: theme.components.Chart.axisColor,
            size: 10,
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            strokeWidth: 1,
          },
          tickLabels: {
            fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
            color: theme.components.Chart.axisLabelColor,
            padding: 8,
            fontSize: theme.components.Chart.axisFontSize,
          },
        },
      },
      tooltip: {
        style: {
          padding: 5,
        },
        flyoutStyle: {
          fill: theme.palette.secondary.main,
          stroke: theme.components.Chart.pointBorderColor,
        },
      },
    }),
    [theme],
  )
}

export const useClientSize = (ref, width = 600, height = 450, ratio = 0.75) => {
  const [size, setSize] = useState({ width, height })
  const getClientSize = useCallback(() => {
    setSize({
      width: ref.current?.clientWidth || width,
      height: ref.current?.clientWidth * ratio || height,
    })
  }, [ratio, ref, width, height])
  useEffect(() => {
    window.addEventListener('resize', getClientSize)
    getClientSize()
    return () => {
      window.removeEventListener('resize', getClientSize)
    }
  }, [getClientSize])
  return size
}
