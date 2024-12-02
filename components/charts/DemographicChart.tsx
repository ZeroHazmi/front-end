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

  // Prepare chart data
  const chartData = useMemo(() => {
    const aggregatedData = demographicData.reduce((acc: { [key: string]: number }, item) => {
      const key = `${item.gender}-${item.age}`;
      acc[key] = (acc[key] || 0) + item.incidentCount;
      return acc;
    }, {});

    return Object.entries(aggregatedData).map(([key, value]) => ({
      name: key,
      value,
    }));
  }, [demographicData]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4 bg-white rounded-md shadow">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Demographics Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-6">
            {/* Gender Filter */}
            <Select onValueChange={(value) => setGender(value)} value={gender}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Genders</SelectItem>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>

            {/* Age Range Filter */}
            <Select
              onValueChange={(value) => {
                switch (value) {
                  case "18-25":
                    setMinAge(18);
                    setMaxAge(25);
                    break;
                  case "26-35":
                    setMinAge(26);
                    setMaxAge(35);
                    break;
                  case "36-45":
                    setMinAge(36);
                    setMaxAge(45);
                    break;
                  case "46-60":
                    setMinAge(46);
                    setMaxAge(60);
                    break;
                  case "60+":
                    setMinAge(60);
                    setMaxAge(null);
                    break;
                  default:
                    setMinAge(null);
                    setMaxAge(null);
                }
                setAgeRange(value);
              }}
              value={ageRange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Age Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Ages</SelectItem>
                <SelectItem value="18-25">18-25</SelectItem>
                <SelectItem value="26-35">26-35</SelectItem>
                <SelectItem value="36-45">36-45</SelectItem>
                <SelectItem value="46-60">46-60</SelectItem>
                <SelectItem value="60+">60+</SelectItem>
              </SelectContent>
            </Select>

            {/* Priority Filter */}
            <Select onValueChange={(value) => setPriority(value)} value={priority}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Priorities</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
              </SelectContent>
            </Select>

            {/* Report Type Filter */}
            <Select
              onValueChange={(value) => setReportTypeId(parseInt(value))}
              value={reportTypeId.toString()}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Report Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Theft</SelectItem>
                <SelectItem value="2">Assault</SelectItem>
                {/* Add more report types as needed */}
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
  );
};

export default DemographicsChartComponent;
