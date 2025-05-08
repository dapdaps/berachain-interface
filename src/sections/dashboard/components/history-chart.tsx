'use client'

import { useState, useEffect, useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import dayjs from 'dayjs'
import DropdownSelector from './dropdown-selector'

interface PointHistory {
  timestamp: string
  points: number
}

interface Props {
  history: PointHistory[]
  timeRange: string
}

const UserPointsChart: React.FC<Props> = ({ history,  timeRange }) => {
  
  const filteredData = useMemo(() => {
    const now = dayjs()
    let startDate
    
    switch (timeRange) {
      case 'Last 7 days':
        startDate = now.subtract(7, 'day')
        break
      case 'Last month':
        startDate = now.subtract(1, 'month')
        break
      case 'Last 3 months':
        startDate = now.subtract(3, 'month')
        break
      case 'Last 6 months':
        startDate = now.subtract(6, 'month')
        break
      default:
        startDate = now.subtract(3, 'month')
    }
    
    return history
      .filter(item => dayjs(item.timestamp).isAfter(startDate))
      .map(item => ({
        date: dayjs(item.timestamp).format('DD MMM'),
        points: Number(item.points),
        rawTimestamp: item.timestamp // 保留原始时间戳用于排序
      }))
      .sort((a, b) => dayjs(a.rawTimestamp).valueOf() - dayjs(b.rawTimestamp).valueOf())
  }, [history, timeRange])
  
  // 计算Y轴的最大值，确保图表尺度合适
  const maxPoints = useMemo(() => {
    if (filteredData.length === 0) return 100
    const max = Math.max(...filteredData.map(item => item.points))
    return Math.ceil(max * 1.1) // 增加10%的空间使图表不会紧贴顶部
  }, [filteredData])


  return (
    <div className="w-full">
      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={filteredData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPoints" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFDC50" stopOpacity={1} />
                <stop offset="100%" stopColor="#FFDC50" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }} 
              axisLine={false} 
              tickLine={false}
              interval={Math.ceil(filteredData.length / 15) - 1}
            />
            <YAxis 
              tick={{ fontSize: 12 }} 
              axisLine={false} 
              tickLine={false}
              dx={-5}
              domain={[0, maxPoints]}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)' 
              }}
            />
            <Area
              type="monotone"
              dataKey="points"
              stroke="#000"
              fill="url(#colorPoints)"
              strokeWidth={1}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default UserPointsChart