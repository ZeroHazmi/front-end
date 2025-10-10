"use client"

import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import IncidentRateComponent from '@/components/charts/IncidentRateChart'
// IncidentHeatmap removed — placeholder shown instead.
import DemographicsChartComponent from '@/components/charts/DemographicChart'

const DataPage = () => {
  return (
    <div>
      <div className="mt-52 px-10">
          <Tabs defaultValue="incident-rate" className="space-y-4">
              <TabsList>
                <TabsTrigger value="incident-rate">Incident Rate</TabsTrigger>
                {/* <TabsTrigger value="concentration-map">Crime Concentration</TabsTrigger>
                <TabsTrigger value="demographic">Demographic</TabsTrigger> */}
              </TabsList>
              <TabsContent value="incident-rate" className="space-y-4">
                <IncidentRateComponent />
              </TabsContent>
              {/* <TabsContent value="concentration-map" className="space-y-4">
                <div className="w-full h-[500px] rounded-lg border-2 border-dashed border-sky-400 flex items-center justify-center text-gray-500">
                  Heatmap removed. Reinstall maps to restore this view.
                </div>
              </TabsContent>
              <TabsContent value="demographic" className="space-y-4">
                <DemographicsChartComponent />
              </TabsContent> */}
          </Tabs>
        </div>
    </div>
  )
}

export default DataPage
