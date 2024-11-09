import React from 'react'
import GoogleMaps from './GoogleMap'
import { MapProvider } from '@/providers/map-provider'
import { MapComponent } from './map'

const MapForm = () => {
  return (
    <div>
      <div className="font-semibold text-2xl max-w-[1200px] text-center text-[300%] p-20">
        Location of Report
      </div>
      
      <div className="w-[1120px] h-[450px] rounded-lg shadow-top-custom-blue border-double border-2 border-sky-500 mb-5">
        <MapProvider>
            <MapComponent/>
        </MapProvider>
      </div>
      
      <div className="flex flex-col md:flex-row md:gap-5 justify-between m-[20px] mx-auto gap-5 items-center text-left mt-2">
        {/* LEFT FORM */}
        <div className="w-[550px] h-[375px] p-2 bg-white border-solid rounded-lg shadow-left-custom-blue">
          <div className="flex flex-wrap w-full h-full items-center justify-center mt-1">
            {/* Location of Incident */}
            <div className="flex flex-col w-full mb-4">
              <label className="leading-[normal] font-semibold">Location of Incident <span className="text-red-500">*</span>:</label>
              <select className="relative w-full h-[35px] bg-white rounded-lg border border-solid p-2 border-[#696969]">
                <option>Please Select...</option>
                {/* Add options as needed */}
              </select>
            </div>
            
            {/* Lot/Room/Office/Building No. */}
            <div className="flex flex-col w-full mb-4">
              <label className="leading-[normal]">Lot / Room / Office / Building No.:</label>
              <input type="text" className="relative w-full h-[35px] bg-white rounded-lg border border-solid p-2 border-[#696969]" />
            </div>
            
            {/* Street Name */}
            <div className="flex flex-col w-full mb-4">
              <label className="leading-[normal]">Street Name <span className="text-red-500">*</span>:</label>
              <input type="text" className="relative w-full h-[35px] bg-white rounded-lg border border-solid p-2 border-[#696969]" />
            </div>

            {/* Park/Place Name */}
            <div className="flex flex-col w-full mb-4">
              <label className="leading-[normal]">Park / Place Name <span className="text-red-500">*</span>:</label>
              <input type="text" className="relative w-full h-[35px] bg-white rounded-lg border border-solid p-2 border-[#696969]" />
            </div>

            {/* Postcode */}
            <div className="flex flex-col w-full mb-4">
              <label className="leading-[normal]">Postcode <span className="text-red-500">*</span>:</label>
              <input type="text" className="relative w-full h-[35px] bg-white rounded-lg border border-solid p-2 border-[#696969]" />
            </div>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="w-[550px] h-[375px] p-2 bg-white border-solid rounded-lg shadow-right-custom-blue">
          <div className="flex flex-wrap w-full h-full items-center justify-center mt-1">
                        {/* City */}
                        <div className="flex flex-col w-full mb-4">
              <label className="leading-[normal]">City <span className="text-red-500">*</span>:</label>
              <input type="text" className="relative w-full h-[35px] bg-white rounded-lg border border-solid p-2 border-[#696969]" />
            </div>

            {/* State */}
            <div className="flex flex-col w-full mb-4">
              <label className="leading-[normal]">State <span className="text-red-500">*</span>:</label>
              <input type="text" className="relative w-full h-[35px] bg-white rounded-lg border border-solid p-2 border-[#696969]" />
            </div>
            {/* Date */}
            <div className="flex flex-col w-full mb-4">
              <label className="leading-[normal]">Date <span className="text-red-500">*</span>:</label>
              <input type="date" className="relative w-full h-[35px] bg-white rounded-lg border border-solid p-2 border-[#696969]" />
            </div>

            {/* Time */}
            <div className="flex flex-col w-full mb-4">
              <label className="leading-[normal]">Time <span className="text-red-500">*</span>:</label>
              <input type="time" className="relative w-full h-[35px] bg-white rounded-lg border border-solid p-2 border-[#696969]" />
            </div>

            {/* Police Report Details */}
            {/* <div className="flex flex-col w-full mb-4">
              <label className="leading-[normal]">Balai Polis Report Submitted <span className="text-red-500">*</span>:</label>
            </div> */}

            {/* Contingent */}
            {/* <div className="flex flex-col w-full mb-4">
              <label className="leading-[normal]">Contingent <span className="text-red-500">*</span>:</label>
              <input type="text" placeholder="KUALA LUMPUR" className="relative w-full h-[35px] bg-white rounded-lg border border-solid p-2 border-[#696969]" />
            </div> */}

            {/* District */}
            {/* <div className="flex flex-col w-full mb-4">
              <label className="leading-[normal]">District <span className="text-red-500">*</span>:</label>
              <input type="text" placeholder="BRICKFIELDS" className="relative w-full h-[35px] bg-white rounded-lg border border-solid p-2 border-[#696969]" />
            </div> */}

            {/* Station */}
            {/* <div className="flex flex-col w-full mb-4">
              <label className="leading-[normal]">Station <span className="text-red-500">*</span>:</label>
              <input type="text" placeholder="TAMAN TUN DR ISMAIL" className="relative w-full h-[35px] bg-white rounded-lg border border-solid p-2 border-[#696969]" />
            </div> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MapForm
