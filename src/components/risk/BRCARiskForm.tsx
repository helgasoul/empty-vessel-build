
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Dna } from "lucide-react";
import { useBRCARisk } from './brca/useBRCARisk';
import BRCAWarning from './brca/BRCAWarning';
import BRCAPersonalInfo from './brca/BRCAPersonalInfo';
import BRCAGeneticMutations from './brca/BRCAGeneticMutations';
import BRCAFamilyHistory from './brca/BRCAFamilyHistory';

interface BRCARiskFormProps {
  onComplete?: () => void;
}

const BRCARiskForm: React.FC<BRCARiskFormProps> = ({ onComplete }) => {
  const { form, isLoading, onSubmit } = useBRCARisk(onComplete);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Dna className="w-5 h-5 text-purple-600" />
          <span>Оценка риска BRCA (наследственный рак)</span>
        </CardTitle>
        <CardDescription>
          Оценка генетического риска развития рака молочной железы и яичников
        </CardDescription>
      </CardHeader>
      <CardContent>
        <BRCAWarning />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <BRCAPersonalInfo control={form.control} />
            <BRCAGeneticMutations control={form.control} />
            <BRCAFamilyHistory control={form.control} />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Расчет...' : 'Рассчитать риск BRCA'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default BRCARiskForm;
