"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { addDays, format } from "date-fns";
import { states } from "@/types/constants";
import { toast } from "@/hooks/use-toast";
import { 
  ChartConfig, 
  ChartContainer, 
  ChartLegend, 
  ChartLegendContent, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, ResponsiveContainer, YAxis, Tooltip } from "recharts"

// Define the type for incident data based on the updated API response
interface IncidentData {
  reportTypeId: number;
  reportTypeName: string;
  incidentCount: number;
}

const IncidentRateComponent = () => {
  const [timeRange, setTimeRange] = useState("All Time");
  const [location, setLocation] = useState("All Locations");
  const [selectedReportType, setSelectedReportType] = useState("All Types");
  const [dateFilterType, setDateFilterType] = useState("date");
  const [incidentData, setIncidentData] = useState<IncidentData[]>([]);
  const [reportTypes, setReportTypes] = useState<{id: number, name: string}[]>([]);
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | undefined>(
    {
      from: addDays(new Date(), -30),
      to: new Date(),
    }
  );

  async function fetchReportType() {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_PRAS_API_BASE_URL}reporttype`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const data = await response.json();
        setReportTypes(data);
      } else {
        throw new Error("Failed to fetch report types");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch report types",
        variant: "destructive",
      });
    }
  }

  const fetchIncidentData = async () => {
    try {
      const params = new URLSearchParams();
      if (timeRange !== "All Time") params.append("timeRange", timeRange);
      if (location !== "All Locations") params.append("state", location);
      if (selectedReportType !== "All Types") params.append("reportTypeId", selectedReportType);
      params.append("dateFilterType", dateFilterType);
      if (timeRange === "Custom" && dateRange?.from && dateRange?.to) {
        params.append("startDate", format(dateRange.from, "yyyy-MM-dd"));
        params.append("endDate", format(dateRange.to, "yyyy-MM-dd"));
      }

      const url = `${process.env.NEXT_PUBLIC_PRAS_API_BASE_URL}incident/incident-rates?${params.toString()}`;
      const response = await fetch(url);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to fetch incident data");
      }

      const data = await response.json();
      setIncidentData(Array.isArray(data) ? data : []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch incident data",
        variant: "destructive",
      });
      setIncidentData([]);
    }
  };

  useEffect(() => {
    fetchReportType();
  }, []);

  // Prepare chart data
  const chartData = incidentData.map((item) => ({
    name: item.reportTypeName,
    value: item.incidentCount,
  }));

  return (
    <div className="p-4 bg-white rounded-md shadow">
      <div className="flex flex-wrap gap-4 mb-4">
        <Select onValueChange={(value) => setTimeRange(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Time Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All Time">All Time</SelectItem>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="Custom">Custom Range</SelectItem>
          </SelectContent>
        </Select>

        {timeRange === "Custom" && (
          <DatePickerWithRange dateRange={dateRange} onDateRangeChange={setDateRange} />
        )}

        <Select onValueChange={(value) => setLocation(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All Locations">All Locations</SelectItem>
            {Object.values(states).map((state) => (
              <SelectItem key={state} value={state}>
                {state}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={(value) => setSelectedReportType(value)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Report Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All Types">All Report Types</SelectItem>
            {reportTypes.map((type) => (
              <SelectItem key={type.id} value={type.id.toString()}>
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={(value) => setDateFilterType(value)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Date of Incident</SelectItem>
            <SelectItem value="submissionDate">Date of Submission</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={fetchIncidentData}>Apply Filters</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Incident Rates</CardTitle>
          <CardDescription>Data for {timeRange}</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="reportTypeName"
                angle={-45}
                textAnchor="end"
                height={70}
                interval={0}
                tick={{ fontSize: 12 }}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="reportTypeName" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default IncidentRateComponent;