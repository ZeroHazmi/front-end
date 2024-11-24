"use client"

import React, { useMemo, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const fullData = [
  { age: '18-25', type: 'Theft', severity: 'Low', location: 'Location 1', value: 100 },
  { age: '18-25', type: 'Assault', severity: 'Medium', location: 'Location 2', value: 50 },
  { age: '26-35', type: 'Theft', severity: 'High', location: 'Location 1', value: 75 },
  { age: '26-35', type: 'Assault', severity: 'Critical', location: 'Location 2', value: 25 },
  { age: '36-45', type: 'Theft', severity: 'Low', location: 'Location 1', value: 60 },
  { age: '36-45', type: 'Assault', severity: 'Medium', location: 'Location 2', value: 40 },
  { age: '46-60', type: 'Theft', severity: 'High', location: 'Location 1', value: 30 },
  { age: '46-60', type: 'Assault', severity: 'Critical', location: 'Location 2', value: 20 },
  { age: '60+', type: 'Theft', severity: 'Low', location: 'Location 1', value: 15 },
  { age: '60+', type: 'Assault', severity: 'Medium', location: 'Location 2', value: 10 },
];

const colors = ['#8884d8', '#82ca9d', '#ffc658', '#d0ed57', '#a4de6c'];

const DemographicsChartComponent = () => {
  const [incidentType, setIncidentType] = useState('All Types');
  const [severity, setSeverity] = useState('All Severities');
  const [location, setLocation] = useState('All Locations');

  const filteredData = useMemo(() => {
    return fullData.filter(item => {
      const typeMatch = incidentType === 'All Types' || item.type === incidentType;
      const severityMatch = severity === 'All Severities' || item.severity === severity;
      const locationMatch = location === 'All Locations' || item.location === location;
      return typeMatch && severityMatch && locationMatch;
    });
  }, [incidentType, severity, location]);

  const chartData = useMemo(() => {
    const aggregatedData = filteredData.reduce((acc: { [key: string]: number }, item) => {
      if (!acc[item.age]) {
        acc[item.age] = 0;
      }
      acc[item.age] += item.value;
      return acc;
    }, {});

    return Object.entries(aggregatedData).map(([age, value]) => ({ name: age, value }));
  }, [filteredData]);

  return (
    <div className="p-4 bg-white rounded-md shadow">
      <div className="flex gap-4 mb-4">
        {/* Incident Type Filter */}
        <Card className="w-full max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle>Demographics Chart</CardTitle>
              </CardHeader>
              <CardContent>
              <div className="flex flex-wrap gap-4 mb-6">
              <Select onValueChange={(value) => setIncidentType(value)} value={incidentType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Incident Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Types">All Types</SelectItem>
                  <SelectItem value="Theft">Theft</SelectItem>
                  <SelectItem value="Assault">Assault</SelectItem>
                </SelectContent>
              </Select>

              <Select onValueChange={(value) => setSeverity(value)} value={severity}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Severities">All Severities</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                </SelectContent>
              </Select>

              <Select onValueChange={(value) => setLocation(value)} value={location}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Locations">All Locations</SelectItem>
                  <SelectItem value="Location 1">Location 1</SelectItem>
                  <SelectItem value="Location 2">Location 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={150}
              fill="#8884d8"
              label={(entry) => `${entry.name}: ${entry.value}`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
    </div>
    </div>
  );
}


export default DemographicsChartComponent
