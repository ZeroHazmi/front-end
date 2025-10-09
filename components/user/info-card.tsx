import Image from "next/image"

export function InfoCard() {
  return (
    <div className="bg-[#1e2d7a]/60 backdrop-blur-sm rounded-2xl p-8 lg:p-12 border border-blue-800/30">
      <div className="mb-8">
        {/* <Image
          src="/multiple-devices-showing-e-reporting-interface---p.jpg"
          alt="e-Reporting devices"
          width={500}
          height={300}
          className="w-full h-auto"
        /> */}
      </div>
      <p className="text-white text-center leading-relaxed text-base lg:text-lg">
        Ini adalalah demo sistem e-Reporting yang dibangunkan untuk tujuan pembelajaran dan pameran sahaja. Sistem ini
        tidak digunakan secara rasmi dan sebarang laporan yang dibuat melalui sistem ini
        tidak akan diproses.
      </p>
    </div>
  )
}
