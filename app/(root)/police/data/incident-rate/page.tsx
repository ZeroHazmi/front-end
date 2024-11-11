"use client"

import React, { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';

const fullData = [
  { date: '2023-01-01', location: 'Location 1', type: 'Theft', severity: 'Low', incidents: 50 },
  { date: '2023-01-01', location: 'Location 1', type: 'Assault', severity: 'Medium', incidents: 30 },
  { date: '2023-01-01', location: 'Location 2', type: 'Theft', severity: 'High', incidents: 20 },
  { date: '2023-01-01', location: 'Location 2', type: 'Assault', severity: 'Critical', incidents: 10 },
  { date: '2023-01-02', location: 'Location 1', type: 'Theft', severity: 'Medium', incidents: 40 },
  { date: '2023-01-02', location: 'Location 1', type: 'Assault', severity: 'Low', incidents: 25 },
  { date: '2023-01-02', location: 'Location 2', type: 'Theft', severity: 'Critical', incidents: 15 },
  { date: '2023-01-02', location: 'Location 2', type: 'Assault', severity: 'High', incidents: 35 },
];

const IncidentRateComponent = () => {
  const [timeRange, setTimeRange] = useState('daily');
  const [location, setLocation] = useState('All Locations');
  const [incidentType, setIncidentType] = useState('All Types');

    const filteredData = useMemo(() => {
      return fullData.filter(item => {
        const locationMatch = location === 'All Locations' || item.location === location;
        const typeMatch = incidentType === 'All Types' || item.type === incidentType;
        return locationMatch && typeMatch;
      });
    }, [location, incidentType]);

    const chartData = useMemo(() => {
      const severityOrder = ['Low', 'Medium', 'High', 'Critical'];
      const aggregatedData = filteredData.reduce((acc: { [key: string]: number }, item) => {
        if (!acc[item.severity]) {
          acc[item.severity] = 0;
        }
        acc[item.severity] += item.incidents;
        return acc;
      }, {});

      return severityOrder.map(severity => ({
        name: severity,
        incidents: aggregatedData[severity] || 0
      }));
    }, [filteredData]);

  return (
    <div className="p-4 bg-white rounded-md shadow">
      <div className="flex gap-4 mb-4">
        {/* Time Range Filter */}
        <Select onValueChange={(value) => setTimeRange(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Time Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>

        {/* Location Filter */}
        <Select onValueChange={(value) => setLocation(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All Locations">All Locations</SelectItem>
            <SelectItem value="Location 1">Location 1</SelectItem>
            <SelectItem value="Location 2">Location 2</SelectItem>
          </SelectContent>
        </Select>

        {/* Incident Type Filter */}
        <Select onValueChange={(value) => setIncidentType(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Incident Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All Types">All Types</SelectItem>
            <SelectItem value="Theft">Theft</SelectItem>
            <SelectItem value="Assault">Assault</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Chart Component */}
    <Card>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="incidents" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
    </div>
  );
};

export default IncidentRateComponent;
