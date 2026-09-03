
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Ingredient } from "@/data/types";
import { getTelugu } from "@/data/teluguTranslations";

interface FormulationTableProps {
  name: string;
  ingredients: Ingredient[];
}

const FormulationTable = ({ name, ingredients }: FormulationTableProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center text-lg sm:text-xl lg:text-2xl font-bold">
          {name.toUpperCase()}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 sm:p-6">
        <div className="overflow-x-auto -mx-2 sm:mx-0">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow className="bg-slate-100">
                <TableHead className="text-center font-bold border text-xs sm:text-sm whitespace-nowrap">SL.NO</TableHead>
                <TableHead className="text-center font-bold border text-xs sm:text-sm min-w-[140px] whitespace-nowrap">PARTICULARS (ENGLISH)</TableHead>
                <TableHead className="text-center font-bold border text-xs sm:text-sm min-w-[140px] whitespace-nowrap">PARTICULARS (TELUGU)</TableHead>
                <TableHead className="text-center font-bold border text-xs sm:text-sm whitespace-nowrap">UOM</TableHead>
                <TableHead className="text-center font-bold border text-xs sm:text-sm whitespace-nowrap">QTY</TableHead>
                <TableHead className="text-center font-bold border text-xs sm:text-sm whitespace-nowrap">RATE</TableHead>
                <TableHead className="text-center font-bold border text-xs sm:text-sm whitespace-nowrap">AMOUNT</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ingredients.map((ingredient) => {
                const telugu = getTelugu(ingredient.particulars);
                return (
                <TableRow key={ingredient.slNo}>
                  <TableCell className="text-center border font-medium text-xs sm:text-sm">{ingredient.slNo}</TableCell>
                  <TableCell className="border font-medium text-xs sm:text-sm align-top">{ingredient.particulars}</TableCell>
                  <TableCell className="border font-bold text-xs sm:text-sm align-top">{telugu ?? ""}</TableCell>
                  <TableCell className="text-center border text-xs sm:text-sm">{ingredient.uom}</TableCell>
                  <TableCell className="text-center border text-xs sm:text-sm">{ingredient.qty.toFixed(2)}</TableCell>
                  <TableCell className="text-center border text-xs sm:text-sm">{ingredient.rate ?? 0}</TableCell>
                  <TableCell className="text-center border text-xs sm:text-sm">{(ingredient.amount ?? 0).toFixed(2)}</TableCell>
                </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default FormulationTable;
