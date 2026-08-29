
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface FormulationHeaderProps {
  name: string;
  description: string;
}

const FormulationHeader = ({ name, description }: FormulationHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 sm:mb-8">
      <Button 
        variant="outline" 
        onClick={() => navigate('/')}
        className="flex items-center w-full sm:w-auto"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </Button>
      
      <div className="text-center flex-1">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-1 sm:mb-2">{name}</h2>
        <p className="text-slate-600 text-sm sm:text-base">{description}</p>
      </div>
      
      <div className="hidden sm:block sm:w-[140px]" />
    </div>
  );
};

export default FormulationHeader;
