import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function InputIC() {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="picture">IC Image</Label>
      <Input id="picture" type="file" />
    </div>
  )
}
