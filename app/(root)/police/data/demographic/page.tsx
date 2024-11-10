import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';

// Sample data for demographics
const data = [
  { name: '18-25', value: 400 },
  { name: '26-35', value: 300 },
  { name: '36-45', value: 200 },
  { name: '46-60', value: 100 },
  { name: '60+', value: 50 },
];

const colors = ['#8884d8', '#82ca9d', '#ffc658', '#d0ed57', '#a4de6c'];

const DemographicsChartComponent = () => {
  const [incidentType, setIncidentType] = useState('All Types');
  const [severity, setSeverity] = useState('All Severities');
  const [location, setLocation] = useState('All Locations');

  return (
    <div className="p-4 bg-white rounded-md shadow">
      <div className="flex gap-4 mb-4">
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

        {/* Severity Filter */}
        <Select onValueChange={(value) => setSeverity(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Low">Low</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="High">High</SelectItem>
            <SelectItem value="Critical">Critical</SelectItem>
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
      </div>

      {/* Pie Chart Component */}
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DemographicsChartComponent;
