import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';

const data = [
  { name: 'Low', incidents: 200 },
  { name: 'Medium', incidents: 300 },
  { name: 'High', incidents: 150 },
  { name: 'Critical', incidents: 50 },
];

const IncidentRateComponent = () => {
  const [timeRange, setTimeRange] = useState('daily');
  const [location, setLocation] = useState('All Locations');
  const [incidentType, setIncidentType] = useState('All Types');

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
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="incidents" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IncidentRateComponent;
