
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'

interface TrendPoint {
  date: string
  value: number
}

interface TrendAnalysisProps {
  title: string
  data: TrendPoint[]
  unit: string
  referenceRange: { min: number; max: number }
  interpretation: 'normal' | 'borderline' | 'abnormal'
}

export const TrendAnalysis = ({ title, data, unit, referenceRange, interpretation }: TrendAnalysisProps) => {
  const getLineColor = () => {
    switch (interpretation) {
      case 'normal': return '#10b981'
      case 'borderline': return '#f59e0b'
      case 'abnormal': return '#ef4444'
      default: return '#6b7280'
    }
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-rose-100 shadow-lg">
      <h3 className="text-lg font-bold text-gray-800 mb-4">{title}</h3>
      
      <div className="h-64 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis 
              dataKey="date" 
              stroke="#64748b"
              fontSize={12}
            />
            <YAxis 
              stroke="#64748b"
              fontSize={12}
              domain={['dataMin - 1', 'dataMax + 1']}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              formatter={(value: number) => [`${value} ${unit}`, title]}
            />
            
            {/* Reference lines */}
            <ReferenceLine 
              y={referenceRange.min} 
              stroke="#94a3b8" 
              strokeDasharray="5 5" 
              strokeWidth={1}
            />
            <ReferenceLine 
              y={referenceRange.max} 
              stroke="#94a3b8" 
              strokeDasharray="5 5" 
              strokeWidth={1}
            />
            
            {/* Main data line */}
            <Line
              type="monotone"
              dataKey="value"
              stroke={getLineColor()}
              strokeWidth={3}
              dot={{ fill: getLineColor(), strokeWidth: 2, r: 5 }}
              activeDot={{ r: 7, stroke: getLineColor(), strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex items-center justify-between text-sm">
        <div className="text-gray-600">
          Референсные значения: {referenceRange.min} - {referenceRange.max} {unit}
        </div>
        <div className={`px-3 py-1 rounded-full font-medium ${
          interpretation === 'normal' ? 'bg-green-100 text-green-800' :
          interpretation === 'borderline' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {interpretation === 'normal' ? 'В норме' :
           interpretation === 'borderline' ? 'Пограничные' : 'Отклонения'}
        </div>
      </div>
    </div>
  )
}
