import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator } from "lucide-react";

interface YieldInputProps {
  currentYield: number;
  baseYield: number;
  onYieldChange: (yieldValue: number) => void;
}

const YieldInput = ({ currentYield, baseYield, onYieldChange }: YieldInputProps) => {
  const handleYieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || baseYield;
    onYieldChange(value);
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 space-y-0">
        {/* Left Side: Title */}
        <div className="w-full sm:w-1/2">
          <CardTitle className="flex items-center text-base sm:text-lg">
            <Calculator className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            Yield Calculator
          </CardTitle>
        </div>

        {/* Right Side: Input */}
        <div className="w-full sm:w-1/2">
          <Label htmlFor="yield" className="mb-1 text-sm block">
            Desired Yield (Litres / Kgs)
          </Label>
          <Input
            id="yield"
            type="number"
            value={currentYield}
            onChange={handleYieldChange}
            min="0.1"
            step="0.1"
            className="text-sm font-medium w-full"
          />
        </div>
      </CardHeader>
      <CardContent />
    </Card>
  );
};

export default YieldInput;
