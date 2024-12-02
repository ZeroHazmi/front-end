"use client";

import React, { useMemo, useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const colors = [
  '#0088FE', '#00C49F', '#FFBB28', 
  '#FF8042', '#8884D8', '#FF9999'
];

interface DemographicData {
  gender: string;
  age: number;
  reportTypeId: number;
  reportTypeName: string;
  priority: string;
  incidentCount: number;
}

const DemographicsChartComponent = () => {
  const [demographicData, setDemographicData] = useState<DemographicData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [gender, setGender] = useState("All");
  const [minAge, setMinAge] = useState<number | null>(null);
  const [maxAge, setMaxAge] = useState<number | null>(null);
  const [priority, setPriority] = useState("All");
  const [ageRange, setAgeRange] = useState("All");
  const [reportTypeId, setReportTypeId] = useState(1); // Default to first report type

  // Fetch demographic data
  useEffect(() => {
    const fetchDemographicData = async () => {
      try {
        setLoading(true);

        const queryParams = new URLSearchParams({
          gender: gender === "All" ? "" : gender,
          minAge: minAge?.toString() || "",
          maxAge: maxAge?.toString() || "",
          priority: priority === "All" ? "" : priority,
          ageRange,
          reportTypeId: reportTypeId.toString(),
        });

        const response = await fetch(`${process.env.NEXT_PUBLIC_PRAS_API_BASE_URL}incidents/demographic-data?${queryParams}`);
        if (!response.ok) {
          throw new Error("Failed to fetch demographic data");
        }

        const data = await response.json();
        setDemographicData(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Unknown error occurred");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDemographicData();
  }, [gender, minAge, maxAge, priority, ageRange, reportTypeId]);

  // Improved chart data preparation: Aggregate by gender
  const chartData = useMemo(() => {
    const genderAggregation = demographicData.reduce((acc: { [key: string]: number }, item) => {
      acc[item.gender] = (acc[item.gender] || 0) + item.incidentCount;
      return acc;
    }, {});

    return Object.entries(genderAggregation)
      .filter(([gender, _]) => gender !== "") // Optional: filter out empty gender entries
      .map(([name, value]) => ({ name, value }));
  }, [demographicData]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4 bg-white rounded-md shadow">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Incident Demographics by Gender</CardTitle>
        </CardHeader>
        <CardContent>
          {/* [Rest of the component remains the same] */}
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
  );
};

export default DemographicsChartComponent;