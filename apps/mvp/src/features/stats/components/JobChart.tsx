import { StatsData } from '../types'
import { Card } from '@/src/components/ui/card'
import { Bar } from 'react-chartjs-2'
import { BarElement, Chart as ChartJS, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const JobChart = ({ data }: { data: StatsData | undefined }) => {
  return (
    <Card className='w-full h-auto dark:border-[#151046] dark:border-2 dark:bg-gradient-to-b from-[#100c28] to-[#010216]'>
        <Bar data={{
             labels: Object.keys(data?.appliesPerDay),
             datasets: [
                        {
                            label: "Applications per day",
                            data: Object.values(data?.appliesPerDay),
                            backgroundColor: '#677fed',
                            borderRadius: 10,
                            maxBarThickness: 100
                        },
                    ]
            }}/>
    </Card>
  )
}

export default JobChart